-- KMA för bygg: Flik 10 Protokoll – byggmöte
-- Kör i Supabase SQL Editor efter 008_flik9_rivningsplan.sql.

create table if not exists public.protokoll (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Grunduppgifter
  projektnr text,
  namn text,
  mote_nr text,
  datum text,
  plats text,
  -- Närvarande
  narvarande_entreprenor text,
  narvarande_bestallare text,
  narvarande_underentreprenor text,
  -- Dagordning (kvalitet, miljö, arbetsmiljö m.fl.)
  dagordning_kvalitet text,
  dagordning_miljo text,
  dagordning_arbetsmiljo text,
  dagordning_ovrigt text,
  -- Beslut
  beslut text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists protokoll_project_id_idx on public.protokoll (project_id);
create index if not exists protokoll_company_id_idx on public.protokoll (company_id);
create index if not exists protokoll_user_id_idx on public.protokoll (user_id);

alter table public.protokoll enable row level security;

create policy "Users can select own protokoll"
  on public.protokoll for select
  using (auth.uid() = user_id);

create policy "Users can insert own protokoll"
  on public.protokoll for insert
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

create policy "Users can update own protokoll"
  on public.protokoll for update
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

create policy "Users can delete own protokoll"
  on public.protokoll for delete
  using (auth.uid() = user_id);
