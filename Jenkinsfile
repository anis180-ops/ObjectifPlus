pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-id')
        KUBECONFIG = 'C:\\Users\\HP\\.kube\\config-k3s'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Détection des changements') {
            steps {
                script {
                    def changes = bat(
                        script: '@git diff --name-only HEAD~1 HEAD',
                        returnStdout: true
                    ).trim()

                    echo "Fichiers modifiés:\n${changes}"

                    env.FRONTEND_CHANGED = changes.contains('frontend/') ? 'true' : 'false'
                    env.BACKEND_CHANGED  = changes.contains('backend/')  ? 'true' : 'false'
                }
            }
        }

        stage('Build & Push Backend') {
            when { environment name: 'BACKEND_CHANGED', value: 'true' }
            steps {
                bat """
                    docker build -t anissammoudi/objectifplus_backend:%BUILD_NUMBER% .\\backend
                    echo %DOCKERHUB_CREDS_PSW%|docker login -u %DOCKERHUB_CREDS_USR% --password-stdin
                    docker push anissammoudi/objectifplus_backend:%BUILD_NUMBER%
                    docker tag anissammoudi/objectifplus_backend:%BUILD_NUMBER% anissammoudi/objectifplus_backend:latest
                    docker push anissammoudi/objectifplus_backend:latest
                """
            }
        }

        stage('Build & Push Frontend') {
            when { environment name: 'FRONTEND_CHANGED', value: 'true' }
            steps {
                bat """
                    docker build -t anissammoudi/objectifplus_frontend:%BUILD_NUMBER% .\\frontend
                    echo %DOCKERHUB_CREDS_PSW%|docker login -u %DOCKERHUB_CREDS_USR% --password-stdin
                    docker push anissammoudi/objectifplus_frontend:%BUILD_NUMBER%
                    docker tag anissammoudi/objectifplus_frontend:%BUILD_NUMBER% anissammoudi/objectifplus_frontend:latest
                    docker push anissammoudi/objectifplus_frontend:latest
                """
            }
        }

        stage('Déploiement k3s') {
            when {
                anyOf {
                    environment name: 'FRONTEND_CHANGED', value: 'true'
                    environment name: 'BACKEND_CHANGED', value: 'true'
                }
            }
            steps {
                script {
                    if (env.BACKEND_CHANGED == 'true') {
                        bat "kubectl --kubeconfig=%KUBECONFIG% set image deployment/pff-backend-deploy backend=anissammoudi/objectifplus_backend:%BUILD_NUMBER% -n objectifplus"
                        bat "kubectl --kubeconfig=%KUBECONFIG% rollout status deployment/pff-backend-deploy -n objectifplus"
                    }
                    if (env.FRONTEND_CHANGED == 'true') {
                        bat "kubectl --kubeconfig=%KUBECONFIG% set image deployment/pff-frontend-deploy frontend=anissammoudi/objectifplus_frontend:%BUILD_NUMBER% -n objectifplus"
                        bat "kubectl --kubeconfig=%KUBECONFIG% rollout status deployment/pff-frontend-deploy -n objectifplus"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline terminé avec succès — build #${BUILD_NUMBER}"
        }
        failure {
            echo "❌ Échec du pipeline — vérifier les logs ci-dessus"
        }
    }
}