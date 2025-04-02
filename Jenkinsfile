@Library('natn') _

pipeline {
    agent any

    tools {
        nodejs 'node-22.11' 
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
        
        stage('Containerlize and Pushing') {
            environment {
                APP_NAME = 'portfolio-ngoc'
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
                            def imageName = "${HOST_URL}/${APP_NAME}:latest"
                            pushImage(imageName)
                        }
                    }
                }
            }
        }
    }
}