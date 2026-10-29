-- KMA för bygg: Flik 8 Miljöanalys
-- Kör i Supabase SQL Editor efter 006_flik7_arbetsmiljoplan.sql.

create table if not exists public.miljoanalyser (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Arbetsmetodik (transporter, tomgång, damm, buller) – åtgärd per aspekt
  atgard_transporter text,
  atgard_tomgang text,
  atgard_damm text,
  atgard_buller text,
  -- Övriga miljöaspekter
  atgard_materialhantering text,
  atgard_kallsortering text,
  atgard_byggavfall text,
  atgard_nodlagesberedskap text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists miljoanalyser_project_id_idx on public.miljoanalyser (project_id);
create index if not exists miljoanalyser_company_id_idx on public.miljoanalyser (company_id);
create index if not exists miljoanalyser_user_id_idx on public.miljoanalyser (user_id);

alter table public.miljoanalyser enable row level security;

create policy "Users can select own miljoanalyser"
  on public.miljoanalyser for select
  using (auth.uid() = user_id);

create policy "Users can insert own miljoanalyser"
  on public.miljoanalyser for insert
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

create policy "Users can update own miljoanalyser"
  on public.miljoanalyser for update
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

create policy "Users can delete own miljoanalyser"
  on public.miljoanalyser for delete
  using (auth.uid() = user_id);
