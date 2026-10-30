-- KMA för bygg: Flik 13 Egenkontroll
-- Dynamiska checklistor per typ (underlag flikar-13-16).
-- Kör i Supabase SQL Editor efter 011_flik12_kontrollplan.sql.

create table if not exists public.egenkontroller (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Typ / variant enligt underlaget
  typ text,
  -- Generell mall
  bestallare text,
  entreprenor text,
  objekt text,
  projektnr text,
  referens text,
  ovriga_anteckningar text,
  kontrollansvarig text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists egenkontroller_project_id_idx on public.egenkontroller (project_id);
create index if not exists egenkontroller_company_id_idx on public.egenkontroller (company_id);
create index if not exists egenkontroller_user_id_idx on public.egenkontroller (user_id);

alter table public.egenkontroller enable row level security;

create policy "Users can select own egenkontroller"
  on public.egenkontroller for select
  using (auth.uid() = user_id);

create policy "Users can insert own egenkontroller"
  on public.egenkontroller for insert
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

create policy "Users can update own egenkontroller"
  on public.egenkontroller for update
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

create policy "Users can delete own egenkontroller"
  on public.egenkontroller for delete
  using (auth.uid() = user_id);

-- Kontrollmoment: 1 = godkänt, 2 = ej godkänt, 3 = ej kontrollerat
create table if not exists public.egenkontroll_rader (
  id uuid primary key default gen_random_uuid(),
  egenkontroll_id uuid not null references public.egenkontroller (id) on delete cascade,
  sort_order integer not null default 0,
  kontrollmoment text,
  -- 1 | 2 | 3
  status text,
  datum date,
  signatur text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists egenkontroll_rader_egenkontroll_id_idx
  on public.egenkontroll_rader (egenkontroll_id);

alter table public.egenkontroll_rader enable row level security;

create policy "Users can select own egenkontroll rader"
  on public.egenkontroll_rader for select
  using (
    exists (
      select 1 from public.egenkontroller e
      where e.id = egenkontroll_id and e.user_id = auth.uid()
    )
  );

create policy "Users can insert own egenkontroll rader"
  on public.egenkontroll_rader for insert
  with check (
    exists (
      select 1 from public.egenkontroller e
      where e.id = egenkontroll_id and e.user_id = auth.uid()
    )
  );

create policy "Users can update own egenkontroll rader"
  on public.egenkontroll_rader for update
  using (
    exists (
      select 1 from public.egenkontroller e
      where e.id = egenkontroll_id and e.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.egenkontroller e
      where e.id = egenkontroll_id and e.user_id = auth.uid()
    )
  );

create policy "Users can delete own egenkontroll rader"
  on public.egenkontroll_rader for delete
  using (
    exists (
      select 1 from public.egenkontroller e
      where e.id = egenkontroll_id and e.user_id = auth.uid()
    )
  );
