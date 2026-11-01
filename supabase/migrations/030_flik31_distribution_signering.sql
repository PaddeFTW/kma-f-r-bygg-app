-- KMA för bygg: Flik 31 Distribution och signering
-- Distributionslista, pärmstatus och godkännande (underlag flikar-22-31).
-- Kör i Supabase SQL Editor efter 029_flik30_checklista_byggparm.sql.

create table if not exists public.distribution_signering (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Pärmstatus + distributionslista enligt Flik 31
  parmstatus text,
  distributionslista text,
  -- Signering: Beställare, Platschef, Beställarens ombud + datum
  bestallare text,
  bestallare_datum date,
  platschef text,
  platschef_datum date,
  bestallarens_ombud text,
  bestallarens_ombud_datum date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists distribution_signering_project_id_idx on public.distribution_signering (project_id);
create index if not exists distribution_signering_company_id_idx on public.distribution_signering (company_id);
create index if not exists distribution_signering_user_id_idx on public.distribution_signering (user_id);

alter table public.distribution_signering enable row level security;

create policy "Users can select own distribution signering"
  on public.distribution_signering for select
  using (auth.uid() = user_id);

create policy "Users can insert own distribution signering"
  on public.distribution_signering for insert
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

create policy "Users can update own distribution signering"
  on public.distribution_signering for update
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

create policy "Users can delete own distribution signering"
  on public.distribution_signering for delete
  using (auth.uid() = user_id);
