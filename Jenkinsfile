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
                    app = docker.build("korti11/google-docs-vote-bot/google-forms-vote-bot")
                }
            }
        }

        stage('Push image') {
            steps {
                script {
                    if(env.BRANCH_NAME == "release") {
                        def packageJson = readJSON file: 'package.json'

                        docker.withRegistry("https://docker.pkg.github.com", "github") {
                            app.push("${packageJson.version}");
                            app.push("latest")
                        }
                    }
                }
            }
        }
    }
}