-- KMA för bygg: Flik 7 Arbetsmiljöplan
-- Kör i Supabase SQL Editor efter 005_flik6_miljoplan.sql.

create table if not exists public.arbetsmiljoplaner (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Avsnitt enligt Flik 7
  arbetsmiljopolicy text,
  uppfoljning_skyddsronder text,
  -- Ordnings- och skyddsregler (checklista enligt underlaget)
  regel_skyddsutrustning boolean not null default false,
  regel_heta_arbeten boolean not null default false,
  regel_tillfallig_el boolean not null default false,
  regel_buller boolean not null default false,
  regel_droger boolean not null default false,
  ordningsregler_anteckningar text,
  -- Samordning med underentreprenörer
  samordning_ue text,
  -- Hänvisningar (anteckningar; full modul kommer i Flik 21 / 28)
  skyddsrond_anteckningar text,
  riskbedomning_anteckningar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists arbetsmiljoplaner_project_id_idx on public.arbetsmiljoplaner (project_id);
create index if not exists arbetsmiljoplaner_company_id_idx on public.arbetsmiljoplaner (company_id);
create index if not exists arbetsmiljoplaner_user_id_idx on public.arbetsmiljoplaner (user_id);

alter table public.arbetsmiljoplaner enable row level security;

create policy "Users can select own arbetsmiljoplaner"
  on public.arbetsmiljoplaner for select
  using (auth.uid() = user_id);

create policy "Users can insert own arbetsmiljoplaner"
  on public.arbetsmiljoplaner for insert
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

create policy "Users can update own arbetsmiljoplaner"
  on public.arbetsmiljoplaner for update
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

create policy "Users can delete own arbetsmiljoplaner"
  on public.arbetsmiljoplaner for delete
  using (auth.uid() = user_id);
