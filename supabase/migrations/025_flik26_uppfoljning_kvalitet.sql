-- KMA för bygg: Flik 26 Uppföljning Kvalitet
-- Checklista med poäng 1/2/3 (underlag flikar-22-31).
-- Kör i Supabase SQL Editor efter 024_flik25_uppfoljning_am.sql.

create table if not exists public.uppfoljning_kvalitet (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists uppfoljning_kvalitet_project_id_idx on public.uppfoljning_kvalitet (project_id);
create index if not exists uppfoljning_kvalitet_company_id_idx on public.uppfoljning_kvalitet (company_id);
create index if not exists uppfoljning_kvalitet_user_id_idx on public.uppfoljning_kvalitet (user_id);

alter table public.uppfoljning_kvalitet enable row level security;

create policy "Users can select own uppfoljning_kvalitet"
  on public.uppfoljning_kvalitet for select
  using (auth.uid() = user_id);

create policy "Users can insert own uppfoljning_kvalitet"
  on public.uppfoljning_kvalitet for insert
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

create policy "Users can update own uppfoljning_kvalitet"
  on public.uppfoljning_kvalitet for update
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

create policy "Users can delete own uppfoljning_kvalitet"
  on public.uppfoljning_kvalitet for delete
  using (auth.uid() = user_id);

-- Poäng: 1 = icke godkänt, 2 = godkänt, 3 = väl godkänt
create table if not exists public.uppfoljning_kvalitet_rader (
  id uuid primary key default gen_random_uuid(),
  uppfoljning_kvalitet_id uuid not null references public.uppfoljning_kvalitet (id) on delete cascade,
  sort_order integer not null default 0,
  kontrollmoment text,
  -- 1 | 2 | 3
  status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists uppfoljning_kvalitet_rader_parent_id_idx
  on public.uppfoljning_kvalitet_rader (uppfoljning_kvalitet_id);

alter table public.uppfoljning_kvalitet_rader enable row level security;

create policy "Users can select own uppfoljning_kvalitet rader"
  on public.uppfoljning_kvalitet_rader for select
  using (
    exists (
      select 1 from public.uppfoljning_kvalitet u
      where u.id = uppfoljning_kvalitet_id and u.user_id = auth.uid()
    )
  );

create policy "Users can insert own uppfoljning_kvalitet rader"
  on public.uppfoljning_kvalitet_rader for insert
  with check (
    exists (
      select 1 from public.uppfoljning_kvalitet u
      where u.id = uppfoljning_kvalitet_id and u.user_id = auth.uid()
    )
  );

create policy "Users can update own uppfoljning_kvalitet rader"
  on public.uppfoljning_kvalitet_rader for update
  using (
    exists (
      select 1 from public.uppfoljning_kvalitet u
      where u.id = uppfoljning_kvalitet_id and u.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.uppfoljning_kvalitet u
      where u.id = uppfoljning_kvalitet_id and u.user_id = auth.uid()
    )
  );

create policy "Users can delete own uppfoljning_kvalitet rader"
  on public.uppfoljning_kvalitet_rader for delete
  using (
    exists (
      select 1 from public.uppfoljning_kvalitet u
      where u.id = uppfoljning_kvalitet_id and u.user_id = auth.uid()
    )
  );
