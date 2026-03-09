---
name: "deployment-architecture-process"
description: "Guides the deployment and high availability architecture design process including environment planning, containerization, CI/CD pipeline, load balancing, failover, and backup/recovery. Invoke when user needs to design deployment architecture, containerize applications, or plan high availability solutions."
---

# Deployment and High Availability Architecture Design Process

This skill guides the deployment and high availability architecture design process for System platform and similar projects.

## When to Invoke

- User needs to design deployment architecture
- User wants to containerize applications
- User needs to plan CI/CD pipelines
- User requires high availability design
- User wants to design backup and recovery solutions
- User needs to plan load balancing and failover mechanisms

## Design Process

### Phase 1: Environment Planning

1. **Environment Segmentation**
   - Development (dev): Daily development, auto-deployment
   - Testing (test): Functional/integration testing, manual trigger
   - Staging: Pre-production validation, manual deployment
   - Production (prod): Live environment, approval-based deployment

2. **Deployment Strategy Definition**
   - Define deployment triggers for each environment
   - Data strategy (reset/retain/anonymize)
   - Access control policies

**Deliverables**:
- Environment planning document
- Environment architecture diagram
- Deployment strategy specification

### Phase 2: Containerization Design

1. **Image Management**
   - Harbor registry planning
   - Naming convention: `{registry}/{project}/{service}:{version}-{env}`
   - Multi-stage build strategy

2. **Dockerfile Creation**
   - Base image selection (eclipse-temurin:17-jre-alpine)
   - Multi-stage build optimization
   - JVM parameter configuration
   - Health check setup

3. **Kubernetes Configuration**
   - Namespace planning (linsir-prod/test/dev)
   - Deployment (replicas, resource limits, probes)
   - Service (ClusterIP)
   - Ingress (SSL, routing)
   - HPA (auto-scaling)

**Deliverables**:
- Dockerfile
- K8s YAML configurations
- Image management guidelines

### Phase 3: CI/CD Pipeline Design

1. **Pipeline Architecture**
   - Flow: Code commit → Build → Test → Image → Deploy
   - Branch strategy (develop/test/main)
   - Trigger strategy (auto/manual)

2. **Jenkins Pipeline**
   - Checkout stage
   - Build stage (Maven)
   - Test stage (unit tests)
   - Code Quality stage (SonarQube)
   - Build Image stage (Docker build & push)
   - Deploy stage (K8s deployment)

3. **Notification Configuration**
   - Build success notifications
   - Build failure alerts

**Deliverables**:
- Jenkinsfile
- .gitlab-ci.yml (optional)
- Pipeline documentation

### Phase 4: High Availability Design

1. **Availability Targets**
   - System availability: 99.9%
   - RTO: < 30 minutes
   - RPO: < 5 minutes

2. **Load Balancing**
   - Layer 4 (LVS + Keepalived)
   - Layer 7 (Nginx)
   - Load balancing algorithms

3. **Failover Mechanisms**
   - K8s self-healing (liveness/readiness probes)
   - Circuit breaker (Resilience4j)
   - Database master-slave switch
   - Redis sentinel mode

4. **Health Checks**
   - Application health endpoints
   - Database connectivity checks
   - Dependency service checks

**Deliverables**:
- High availability architecture diagram
- Load balancing configurations
- Failover procedures

### Phase 5: Backup and Recovery Design

1. **Backup Strategy**
   - MySQL full backup (xtrabackup, daily)
   - MySQL incremental backup (binlog, real-time)
   - Redis backup (RDB + AOF)
   - Configuration version control

2. **Backup Implementation**
   - CronJob configuration
   - Backup scripts
   - Object storage upload (MinIO/S3)

3. **Recovery Procedures**
   - MySQL recovery process
   - Redis recovery process
   - Recovery verification steps

4. **Disaster Recovery**
   - Disaster level definitions
   - Same-city dual-active architecture
   - Disaster recovery switching procedures

**Deliverables**:
- Backup strategy document
- Backup scripts
- Recovery operation manual

### Phase 6: Architecture Review

1. **Review Preparation**
   - Organize review meeting
   - Distribute review materials
   - Identify reviewers

2. **Review Execution**
   - Environment planning review
   - Containerization review
   - CI/CD process review
   - High availability review
   - Backup/recovery review

3. **Issue Tracking**
   - Document review issues
   - Create remediation plan
   - Verify fixes

4. **Review Conclusion**
   - Review decision (pass/fail)
   - Sign-off

**Deliverables**:
- Deployment and HA architecture review record
- Issue tracking sheet
- Review sign-off sheet

## Key Design Checklist

### Containerization
- [ ] Multi-stage build implemented
- [ ] Lightweight base image selected
- [ ] JVM parameters configured
- [ ] Health probes configured

### Kubernetes
- [ ] Replicas set (min 3 for prod)
- [ ] Resource limits configured
- [ ] Pod anti-affinity configured
- [ ] HPA configured

### High Availability
- [ ] Multi-layer load balancing
- [ ] Keepalived VIP configured
- [ ] Circuit breaker configured
- [ ] Data replication configured

### Backup/Recovery
- [ ] Full backup scheduled
- [ ] Incremental backup configured
- [ ] Recovery procedures documented
- [ ] Disaster recovery plan created

## Common Pitfalls to Avoid

1. **Single Point Deployment**
   - ❌ Single instance in production
   - ✅ Minimum 3 replicas, cross-node deployment

2. **No Resource Limits**
   - ❌ No resources specified
   - ✅ Set requests and limits

3. **No Health Checks**
   - ❌ No probes configured
   - ✅ Configure liveness/readiness/startup

4. **No Backup Strategy**
   - ❌ No data backup configured
   - ✅ Full + incremental backup, regular verification

## Document Templates

### Deployment Architecture Template
```markdown
# Deployment Architecture Design

## 1. Overview
## 2. Environment Planning
## 3. Containerization
## 4. Kubernetes Deployment
## 5. CI/CD Pipeline
## 6. Configuration Management
## 7. Deployment Monitoring
## 8. Rollback Strategy
```

### High Availability Architecture Template
```markdown
# High Availability Architecture Design

## 1. Overview
## 2. HA Architecture Overview
## 3. Load Balancing
## 4. Failover
## 5. Data Backup and Recovery
## 6. Disaster Recovery
## 7. Monitoring and Alerting
```
