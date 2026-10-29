-- KMA för bygg: Flik 6 Miljöplan
-- Kör i Supabase SQL Editor efter 004_flik5_kvalitetsplan.sql.

create table if not exists public.miljoplaner (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Avsnitt enligt Flik 6
  miljopolicy text,
  -- Miljöaspekter som checklista
  aspekt_transporter boolean not null default false,
  aspekt_byggavfall boolean not null default false,
  aspekt_kemikalier boolean not null default false,
  aspekt_farligt_avfall boolean not null default false,
  aspekt_el boolean not null default false,
  aspekt_kallsortering boolean not null default false,
  miljoaspekter_anteckningar text,
  -- Källsortering och kemikalier (SDB)
  kallsortering_kemikalier_sdb text,
  -- Lagar och andra krav
  lagar_krav text,
  -- Ansvar, utbildning, kommunikation
  ansvar text,
  utbildning text,
  kommunikation text,
  -- Egenkontroll för miljö, avvikelser, nödläge
  egenkontroll_miljo text,
  avvikelser text,
  nodlage text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists miljoplaner_project_id_idx on public.miljoplaner (project_id);
create index if not exists miljoplaner_company_id_idx on public.miljoplaner (company_id);
create index if not exists miljoplaner_user_id_idx on public.miljoplaner (user_id);

alter table public.miljoplaner enable row level security;

create policy "Users can select own miljoplaner"
  on public.miljoplaner for select
  using (auth.uid() = user_id);

create policy "Users can insert own miljoplaner"
  on public.miljoplaner for insert
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

create policy "Users can update own miljoplaner"
  on public.miljoplaner for update
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

create policy "Users can delete own miljoplaner"
  on public.miljoplaner for delete
  using (auth.uid() = user_id);
