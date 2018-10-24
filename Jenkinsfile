pipeline {
    agent none
    options {
        disableResume()
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
                sh ".pipeline/cli.sh build --pr=${CHANGE_ID}"
            }
        }
        stage('Deploy (DEV)') {
            agent { label 'deploy' }
            steps {
                echo "Deploying ..."
                sh ".pipeline/cli.sh deploy --pr=${CHANGE_ID} --env=dev"
            }
        }
    }
}