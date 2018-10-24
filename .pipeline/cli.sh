#!/usr/bin/env sh
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

cd $DIR
curl -sSL 'https://raw.githubusercontent.com/cvarjao-o/node-oc-cli-wrapper/e0e37366d8ce770f91d537e664d9352676ea02eb/cli.sh' | bash -s "$@"