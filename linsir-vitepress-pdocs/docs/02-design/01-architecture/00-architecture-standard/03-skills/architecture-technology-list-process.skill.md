# Architecture Technology List Process

**Description:** Guides the architecture technology list compilation process including frontend, backend, and infrastructure technology selection. Invoke when user needs to create technology selection lists, evaluate technology stacks, or document technology decisions.

**Version:** 1.0

---

## Overview

This skill guides the systematic compilation of architecture technology lists, ensuring reasonable technology selection, appropriate version choices, and comprehensive risk assessment, providing a unified technology stack reference for project development.

## When to Invoke

- User needs to create technology selection lists
- User wants to evaluate technology stacks
- User needs to document technology decisions
- User requires technology risk assessment
- User needs to review technology selections

## Process Steps

### Step 1: Frontend Technology List Compilation

**Objective**: Compile frontend technology list, clarify frontend technology stack

**Activities**:

1. **Framework Layer Selection**
   - Select frontend framework (Vue 3.4.x)
   - Select type system (TypeScript 5.x)
   - Document selection rationale and alternatives

2. **Build Tool Selection**
   - Select build tool (Vite 5.x)
   - Select bundler (Rollup)
   - Configure build optimization strategy

3. **UI Component Library Selection**
   - Select UI component library (Element Plus 2.5.x)
   - Select icon library (@element-plus/icons-vue)
   - Determine component encapsulation strategy

4. **State Management Selection**
   - Select state management solution (Pinia 2.x)
   - Determine state management specifications

5. **Utility Library Selection**
   - Select utility libraries (VueUse, Lodash-es, Day.js)
   - Determine utility library usage specifications

**Deliverables**:
- Frontend Technology List Document

**Acceptance Criteria**:
- [√] Covers all technology stack needed for frontend development
- [√] Version selection is reasonable, all are stable versions
- [√] Selection rationale is sufficient, with alternative comparison

---

### Step 2: Backend Technology List Compilation

**Objective**: Compile backend technology list, clarify backend technology stack

**Activities**:

1. **Base Framework Selection**
   - Select application framework (Spring Boot 3.2.x)
   - Determine Java version (Java 17)
   - Document framework selection rationale

2. **Security Framework Selection**
   - Select security framework (Spring Security 6.2.x)
   - Select authentication solution (JWT)
   - Determine security strategy

3. **Data Access Selection**
   - Select ORM framework (MyBatis Plus 3.5.x)
   - Select connection pool (Druid 1.2.x)
   - Determine data access specifications

4. **Cache Selection**
   - Select cache solution (Redis 7.x)
   - Select client (Redisson)
   - Determine cache strategy

5. **Microservice Component Selection**
   - Select service registry (Nacos 2.x)
   - Select API gateway (Spring Cloud Gateway)
   - Select service call (OpenFeign)

6. **API Documentation Selection**
   - Select API documentation tool (Knife4j 4.4.x)
   - Configure documentation generation specifications

**Deliverables**:
- Backend Technology List Document

**Acceptance Criteria**:
- [√] Covers all technology stack needed for backend development
- [√] Version selection is reasonable, all are stable versions
- [√] Selection rationale is sufficient, with alternative comparison

---

### Step 3: Infrastructure Technology List Compilation

**Objective**: Compile infrastructure technology list, clarify DevOps technology stack

**Activities**:

1. **Container Platform Selection**
   - Select container engine (Docker 24.x)
   - Select orchestration platform (Kubernetes 1.28+)
   - Determine containerization strategy

2. **Image Registry Selection**
   - Select image registry (Harbor 2.9.x)
   - Configure image management specifications

3. **CI/CD Selection**
   - Select CI/CD tool (Jenkins 2.426+)
   - Design Pipeline flow
   - Configure automated deployment

4. **Monitoring Selection**
   - Select monitoring system (Prometheus + Grafana)
   - Select Exporters (Node, MySQL, Redis, JMX)
   - Configure monitoring metrics

5. **Logging Selection**
   - Select log collection (Fluentd)
   - Select log storage (Elasticsearch)
   - Select log visualization (Kibana)

6. **Alerting Selection**
   - Select alert management (Alertmanager)
   - Configure alert channels (DingTalk Webhook)

**Deliverables**:
- Infrastructure Technology List Document

**Acceptance Criteria**:
- [√] Covers all technology stack needed for infrastructure
- [√] Version selection is reasonable, all are stable versions
- [√] Selection rationale is sufficient, with alternative comparison

---

### Step 4: Technology Risk Assessment

**Objective**: Assess technology selection risks, formulate mitigation measures

**Activities**:

1. **Risk Identification**
   - Identify technology risks (version risk, compatibility risk, learning cost, etc.)
   - Assess risk level (High, Medium, Low)

2. **Mitigation Measures Formulation**
   - Formulate mitigation measures for each risk
   - Determine risk owner
   - Develop risk monitoring plan

**Deliverables**:
- Technology Risk Assessment Table

**Acceptance Criteria**:
- [√] Risk identification is comprehensive
- [√] Mitigation measures are feasible
- [√] Risk level assessment is reasonable

---

### Step 5: Technology List Review

**Objective**: Review technology list, ensure reasonable selection

**Activities**:

1. **Review Preparation**
   - Organize review meeting
   - Prepare review materials
   - Determine review participants

2. **Review Execution**
   - Frontend technology selection review
   - Backend technology selection review
   - Infrastructure technology selection review
   - Risk assessment review

3. **Issue Recording and Resolution**
   - Record review comments
   - Develop modification plan
   - Complete document revision

**Deliverables**:
- Technology List Review Record

**Acceptance Criteria**:
- [√] Review comments are fully recorded
- [√] All issues are resolved
- [√] Document is formally approved

---

## Key Templates

### Technology List Template

```markdown
# XX Technology List

## 1. Core Technology Stack

### 1.1 XX Layer

| Technology | Version | Purpose | Selection Rationale |
|-----------|---------|---------|-------------------|
| XXX | X.X.x | XXX | XXX |

**Alternatives:**
- XXX: XXX

**Selection Conclusion:** XXX

## 2. Technology Risk Assessment

| Technology | Risk Level | Risk Description | Mitigation Measures |
|-----------|------------|-----------------|-------------------|
| XXX | Low/Medium/High | XXX | XXX |

## 3. Reference Documents

| Document | Link |
|---------|------|
| XXX | XXX |
```

---

## Output Files

| No. | File Name | File Code | Description |
|-----|-----------|-----------|-------------|
| 1 | Frontend Technology List | SYS-TECH-LIST-FRONTEND-001 | Frontend stack |
| 2 | Backend Technology List | SYS-TECH-LIST-BACKEND-002 | Backend stack |
| 3 | Infrastructure Technology List | SYS-TECH-LIST-INFRA-003 | DevOps stack |
| 4 | Technology List Review Record | SYS-TECH-LIST-REV-001 | Review results |
