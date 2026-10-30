-- KMA för bygg: Flik 9 Rivningsplan
-- Kör i Supabase SQL Editor efter 007_flik8_miljoanalys.sql.

create table if not exists public.rivningsplaner (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Administrativa uppgifter
  fastighetsbeteckning_adress text,
  start_stoppdatum_rivning text,
  byggherre text,
  byggherre_kontakt text,
  entreprenor text,
  entreprenor_kontakt text,
  kvalitetsansvarig text,
  rivare text,
  bygganmalan_lamnas_till text,
  bygganmalan_kravs_inte boolean not null default false,
  -- Materialinventering
  materialinventering_utford boolean not null default false,
  materialinventering_ej_utford boolean not null default false,
  materialinventering_anteckningar text,
  -- Byggnadsbeskrivning
  byggnadstyp text,
  byggar text,
  ombyggnad_ar text,
  byggnadsyta text,
  antal_vaningar text,
  material_grund text,
  material_stomme text,
  material_tak text,
  nuvarande_anvandning text,
  nuvarande_anvandning_fran_ar text,
  tidigare_anvandning text,
  tidigare_anvandning_fran_ar text,
  -- Rivningens omfattning
  rivning_omfattning text,
  rivning_byggnadsyta_m2 text,
  bilagor text,
  -- Farligt avfall (tabell) och övrigt avfall (fraktioner)
  farligt_avfall jsonb not null default '[]'::jsonb,
  ovrigt_avfall jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rivningsplaner_project_id_idx on public.rivningsplaner (project_id);
create index if not exists rivningsplaner_company_id_idx on public.rivningsplaner (company_id);
create index if not exists rivningsplaner_user_id_idx on public.rivningsplaner (user_id);

alter table public.rivningsplaner enable row level security;

create policy "Users can select own rivningsplaner"
  on public.rivningsplaner for select
  using (auth.uid() = user_id);

create policy "Users can insert own rivningsplaner"
  on public.rivningsplaner for insert
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

create policy "Users can update own rivningsplaner"
  on public.rivningsplaner for update
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

create policy "Users can delete own rivningsplaner"
  on public.rivningsplaner for delete
  using (auth.uid() = user_id);
