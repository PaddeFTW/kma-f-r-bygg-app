-- KMA för bygg: Flik 27 Uppföljning Miljö
-- Checklista med poäng 1/2/3 (underlag flikar-22-31).
-- Kör i Supabase SQL Editor efter 025_flik26_uppfoljning_kvalitet.sql.

create table if not exists public.uppfoljning_miljo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists uppfoljning_miljo_project_id_idx on public.uppfoljning_miljo (project_id);
create index if not exists uppfoljning_miljo_company_id_idx on public.uppfoljning_miljo (company_id);
create index if not exists uppfoljning_miljo_user_id_idx on public.uppfoljning_miljo (user_id);

alter table public.uppfoljning_miljo enable row level security;

create policy "Users can select own uppfoljning_miljo"
  on public.uppfoljning_miljo for select
  using (auth.uid() = user_id);

create policy "Users can insert own uppfoljning_miljo"
  on public.uppfoljning_miljo for insert
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

create policy "Users can update own uppfoljning_miljo"
  on public.uppfoljning_miljo for update
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

create policy "Users can delete own uppfoljning_miljo"
  on public.uppfoljning_miljo for delete
  using (auth.uid() = user_id);

-- Poäng: 1 = icke godkänt, 2 = godkänt, 3 = väl godkänt
create table if not exists public.uppfoljning_miljo_rader (
  id uuid primary key default gen_random_uuid(),
  uppfoljning_miljo_id uuid not null references public.uppfoljning_miljo (id) on delete cascade,
  sort_order integer not null default 0,
  kontrollmoment text,
  -- 1 | 2 | 3
  status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists uppfoljning_miljo_rader_parent_id_idx
  on public.uppfoljning_miljo_rader (uppfoljning_miljo_id);

alter table public.uppfoljning_miljo_rader enable row level security;

create policy "Users can select own uppfoljning_miljo rader"
  on public.uppfoljning_miljo_rader for select
  using (
    exists (
      select 1 from public.uppfoljning_miljo u
      where u.id = uppfoljning_miljo_id and u.user_id = auth.uid()
    )
  );

create policy "Users can insert own uppfoljning_miljo rader"
  on public.uppfoljning_miljo_rader for insert
  with check (
    exists (
      select 1 from public.uppfoljning_miljo u
      where u.id = uppfoljning_miljo_id and u.user_id = auth.uid()
    )
  );

create policy "Users can update own uppfoljning_miljo rader"
  on public.uppfoljning_miljo_rader for update
  using (
    exists (
      select 1 from public.uppfoljning_miljo u
      where u.id = uppfoljning_miljo_id and u.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.uppfoljning_miljo u
      where u.id = uppfoljning_miljo_id and u.user_id = auth.uid()
    )
  );

create policy "Users can delete own uppfoljning_miljo rader"
  on public.uppfoljning_miljo_rader for delete
  using (
    exists (
      select 1 from public.uppfoljning_miljo u
      where u.id = uppfoljning_miljo_id and u.user_id = auth.uid()
    )
  );
