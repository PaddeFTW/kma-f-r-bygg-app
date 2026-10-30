-- KMA för bygg: Flik 18 Nödlägesberedskap
-- Organisation och larmrutiner (underlag flikar-17-21).
-- Kör i Supabase SQL Editor efter 016_flik17_sakerhetsdatablad.sql.

create table if not exists public.nodlage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Innehåll enligt Flik 18
  raddningshjalp text,
  larmrutin_miljoolycka text,
  larmrutin_personskada text,
  information_narboende text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nodlage_project_id_idx on public.nodlage (project_id);
create index if not exists nodlage_company_id_idx on public.nodlage (company_id);
create index if not exists nodlage_user_id_idx on public.nodlage (user_id);

alter table public.nodlage enable row level security;

create policy "Users can select own nodlage"
  on public.nodlage for select
  using (auth.uid() = user_id);

create policy "Users can insert own nodlage"
  on public.nodlage for insert
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

create policy "Users can update own nodlage"
  on public.nodlage for update
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

create policy "Users can delete own nodlage"
  on public.nodlage for delete
  using (auth.uid() = user_id);

-- Organisation: befattning, namn, telefon
create table if not exists public.nodlage_organisation (
  id uuid primary key default gen_random_uuid(),
  nodlage_id uuid not null references public.nodlage (id) on delete cascade,
  sort_order integer not null default 0,
  befattning text,
  namn text,
  telefon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nodlage_organisation_nodlage_id_idx
  on public.nodlage_organisation (nodlage_id);

alter table public.nodlage_organisation enable row level security;

create policy "Users can select own nodlage organisation"
  on public.nodlage_organisation for select
  using (
    exists (
      select 1 from public.nodlage n
      where n.id = nodlage_id and n.user_id = auth.uid()
    )
  );

create policy "Users can insert own nodlage organisation"
  on public.nodlage_organisation for insert
  with check (
    exists (
      select 1 from public.nodlage n
      where n.id = nodlage_id and n.user_id = auth.uid()
    )
  );

create policy "Users can update own nodlage organisation"
  on public.nodlage_organisation for update
  using (
    exists (
      select 1 from public.nodlage n
      where n.id = nodlage_id and n.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.nodlage n
      where n.id = nodlage_id and n.user_id = auth.uid()
    )
  );

create policy "Users can delete own nodlage organisation"
  on public.nodlage_organisation for delete
  using (
    exists (
      select 1 from public.nodlage n
      where n.id = nodlage_id and n.user_id = auth.uid()
    )
  );
