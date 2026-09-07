#!/usr/bin/env bash
#
# vnktsh.com — site versioning
#
# Every release is a git tag (vMAJOR.MINOR.PATCH) plus an entry in
# VERSIONS.md, so any past state of the site can be brought back exactly.
#
#   ./version.sh list                     what versions exist
#   ./version.sh current                  what's live / what's pending
#   ./version.sh release minor "note"     cut a new version and push it
#   ./version.sh preview v1.0.0           open an old version locally
#   ./version.sh diff v1.0.0              what changed since a version
#   ./version.sh restore v1.0.0           put an old version back on the site
#
# Restoring never rewrites history: it lays the old files down as a NEW
# commit on top of the current one. So a restore is itself revertible —
# restore v1.0.0, change your mind, restore v4.2.0 again.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

BOLD=$'\033[1m'; DIM=$'\033[2m'; RED=$'\033[31m'; GREEN=$'\033[32m'
YELLOW=$'\033[33m'; CYAN=$'\033[36m'; OFF=$'\033[0m'

die()  { printf '%serror:%s %s\n' "$RED" "$OFF" "$*" >&2; exit 1; }
say()  { printf '%s\n' "$*"; }
head_() { printf '\n%s%s%s\n' "$BOLD" "$*" "$OFF"; }

git rev-parse --git-dir >/dev/null 2>&1 || die "not a git repository"

TAG_GLOB='v[0-9]*.[0-9]*.[0-9]*'

latest_version() { git tag --list "$TAG_GLOB" --sort=-v:refname | head -n1; }

version_exists() { git rev-parse -q --verify "refs/tags/$1" >/dev/null 2>&1; }

tree_is_clean() { [ -z "$(git status --porcelain)" ]; }

normalise() { case "$1" in v*) printf '%s' "$1" ;; *) printf 'v%s' "$1" ;; esac; }

bump() {
  local cur="${1#v}" part="$2" ma mi pa
  IFS=. read -r ma mi pa <<<"$cur"
  case "$part" in
    major) ma=$((ma + 1)); mi=0; pa=0 ;;
    minor) mi=$((mi + 1)); pa=0 ;;
    patch) pa=$((pa + 1)) ;;
    *) die "bump must be major, minor or patch (got '$part')" ;;
  esac
  printf 'v%s.%s.%s' "$ma" "$mi" "$pa"
}

# A tiny file the deployed site carries, so you can check what's live by
# visiting https://vnktsh.com/version.json
stamp_version_file() {
  local version="$1" note="${2-}" restored_from="${3-}"
  {
    printf '{\n'
    printf '  "version": "%s",\n' "${version#v}"
    printf '  "released": "%s"' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    [ -n "$note" ]          && printf ',\n  "note": "%s"' "$(printf '%s' "$note" | sed 's/"/\\"/g')"
    [ -n "$restored_from" ] && printf ',\n  "restored_from": "%s"' "$restored_from"
    printf '\n}\n'
  } > version.json
}

record() {
  local heading="$1" body="$2" existing=""
  [ -f VERSIONS.md ] && existing="$(cat VERSIONS.md)"
  {
    printf '# Site versions\n\n'
    printf 'Every entry here is a git tag. `./version.sh restore <version>` puts\n'
    printf 'that exact state of the site back. Newest first.\n\n'
    printf '## %s\n\n%s\n' "$heading" "$body"
    if [ -n "$existing" ]; then
      printf '\n'
      # Drop the old header block, keep the entries underneath it.
      printf '%s\n' "$existing" | awk '/^## /{found=1} found{print}'
    fi
  } > VERSIONS.md
}

confirm() {
  local answer
  printf '%s [y/N] ' "$1"
  read -r answer </dev/tty || answer=""
  case "$answer" in y|Y|yes|YES) return 0 ;; *) return 1 ;; esac
}

cmd_list() {
  local latest; latest="$(latest_version)"
  [ -n "$latest" ] || { say "No versions yet. Cut the first one with:  ./version.sh release major \"first release\""; return; }
  head_ "Versions"
  git tag --list "$TAG_GLOB" --sort=-v:refname --format='%(refname:short)|%(creatordate:short)|%(contents:subject)' \
  | while IFS='|' read -r tag date subject; do
      local mark="  "
      [ "$tag" = "$latest" ] && mark="${GREEN}▸ ${OFF}"
      printf '%s%s%-10s%s %s%s%s  %s\n' "$mark" "$BOLD" "$tag" "$OFF" "$DIM" "$date" "$OFF" "$subject"
    done
  say ""
}

cmd_current() {
  local latest; latest="$(latest_version)"
  head_ "Current state"
  if [ -z "$latest" ]; then
    say "  version   ${YELLOW}none yet${OFF}"
  else
    say "  version   ${BOLD}${latest}${OFF}  $(git tag -l "$latest" --format='%(contents:subject)')"
  fi
  local ahead=0
  [ -n "$latest" ] && ahead="$(git rev-list --count "${latest}..HEAD" 2>/dev/null || echo 0)"
  if [ "$ahead" -gt 0 ]; then
    say "  unreleased ${YELLOW}${ahead} commit(s)${OFF} since ${latest} — cut a release to snapshot them"
  fi
  if tree_is_clean; then
    say "  worktree  ${GREEN}clean${OFF}"
  else
    say "  worktree  ${YELLOW}$(git status --porcelain | wc -l | tr -d ' ') uncommitted change(s)${OFF}"
  fi
  say ""
}

cmd_release() {
  local part="${1-}" note="${2-}"
  [ -n "$part" ] || die "usage: ./version.sh release <major|minor|patch> [\"note\"]"

  local latest next
  latest="$(latest_version)"
  if [ -z "$latest" ]; then
    next="v1.0.0"
    say "No versions yet — this will be ${BOLD}v1.0.0${OFF}."
  else
    next="$(bump "$latest" "$part")"
  fi
  [ -n "$note" ] || note="Release $next"
  version_exists "$next" && die "$next already exists"

  stamp_version_file "$next" "$note"
  record "$next — $(date '+%-d %B %Y')" "$note"

  git add -A
  if git diff --cached --quiet; then
    die "nothing to release — no changes since ${latest:-the start}"
  fi
  git commit -q -m "Release $next

$note"
  git tag -a "$next" -m "$note"

  say "${GREEN}Tagged $next${OFF} — $note"
  if git remote get-url origin >/dev/null 2>&1; then
    git push -q origin HEAD && git push -q origin "$next"
    say "Pushed to origin (site and tag)."
  else
    say "${YELLOW}No 'origin' remote — the tag is local only.${OFF}"
  fi
}

cmd_diff() {
  local v; v="$(normalise "${1-}")"
  version_exists "$v" || die "no such version: $v  (try ./version.sh list)"
  head_ "Changed since $v"
  git diff --stat "$v" HEAD || true
  say ""
}

cmd_preview() {
  local v port dir
  v="$(normalise "${1-}")"; port="${2-8123}"
  version_exists "$v" || die "no such version: $v  (try ./version.sh list)"
  dir="$(mktemp -d)"
  git archive "$v" | tar -x -C "$dir"
  say "Serving ${BOLD}$v${OFF} at ${CYAN}http://localhost:${port}${OFF}   (Ctrl-C to stop)"
  say "${DIM}This is a throwaway copy — the live site is untouched.${OFF}"
  trap 'rm -rf "$dir"' EXIT
  ( cd "$dir" && python3 -m http.server "$port" >/dev/null 2>&1 )
}

cmd_restore() {
  local v; v="$(normalise "${1-}")"
  version_exists "$v" || die "no such version: $v  (try ./version.sh list)"
  tree_is_clean || die "you have uncommitted changes — commit or stash them first"

  local latest; latest="$(latest_version)"
  if [ "$(git rev-parse "$v^{tree}")" = "$(git rev-parse 'HEAD^{tree}')" ]; then
    say "The site is already identical to $v. Nothing to do."
    return
  fi

  head_ "Restore the site to $v"
  git diff --stat HEAD "$v" || true
  say ""
  confirm "Apply this? The current state stays in history as ${latest:-HEAD}, so you can come back." \
    || { say "Cancelled — nothing changed."; return; }

  # Makes the index and working tree exactly match the tag, deleting files
  # added since. HEAD stays put, so committing records this as a normal
  # step forward rather than a rewrite.
  git read-tree -u --reset "$v^{tree}"

  stamp_version_file "$v" "Restored from $v" "$v"
  record "Restored to $v — $(date '+%-d %B %Y')" \
         "The site was rolled back to the contents of $v.$([ -n "$latest" ] && printf ' The state it was in (%s) is still in history and can be restored the same way.' "$latest")"

  git add -A
  git commit -q -m "Restore site to $v

Working tree set to the exact contents of $v. Nothing was rewritten —
${latest:-the previous state} is still tagged and can be restored back."

  say "${GREEN}Restored to $v.${OFF}"
  if git remote get-url origin >/dev/null 2>&1; then
    git push -q origin HEAD
    say "Pushed — the live site now serves $v."
  fi
  say "${DIM}Changed your mind? ./version.sh restore ${latest:-<version>}${OFF}"
}

usage() {
  cat <<'USAGE'

  vnktsh.com — site versioning

    ./version.sh list                    every version, newest first
    ./version.sh current                 what's released, what's pending
    ./version.sh release <part> ["note"] cut a version: major | minor | patch
    ./version.sh preview <version>       run an old version locally, safely
    ./version.sh diff <version>          what's changed since that version
    ./version.sh restore <version>       put that version back on the site

  Restoring is always safe: the current state stays tagged in history, so
  you can restore forward again at any time.

USAGE
}

case "${1-}" in
  list)    shift; cmd_list "$@" ;;
  current) shift; cmd_current "$@" ;;
  release) shift; cmd_release "$@" ;;
  preview) shift; cmd_preview "$@" ;;
  diff)    shift; cmd_diff "$@" ;;
  restore) shift; cmd_restore "$@" ;;
  ""|-h|--help|help) usage ;;
  *) die "unknown command '$1' — run ./version.sh --help" ;;
esac
