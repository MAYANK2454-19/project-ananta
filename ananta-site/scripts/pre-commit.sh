#!/bin/sh
# Blocks a commit that stages a secret. Runs gitleaks against the staged
# changes only, so it is fast enough to sit in front of every commit.
#
# gitleaks is optional locally: if it is missing we warn and let the commit
# through, because CI scans the full history on every PR and push to main.
# Install it with `brew install gitleaks`.

if ! command -v gitleaks >/dev/null 2>&1; then
  printf '\033[33m! gitleaks not installed - staged-secret check skipped.\033[0m\n'
  printf '  brew install gitleaks   (CI still scans full history)\n'
  exit 0
fi

gitleaks protect --staged --redact --no-banner || {
  printf '\n\033[31mCommit blocked: a staged change looks like a secret.\033[0m\n'
  printf 'If it is a false positive, add it to the allowlist in .gitleaks.toml.\n'
  exit 1
}
