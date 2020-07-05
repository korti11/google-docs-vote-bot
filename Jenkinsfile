def app

pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build image') {
            steps {
                script {
                    app = docker.build("korti11/google-forms-vote-bot")
                }
            }
        }

        stage('Push image') {
            steps {
                script {
                    def packageJson = readJSON file: 'package.json'

                    docker.withRegistry("docker.pkg.github.com", "github") {
                        app.push("${packageJson.version}");
                        app.push("latest")
                    }
                }
            }
        }
    }
}