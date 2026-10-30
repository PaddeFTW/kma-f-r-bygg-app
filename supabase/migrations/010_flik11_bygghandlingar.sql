-- KMA för bygg: Flik 11 Bygghandlingar / relationsritningar
-- Dokumentarkiv (placeholder) för ritningar och handlingar per projekt.
-- Kör i Supabase SQL Editor efter tidigare flik-migrationer.
-- Numrering 010 lämnar plats för Flik 8–10 (007–009) om de saknas på main.

create table if not exists public.bygghandlingar (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Dokumentuppgifter (placeholder-arkiv)
  namn text not null,
  beskrivning text,
  -- ritning | relationsritning | handling
  typ text,
  -- Extern länk eller lagrad filreferens
  file_url text,
  file_path text,
  file_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bygghandlingar_project_id_idx on public.bygghandlingar (project_id);
create index if not exists bygghandlingar_company_id_idx on public.bygghandlingar (company_id);
create index if not exists bygghandlingar_user_id_idx on public.bygghandlingar (user_id);

alter table public.bygghandlingar enable row level security;

create policy "Users can select own bygghandlingar"
  on public.bygghandlingar for select
  using (auth.uid() = user_id);

create policy "Users can insert own bygghandlingar"
  on public.bygghandlingar for insert
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

create policy "Users can update own bygghandlingar"
  on public.bygghandlingar for update
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

create policy "Users can delete own bygghandlingar"
  on public.bygghandlingar for delete
  using (auth.uid() = user_id);

-- Storage-bucket för uppladdade filer (privat, RLS via folder = auth.uid())
insert into storage.buckets (id, name, public)
values ('bygghandlingar', 'bygghandlingar', false)
on conflict (id) do nothing;

create policy "Users can select own bygghandlingar files"
  on storage.objects for select
  using (
    bucket_id = 'bygghandlingar'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can insert own bygghandlingar files"
  on storage.objects for insert
  with check (
    bucket_id = 'bygghandlingar'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update own bygghandlingar files"
  on storage.objects for update
  using (
    bucket_id = 'bygghandlingar'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own bygghandlingar files"
  on storage.objects for delete
  using (
    bucket_id = 'bygghandlingar'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
