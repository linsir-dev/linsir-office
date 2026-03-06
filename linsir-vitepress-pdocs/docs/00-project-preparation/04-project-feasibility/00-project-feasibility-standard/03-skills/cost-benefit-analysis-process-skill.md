---
name: "cost-benefit-analysis-process"
description: "Guides the cost-benefit analysis process for project investment evaluation, including cost estimation, benefit analysis, ROI calculation, and sensitivity analysis. Invoke when user needs to conduct cost-benefit analysis, create investment evaluation reports, or calculate project ROI."
---

# Cost-Benefit Analysis Process

This skill guides users through the complete cost-benefit analysis process for project investment evaluation.

## When to Use

Invoke this skill when:
- User needs to conduct cost-benefit analysis for a project
- User asks to create investment evaluation reports
- User needs to calculate project ROI, NPV, or IRR
- User wants to perform sensitivity analysis for investment decisions
- User asks about cost estimation or benefit analysis methodologies

## Process Overview

The cost-benefit analysis process includes 7 steps:

1. **Define Analysis Scope** - Establish project boundaries and assumptions
2. **Cost Estimation** - Estimate human resources, hardware, software, training costs
3. **Benefit Analysis** - Analyze direct and indirect benefits
4. **ROI Calculation** - Calculate ROI, payback period, NPV, IRR
5. **Sensitivity Analysis** - Assess risks and uncertainties
6. **Write Analysis Report** - Summarize findings and recommendations
7. **Review and Approval** - Financial review and management approval

## Step-by-Step Guide

### Step 1: Define Analysis Scope

**Inputs:**
- Project requirements document
- Technical feasibility report
- Project plan draft

**Activities:**
1. Define project boundaries and scope
2. Establish analysis assumptions (duration, team size, discount rate)
3. Determine analysis period (typically 3-5 years)
4. Identify key stakeholders

**Outputs:**
- Analysis scope statement
- Assumptions list

### Step 2: Cost Estimation

#### Human Resource Costs
```
Cost = Σ(Roles × Monthly Cost × Months)
```

**Roles to consider:**
- Project management
- Technical architecture
- Development team
- QA team
- Operations support

#### Hardware/Cloud Service Costs
- Development environment servers
- Testing environment servers
- Production environment servers
- Database servers
- Load balancers
- Storage and CDN

#### Software License Costs
- Open source software (document license types)
- Commercial software/services
- Third-party component licenses

#### Training Costs
- Internal training (instructor, materials, venue)
- External training (courses, travel)

#### Other Costs
- Travel expenses
- Meeting expenses
- Office supplies
- Third-party services
- Contingency reserve (5-10%)

### Step 3: Benefit Analysis

#### Direct Benefits

**Efficiency Improvements:**
```
Benefit = Time Saved × Labor Cost
```

**Common benefit items:**
- Process efficiency gains
- Reduced manual operations
- Faster issue resolution

**Labor Savings:**
- Operations staff reduction
- Support staff reduction
- Management overhead reduction

#### Indirect Benefits

**User Experience:**
- Improved user satisfaction
- Reduced learning curve
- Increased productivity

**Security & Compliance:**
- Reduced security risks
- Compliance cost savings
- Audit convenience

**Business Value:**
- Improved data quality
- Better decision support
- Enhanced business agility

**Brand Value:**
- Enhanced corporate image
- Employee satisfaction
- Talent attraction

### Step 4: ROI Calculation

#### Key Metrics

**Return on Investment (ROI):**
```
ROI = (Total Benefits - Total Investment) / Total Investment × 100%
```

**Payback Period:**
Time required for cumulative cash flow to become positive

**Net Present Value (NPV):**
```
NPV = Σ(Cash Flow_t / (1 + r)^t)
```
Where r is the discount rate

**Internal Rate of Return (IRR):**
Discount rate that makes NPV = 0

#### Evaluation Criteria

| Metric | Excellent | Good | Acceptable | Unacceptable |
|--------|-----------|------|------------|--------------|
| 5-year ROI | >100% | 50-100% | 20-50% | <20% |
| Annual ROI | >15% | 10-15% | 5-10% | <5% |
| Payback Period | <1 year | 1-2 years | 2-3 years | >3 years |
| NPV | >0 | - | - | <0 |
| IRR | >discount rate | Near discount rate | - | <discount rate |

### Step 5: Sensitivity Analysis

#### Single-Factor Analysis

**Benefit Variation Impact:**

| Benefit Realization | 5-year ROI | Payback Period | Conclusion |
|---------------------|------------|----------------|------------|
| 100% | ?% | ? months | - |
| 80% | ?% | ? months | - |
| 60% | ?% | ? months | - |
| 40% | ?% | ? months | - |

**Cost Variation Impact:**

| Cost Change | 5-year ROI | Payback Period | Conclusion |
|-------------|------------|----------------|------------|
| +20% | ?% | ? months | - |
| Baseline | ?% | ? months | - |
| -20% | ?% | ? months | - |

#### Two-Factor Analysis

Build benefit-cost matrix to assess combined impact

#### Break-Even Analysis

```
Break-even Benefit = Total Investment / Usage Years + Annual Operating Cost
Safety Margin = (Expected Benefit - Break-even Benefit) / Expected Benefit
```

### Step 6: Write Analysis Report

**Report Structure:**
1. Executive Summary
2. Cost Analysis
3. Benefit Analysis
4. ROI Analysis
5. Sensitivity Analysis
6. Risk Analysis
7. Recommendations
8. Conclusion

**Key Outputs:**
- Cost estimation table
- Benefit projection table
- Cash flow table
- ROI calculation table
- Sensitivity analysis table

### Step 7: Review and Approval

**Review Process:**
1. Project manager initial review
2. Finance department review
3. Management approval

**Review Points:**
- Cost estimation completeness
- Benefit projection reasonableness
- Assumption validity
- Risk identification adequacy

## Output Documents

| No. | Document Name | Description |
|-----|---------------|-------------|
| 1 | Cost Estimation Report | Detailed cost breakdown |
| 2 | Benefit Analysis Report | Benefit sources and projections |
| 3 | ROI Analysis Report | Investment return calculations |
| 4 | Cost-Benefit Summary Report | Comprehensive analysis conclusions |

## Best Practices

### Cost Estimation
- Reserve 10-15% contingency
- Consider hidden costs (management, communication)
- Reference historical project data

### Benefit Estimation
- Conservative estimates, avoid over-optimism
- Distinguish certain benefits from expected benefits
- Establish benefit measurement mechanisms

### Risk Management
- Identify key risk factors
- Develop risk response plans
- Regular review and updates

## Templates

### Cost Estimation Template

```markdown
## Human Resource Costs

| Role | Count | Monthly Cost | Months | Subtotal |
|------|-------|--------------|--------|----------|
| | | | | |
| **Total** | | | | |

## Hardware/Cloud Service Costs

| Resource | Spec | Count | Unit Price | Months | Subtotal |
|----------|------|-------|------------|--------|----------|
| | | | | | |
| **Total** | | | | | |
```

### Benefit Estimation Template

```markdown
## Efficiency Improvement Benefits

| Benefit Item | Volume | Time Saved | Labor Cost | Monthly Benefit | Annual Benefit |
|--------------|--------|------------|------------|-----------------|----------------|
| | | | | | |
| **Total** | | | | | |
```

### ROI Calculation Template

```markdown
## Key Metrics

| Metric | Value | Evaluation |
|--------|-------|------------|
| Total Investment | | |
| Annual Benefit | | |
| 5-year ROI | | |
| Payback Period | | |
| NPV | | |
| IRR | | |
```
