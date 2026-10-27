# stavewise-web

Website stavewise.app: statisch mit Astro gebaut, ohne JavaScript im Browser.
Entscheidungen: wasseramseleo/stavewise#545, Umsetzung: Spec wasseramseleo/stavewise#591.
Umsetzung per PR nach `main`.

## Befehle

Node 22 (`.nvmrc`), dann `npm ci`.

- `npm run dev`: Entwicklungsserver unter http://localhost:4321/de/ (die Weiche auf `/` macht erst nginx).
- `npm run check`: alle Prüfungen nacheinander: `astro check`, `astro build`, `html-validate` über `dist/`, `npm run linkcheck` (lychee offline gegen `dist/`, nur interne Links; `lychee` vom PATH, sonst Docker-Image `lycheeverse/lychee:0.24.2`) und die Tests gegen `dist/` (`npm run test:dist`, Vitest mit jsdom) und die Skript-Tests (`npm run test:scripts`: `scripts/deploy-guard.test.sh` und `scripts/shots-lib.test.mjs`).
- `npm run lint:workflows`: `actionlint` über `.github/workflows/` (`actionlint` vom PATH, sonst Docker-Image `rhysd/actionlint:1.7.12`).
- `npm run shots`: Seitenbilder für die Freigabe: alle acht Seiten, hell und dunkel, 1440 px und 390 px breit, ganze Seite, als `shots/<lang>-<seite>-<hell|dunkel>-<breit|schmal>.png` (32 Bilder) mit der Übersicht `shots/index.html`. Braucht ein gebautes `dist/` (`npm run build`) und einmal `npx playwright install chromium`; nicht Teil von `npm run check` und nicht in der CI. Bricht ab, wenn eine Seite nicht `200` liefert oder ein Bild leer ist (≤ 10 KB).
- `npm run test:nginx`: nginx (Docker, `nginx:1.28-alpine`) mit der Server-Konfiguration aus `ops/nginx/` gegen `dist/`; prüft Sprachweiche, Cache- und Sicherheits-Kopfzeilen und die Weiterleitungen von `www` und Port 80. Baut nicht selbst, also nach `npm run check`.

Fertig heißt: `npm run check` ist grün und die Ausgabe ist gezeigt. Die CI (`.github/workflows/check.yml`) führt dasselbe und danach `npm run test:nginx` aus, aber erst, wenn das Repo öffentlich ist: Auf privaten Repos kosten die Minuten Geld, der Job wird bis dahin übersprungen.

## Aufbau

- `src/pages/{de,en}/`: die acht Seiten (`index`, `beta`, `privacy`, `impressum`), gebaut als `dist/de/beta/index.html` usw.; unter `/` liegt keine Seite.
- `src/layouts/Base.astro`: Kopf (Schriftzug, Pille „Beta“), Fuß, Sprachlink, `hreflang`.
- `src/texts/<seite>.ts`: Texte je Seite mit `de` und `en`; Kopf und Fuß in `src/texts/layout.ts`.
- `src/components/`: `Wordmark.astro`, `BrandMark.astro` (Inline-SVG aus `docs/marke/` im Repo `stavewise`), `Pruefen.astro` (sichtbare Markierung **[prüfen]** für Stellen, die Leo noch prüft).
- `src/styles/tokens.css`: App-Tokens hell und dunkel nach `prefers-color-scheme` (`docs/konzept-v1.md` § 12.5); `src/styles/base.css`: Schriften und Komponenten aus dem Prototyp.
- `src/site.ts`: `siteUrl`, `supportMail`, `betaFormUrl` (bis zum Formular `null`).
- `public/fonts/`: Instrument Sans und JetBrains Mono als WOFF2 mit OFL-Texten; `public/favicon.svg`.
- `tests/dist/`: Tests gegen das Bauergebnis.
- `ops/nginx/`: vhost `stavewise.app.conf` (Maps, TLS, Weiterleitungen) und `stavewise-site.conf` (Wurzel `/opt/stavewise/web`, Sprachweiche, Kopfzeilen, Logs) für den VPS; `test/` und `test.sh` für `npm run test:nginx`.
- `ops/logrotate/stavewise-web`: Rohlogs 14 Tage.
- `ops/goaccess/`: GoAccess mit gekürzten IP-Adressen, stündlich per systemd-Timer, Bericht außerhalb der Website-Wurzel.

## Ausrollen

`.github/workflows/deploy.yml` baut bei Push auf `main` (oder von Hand per `workflow_dispatch`), führt `npm run check` aus und lädt `dist/` per `rsync` hoch. Auf dem VPS nimmt der Nutzer `deploy-stavewise` nur `rrsync -wo /opt/stavewise/web` an (wasseramseleo/stavewise#538 Punkt 10). Die vier Secrets `DEPLOY_SSH_KEY`, `DEPLOY_SSH_KNOWN_HOSTS`, `DEPLOY_SSH_HOST` und `DEPLOY_SSH_USER` (#538 Punkt 7) prüft `scripts/deploy-guard.sh`: Fehlt eines, endet der Lauf grün mit dem Hinweis „Deploy übersprungen: Secrets fehlen“ und sendet nichts. Der erste echte Lauf passiert erst nach dem Runbook [`docs/ops/vps.md`](docs/ops/vps.md), das den VPS Schritt für Schritt einrichtet (Deploy-Nutzer, Secrets, nginx, certbot, logrotate, GoAccess) und den ersten Deploy abnimmt. Wie `check.yml` läuft der Job nicht, solange das Repo privat ist.
