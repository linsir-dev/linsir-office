# 容器化组件设计

> **文档编号**: SYS-DES-ARCH-DEPLOY-001  
> **版本**: 1.0  
> **创建日期**: 2026-03-08  
> **作者**: 架构师  
> **状态**: ✅ 已完成

---

## 1. 概述

### 1.1 设计目标

本文档定义System平台的容器化组件设计，包括Docker镜像设计、Kubernetes编排配置和CI/CD流水线设计，实现应用的标准化部署和自动化运维。

### 1.2 设计原则

1. **标准化**：使用统一的镜像规范和部署配置
2. **自动化**：实现从代码提交到生产部署的全自动化
3. **可观测**：集成监控、日志、告警能力
4. **高可用**：支持多副本、故障自愈、滚动更新

### 1.3 适用范围

- 前端应用容器化
- 后端服务容器化
- 数据库和中间件容器化
- CI/CD流水线设计

---

## 2. 镜像管理

### 2.1 镜像仓库规划

**Harbor私有镜像仓库**

| 项目 | 用途 | 访问权限 |
|-----|------|---------|
| linsir/frontend | 前端应用镜像 | 开发/运维 |
| linsir/backend | 后端服务镜像 | 开发/运维 |
| linsir/database | 数据库镜像 | 运维 |
| linsir/middleware | 中间件镜像 | 运维 |

### 2.2 镜像命名规范

```
{registry}/{project}/{service}:{version}-{env}
```

**示例：**
- `harbor.linsir.com/linsir/backend:v1.0.0-prod`
- `harbor.linsir.com/linsir/frontend:v1.0.0-test`

### 2.3 镜像版本策略

| 版本类型 | 格式 | 用途 |
|---------|------|------|
| 开发版本 | `v1.0.0-SNAPSHOT-{build}` | 开发环境 |
| 测试版本 | `v1.0.0-RC{number}` | 测试环境 |
| 生产版本 | `v1.0.0` | 生产环境 |
| 最新版本 | `latest` | 本地开发 |

---

## 3. Dockerfile设计

### 3.1 后端服务Dockerfile

```dockerfile
# 多阶段构建
FROM eclipse-temurin:17-jdk-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制Maven配置
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# 下载依赖（利用缓存层）
RUN ./mvnw dependency:go-offline -B

# 复制源码
COPY src src

# 构建应用
RUN ./mvnw clean package -DskipTests -B

# 运行时镜像
FROM eclipse-temurin:17-jre-alpine

# 安装必要工具
RUN apk add --no-cache curl

# 创建应用用户
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 设置工作目录
WORKDIR /app

# 从构建阶段复制jar包
COPY --from=builder /app/target/*.jar app.jar

# 设置权限
RUN chown -R appuser:appgroup /app

# 切换到应用用户
USER appuser

# JVM参数配置
ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=50.0"
ENV SPRING_PROFILES_ACTIVE=prod

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# 暴露端口
EXPOSE 8080

# 启动命令
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### 3.2 前端应用Dockerfile

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源码
COPY . .

# 构建应用
RUN npm run build

# 运行时阶段
FROM nginx:alpine

# 复制nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 3.3 Nginx配置

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 前端路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api/ {
        proxy_pass http://backend-service:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 4. Kubernetes配置

### 4.1 Namespace规划

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: linsir-prod
  labels:
    environment: production
    project: linsir
---
apiVersion: v1
kind: Namespace
metadata:
  name: linsir-test
  labels:
    environment: testing
    project: linsir
---
apiVersion: v1
kind: Namespace
metadata:
  name: linsir-dev
  labels:
    environment: development
    project: linsir
```

### 4.2 后端服务Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: linsir-backend
  namespace: linsir-prod
  labels:
    app: linsir-backend
    version: v1.0.0
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: linsir-backend
  template:
    metadata:
      labels:
        app: linsir-backend
        version: v1.0.0
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app
                      operator: In
                      values:
                        - linsir-backend
                topologyKey: kubernetes.io/hostname
      containers:
        - name: backend
          image: harbor.linsir.com/linsir/backend:v1.0.0-prod
          imagePullPolicy: Always
          ports:
            - containerPort: 8080
              name: http
              protocol: TCP
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: "prod"
            - name: JAVA_OPTS
              value: "-XX:+UseG1GC -XX:MaxRAMPercentage=75.0"
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "2Gi"
              cpu: "1000m"
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: 8080
            initialDelaySeconds: 60
            periodSeconds: 30
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 3
            failureThreshold: 3
          startupProbe:
            httpGet:
              path: /actuator/health
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 30
          volumeMounts:
            - name: logs
              mountPath: /app/logs
            - name: config
              mountPath: /app/config
              readOnly: true
      volumes:
        - name: logs
          emptyDir: {}
        - name: config
          configMap:
            name: linsir-backend-config
      imagePullSecrets:
        - name: harbor-secret
```

### 4.3 后端服务Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: linsir-backend-service
  namespace: linsir-prod
  labels:
    app: linsir-backend
spec:
  type: ClusterIP
  ports:
    - port: 8080
      targetPort: 8080
      protocol: TCP
      name: http
  selector:
    app: linsir-backend
```

### 4.4 前端应用Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: linsir-frontend
  namespace: linsir-prod
  labels:
    app: linsir-frontend
    version: v1.0.0
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: linsir-frontend
  template:
    metadata:
      labels:
        app: linsir-frontend
        version: v1.0.0
    spec:
      containers:
        - name: frontend
          image: harbor.linsir.com/linsir/frontend:v1.0.0-prod
          imagePullPolicy: Always
          ports:
            - containerPort: 80
              name: http
              protocol: TCP
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
      imagePullSecrets:
        - name: harbor-secret
```

### 4.5 Ingress配置

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: linsir-ingress
  namespace: linsir-prod
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "300"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "300"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - linsir.example.com
        - api.linsir.example.com
      secretName: linsir-tls-secret
  rules:
    - host: linsir.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: linsir-frontend-service
                port:
                  number: 80
    - host: api.linsir.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: linsir-backend-service
                port:
                  number: 8080
```

### 4.6 HPA自动扩缩容

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: linsir-backend-hpa
  namespace: linsir-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: linsir-backend
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
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Percent
          value: 100
          periodSeconds: 15
        - type: Pods
          value: 4
          periodSeconds: 15
      selectPolicy: Max
```

---

## 5. CI/CD流水线

### 5.1 Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'harbor.linsir.com'
        PROJECT_NAME = 'linsir'
        IMAGE_TAG = "${BUILD_NUMBER}-${GIT_COMMIT.take(7)}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh './mvnw clean package -DskipTests'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Unit Test') {
            parallel {
                stage('Backend Test') {
                    steps {
                        dir('backend') {
                            sh './mvnw test'
                        }
                    }
                    post {
                        always {
                            junit 'backend/target/surefire-reports/*.xml'
                        }
                    }
                }
                stage('Frontend Test') {
                    steps {
                        dir('frontend') {
                            sh 'npm run test:unit'
                        }
                    }
                }
            }
        }
        
        stage('Code Quality') {
            steps {
                dir('backend') {
                    sh './mvnw sonar:sonar'
                }
            }
        }
        
        stage('Build Images') {
            parallel {
                stage('Backend Image') {
                    steps {
                        dir('backend') {
                            sh """
                                docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}/backend:${IMAGE_TAG} .
                                docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}/backend:${IMAGE_TAG}
                            """
                        }
                    }
                }
                stage('Frontend Image') {
                    steps {
                        dir('frontend') {
                            sh """
                                docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}/frontend:${IMAGE_TAG} .
                                docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}/frontend:${IMAGE_TAG}
                            """
                        }
                    }
                }
            }
        }
        
        stage('Deploy to Test') {
            when {
                branch 'develop'
            }
            steps {
                sh """
                    kubectl set image deployment/linsir-backend \
                        backend=${DOCKER_REGISTRY}/${PROJECT_NAME}/backend:${IMAGE_TAG} \
                        -n linsir-test
                    kubectl set image deployment/linsir-frontend \
                        frontend=${DOCKER_REGISTRY}/${PROJECT_NAME}/frontend:${IMAGE_TAG} \
                        -n linsir-test
                """
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                sh """
                    kubectl set image deployment/linsir-backend \
                        backend=${DOCKER_REGISTRY}/${PROJECT_NAME}/backend:${IMAGE_TAG} \
                        -n linsir-prod
                    kubectl set image deployment/linsir-frontend \
                        frontend=${DOCKER_REGISTRY}/${PROJECT_NAME}/frontend:${IMAGE_TAG} \
                        -n linsir-prod
                """
            }
        }
    }
    
    post {
        success {
            echo 'Build successful!'
            // 发送成功通知
        }
        failure {
            echo 'Build failed!'
            // 发送失败告警
        }
    }
}
```

### 5.2 GitLab CI配置

```yaml
stages:
  - build
  - test
  - package
  - deploy

variables:
  DOCKER_REGISTRY: harbor.linsir.com
  PROJECT_NAME: linsir

backend-build:
  stage: build
  image: eclipse-temurin:17-jdk
  script:
    - cd backend
    - ./mvnw clean package -DskipTests
  artifacts:
    paths:
      - backend/target/*.jar
    expire_in: 1 hour

frontend-build:
  stage: build
  image: node:20
  script:
    - cd frontend
    - npm ci
    - npm run build
  artifacts:
    paths:
      - frontend/dist
    expire_in: 1 hour

test:
  stage: test
  parallel:
    matrix:
      - SERVICE: [backend, frontend]
  script:
    - echo "Testing ${SERVICE}"

docker-build:
  stage: package
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $DOCKER_REGISTRY
    - docker build -t $DOCKER_REGISTRY/$PROJECT_NAME/backend:$CI_COMMIT_SHA ./backend
    - docker build -t $DOCKER_REGISTRY/$PROJECT_NAME/frontend:$CI_COMMIT_SHA ./frontend
    - docker push $DOCKER_REGISTRY/$PROJECT_NAME/backend:$CI_COMMIT_SHA
    - docker push $DOCKER_REGISTRY/$PROJECT_NAME/frontend:$CI_COMMIT_SHA

deploy-test:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl set image deployment/linsir-backend backend=$DOCKER_REGISTRY/$PROJECT_NAME/backend:$CI_COMMIT_SHA -n linsir-test
    - kubectl set image deployment/linsir-frontend frontend=$DOCKER_REGISTRY/$PROJECT_NAME/frontend:$CI_COMMIT_SHA -n linsir-test
  environment:
    name: test
  only:
    - develop
```

---

## 6. 配置管理

### 6.1 ConfigMap配置

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: linsir-backend-config
  namespace: linsir-prod
data:
  application.yml: |
    server:
      port: 8080
    spring:
      profiles:
        active: prod
      datasource:
        url: jdbc:mysql://mysql-service:3306/linsir?useUnicode=true&characterEncoding=utf8
        username: ${DB_USERNAME}
        password: ${DB_PASSWORD}
      redis:
        host: redis-service
        port: 6379
        password: ${REDIS_PASSWORD}
    logging:
      level:
        root: INFO
        com.linsir: DEBUG
```

### 6.2 Secret配置

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: linsir-backend-secret
  namespace: linsir-prod
type: Opaque
data:
  DB_USERNAME: bGluc2ly  # base64 encoded
  DB_PASSWORD: cGFzc3dvcmQxMjM=  # base64 encoded
  REDIS_PASSWORD: cmVkaXMxMjM=  # base64 encoded
  JWT_SECRET: eW91ci1qd3Qtc2VjcmV0LWtleS1oZXJl  # base64 encoded
```

---

## 7. 部署监控

### 7.1 部署状态检查

```bash
#!/bin/bash
# deploy-check.sh

NAMESPACE=${1:-linsir-prod}

echo "Checking deployment status in namespace: $NAMESPACE"

# 检查Pod状态
echo "=== Pod Status ==="
kubectl get pods -n $NAMESPACE

# 检查服务状态
echo "=== Service Status ==="
kubectl get svc -n $NAMESPACE

# 检查Ingress状态
echo "=== Ingress Status ==="
kubectl get ingress -n $NAMESPACE

# 检查HPA状态
echo "=== HPA Status ==="
kubectl get hpa -n $NAMESPACE

# 检查事件
echo "=== Recent Events ==="
kubectl get events -n $NAMESPACE --sort-by='.lastTimestamp' | tail -20
```

### 7.2 日志收集配置

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
  namespace: kube-system
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      <parse>
        @type multi_format
        <pattern>
          format json
          time_key time
          time_format %Y-%m-%dT%H:%M:%S.%NZ
          keep_time_key true
        </pattern>
        <pattern>
          format regexp
          expression /^(?<time>.+) (?<stream>stdout|stderr) [^ ]* (?<log>.*)$/
          time_format %Y-%m-%dT%H:%M:%S.%N%:z
        </pattern>
      </parse>
    </source>
    
    <filter kubernetes.**>
      @type kubernetes_metadata
    </filter>
    
    <match kubernetes.**>
      @type elasticsearch
      host elasticsearch
      port 9200
      logstash_format true
      logstash_prefix k8s
    </match>
```

---

## 8. 回滚策略

### 8.1 应用回滚

```bash
# 查看历史版本
kubectl rollout history deployment/linsir-backend -n linsir-prod

# 回滚到上一个版本
kubectl rollout undo deployment/linsir-backend -n linsir-prod

# 回滚到指定版本
kubectl rollout undo deployment/linsir-backend -n linsir-prod --to-revision=3
```

### 8.2 数据库回滚

```bash
# 数据库备份
kubectl exec -it mysql-pod -- mysqldump -u root -p linsir > backup.sql

# 数据库恢复
kubectl exec -i mysql-pod -- mysql -u root -p linsir < backup.sql
```

---

## 9. 输出文件

| 序号 | 文件名称 | 文件编号 | 说明 |
|-----|---------|---------|------|
| 1 | 容器化组件设计 | SYS-DES-ARCH-DEPLOY-001 | 本文档 |
| 2 | 运维组件设计 | SYS-DES-ARCH-DEPLOY-002 | 监控、日志、告警 |
| 3 | 部署组件评审记录 | SYS-DES-ARCH-DEPLOY-REV-001 | 评审结果 |

---

## 10. 修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 架构师 | 初始版本，定义容器化组件设计 |
