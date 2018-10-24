#!/usr/bin/env sh
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

cd $DIR
curl -sSL 'https://raw.githubusercontent.com/cvarjao-o/node-oc-cli-wrapper/0bad141a71e732d15d35b9c6ff82ee1c55054917/cli.sh' | bash -s "$@"