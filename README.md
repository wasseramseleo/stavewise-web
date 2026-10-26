# stavewise-web

Website stavewise.app: statisch mit Astro gebaut, ohne JavaScript im Browser.
Entscheidungen: wasseramseleo/stavewise#545, Umsetzung: Spec wasseramseleo/stavewise#591.
Umsetzung per PR nach `main`.

## Befehle

Node 22 (`.nvmrc`), dann `npm ci`.

- `npm run dev`: Entwicklungsserver unter http://localhost:4321/de/ (die Weiche auf `/` macht erst nginx).
- `npm run check`: alle Prüfungen nacheinander: `astro check`, `astro build`, `html-validate` über `dist/`, `npm run linkcheck` (lychee offline gegen `dist/`, nur interne Links; `lychee` vom PATH, sonst Docker-Image `lycheeverse/lychee:0.24.2`) und die Tests gegen `dist/` (`npm run test:dist`, Vitest mit jsdom).

Fertig heißt: `npm run check` ist grün und die Ausgabe ist gezeigt. Die CI (`.github/workflows/check.yml`) führt dasselbe aus, aber erst, wenn das Repo öffentlich ist: Auf privaten Repos kosten die Minuten Geld, der Job wird bis dahin übersprungen.

## Aufbau

- `src/pages/{de,en}/`: die acht Seiten (`index`, `beta`, `privacy`, `impressum`), gebaut als `dist/de/beta/index.html` usw.; unter `/` liegt keine Seite.
- `src/layouts/Base.astro`: Kopf (Lockup, Pille „Beta“), Fuß, Sprachlink, `hreflang`.
- `src/texts/<seite>.ts`: Texte je Seite mit `de` und `en`; Kopf und Fuß in `src/texts/layout.ts`.
- `src/components/`: `Lockup.astro`, `BrandMark.astro` (Inline-SVG aus `docs/marke/` im Repo `stavewise`), `Pruefen.astro` (sichtbare Markierung **[prüfen]** für Stellen, die Leo noch prüft).
- `src/styles/tokens.css`: App-Tokens hell und dunkel nach `prefers-color-scheme` (`docs/konzept-v1.md` § 12.5); `src/styles/base.css`: Schriften und Komponenten aus dem Prototyp.
- `src/site.ts`: `siteUrl`, `supportMail`, `betaFormUrl` (bis zum Formular `null`).
- `public/fonts/`: Instrument Sans und JetBrains Mono als WOFF2 mit OFL-Texten; `public/favicon.svg`.
- `tests/dist/`: Tests gegen das Bauergebnis.
