-- KMA för bygg: Flik 3 Beställarens organisation + Flik 4 Underleverantörer
-- Kör i Supabase SQL Editor efter 002_projektstart_flik1_2.sql.

-- Flik 3: en beställarorganisation per projekt
create table if not exists public.project_clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null unique references public.projects (id) on delete cascade,
  ceo_name text,
  contact_name text,
  address text,
  postal_code text,
  city text,
  phone text,
  email text,
  website text,
  project_manager text,
  quality_manager text,
  environmental_manager text,
  work_environment_manager text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_clients_company_id_idx on public.project_clients (company_id);
create index if not exists project_clients_user_id_idx on public.project_clients (user_id);

alter table public.project_clients enable row level security;

create policy "Users can select own project clients"
  on public.project_clients for select
  using (auth.uid() = user_id);

create policy "Users can insert own project clients"
  on public.project_clients for insert
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

create policy "Users can update own project clients"
  on public.project_clients for update
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

create policy "Users can delete own project clients"
  on public.project_clients for delete
  using (auth.uid() = user_id);

-- Flik 4: flera underleverantörer per projekt
create table if not exists public.project_subcontractors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  ceo_name text,
  contact_name text,
  address text,
  postal_code text,
  city text,
  phone text,
  email text,
  website text,
  project_manager text,
  quality_manager text,
  environmental_manager text,
  work_environment_manager text,
  purchasing_manager text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_subcontractors_project_id_idx on public.project_subcontractors (project_id);
create index if not exists project_subcontractors_company_id_idx on public.project_subcontractors (company_id);
create index if not exists project_subcontractors_user_id_idx on public.project_subcontractors (user_id);

alter table public.project_subcontractors enable row level security;

create policy "Users can select own project subcontractors"
  on public.project_subcontractors for select
  using (auth.uid() = user_id);

create policy "Users can insert own project subcontractors"
  on public.project_subcontractors for insert
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

create policy "Users can update own project subcontractors"
  on public.project_subcontractors for update
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

create policy "Users can delete own project subcontractors"
  on public.project_subcontractors for delete
  using (auth.uid() = user_id);
