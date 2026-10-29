# Vite + MUI Materio V3 – startmall

KMA för bygg – startapp med Materio V3-design, ljus/mörk tema, Supabase-auth, **Företagskonto**, **Projekt** (lista + detalj) och Dashboard-översikt.

## Teknik

- Vite + React
- MUI (Material UI) – Materio V3-tokens
- React Router
- Supabase (Auth + Postgres)
- Vercel (`vercel.json` för SPA-routing)

## Starta projektet

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```

Öppna den lokala URL:en Vite skriver ut (vanligen `http://localhost:5173`).

```bash
npm run build    # produktionbuild → dist/
npm run preview  # förhandsgranska build
```

## Koppla Supabase

1. Skapa ett Supabase-projekt på [supabase.com](https://supabase.com).
2. Fyll i `.env` (värden från Project Settings → API):

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

3. Kör SQL för `companies` + `projects` + projektstart (se [`supabase/migrations/001_companies_projects.sql`](supabase/migrations/001_companies_projects.sql), [`supabase/migrations/002_projektstart_flik1_2.sql`](supabase/migrations/002_projektstart_flik1_2.sql) och [`docs/DEPLOY.md`](docs/DEPLOY.md)).
4. Starta om `npm run dev`.
5. Gå till `/login`, registrera dig och logga in.

Skyddade sidor (`/`, `/company`, `/projects`) kräver inloggning.

## Deploya på Vercel

`vercel.json` finns i root och skickar alla routes till `index.html` (React Router).

1. Pusha branchen till GitHub.
2. Importera projektet i [Vercel](https://vercel.com) (Framework: **Vite**).
3. Sätt env-variabler:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy → öppna `/login` och testa.

Steg-för-steg: [`docs/DEPLOY.md`](docs/DEPLOY.md).

## Skapa en ny app från mallen

1. Forka eller kopiera repot. Byt namn i sidebar/login och `package.json`.
2. Kör frågeflödet i [`docs/BRIEF.md`](docs/BRIEF.md).
3. Välj nivå i [`docs/NIVÅER.md`](docs/NIVÅER.md).
4. Följ [`docs/ARBETSMODELL.md`](docs/ARBETSMODELL.md) (Grok skriver prompt → Cursor bygger i arbetsbranch).
5. Använd knowledge-base för termer och ISO – se nedan.
6. Kopiera mönstret från `src/pages/uppgifter/` för nya moduler (lista + detalj).
7. Håll designen enligt [`docs/DESIGN.md`](docs/DESIGN.md) och Figma V3.
8. Committa till arbetsbranch. Merga inte till `main` förrän QA är klar.

## Knowledge-base

Alla appar från den här mallen ska använda:

**https://github.com/PaddeFTW/knowledge-base**

Där finns termer, definitioner, ISO-kunskap, originalprodukter och standarder.  
Ändra inte knowledge-base från en app – app-specifika beslut hör hemma i appens egna `docs/`.

Detaljer: [`docs/KNOWLEDGE_BASE.md`](docs/KNOWLEDGE_BASE.md).

## Struktur

```text
src/
  theme/              → Materio V3 light/dark
  layouts/            → Sidebar + topbar (Dashboard, Företag, Projekt)
  pages/              → Dashboard, company, projects, auth (+ mallsidor)
  lib/supabase.ts     → Supabase-klient + typer
  context/            → Auth, theme, users
  components/         → ProtectedRoute, auth UI
supabase/migrations/  → companies + projects (RLS)
public/               → logo.svg, favicon, illustrations
docs/                 → Design, deploy, arbetsmodell, knowledge-base
vercel.json           → SPA rewrites för Vercel
```

## Dokumentation

| Fil | Innehåll |
|-----|----------|
| [`docs/DESIGN.md`](docs/DESIGN.md) | Figma-länk + UI-regler |
| [`docs/KNOWLEDGE_BASE.md`](docs/KNOWLEDGE_BASE.md) | Obligatorisk knowledge-base-koppling |
| [`docs/NIVÅER.md`](docs/NIVÅER.md) | Låg / Mellan / PRO |
| [`docs/BRIEF.md`](docs/BRIEF.md) | Frågeflöde → utkast |
| [`docs/ARBETSMODELL.md`](docs/ARBETSMODELL.md) | Grok + Cursor |
| [`docs/DEPLOY.md`](docs/DEPLOY.md) | Vercel + Supabase |

## QA-checklista

- [ ] UI matchar Materio V3 (färger, sidebar, topbar, kort)
- [ ] Cyan logotyp syns i sidebar, login och som favicon
- [ ] Ljus/mörk tema går att växla
- [ ] Login med Supabase fungerar
- [ ] Företagskonto sparas och visas
- [ ] Projekt sparas och visas (lista + detalj)
- [ ] Dashboard visar företag + projektöversikt
- [ ] `vercel.json` finns och deep links fungerar efter deploy
- [ ] `npm run build` går igenom
