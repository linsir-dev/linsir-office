---
name: "project-application-documents-process"
description: "Guides the creation of project application documents including application form, report, and budget details. Invoke when user needs to create project application documents for the System platform project."
---

# Project Application Documents Process

## Overview

This skill guides the creation of three key project application documents:
1. Project Application Form (立项申请表)
2. Project Application Report (立项申请报告)
3. Investment Budget Detail (投资预算明细表)

## When to Invoke

Invoke this skill when:
- User needs to create project application documents
- User asks for help with project application form
- User needs to write project application report
- User needs to prepare investment budget details
- User is working on project initiation phase

## Input Documents Required

Before starting, ensure these documents are available:
- Project Charter (SYS-PI-PC-000)
- Business Case Summary Report (SYS-PI-BC-014)
- Preliminary Solution Document

## Process Steps

### Step 1: Create Project Application Form

**Document**: SYS-PI-PA-001
**Owner**: Product Manager
**Time**: 0.5 days

**Key Sections**:
1. Project Basic Information
   - Project Name: System System Basic Platform Project
   - Project Code: SYS-2026-001
   - Project Type: System Construction
   - Duration: 18 months

2. Project Organization
   - Project Sponsor: VP Wu
   - Project Manager: Manager Zhang
   - Technical Lead: CTO Zhou
   - Business Lead: Director Zhang

3. Application Justification
   - Business Background (4 pain points)
   - Project Necessity (business/technical/strategic needs)
   - Risks of Not Implementing

4. Project Objectives
   - Overall Goal: Build unified basic platform
   - 5 Specific Objectives with measurable KPIs
   - 4 Expected Deliverables

5. Investment Budget
   - Total: 4.6992 million RMB
   - Annual Distribution
   - Funding Source

6. Expected Benefits
   - Financial: ROI 231.9%, NPV 6.2399M, IRR 60.3%
   - Non-financial benefits

7. Project Milestones
   - 6 key milestones with dates

8. Risk Assessment
   - Main risks and mitigation measures

**Completion Criteria**:
- [ ] All project information accurate
- [ ] Justification sufficient
- [ ] Objectives measurable
- [ ] Budget data accurate
- [ ] Benefit analysis reasonable

### Step 2: Create Project Application Report

**Document**: SYS-PI-PA-002
**Owner**: Product Manager
**Time**: 1.5 days

**Key Sections**:
1. Project Background
   - Business background (4 challenges)
   - Current situation analysis
   - Project necessity

2. Construction Content
   - Construction goals
   - 5 Functional Modules:
     * User Center (P0)
     * Permission Management (P0)
     * Organization Structure (P1)
     * Data Dictionary (P1)
     * System Monitoring (P1)
   - Non-functional Requirements
   - Project Scope

3. Technical Solution
   - Technical Architecture (4 layers)
   - Core Technology Stack
   - Key Technologies (SSO, RBAC, Microservices)
   - System Integration

4. Implementation Plan
   - Project Milestones
   - Detailed Plan (5 phases)
   - Team Configuration (10 people)
   - Risk Management

5. Investment Budget
   - Budget Overview
   - Development Cost Details
   - Operation Cost Details
   - Other Cost Details
   - Annual Investment Plan

6. Expected Benefits Analysis
   - Benefits Overview
   - Direct Benefits (3.5871M)
   - Indirect Benefits (5.109M)
   - Strategic Benefits (6.9M)
   - Financial Indicators
   - Industry Comparison

7. Risk Analysis
   - Risk Identification (6 types)
   - Risk Assessment
   - Risk Response
   - Risk Monitoring

8. Conclusion and Recommendations
   - Feasibility Conclusion
   - Investment Recommendation
   - Implementation Suggestions
   - Next Actions

**Completion Criteria**:
- [ ] Content complete and logical
- [ ] Data accurate with reliable sources
- [ ] Solution feasible with controllable risks
- [ ] Conclusion clear with feasible recommendations

### Step 3: Create Investment Budget Detail

**Document**: SYS-PI-PA-003
**Owner**: Financial Manager
**Time**: 1 day

**Key Sections**:
1. Development Cost Details (2.2903M)
   - Human Resources (1.8322M)
   - Software/Tools (0.229M)
   - Test Environment (0.1145M)
   - Risk Reserve (0.1145M)

2. Operation Cost Details (1.9143M, 3 years)
   - Human Resources (1.1486M)
   - Cloud Resources (0.4786M)
   - Software License (0.1914M)
   - Other Costs (0.0957M)

3. Other Cost Details (0.4946M)
   - Training (0.24M)
   - Data Migration (0.12M)
   - Project Management (0.0846M)
   - Other Expenses (0.05M)

4. Annual Investment Plan
   - 2026: 2.8M
   - 2027: 1.2M
   - 2028: 0.6992M

5. Funding Source
   - Annual IT Budget

6. Budget Review
   - Preparation Review
   - Financial Review
   - Approval Signature

**Completion Criteria**:
- [ ] Cost classification clear
- [ ] Calculation accurate
- [ ] Annual distribution reasonable
- [ ] Funding source clear

## Output Documents

| No. | Document Name | Document Code | Owner | Status |
|-----|--------------|---------------|-------|--------|
| 1 | Project Application Form | SYS-PI-PA-001 | Product Manager | ⏳ Pending |
| 2 | Project Application Report | SYS-PI-PA-002 | Product Manager | ⏳ Pending |
| 3 | Investment Budget Detail | SYS-PI-PA-003 | Financial Manager | ⏳ Pending |

## Document Standards

### Format Requirements
- All documents use Markdown format
- Document codes follow SYS-PI-PA-XXX rule
- Documents must be reviewed and signed

### Review Process
1. Self-check by author
2. Review by Project Manager
3. Issue fixing
4. Final confirmation and signature

### Time Requirements
| Task | Time Required |
|------|--------------|
| Project Application Form | 0.5 work days |
| Project Application Report | 1.5 work days |
| Investment Budget Detail | 1 work day |
| **Total** | **3 work days** |

## Review Checklist

Before marking complete, verify:
- [ ] All three documents created
- [ ] All documents reviewed and approved
- [ ] Document codes correct
- [ ] Signatures complete
- [ ] Files saved to correct location

## Common Issues

1. **Inconsistent Data**: Ensure budget numbers match business case
2. **Missing Signatures**: Don't forget approval signatures
3. **Wrong Document Codes**: Follow SYS-PI-PA-XXX format
4. **Incomplete Content**: Check all required sections are filled

## References

- Project Charter: SYS-PI-PC-000
- Business Case Summary: SYS-PI-BC-014
- Process Standard: project-application-documents-process.md

---

*Backup Location*: `03-skills/project-application-documents-skill.md`  
*Original Location*: `.trae/skills/project-application-documents-process/SKILL.md`  
*Created*: 2026-03-13  
*Version*: 1.0
