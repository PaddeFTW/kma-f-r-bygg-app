# KMA för bygg – Underlag från byggpärm (Flik 1–31)

**Syfte:** Strukturerat kunskapsunderlag från KMA-mallen (KvalitetsDokument.se / Kvalitetsgruppen) för webbappen KMA för bygg och entreprenad.

**Källa:** Uppladdade DOCX-filer från byggpärmen (Flik 1–31). Innehållsförteckning bekräftad.

**Användning i appen:**  
Används av Cursor via prompter för att bygga formulär, checklistor, dokumentgeneratorer, projektstruktur och bevis.  
Se `CURSOR_PROMPT.md` för hur Grok/Cursor ska använda materialet.

## Fliköversikt

| Flik | Namn | Typ | App-användning | Prioritet |
|------|------|-----|----------------|-----------|
| 1 | Projektbeskrivning | Formulär | Projektstart, grunddata | Hög |
| 2 | Organisation | Formulär/roller | Roller, kontakt, ansvar | Hög |
| 3 | Beställarens organisation | Formulär | Byggherre/kontakt | Medel |
| 4 | Underleverantörer (organisation) | Formulär | UE-hantering | Hög |
| 5 | Kvalitetsplan | Plan/policy | Kvalitetsstyrning | Hög |
| 6 | Miljöplan | Plan/policy | Miljöaspekter | Hög |
| 7 | Arbetsmiljöplan | Plan/policy | AMP, skyddsregler | Hög |
| 8 | Miljöanalys | Analys | Miljöaspekter, källsortering | Hög |
| 9 | Rivningsplan | Formulär | Rivning, avfall | Medel |
| 10 | Protokoll – byggmöte | Protokoll | Möten, beslut | Medel |
| 11 | Bygghandlingar / relationsritningar | Placeholder | Dokumentarkiv | Låg |
| 12 | Kontrollplan | Formulär | PBL, egenkontroll | Hög |
| 13 | Egenkontroller (mall + varianter) | Checklista | Egenkontroll | Hög |
| 14 | Egenkontroller från UE | Lista | UE-bevis | Medel |
| 15 | Inventering av maskiner för UE | Lista | Maskiner/behörighet | Medel |
| 16 | ÄTA / Avvikelserapport / ÄTA-lista | Formulär | Ändringar, avvikelser | Hög |
| 17 | Säkerhetsdatablad | Lista | Kemikalier, SDB | Hög |
| 18 | Nödlägesberedskap | Rutin | Nödläge, larm | Hög |
| 19 | Anhöriglista | Lista | Personal, anhöriga | Medel |
| 20 | Krisberedskap | Rutin/handlingsplan | Kris, olycka | Hög |
| 21 | Skydds- och miljörond | Checklista | Skyddsrond | Hög |
| 22 | Ekonomi, betalningsplan | Placeholder | Ekonomi | Låg |
| 23 | Arbetsplatsbesiktning | Checklista | Förbesiktning | Medel |
| 24 | Slutbesiktningsprotokoll | Placeholder | Besiktning | Medel |
| 25 | Uppföljning Arbetsmiljö | Checklista | Uppföljning AM | Hög |
| 26 | Uppföljning Kvalitet | Checklista | Uppföljning kvalitet | Hög |
| 27 | Uppföljning Miljö | Checklista | Uppföljning miljö | Hög |
| 28 | Riskbedömning + Lagar | Riskmatris | Riskbedömning, AFS | Hög |
| 29 | Kvitteringslistor | Kvittering | Information, bevis | Hög |
| 30 | Checklista byggpärm | Checklista | Pärmkontroll | Hög |
| 31 | Distribution och signering | Signering | Godkännande | Medel |

## Struktur i denna mapp

- `INDEX.md` – denna översikt
- `flikar-01-04-organisation.md`
- `flikar-05-07-planer.md`
- `flikar-08-12-analys-kontroll.md`
- `flikar-13-16-egenkontroll-ata.md`
- `flikar-17-21-sakerhet-rond.md`
- `flikar-22-31-uppfoljning-avslut.md`
- `CURSOR_PROMPT.md` – prompt för Cursor

**Regler:**  
- Extrahera endast från källorna.  
- Inga påhittade krav.  
- Enkel svenska.  
- Fält och checklistor ska kunna bli formulär i appen.
