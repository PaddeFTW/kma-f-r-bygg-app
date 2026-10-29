-- KMA för bygg: Projektstart Flik 1 (utökad projektbeskrivning) + Flik 2 (roller och ansvar)
-- Kör i Supabase SQL Editor efter 001_companies_projects.sql.

-- Flik 1: utöka projects med fält enligt underlaget
alter table public.projects
  add column if not exists directions text,
  add column if not exists contact_info text,
  add column if not exists client_org_number text,
  add column if not exists client_address text,
  add column if not exists client_postal_code text,
  add column if not exists client_city text,
  add column if not exists client_phone text,
  add column if not exists client_email text,
  add column if not exists client_info text,
  add column if not exists contractor_org_number text,
  add column if not exists contractor_address text,
  add column if not exists contractor_postal_code text,
  add column if not exists contractor_city text,
  add column if not exists contractor_project_manager text,
  add column if not exists contractor_project_manager_phone text,
  add column if not exists contractor_site_manager text,
  add column if not exists contractor_site_manager_phone text,
  add column if not exists contractor_info text;

-- Flik 2: roller och ansvar per projekt
create table if not exists public.project_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  role_title text not null,
  name text not null,
  phone text,
  email text,
  responsibility_area text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_roles_project_id_idx on public.project_roles (project_id);
create index if not exists project_roles_company_id_idx on public.project_roles (company_id);
create index if not exists project_roles_user_id_idx on public.project_roles (user_id);

alter table public.project_roles enable row level security;

create policy "Users can select own project roles"
  on public.project_roles for select
  using (auth.uid() = user_id);

create policy "Users can insert own project roles"
  on public.project_roles for insert
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

create policy "Users can update own project roles"
  on public.project_roles for update
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

create policy "Users can delete own project roles"
  on public.project_roles for delete
  using (auth.uid() = user_id);
