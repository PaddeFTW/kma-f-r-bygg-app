-- KMA för bygg: Företagets återanvändbara kontaktlista
-- Kör i Supabase SQL Editor efter 032_bas_sarskilda_risker.sql.

create table if not exists public.company_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company_name text,
  role text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists company_contacts_company_id_idx on public.company_contacts (company_id);
create index if not exists company_contacts_user_id_idx on public.company_contacts (user_id);
create index if not exists company_contacts_email_idx
  on public.company_contacts (company_id, lower(email));
create index if not exists company_contacts_name_company_idx
  on public.company_contacts (company_id, lower(name), lower(coalesce(company_name, '')));

alter table public.company_contacts enable row level security;

create policy "Users can select own company contacts"
  on public.company_contacts for select
  using (auth.uid() = user_id);

create policy "Users can insert own company contacts"
  on public.company_contacts for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.companies c
      where c.id = company_id and c.user_id = auth.uid()
    )
  );

create policy "Users can update own company contacts"
  on public.company_contacts for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.companies c
      where c.id = company_id and c.user_id = auth.uid()
    )
  );

create policy "Users can delete own company contacts"
  on public.company_contacts for delete
  using (auth.uid() = user_id);
