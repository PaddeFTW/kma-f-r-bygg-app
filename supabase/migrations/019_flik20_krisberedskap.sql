-- KMA för bygg: Flik 20 Krisberedskap
-- Handlingsplan vid kris/olycka (underlag flikar-17-21).
-- Kör i Supabase SQL Editor efter 018_flik19_anhoriglista.sql.

create table if not exists public.krisberedskap (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Innehåll enligt Flik 20
  exempel_handelser text,
  omedelbara_atgarder text,
  krisgrupp text,
  viktiga_telefonnummer text,
  anmalan_arbetsmiljoverket text,
  uppfoljning text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists krisberedskap_project_id_idx on public.krisberedskap (project_id);
create index if not exists krisberedskap_company_id_idx on public.krisberedskap (company_id);
create index if not exists krisberedskap_user_id_idx on public.krisberedskap (user_id);

alter table public.krisberedskap enable row level security;

create policy "Users can select own krisberedskap"
  on public.krisberedskap for select
  using (auth.uid() = user_id);

create policy "Users can insert own krisberedskap"
  on public.krisberedskap for insert
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

create policy "Users can update own krisberedskap"
  on public.krisberedskap for update
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

create policy "Users can delete own krisberedskap"
  on public.krisberedskap for delete
  using (auth.uid() = user_id);
