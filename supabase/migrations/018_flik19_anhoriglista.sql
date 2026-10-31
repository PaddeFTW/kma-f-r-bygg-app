-- KMA för bygg: Flik 19 Anhöriglista
-- Närmaste anhörig för personal på arbetsplatsen (underlag flikar-17-21).
-- Kör i Supabase SQL Editor efter 017_flik18_nodlage.sql.

create table if not exists public.anhoriglista (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Fält enligt Flik 19
  medarbetare text not null,
  narmaste_anhorig text,
  telefon_mobil text,
  datum date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists anhoriglista_project_id_idx on public.anhoriglista (project_id);
create index if not exists anhoriglista_company_id_idx on public.anhoriglista (company_id);
create index if not exists anhoriglista_user_id_idx on public.anhoriglista (user_id);

alter table public.anhoriglista enable row level security;

create policy "Users can select own anhoriglista"
  on public.anhoriglista for select
  using (auth.uid() = user_id);

create policy "Users can insert own anhoriglista"
  on public.anhoriglista for insert
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

create policy "Users can update own anhoriglista"
  on public.anhoriglista for update
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

create policy "Users can delete own anhoriglista"
  on public.anhoriglista for delete
  using (auth.uid() = user_id);
