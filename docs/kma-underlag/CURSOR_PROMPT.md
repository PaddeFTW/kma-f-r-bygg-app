# Cursor-prompt – Använd KMA-underlag för Flik 1–31

**Syfte:** Instruktion till Cursor för hur underlaget i `docs/kma-underlag/` ska användas när moduler byggs i KMA för bygg-appen.

## CURRENT STATE
- Repo: `PaddeFTW/kma-f-r-bygg-app`
- Teknik: Vite + React + MUI Materio V3 + Supabase
- Arbetsmodell: Grok skriver prompt → Cursor bygger i arbetsbranch
- Underlag: `docs/kma-underlag/` innehåller strukturerad kunskap från hela KMA-byggpärmen (Flik 1–31)

## TASK
När du bygger en modul (t.ex. projektstart, AMP, egenkontroll, riskbedömning, skyddsrond, ÄTA):

1. Läs relevant fil i `docs/kma-underlag/` (se INDEX.md).
2. Använd fält, checklistor och regler därifrån – hitta inte på nya krav.
3. Bygg enligt standardmönster: lista + detalj, Supabase-tabell + RLS, nav i sidebar.
4. Behåll enkel svenska. Använd "krav" eller "avsnitt", inte "klausul".
5. Hänvisa till andra flikar där källan gör det.

## FILES / AREA
- `docs/kma-underlag/INDEX.md` – översikt
- `docs/kma-underlag/flikar-*.md` – detaljerade fält och checklistor
- `src/pages/` – nya moduler
- `src/layouts/` – nav
- `supabase/migrations/` – nya tabeller

## REQUIREMENTS
- Materio V3 (docs/DESIGN.md)
- Skyddade routes
- Lista + detalj mot Supabase
- Fält och status enligt underlaget
- Inga påhittade ISO- eller lagkrav

## CONSTRAINTS
- Arbetsbranch – merga inte till main
- Inga tunga nya bibliotek
- Ändra inte knowledge-base-repot
- App-specifik logik hör hemma i denna apps docs

## ACCEPTANCE CRITERIA
- [ ] Modulen använder fält från rätt flik-underlag
- [ ] Lista + detalj fungerar
- [ ] Data sparas i Supabase
- [ ] Nav uppdaterad
- [ ] `npm run build` går igenom
- [ ] Enkel svenska

## Hur underlaget hittas
- Starta alltid i `docs/kma-underlag/INDEX.md`
- Välj flikgrupp (t.ex. `flikar-13-16-egenkontroll-ata.md` för egenkontroll/ÄTA)
- Extrahera fält och checklistor till formulär och tabeller
- Behåll kopplingar mellan flikar (t.ex. Flik 7 → Flik 21 och 28)

**Exempel på första modul:** Projektstart (Flik 1 + delar av Flik 2) – grunddata och roller.
