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
                echo "Aborting all running jobs ..."
                script {
                    abortAllPreviousBuildInProgress(currentBuild)
                }
                echo "Building ..."
                sh "pipeline/cli.sh build --pr=${CHANGE_ID}"
            }
        }
        stage('Deploy (DEV)') {
            agent { label 'deploy' }
            steps {
                echo "Deploying ..."
                sh "pipeline-cli deploy --pr=${CHANGE_ID} --env=dev"
            }
        }
        stage('Deploy (TEST)') {
            agent { label 'deploy' }
            input {
                message "Should we continue with deployment to TEST?"
                ok "Yes!"
            }
            steps {
                echo "Deploying ..."
                sh "pipeline-cli deploy --pr=${CHANGE_ID} --env=test"
            }
        }
        stage('Deploy (PROD)') {
            agent { label 'deploy' }
            input {
                message "Should we continue with deployment to PROD?"
                ok "Yes!"
            }
            steps {
                echo "Deploying ..."
                sh "pipeline-cli deploy --pr=${CHANGE_ID} --env=prod"
            }
        }
    }
}