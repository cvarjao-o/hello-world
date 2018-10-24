pipeline {
    agent none
    options {
        disableResume()
    }
    environment {
        OCP_PIPELINE_CLI_URL = 'https://raw.githubusercontent.com/BCDevOps/ocp-cd-pipeline/822d5770b5742a60fd31a43a477ab4faf94c260a/src/main/resources/pipeline-cli'
        OCP_PIPELINE_VERSION = '0.0.4'
    }
    stages {
        stage('Build') {
            agent { label 'build' }
            steps {
                script {
                    def hasChangesInPath = sh(script:"[ \"\$(git diff --name-only HEAD~1..HEAD | grep -v '^.tools/' | wc -l)\" -eq 0 ] && exit 999 || exit 0", returnStatus: true) == 0
                    if (!hasChangesInPath){
                        //currentBuild.rawBuild.delete()
                        error("No changes detected in the path")
                    }
                }
                echo "Aborting all running jobs ..."
                script {
                    abortAllPreviousBuildInProgress(currentBuild)
                }
                echo "Building ..."
                sh ".pipeline/pipeline build --pr=${CHANGE_ID}"
            }
        }
        stage('Deploy (DEV)') {
            agent { label 'deploy' }
            steps {
                echo "Deploying ..."
                sh ".pipeline/pipeline deploy --pr=${CHANGE_ID} --env=dev"
            }
        }
    }
}