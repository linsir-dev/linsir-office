---
name: "approval-process"
description: "Guides the project application approval process including department review, finance review, technical review, and executive approval. Invoke when user needs to conduct project approval process."
---

# Project Application Approval Process

## Overview

This skill guides the project application approval process with four key steps:
1. Department Review (部门初审)
2. Finance Review (财务审核)
3. Technical Review (技术评审)
4. Executive Approval (高层审批)

## When to Invoke

Invoke this skill when:
- User needs to conduct project approval process
- User asks for help with department review
- User needs to perform finance review
- User needs technical committee review
- User needs executive approval

## Input Documents Required

Before starting, ensure these documents are available:
- Project Application Form (SYS-PI-PA-001)
- Project Application Report (SYS-PI-PA-002)
- Investment Budget Detail (SYS-PI-PA-003)
- Project Charter Summary (SYS-PI-PA-004)
- Business Case Summary (SYS-PI-PA-005)
- Technical Feasibility Statement (SYS-PI-PA-006)
- Functional Requirements List (SYS-PI-PA-012)
- Project Presentation (SYS-PI-PA-011)

## Approval Flow

```
Submit Application → Department Review → Finance Review → Technical Review → Executive Approval → Result Processing
```

## Process Steps

### Step 1: Submit Application

**Owner**: Project Manager
**Time**: 0.5 days

**Key Activities**:
1. Prepare application materials
2. Fill approval form
3. Submit for review

**Completion Criteria**:
- [ ] All materials prepared
- [ ] Materials reviewed and signed
- [ ] Successfully submitted

### Step 2: Department Review

**Document**: SYS-PI-PA-007
**Owner**: Business Owner
**Time**: 1 day

**Review Content**:
- Project Background Review
- Project Objectives Review
- Project Scope Review
- Business Value Review

**Completion Criteria**:
- [ ] Background clear
- [ ] Objectives measurable
- [ ] Scope reasonable
- [ ] Value clear
- [ ] Signatures complete

### Step 3: Finance Review

**Document**: SYS-PI-PA-008
**Owner**: Financial Manager
**Time**: 1 day

**Review Content**:
- Investment Budget Review
- Cost Detail Review
- Annual Investment Review
- Financial Indicators Review
- Funding Source Review

**Completion Criteria**:
- [ ] Budget reasonable
- [ ] Calculation accurate
- [ ] Indicators excellent
- [ ] Source clear
- [ ] Signatures complete

### Step 4: Technical Review

**Document**: SYS-PI-PA-009
**Owner**: CTO/Technical Committee
**Time**: 1 day

**Review Content**:
- Technical Architecture Review
- Core Technology Review
- Performance Indicators Review
- Technical Feasibility Review
- Technical Support Review

**Completion Criteria**:
- [ ] Architecture reasonable
- [ ] Technology mature
- [ ] Indicators achievable
- [ ] Risk controllable
- [ ] Signatures complete

### Step 5: Executive Approval

**Document**: SYS-PI-PA-010
**Owner**: Project Sponsor/General Manager
**Time**: 0.5 days

**Approval Content**:
- Comprehensive Assessment
- Project Approval
- Budget Approval
- Team Authorization

**Completion Criteria**:
- [ ] Assessment comprehensive
- [ ] Decision clear
- [ ] Budget approved
- [ ] Authorization clear
- [ ] Signatures complete

### Step 6: Process Approval Result

**Owner**: Project Manager
**Time**: 0.5 days

**Key Activities**:
- Result Notification
- Result Processing

**Completion Criteria**:
- [ ] Notification timely
- [ ] Processing timely
- [ ] Execution in place

## Output Documents

| No. | Document Name | Document Code | Owner | Status |
|-----|--------------|---------------|-------|--------|
| 1 | Department Review Record | SYS-PI-PA-007 | Business Owner | ⏳ Pending |
| 2 | Finance Review Record | SYS-PI-PA-008 | Financial Manager | ⏳ Pending |
| 3 | Technical Review Record | SYS-PI-PA-009 | CTO | ⏳ Pending |
| 4 | Executive Approval Form | SYS-PI-PA-010 | Project Sponsor | ⏳ Pending |

## Approval Standards

### Approval Timeline
| Approval Step | Time Required |
|--------------|---------------|
| Department Review | 1 work day |
| Finance Review | 1 work day |
| Technical Review | 1 work day |
| Executive Approval | 0.5 work day |
| **Total** | **3.5 work days** |

### Approval Sequence
1. Department Review → Finance Review → Technical Review → Executive Approval
2. Cannot proceed to next step if previous step not passed
3. Parallel approval possible in special cases

## Review Checklist

Before marking complete, verify:
- [ ] All four approval documents created
- [ ] All approvals reviewed and approved
- [ ] Document codes correct
- [ ] Signatures complete
- [ ] Files saved to correct location

## References

- Project Application Form: SYS-PI-PA-001
- Project Application Report: SYS-PI-PA-002
- Investment Budget Detail: SYS-PI-PA-003
- Process Standard: approval-process.md

---

*Backup Location*: `03-skills/approval-process-skill.md`
*Original Location*: `.trae/skills/approval-process/SKILL.md`
*Created*: 2026-03-13
*Version*: 1.0
