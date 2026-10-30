-- KMA för bygg: Flik 5 Kvalitetsplan
-- Kör i Supabase SQL Editor efter 003_flik3_4_organisation.sql.

create table if not exists public.kvalitetsplaner (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Avsnitt enligt Flik 5
  kvalitetspolicy text,
  orientering_allman_info text,
  orientering_entreprenadform text,
  orientering_art text,
  orientering_tidplan text,
  organisation text,
  projektgenomgang_byggmote text,
  projektgenomgang_andringar text,
  projektgenomgang_protokoll text,
  projektering_kontrollplan text,
  produktion_egenkontroll text,
  produktion_dagbok text,
  produktion_ata text,
  produktion_personalliggare text,
  produktion_avvikelser text,
  montage_matutrustning text,
  avslutning_provning text,
  avslutning_besiktning text,
  dokumentstyrning text,
  distributionsforteckning text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kvalitetsplaner_project_id_idx on public.kvalitetsplaner (project_id);
create index if not exists kvalitetsplaner_company_id_idx on public.kvalitetsplaner (company_id);
create index if not exists kvalitetsplaner_user_id_idx on public.kvalitetsplaner (user_id);

alter table public.kvalitetsplaner enable row level security;

create policy "Users can select own kvalitetsplaner"
  on public.kvalitetsplaner for select
  using (auth.uid() = user_id);

create policy "Users can insert own kvalitetsplaner"
  on public.kvalitetsplaner for insert
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

create policy "Users can update own kvalitetsplaner"
  on public.kvalitetsplaner for update
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

create policy "Users can delete own kvalitetsplaner"
  on public.kvalitetsplaner for delete
  using (auth.uid() = user_id);
