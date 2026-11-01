-- KMA för bygg: Flik 30 Checklista byggpärm
-- Kontroll att alla flikar är klara (underlag flikar-22-31).
-- Kör i Supabase SQL Editor efter 028_flik29_kvittering.sql.

create table if not exists public.checklista_byggparm (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists checklista_byggparm_project_id_idx on public.checklista_byggparm (project_id);
create index if not exists checklista_byggparm_company_id_idx on public.checklista_byggparm (company_id);
create index if not exists checklista_byggparm_user_id_idx on public.checklista_byggparm (user_id);

alter table public.checklista_byggparm enable row level security;

create policy "Users can select own checklista byggparm"
  on public.checklista_byggparm for select
  using (auth.uid() = user_id);

create policy "Users can insert own checklista byggparm"
  on public.checklista_byggparm for insert
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

create policy "Users can update own checklista byggparm"
  on public.checklista_byggparm for update
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

create policy "Users can delete own checklista byggparm"
  on public.checklista_byggparm for delete
  using (auth.uid() = user_id);

-- Rader: Avsnitt (Flik 1–31), Klart ja/nej, Ansvarig, Datum
create table if not exists public.checklista_byggparm_rader (
  id uuid primary key default gen_random_uuid(),
  checklista_id uuid not null references public.checklista_byggparm (id) on delete cascade,
  sort_order integer not null default 0,
  flik_nr integer,
  avsnitt text,
  -- ja | nej
  klart text,
  ansvarig text,
  datum date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists checklista_byggparm_rader_checklista_id_idx
  on public.checklista_byggparm_rader (checklista_id);

alter table public.checklista_byggparm_rader enable row level security;

create policy "Users can select own checklista byggparm rader"
  on public.checklista_byggparm_rader for select
  using (
    exists (
      select 1 from public.checklista_byggparm c
      where c.id = checklista_id and c.user_id = auth.uid()
    )
  );

create policy "Users can insert own checklista byggparm rader"
  on public.checklista_byggparm_rader for insert
  with check (
    exists (
      select 1 from public.checklista_byggparm c
      where c.id = checklista_id and c.user_id = auth.uid()
    )
  );

create policy "Users can update own checklista byggparm rader"
  on public.checklista_byggparm_rader for update
  using (
    exists (
      select 1 from public.checklista_byggparm c
      where c.id = checklista_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.checklista_byggparm c
      where c.id = checklista_id and c.user_id = auth.uid()
    )
  );

create policy "Users can delete own checklista byggparm rader"
  on public.checklista_byggparm_rader for delete
  using (
    exists (
      select 1 from public.checklista_byggparm c
      where c.id = checklista_id and c.user_id = auth.uid()
    )
  );
