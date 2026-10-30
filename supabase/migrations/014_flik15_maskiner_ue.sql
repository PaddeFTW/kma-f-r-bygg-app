-- KMA för bygg: Flik 15 Inventering av maskiner för UE
-- Lista över maskiner/fordon från UE (underlag flikar-13-16).
-- Kör i Supabase SQL Editor efter 013_flik14_egenkontroller_ue.sql.

create table if not exists public.maskiner_ue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Fält enligt Flik 15
  underleverantor text not null,
  maskiner text,
  datum date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists maskiner_ue_project_id_idx on public.maskiner_ue (project_id);
create index if not exists maskiner_ue_company_id_idx on public.maskiner_ue (company_id);
create index if not exists maskiner_ue_user_id_idx on public.maskiner_ue (user_id);

alter table public.maskiner_ue enable row level security;

create policy "Users can select own maskiner_ue"
  on public.maskiner_ue for select
  using (auth.uid() = user_id);

create policy "Users can insert own maskiner_ue"
  on public.maskiner_ue for insert
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

create policy "Users can update own maskiner_ue"
  on public.maskiner_ue for update
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

create policy "Users can delete own maskiner_ue"
  on public.maskiner_ue for delete
  using (auth.uid() = user_id);
