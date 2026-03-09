---
name: "architecture-constraints-process"
description: "Guides the architecture constraints analysis process including technical constraints identification, security compliance analysis, constraint impact assessment, and mitigation strategy development. Invoke when user needs to analyze project constraints, create technical/security constraint documents, or develop compliance strategies."
---

# Architecture Constraints Analysis Process

## Overview

This skill guides the systematic analysis of architecture constraints, including technical constraints and security/compliance requirements.

## When to Invoke

- User needs to identify project technical constraints
- User needs to analyze security compliance requirements
- User needs to create technical constraint analysis documents
- User needs to create security compliance analysis documents
- User needs to assess constraint impact on architecture
- User needs to develop constraint mitigation strategies

## Process Steps

### Step 1: Technical Constraints Identification

**Objective**: Identify all technical constraints the project faces

**Activities**:
1. **Technology Stack Constraints**
   - Frontend framework constraints (Vue 3.x requirements)
   - Backend framework constraints (Spring Boot 3.2)
   - Database constraints (MySQL 8.0)
   - Middleware constraints (Redis, Elasticsearch versions)
   - Programming language constraints (TypeScript, Java 17)

2. **Infrastructure Constraints**
   - Deployment environment constraints (Docker + K8s)
   - Cloud provider constraints
   - Network architecture constraints
   - Storage constraints

3. **Integration Constraints**
   - Existing system integration requirements (HR/ERP/OA)
   - Third-party service integration
   - API compatibility constraints
   - Data format constraints

4. **Performance Constraints**
   - Concurrent user constraints
   - Response time constraints
   - Throughput constraints
   - Resource usage constraints

5. **Compatibility Constraints**
   - Browser compatibility
   - Mobile compatibility
   - Operating system compatibility

**Deliverables**:
- Technical constraints list
- Technical constraints analysis document

**Acceptance Criteria**:
- [√] Technology stack constraints fully covered
- [√] Infrastructure constraints clearly defined
- [√] Performance constraints quantifiable
- [√] Compatibility constraints documented

---

### Step 2: Security Compliance Analysis

**Objective**: Analyze security and compliance requirements the project must meet

**Activities**:
1. **Network Security Compliance**
   - Map to MLPS 2.0 Level 3 requirements
   - Secure communication network requirements
   - Secure zone boundary requirements
   - Secure computing environment requirements

2. **Data Security Compliance**
   - Data classification and grading
   - Data encryption at rest
   - Data transmission encryption
   - Data backup and recovery
   - Data masking requirements

3. **Identity Authentication & Access Control**
   - Identity authentication requirements
   - Access control policies
   - Permission management requirements
   - Multi-factor authentication

4. **Security Audit Compliance**
   - Log retention requirements (≥6 months)
   - Audit trail requirements
   - Log protection requirements
   - Audit analysis requirements

5. **Privacy Protection Compliance**
   - Personal information protection
   - Consent management
   - Data subject rights
   - Cross-border data transfer

**Deliverables**:
- Security compliance requirements list
- Security compliance analysis document

**Acceptance Criteria**:
- [√] MLPS requirements fully covered
- [√] Data security compliance clearly defined
- [√] Audit compliance requirements documented
- [√] Privacy protection compliance satisfied

---

### Step 3: Constraint Impact Assessment

**Objective**: Assess the impact of constraints on architecture design

**Activities**:
1. **Constraint Priority Ranking**
   - Mandatory (must comply)
   - Should comply (recommended)
   - Could comply (optional)

2. **Constraint Conflict Analysis**
   - Identify conflicts between constraints
   - Develop conflict resolution strategies

3. **Architecture Impact Analysis**
   - Impact on technology selection
   - Impact on architecture style
   - Impact on deployment architecture
   - Impact on security architecture

**Deliverables**:
- Constraint impact assessment report
- Architecture decision recommendations

**Acceptance Criteria**:
- [√] Constraint priorities clearly defined
- [√] Conflict resolution strategies established
- [√] Architecture impact clearly understood

---

### Step 4: Mitigation Strategy Development

**Objective**: Develop strategies to address constraints

**Activities**:
1. **Technical Constraint Mitigation**
   - Technology selection adaptation
   - Architecture pattern selection
   - Compatibility handling solutions

2. **Security Compliance Mitigation**
   - Security architecture design
   - Compliance implementation plan
   - Certification audit plan

3. **Risk Mitigation Measures**
   - Technical risk mitigation
   - Compliance risk mitigation
   - Emergency response plans

**Deliverables**:
- Constraint mitigation strategy document
- Risk mitigation plan

**Acceptance Criteria**:
- [√] Mitigation strategies feasible
- [√] Risk mitigation measures complete

---

### Step 5: Review and Confirmation

**Objective**: Review architecture constraints analysis results

**Activities**:
1. **Internal Review**
   - Architecture team review
   - Technical team review
   - Security team review

2. **Formal Review**
   - Architecture committee review
   - Security expert review
   - Compliance expert review

3. **Issue Resolution**
   - Collect review comments
   - Develop modification plan
   - Complete document revision

**Deliverables**:
- Architecture constraints review record
- Revised analysis documents

**Acceptance Criteria**:
- [√] Review comments fully recorded
- [√] All issues resolved
- [√] Documents formally approved

---

## Key Templates

### Technical Constraints Analysis Template

```markdown
## Technical Constraints Analysis

### 1. Technology Stack Constraints

| Constraint Item | Constraint Content | Source | Impact | Mitigation Strategy |
|----------------|-------------------|--------|--------|-------------------|
| | | | | |

### 2. Infrastructure Constraints

| Constraint Item | Constraint Content | Source | Impact | Mitigation Strategy |
|----------------|-------------------|--------|--------|-------------------|
| | | | | |

### 3. Performance Constraints

| Constraint Item | Constraint Value | Measurement Method | Verification Method |
|----------------|-----------------|-------------------|-------------------|
| | | | |
```

### Security Compliance Analysis Template

```markdown
## Security Compliance Analysis

### 1. MLPS Requirements Mapping

| Control Point | Compliance Requirement | Implementation Method | Verification Method |
|--------------|----------------------|---------------------|-------------------|
| | | | |

### 2. Data Security Compliance

| Data Level | Protection Measures | Implementation Method | Verification Method |
|-----------|-------------------|---------------------|-------------------|
| | | | |
```

---

## Best Practices

1. **Comprehensiveness**: Identify constraints from technical, security, compliance, and business dimensions
2. **Traceability**: Every constraint must have a clear source reference
3. **Quantifiability**: Performance constraints must have specific numeric indicators
4. **Verifiability**: Constraints must have clear verification methods

---

## Output Files

- `01-technical-constraints.md` - Technical constraints analysis
- `02-security-compliance.md` - Security compliance analysis
- `03-architecture-constraints-review-record.md` - Review record
