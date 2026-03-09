# 部署架构设计

> **文档编号**: SYS-DES-ARCH-DEPLOY-001  
> **版本**: 1.0  
> **创建日期**: 2026-03-08  
> **作者**: 架构师  
> **状态**: 🔄 进行中

---

## 1. 概述

### 1.1 目的

本文档定义System平台的部署架构设计，包括环境规划、容器化方案、CI/CD流水线设计，为系统的部署实施提供架构指导。

### 1.2 适用范围

- 开发环境部署
- 测试环境部署
- 生产环境部署
- CI/CD流水线
- 容器化方案

### 1.3 设计原则

1. **环境隔离**：开发、测试、生产环境完全隔离
2. **配置分离**：配置与代码分离，支持多环境部署
3. **自动化**：CI/CD全流程自动化
4. **可回滚**：支持快速回滚到历史版本
5. **监控完善**：部署过程可监控、可告警

---

## 2. 环境规划

### 2.1 环境划分

| 环境 | 用途 | 部署策略 | 数据策略 |
|-----|------|---------|---------|
| 开发环境 (dev) | 日常开发调试 | 自动部署 | 定期重置 |
| 测试环境 (test) | 功能/集成测试 | 手动触发 | 保留测试数据 |
| 预发布环境 (staging) | 生产前验证 | 手动部署 | 生产数据脱敏副本 |
| 生产环境 (prod) | 正式运行 | 审批后部署 | 严格备份 |

### 2.2 环境架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      环境部署架构                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   开发环境   │  │   测试环境   │  │  预发布环境  │         │
│  │    (dev)    │  │   (test)    │  │  (staging)  │         │
│  │             │  │             │  │             │         │
│  │  自动部署    │  │ 手动触发    │  │  手动部署    │         │
│  │  开发调试    │  │  功能测试   │  │  生产验证    │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                │
│         └────────────────┼────────────────┘                │
│                          ▼                                  │
│                   ┌─────────────┐                          │
│                   │   生产环境   │                          │
│                   │   (prod)    │                          │
│                   │             │                          │
│                   │  审批后部署  │                          │
│                   │  正式运行    │                          │
│                   └─────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 容器化方案

### 3.1 容器化策略

所有服务均采用Docker容器化部署，使用Kubernetes进行容器编排。

### 3.2 镜像管理

#### 3.2.1 镜像仓库

| 仓库类型 | 用途 | 访问权限 |
|---------|------|---------|
| 开发仓库 | 开发镜像 | 开发团队 |
| 测试仓库 | 测试镜像 | 测试团队 |
| 生产仓库 | 生产镜像 | 运维团队 |

#### 3.2.2 镜像命名规范

```
{registry}/{project}/{service}:{version}-{env}

示例：
- harbor.linsir.com/linsir/system-service:1.0.0-dev
- harbor.linsir.com/linsir/system-service:1.0.0-prod
```

#### 3.2.3 Dockerfile示例

**Gateway服务：**

```dockerfile
# 构建阶段
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# 运行阶段
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar

# JVM参数
ENV JAVA_OPTS="-Xms512m -Xmx512m -XX:+UseG1GC"
ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

**System服务：**

```dockerfile
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar

ENV JAVA_OPTS="-Xms1g -Xmx1g -XX:+UseG1GC"
ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

**前端应用：**

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /build/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 3.3 Kubernetes部署

#### 3.3.1 命名空间规划

```yaml
# 生产环境命名空间
apiVersion: v1
kind: Namespace
metadata:
  name: linsir-prod
  labels:
    env: production
    project: linsir-system

---
# 测试环境命名空间
apiVersion: v1
kind: Namespace
metadata:
  name: linsir-test
  labels:
    env: testing
    project: linsir-system
```

#### 3.3.2 Deployment配置

**Gateway服务：**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: linsir-gateway
  namespace: linsir-prod
  labels:
    app: linsir-gateway
spec:
  replicas: 2
  selector:
    matchLabels:
      app: linsir-gateway
  template:
    metadata:
      labels:
        app: linsir-gateway
    spec:
      containers:
        - name: gateway
          image: harbor.linsir.com/linsir/gateway:1.0.0-prod
          ports:
            - containerPort: 8080
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: "prod"
            - name: NACOS_SERVER
              value: "nacos.linsir-prod.svc.cluster.local:8848"
          resources:
            requests:
              memory: "512Mi"
              cpu: "500m"
            limits:
              memory: "1Gi"
              cpu: "1000m"
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 5
```

**System服务：**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: linsir-system
  namespace: linsir-prod
  labels:
    app: linsir-system
spec:
  replicas: 3
  selector:
    matchLabels:
      app: linsir-system
  template:
    metadata:
      labels:
        app: linsir-system
    spec:
      containers:
        - name: system
          image: harbor.linsir.com/linsir/system-service:1.0.0-prod
          ports:
            - containerPort: 8080
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: "prod"
            - name: MYSQL_HOST
              value: "mysql.linsir-prod.svc.cluster.local"
            - name: REDIS_HOST
              value: "redis.linsir-prod.svc.cluster.local"
            - name: NACOS_SERVER
              value: "nacos.linsir-prod.svc.cluster.local:8848"
          resources:
            requests:
              memory: "1Gi"
              cpu: "1000m"
            limits:
              memory: "2Gi"
              cpu: "2000m"
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: 8080
            initialDelaySeconds: 60
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 5
```

**前端应用：**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: linsir-web
  namespace: linsir-prod
  labels:
    app: linsir-web
spec:
  replicas: 2
  selector:
    matchLabels:
      app: linsir-web
  template:
    metadata:
      labels:
        app: linsir-web
    spec:
      containers:
        - name: web
          image: harbor.linsir.com/linsir/web-system:1.0.0-prod
          ports:
            - containerPort: 80
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "200m"
```

#### 3.3.3 Service配置

```yaml
apiVersion: v1
kind: Service
metadata:
  name: linsir-gateway
  namespace: linsir-prod
spec:
  selector:
    app: linsir-gateway
  ports:
    - port: 8080
      targetPort: 8080
  type: ClusterIP

---
apiVersion: v1
kind: Service
metadata:
  name: linsir-system
  namespace: linsir-prod
spec:
  selector:
    app: linsir-system
  ports:
    - port: 8080
      targetPort: 8080
  type: ClusterIP

---
apiVersion: v1
kind: Service
metadata:
  name: linsir-web
  namespace: linsir-prod
spec:
  selector:
    app: linsir-web
  ports:
    - port: 80
      targetPort: 80
  type: ClusterIP
```

#### 3.3.4 Ingress配置

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: linsir-ingress
  namespace: linsir-prod
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
    - hosts:
        - system.linsir.com
        - api.linsir.com
      secretName: linsir-tls
  rules:
    - host: system.linsir.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: linsir-web
                port:
                  number: 80
    - host: api.linsir.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: linsir-gateway
                port:
                  number: 8080
```

#### 3.3.5 HPA配置

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: linsir-system-hpa
  namespace: linsir-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: linsir-system
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Percent
          value: 100
          periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
```

---

## 4. CI/CD流水线

### 4.1 流水线架构

```
┌─────────────────────────────────────────────────────────────┐
│                      CI/CD流水线架构                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  代码提交 ──▶ 构建 ──▶ 测试 ──▶ 镜像 ──▶ 部署              │
│     │          │       │       │       │                   │
│     ▼          ▼       ▼       ▼       ▼                   │
│  ┌─────┐   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐               │
│  │Git  │   │Maven│ │Unit │ │Docker│ │K8s  │               │
│  │Push │   │Build│ │Test │ │Build │ │Deploy│               │
│  └─────┘   └─────┘ └─────┘ └─────┘ └─────┘               │
│     │          │       │       │       │                   │
│     └──────────┴───────┴───────┴───────┘                   │
│                    │                                       │
│                    ▼                                       │
│              ┌─────────┐                                   │
│              │ 通知/告警 │                                   │
│              └─────────┘                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'harbor.linsir.com'
        PROJECT_NAME = 'linsir'
        SERVICE_NAME = 'system-service'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }
        
        stage('Unit Test') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('Code Quality') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'mvn sonar:sonar'
                }
            }
        }
        
        stage('Build Image') {
            steps {
                script {
                    def image = docker.build("${DOCKER_REGISTRY}/${PROJECT_NAME}/${SERVICE_NAME}:${BUILD_NUMBER}")
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'harbor-credentials') {
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Dev') {
            when {
                branch 'develop'
            }
            steps {
                sh """
                    kubectl set image deployment/${SERVICE_NAME} \
                        ${SERVICE_NAME}=${DOCKER_REGISTRY}/${PROJECT_NAME}/${SERVICE_NAME}:${BUILD_NUMBER} \
                        -n linsir-dev
                    kubectl rollout status deployment/${SERVICE_NAME} -n linsir-dev
                """
            }
        }
        
        stage('Deploy to Test') {
            when {
                branch 'release/*'
            }
            steps {
                input message: 'Deploy to Test?', ok: 'Deploy'
                sh """
                    kubectl set image deployment/${SERVICE_NAME} \
                        ${SERVICE_NAME}=${DOCKER_REGISTRY}/${PROJECT_NAME}/${SERVICE_NAME}:${BUILD_NUMBER} \
                        -n linsir-test
                    kubectl rollout status deployment/${SERVICE_NAME} -n linsir-test
                """
            }
        }
        
        stage('Deploy to Prod') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to Production?', ok: 'Deploy'
                sh """
                    kubectl set image deployment/${SERVICE_NAME} \
                        ${SERVICE_NAME}=${DOCKER_REGISTRY}/${PROJECT_NAME}/${SERVICE_NAME}:${BUILD_NUMBER} \
                        -n linsir-prod
                    kubectl rollout status deployment/${SERVICE_NAME} -n linsir-prod
                """
            }
        }
    }
    
    post {
        success {
            dingtalk(
                robot: 'jenkins-robot',
                type: 'MARKDOWN',
                title: "Build Success: ${SERVICE_NAME}",
                text: [
                    "### ✅ Build Success",
                    "- **Service**: ${SERVICE_NAME}",
                    "- **Version**: ${BUILD_NUMBER}",
                    "- **Branch**: ${BRANCH_NAME}",
                    "- **Duration**: ${currentBuild.durationString}"
                ].join('\n')
            )
        }
        failure {
            dingtalk(
                robot: 'jenkins-robot',
                type: 'MARKDOWN',
                title: "Build Failed: ${SERVICE_NAME}",
                text: [
                    "### ❌ Build Failed",
                    "- **Service**: ${SERVICE_NAME}",
                    "- **Version**: ${BUILD_NUMBER}",
                    "- **Branch**: ${BRANCH_NAME}",
                    "- **Failed Stage**: ${currentBuild.currentResult}"
                ].join('\n')
            )
        }
    }
}
```

### 4.3 GitLab CI Pipeline

```yaml
stages:
  - build
  - test
  - package
  - deploy

variables:
  DOCKER_REGISTRY: "harbor.linsir.com"
  PROJECT_NAME: "linsir"

# 构建阶段
build:
  stage: build
  image: maven:3.9-eclipse-temurin-17
  script:
    - mvn clean compile
  cache:
    paths:
      - .m2/repository
  only:
    - merge_requests
    - develop
    - main

# 测试阶段
test:
  stage: test
  image: maven:3.9-eclipse-temurin-17
  script:
    - mvn test
  artifacts:
    reports:
      junit:
        - target/surefire-reports/TEST-*.xml
    paths:
      - target/surefire-reports/
  only:
    - merge_requests
    - develop
    - main

# 代码质量
sonarqube:
  stage: test
  image: maven:3.9-eclipse-temurin-17
  script:
    - mvn sonar:sonar -Dsonar.host.url=$SONAR_URL -Dsonar.login=$SONAR_TOKEN
  only:
    - merge_requests
    - develop
    - main

# 打包镜像
package:
  stage: package
  image: docker:24
  services:
    - docker:24-dind
  script:
    - docker build -t $DOCKER_REGISTRY/$PROJECT_NAME/system-service:$CI_COMMIT_SHA .
    - docker login -u $HARBOR_USER -p $HARBOR_PASS $DOCKER_REGISTRY
    - docker push $DOCKER_REGISTRY/$PROJECT_NAME/system-service:$CI_COMMIT_SHA
  only:
    - develop
    - main

# 部署到开发环境
deploy-dev:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context dev
    - kubectl set image deployment/system-service system-service=$DOCKER_REGISTRY/$PROJECT_NAME/system-service:$CI_COMMIT_SHA -n linsir-dev
    - kubectl rollout status deployment/system-service -n linsir-dev
  environment:
    name: development
    url: https://dev-system.linsir.com
  only:
    - develop

# 部署到测试环境
deploy-test:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context test
    - kubectl set image deployment/system-service system-service=$DOCKER_REGISTRY/$PROJECT_NAME/system-service:$CI_COMMIT_SHA -n linsir-test
    - kubectl rollout status deployment/system-service -n linsir-test
  environment:
    name: testing
    url: https://test-system.linsir.com
  when: manual
  only:
    - main

# 部署到生产环境
deploy-prod:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context prod
    - kubectl set image deployment/system-service system-service=$DOCKER_REGISTRY/$PROJECT_NAME/system-service:$CI_COMMIT_SHA -n linsir-prod
    - kubectl rollout status deployment/system-service -n linsir-prod
  environment:
    name: production
    url: https://system.linsir.com
  when: manual
  only:
    - main
```

---

## 5. 配置管理

### 5.1 配置分离策略

| 配置类型 | 存储位置 | 管理方式 |
|---------|---------|---------|
| 应用配置 | Nacos Config | 中心化配置 |
| 密钥配置 | Kubernetes Secret | 加密存储 |
| 环境变量 | ConfigMap | 环境隔离 |

### 5.2 Nacos配置

```yaml
# 共享配置
spring:
  cloud:
    nacos:
      config:
        server-addr: nacos.linsir-prod.svc.cluster.local:8848
        namespace: prod
        group: DEFAULT_GROUP
        file-extension: yaml
        shared-configs:
          - data-id: common.yaml
            group: DEFAULT_GROUP
            refresh: true
        extension-configs:
          - data-id: redis.yaml
            group: DEFAULT_GROUP
            refresh: true
          - data-id: mysql.yaml
            group: DEFAULT_GROUP
            refresh: true
```

### 5.3 Kubernetes Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: linsir-db-secret
  namespace: linsir-prod
type: Opaque
data:
  username: bGluZG9u  # base64 encoded
  password: bGluZG9uMTIz  # base64 encoded
```

---

## 6. 部署监控

### 6.1 部署状态监控

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: linsir-system-monitor
  namespace: linsir-prod
spec:
  selector:
    matchLabels:
      app: linsir-system
  endpoints:
    - port: http
      path: /actuator/prometheus
      interval: 30s
```

### 6.2 部署告警规则

```yaml
groups:
  - name: deployment-alerts
    rules:
      - alert: DeploymentReplicasMismatch
        expr: |
          kube_deployment_status_replicas_available{namespace="linsir-prod"}
          !=
          kube_deployment_spec_replicas{namespace="linsir-prod"}
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Deployment replicas mismatch"
          description: "Deployment {{ $labels.deployment }} has mismatched replicas"
```

---

## 7. 回滚策略

### 7.1 自动回滚

```bash
# 查看部署历史
kubectl rollout history deployment/linsir-system -n linsir-prod

# 回滚到上一个版本
kubectl rollout undo deployment/linsir-system -n linsir-prod

# 回滚到指定版本
kubectl rollout undo deployment/linsir-system -n linsir-prod --to-revision=3
```

### 7.2 蓝绿部署

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: linsir-system
  namespace: linsir-prod
spec:
  replicas: 3
  strategy:
    blueGreen:
      activeService: linsir-system
      previewService: linsir-system-preview
      autoPromotionEnabled: false
  selector:
    matchLabels:
      app: linsir-system
  template:
    metadata:
      labels:
        app: linsir-system
    spec:
      containers:
        - name: system
          image: harbor.linsir.com/linsir/system-service:1.0.0-prod
          ports:
            - containerPort: 8080
```

---

## 8. 修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 架构师 | 初始版本，定义部署架构设计 |
