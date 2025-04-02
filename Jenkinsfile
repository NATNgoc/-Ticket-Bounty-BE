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
                            env.NEW_VERSION = getCurVersion()
                        }
                    }
                }
            }
        }
        
        stage('Containerlize and Pushing') {
            environment {
                APP_NAME = "portfolio-ngoc:${env.NEW_VERSION}"
                HOST_URL = 'registry.digitalocean.com/portfolio-ngoc'
            }
            stages{
                stage('Build image') {
                    steps {
                        script {
                            def imageName = "${HOST_URL}/${APP_NAME}"
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
                            def imageName = "${HOST_URL}/${APP_NAME}"
                            pushImage(imageName)
                        }
                    }
                }
            }
        }
    }
}