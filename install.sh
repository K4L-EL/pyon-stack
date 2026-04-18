#!/usr/bin/env bash
# Install the `pyon` CLI.
#   curl -fsSL https://raw.githubusercontent.com/K4L-EL/pyon-stack/main/install.sh | sh
# Env:
#   PYON_REF     git ref to install from (default: main)
#   PYON_REPO    raw.githubusercontent.com owner/repo (default: K4L-EL/pyon-stack)
#   PYON_PREFIX  install dir (default: /usr/local/bin or ~/.local/bin)
# shellcheck shell=bash

set -eu

PYON_REF="${PYON_REF:-main}"
PYON_REPO="${PYON_REPO:-K4L-EL/pyon-stack}"
PYON_URL="https://raw.githubusercontent.com/${PYON_REPO}/${PYON_REF}/cli/pyon"

if [ -t 1 ]; then
  C_R=$'\033[0m'; C_GRN=$'\033[32m'; C_YEL=$'\033[33m'; C_RED=$'\033[31m'; C_B=$'\033[1m'
else
  C_R=''; C_GRN=''; C_YEL=''; C_RED=''; C_B=''
fi
ok()   { printf '%s✓%s %s\n' "$C_GRN" "$C_R" "$*"; }
warn() { printf '%s!%s %s\n' "$C_YEL" "$C_R" "$*" >&2; }
die()  { printf '%s✗%s %s\n' "$C_RED" "$C_R" "$*" >&2; exit 1; }

# pick downloader
if command -v curl >/dev/null 2>&1; then
  download() { curl -fsSL "$1" -o "$2"; }
elif command -v wget >/dev/null 2>&1; then
  download() { wget -qO "$2" "$1"; }
else
  die "Need curl or wget to install"
fi

# pick install prefix
pick_prefix() {
  if [ -n "${PYON_PREFIX:-}" ]; then printf '%s\n' "$PYON_PREFIX"; return; fi
  for d in /usr/local/bin /opt/homebrew/bin; do
    [ -d "$d" ] && [ -w "$d" ] && { printf '%s\n' "$d"; return; }
  done
  mkdir -p "$HOME/.local/bin"
  printf '%s\n' "$HOME/.local/bin"
}

PREFIX=$(pick_prefix)
TARGET="$PREFIX/pyon"

printf '%sInstalling pyon%s from %s to %s\n' "$C_B" "$C_R" "$PYON_URL" "$TARGET"

tmp=$(mktemp)
trap 'rm -f "$tmp"' EXIT
download "$PYON_URL" "$tmp" || die "Download failed: $PYON_URL"

# Sanity check — refuse to install an empty or clearly-wrong file.
if [ ! -s "$tmp" ]; then die "Downloaded file is empty"; fi
head -n1 "$tmp" | grep -q '^#!' || die "Downloaded file is not a shell script"

install -m 0755 "$tmp" "$TARGET" 2>/dev/null || {
  # fall back to cp+chmod (e.g. BSD systems without GNU `install`)
  cp "$tmp" "$TARGET" && chmod 0755 "$TARGET"
} || die "Could not write $TARGET (try: sudo $0)"

ok "Installed $TARGET"

# PATH hint
case ":$PATH:" in
  *":$PREFIX:"*) : ;;
  *)
    warn "$PREFIX is not on PATH."
    # shellcheck disable=SC2016  # $PATH is meant to be literal in the hint
    printf '    Add this to your shell rc:\n      export PATH="%s:$PATH"\n' "$PREFIX"
    ;;
esac

"$TARGET" --version
printf '\nNext: %spyon new my-app%s\n' "$C_B" "$C_R"
