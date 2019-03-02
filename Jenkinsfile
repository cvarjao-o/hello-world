pipeline {
    agent none
    options {
        disableResume()
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
                sh "cd .pipeline && DEBUG='info:*' ./npmw build -- --pr=${CHANGE_ID}"
            }
        }
        stage('Deploy (DEV)') {
            agent { label 'deploy' }
            steps {
                echo "Deploying ..."
                sh "cd .pipeline && DEBUG='info:*' ./npmw deploy -- --pr=${CHANGE_ID} --env=dev"
            }
        }
        stage('GUI Test'){
            parallel {
                stage('GUI Test (Chrome)') {
                    agent { label 'deploy' }
                    environment {
                        SELENIUM_REMOTE_URL = 'http://selenium-hub:4444/wd/hub'
                    }
                    steps {
                        sh 'export NVM_DIR="${WORKSPACE}/.nvm" && mkdir -p "${NVM_DIR}" && curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash && . "$NVM_DIR/nvm.sh" && nvm install --lts=dubnium && cd hello-test1 && npm run chrome-test'
                    }
                }
                stage('GUI Test (Firefox)') {
                    agent { label 'deploy' }
                    environment {
                        SELENIUM_REMOTE_URL = 'http://selenium-hub:4444/wd/hub'
                    }
                    steps {
                        sh "cd hello-test1 && ../.pipeline/npmw firefox-test"
                    }
                }
            }
        }
        stage('Deploy (TEST)') {
            agent { label 'deploy' }
            when {
                expression { return env.CHANGE_TARGET == 'master';}
            }
            input {
                message "Should we continue with deployment to TEST?"
                ok "Yes!"
            }
            steps {
                echo "Deploying ..."
                sh "cd .pipeline && DEBUG='info:*' ./npmw deploy -- --pr=${CHANGE_ID} --env=test"
            }
        }
        stage('Deploy (PROD)') {
            agent { label 'deploy' }
            when {
                expression { return env.CHANGE_TARGET == 'master';}
            }
            input {
                message "Should we continue with deployment to PROD?"
                ok "Yes!"
            }
            steps {
                echo "Deploying ..."
                sh "cd .pipeline && ./npmw deploy -- --pr=${CHANGE_ID} --env=prod"
            }
        }
    }
}