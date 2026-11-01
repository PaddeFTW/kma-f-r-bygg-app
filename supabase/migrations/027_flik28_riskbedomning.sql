-- KMA för bygg: Flik 28 Riskbedömning + Lagar
-- Riskmatris + handlingsplan baserad på AFS (underlag flikar-22-31).
-- Kör i Supabase SQL Editor efter 026_flik27_uppfoljning_miljo.sql.

create table if not exists public.riskbedomningar (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Signering enligt Flik 28
  upprattare text,
  vd text,
  arbetstagarrepresentant text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists riskbedomningar_project_id_idx on public.riskbedomningar (project_id);
create index if not exists riskbedomningar_company_id_idx on public.riskbedomningar (company_id);
create index if not exists riskbedomningar_user_id_idx on public.riskbedomningar (user_id);

alter table public.riskbedomningar enable row level security;

create policy "Users can select own riskbedomningar"
  on public.riskbedomningar for select
  using (auth.uid() = user_id);

create policy "Users can insert own riskbedomningar"
  on public.riskbedomningar for insert
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

create policy "Users can update own riskbedomningar"
  on public.riskbedomningar for update
  using (auth.uid() = user_id)
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

create policy "Users can delete own riskbedomningar"
  on public.riskbedomningar for delete
  using (auth.uid() = user_id);

-- Riskmatris: AFS-nummer + titel, Ja/Nej, Låg/Medel/Hög, Ansvarig, Handlingsplan nr, Datum
create table if not exists public.riskbedomning_afs (
  id uuid primary key default gen_random_uuid(),
  riskbedomning_id uuid not null references public.riskbedomningar (id) on delete cascade,
  sort_order integer not null default 0,
  afs_nummer text,
  titel text,
  -- ja | nej
  tillamplig text,
  -- lag | medel | hog
  riskniva text,
  ansvarig text,
  handlingsplan_nr text,
  datum date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists riskbedomning_afs_riskbedomning_id_idx
  on public.riskbedomning_afs (riskbedomning_id);

alter table public.riskbedomning_afs enable row level security;

create policy "Users can select own riskbedomning afs"
  on public.riskbedomning_afs for select
  using (
    exists (
      select 1 from public.riskbedomningar r
      where r.id = riskbedomning_id and r.user_id = auth.uid()
    )
  );

create policy "Users can insert own riskbedomning afs"
  on public.riskbedomning_afs for insert
  with check (
    exists (
      select 1 from public.riskbedomningar r
      where r.id = riskbedomning_id and r.user_id = auth.uid()
    )
  );

create policy "Users can update own riskbedomning afs"
  on public.riskbedomning_afs for update
  using (
    exists (
      select 1 from public.riskbedomningar r
      where r.id = riskbedomning_id and r.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.riskbedomningar r
      where r.id = riskbedomning_id and r.user_id = auth.uid()
    )
  );

create policy "Users can delete own riskbedomning afs"
  on public.riskbedomning_afs for delete
  using (
    exists (
      select 1 from public.riskbedomningar r
      where r.id = riskbedomning_id and r.user_id = auth.uid()
    )
  );

-- Handlingsplan: Härleds från risk AFS, Åtgärd, Ansvarig, Klart datum
create table if not exists public.riskbedomning_handlingsplan (
  id uuid primary key default gen_random_uuid(),
  riskbedomning_id uuid not null references public.riskbedomningar (id) on delete cascade,
  sort_order integer not null default 0,
  fran_afs text,
  atgard text,
  ansvarig text,
  klart_datum date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists riskbedomning_handlingsplan_riskbedomning_id_idx
  on public.riskbedomning_handlingsplan (riskbedomning_id);

alter table public.riskbedomning_handlingsplan enable row level security;

create policy "Users can select own riskbedomning handlingsplan"
  on public.riskbedomning_handlingsplan for select
  using (
    exists (
      select 1 from public.riskbedomningar r
      where r.id = riskbedomning_id and r.user_id = auth.uid()
    )
  );

create policy "Users can insert own riskbedomning handlingsplan"
  on public.riskbedomning_handlingsplan for insert
  with check (
    exists (
      select 1 from public.riskbedomningar r
      where r.id = riskbedomning_id and r.user_id = auth.uid()
    )
  );

create policy "Users can update own riskbedomning handlingsplan"
  on public.riskbedomning_handlingsplan for update
  using (
    exists (
      select 1 from public.riskbedomningar r
      where r.id = riskbedomning_id and r.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.riskbedomningar r
      where r.id = riskbedomning_id and r.user_id = auth.uid()
    )
  );

create policy "Users can delete own riskbedomning handlingsplan"
  on public.riskbedomning_handlingsplan for delete
  using (
    exists (
      select 1 from public.riskbedomningar r
      where r.id = riskbedomning_id and r.user_id = auth.uid()
    )
  );
