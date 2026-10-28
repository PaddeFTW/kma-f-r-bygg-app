# Arbetsmodell – Grok + Cursor

Frontend-mall: `vite-mui-materio-template` (Materio V3 / MUI / Vite)  
Backend/data: Supabase (Auth + Postgres)  
Git-repo är source of truth.

## Roller

| Roll | Aktör | Gör | Gör inte |
|------|-------|-----|----------|
| Architect / reviewer | Grok | Analyserar, skriver krav och Cursor-prompt, granskar | Skriver inte produktionskod |
| Builder | Cursor | Implementerar i arbetsbranch, testar, commit:ar | Mergar inte till `main` själv |
| Source of truth | Git | Kod + docs | — |

## Designkälla

Se `DESIGN.md` och Figma:

https://www.figma.com/design/W3ehXVRFGV79bW5r4mL5ui/materio-figma-admin-dashboard-uikit-V3.0.0?node-id=7316-63439&t=xsv9kxYzdIjYkbtv-1

## Arbetsflöde

1. Kör frågeflödet i `BRIEF.md` → utkast.
2. Välj nivå i `NIVÅER.md`.
3. Grok skriver avgränsad Cursor-prompt (CURRENT STATE / TASK / FILES / REQUIREMENTS / CONSTRAINTS / ACCEPTANCE).
4. Cursor bygger i **arbetsbranch** (inte direkt på `main`).
5. Du granskar (UI mot Figma, login, CRUD, `npm run build`).
6. Grok justerar → nästa prompt.

En modul i taget.

## Standardmönster för modul

- Lista med “Lägg till”
- Detaljsida med allt samlat
- Supabase-tabell + RLS
- Länk/nav i sidebar
- Docs uppdaterade vid behov

## Project state (valfritt i varje prompt)

```text
PROJECT STATE
Product:
Repository: vite-mui-materio-template (eller fork)
Current phase:
Completed:
In progress:
Next:
Blocked:
Open questions:
```
