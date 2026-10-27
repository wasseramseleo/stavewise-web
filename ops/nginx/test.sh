#!/bin/sh
# Tests the nginx configuration in Docker against the built site (#591, #600).
# Does not build: expects dist/ (run `npm run check` or `astro build` first).
#
# The container loads ops/nginx/test/nginx.conf, which includes the real
# vhost ops/nginx/stavewise.app.conf (maps, TLS servers, with a self-signed
# dummy certificate made with openssl on the host) plus a plain HTTP server on
# port 8080 that includes the site rules ops/nginx/stavewise-site.conf.
# dist/ is mounted at the production root /opt/stavewise/web.
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
IMAGE=nginx:1.28-alpine
NAME="stavewise-nginx-test-$$"

[ -d "$ROOT/dist" ] || { echo "dist/ is missing; run astro build first." >&2; exit 1; }

FAILED=0
PASSED=0
fail() { echo "FAIL: $*" >&2; FAILED=$((FAILED + 1)); }
pass() { echo "ok:   $*"; PASSED=$((PASSED + 1)); }

for f in ops/nginx/stavewise.app.conf ops/nginx/stavewise-site.conf ops/nginx/test/nginx.conf; do
  [ -f "$ROOT/$f" ] || { echo "$f is missing." >&2; exit 1; }
done

# Self-signed dummy certificate at certbot's path, so the vhost loads unchanged.
CERTS=$(mktemp -d)
cleanup() { docker rm -f "$NAME" >/dev/null 2>&1 || true; rm -rf "$CERTS"; }
trap cleanup EXIT INT TERM
openssl req -x509 -newkey rsa:2048 -nodes -days 1 -subj "/CN=stavewise.app" \
  -keyout "$CERTS/privkey.pem" -out "$CERTS/fullchain.pem" 2>/dev/null
chmod 644 "$CERTS"/*.pem
chmod 755 "$CERTS"

# Port 80 and 443 serve the real vhost, 8080 the test server.
docker run -d --name "$NAME" \
  --sysctl net.ipv6.conf.all.disable_ipv6=0 \
  -p 127.0.0.1::8080 -p 127.0.0.1::80 -p 127.0.0.1::443 \
  --tmpfs /var/log/nginx/stavewise \
  -v "$ROOT/dist:/opt/stavewise/web:ro" \
  -v "$CERTS:/etc/letsencrypt/live/stavewise.app:ro" \
  -v "$ROOT/ops/nginx/stavewise.app.conf:/etc/nginx/stavewise.app.conf:ro" \
  -v "$ROOT/ops/nginx/stavewise-site.conf:/etc/nginx/snippets/stavewise-site.conf:ro" \
  -v "$ROOT/ops/nginx/test/nginx.conf:/etc/nginx/nginx.conf:ro" \
  --entrypoint sleep "$IMAGE" 600 >/dev/null

if docker exec "$NAME" nginx -t; then
  pass "nginx -t with stavewise.app.conf and dummy certificate"
else
  fail "nginx -t"
  exit 1
fi
docker exec -d "$NAME" nginx

P8080=$(docker port "$NAME" 8080/tcp | head -n1 | sed 's/.*://')
P80=$(docker port "$NAME" 80/tcp | head -n1 | sed 's/.*://')
P443=$(docker port "$NAME" 443/tcp | head -n1 | sed 's/.*://')
SITE="http://127.0.0.1:$P8080"

i=0
until curl -s -o /dev/null "$SITE/de/"; do
  i=$((i + 1))
  [ "$i" -lt 40 ] || { echo "nginx did not answer" >&2; exit 1; }
  sleep 0.25
done

# head URL [curl args...]: prints the response headers, lower-cased names.
head_of() {
  url=$1; shift
  curl -s -o /dev/null -D - "$@" "$url" | tr -d '\r'
}
status_of() { printf '%s\n' "$1" | head -n1 | cut -d' ' -f2; }
header_of() { printf '%s\n' "$1" | grep -i "^$2:" | head -n1 | cut -d' ' -f2-; }

# expect_redirect NAME URL STATUS LOCATION_SUFFIX [curl args...]
expect_redirect() {
  name=$1 url=$2 want_status=$3 want_loc=$4; shift 4
  h=$(head_of "$url" "$@")
  s=$(status_of "$h"); loc=$(header_of "$h" location)
  case "$loc" in
    *"$want_loc") [ "$s" = "$want_status" ] && { pass "$name -> $s $loc"; return; } ;;
  esac
  fail "$name: want $want_status ...$want_loc, got $s '$loc'"
}

# The language switch (#545 "Sprachweiche").
expect_redirect "/ de-AT" "$SITE/" 302 "/de/" -H 'Accept-Language: de-AT,de;q=0.9'
expect_redirect "/ en-US" "$SITE/" 302 "/en/" -H 'Accept-Language: en-US,en;q=0.9,de;q=0.8'
expect_redirect "/ without Accept-Language" "$SITE/" 302 "/en/"
expect_redirect "/beta de" "$SITE/beta" 302 "/de/beta" -H 'Accept-Language: de'
expect_redirect "/privacy fr-FR" "$SITE/privacy" 302 "/en/privacy" -H 'Accept-Language: fr-FR'
expect_redirect "/impressum de-DE" "$SITE/impressum" 302 "/de/impressum" -H 'Accept-Language: de-DE'
expect_redirect "/pianos de" "$SITE/pianos" 302 "/de/pianos" -H 'Accept-Language: de'
expect_redirect "/beta?utm_source=reddit de" "$SITE/beta?utm_source=reddit" 302 \
  "/de/beta?utm_source=reddit" -H 'Accept-Language: de'

h=$(head_of "$SITE/beta" -H 'Accept-Language: de')
case "$(header_of "$h" vary)" in
  *Accept-Language*) pass "redirect carries Vary: Accept-Language" ;;
  *) fail "redirect without Vary: Accept-Language" ;;
esac

# Pages.
h=$(head_of "$SITE/de/beta")
if [ "$(status_of "$h")" = 200 ] && header_of "$h" content-type | grep -q '^text/html'; then
  pass "/de/beta -> 200 text/html"
else
  fail "/de/beta: $(status_of "$h") $(header_of "$h" content-type)"
fi
h=$(head_of "$SITE/en/")
[ "$(status_of "$h")" = 200 ] && pass "/en/ -> 200" || fail "/en/: $(status_of "$h")"
case "$(header_of "$h" cache-control)" in
  no-cache) pass "HTML Cache-Control no-cache" ;;
  *) fail "HTML Cache-Control: '$(header_of "$h" cache-control)'" ;;
esac

# Long cache for fonts.
FONT=$(cd "$ROOT/dist" && ls fonts/*.woff2 | head -n1)
h=$(head_of "$SITE/$FONT")
if [ "$(status_of "$h")" = 200 ] && header_of "$h" cache-control | grep -q 'max-age=31536000'; then
  pass "/$FONT -> 200, $(header_of "$h" cache-control)"
else
  fail "/$FONT: $(status_of "$h") '$(header_of "$h" cache-control)'"
fi

# Astro's hashed files are immutable.
ASTRO=$(cd "$ROOT/dist" && ls _astro/* 2>/dev/null | head -n1 || true)
if [ -n "$ASTRO" ]; then
  h=$(head_of "$SITE/$ASTRO")
  case "$(header_of "$h" cache-control)" in
    *immutable*) pass "/$ASTRO immutable" ;;
    *) fail "/$ASTRO: '$(header_of "$h" cache-control)'" ;;
  esac
fi

# Security headers.
h=$(head_of "$SITE/de/")
for name in strict-transport-security x-content-type-options; do
  v=$(header_of "$h" "$name")
  [ -n "$v" ] && pass "/de/ $name: $v" || fail "/de/ without $name"
done

# The real TLS servers of stavewise.app.conf.
expect_redirect "www.stavewise.app (443)" "https://www.stavewise.app:$P443/de/beta" 301 \
  "https://stavewise.app/de/beta" -k --resolve "www.stavewise.app:$P443:127.0.0.1"
expect_redirect "http://stavewise.app (80)" "http://127.0.0.1:$P80/beta?x=1" 301 \
  "https://stavewise.app/beta?x=1" -H 'Host: stavewise.app'
expect_redirect "http://www.stavewise.app (80)" "http://127.0.0.1:$P80/" 301 \
  "https://stavewise.app/" -H 'Host: www.stavewise.app'
expect_redirect "https://stavewise.app/ de (443)" "https://stavewise.app:$P443/" 302 "/de/" \
  -k --resolve "stavewise.app:$P443:127.0.0.1" -H 'Accept-Language: de'
h=$(head_of "http://127.0.0.1:$P80/.well-known/acme-challenge/missing" -H 'Host: stavewise.app')
[ "$(status_of "$h")" = 404 ] && pass "ACME challenge not redirected" \
  || fail "ACME challenge: $(status_of "$h")"

echo "nginx test: $PASSED passed, $FAILED failed"
[ "$FAILED" -eq 0 ]
