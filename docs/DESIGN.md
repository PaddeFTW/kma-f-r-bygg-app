# Design – Materio V3

## Figma-källa

All UI ska följa denna design:

https://www.figma.com/design/W3ehXVRFGV79bW5r4mL5ui/materio-figma-admin-dashboard-uikit-V3.0.0?node-id=7316-63439&t=xsv9kxYzdIjYkbtv-1

`vite-mui-materio-template` är den tekniska implementeringen av denna design.

## Regler

1. **Färger** – Primary `#8C57FF`, info/cyan `#16B1FF`, success `#56CA00`, warning `#FFB400`, error `#FF4C51`.
2. **Bakgrund** – Ljus: `#F4F5FA` / paper `#FFFFFF`. Mörk: `#28243D` / paper `#312D4B`.
3. **Typografi** – Public Sans. Rubriker vikt 500, knappar utan uppercase.
4. **Layout** – Vertikal sidebar (~260px) + topbar. Innehåll i kort med mjuk skugga och `borderRadius: 6`.
5. **Tema** – Stöd både ljus och mörk mode. Växla via topbar.
6. **Logotyp** – Cyan symbol (cirkel + streck) i `public/logo.svg` och som favicon. Syns i sidebar och på login.
7. **Komponenter** – Återanvänd MUI Card, Button, Table, Dialog. Undvik egna “card-in-card”-lager.
8. **Nya sidor** – Lista + detalj är standardmönstret. Matcha spacing och kortstil mot Dashboard/Uppgifter.

## QA mot Figma

- Sidebar: logotyp, aktiv meny med lila tint
- Topbar: transparens/papper, tema-toggle, avatar
- Kort: radius, skugga, ikonbadge med färgad bakgrund
- Login: centrerat kort på ljus/mörk bakgrund
