#!/usr/bin/env bash
set -eu
if ! sudo podman inspect tgulacsi/carbone >/dev/null; then
	sudo podman build -t tgulacsi/carbone "$(cd "$(dirname "$0")"; pwd)"
fi
template="$1"
out="$2"
shift 2

dir="$(mktemp -d)"
echo "# dir=$dir" >&2
trap 'rm -rf "$dir"' EXIT
cp -a --reflink=auto "$template" "$dir/"
temp="$(basename "$out")"
set -x
sudo podman run --rm -v "${dir}:/data:rw" tgulacsi/carbone "$template" "$temp" "$*"
mv "$dir/$temp" "$out"
