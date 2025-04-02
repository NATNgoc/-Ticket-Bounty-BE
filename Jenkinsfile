@Library('natn') _

pipeline {
    agent any

    tools {
        nodejs 'node-22.11' 
    }
    environment {
        VERSION_TYPE = "patch"
        ID_GIT_CREDENTAILS = "github-account"
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
                        sh 'git tag | xargs git tag -d'
                        sh 'git config --global user.email "jenkins@example.com"'
                        sh 'git config --global user.name "jenkins"'
                        withCredentials([usernamePassword(credentialsId: "${env.ID_GIT_CREDENTAILS}", passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                            sh "git remote set-url origin https://${USER}:${PASS}@github.com/NATNgoc/-Ticket-Bounty-BE.git"
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

        stage('Commit version to git') {
            steps {  
                sh '''
                    git status
                    git branch
                    git config --list
                    git add .
                    git commit -m "[ci]: version bump"
                '''  
                sh "git push origin HEAD:${env.BRANCH_NAME}"
            }
        }
    }
}