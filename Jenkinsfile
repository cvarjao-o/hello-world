pipeline {
    agent none
    options {
        disableResume()
    }
    environment {
        OCP_PIPELINE_CLI_URL = 'https://raw.githubusercontent.com/BCDevOps/ocp-cd-pipeline/03043cc11fc9ff0228f50981b80bf82f84061e2e/src/main/resources/pipeline-cli'
        OCP_PIPELINE_VERSION = '0.0.4'
    }
    stages {
        stage('Build') {
            agent { label 'build' }
            steps {
                script {
                    def hasChangesInPath = sh(script:"[ \"\$(git diff --name-only HEAD~1..HEAD | grep -v '^.tools/' | wc -l)\" -eq 0 ] && exit 999 || exit 0", returnStatus: true) == 0
                    if (!hasChangesInPath){
                        currentBuild.rawBuild.delete()
                        error("No changes detected in the path")
                    }
                }
                echo "Aborting all running jobs ..."
                script {
                    abortAllPreviousBuildInProgress(currentBuild)
                }
                echo "Building ..."
                sh "curl -sSL '${OCP_PIPELINE_CLI_URL}' | bash -s build --config=.pipeline/config.groovy --pr=${CHANGE_ID}"
            }
        }
        stage('Deploy (DEV)') {
            agent { label 'deploy' }
            steps {
                echo "Deploying ..."
                sh "curl -sSL '${OCP_PIPELINE_CLI_URL}' | bash -s deploy --config=.pipeline/config.groovy --pr=${CHANGE_ID} --env=dev"
            }
        }
    }
}