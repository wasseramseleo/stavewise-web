#!/bin/sh
# Tests for scripts/deploy-guard.sh (#601): the deploy runs only when all four
# deploy secrets are set, and the guard itself never fails the workflow.
set -u

DIR=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)
GUARD="$DIR/deploy-guard.sh"

FAILED=0
PASSED=0
fail() { echo "FAIL: $*" >&2; FAILED=$((FAILED + 1)); }
pass() { echo "ok:   $*"; PASSED=$((PASSED + 1)); }

# Runs the guard with a clean environment plus the given VAR=value pairs and
# prints its stdout followed by a line "exit=<status>".
run_guard() {
  out=$(env -i PATH="$PATH" "$@" sh "$GUARD")
  status=$?
  printf '%s\nexit=%s\n' "$out" "$status"
}

ALL="DEPLOY_SSH_KEY=key DEPLOY_SSH_KNOWN_HOSTS=hosts DEPLOY_SSH_HOST=host DEPLOY_SSH_USER=user"

result=$(run_guard)
case "$result" in *"enabled=false"*) pass "no variables -> enabled=false" ;; *) fail "no variables: got '$result'" ;; esac
case "$result" in *"exit=0"*) pass "no variables -> exit 0" ;; *) fail "no variables: exit not 0: '$result'" ;; esac

# shellcheck disable=SC2086
result=$(run_guard $ALL)
case "$result" in *"enabled=true"*) pass "all four set -> enabled=true" ;; *) fail "all four set: got '$result'" ;; esac
case "$result" in *"exit=0"*) pass "all four set -> exit 0" ;; *) fail "all four set: exit not 0: '$result'" ;; esac

result=$(run_guard DEPLOY_SSH_KEY=key DEPLOY_SSH_KNOWN_HOSTS= DEPLOY_SSH_HOST=host DEPLOY_SSH_USER=user)
case "$result" in *"enabled=false"*) pass "known_hosts empty -> enabled=false" ;; *) fail "known_hosts empty: got '$result'" ;; esac
case "$result" in *"exit=0"*) pass "known_hosts empty -> exit 0" ;; *) fail "known_hosts empty: exit not 0: '$result'" ;; esac

TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT INT TERM
# shellcheck disable=SC2086
run_guard GITHUB_OUTPUT="$TMP" $ALL >/dev/null
if grep -qx 'enabled=true' "$TMP"; then pass "GITHUB_OUTPUT gets enabled=true"; else fail "GITHUB_OUTPUT file: '$(cat "$TMP")'"; fi
: > "$TMP"
run_guard GITHUB_OUTPUT="$TMP" >/dev/null
if grep -qx 'enabled=false' "$TMP"; then pass "GITHUB_OUTPUT gets enabled=false"; else fail "GITHUB_OUTPUT file: '$(cat "$TMP")'"; fi

echo "deploy-guard: $PASSED passed, $FAILED failed"
[ "$FAILED" -eq 0 ]
