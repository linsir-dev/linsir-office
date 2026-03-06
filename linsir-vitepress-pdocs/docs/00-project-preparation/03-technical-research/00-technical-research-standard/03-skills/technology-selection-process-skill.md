---
name: "technology-selection-process"
description: "Guides the technology selection process including requirement analysis, candidate evaluation, scoring comparison, and selection documentation. Invoke when user needs to conduct technology selection, create selection reports, or compare technology options."
---

# Technology Selection Process

This skill guides users through the complete technology selection process, from requirement analysis to final selection documentation.

## When to Use

- User needs to select technology stack (frontend, backend, database, etc.)
- User needs to create technology selection reports
- User needs to compare multiple technology options
- User needs to document technology decisions

## Selection Process

### Step 1: Clarify Selection Requirements

**Input Documents:**
- Requirements research report
- Technical research instructions
- Existing system technology stack

**Tasks:**
- Analyze business requirements for technology needs
- Identify technical constraints
- Define selection scope

**Output:**
- Selection requirements specification

### Step 2: Collect Candidate Solutions

**Tasks:**
- Research mainstream technology solutions (2-3 candidates)
- Understand technical characteristics of each solution
- Collect community reviews and case studies

**Output:**
- Candidate solution list

**Common Technology Selection Areas:**

| Area | Common Candidates |
|------|-------------------|
| Frontend Framework | Vue 3 / React / Angular |
| Backend Framework | Spring Boot / Node.js / Go |
| Database | MySQL / PostgreSQL / MongoDB |
| Cache | Redis / Memcached |
| Auth Protocol | OAuth 2.0 / OIDC / SAML |
| Deployment | Docker / K8s / Traditional |

### Step 3: Define Evaluation Dimensions

**General Evaluation Dimensions:**

| Dimension | Description | Weight Suggestion |
|-----------|-------------|-------------------|
| Team Familiarity | Team's mastery of the technology | 20-25% |
| Ecosystem Maturity | Community activity, toolchain completeness | 15-20% |
| Performance | Whether it meets performance requirements | 15-20% |
| Integration with Existing Systems | Compatibility with existing systems | 15-20% |
| Development Efficiency | Development speed and maintenance cost | 10-15% |
| Long-term Maintenance | Technology prospects, talent recruitment | 10-15% |

### Step 4: Comparative Analysis

**Analysis Content:**

#### 4.1 Technical Characteristics
- Core features
- Architecture design
- Applicable scenarios

#### 4.2 Advantages
- Technical advantages
- Ecosystem advantages
- Team advantages

#### 4.3 Disadvantages
- Technical limitations
- Ecosystem gaps
- Team weaknesses

#### 4.4 Applicable Scenarios
- Best applicable scenarios
- Inapplicable scenarios

### Step 5: Comprehensive Evaluation Scoring

**Scoring Criteria (1-10 points):**

| Score | Description |
|-------|-------------|
| 9-10 | Excellent, highly recommended |
| 7-8 | Good, recommended |
| 5-6 | Average, usable |
| 3-4 | Poor, not recommended |
| 1-2 | Very poor, avoid |

**Sample Scoring Table:**

| Evaluation Dimension | Solution A | Solution B | Solution C | Weight |
|---------------------|------------|------------|------------|--------|
| Team Familiarity | 9 | 6 | 4 | 25% |
| Ecosystem Maturity | 9 | 9 | 7 | 20% |
| Performance | 8 | 9 | 9 | 15% |
| Integration with Existing | 9 | 5 | 5 | 20% |
| Development Efficiency | 9 | 7 | 6 | 10% |
| Long-term Maintenance | 9 | 9 | 7 | 10% |
| **Composite Score** | **8.9** | **7.3** | **6.1** | 100% |

### Step 6: Determine Recommended Solution

**Selection Conclusion Elements:**
1. Recommended solution name
2. Selection reasons (3-5 items)
3. Technology stack combination
4. Risks and countermeasures
5. Next steps

### Step 7: Write Selection Report

**Report Structure:**

```
1. Selection Background
2. Candidate Solutions
   2.1 Solution 1: XXX
   2.2 Solution 2: XXX
   2.3 Solution 3: XXX
3. Evaluation Comparison
4. Selection Conclusion
5. Risks and Countermeasures
6. Next Steps
```

### Step 8: Review and Confirmation

**Review Checklist:**
- [ ] Are candidate solutions sufficient (at least 2-3)?
- [ ] Are evaluation dimensions reasonable?
- [ ] Is scoring objective and fair?
- [ ] Are selection reasons sufficient?
- [ ] Is risk identification comprehensive?

**Review Roles:**
- Technical Lead
- Architect
- Project Manager

## Output Documents

### Individual Technology Selection Documents

| No. | Document Name | Naming Convention |
|-----|---------------|-------------------|
| 1 | Frontend Technology Selection | `01-frontend-selection.md` |
| 2 | Backend Technology Selection | `02-backend-selection.md` |
| 3 | Database Selection | `03-database-selection.md` |
| 4 | Auth Protocol Selection | `04-auth-protocol-selection.md` |
| 5 | Cache Solution Selection | `05-cache-selection.md` |
| 6 | Deployment Solution Selection | `06-deployment-selection.md` |

### Summary Report

| Document Name | Naming Convention |
|---------------|-------------------|
| Technology Selection Analysis Report (Summary) | `00-technology-selection-summary.md` |

## Best Practices

### Selection Principles

1. **Team First**: Prioritize technologies familiar to the team
2. **Mature and Stable**: Prioritize technologies with mature ecosystems
3. **Moderately Advanced**: Can introduce new technologies, but control risks
4. **Cost Controllable**: Consider learning costs, maintenance costs, recruitment costs

### Pitfall Avoidance

1. **Avoid Blindly Chasing New**: New technologies have high risks, need careful evaluation
2. **Avoid Over-engineering**: Don't use technology for technology's sake
3. **Avoid Single Dimension**: Can't just look at performance, need comprehensive evaluation
4. **Avoid Ignoring Team**: No matter how good the technology is, it's useless if the team can't use it

### Documentation Standards

1. **Objective and Fair**: Comparative analysis should be objective, without preconceptions
2. **Data Supported**: Evaluation scoring should have basis
3. **Sufficient Reasons**: Selection conclusions should be persuasive
4. **Risk Front-loading**: Identify risks in advance, formulate countermeasures
