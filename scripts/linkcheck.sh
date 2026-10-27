#!/bin/sh
# Internal link check: lychee offline against the built site in dist/.
# Root-relative links (/de/beta) resolve against dist/, directories via
# index.html, so /de/beta -> dist/de/beta/index.html. Uses lychee from PATH,
# otherwise the pinned Docker image.
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
IMAGE=lycheeverse/lychee:0.24.2

[ -d "$ROOT/dist" ] || { echo "dist/ is missing; run astro build first." >&2; exit 1; }

if command -v lychee >/dev/null 2>&1; then
  cd "$ROOT"
  exec lychee --config lychee.toml --root-dir "$ROOT/dist" 'dist/**/*.html'
fi

exec docker run --rm --network none -v "$ROOT:/input:ro" -w /input "$IMAGE" \
  --config lychee.toml --root-dir /input/dist 'dist/**/*.html'
