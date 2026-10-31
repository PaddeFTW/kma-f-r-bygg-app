-- KMA för bygg: Flik 16 Avvikelserapport / ÄTA / ÄTA-lista
-- Underlag: docs/kma-underlag/flikar-13-16-egenkontroll-ata.md
-- Kör i Supabase SQL Editor efter 014_flik15_maskiner_ue.sql.

-- ---------------------------------------------------------------------------
-- Avvikelserapport
-- ---------------------------------------------------------------------------
create table if not exists public.avvikelser (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  ordernr text,
  datum date,
  inlamnat_av text,
  beskrivning text,
  korrigerande_atgard text,
  grundorsak text,
  kostnad numeric,
  forebyggande_atgard text,
  uppfoljning text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists avvikelser_project_id_idx on public.avvikelser (project_id);
create index if not exists avvikelser_company_id_idx on public.avvikelser (company_id);
create index if not exists avvikelser_user_id_idx on public.avvikelser (user_id);

alter table public.avvikelser enable row level security;

create policy "Users can select own avvikelser"
  on public.avvikelser for select
  using (auth.uid() = user_id);

create policy "Users can insert own avvikelser"
  on public.avvikelser for insert
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

create policy "Users can update own avvikelser"
  on public.avvikelser for update
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

create policy "Users can delete own avvikelser"
  on public.avvikelser for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- ÄTA
-- ---------------------------------------------------------------------------
create table if not exists public.ata (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  ordernr text,
  objekt text,
  beskrivning text,
  rapportor text,
  orsak text,
  hanvisning text,
  -- Fast pris / Löpande räkning
  pris_modell text check (pris_modell is null or pris_modell in ('fast_pris', 'lopande_rakning')),
  signatur text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ata_project_id_idx on public.ata (project_id);
create index if not exists ata_company_id_idx on public.ata (company_id);
create index if not exists ata_user_id_idx on public.ata (user_id);

alter table public.ata enable row level security;

create policy "Users can select own ata"
  on public.ata for select
  using (auth.uid() = user_id);

create policy "Users can insert own ata"
  on public.ata for insert
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

create policy "Users can update own ata"
  on public.ata for update
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

create policy "Users can delete own ata"
  on public.ata for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- ÄTA-lista
-- ---------------------------------------------------------------------------
create table if not exists public.ata_lista (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  nr text,
  datum date,
  beskrivning text,
  -- Beställd/icke
  bestalld boolean,
  summa numeric,
  fakturerad boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ata_lista_project_id_idx on public.ata_lista (project_id);
create index if not exists ata_lista_company_id_idx on public.ata_lista (company_id);
create index if not exists ata_lista_user_id_idx on public.ata_lista (user_id);

alter table public.ata_lista enable row level security;

create policy "Users can select own ata_lista"
  on public.ata_lista for select
  using (auth.uid() = user_id);

create policy "Users can insert own ata_lista"
  on public.ata_lista for insert
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

create policy "Users can update own ata_lista"
  on public.ata_lista for update
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

create policy "Users can delete own ata_lista"
  on public.ata_lista for delete
  using (auth.uid() = user_id);
