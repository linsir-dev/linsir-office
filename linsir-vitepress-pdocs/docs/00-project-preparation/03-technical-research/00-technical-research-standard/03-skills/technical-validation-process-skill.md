---
name: "technical-validation-process"
description: "Guides the technical validation (POC) process to verify the feasibility of key technologies, including POC planning, environment setup, execution, data collection, and report writing. Invoke when user needs to conduct POC validation, create POC reports, or verify technical feasibility."
---

# Technical Validation (POC) Process

This skill guides users through the complete POC (Proof of Concept) validation process, from risk identification to final decision making.

## When to Use

Invoke this skill when:
- User needs to conduct POC validation for a project
- User asks to create POC plans or reports
- User needs to verify technical feasibility
- User wants to validate key technologies before implementation
- User asks about POC best practices

## Process Overview

The POC validation process consists of 8 steps:

```
1. Identify Key Risks
2. Create POC Plan
3. Setup Validation Environment
4. Execute POC Validation
5. Collect Validation Data
6. Analyze Validation Results
7. Write POC Report
8. Review and Decision
```

## Detailed Steps

### Step 1: Identify Key Risks

**Goal:** Identify high-risk technical points from technology selection

**Risk Dimensions:**
| Dimension | Description | Example |
|-----------|-------------|---------|
| Technology Maturity | New or unproven technologies | Latest framework version |
| Integration Complexity | Difficulty integrating with existing systems | Legacy system integration |
| Performance Requirements | High performance, high concurrency | Supporting 100k concurrent users |
| Security Requirements | High security level requirements | Financial-grade security |
| Team Capability | Technologies unfamiliar to the team | Technology team hasn't used |

**Output:**
- Key risk list
- POC priority ranking

---

### Step 2: Create POC Plan

**Goal:** Define POC scope, objectives, and resources

**Plan Contents:**

| Item | Description | Example |
|------|-------------|---------|
| POC Objective | What to validate | Validate OAuth2.0 SSO feasibility |
| Success Criteria | What counts as success | Login response < 500ms, support 100 concurrent |
| Validation Scope | What functions to validate | Login, logout, token refresh |
| Out of Scope | What NOT to do | No UI validation, not all scenarios |
| Timeline | Planned duration | 3 working days |
| Resources | Personnel, environment | 1 architect, 1 test server |
| Risk Assessment | Possible failure scenarios | Integration protocol incompatibility |

**POC Plan Template:**
```markdown
# POC Validation Plan

## Basic Information
- POC Name: SSO Single Sign-On Validation
- Owner: Architect
- Timeline: 2026-03-10 to 2026-03-12

## Validation Objective
Validate the technical feasibility of OAuth2.0-based SSO solution

## Success Criteria
1. Users can login through unified authentication center
2. After login, can access multiple subsystems without re-authentication
3. Login response time < 500ms
4. Support 100 concurrent users

## Validation Scope
- ✅ User login flow
- ✅ Token generation and validation
- ✅ Single Sign-On (multi-system)
- ✅ Single Logout
- ❌ UI interface (use Postman for testing)
- ❌ All exception scenarios (only main scenarios)

## Resource Requirements
- Personnel: 1 architect
- Environment: 1 server (4C8G)
- Tools: IDEA, Postman, JMeter

## Risks and Mitigation
| Risk | Mitigation |
|------|------------|
| Difficulty integrating with existing identity source | Prepare mock data |
```

---

### Step 3: Setup Validation Environment

**Goal:** Prepare hardware, software, and data environment for POC

**Environment Checklist:**

| Category | Item | Description |
|----------|------|-------------|
| Hardware | Server | Configure according to POC requirements |
| Software | Basic Software | JDK, database, middleware, etc. |
| Software | POC Code | Write minimal validation code |
| Data | Test Data | Prepare sufficient test data |
| Tools | Testing Tools | JMeter, Postman, etc. |
| Tools | Monitoring Tools | Performance monitoring, log analysis |

**Environment Isolation Principles:**
- POC environment independent from dev/test/prod environments
- Avoid POC affecting other environments
- POC data can be reset at will

---

### Step 4: Execute POC Validation

**Goal:** Execute validation according to plan

**Execution Principles:**
1. **Follow the plan**: Execute strictly according to POC plan, don't expand scope arbitrarily
2. **Detailed recording**: Record each step's operation and result
3. **Issue tracking**: Record issues immediately, don't solve immediately (unless blocking)
4. **Data collection**: Collect performance data, error logs, etc.

**Execution Process Record:**
```markdown
## POC Execution Record

### 2026-03-10
#### Morning
- [x] Setup Spring Authorization Server
- [x] Configure OAuth2.0 client
- [x] Implement login interface

#### Afternoon
- [x] Test authorization code mode
- [x] Test token generation
- [x] Issue found: Token expiration time config not working
  - Cause: Wrong configuration item name
  - Solution: Correct configuration item name

### 2026-03-11
#### Morning
- [x] Setup business system
- [x] Integrate Spring Security OAuth2
...
```

---

### Step 5: Collect Validation Data

**Goal:** Collect all data during POC process

**Data Types:**

| Data Type | Content | Purpose |
|-----------|---------|---------|
| Performance Data | Response time, TPS, resource usage | Evaluate if performance meets standards |
| Function Data | Function test results | Verify function completeness |
| Issue Records | Discovered issues, solutions | Evaluate technical risks |
| Configuration Data | Key configuration items | Provide reference for implementation |
| Code Examples | Key code snippets | Provide reference for development |

**Data Collection Template:**
```markdown
## POC Data Collection

### Performance Data
| Scenario | Concurrent | Avg Response | P95 | TPS |
|----------|-----------|-------------|-----|-----|
| User Login | 50 | 180ms | 280ms | 278 |
| User Login | 100 | 220ms | 350ms | 455 |

### Issue Records
| Issue | Severity | Solution | Impact |
|-------|----------|----------|--------|
| Token expiration config not working | Low | Correct config item | None |

### Key Configuration
```yaml
spring:
  security:
    oauth2:
      authorizationserver:
        client:
          registration:
            client-id: system-platform
            client-secret: secret
```
```

---

### Step 6: Analyze Validation Results

**Goal:** Compare with expected objectives, draw POC conclusions

**Analysis Dimensions:**

| Dimension | Analysis Content | Conclusion |
|-----------|-----------------|------------|
| Function Validation | Whether function is implemented | Pass/Fail |
| Performance Validation | Whether performance meets standards | Pass/Fail |
| Issue Statistics | Issue count, severity | Acceptable/Needs Improvement |
| Implementation Difficulty | Implementation complexity assessment | Simple/Medium/Complex |
| Risk Assessment | Technical risk level | Low/Medium/High |

**Conclusion Determination:**

| Conclusion | Criteria | Follow-up Action |
|------------|----------|-----------------|
| **Pass** | Meet all success criteria, no major risks | Adopt the technology solution |
| **Conditional Pass** | Basically meet, with minor issues | Adopt, but need to solve issues |
| **Fail** | Don't meet key success criteria | Don't adopt, find alternative |

---

### Step 7: Write POC Report

**Goal:** Form formal POC validation report

**Report Structure:**
```markdown
# XXX POC Validation Report

## 1. POC Objective
## 2. Validation Environment
## 3. Validation Content
## 4. Validation Results
## 5. Issues and Solutions
## 6. Validation Conclusion
## 7. Next Actions
```

**Report Requirements:**
- Objective recording, no exaggeration of results
- Don't avoid issues, record truthfully
- Provide reproducible test steps
- Give clear technical recommendations

---

### Step 8: Review and Decision

**Goal:** Through technical review, decide whether to adopt the technology solution

**Review Content:**
- [ ] Whether POC objectives are achieved
- [ ] Whether validation data is sufficient
- [ ] Whether discovered issues have solutions
- [ ] Whether technical risks are acceptable
- [ ] Whether implementation costs are reasonable

**Decision Options:**
1. **Adopt**: Technology solution is feasible, enter design phase
2. **Adopt after Optimization**: Basically feasible, need optimization before adoption
3. **Don't Adopt**: Technology solution is not feasible, need re-selection

---

## POC Types

### Common POC Types

| POC Type | Validation Focus | Typical Scenario |
|----------|-----------------|------------------|
| **Function POC** | Function feasibility | New features, new capability validation |
| **Performance POC** | Performance metrics | High concurrency, large data volume |
| **Integration POC** | Integration feasibility | Integration with third-party systems |
| **Security POC** | Security mechanisms | Authentication, encryption, protection |
| **Compatibility POC** | Compatibility | Browser, device compatibility |

### POC Type Selection Guide

```
When the following situations exist in technology selection, POC is recommended:

New Technology/Framework ──→ Function POC ──→ Verify if core functions work
              
High Concurrency Requirements ──→ Performance POC ──→ Verify if performance meets standards
              
Third-party Integration ──→ Integration POC ──→ Verify integration feasibility
              
High Security Requirements ──→ Security POC ──→ Verify security mechanism effectiveness
```

---

## Best Practices

### POC Success Factors

1. **Clear Objectives**: POC objectives should be specific and measurable
2. **Controllable Scope**: Control POC scope, avoid scope creep
3. **Independent Environment**: POC environment independent from other environments
4. **Sufficient Data**: Collect enough data to support conclusions
5. **Objective Recording**: Record truthfully, not selectively

### Common Pitfalls

| Pitfall | Description | Avoidance Method |
|---------|-------------|------------------|
| Scope Creep | POC keeps growing | Strictly follow POC plan |
| Over-optimization | Over-optimize during POC phase | POC code not for production |
| Insufficient Data | Lack sufficient data to support conclusions | Plan data collection in advance |
| Subjective Judgment | Make conclusions based on feeling | Let data speak |
| Ignore Issues | Turn a blind eye to discovered issues | Record all issues truthfully |

### Difference Between POC and Production Code

| Aspect | POC Code | Production Code |
|--------|----------|-----------------|
| Objective | Verify feasibility | Stable operation |
| Quality | Runnable is enough | High quality, maintainable |
| Exception Handling | Main scenarios | Full scenario coverage |
| Performance Optimization | Basically usable | Deep optimization |
| Security | Basic security | Comprehensive security |
| Maintainability | Not required | High requirement |

**Important Principle: POC code is NOT directly used in production!**

---

## Checklist

### Pre-POC Checklist

- [ ] Key technical risks identified
- [ ] POC plan created and reviewed
- [ ] Validation environment ready
- [ ] Test data prepared sufficiently
- [ ] Relevant personnel roles clarified

### During POC Checklist

- [ ] Execute according to plan, don't expand scope arbitrarily
- [ ] Record execution process in detail
- [ ] Record discovered issues promptly
- [ ] Collect sufficient validation data
- [ ] Maintain communication with stakeholders

### Post-POC Checklist

- [ ] POC report completed
- [ ] Validation data organized
- [ ] Conclusion clear (pass/fail)
- [ ] Issues have solutions
- [ ] Technical review completed

---

## Output Checklist

- [ ] POC validation plan
- [ ] POC execution records
- [ ] Validation data collection
- [ ] POC validation report
- [ ] Technical review conclusion
