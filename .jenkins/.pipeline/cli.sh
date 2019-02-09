#!/usr/bin/env sh
set -e

curl -sSL 'https://raw.githubusercontent.com/BCDevOps/pipeline-cli/master/cli.sh' | bash -s "$@"