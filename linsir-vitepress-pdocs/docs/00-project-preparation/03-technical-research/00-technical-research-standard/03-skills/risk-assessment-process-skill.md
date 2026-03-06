---
name: "risk-assessment-process"
description: "Guides the technical risk assessment process to identify, analyze, and mitigate technical risks. Invoke when user needs to conduct risk assessment, create risk assessment reports, or evaluate technical feasibility."
---

# Technical Risk Assessment Process

This skill guides users through the complete technical risk assessment process, from risk identification to mitigation strategy development.

## When to Use

Invoke this skill when:
- User needs to conduct technical risk assessment for a project
- User asks to create risk assessment reports
- User needs to evaluate technical feasibility
- User wants to identify and mitigate technical risks
- User asks about risk assessment methodologies

## Process Overview

The risk assessment process consists of 7 steps:

```
1. Define Assessment Scope
2. Identify Risk Points
3. Analyze Risks
4. Evaluate Risk Levels
5. Develop Mitigation Strategies
6. Write Assessment Report
7. Review and Confirm
```

## Detailed Steps

### Step 1: Define Assessment Scope

**Goal:** Clarify the technical domains and boundaries for risk assessment

**Assessment Dimensions:**

| Dimension | Description | Assessment Focus |
|-----------|-------------|------------------|
| Technology Maturity | Stability and maturity of selected technologies | Version, community, documentation, cases |
| Team Capability | Team's grasp of technologies | Skill gaps, training needs |
| Third-party Dependencies | Reliability of external dependencies | Open source frameworks, third-party services, cloud services |
| Performance Risks | Potential performance bottlenecks | Architecture design, resource constraints |
| Security Risks | Security vulnerabilities and threats | Authentication, encryption, protection |

**Output:**
- Risk assessment scope description
- Assessment dimension checklist

---

### Step 2: Identify Risk Points

**Goal:** Systematically identify risks across all dimensions

**Identification Methods:**

| Method | Description | Applicable Scenario |
|--------|-------------|---------------------|
| Expert Judgment | Identify risks based on expert experience | Common technical risks |
| Historical Analysis | Analyze historical project issues | With similar project experience |
| Benchmarking | Compare with industry best practices | Industry common risks |
| POC Validation | Discover problems through POC | New technologies, new solutions |

**Risk Identification Checklist Template:**
```markdown
## Risk Identification Checklist

### Technology Maturity Risks
- [ ] Is technology version stable (GA/RC/Beta)?
- [ ] Is community active (GitHub stars, update frequency)?
- [ ] Is documentation adequate (official docs, community resources)?
- [ ] Are there enterprise application cases?
- [ ] Is there long-term maintenance commitment?

### Team Capability Risks
- [ ] Is team familiar with core technologies?
- [ ] Is new technology training needed?
- [ ] Are there backup personnel for key skills?
- [ ] Is external support available?

### Third-party Dependency Risks
- [ ] Are open source licenses friendly?
- [ ] Are there dependency version conflicts?
- [ ] Are third-party services stable?
- [ ] Are there alternative solutions?

### Performance Risks
- [ ] Does architecture design support performance requirements?
- [ ] Are there database design bottlenecks?
- [ ] Is caching strategy reasonable?
- [ ] Are resources adequate?

### Security Risks
- [ ] Is authentication and authorization adequate?
- [ ] Is data transmission encrypted?
- [ ] Are there security vulnerabilities?
- [ ] Does it meet security compliance requirements?
```

---

### Step 3: Analyze Risks

**Goal:** Evaluate the probability and impact of each risk

**Risk Analysis Matrix:**

| Probability\Impact | Low(1) | Medium(2) | High(3) |
|-------------------|--------|-----------|---------|
| **High(3)** | Medium(3) | High(6) | Critical(9) |
| **Medium(2)** | Low(2) | Medium(4) | High(6) |
| **Low(1)** | Low(1) | Low(2) | Medium(3) |

**Risk Score = Probability × Impact**

**Risk Level Classification:**

| Risk Level | Score Range | Indicator | Response Required |
|------------|-------------|-----------|-------------------|
| Critical | 7-9 | 🔴 | Must eliminate or transfer |
| High | 5-6 | 🟠 | Must develop countermeasures |
| Medium | 3-4 | 🟡 | Recommended to develop countermeasures |
| Low | 1-2 | 🟢 | Accept and monitor |

**Risk Analysis Example:**
```markdown
## Risk Analysis

| Risk Description | Probability | Impact | Score | Level |
|-----------------|-------------|--------|-------|-------|
| OAuth 2.0 implementation complex, team lacks experience | High(3) | High(3) | 9 | 🔴 Critical |
| Spring Authorization Server documentation limited | Medium(2) | Medium(2) | 4 | 🟡 Medium |
| Vue 3 needs time to adapt | Medium(2) | Low(1) | 2 | 🟢 Low |
```

---

### Step 4: Evaluate Risk Levels

**Goal:** Determine risk priorities and focus on key risks

**Priority Sorting:**

1. **Sort by risk level**: Critical > High > Medium > Low
2. **Within same level, sort by impact**: Higher impact first
3. **Consider risk correlation**: Consider correlated risks together

**Risk Priority Matrix:**

| Priority | Risk Level | Processing Order | Resource Allocation |
|----------|------------|------------------|---------------------|
| P0 | 🔴 Critical | Process immediately | Highest priority |
| P1 | 🟠 High | Process within this week | High priority |
| P2 | 🟡 Medium | Process within this month | Medium priority |
| P3 | 🟢 Low | Continuous monitoring | Routine handling |

---

### Step 5: Develop Mitigation Strategies

**Goal:** Develop specific countermeasures for each risk

**Strategy Types:**

| Strategy | Description | Applicable Scenario |
|----------|-------------|---------------------|
| **Avoid** | Change plans to eliminate risk | Critical risks, avoidable |
| **Transfer** | Transfer risk to third party | Transferable via outsourcing/insurance |
| **Mitigate** | Reduce risk probability or impact | Most risks |
| **Accept** | Accept risk, prepare contingency | Low risks or unavoidable |

**Mitigation Measures Template:**
```markdown
## Risk Mitigation Measures

### Risk 1: OAuth 2.0 implementation complex, team lacks experience
- **Risk Level**: 🔴 Critical
- **Strategy**: Mitigate
- **Specific Measures**:
  1. Organize OAuth 2.0 protocol training (2 days)
  2. Assign architect for full guidance
  3. Knowledge transfer based on POC code
  4. Introduce external experts (backup plan)
- **Owner**: Architect
- **Completion Time**: Before project kickoff
- **Acceptance Criteria**: Team can independently complete OAuth 2.0 configuration

### Risk 2: Spring Authorization Server documentation limited
- **Risk Level**: 🟡 Medium
- **Strategy**: Accept + Mitigate
- **Specific Measures**:
  1. Subscribe to official update notifications
  2. Establish internal knowledge base
  3. Accumulate usage experience
- **Owner**: Architect
- **Completion Time**: Ongoing
```

---

### Step 6: Write Assessment Report

**Goal:** Form formal risk assessment report

**Report Structure:**
```markdown
# Technical Risk Assessment Report

## 1. Assessment Overview
- Assessment objectives
- Assessment scope
- Assessment methodology

## 2. Risk Inventory
- Risk summary table
- Risk distribution chart

## 3. Detailed Risk Analysis
- Detailed analysis of each risk
- Risk levels and priorities

## 4. Mitigation Strategies
- Risk mitigation measures
- Owners and timelines

## 5. Monitoring Plan
- Risk monitoring mechanism
- Risk escalation process

## 6. Conclusions and Recommendations
- Overall risk level
- Key recommendations
```

**Report Requirements:**
- Objective and truthful, no risk concealment
- Data-supported, evidence-based
- Specific measures, actionable
- Clear recommendations, targeted

---

### Step 7: Review and Confirm

**Goal:** Confirm risk assessment results through technical review

**Review Content:**
- [ ] Is risk identification comprehensive?
- [ ] Is risk analysis objective?
- [ ] Are risk levels reasonable?
- [ ] Are mitigation measures feasible?
- [ ] Are owners clearly assigned?

**Review Conclusions:**
1. **Pass**: Risk assessment passed, proceed to next phase
2. **Conditional Pass**: Pass after supplementation or modification
3. **Fail**: Need to re-assess

---

## Risk Assessment Dimensions

### Technology Maturity Risk Assessment

**Assessment Content:**

| Assessment Item | Assessment Criteria | Risk Points |
|-----------------|---------------------|-------------|
| Version Stability | GA > RC > Beta > Alpha | Using non-stable versions |
| Community Activity | Update frequency, Issue response | Inactive community |
| Documentation Completeness | Official docs, examples | Lack of documentation |
| Enterprise Cases | Production environment applications | No enterprise applications |
| Maintenance Commitment | Official support cycle | Maintenance ending soon |

### Team Capability Risk Assessment

**Assessment Content:**

| Assessment Item | Assessment Criteria | Risk Points |
|-----------------|---------------------|-------------|
| Technology Familiarity | Team's grasp of technologies | Unfamiliar with new technologies |
| Skill Gap | Current vs Required | Large gap |
| Training Feasibility | Training time and resources | Unable to train in time |
| Personnel Backup | Key skill backup | Single point of dependency |

### Third-party Dependency Risk Assessment

**Assessment Content:**

| Assessment Item | Assessment Criteria | Risk Points |
|-----------------|---------------------|-------------|
| License | Apache/MIT > GPL | Unfriendly license |
| Version Conflict | Dependency tree analysis | Version conflicts |
| Security Vulnerability | CVE scanning | Known vulnerabilities |
| Service Stability | SLA, historical records | Unstable service |
| Vendor Lock-in | Alternative solutions | Difficult to replace |

---

## Risk Monitoring and Governance

### Risk Monitoring Mechanism

| Monitoring Item | Monitoring Method | Frequency | Owner |
|-----------------|-------------------|-----------|-------|
| Technology Version Updates | Subscribe to official releases | Real-time | Architect |
| Security Vulnerability Alerts | Subscribe to security emails | Real-time | DevOps |
| Code Quality | SonarQube scanning | Every build | Development Team |
| Development Progress | Task completion rate | Weekly | Project Manager |
| Team Skills | Training completion rate | Monthly | Architect |

### Risk Escalation Mechanism

| Risk Level | Trigger Condition | Escalation Path |
|------------|-------------------|-----------------|
| 🟢 Low | Normal deviation | Handle within team |
| 🟡 Medium | Schedule delay 1 week | Report to technical lead |
| 🟠 High | Schedule delay 2 weeks or quality issues | Report to project manager |
| 🔴 Critical | Technology not feasible | Report to project committee |

### Risk Re-assessment

**Trigger Conditions:**
- Technology selection changes
- Team personnel changes
- New risks discovered
- Risk mitigation measures fail

**Re-assessment Process:**
1. Re-identify risks
2. Update risk analysis
3. Adjust mitigation strategies
4. Update assessment report

---

## Best Practices

### Risk Identification Tips

1. **Brainstorming**: Organize team brainstorming for risks
2. **Checklist**: Use standard checklists for systematic identification
3. **Benchmarking**: Reference similar project risk cases
4. **Expert Consultation**: Consult with experienced experts

### Risk Analysis Tips

1. **Data Support**: Analysis based on data and facts
2. **Multi-party Verification**: Verify risks from different angles
3. **Dynamic Assessment**: Regularly update risk assessment
4. **Correlation Analysis**: Analyze relationships between risks

### Risk Mitigation Tips

1. **Prevention First**: Prioritize preventive measures
2. **Multiple Safeguards**: Multiple countermeasures for critical risks
3. **Contingency Plans**: Develop emergency plans
4. **Continuous Improvement**: Summarize experience, continuously improve

---

## Output Checklist

- [ ] Risk assessment scope defined
- [ ] Risk identification checklist completed
- [ ] Risk analysis matrix completed
- [ ] Risk levels and priorities determined
- [ ] Mitigation measures developed for each risk
- [ ] Risk assessment report completed
- [ ] Risk monitoring mechanism established
- [ ] Technical review passed

---

## Related Documents

| Document | Description |
|----------|-------------|
| Technology Maturity Risk Assessment Template | Template for assessing technology maturity |
| Team Capability Risk Assessment Template | Template for assessing team capabilities |
| Third-party Dependency Risk Assessment Template | Template for assessing third-party dependencies |
| Risk Assessment Report Template | Template for writing risk assessment reports |
| Technology Selection Process | Input source for risk identification |
| POC Validation Process | Method for risk validation |
