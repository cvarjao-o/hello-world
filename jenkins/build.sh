#!/usr/bin/env bash
set -e

export OCP_PIPELINE_CLI_URL='https://raw.githubusercontent.com/BCDevOps/ocp-cd-pipeline/822d5770b5742a60fd31a43a477ab4faf94c260a/src/main/resources/pipeline-cli'
export OCP_PIPELINE_VERSION='0.0.4'
#export OCP_PIPELINE_DIR='/Users/cvarjao/Documents/GitHub/bcdevops/ocp-cd-pipeline'
#export OCP_PIPELINE_LIB_DIR="${OCP_PIPELINE_DIR}/src/main/groovy"

cat "${OCP_PIPELINE_DIR}/src/main/resources/pipeline-cli" | bash -s build --config=config.groovy --pr=1
