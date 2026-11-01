-- KMA för bygg: Flik 22 Ekonomi, betalningsplan
-- Dokumentarkiv (placeholder) för betalningsplan per projekt.
-- Kör i Supabase SQL Editor efter 020_flik21_skyddsrond.sql.

create table if not exists public.ekonomi (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Dokumentuppgifter (placeholder-arkiv)
  namn text not null,
  beskrivning text,
  -- Extern länk eller lagrad filreferens
  file_url text,
  file_path text,
  file_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ekonomi_project_id_idx on public.ekonomi (project_id);
create index if not exists ekonomi_company_id_idx on public.ekonomi (company_id);
create index if not exists ekonomi_user_id_idx on public.ekonomi (user_id);

alter table public.ekonomi enable row level security;

create policy "Users can select own ekonomi"
  on public.ekonomi for select
  using (auth.uid() = user_id);

create policy "Users can insert own ekonomi"
  on public.ekonomi for insert
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

create policy "Users can update own ekonomi"
  on public.ekonomi for update
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

create policy "Users can delete own ekonomi"
  on public.ekonomi for delete
  using (auth.uid() = user_id);

-- Storage-bucket för uppladdade filer (privat, RLS via folder = auth.uid())
insert into storage.buckets (id, name, public)
values ('ekonomi', 'ekonomi', false)
on conflict (id) do nothing;

create policy "Users can select own ekonomi files"
  on storage.objects for select
  using (
    bucket_id = 'ekonomi'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can insert own ekonomi files"
  on storage.objects for insert
  with check (
    bucket_id = 'ekonomi'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update own ekonomi files"
  on storage.objects for update
  using (
    bucket_id = 'ekonomi'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own ekonomi files"
  on storage.objects for delete
  using (
    bucket_id = 'ekonomi'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
