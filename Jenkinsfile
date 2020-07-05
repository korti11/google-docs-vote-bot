pipeline {
    agent {
        docker {
            image "docker"
        }
    }
    stages {
        def app

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build image') {
            steps {
                app = docker.build("korti/google-forms-vote-bot")
            }
        }

        stage('Push image') {
            steps {
                def packageJson = readJSON file: 'package.json'

                docker.withRegistry("docker.pkg.github.com", "github") {
                    app.push("${packageJson.version}");
                    app.push("latest")
                }
            }
        }
    }
}