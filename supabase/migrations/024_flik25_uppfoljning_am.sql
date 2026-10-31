-- KMA för bygg: Flik 25 Uppföljning Arbetsmiljö
-- Checklista med poäng 1/2/3 (underlag flikar-22-31).
-- Kör i Supabase SQL Editor efter 023_flik24_slutbesiktning.sql.

create table if not exists public.uppfoljning_am (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists uppfoljning_am_project_id_idx on public.uppfoljning_am (project_id);
create index if not exists uppfoljning_am_company_id_idx on public.uppfoljning_am (company_id);
create index if not exists uppfoljning_am_user_id_idx on public.uppfoljning_am (user_id);

alter table public.uppfoljning_am enable row level security;

create policy "Users can select own uppfoljning_am"
  on public.uppfoljning_am for select
  using (auth.uid() = user_id);

create policy "Users can insert own uppfoljning_am"
  on public.uppfoljning_am for insert
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

create policy "Users can update own uppfoljning_am"
  on public.uppfoljning_am for update
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

create policy "Users can delete own uppfoljning_am"
  on public.uppfoljning_am for delete
  using (auth.uid() = user_id);

-- Poäng: 1 = icke godkänt, 2 = godkänt, 3 = väl godkänt
create table if not exists public.uppfoljning_am_rader (
  id uuid primary key default gen_random_uuid(),
  uppfoljning_am_id uuid not null references public.uppfoljning_am (id) on delete cascade,
  sort_order integer not null default 0,
  kontrollmoment text,
  -- 1 | 2 | 3
  status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists uppfoljning_am_rader_uppfoljning_am_id_idx
  on public.uppfoljning_am_rader (uppfoljning_am_id);

alter table public.uppfoljning_am_rader enable row level security;

create policy "Users can select own uppfoljning_am rader"
  on public.uppfoljning_am_rader for select
  using (
    exists (
      select 1 from public.uppfoljning_am u
      where u.id = uppfoljning_am_id and u.user_id = auth.uid()
    )
  );

create policy "Users can insert own uppfoljning_am rader"
  on public.uppfoljning_am_rader for insert
  with check (
    exists (
      select 1 from public.uppfoljning_am u
      where u.id = uppfoljning_am_id and u.user_id = auth.uid()
    )
  );

create policy "Users can update own uppfoljning_am rader"
  on public.uppfoljning_am_rader for update
  using (
    exists (
      select 1 from public.uppfoljning_am u
      where u.id = uppfoljning_am_id and u.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.uppfoljning_am u
      where u.id = uppfoljning_am_id and u.user_id = auth.uid()
    )
  );

create policy "Users can delete own uppfoljning_am rader"
  on public.uppfoljning_am_rader for delete
  using (
    exists (
      select 1 from public.uppfoljning_am u
      where u.id = uppfoljning_am_id and u.user_id = auth.uid()
    )
  );
