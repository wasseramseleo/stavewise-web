#!/bin/sh
# Lints .github/workflows/*.yml with actionlint (#601). Uses actionlint from
# PATH, otherwise the pinned Docker image (offline, read-only mount).
set -eu

ROOT=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
IMAGE=rhysd/actionlint:1.7.12

cd "$ROOT"
if command -v actionlint >/dev/null 2>&1; then
  exec actionlint -no-color -verbose
fi

exec docker run --rm --network none -v "$ROOT:/repo:ro" -w /repo "$IMAGE" -no-color -verbose
