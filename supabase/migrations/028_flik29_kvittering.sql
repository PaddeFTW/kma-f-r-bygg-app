-- KMA för bygg: Flik 29 Kvitteringslistor
-- Bevis att personal och UE fått säkerhetsinformation (underlag flikar-22-31).
-- Kör i Supabase SQL Editor efter 027_flik28_riskbedomning.sql.

create table if not exists public.kvitteringslistor (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Dokument enligt Flik 29
  dokument_amp boolean not null default false,
  dokument_riskbedomning boolean not null default false,
  dokument_ordningsregler boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kvitteringslistor_project_id_idx on public.kvitteringslistor (project_id);
create index if not exists kvitteringslistor_company_id_idx on public.kvitteringslistor (company_id);
create index if not exists kvitteringslistor_user_id_idx on public.kvitteringslistor (user_id);

alter table public.kvitteringslistor enable row level security;

create policy "Users can select own kvitteringslistor"
  on public.kvitteringslistor for select
  using (auth.uid() = user_id);

create policy "Users can insert own kvitteringslistor"
  on public.kvitteringslistor for insert
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

create policy "Users can update own kvitteringslistor"
  on public.kvitteringslistor for update
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

create policy "Users can delete own kvitteringslistor"
  on public.kvitteringslistor for delete
  using (auth.uid() = user_id);

-- Kvitteringsrader: Namn, Datum, Signatur (separat för anställda och UE)
create table if not exists public.kvittering_rader (
  id uuid primary key default gen_random_uuid(),
  kvittering_id uuid not null references public.kvitteringslistor (id) on delete cascade,
  sort_order integer not null default 0,
  -- anstalld | ue
  kategori text not null,
  namn text,
  datum date,
  signatur text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kvittering_rader_kvittering_id_idx
  on public.kvittering_rader (kvittering_id);

alter table public.kvittering_rader enable row level security;

create policy "Users can select own kvittering rader"
  on public.kvittering_rader for select
  using (
    exists (
      select 1 from public.kvitteringslistor k
      where k.id = kvittering_id and k.user_id = auth.uid()
    )
  );

create policy "Users can insert own kvittering rader"
  on public.kvittering_rader for insert
  with check (
    exists (
      select 1 from public.kvitteringslistor k
      where k.id = kvittering_id and k.user_id = auth.uid()
    )
  );

create policy "Users can update own kvittering rader"
  on public.kvittering_rader for update
  using (
    exists (
      select 1 from public.kvitteringslistor k
      where k.id = kvittering_id and k.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.kvitteringslistor k
      where k.id = kvittering_id and k.user_id = auth.uid()
    )
  );

create policy "Users can delete own kvittering rader"
  on public.kvittering_rader for delete
  using (
    exists (
      select 1 from public.kvitteringslistor k
      where k.id = kvittering_id and k.user_id = auth.uid()
    )
  );
