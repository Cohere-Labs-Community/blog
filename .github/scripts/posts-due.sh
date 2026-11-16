#!/usr/bin/env bash
# Prints posts whose publish time is after <since> (Unix seconds) and not later than now.
# Dates are read like Jekyll does: front matter `date:` if set, otherwise the filename
# date, in the site's `timezone:` from _config.yml (UTC when unset, as on GitHub runners).
set -euo pipefail
shopt -s nullglob

since=${1:?usage: posts-due.sh <since-unix-seconds>}
now=$(date +%s)

tz=$(sed -n 's/^timezone:[[:space:]]*\([^[:space:]#]*\).*/\1/p' _config.yml | tr -d "\"'")
export TZ=${tz:-UTC}

for f in _posts/*.md _posts/*.markdown _posts/*.html; do
  d=$(awk 'NR == 1 { if ($0 !~ /^---[[:space:]]*$/) exit; next }
           /^---[[:space:]]*$/ { exit }
           /^date:/ { sub(/^date:[[:space:]]*/, ""); gsub(/["\047]/, ""); print; exit }' "$f")
  [ -n "$d" ] || d=$(basename "$f" | grep -oE '^[0-9]{4}-[0-9]{2}-[0-9]{2}' || true)
  if ! t=$(date -d "$d" +%s 2>/dev/null); then
    echo "::warning file=$f::Could not parse post date '$d'" >&2
    continue
  fi
  if [ "$t" -gt "$since" ] && [ "$t" -le "$now" ]; then
    echo "$f"
  fi
done
