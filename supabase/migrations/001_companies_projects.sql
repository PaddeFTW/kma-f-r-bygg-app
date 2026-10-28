-- KMA för bygg: companies + projects (RLS)
-- Kör i Supabase SQL Editor (eller via CLI).

-- Företagskonto: en användare har högst ett företag
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null,
  org_number text,
  address text,
  postal_code text,
  city text,
  ceo_name text,
  phone text,
  email text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.companies enable row level security;

create policy "Users can select own company"
  on public.companies for select
  using (auth.uid() = user_id);

create policy "Users can insert own company"
  on public.companies for insert
  with check (auth.uid() = user_id);

create policy "Users can update own company"
  on public.companies for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own company"
  on public.companies for delete
  using (auth.uid() = user_id);

-- Projekt kopplade till företag
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  property_designation text not null,
  address text,
  postal_code text,
  city text,
  contact_name text,
  phone text,
  email text,
  client_name text,
  contractor_name text,
  contract_form text,
  description text,
  -- Förberett för guided flöde (frågor/svar) – används inte i denna leverans
  guided_answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_company_id_idx on public.projects (company_id);
create index if not exists projects_user_id_idx on public.projects (user_id);

alter table public.projects enable row level security;

create policy "Users can select own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on public.projects for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.companies c
      where c.id = company_id and c.user_id = auth.uid()
    )
  );

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.companies c
      where c.id = company_id and c.user_id = auth.uid()
    )
  );

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);
