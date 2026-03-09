---
name: "system-architecture-design-process"
description: "Guides the system architecture design process including logical architecture (layered design, service division), physical architecture (deployment topology, network design), and high availability design. Invoke when user needs to design system architecture, create logical/physical architecture documents, or plan service decomposition."
---

# System Architecture Design Process

## Overview

This skill guides the systematic design of system architecture, including logical architecture (layered design, service division) and physical architecture (deployment, network, infrastructure).

## When to Invoke

- User needs to design system logical architecture
- User needs to design system physical architecture
- User needs to create logical architecture design documents
- User needs to create physical architecture design documents
- User needs to plan service decomposition (avoiding microservices that are too small)
- User needs to design high availability architecture

## Process Steps

### Step 1: Logical Architecture Design

**Objective**: Design the logical layering and module division of the system

**Activities**:
1. **Layered Architecture Design**
   - Access Layer (Web, Mobile, Third-party)
   - Gateway Layer (Routing, Rate Limiting, Authentication)
   - Service Layer (Service Division, Service Responsibilities)
   - Data Layer (Data Storage, Cache, Search)

2. **Module Division**
   - Divide service boundaries based on DDD domains
   - Avoid microservices that are too small (moderate aggregation)
   - Define inter-service interaction relationships

3. **Component Design**
   - Define core components for each layer
   - Define component responsibilities and interfaces
   - Define inter-component interaction protocols

**Deliverables**:
- Logical Architecture Design Document
- Architecture Diagrams (Layered Architecture, Service Division)

**Acceptance Criteria**:
- [√] Four-layer architecture is clear with well-defined responsibilities
- [√] Service division is reasonable, avoiding excessive splitting
- [√] Component definitions are complete with clear interfaces

---

### Step 2: Service Division Design

**Objective**: Reasonably divide service boundaries to avoid microservices that are too small

**Activities**:
1. **Identify Core Domain Services**
   - Analyze domain boundaries and identify core domains
   - Evaluate service granularity (avoid being too small)
   - Consider service aggregation (merging related modules)

2. **Service Aggregation Strategy**
   - Aggregate highly cohesive modules into one service
   - Consider merging modules that frequently interact
   - Merge modules with high data consistency requirements

3. **Define Service Responsibilities**
   - Define the scope of responsibilities for each service
   - Define interfaces provided by the service
   - Define dependencies between services

**Service Division Principles**:

| Principle | Description | Example |
|-----------|-------------|---------|
| Moderate Aggregation | Avoid microservices that are too small | User + Auth + Org merged into System service |
| High Cohesion | Related functions in the same service | User management and authentication in the same service |
| Low Coupling | Reduce dependencies between services | Decoupling through message queues |
| Independent Deployment | Services can be deployed and upgraded independently | Each service has independent CI/CD |

**Deliverables**:
- Service Division Diagram
- Service Responsibility Definition Table
- Service Call Relationship Diagram

**Acceptance Criteria**:
- [√] Number of services is moderate (recommended 5-10)
- [√] Service responsibilities are clear with no overlap
- [√] Low coupling between services

---

### Step 3: Physical Architecture Design

**Objective**: Design the physical deployment architecture of the system

**Activities**:
1. **Deployment Environment Planning**
   - Dev/Test/Staging/Production environment planning
   - Environment resource configuration (minimal for dev, HA for prod)

2. **Server Planning**
   - Load balancer server planning
   - Application server planning (K8s cluster)
   - Database server planning
   - Middleware server planning

3. **Network Architecture Design**
   - Network zone division (DMZ, Internal, Data Storage)
   - Network security policies
   - Domain name planning

4. **Containerized Deployment Plan**
   - Kubernetes architecture design
   - Namespace planning
   - Service deployment configuration
   - Configuration management (ConfigMap/Secret)

**Deliverables**:
- Physical Architecture Design Document
- Deployment Topology Diagram
- Network Architecture Diagram
- K8s Deployment Configuration

**Acceptance Criteria**:
- [√] Deployment environments are complete with reasonable resource configuration
- [√] Network architecture is secure with clear zone division
- [√] Containerization plan is feasible with complete configuration

---

### Step 4: High Availability Architecture Design

**Objective**: Design the high availability solution for the system

**Activities**:
1. **Load Balancer High Availability**
   - Nginx master-backup deployment
   - Keepalived failover
   - VIP virtual IP configuration

2. **Application Service High Availability**
   - Multi-instance deployment
   - Health check mechanisms
   - Auto scaling (HPA)

3. **Database High Availability**
   - MySQL master-slave replication
   - Redis cluster mode
   - Automatic failover

4. **Storage High Availability**
   - Data backup strategies
   - Data redundancy solutions
   - Disaster recovery solutions

**Deliverables**:
- High Availability Architecture Design Document
- Failover Solution
- Data Backup Solution

**Acceptance Criteria**:
- [√] Each layer has a high availability solution
- [√] Failover time is acceptable
- [√] Data backup strategy is complete

---

### Step 5: Capacity Planning

**Objective**: Plan system capacity to support business growth

**Activities**:
1. **Initial Capacity Planning** (1-1000 users)
   - Minimum resource configuration
   - Support basic business

2. **Medium-term Capacity Planning** (1000-5000 users)
   - Horizontal scaling solution
   - Database upgrade solution

3. **Long-term Capacity Planning** (5000+ users)
   - Large-scale cluster solution
   - Database sharding
   - Distributed storage solution

**Deliverables**:
- Capacity Planning Document
- Scaling Solution

**Acceptance Criteria**:
- [√] Capacity planning covers business growth
- [√] Scaling solution is feasible

---

### Step 6: Review and Confirmation

**Objective**: Review system architecture design results

**Activities**:
1. **Internal Review**
   - Architecture team review
   - Technical team review
   - Operations team review

2. **Formal Review**
   - Architecture committee review
   - Domain expert review

3. **Issue Resolution**
   - Collect review comments
   - Develop modification plan
   - Complete document revision

**Deliverables**:
- System Architecture Review Record
- Revised Architecture Documents

**Acceptance Criteria**:
- [√] Review comments are fully recorded
- [√] All issues are resolved
- [√] Documents are formally approved

---

## Key Templates

### Four-Layer Architecture

```
┌─────────────────────────────────────────┐
│              Access Layer               │
│         Web / Mobile / 3rd Party        │
├─────────────────────────────────────────┤
│              Gateway Layer              │
│      Routing / Rate Limit / Auth        │
├─────────────────────────────────────────┤
│              Service Layer              │
│    System / Config / Other Services     │
├─────────────────────────────────────────┤
│              Data Layer                 │
│   MySQL / Redis / ES / MinIO / Kafka    │
└─────────────────────────────────────────┘
```

### Service Aggregation Example

**Before Aggregation (too many services)**:
- User Center Service
- Authentication Service
- Organization Service
- Permission Service

**After Aggregation (moderate aggregation)**:
- **System Service** (User + Auth + Org + Permission)
- Config Service
- Audit Service

**Aggregation Principles**:
- High business relevance
- High data consistency requirements
- Frequent interaction

### K8s Deployment Template

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: system-service
  namespace: system-platform
spec:
  replicas: 2
  selector:
    matchLabels:
      app: system-service
  template:
    metadata:
      labels:
        app: system-service
    spec:
      containers:
      - name: system-service
        image: registry.linsir.com/system/system-service:1.0.0
        ports:
        - containerPort: 8081
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
```

---

## Output Files

- `01-logical-architecture.md` - Logical architecture design
- `02-physical-architecture.md` - Physical architecture design
- `03-system-architecture-review-record.md` - Review record
