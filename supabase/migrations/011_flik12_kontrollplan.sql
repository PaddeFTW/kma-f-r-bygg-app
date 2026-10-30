-- KMA för bygg: Flik 12 Kontrollplan
-- Formulär med kontrolltabell enligt PBL (underlag flikar-08-12).
-- Kör i Supabase SQL Editor efter 010_flik11_bygghandlingar.sql.

create table if not exists public.kontrollplaner (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Fält enligt Flik 12
  objektinfo text,
  kontrollansvarig text,
  byggherre text,
  entreprenor text,
  underlag text,
  -- Signeras av kontrollansvarig och byggherre
  signatur_kontrollansvarig text,
  signatur_byggherre text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kontrollplaner_project_id_idx on public.kontrollplaner (project_id);
create index if not exists kontrollplaner_company_id_idx on public.kontrollplaner (company_id);
create index if not exists kontrollplaner_user_id_idx on public.kontrollplaner (user_id);

alter table public.kontrollplaner enable row level security;

create policy "Users can select own kontrollplaner"
  on public.kontrollplaner for select
  using (auth.uid() = user_id);

create policy "Users can insert own kontrollplaner"
  on public.kontrollplaner for insert
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

create policy "Users can update own kontrollplaner"
  on public.kontrollplaner for update
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

create policy "Users can delete own kontrollplaner"
  on public.kontrollplaner for delete
  using (auth.uid() = user_id);

-- Kontrolltabell: rader per plan
-- Kolumner: kontroll avser, utförs av S/E, metod, underlag, anmärkning, åtgärd, datum, sign
create table if not exists public.kontrollplan_rader (
  id uuid primary key default gen_random_uuid(),
  kontrollplan_id uuid not null references public.kontrollplaner (id) on delete cascade,
  sort_order integer not null default 0,
  kontroll_avser text,
  -- S = sakkunnig/kontrollansvarig, E = entreprenör (enligt underlaget S/E)
  utfor_av text,
  metod text,
  underlag text,
  anmarkning text,
  atgard text,
  datum date,
  sign text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kontrollplan_rader_plan_id_idx
  on public.kontrollplan_rader (kontrollplan_id);

alter table public.kontrollplan_rader enable row level security;

create policy "Users can select own kontrollplan rader"
  on public.kontrollplan_rader for select
  using (
    exists (
      select 1 from public.kontrollplaner kp
      where kp.id = kontrollplan_id and kp.user_id = auth.uid()
    )
  );

create policy "Users can insert own kontrollplan rader"
  on public.kontrollplan_rader for insert
  with check (
    exists (
      select 1 from public.kontrollplaner kp
      where kp.id = kontrollplan_id and kp.user_id = auth.uid()
    )
  );

create policy "Users can update own kontrollplan rader"
  on public.kontrollplan_rader for update
  using (
    exists (
      select 1 from public.kontrollplaner kp
      where kp.id = kontrollplan_id and kp.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.kontrollplaner kp
      where kp.id = kontrollplan_id and kp.user_id = auth.uid()
    )
  );

create policy "Users can delete own kontrollplan rader"
  on public.kontrollplan_rader for delete
  using (
    exists (
      select 1 from public.kontrollplaner kp
      where kp.id = kontrollplan_id and kp.user_id = auth.uid()
    )
  );
