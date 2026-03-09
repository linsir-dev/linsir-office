# Deployment Components Process

**Description:** Guides the deployment components design process including containerization (Docker, Kubernetes, CI/CD) and operation components (monitoring, logging, alerting). Invoke when user needs to design deployment architecture, containerize applications, or plan DevOps solutions.

**Version:** 1.0

---

## Overview

This skill guides the systematic design of deployment components, including containerization design (Docker, Kubernetes, CI/CD) and operation components design (monitoring, logging, alerting), ensuring standardized deployment and automated operations.

## When to Invoke

- User needs to design deployment architecture
- User wants to containerize applications
- User needs to plan CI/CD pipelines
- User requires monitoring/logging/alerting solutions
- User needs to design Kubernetes configurations
- User wants to implement DevOps practices

## Process Steps

### Step 1: Image Management Design

**Objective**: Plan image registry, naming conventions, and version strategy

**Activities**:

1. **Image Registry Planning**
   - Select Harbor as private registry
   - Plan project isolation (frontend/backend/database/middleware)
   - Configure access control

2. **Image Naming Convention**
   - Format: `{registry}/{project}/{service}:{version}-{env}`
   - Example: `harbor.linsir.com/linsir/backend:v1.0.0-prod`

3. **Image Version Strategy**
   - Development: `v1.0.0-SNAPSHOT-{build}`
   - Testing: `v1.0.0-RC{number}`
   - Production: `v1.0.0`
   - Latest: `latest`

**Deliverables**:
- Image Registry Planning Document
- Image Naming Convention
- Version Management Strategy

**Acceptance Criteria**:
- [√] Registry planning is reasonable
- [√] Naming convention is clear
- [√] Version strategy supports multi-environment

---

### Step 2: Dockerfile Design

**Objective**: Design Dockerfiles for frontend and backend applications

**Activities**:

1. **Backend Dockerfile**
   - Multi-stage build (builder + runtime)
   - Base images: eclipse-temurin:17-jdk-alpine / eclipse-temurin:17-jre-alpine
   - Maven build: `./mvnw clean package -DskipTests`
   - Security: non-root user, minimal image
   - JVM optimization: G1 GC, memory percentage
   - Health check: Spring Boot Actuator

2. **Frontend Dockerfile**
   - Multi-stage build (builder + nginx)
   - Base images: node:20-alpine / nginx:alpine
   - Nginx config: Gzip compression, static caching, routing

**Deliverables**:
- Backend Dockerfile
- Frontend Dockerfile
- Nginx Configuration

**Acceptance Criteria**:
- [√] Multi-stage build optimizes image size
- [√] Security best practices (non-root user)
- [√] Health check configured

---

### Step 3: Kubernetes Configuration Design

**Objective**: Design Kubernetes orchestration configurations

**Activities**:

1. **Namespace Planning**
   - linsir-prod: production
   - linsir-test: testing
   - linsir-dev: development

2. **Deployment Configuration**
   - Replicas: minimum 3 for production
   - Resource limits: requests/limits
   - Rolling update strategy
   - Pod anti-affinity

3. **Service Configuration**
   - ClusterIP type
   - Port mapping

4. **Ingress Configuration**
   - SSL/TLS
   - Routing rules
   - Domain configuration

5. **HPA Auto-scaling**
   - CPU threshold: 70%
   - Memory threshold: 80%
   - Custom metrics (QPS)

6. **Health Checks**
   - Liveness Probe
   - Readiness Probe
   - Startup Probe

**Deliverables**:
- Namespace YAML
- Deployment YAML
- Service YAML
- Ingress YAML
- HPA YAML

**Acceptance Criteria**:
- [√] Resource configuration is reasonable
- [√] High availability configured
- [√] Health checks comprehensive

---

### Step 4: CI/CD Pipeline Design

**Objective**: Design continuous integration and deployment pipeline

**Activities**:

1. **Jenkins Pipeline**
   - Checkout: code checkout
   - Build: Maven/npm build
   - Test: unit tests, code quality
   - Build Image: Docker build and push
   - Deploy: K8s deployment

2. **GitLab CI Configuration**
   - Parallel builds
   - Cache configuration
   - Artifact management

3. **Automated Testing**
   - Unit tests
   - Code quality (SonarQube)
   - Security scanning

4. **Deployment Strategy**
   - Test environment: auto deployment
   - Production: manual approval

**Deliverables**:
- Jenkinsfile
- .gitlab-ci.yml
- Pipeline Documentation

**Acceptance Criteria**:
- [√] Pipeline covers full lifecycle
- [√] Automated testing integrated
- [√] Multi-environment deployment supported

---

### Step 5: Monitoring Components Design

**Objective**: Design system monitoring solution

**Activities**:

1. **Prometheus Deployment**
   - High availability architecture
   - Data retention (30 days)
   - Scrape configuration

2. **Exporter Deployment**
   - Node Exporter: host monitoring
   - MySQL Exporter: database monitoring
   - Redis Exporter: cache monitoring
   - JMX Exporter: JVM monitoring

3. **Business Metrics**
   - Custom Metrics (Micrometer)
   - User registration counter
   - Order processing timer
   - Online users gauge

4. **Health Check Metrics**
   - Database connectivity
   - Redis connectivity
   - Dependency services

**Deliverables**:
- Prometheus Configuration
- Exporter Deployment YAML
- Business Metrics Code
- Health Check Implementation

**Acceptance Criteria**:
- [√] Infrastructure monitoring covered
- [√] Business metrics observable
- [√] Health checks complete

---

### Step 6: Logging Components Design

**Objective**: Design log collection and analysis solution

**Activities**:

1. **ELK Stack Architecture**
   - Fluentd: log collection
   - Elasticsearch: log storage
   - Kibana: log visualization

2. **Log Collection Configuration**
   - DaemonSet Fluentd deployment
   - Container log collection
   - Multi-line log processing

3. **Log Storage Strategy**
   - Index lifecycle management
   - 30-day retention
   - Hot/warm data separation

4. **Log Analysis**
   - Full-text search
   - Field filtering
   - Aggregation analysis

**Deliverables**:
- Fluentd Configuration
- Elasticsearch Deployment YAML
- Kibana Deployment YAML
- Index Template Configuration

**Acceptance Criteria**:
- [√] Log collection without loss
- [√] Storage strategy reasonable
- [√] Search performance meets requirements

---

### Step 7: Alerting Components Design

**Objective**: Design alerting and notification solution

**Activities**:

1. **Alertmanager Configuration**
   - Alert routing
   - Grouping strategy
   - Inhibition rules

2. **Alert Rules**
   - Service down alerts
   - Resource usage alerts (CPU/memory/disk)
   - Business metric alerts
   - Error rate alerts

3. **Notification Channels**
   - Email
   - DingTalk Webhook
   - WeChat Work

4. **Alert Convergence**
   - Duplicate alert suppression
   - Alert escalation
   - Silence rules

**Deliverables**:
- Alertmanager Configuration
- Prometheus Alert Rules
- Webhook Service Code
- Alert Operation Manual

**Acceptance Criteria**:
- [√] Alerts cover critical scenarios
- [√] Notification channels available
- [√] Alert convergence effective

---

### Step 8: Visualization Components Design

**Objective**: Design monitoring visualization solution

**Activities**:

1. **Grafana Deployment**
   - Data source configuration (Prometheus/Elasticsearch)
   - User permission management
   - Plugin installation

2. **Dashboard Design**
   - System overview dashboard
   - Application performance dashboard
   - Business monitoring dashboard
   - Log analysis dashboard

**Deliverables**:
- Grafana Deployment YAML
- Dashboard JSON Configuration
- Data Source Configuration

**Acceptance Criteria**:
- [√] Dashboards cover key metrics
- [√] Visualization clear and intuitive
- [√] Permission control reasonable

---

### Step 9: Deployment Components Review

**Objective**: Review deployment components design results

**Activities**:

1. **Containerization Review**
   - Image management review
   - Dockerfile review
   - K8s configuration review
   - CI/CD pipeline review

2. **Operation Components Review**
   - Monitoring review
   - Logging review
   - Alerting review
   - Visualization review

3. **Issue Resolution**
   - Record review comments
   - Develop modification plan
   - Complete document revision

**Deliverables**:
- Deployment Components Review Record
- Revised Design Documents

**Acceptance Criteria**:
- [√] Review comments fully recorded
- [√] All issues resolved
- [√] Documents formally approved

---

## Key Templates

### Dockerfile Template (Backend)

```dockerfile
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline -B
COPY src src
RUN ./mvnw clean package -DskipTests -B

FROM eclipse-temurin:17-jre-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
RUN chown -R appuser:appgroup /app
USER appuser
ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0"
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### Deployment Template

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-name
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app-name
  template:
    metadata:
      labels:
        app: app-name
    spec:
      containers:
        - name: app
          image: registry/project/service:version
          ports:
            - containerPort: 8080
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "2Gi"
              cpu: "1000m"
```

---

## Output Files

| No. | File Name | File Code | Description |
|-----|-----------|-----------|-------------|
| 1 | Containerization Design | SYS-DES-ARCH-DEPLOY-001 | Docker, K8s, CI/CD |
| 2 | Operation Components Design | SYS-DES-ARCH-DEPLOY-002 | Monitoring, logging, alerting |
| 3 | Deployment Components Review | SYS-DES-ARCH-DEPLOY-REV-001 | Review results |
