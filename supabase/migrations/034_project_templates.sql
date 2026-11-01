-- KMA för bygg: Återanvändbara projekt-/flikmallar (företagsbundna)
-- Kör i Supabase SQL Editor efter 033_company_contacts.sql.
-- Innehåller formulärdata (snapshot); inte delningslänkar eller signaturer.

create table if not exists public.project_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null,
  description text,
  scope text not null default 'project'
    check (scope in ('project', 'flik')),
  flik_nr integer
    check (flik_nr is null or (flik_nr >= 1 and flik_nr <= 31)),
  flik_nrs integer[] not null default '{}'::integer[],
  payload jsonb not null default '{}'::jsonb,
  source_project_id uuid references public.projects (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_templates_flik_scope_chk check (
    (scope = 'project' and flik_nr is null)
    or (scope = 'flik' and flik_nr is not null)
  )
);

create index if not exists project_templates_company_id_idx
  on public.project_templates (company_id);
create index if not exists project_templates_user_id_idx
  on public.project_templates (user_id);
create index if not exists project_templates_scope_flik_idx
  on public.project_templates (company_id, scope, flik_nr);

alter table public.project_templates enable row level security;

create policy "Users can select own project templates"
  on public.project_templates for select
  using (auth.uid() = user_id);

create policy "Users can insert own project templates"
  on public.project_templates for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.companies c
      where c.id = company_id and c.user_id = auth.uid()
    )
  );

create policy "Users can update own project templates"
  on public.project_templates for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.companies c
      where c.id = company_id and c.user_id = auth.uid()
    )
  );

create policy "Users can delete own project templates"
  on public.project_templates for delete
  using (auth.uid() = user_id);
