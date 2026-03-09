---
name: "current-assessment-process"
description: "Guides the current architecture assessment process including system inventory, technical debt identification, gap analysis, and improvement roadmap. Invoke when user needs to assess existing system architecture, identify technical debts, or analyze architecture gaps."
---

# Current Architecture Assessment Process

This skill guides the current architecture assessment process, ensuring systematic evaluation of existing systems and identification of improvement opportunities.

## When to Invoke

- User needs to assess existing system architecture
- User wants to identify technical debts
- User needs to analyze gaps between current and target architecture
- User wants to create an improvement roadmap
- User asks for architecture assessment documentation

## Process Overview

The current architecture assessment consists of 5 main phases:
1. Current Architecture Inventory
2. Technical Debt Identification
3. Architecture Gap Analysis
4. Improvement Roadmap Development
5. Review and Confirmation

## Phase 1: Current Architecture Inventory

### Step 1.1: System Inventory

**Activities:**
1. Identify all relevant systems
2. Collect basic system information:
   - System name and vendor
   - Go-live date and version
   - User scale
   - Deployment method
3. Create system architecture overview diagram

**Output:**
- System basic information table
- System architecture overview diagram

### Step 1.2: Technology Stack Analysis

**Activities:**
1. Analyze each system's technology stack:
   - Frontend technology (framework, version)
   - Backend technology (language, framework, version)
   - Database (type, version)
   - Middleware (cache, message queue, etc.)
2. Assess technology stack modernization
3. Identify technical risks

**Output:**
- Technology stack matrix
- Technical risk assessment

### Step 1.3: Integration Relationship Analysis

**Activities:**
1. Identify inter-system integration relationships
2. Analyze integration methods:
   - Interface protocols (REST/SOAP/RFC, etc.)
   - Data formats (JSON/XML, etc.)
   - Call frequency
3. Create system integration relationship diagram

**Output:**
- System integration relationship diagram
- Interface inventory table

## Phase 2: Technical Debt Identification

### Step 2.1: Technical Debt Inventory

**Activities:**
1. Identify types of technical debt:
   - Outdated technology stack
   - Legacy architecture patterns
   - Code quality issues
   - Lack of automation
   - Missing documentation
2. Compile technical debt inventory

**Output:**
- Technical debt inventory

### Step 2.2: Debt Impact Assessment

**Activities:**
1. Assess impact of each debt:
   - Business impact
   - Technical impact
   - Security risks
   - Maintenance costs
2. Quantify debt costs

**Output:**
- Technical debt impact assessment table

### Step 2.3: Priority Ranking

**Activities:**
1. Use priority matrix:
   - High impact + High urgency = Immediate action
   - High impact + Low urgency = Priority planning
   - Low impact + High urgency = Continuous improvement
   - Low impact + Low urgency = Consider as appropriate
2. Determine debt handling priority

**Output:**
- Technical debt priority matrix
- Debt handling plan

## Phase 3: Architecture Gap Analysis

### Step 3.1: Target Architecture Definition

**Activities:**
1. Define target architecture blueprint
2. Clarify target architecture capabilities:
   - Unified authentication
   - Permission management
   - Organizational structure
   - System integration
   - Technical architecture
3. Establish target architecture metrics

**Output:**
- Target architecture blueprint
- Target architecture capability list

### Step 3.2: Gap Identification

**Activities:**
1. Compare current and target architecture
2. Identify gap dimensions:
   - Identity authentication and authorization
   - Organizational structure management
   - Permission management
   - System integration capability
   - Technical architecture
   - Data architecture
   - Security architecture
3. Compile gap analysis matrix

**Output:**
- Architecture gap analysis matrix
- Detailed gap description

### Step 3.3: Impact Assessment

**Activities:**
1. Assess business impact of gaps
2. Assess technical impact of gaps
3. Analyze improvement urgency

**Output:**
- Gap impact assessment report

## Phase 4: Improvement Roadmap Development

### Step 4.1: Improvement Plan Design

**Activities:**
1. Design improvement plan
2. Divide implementation phases
3. Establish phase objectives

**Output:**
- Improvement plan document

### Step 4.2: Timeline Planning

**Activities:**
1. Create project timeline
2. Identify key milestones
3. Identify dependencies

**Output:**
- Improvement roadmap (Gantt chart)

### Step 4.3: Investment Estimation

**Activities:**
1. Estimate labor costs
2. Estimate hardware and software procurement
3. Estimate external services
4. Calculate ROI

**Output:**
- Investment estimation table
- ROI analysis

## Phase 5: Review and Confirmation

### Step 5.1: Document Review

**Activities:**
1. Organize review meeting
2. Review document completeness
3. Confirm analysis accuracy
4. Discuss improvement plan

**Output:**
- Review comments
- Review record

### Step 5.2: Sign-off Confirmation

**Activities:**
1. Stakeholder sign-off
2. Archive assessment documents
3. Publish assessment results

**Output:**
- Sign-off confirmation page
- Published assessment report

## Document Templates

### Current Architecture Inventory Document Structure

```
1. Overview
   1.1 Purpose
   1.2 Scope
   1.3 Method

2. Current System Architecture Overview
   2.1 System Architecture Panorama
   2.2 Inter-system Interaction Relationships

3. Detailed Architecture of Each System
   3.1 [System Name]
       3.1.1 Basic Information
       3.1.2 Technology Stack
       3.1.3 Core Function Modules
       3.1.4 Integration Interfaces
       3.1.5 Technical Debt

4. Technical Debt Summary
   4.1 Technical Debt Matrix
   4.2 Technical Debt Priority

5. Data Status Analysis
   5.1 Data Distribution
   5.2 Data Silo Issues

6. Infrastructure Status
   6.1 Server Resources
   6.2 Network Architecture

7. Security Status
   7.1 Security Measures
   7.2 Security Risks

8. Summary and Recommendations

9. Appendix
```

### Architecture Gap Analysis Document Structure

```
1. Overview
   1.1 Purpose
   1.2 Scope
   1.3 Analysis Method

2. Target Architecture Definition
   2.1 Target Architecture Blueprint
   2.2 Target Architecture Capability Requirements

3. Gap Analysis Matrix
   3.1 Architecture Dimension Gap Overview
   3.2 Detailed Gap Analysis

4. Gap Impact Assessment
   4.1 Business Impact
   4.2 Technical Impact

5. Improvement Roadmap
   5.1 Improvement Priority
   5.2 Phase Objectives

6. Risk Assessment
   6.1 Improvement Risks
   6.2 Risk Response Strategies

7. Investment Estimation
   7.1 Investment Categories
   7.2 Investment Returns

8. Summary and Recommendations

9. Appendix
```

## Quality Standards

### Current Architecture Inventory Quality Standards

| Check Item | Quality Requirement | Check Method |
|-----------|-------------------|-------------|
| System Coverage | All relevant systems inventoried | Check against system list |
| Information Completeness | Technology stack, functions, interfaces complete | Document review |
| Diagram Clarity | Architecture diagrams clear and readable | Visual inspection |
| Debt Identification | Technical debts comprehensively identified | Team review |

### Architecture Gap Analysis Quality Standards

| Check Item | Quality Requirement | Check Method |
|-----------|-------------------|-------------|
| Clear Objectives | Target architecture clearly defined | Document review |
| Comprehensive Gaps | Gaps identified in all dimensions | Check against checklist |
| Deep Analysis | Gap root causes analyzed | Expert review |
| Feasible Plan | Improvement plan practical | Feasibility assessment |

## Best Practices

### Current Architecture Inventory

1. **Thorough Research**: Deep communication with system owners and operations staff
2. **Document Verification**: Verify accuracy and timeliness of system documents
3. **Tool Assistance**: Use architecture visualization tools for diagrams
4. **Regular Updates**: Update inventory when systems change

### Architecture Gap Analysis

1. **Objective Assessment**: Avoid subjective assumptions, base on facts
2. **Quantified Analysis**: Quantify gap impact and costs where possible
3. **Multi-party Participation**: Involve business, technical, and operations teams
4. **Continuous Tracking**: Regularly review gap analysis and track improvement progress

## Common Pitfalls

| Pitfall | Description | Avoidance Method |
|--------|-------------|-----------------|
| Incomplete Information | Missing key systems or information | Use standardized checklist |
| Surface Analysis | Only describe status without deep analysis | Ask "why" more often |
| Vague Objectives | Target architecture not clearly defined | Reference industry best practices |
| Radical Plan | Improvement plan too aggressive | Phased implementation, gradual improvement |
| Ignoring Costs | Not fully considering improvement costs | Detailed investment estimation |

## Reference Documents

- Architecture Design Checklist
- Requirement Mapping Analysis Process Standard
- Technology Selection Process Standard
