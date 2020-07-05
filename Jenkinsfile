node {
    def app

    stage('Checkout') {
        checkout scm
    }

    stage('Build image') {
        app = docker.build("korti/google-forms-vote-bot")
    }

    stage('Push image') {
        def packageJson = readJSON file: 'package.json'

        docker.withRegistry("docker.pkg.github.com", "github") {
            app.push("${packageJson.version}")
            app.push("latest")
        }
    }
}