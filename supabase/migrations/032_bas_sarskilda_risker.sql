-- KMA för bygg: Bas-P/Bas-U + 13 särskilda risker (AFS 2023:3 11 kap. 12 §)
-- Kör i Supabase SQL Editor efter 031_export_sharing.sql.

-- Kompetens / intyg på roller (Bas-P, Bas-U m.fl.)
alter table public.project_roles
  add column if not exists competence text,
  add column if not exists education text,
  add column if not exists cert_file_path text,
  add column if not exists cert_file_name text;

-- Överlämning Bas-P → Bas-U på projektet
alter table public.projects
  add column if not exists bas_overlamning_gjord boolean not null default false,
  add column if not exists bas_overlamning_datum date,
  add column if not exists bas_overlamning_from text,
  add column if not exists bas_overlamning_to text,
  add column if not exists bas_overlamning_anteckning text;

-- 13-punktschecklista per projekt (styr flaggan AMP krävs)
create table if not exists public.project_sarskilda_risker (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  sort_order integer not null default 0,
  punkt_nr integer not null check (punkt_nr between 1 and 13),
  benamning text not null,
  -- ja | nej | '' (ej ifyllt)
  svar text not null default '' check (svar in ('', 'ja', 'nej')),
  atgard text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, punkt_nr)
);

create index if not exists project_sarskilda_risker_project_id_idx
  on public.project_sarskilda_risker (project_id);
create index if not exists project_sarskilda_risker_user_id_idx
  on public.project_sarskilda_risker (user_id);

alter table public.project_sarskilda_risker enable row level security;

create policy "Users can select own project sarskilda risker"
  on public.project_sarskilda_risker for select
  using (auth.uid() = user_id);

create policy "Users can insert own project sarskilda risker"
  on public.project_sarskilda_risker for insert
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

create policy "Users can update own project sarskilda risker"
  on public.project_sarskilda_risker for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.user_id = auth.uid()
        and p.company_id = company_id
    )
  );

create policy "Users can delete own project sarskilda risker"
  on public.project_sarskilda_risker for delete
  using (auth.uid() = user_id);

-- Privat bucket för kompetensintyg
insert into storage.buckets (id, name, public)
values ('kompetensbevis', 'kompetensbevis', false)
on conflict (id) do nothing;

create policy "Users can select own kompetensbevis files"
  on storage.objects for select
  using (
    bucket_id = 'kompetensbevis'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can insert own kompetensbevis files"
  on storage.objects for insert
  with check (
    bucket_id = 'kompetensbevis'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update own kompetensbevis files"
  on storage.objects for update
  using (
    bucket_id = 'kompetensbevis'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own kompetensbevis files"
  on storage.objects for delete
  using (
    bucket_id = 'kompetensbevis'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
