-- KMA för bygg: Export & delning
-- Delningslänkar med snapshot (endast valda flikar), inbjudningar och mottagaråtgärder.
-- Kör i Supabase SQL Editor efter 030_flik31_distribution_signering.sql.
-- Kräver pgcrypto för lösenordshash (bcrypt).

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Snapshot-baserad delning: mottagare får aldrig live-läsning via RLS på övriga tabeller.
create table if not exists public.project_shares (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  token text not null unique,
  title text,
  flik_nrs integer[] not null default '{}',
  -- Behörigheter för mottagare av denna länk
  can_read boolean not null default true,
  can_sign boolean not null default false,
  can_approve boolean not null default false,
  password_hash text,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  -- Endast valda flikars data – skapas vid delning
  snapshot jsonb not null default '{}'::jsonb,
  project_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_shares_project_id_idx on public.project_shares (project_id);
create index if not exists project_shares_user_id_idx on public.project_shares (user_id);
create index if not exists project_shares_token_idx on public.project_shares (token);
create index if not exists project_shares_expires_at_idx on public.project_shares (expires_at);

create table if not exists public.project_share_invites (
  id uuid primary key default gen_random_uuid(),
  share_id uuid not null references public.project_shares (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  recipient_name text,
  recipient_email text not null,
  -- read | sign | approve
  permission text not null default 'read'
    check (permission in ('read', 'sign', 'approve')),
  -- pending | sent | opened | signed | approved | revoked
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'opened', 'signed', 'approved', 'revoked')),
  message text,
  sent_at timestamptz,
  opened_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_share_invites_share_id_idx on public.project_share_invites (share_id);
create index if not exists project_share_invites_project_id_idx on public.project_share_invites (project_id);
create index if not exists project_share_invites_user_id_idx on public.project_share_invites (user_id);

create table if not exists public.project_share_actions (
  id uuid primary key default gen_random_uuid(),
  share_id uuid not null references public.project_shares (id) on delete cascade,
  invite_id uuid references public.project_share_invites (id) on delete set null,
  -- sign | approve
  action text not null check (action in ('sign', 'approve')),
  actor_name text not null,
  actor_email text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists project_share_actions_share_id_idx on public.project_share_actions (share_id);

alter table public.project_shares enable row level security;
alter table public.project_share_invites enable row level security;
alter table public.project_share_actions enable row level security;

-- Ägare: full CRUD på egna shares
create policy "Users can select own project shares"
  on public.project_shares for select
  using (auth.uid() = user_id);

create policy "Users can insert own project shares"
  on public.project_shares for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.user_id = auth.uid()
        and p.company_id = company_id
    )
    and exists (
      select 1 from public.companies c
      where c.id = company_id and c.user_id = auth.uid()
    )
  );

create policy "Users can update own project shares"
  on public.project_shares for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own project shares"
  on public.project_shares for delete
  using (auth.uid() = user_id);

create policy "Users can select own share invites"
  on public.project_share_invites for select
  using (auth.uid() = user_id);

create policy "Users can insert own share invites"
  on public.project_share_invites for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.project_shares s
      where s.id = share_id and s.user_id = auth.uid()
    )
  );

create policy "Users can update own share invites"
  on public.project_share_invites for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own share invites"
  on public.project_share_invites for delete
  using (auth.uid() = user_id);

-- Actions: ägare kan läsa; skrivning sker via RPC (security definer)
create policy "Users can select own share actions"
  on public.project_share_actions for select
  using (
    exists (
      select 1 from public.project_shares s
      where s.id = share_id and s.user_id = auth.uid()
    )
  );

-- Publik öppning av delningslänk: returnerar endast snapshot för giltig token
create or replace function public.open_project_share(p_token text, p_password text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.project_shares%rowtype;
  actions jsonb;
begin
  if p_token is null or length(trim(p_token)) = 0 then
    return jsonb_build_object('ok', false, 'error', 'Ogiltig länk');
  end if;

  select * into s from public.project_shares where token = trim(p_token);
  if not found then
    return jsonb_build_object('ok', false, 'error', 'Länken hittades inte');
  end if;

  if s.revoked_at is not null then
    return jsonb_build_object('ok', false, 'error', 'Länken är återkallad');
  end if;

  if s.expires_at < now() then
    return jsonb_build_object('ok', false, 'error', 'Länken har gått ut');
  end if;

  if not s.can_read then
    return jsonb_build_object('ok', false, 'error', 'Länken saknar läsbehörighet');
  end if;

  if s.password_hash is not null then
    if p_password is null or p_password = '' then
      return jsonb_build_object('ok', false, 'error', 'password_required', 'needs_password', true);
    end if;
    if s.password_hash <> extensions.crypt(p_password, s.password_hash) then
      return jsonb_build_object('ok', false, 'error', 'Fel lösenord', 'needs_password', true);
    end if;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'action', a.action,
    'actor_name', a.actor_name,
    'actor_email', a.actor_email,
    'note', a.note,
    'created_at', a.created_at
  ) order by a.created_at), '[]'::jsonb)
  into actions
  from public.project_share_actions a
  where a.share_id = s.id;

  return jsonb_build_object(
    'ok', true,
    'share', jsonb_build_object(
      'id', s.id,
      'title', s.title,
      'project_label', s.project_label,
      'flik_nrs', to_jsonb(s.flik_nrs),
      'can_read', s.can_read,
      'can_sign', s.can_sign,
      'can_approve', s.can_approve,
      'expires_at', s.expires_at,
      'snapshot', s.snapshot,
      'actions', actions
    )
  );
end;
$$;

revoke all on function public.open_project_share(text, text) from public;
grant execute on function public.open_project_share(text, text) to anon, authenticated;

-- Signera / godkänn via token (skriver endast till share_actions)
create or replace function public.submit_project_share_action(
  p_token text,
  p_password text,
  p_action text,
  p_actor_name text,
  p_actor_email text default null,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.project_shares%rowtype;
begin
  if p_action not in ('sign', 'approve') then
    return jsonb_build_object('ok', false, 'error', 'Ogiltig åtgärd');
  end if;

  if p_actor_name is null or length(trim(p_actor_name)) = 0 then
    return jsonb_build_object('ok', false, 'error', 'Namn krävs');
  end if;

  select * into s from public.project_shares where token = trim(p_token);
  if not found then
    return jsonb_build_object('ok', false, 'error', 'Länken hittades inte');
  end if;

  if s.revoked_at is not null or s.expires_at < now() then
    return jsonb_build_object('ok', false, 'error', 'Länken är inte giltig');
  end if;

  if s.password_hash is not null then
    if p_password is null or s.password_hash <> extensions.crypt(p_password, s.password_hash) then
      return jsonb_build_object('ok', false, 'error', 'Fel lösenord');
    end if;
  end if;

  if p_action = 'sign' and not s.can_sign then
    return jsonb_build_object('ok', false, 'error', 'Signering tillåts inte');
  end if;

  if p_action = 'approve' and not s.can_approve then
    return jsonb_build_object('ok', false, 'error', 'Godkännande tillåts inte');
  end if;

  insert into public.project_share_actions (share_id, action, actor_name, actor_email, note)
  values (s.id, p_action, trim(p_actor_name), nullif(trim(coalesce(p_actor_email, '')), ''), nullif(trim(coalesce(p_note, '')), ''));

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.submit_project_share_action(text, text, text, text, text, text) from public;
grant execute on function public.submit_project_share_action(text, text, text, text, text, text) to anon, authenticated;

-- Hash lösenord server-side vid insert via helper (anropas från klient med plain → RPC)
create or replace function public.hash_share_password(p_password text)
returns text
language sql
security definer
set search_path = public
as $$
  select case
    when p_password is null or length(trim(p_password)) = 0 then null
    else extensions.crypt(trim(p_password), extensions.gen_salt('bf'))
  end;
$$;

revoke all on function public.hash_share_password(text) from public;
grant execute on function public.hash_share_password(text) to authenticated;
