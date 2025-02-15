pipeline {
    agent any

    environment {
        NODEJS_HOME = tool 'NodeJS 18'  // Adjust this based on your Node.js setup in Jenkins
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy (Optional)') {
            steps {
                sh 'cp -r build/* /home/turkish-kebab-pizza-house/domains/dashboard.turkish-kebab-pizza-house.co.uk/public_html/'  // Change based on your deployment method
            }
        }
    }
}