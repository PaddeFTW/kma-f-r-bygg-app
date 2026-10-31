-- KMA för bygg: Flik 23 Arbetsplatsbesiktning
-- Förbesiktning med kontrollmoment 1/2/3 (underlag flikar-22-31).
-- Kör i Supabase SQL Editor efter 021_flik22_ekonomi.sql.

create table if not exists public.arbetsplatsbesiktningar (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists arbetsplatsbesiktningar_project_id_idx on public.arbetsplatsbesiktningar (project_id);
create index if not exists arbetsplatsbesiktningar_company_id_idx on public.arbetsplatsbesiktningar (company_id);
create index if not exists arbetsplatsbesiktningar_user_id_idx on public.arbetsplatsbesiktningar (user_id);

alter table public.arbetsplatsbesiktningar enable row level security;

create policy "Users can select own arbetsplatsbesiktningar"
  on public.arbetsplatsbesiktningar for select
  using (auth.uid() = user_id);

create policy "Users can insert own arbetsplatsbesiktningar"
  on public.arbetsplatsbesiktningar for insert
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

create policy "Users can update own arbetsplatsbesiktningar"
  on public.arbetsplatsbesiktningar for update
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

create policy "Users can delete own arbetsplatsbesiktningar"
  on public.arbetsplatsbesiktningar for delete
  using (auth.uid() = user_id);

-- Kontrollmoment: 1 = Kontrollerat och godkänt, 2 = Kontrollerat och ej godkänt, 3 = Ej kontrollerat
create table if not exists public.arbetsplatsbesiktning_rader (
  id uuid primary key default gen_random_uuid(),
  arbetsplatsbesiktning_id uuid not null references public.arbetsplatsbesiktningar (id) on delete cascade,
  sort_order integer not null default 0,
  kontrollmoment text,
  -- 1 | 2 | 3
  status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists arbetsplatsbesiktning_rader_besiktning_id_idx
  on public.arbetsplatsbesiktning_rader (arbetsplatsbesiktning_id);

alter table public.arbetsplatsbesiktning_rader enable row level security;

create policy "Users can select own arbetsplatsbesiktning rader"
  on public.arbetsplatsbesiktning_rader for select
  using (
    exists (
      select 1 from public.arbetsplatsbesiktningar a
      where a.id = arbetsplatsbesiktning_id and a.user_id = auth.uid()
    )
  );

create policy "Users can insert own arbetsplatsbesiktning rader"
  on public.arbetsplatsbesiktning_rader for insert
  with check (
    exists (
      select 1 from public.arbetsplatsbesiktningar a
      where a.id = arbetsplatsbesiktning_id and a.user_id = auth.uid()
    )
  );

create policy "Users can update own arbetsplatsbesiktning rader"
  on public.arbetsplatsbesiktning_rader for update
  using (
    exists (
      select 1 from public.arbetsplatsbesiktningar a
      where a.id = arbetsplatsbesiktning_id and a.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.arbetsplatsbesiktningar a
      where a.id = arbetsplatsbesiktning_id and a.user_id = auth.uid()
    )
  );

create policy "Users can delete own arbetsplatsbesiktning rader"
  on public.arbetsplatsbesiktning_rader for delete
  using (
    exists (
      select 1 from public.arbetsplatsbesiktningar a
      where a.id = arbetsplatsbesiktning_id and a.user_id = auth.uid()
    )
  );
