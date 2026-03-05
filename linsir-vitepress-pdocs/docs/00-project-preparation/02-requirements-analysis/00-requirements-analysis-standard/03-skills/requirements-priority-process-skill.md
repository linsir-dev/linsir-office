---
name: "requirements-priority-process"
description: "Guides the requirements prioritization process using MoSCoW classification, value assessment, cost evaluation, and iteration planning. Invoke when user needs to prioritize requirements, create priority matrices, or plan development iterations."
---

# Requirements Priority Process Skill

## Overview

This skill guides you through a systematic requirements prioritization process to determine the order of implementation based on business value, technical feasibility, and resource constraints.

## When to Use

- Prioritizing requirements after refinement
- Creating MoSCoW classifications
- Assessing business value vs implementation cost
- Planning development iterations and sprints
- Creating priority matrices for project planning

## Prioritization Process

### Step 1: MoSCoW Classification

**Objective:** Categorize requirements into Must, Should, Could, Won't have.

**Actions:**
1. Review all refined requirements
2. Classify each requirement:
   - **Must Have:** Critical for system operation (40-50%)
   - **Should Have:** Important but not critical (25-30%)
   - **Could Have:** Nice to have (15-20%)
   - **Won't Have:** Deferred to future versions (remaining)
3. Document classification rationale
4. Validate with stakeholders

**Output:** `01-moscow-classification.md`

**Classification Criteria:**
- Must: System cannot function without it
- Should: Significantly impacts user experience
- Could: Enhances functionality but not essential
- Won't: Not needed in current version

---

### Step 2: Value Assessment

**Objective:** Evaluate the business and user value of each requirement.

**Actions:**
1. Define evaluation dimensions:
   - Business Value (40%): Contribution to business goals
   - User Value (30%): Impact on user experience
   - Strategic Value (20%): Alignment with company strategy
   - Compliance Value (10%): Regulatory requirements
2. Score each requirement (1-5 scale)
3. Calculate weighted scores
4. Rank requirements by value

**Output:** `02-value-assessment.md`

**Scoring Scale:**
- 5: Critical/Must have
- 4: Very important
- 3: Important
- 2: Nice to have
- 1: Minimal impact

---

### Step 3: Cost Assessment

**Objective:** Estimate the implementation effort and complexity.

**Actions:**
1. Evaluate cost dimensions:
   - Development Effort (50%): Person-days required
   - Technical Complexity (30%): Technical difficulty and risk
   - Dependencies (20%): Prerequisites and blockers
2. Score each requirement (1-5 scale)
3. Calculate weighted scores
4. Estimate person-days for each requirement

**Output:** `03-cost-assessment.md`

**Cost Levels:**
- 5: >20 days, very complex, many dependencies
- 4: 11-20 days, complex, several dependencies
- 3: 6-10 days, moderate, some dependencies
- 2: 3-5 days, simple, few dependencies
- 1: 1-2 days, very simple, independent

---

### Step 4: Iteration Planning

**Objective:** Plan development iterations based on priority and dependencies.

**Actions:**
1. Define iteration strategy:
   - Sprint duration (typically 1-2 weeks)
   - Team capacity
   - Dependency sequencing
2. Assign requirements to sprints
3. Balance workload across iterations
4. Identify risks and mitigation strategies
5. Define iteration milestones

**Output:** `04-iteration-plan.md`

**Iteration Structure:**
```
Sprint 0: Preparation (environment, architecture)
Sprint 1-N: Core functionality (Must have)
Sprint N+1: Important features (Should have)
Sprint Final: Testing, optimization, documentation
```

---

### Step 5: Priority Matrix

**Objective:** Create comprehensive priority matrix combining all assessments.

**Actions:**
1. Combine MoSCoW, value, and cost assessments
2. Calculate composite priority scores
3. Define priority levels:
   - **P0 (Critical):** Must have, high value, implement first
   - **P1 (High):** Should have or high value Must have
   - **P2 (Medium):** Could have or lower priority Should have
   - **P3 (Low):** Won't have or low value features
4. Create value-cost quadrant analysis
5. Document final priority rankings

**Output:** `05-requirements-priority-matrix.md`

**Priority Calculation:**
```
Composite Score = (MoSCoW × 40%) + (Value × 30%) + (Cost Inverse × 20%) + (Iteration × 10%)
```

---

## Document Naming Convention

| Step | Document | Code |
|-----|---------|------|
| 1 | MoSCoW分类 | SYS-RA-RP-001 |
| 2 | 需求价值评估 | SYS-RA-RP-002 |
| 3 | 实现成本评估 | SYS-RA-RP-003 |
| 4 | 迭代计划 | SYS-RA-RP-004 |
| 5 | 需求优先级矩阵 | SYS-RA-RP-005 |

---

## Value-Cost Matrix

```
                    High Value
                         │
         ┌───────────────┼───────────────┐
         │  Quick Wins   │  Major Projects│
         │  (P0/P1)      │   (P0/P1)     │
         │               │               │
Low Cost ├───────────────┼───────────────┤ High Cost
         │  Fill-ins     │  Thankless    │
         │   (P2)        │   Tasks       │
         │               │   (P3)        │
         └───────────────┼───────────────┘
                         │
                    Low Value
```

**Quadrant Strategies:**
- **Quick Wins:** High value, low cost - Do first
- **Major Projects:** High value, high cost - Plan carefully
- **Fill-ins:** Low value, low cost - Do if time permits
- **Thankless Tasks:** Low value, high cost - Avoid or defer

---

## Quality Checklist

- [ ] All requirements classified with MoSCoW
- [ ] Value assessment completed for all requirements
- [ ] Cost estimation documented with rationale
- [ ] Iteration plan balances workload
- [ ] Priority matrix shows clear ranking
- [ ] Stakeholders have reviewed and approved
- [ ] Risks identified with mitigation plans

---

## Best Practices

1. **Involve stakeholders** - Get input from business and technical teams
2. **Use data** - Base decisions on objective assessments
3. **Consider dependencies** - Sequence requirements logically
4. **Balance the matrix** - Don't overload any single iteration
5. **Review regularly** - Re-prioritize as conditions change
6. **Document rationale** - Explain why priorities were set
7. **Be flexible** - Adjust for changing business needs

---

## Common Pitfalls

- **Everything is Must have** - Push back and enforce classification
- **Ignoring technical debt** - Include refactoring in priorities
- **No stakeholder buy-in** - Ensure approval before starting
- **Static priorities** - Review and adjust regularly
- **Over-optimism** - Add buffer time for complex features
- **Missing dependencies** - Map requirements to each other
