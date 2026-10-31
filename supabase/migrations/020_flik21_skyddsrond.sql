-- KMA för bygg: Flik 21 Skydds- och miljörond
-- Dynamisk checklista + handlingsplan (underlag flikar-17-21).
-- Kör i Supabase SQL Editor efter 019_flik20_krisberedskap.sql.

create table if not exists public.skyddsronder (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Deltagare enligt Flik 21
  platschef text,
  arbetsledare text,
  skyddsombud text,
  ue text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists skyddsronder_project_id_idx on public.skyddsronder (project_id);
create index if not exists skyddsronder_company_id_idx on public.skyddsronder (company_id);
create index if not exists skyddsronder_user_id_idx on public.skyddsronder (user_id);

alter table public.skyddsronder enable row level security;

create policy "Users can select own skyddsronder"
  on public.skyddsronder for select
  using (auth.uid() = user_id);

create policy "Users can insert own skyddsronder"
  on public.skyddsronder for insert
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

create policy "Users can update own skyddsronder"
  on public.skyddsronder for update
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

create policy "Users can delete own skyddsronder"
  on public.skyddsronder for delete
  using (auth.uid() = user_id);

-- Checklista (Ja/Nej)
create table if not exists public.skyddsrond_checklista (
  id uuid primary key default gen_random_uuid(),
  skyddsrond_id uuid not null references public.skyddsronder (id) on delete cascade,
  sort_order integer not null default 0,
  punkt text,
  -- ja | nej
  status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists skyddsrond_checklista_skyddsrond_id_idx
  on public.skyddsrond_checklista (skyddsrond_id);

alter table public.skyddsrond_checklista enable row level security;

create policy "Users can select own skyddsrond checklista"
  on public.skyddsrond_checklista for select
  using (
    exists (
      select 1 from public.skyddsronder s
      where s.id = skyddsrond_id and s.user_id = auth.uid()
    )
  );

create policy "Users can insert own skyddsrond checklista"
  on public.skyddsrond_checklista for insert
  with check (
    exists (
      select 1 from public.skyddsronder s
      where s.id = skyddsrond_id and s.user_id = auth.uid()
    )
  );

create policy "Users can update own skyddsrond checklista"
  on public.skyddsrond_checklista for update
  using (
    exists (
      select 1 from public.skyddsronder s
      where s.id = skyddsrond_id and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.skyddsronder s
      where s.id = skyddsrond_id and s.user_id = auth.uid()
    )
  );

create policy "Users can delete own skyddsrond checklista"
  on public.skyddsrond_checklista for delete
  using (
    exists (
      select 1 from public.skyddsronder s
      where s.id = skyddsrond_id and s.user_id = auth.uid()
    )
  );

-- Sammanställning + Handlingsplan
create table if not exists public.skyddsrond_handlingsplan (
  id uuid primary key default gen_random_uuid(),
  skyddsrond_id uuid not null references public.skyddsronder (id) on delete cascade,
  sort_order integer not null default 0,
  nr text,
  fel_brister text,
  atgardas_senast date,
  ansvarig text,
  atgardat_datum date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists skyddsrond_handlingsplan_skyddsrond_id_idx
  on public.skyddsrond_handlingsplan (skyddsrond_id);

alter table public.skyddsrond_handlingsplan enable row level security;

create policy "Users can select own skyddsrond handlingsplan"
  on public.skyddsrond_handlingsplan for select
  using (
    exists (
      select 1 from public.skyddsronder s
      where s.id = skyddsrond_id and s.user_id = auth.uid()
    )
  );

create policy "Users can insert own skyddsrond handlingsplan"
  on public.skyddsrond_handlingsplan for insert
  with check (
    exists (
      select 1 from public.skyddsronder s
      where s.id = skyddsrond_id and s.user_id = auth.uid()
    )
  );

create policy "Users can update own skyddsrond handlingsplan"
  on public.skyddsrond_handlingsplan for update
  using (
    exists (
      select 1 from public.skyddsronder s
      where s.id = skyddsrond_id and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.skyddsronder s
      where s.id = skyddsrond_id and s.user_id = auth.uid()
    )
  );

create policy "Users can delete own skyddsrond handlingsplan"
  on public.skyddsrond_handlingsplan for delete
  using (
    exists (
      select 1 from public.skyddsronder s
      where s.id = skyddsrond_id and s.user_id = auth.uid()
    )
  );
