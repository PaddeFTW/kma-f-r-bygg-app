-- KMA för bygg: Flik 17 Säkerhetsdatablad
-- Lista över farliga kemikalier (underlag flikar-17-21).
-- Kör i Supabase SQL Editor efter 015_flik16_avvikelse_ata.sql.

create table if not exists public.sakerhetsdatablad (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Fält enligt Flik 17
  produkt text not null,
  sakerhetsdatablad boolean,
  ansvarig text,
  datum date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sakerhetsdatablad_project_id_idx on public.sakerhetsdatablad (project_id);
create index if not exists sakerhetsdatablad_company_id_idx on public.sakerhetsdatablad (company_id);
create index if not exists sakerhetsdatablad_user_id_idx on public.sakerhetsdatablad (user_id);

alter table public.sakerhetsdatablad enable row level security;

create policy "Users can select own sakerhetsdatablad"
  on public.sakerhetsdatablad for select
  using (auth.uid() = user_id);

create policy "Users can insert own sakerhetsdatablad"
  on public.sakerhetsdatablad for insert
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

create policy "Users can update own sakerhetsdatablad"
  on public.sakerhetsdatablad for update
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

create policy "Users can delete own sakerhetsdatablad"
  on public.sakerhetsdatablad for delete
  using (auth.uid() = user_id);
