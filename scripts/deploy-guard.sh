#!/bin/sh
# Deploy guard for .github/workflows/deploy.yml (#601, open question 6 in #591):
# the deploy stays inactive until all four secrets from #538 point 7 exist.
# Reads DEPLOY_SSH_KEY, DEPLOY_SSH_KNOWN_HOSTS, DEPLOY_SSH_HOST and
# DEPLOY_SSH_USER from the environment and writes `enabled=true` only when all
# four are non-empty, otherwise `enabled=false`. The line goes to
# $GITHUB_OUTPUT when that is set, else to stdout. Always exits 0, so a
# repository without secrets ends the workflow green.
set -u

enabled=true
for value in "${DEPLOY_SSH_KEY:-}" "${DEPLOY_SSH_KNOWN_HOSTS:-}" \
  "${DEPLOY_SSH_HOST:-}" "${DEPLOY_SSH_USER:-}"; do
  [ -n "$value" ] || enabled=false
done

if [ -n "${GITHUB_OUTPUT:-}" ]; then
  echo "enabled=$enabled" >> "$GITHUB_OUTPUT"
else
  echo "enabled=$enabled"
fi
exit 0
