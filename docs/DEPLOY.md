# Deploy – Vercel + Supabase

## 1. Supabase

1. Skapa projekt på [supabase.com](https://supabase.com).
2. Kopiera **Project URL** och **anon public** key.
3. Lokalt: kopiera `.env.example` → `.env` och fyll i:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. I SQL Editor, kör:

```sql
create table if not exists public.uppgifter (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'öppen'
    check (status in ('öppen', 'pågående', 'klar')),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.uppgifter enable row level security;

create policy "Users can select own uppgifter"
  on public.uppgifter for select
  using (auth.uid() = user_id);

create policy "Users can insert own uppgifter"
  on public.uppgifter for insert
  with check (auth.uid() = user_id);

create policy "Users can update own uppgifter"
  on public.uppgifter for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own uppgifter"
  on public.uppgifter for delete
  using (auth.uid() = user_id);
```

5. Auth → Providers: Email aktiverat. För snabb lokal test kan du stänga av “Confirm email”.

## 2. Vercel

`vercel.json` i repo-roten sköter SPA-routing (alla routes → `index.html`).

### Kort instruktion

1. Pusha branchen till GitHub.
2. Gå till [vercel.com](https://vercel.com) → **Add New Project** → importera repot.
3. Framework Preset: **Vite** (auto-detekteras). Build: `npm run build`, Output: `dist`.
4. Under **Environment Variables**, lägg till (Production + Preview):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Klicka **Deploy**.
6. Öppna URL:en → `/login` → testa registrering och Uppgifter.

CLI-alternativ:

```bash
npx vercel
npx vercel --prod
```

## 3. Efter deploy

- Öppna appen → `/login`
- Registrera användare → skapa en uppgift → verifiera i Supabase Table Editor
- Kontrollera ljus/mörk tema
- Kontrollera att deep links fungerar (`/users`, `/apps/calendar`, `/uppgifter/...`)

## Felsökning

| Symptom | Åtgärd |
|---------|--------|
| “Supabase saknas” | Env-variabler saknas eller fel prefix (`VITE_`) |
| RLS / permission denied | Policies saknas eller `user_id` matchar inte |
| Tom lista trots data | Inloggad som annan user, eller fel projekt-URL |
| 404 på refresh / deep link | Kontrollera att `vercel.json` med SPA-rewrite finns |
| Build fail | Kör `npm run build` lokalt, fixa fel innan push |
