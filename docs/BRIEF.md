# Brief – frågeflöde som skapar utkast

Använd det här flödet innan Cursor bygger en ny app eller modul. Svara kort. Resultatet blir ett utkast till krav + Cursor-prompt.

## Frågor

1. **Vad heter produkten/appen?**
2. **Vilket problem löser den (en mening)?**
3. **Vem är huvudanvändaren?**
4. **Nivå:** Låg / Mellan / PRO? (se `NIVÅER.md`)
5. **Vilken är den första modulen** (lista + detalj)?
6. **Vilka fält** behöver listan/detaljen?
7. **Auth:** e-post + lösenord räcker? Annars vad?
8. **Data i Supabase:** vilka tabeller?
9. **Design:** följer Materio V3 rakt av, eller vilka undantag?
10. **Definition of Done** för första leveransen?

## Utkastmall (fyll i svaren)

```text
PRODUCT
Name:
Problem:
User:
Level:

FIRST MODULE
Name:
List fields:
Detail fields:
Statuses:

TECH
Auth: Supabase email/password
Tables:
Deploy: Vercel + Supabase

DESIGN
Figma: Materio V3 (docs/DESIGN.md)
Exceptions:

DONE WHEN
- [ ] Login works
- [ ] Module list + detail persists
- [ ] Light/dark theme
- [ ] npm run build passes
```

## Cursor-prompt från utkastet

```text
CURRENT STATE
Mall: vite-mui-materio-template. Auth + Uppgifter finns som mönster.

TASK
Bygg [modul] enligt utkastet ovan.

FILES / AREA
src/pages/...
src/layouts/
docs/

REQUIREMENTS
- Materio V3 (docs/DESIGN.md)
- Skyddade routes
- Lista + detalj mot Supabase

CONSTRAINTS
- Arbetsbranch, merga inte till main
- Inga tunga nya bibliotek

ACCEPTANCE CRITERIA
- [ ] ...
```

När utkastet är klart: ge det till Grok för granskning, sedan till Cursor för implementation (`ARBETSMODELL.md`).
