---
name: "current-situation-research-process"
description: "Guides the current situation research process for requirements analysis. Invoke when user needs to conduct current situation research, analyze existing systems and processes, or create current situation research documentation."
---

# Current Situation Research Process

This skill guides you through the complete current situation research process for requirements analysis, including system analysis, process mapping, pain point identification, data collection, bottleneck analysis, and report generation.

## When to Use

Invoke this skill when:
- User asks to conduct current situation research
- User needs to analyze existing systems and processes
- User wants to identify current pain points and problems
- User needs to create current situation research documentation
- User is in the requirements analysis phase of a project

## Research Process Overview

The current situation research consists of 6 main steps:
1. Collect existing system/process documents
2. Map current business processes
3. Identify pain points and problems
4. Collect business data and report samples
5. Analyze process bottlenecks
6. Output current situation research report

## Step-by-Step Guide

### Step 1: Collect Existing System/Process Documents

**Objective:** Gather comprehensive information about existing systems

**Actions:**
1. Identify all core business systems (ERP, CRM, OA, Finance, HR, etc.)
2. Create a directory for each system: `01-existing-systems-docs/01-system-name/`
3. For each system, create `system-overview.md` with:
   - System basic information (name, version, vendor, users)
   - System functionality overview
   - User management capabilities
   - Integration requirements
   - Existing problems

**Output:**
- System overview documents for each system
- System integration relationship diagram
- Existing problems record

**Verification Checklist:**
- [ ] All core business systems covered?
- [ ] System information complete (version, vendor, user count)?
- [ ] System integration relationships documented?
- [ ] System problems identified?

---

### Step 2: Map Current Business Processes

**Objective:** Document current business processes with flowcharts

**Actions:**
1. Identify core business processes:
   - User onboarding process
   - User offboarding process
   - Password reset process
   - Permission application process
   - Organization structure sync process
   - User information change process

2. For each process, create a document in `02-business-process-flow/`:
   - Process name and description
   - Process flowchart (Mermaid format)
   - Process participants and roles
   - Process time statistics
   - Process pain points

3. Generate MMD files and export PNG images for each flowchart

**Output:**
- Business process documents (one per process)
- Mermaid source files (.mmd)
- Flowchart images (.png)

**Verification Checklist:**
- [ ] All core business processes covered?
- [ ] Flowcharts clear and accurate?
- [ ] Process time data recorded?
- [ ] Process bottlenecks identified?

---

### Step 3: Identify Pain Points and Problems

**Objective:** Identify and categorize current pain points

**Actions:**
1. Based on user interviews and process analysis:
   - List all identified pain points
   - Categorize by level (decision, management, execution)
   - Categorize by system (ERP, CRM, OA, etc.)
   - Categorize by type (efficiency, security, experience, cost)

2. Create `03-pain-points-analysis.md`:
   - Pain point overview
   - Pain point classification (by level, by system)
   - Detailed pain point analysis (description, impact, quantification)
   - Pain point priority matrix
   - Pain point to requirement mapping
   - Solution value assessment

**Output:**
- Pain point identification document
- Pain point priority matrix
- Pain point to requirement mapping table
- Solution value assessment

**Verification Checklist:**
- [ ] All stakeholder levels covered?
- [ ] Pain points supported by real user feedback?
- [ ] Pain point impact quantified?
- [ ] Solution value assessed?

---

### Step 4: Collect Business Data and Report Samples

**Objective:** Gather data samples to understand data quality and structure

**Actions:**
1. Create directory `04-business-data-samples/`
2. Collect and document:
   - User basic information samples
   - User account information from each system
   - Role and permission data
   - Operation logs
   - Statistical reports

3. Create documents:
   - `01-user-data-samples.md`: User data samples from all systems
   - `02-report-samples.md`: Report samples and statistics
   - `README.md`: Data collection summary

4. Analyze data quality:
   - Data consistency across systems
   - Data completeness
   - Data synchronization issues

**Output:**
- Data sample documents
- Data statistics analysis
- Data quality issues list
- Data synchronization requirements

**Verification Checklist:**
- [ ] Data samples collected from all systems?
- [ ] Data consistency analyzed?
- [ ] Data quality issues identified?
- [ ] Data synchronization requirements proposed?

---

### Step 5: Analyze Process Bottlenecks

**Objective:** Identify and analyze bottlenecks in current processes

**Actions:**
1. For each core process, analyze:
   - Time distribution (time spent at each step)
   - Resource utilization (human effort required)
   - Quality metrics (error rate, rework rate)
   - Risk assessment (security, compliance)

2. Create `05-process-bottleneck-analysis.md`:
   - Bottleneck analysis overview
   - Process time analysis charts
   - Bottleneck identification (with severity P0/P1/P2/P3)
   - Root cause analysis
   - Optimization recommendations
   - Optimization roadmap
   - Value assessment

3. Create visual diagrams:
   - Time distribution charts
   - Root cause analysis diagrams
   - Optimization roadmap

**Output:**
- Process bottleneck analysis document
- Root cause analysis diagrams
- Optimization recommendations
- Optimization roadmap
- Value assessment report

**Verification Checklist:**
- [ ] All core processes analyzed?
- [ ] Bottlenecks quantified?
- [ ] Root causes identified?
- [ ] Optimization recommendations feasible?

---

### Step 6: Output Current Situation Research Report

**Objective:** Compile all research findings into a comprehensive report

**Actions:**
1. Create `06-current-situation-report.md` with structure:
   - Executive Summary
   - Current System Status
   - Business Process Status
   - Pain Points and Problem Analysis
   - Data Quality Analysis
   - Cost and Efficiency Analysis
   - Risk Assessment
   - Improvement Recommendations
   - Conclusions and Recommendations
   - Appendices

2. Include in the report:
   - Key findings summary
   - Quantified impact (cost, time, efficiency)
   - Risk assessment (security, compliance)
   - Improvement recommendations
   - Implementation roadmap
   - Expected benefits

**Output:**
- Current situation research report (main document)
- Supporting documents (organized by directory)

**Verification Checklist:**
- [ ] All research content covered?
- [ ] Key findings clear?
- [ ] Recommendations specific and actionable?
- [ ] All supporting documents attached?

---

## Document Structure

```
02-current-situation-report/
├── 01-existing-systems-docs/
│   ├── 01-erp-system/
│   │   └── system-overview.md
│   ├── 02-crm-system/
│   │   └── system-overview.md
│   ├── 03-oa-system/
│   │   └── system-overview.md
│   ├── 04-finance-system/
│   │   └── system-overview.md
│   ├── 05-hr-system/
│   │   └── system-overview.md
│   └── 06-other-systems/
│       └── system-overview.md
├── 02-business-process-flow/
│   ├── 01-user-onboarding-process.md
│   ├── 01-user-onboarding-process.mmd
│   ├── 01-user-onboarding-process.png
│   ├── 02-user-offboarding-process.md
│   ├── 02-user-offboarding-process.mmd
│   ├── 02-user-offboarding-process.png
│   ├── 03-password-reset-process.md
│   ├── 03-password-reset-process.mmd
│   ├── 03-password-reset-process.png
│   ├── 04-permission-application-process.md
│   ├── 04-permission-application-process.mmd
│   ├── 04-permission-application-process.png
│   ├── 05-org-structure-sync-process.md
│   ├── 05-org-structure-sync-process.mmd
│   └── 05-org-structure-sync-process.png
├── 03-pain-points-analysis.md
├── 04-business-data-samples/
│   ├── 01-user-data-samples.md
│   ├── 02-report-samples.md
│   └── README.md
├── 05-process-bottleneck-analysis.md
└── 06-current-situation-report.md
```

## Best Practices

1. **Multi-angle Collection**: Gather information from system, process, data, and people perspectives
2. **Quantitative Analysis**: Use data instead of subjective descriptions
3. **User Validation**: Validate findings with users to ensure accuracy
4. **Continuous Update**: Update documents as research progresses
5. **Visual Representation**: Use flowcharts and diagrams to illustrate findings
6. **Prioritization**: Focus on high-impact, high-frequency issues

## Common Pitfalls

1. **Incomplete Information**: Some system documentation may be missing
2. **Data Access Difficulties**: Some system data may be hard to export
3. **Process Variations**: Same process may be executed differently across departments
4. **Difficult Quantification**: Some pain points are hard to quantify with data

## Completion Criteria

Current situation research is complete when:
- [ ] All core business system documents collected
- [ ] All core business processes mapped with flowcharts
- [ ] Pain points identified and impact quantified
- [ ] Data samples collected and quality analyzed
- [ ] Process bottlenecks analyzed with optimization recommendations
- [ ] Current situation research report completed and reviewed

## Related Skills

- `user-interview-process`: For conducting user interviews before current situation research
- `business-requirement-process`: For creating business requirements after current situation research
