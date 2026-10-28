# Nivåer – Låg / Mellan / PRO

Använd nivåerna när du planerar vad som ska byggas i en app från den här mallen.

## Låg

- Enkel CRUD-modul (lista + detalj)
- E-post/lösenord via Supabase Auth
- En tabell, RLS per användare
- Minimal navigation (Dashboard + en modul)
- Deploy på Vercel med env-variabler

**Exempel:** Uppgifter i den här mallen.

## Mellan

- Flera relaterade moduler
- Roller (t.ex. admin / användare)
- Filter, sök, statusflöden
- Enklare export (CSV/Excel)
- Delade layoutkomponenter och tydliga docs

## PRO

- Full produkt med flera domäner
- Avancerad behörighet, organisation/tenant
- Offline/synk, filer, PDF-export
- Integrationspunkter och observability
- Strikt Design/QA mot Figma + knowledge-base

## Välj nivå

| Fråga | Låg | Mellan | PRO |
|-------|-----|--------|-----|
| Antal kärnmoduler | 1 | 2–4 | 5+ |
| Behörighet | En användare | Roller | Org + roller |
| Data | En tabell | Relaterade tabeller | Domänmodell |
| Leveranstid | Dagar | Veckor | Månader |

Starta alltid **Låg** om osäker. Höj nivå när verkliga behov finns – inte i förväg.
