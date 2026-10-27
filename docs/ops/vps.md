# Runbook: VPS für stavewise.app einrichten

Mit diesem Runbook richtet Leo (oder Claude Code mit SSH-Zugang) den VPS für `stavewise.app` Schritt für Schritt ein und nimmt den ersten Deploy ab. Jeder Schritt nennt die Befehle, was zu erwarten ist und wie man es prüft. Erst wenn die Prüfung eines Schritts stimmt, kommt der nächste.

Quellen: wasseramseleo/stavewise#545 („VPS“, „Checkliste für Leo“), #538 Punkt 7 und 10, #542 Entscheidung 9, Recherche `docs/research/cicd-play.md` Abschnitt 3 und 6 (Branch `research/cicd-play` im Repo `stavewise`). Die Server-Dateien liegen in diesem Repo unter `ops/`; das Runbook kopiert sie nicht, sondern sagt, wohin sie kommen. Ändert sich eine Datei in `ops/`, gilt die Datei.

## Platzhalter und Orte

Das Runbook nennt keine geheimen Werte.

- `<vps>`: Hostname oder IP-Adresse des VPS, über die der Laptop und GitHub ihn per SSH erreichen. Überall derselbe Wert, auch in `known_hosts` und im Secret `DEPLOY_SSH_HOST`.
- `<admin>`: Leos eigener SSH-Nutzer auf dem VPS mit `sudo`.
- **Laptop**: Befehle in einem Klon von `wasseramseleo/stavewise-web` (`git clone https://github.com/wasseramseleo/stavewise-web.git && cd stavewise-web`), Stand `main`.
- **VPS**: Befehle nach `ssh <admin>@<vps>`; `sudo` steht dabei.

| Was | Im Repo | Auf dem VPS |
|---|---|---|
| Website-Wurzel (Ziel von `rsync`) | `dist/` nach `npm run build` | `/opt/stavewise/web` |
| ACME-Challenge (certbot) | – | `/opt/stavewise/acme` |
| GoAccess-Datenbank und Bericht | – | `/opt/stavewise/goaccess/db`, `/opt/stavewise/goaccess/report.html` |
| vhost | `ops/nginx/stavewise.app.conf` | `/etc/nginx/sites-available/stavewise.app`, Symlink in `/etc/nginx/sites-enabled/` |
| Site-Regeln | `ops/nginx/stavewise-site.conf` | `/etc/nginx/snippets/stavewise-site.conf` |
| logrotate | `ops/logrotate/stavewise-web` | `/etc/logrotate.d/stavewise-web` |
| GoAccess-Konfiguration | `ops/goaccess/goaccess.conf` | `/etc/goaccess/stavewise.conf` |
| GoAccess-Dienst und -Timer | `ops/goaccess/stavewise-goaccess.service`, `ops/goaccess/stavewise-goaccess.timer` | `/etc/systemd/system/` |
| Deploy-Nutzer | `.github/workflows/deploy.yml` | `deploy-stavewise`, `/home/deploy-stavewise/.ssh/authorized_keys` |
| Logs | – | `/var/log/nginx/stavewise/access.log`, `/var/log/nginx/stavewise/error.log` |

## 1. Voraussetzungen

DNS ist erledigt (#545, 26.10.2026): `stavewise.app` und `www.stavewise.app` zeigen auf `37.252.188.123`. Der VPS hat IPv6 (`2a00:63c1:d:123::2`, nginx lauscht auf `[::]`), einen AAAA-Eintrag gibt es bisher nicht; er ist optional. Auf dem VPS läuft bereits eine bestehende Seite; sie bleibt unangetastet: Kein Schritt ändert ihre Dateien, die `nginx.conf` oder den `default_server`.

**Laptop:**

```sh
dig +short A stavewise.app
dig +short A www.stavewise.app
dig +short AAAA stavewise.app
```

Erwartet: zweimal `37.252.188.123`, für AAAA keine Ausgabe.

**VPS:**

```sh
cat /etc/os-release | head -n 2
sudo apt update
command -v certbot   # auf diesem VPS schon per Snap installiert (/usr/local/bin/certbot)
sudo apt install nginx rsync goaccess   # certbot nur per apt, wenn es noch keins gibt
rsync --version | head -n 1
command -v rrsync
goaccess --version | head -n 1
nginx -v
# Stand der bestehenden Seite festhalten, zum Vergleich in Schritt 7 und 11:
sudo nginx -T > ~/nginx-vorher.txt 2>&1
ls -l /etc/nginx/sites-enabled/
```

Erwartet und Prüfung:

- Debian oder Ubuntu; `apt install` meldet die Pakete als installiert oder schon vorhanden.
- `rsync  version 3.2.4` oder neuer: Ab 3.2.4 liegt `rrsync` als Programm bei. `command -v rrsync` gibt den Pfad aus, meist `/usr/bin/rrsync`. Gibt es keinen Pfad (älteres rsync, dort nur `/usr/share/doc/rsync/scripts/rrsync.gz`), hier anhalten: Ohne `rrsync` kein Deploy-Nutzer.
- `command -v certbot` gibt einen Pfad aus. Kommt certbot per Snap (`snap list certbot`, Timer `snap.certbot.renew.timer`), nicht zusätzlich `apt install certbot`: zwei certbots erneuern um die Wette.
- `goaccess --version`: Die Konfiguration nutzt `anonymize-level`, gemessen mit GoAccess 1.12; Debian 13 bringt 1.9.3 mit, das die Option kennt (`goaccess --help | grep anonymize-level`) (`ops/goaccess/goaccess.conf`). Ist die Version des Pakets älter und kennt die Option nicht (Schritt 9 meldet dann einen Fehler beim Start), GoAccess aus dem offiziellen Paket-Repo von goaccess.io installieren.
- `ls -l /etc/nginx/sites-enabled/` zeigt nur die bestehenden Seiten; kein `stavewise`-Eintrag.

## 2. Verzeichnisse

Der Deploy-Nutzer aus Schritt 3 besitzt die Website-Wurzel; nginx (`www-data`) liest nur. `/opt/stavewise/acme` ist die Wurzel der ACME-Challenge aus `ops/nginx/stavewise.app.conf`; GoAccess schreibt nach `/opt/stavewise/goaccess`, außerhalb der Website-Wurzel, also nicht öffentlich (#591 offene Frage 5). Der GoAccess-Dienst braucht das Verzeichnis, bevor er startet (`ReadWritePaths`).

**VPS** (die Website-Wurzel gehört zunächst `root`; Schritt 3 übergibt sie dem Deploy-Nutzer):

```sh
sudo install -d -m 755 -o root -g root /opt/stavewise
sudo install -d -m 755 -o root -g root /opt/stavewise/web
sudo install -d -m 755 -o root -g root /opt/stavewise/acme
sudo install -d -m 755 -o root -g root /opt/stavewise/goaccess /opt/stavewise/goaccess/db
# Eigenes Log-Verzeichnis: /etc/logrotate.d/nginx erfasst /var/log/nginx/*.log, aber keine Unterverzeichnisse.
sudo install -d -m 755 -o root -g adm /var/log/nginx/stavewise
ls -ld /opt/stavewise /opt/stavewise/*
```

Erwartet:

```
drwxr-xr-x ... root             root             ... /opt/stavewise
drwxr-xr-x ... root             root             ... /opt/stavewise/acme
drwxr-xr-x ... root             root             ... /opt/stavewise/goaccess
drwxr-xr-x ... root             root             ... /opt/stavewise/web
```

Prüfung: `sudo -u www-data ls /opt/stavewise/web` läuft ohne „Permission denied“ (das Verzeichnis ist noch leer).

## 3. Deploy-Nutzer `deploy-stavewise`

Ein eigener Nutzer ohne Passwort, der per SSH nur `rrsync -wo /opt/stavewise/web` ausführen kann (#538 Punkt 10). Er braucht trotzdem eine Shell (`/bin/sh`): sshd startet auch den erzwungenen Befehl aus `authorized_keys` über die Login-Shell des Nutzers, mit `/usr/sbin/nologin` scheitert jeder Deploy. Einen Shell-Login gibt es trotzdem nicht: Das Passwort ist gesperrt, und der Schlüssel darf wegen `command=` nichts anderes als `rrsync` starten; `restrict` schaltet PTY, Port-, Agent- und X11-Weiterleitung ab.

**VPS:**

```sh
sudo useradd --system --create-home --home-dir /home/deploy-stavewise --shell /bin/sh deploy-stavewise
sudo passwd -l deploy-stavewise
sudo install -d -m 700 -o deploy-stavewise -g deploy-stavewise /home/deploy-stavewise/.ssh
sudo chown deploy-stavewise:deploy-stavewise /opt/stavewise/web
ls -ld /opt/stavewise/web
# Erlaubt sshd nur bestimmte Nutzer, muss deploy-stavewise dazu:
sudo sshd -T | grep -Ei '^(allowusers|allowgroups|port) '
```

Erwartet: `drwxr-xr-x ... deploy-stavewise deploy-stavewise ... /opt/stavewise/web`.

**Laptop**, in einem Verzeichnis außerhalb des Repo-Klons (der Schlüssel darf nicht in ein Repo):

```sh
ssh-keygen -t ed25519 -N '' -C stavewise-web-deploy -f deploy_key
cat deploy_key.pub
```

Erwartet: zwei Dateien `deploy_key` (privat) und `deploy_key.pub`; die Ausgabe ist eine Zeile `ssh-ed25519 AAAA… stavewise-web-deploy`.

**VPS:** `authorized_keys` mit genau einer Zeile. `AAAA…` ist der Inhalt von `deploy_key.pub` zwischen `ssh-ed25519` und dem Kommentar:

```sh
sudo tee /home/deploy-stavewise/.ssh/authorized_keys > /dev/null <<'EOF'
restrict,command="rrsync -wo /opt/stavewise/web" ssh-ed25519 AAAA… stavewise-web-deploy
EOF
sudo chown deploy-stavewise:deploy-stavewise /home/deploy-stavewise/.ssh/authorized_keys
sudo chmod 600 /home/deploy-stavewise/.ssh/authorized_keys
sudo cat /home/deploy-stavewise/.ssh/authorized_keys
```

Lag `rrsync` in Schritt 1 nicht unter `/usr/bin` oder `/bin`, steht in `command=` der volle Pfad.

Prüfung:

- `sudo passwd -S deploy-stavewise` zeigt `L` (gesperrt).
- `sudo sshd -T` von oben: Steht dort `allowusers` oder `allowgroups`, ist `deploy-stavewise` darin enthalten (sonst in `/etc/ssh/sshd_config` ergänzen, `sudo sshd -t`, `sudo systemctl reload ssh`). `port` ist `22`: `deploy.yml` setzt keinen eigenen Port.
- **Laptop**: `ssh -i deploy_key -o IdentitiesOnly=yes deploy-stavewise@<vps>` öffnet keine Shell. rrsync meldet einen Fehler (etwa `rrsync error: SSH_ORIGINAL_COMMAND is not set` oder Hinweis auf rsync), die Verbindung endet.

## 4. `known_hosts`

Der Workflow prüft den Host-Schlüssel fest (`StrictHostKeyChecking=yes`) und holt ihn nie zur Laufzeit per `ssh-keyscan`, denn `ssh-keyscan` kann die Echtheit nicht prüfen (Recherche Abschnitt 6). Darum wird der Schlüssel einmal hier von Hand verglichen.

**Laptop:**

```sh
ssh-keyscan -t ed25519 <vps> > deploy_known_hosts
cat deploy_known_hosts
ssh-keygen -lf deploy_known_hosts
```

**VPS:**

```sh
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

Erwartet: `deploy_known_hosts` hat genau eine Zeile `<vps> ssh-ed25519 AAAA…`. Beide `ssh-keygen -lf` geben `256 SHA256:… (ED25519)` aus.

Prüfung: Der `SHA256:`-Fingerabdruck ist auf Laptop und VPS Zeichen für Zeichen gleich. Weicht er ab, hier anhalten und nichts als Secret speichern.

## 5. Secrets in `wasseramseleo/stavewise-web`

Die vier Secret-Namen stehen in `.github/workflows/deploy.yml` und `scripts/deploy-guard.sh` (#538 Punkt 7). Fehlt eines, überspringt der Deploy den Upload und endet grün.

**Laptop** (dasselbe Verzeichnis wie in Schritt 3 und 4):

```sh
gh secret set DEPLOY_SSH_KEY -R wasseramseleo/stavewise-web < deploy_key
gh secret set DEPLOY_SSH_KNOWN_HOSTS -R wasseramseleo/stavewise-web < deploy_known_hosts
gh secret set DEPLOY_SSH_HOST -R wasseramseleo/stavewise-web   # fragt nach dem Wert: <vps>
gh secret set DEPLOY_SSH_USER -R wasseramseleo/stavewise-web   # fragt nach dem Wert: deploy-stavewise
gh secret list -R wasseramseleo/stavewise-web
```

`gh secret set` ohne `--body` fragt den Wert ab; so steht er nicht in der Shell-History.

Erwartet: `gh secret list` zeigt `DEPLOY_SSH_HOST`, `DEPLOY_SSH_KEY`, `DEPLOY_SSH_KNOWN_HOSTS` und `DEPLOY_SSH_USER` mit dem heutigen Datum.

Danach das Original des privaten Schlüssels `deploy_key` in **Proton Pass** ablegen (#538 Punkt 7), als Anhang eines Eintrags „stavewise-web deploy key“. Die lokalen Dateien bleiben bis zum Probelauf in Schritt 10 liegen und werden dort gelöscht.

Prüfung: Der Eintrag in Proton Pass hat den Anhang; `gh secret list` wie oben.

## 6. nginx

`ops/nginx/stavewise.app.conf` enthält schon die TLS-Server für Port 443 und verweist auf das Zertifikat unter `/etc/letsencrypt/live/stavewise.app/`. Das gibt es vor Schritt 7 noch nicht, `nginx -t` würde scheitern. Darum kommen die Dateien jetzt an ihren Platz, aktiv ist aber zuerst nur ein kleiner Server auf Port 80 für die ACME-Challenge. Er wird in Schritt 7 durch den echten vhost ersetzt.

**Laptop:**

```sh
scp -r ops <admin>@<vps>:/tmp/stavewise-ops
```

**VPS:**

```sh
sudo install -m 644 /tmp/stavewise-ops/nginx/stavewise.app.conf /etc/nginx/sites-available/stavewise.app
sudo install -d -m 755 /etc/nginx/snippets
sudo install -m 644 /tmp/stavewise-ops/nginx/stavewise-site.conf /etc/nginx/snippets/stavewise-site.conf

# Übergang bis zum Zertifikat: nur Port 80, nur die ACME-Challenge.
sudo tee /etc/nginx/sites-available/stavewise.app-acme > /dev/null <<'EOF'
server {
    listen 80;
    server_name stavewise.app www.stavewise.app;

    location /.well-known/acme-challenge/ {
        root /opt/stavewise/acme;
    }

    location / {
        return 404;
    }
}
EOF
sudo ln -s /etc/nginx/sites-available/stavewise.app-acme /etc/nginx/sites-enabled/stavewise.app-acme
grep -n 'sites-enabled' /etc/nginx/nginx.conf
sudo nginx -t
sudo systemctl reload nginx
```

Erwartet: `grep` zeigt `include /etc/nginx/sites-enabled/*;` im `http`-Block (Debian-Standard). `nginx -t` meldet `syntax is ok` und `test is successful`.

Prüfung, VPS und Laptop:

```sh
# VPS
sudo install -d -m 755 /opt/stavewise/acme/.well-known/acme-challenge
echo probe | sudo tee /opt/stavewise/acme/.well-known/acme-challenge/probe > /dev/null
# Laptop
curl -s http://stavewise.app/.well-known/acme-challenge/probe
curl -s http://www.stavewise.app/.well-known/acme-challenge/probe
# VPS, danach aufräumen
sudo rm /opt/stavewise/acme/.well-known/acme-challenge/probe
```

Erwartet: zweimal `probe`. Die bestehende Seite antwortet weiter wie vorher (im Browser aufrufen).

## 7. certbot

Ein Zertifikat für beide Namen, abgelegt unter dem Namen `stavewise.app`, wie es der vhost erwartet. `certonly --webroot` holt nur das Zertifikat und schreibt keine nginx-Konfiguration um.

**VPS:**

```sh
sudo certbot certonly --webroot -w /opt/stavewise/acme \
  --cert-name stavewise.app -d stavewise.app -d www.stavewise.app \
  --deploy-hook 'systemctl reload nginx'
sudo certbot certificates
```

Erwartet: `Successfully received certificate.`, `certbot certificates` zeigt `Certificate Name: stavewise.app` mit `Domains: stavewise.app www.stavewise.app` und den Pfaden `/etc/letsencrypt/live/stavewise.app/fullchain.pem` und `privkey.pem`.

Jetzt den Übergangsserver gegen den echten vhost tauschen:

```sh
sudo rm /etc/nginx/sites-enabled/stavewise.app-acme
sudo rm /etc/nginx/sites-available/stavewise.app-acme
sudo ln -s /etc/nginx/sites-available/stavewise.app /etc/nginx/sites-enabled/stavewise.app
sudo nginx -t
sudo systemctl reload nginx
```

Erwartet: `nginx -t` erfolgreich. Meldet nginx einen Fehler bei `listen [::]:80` oder `listen [::]:443` („Address family not supported“), ist IPv6 im Kernel ganz abgeschaltet: dann die `[::]`-Zeilen in `ops/nginx/stavewise.app.conf` per PR entfernen und die Datei neu installieren, nicht auf dem VPS von Hand ändern. Die Warnung `the "listen ... http2" directive is deprecated` auf nginx ab 1.25.1 ist erwartet.

Prüfung der Erneuerung:

```sh
systemctl list-timers | grep -i certbot
sudo certbot renew --dry-run
sudo nginx -T 2>/dev/null | diff ~/nginx-vorher.txt - | grep '^<' | head
```

Erwartet: Ein Timer `certbot.timer` (oder `snap.certbot.renew.timer`) steht in der Liste, `renew --dry-run` endet mit `Congratulations, all simulated renewals succeeded`. Das `diff` zeigt keine entfernten Zeilen (`<`) der bestehenden Seite, nur neue für `stavewise.app`.

## 8. logrotate

Rohlogs 14 Tage (#542 Entscheidung 9; Datenschutzerklärung Teil B.2).

**VPS:**

```sh
sudo install -m 644 /tmp/stavewise-ops/logrotate/stavewise-web /etc/logrotate.d/stavewise-web
sudo logrotate -d /etc/logrotate.d/stavewise-web
sudo logrotate -d /etc/logrotate.conf 2>&1 | grep -i 'duplicate' || echo 'keine Doppelungen'
```

Erwartet: Der erste Lauf (`-d` ändert nichts) zeigt `rotating pattern: /var/log/nginx/stavewise/*.log` mit `14 rotations` und keinen `error:`. Der zweite gibt `keine Doppelungen` aus.

Prüfung: Meldet der zweite Befehl `duplicate log entry for /var/log/nginx/stavewise/access.log`, erfasst schon eine andere Regel die Logs von stavewise.app (`/etc/logrotate.d/nginx` mit `/var/log/nginx/*.log` reicht nicht in das Unterverzeichnis); logrotate rotiert sie dann nach der anderen Regel und meldet bei jedem Lauf einen Fehler. Dann anhalten und `ops/` per PR anpassen (etwa ein anderes Log-Verzeichnis), nicht die Regel der bestehenden Seite ändern.

## 9. GoAccess

Stündlicher Bericht mit gekürzten IP-Adressen und dauerhafter Statistik (#542 Entscheidung 9, #591 offene Frage 5).

**VPS:**

```sh
sudo install -d -m 755 /etc/goaccess
sudo install -m 644 /tmp/stavewise-ops/goaccess/goaccess.conf /etc/goaccess/stavewise.conf
sudo install -m 644 /tmp/stavewise-ops/goaccess/stavewise-goaccess.service /etc/systemd/system/stavewise-goaccess.service
sudo install -m 644 /tmp/stavewise-ops/goaccess/stavewise-goaccess.timer /etc/systemd/system/stavewise-goaccess.timer
sudo systemd-analyze verify /etc/systemd/system/stavewise-goaccess.service /etc/systemd/system/stavewise-goaccess.timer
sudo systemctl daemon-reload
sudo systemctl enable --now stavewise-goaccess.timer
sudo systemctl start stavewise-goaccess.service
systemctl status stavewise-goaccess.service --no-pager
systemctl list-timers stavewise-goaccess.timer --no-pager
ls -l /opt/stavewise/goaccess/report.html /opt/stavewise/goaccess/db
rm -r /tmp/stavewise-ops
```

Erwartet: `systemd-analyze verify` gibt nichts aus. Der Dienst steht auf `inactive (dead)` mit `status=0/SUCCESS` (er ist `oneshot`), der Timer zeigt den nächsten Lauf zur nächsten vollen Stunde (bis zu zwei Minuten später). `report.html` existiert, `db/` enthält Dateien.

Prüfung: `journalctl -u stavewise-goaccess.service -n 20 --no-pager` ohne Fehler. Steht dort `unrecognized option '--anonymize-level'` oder ähnlich, ist GoAccess zu alt (siehe Schritt 1).

Bericht abholen, **Laptop**:

```sh
scp <admin>@<vps>:/opt/stavewise/goaccess/report.html goaccess-stavewise.html
```

Prüfung: `curl -sI https://stavewise.app/report.html` gibt `404` (Bericht nicht öffentlich), nach dem ersten Deploy auch `https://stavewise.app/goaccess/report.html`.

## 10. Erster Deploy

Zuerst ein Probelauf von Hand mit dem Deploy-Schlüssel, der nichts schreibt: Er prüft Schlüssel, `known_hosts`, `rrsync` und Rechte. Die Optionen sind die aus `.github/workflows/deploy.yml`, ergänzt um `--dry-run`.

**Laptop**, im Repo-Klon (`npm ci && npm run check` baut `dist/`); `../deploy_key` und `../deploy_known_hosts` sind die Dateien aus Schritt 3 und 4:

```sh
npm ci
npm run check
rsync -az --delete --chmod=D755,F644 --itemize-changes --dry-run \
  -e "ssh -i ../deploy_key -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=yes -o UserKnownHostsFile=../deploy_known_hosts" \
  dist/ deploy-stavewise@<vps>:
```

Erwartet: Zeilen wie `cd+++++++++ de/` und `<f+++++++++ de/index.html` für alle Dateien aus `dist/`, keine Fehler wie `Permission denied`, `Host key verification failed` oder `rrsync`-Meldungen. Auf dem VPS bleibt `/opt/stavewise/web` leer (`ls -A /opt/stavewise/web` gibt nichts aus).

Danach die lokalen Schlüsseldateien löschen (das Original liegt in Proton Pass, Schritt 5):

```sh
rm deploy_key deploy_key.pub deploy_known_hosts
```

Dann der echte Deploy über GitHub, **Laptop**:

```sh
gh workflow run deploy -R wasseramseleo/stavewise-web --ref main
gh run list -R wasseramseleo/stavewise-web --workflow deploy --limit 1
gh run watch -R wasseramseleo/stavewise-web
```

Oder ein Push auf `main` (Merge eines PR). Erwartet: Der Lauf ist grün, der Schritt „rsync site“ listet die übertragenen Dateien, und es gibt **keinen** Hinweis „Deploy übersprungen: Secrets fehlen“ (der hieße: ein Secret fehlt, zurück zu Schritt 5).

Achtung: Wie `check.yml` läuft der Job nur, wenn das Repo öffentlich ist (`if: ${{ !github.event.repository.private }}`). Solange `wasseramseleo/stavewise-web` privat ist, wird er übersprungen und lädt nichts hoch. Dann entweder erst das Repo öffentlich schalten (Leos Entscheidung, #545) oder den ersten Upload einmal von Hand machen: den Probelauf oben ohne `--dry-run` wiederholen, bevor die Schlüsseldateien gelöscht werden.

Prüfung, **VPS**:

```sh
ls -l /opt/stavewise/web
```

Erwartet: `de/`, `en/`, `fonts/`, `favicon.svg` (und `_astro/`, falls der Build welche erzeugt), Besitzer `deploy-stavewise`, Verzeichnisse `drwxr-xr-x`, Dateien `-rw-r--r--`.

## 11. Abnahme mit `curl`

**Laptop:**

```sh
# Sprachweiche: 302 nach Accept-Language
curl -sI -H 'Accept-Language: de' https://stavewise.app/beta | grep -Ei '^(HTTP|location|vary)'
curl -sI -H 'Accept-Language: en-US' https://stavewise.app/ | grep -Ei '^(HTTP|location)'
# www -> stavewise.app
curl -sI https://www.stavewise.app/de/beta | grep -Ei '^(HTTP|location)'
# HTTP -> HTTPS
curl -sI http://stavewise.app/beta | grep -Ei '^(HTTP|location)'
# Seiten
curl -sI https://stavewise.app/de/privacy | grep -Ei '^(HTTP|content-type|cache-control)'
curl -sI https://stavewise.app/en/impressum | grep -Ei '^HTTP'
# Sicherheits-Kopfzeilen
curl -sI https://stavewise.app/de/ | grep -Ei '^(strict-transport-security|x-content-type-options|x-frame-options|referrer-policy|permissions-policy)'
```

Erwartet, der Reihe nach:

- `HTTP/2 302`, `location: /de/beta` (oder `https://stavewise.app/de/beta`), `vary: Accept-Language`
- `HTTP/2 302`, `location: …/en/`
- `HTTP/2 301`, `location: https://stavewise.app/de/beta`
- `HTTP/1.1 301`, `location: https://stavewise.app/beta`
- `HTTP/2 200`, `content-type: text/html`, `cache-control: no-cache`
- `HTTP/2 200`
- `strict-transport-security: max-age=31536000; includeSubDomains` und die vier anderen Kopfzeilen

Dazu im Browser `https://stavewise.app/` öffnen: Die Startseite erscheint in der Sprache des Browsers, das Schloss zeigt ein gültiges Zertifikat.

Prüfung im Log, **VPS**:

```sh
sudo tail -n 5 /var/log/nginx/stavewise/access.log
```

Erwartet: die Abrufe von eben im Format `combined` (IP, Zeit, `"HEAD /de/privacy HTTP/2.0" 200`, User-Agent `curl/…`).

Zum Schluss die bestehende Seite im Browser aufrufen: Sie antwortet wie vor Schritt 1.

## 12. Rückbau und Notfall

**Deploy-Schlüssel widerrufen** (Schlüssel verloren oder geleakt, oder kein Deploy mehr gewünscht). Die Seite bleibt online, es kommt nur nichts Neues mehr an.

```sh
# VPS: die Zeile löschen, die Datei bleibt leer
sudo truncate -s 0 /home/deploy-stavewise/.ssh/authorized_keys
# Laptop: Secret löschen; der Workflow meldet dann „Deploy übersprungen: Secrets fehlen“
gh secret delete DEPLOY_SSH_KEY -R wasseramseleo/stavewise-web
```

Prüfung: Ein Deploy-Lauf endet grün mit dem Hinweis „Deploy übersprungen: Secrets fehlen“. Neuer Schlüssel: Schritt 3 (nur `ssh-keygen` und `authorized_keys`), 5 und 10.

**Seite abschalten** (vhost aus, Dateien bleiben):

```sh
sudo rm /etc/nginx/sites-enabled/stavewise.app
sudo nginx -t
sudo systemctl reload nginx
```

Prüfung: `curl -sI https://stavewise.app/de/` liefert nicht mehr die Seite (Zertifikatsfehler oder die Standardseite des Servers). Wieder einschalten: den Symlink aus Schritt 7 neu anlegen, `nginx -t`, `reload`.

**Alles entfernen** (nur wenn die Seite ganz vom VPS weg soll; die bestehende Seite bleibt unberührt):

```sh
sudo systemctl disable --now stavewise-goaccess.timer
sudo rm /etc/systemd/system/stavewise-goaccess.service /etc/systemd/system/stavewise-goaccess.timer
sudo systemctl daemon-reload
sudo rm /etc/nginx/sites-enabled/stavewise.app /etc/nginx/sites-available/stavewise.app /etc/nginx/snippets/stavewise-site.conf
sudo nginx -t && sudo systemctl reload nginx
sudo certbot delete --cert-name stavewise.app
sudo rm /etc/logrotate.d/stavewise-web /etc/goaccess/stavewise.conf
sudo userdel -r deploy-stavewise
sudo rm -r /opt/stavewise
```

Ohne seine Regel löscht logrotate die Rohlogs nicht mehr, also auch sie entfernen: `sudo rm -r /var/log/nginx/stavewise`. Zuletzt auf dem Laptop alle vier Secrets mit `gh secret delete <NAME> -R wasseramseleo/stavewise-web` löschen.
