
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
                    echo "Building ..."
                    sh "cd .pipeline && ${WORKSPACE}/npmw ci && DEBUG='info:*' ${WORKSPACE}/npmw run build -- --pr=${CHANGE_ID}"
                }
            }
        }
        stage('Deploy (DEV)') {
            agent { label 'deploy' }
            steps {
                echo "Deploying ..."
                script{
                    def deploymentId = gitHubCreateDeployment(this, 'DEV', ['targetUrl':env.BUILD_URL])
                    try{
                        sh "cd .pipeline && ${WORKSPACE}/npmw ci && DEBUG='info:*' ${WORKSPACE}/npmw run deploy -- --pr=${CHANGE_ID} --env=dev"
                        gitHubCreateDeploymentStatus(this, deploymentId, 'SUCCESS', ['targetUrl':env.BUILD_URL])
                    }catch (error) {
                        gitHubCreateDeploymentStatus(this, deploymentId, 'ERROR', ['targetUrl':env.BUILD_URL])
                        throw error
                    }
                }
                
            }
        }
        stage('GUI Test'){
            parallel {
                stage('GUI Test (Chrome)') {
                    agent { label 'ui-test' }
                    environment {
                        SELENIUM_REMOTE_URL = 'http://selenium-hub:4444/wd/hub'
                    }
                    steps {
                        //sh 'cd hello-test1 && "$(git rev-parse --show-toplevel)/npmw" ci && npm run chrome-test'
                        echo "Skipping."
                    }
                }
                stage('GUI Test (Firefox)') {
                    agent { label 'ui-test' }
                    environment {
                        SELENIUM_REMOTE_URL = 'http://selenium-hub:4444/wd/hub'
                    }
                    steps {
                        //sh '{ set +x; } 2>/dev/null && export NVM_DIR="${WORKSPACE}/.nvm" && (mkdir -p "${NVM_DIR}" && curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash && source "$NVM_DIR/nvm.sh" && nvm install --lts=dubnium --no-progress ) && . "$NVM_DIR/nvm.sh" && set -x && nvm use --lts=dubnium && cd hello-test1 && npm ci && npm run firefox-test'
                        echo "Firefox seems buggy ... Skipping."
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
                submitter 'authenticated'
                submitterParameter "APPROVED_BY"
            }
            steps {
                echo "Deploying ..."
                script{
                    GitHubHelper.getPullRequest(this).comment("User '${APPROVED_BY}' has approved deployment to 'TEST'")
                    def deploymentId = gitHubCreateDeployment(this, 'TEST', ['targetUrl':env.BUILD_URL])
                    try{
                        sh "cd .pipeline && ${WORKSPACE}/npmw ci && DEBUG='info:*' ${WORKSPACE}/npmw run deploy -- --pr=${CHANGE_ID} --env=test"
                        gitHubCreateDeploymentStatus(this, deploymentId, 'SUCCESS', ['targetUrl':env.BUILD_URL])
                    }catch (error) {
                        gitHubCreateDeploymentStatus(this, deploymentId, 'ERROR', ['targetUrl':env.BUILD_URL])
                        throw error
                    }
                }
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
                submitter 'authenticated'
                submitterParameter "APPROVED_BY"
            }
            steps {
                echo "Deploying ..."
                script{
                    //GitHubHelper.getPullRequest(this).comment("User '${APPROVED_BY}' has approved deployment to 'TEST'")
                    def deploymentId = gitHubCreateDeployment(this, 'PROD', ['targetUrl':env.BUILD_URL])
                    try{
                        sh "cd .pipeline && ${WORKSPACE}/npmw ci && DEBUG='info:*' ${WORKSPACE}/npmw run deploy -- --pr=${CHANGE_ID} --env=prod"
                        gitHubCreateDeploymentStatus(this, deploymentId, 'SUCCESS', ['targetUrl':env.BUILD_URL])
                    }catch (error) {
                        gitHubCreateDeploymentStatus(this, deploymentId, 'ERROR', ['targetUrl':env.BUILD_URL])
                        throw error
                    }
                }
            }
        }
        stage('Cleanup') {
            agent { label 'deploy' }
            input {
                message "Ready to Accept/Merge, and Close pull-request?"
                ok "Yes!"
                submitter 'authenticated'
                submitterParameter "APPROVED_BY"
                parameters {
                    choice(name: 'MERGE_METHOD', choices: ((env.CHANGE_TARGET == 'master')?['merge', 'squash']:['squash', 'merge']), description: '')
                }
            }
            steps {
                script{
                    bcgov.GitHubHelper.mergeAndClosePullRequest(this, "${MERGE_METHOD}")
                }
            }
        }
    }
}