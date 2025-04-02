@Library('natn') _

pipeline {
    agent any

    tools {
        nodejs 'node-22.11' 
    }
    environment {
        VERSION_TYPE = "patch"
        ID_GIT_CREDENTAILS = "github-account"
        ID_GIT_TOKEN_CREDENTAILS = "github-token"
        HELM_CHART_NAME = "portfolio-v1"
        HELM_REPO = "registry.digitalocean.com/portfolio-ngoc/portfolio-ngoc"
    }
    stages {

        stage('Skip CI checking') {
            steps {
                scmSkip(deleteBuild: true, skipPattern:'.*\\[ci\\].*')
            }
        }

        stage('Intialized Nest CLI') {
            steps {
                sh 'which nest >/dev/null || npm i -g @nestjs/cli'
            }
        }
        
        stage('Build App') {
            steps {
                installLibary()
                buildNode()
            }
        }
        
        stage('Test App') {
            steps {
                installLibary()
                testNodeApp()
            }
        }

        stage('Versioning') {
            stages {
                stage('Setting profile git for jenkins') {
                    steps {
                        withCredentials([usernamePassword(credentialsId: "${env.ID_GIT_CREDENTAILS}", passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                            sh '''
                            git tag | xargs git tag -d
                            git config --global user.email "jenkins@example.com"
                            git config --global user.name "jenkins"
                            git remote set-url origin https://github.com/NATNgoc/-Ticket-Bounty-BE.git
                            '''
                        }
                    }
                }
                stage('Increasing version') {
                    steps {
                        script {
                            versioning("${env.VERSION_TYPE}")
                        }
                    }
                }
            }
        }
        
        stage('Containerlize and Pushing') {
            environment {
                APP_NAME = "portfolio-ngoc"
                HOST_URL = 'registry.digitalocean.com/portfolio-ngoc'
            }
            stages{
                stage('Build image') {
                    steps {
                        script {
                            env.NEW_VERSION = getCurVersion()
                            def imageName = "${HOST_URL}/${APP_NAME}:${NEW_VERSION}"
                            buildImage(imageName)
                        }
                    }
                }
                stage('Login to registry') {
                    steps {
                        loginRegistry("DG-Registry","registry.digitalocean.com/portfolio-ngoc")
                    }
                }
                stage('Push image to registry') {
                    steps {
                        script {
                            def imageName = "${HOST_URL}/${APP_NAME}:${NEW_VERSION}"
                            pushImage(imageName)
                        }
                    }
                }
            }
        }

        stage('Deploying to dev enviroment') {
            steps {
                withKubeConfig([credentialsId: 'k8s-config-file', serverUrl: 'https://fff0a127-53a3-4c08-9982-78f8b1d979d7.k8s.ondigitalocean.com']) {
                    sh """
                        helm list
                        helm upgrade portfolio-v1 ./IaC/backend --set image.repository='${env.HELM_REPO}' --set image.tag='${env.NEW_VERSION}'
                    """
                }
            }
        }

        stage('Commit version to git') {
            steps {  
                withCredentials([string(credentialsId: "$ID_GIT_TOKEN_CREDENTAILS", variable: 'TOKEN')]) {
                    sh """

                    git remote set-url origin https://${TOKEN}@github.com/NATNgoc/-Ticket-Bounty-BE.git
                    git status
                    git branch
                    git config --list
                    git add .
                    git commit -m '[ci]: version ${env.NEW_VERSION} bump'
                    git push origin HEAD:main

                    """
                }
            }
        }
    }
}