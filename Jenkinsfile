pipeline {
    agent any

    stages {
        stage('Build Service App') {
            steps{
                bat "docker build -t pizzaservice ."
            }
        }
         stage('Run Service App') {
            steps{
                bat "docker run -d pizzaservice"
            }
        }
    }
}