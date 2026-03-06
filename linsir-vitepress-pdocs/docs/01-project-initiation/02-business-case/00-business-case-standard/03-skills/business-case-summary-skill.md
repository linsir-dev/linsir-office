---
name: "business-case-summary-process"
description: "Guides the business case summary and approval process including report compilation, financial summary, risk analysis summary, and investment decision documentation. Invoke when user needs to compile business case reports, prepare investment decision documents, or summarize cost-benefit analysis results."
---

# Business Case Summary Process

## When to Use

- User needs to compile business case summary report
- User asks to prepare investment decision documents
- User wants to summarize cost-benefit analysis results
- User needs to create business case approval workflow
- User asks for investment recommendation documentation

## Business Case Summary Process

### Step 1: Collect Module Analysis Results

**Required Input Documents**:

| Document Type | Document ID | Status Check |
|--------------|-------------|--------------|
| Cost Analysis | SYS-PI-BC-001~003 | Must be completed |
| Benefit Analysis | SYS-PI-BC-004~006 | Must be completed |
| ROI Calculation | SYS-PI-BC-007~008 | Must be completed |
| Financial Indicators | SYS-PI-BC-009~010 | Must be completed |
| Sensitivity Analysis | SYS-PI-BC-011~013 | Must be completed |

**Data Collection Checklist**:
- [ ] Total investment cost
- [ ] Total expected benefits
- [ ] ROI calculations (optimistic/base/conservative)
- [ ] NPV calculations
- [ ] IRR calculations
- [ ] Payback period
- [ ] Risk-adjusted ROI
- [ ] Sensitivity coefficients
- [ ] Scenario analysis results

### Step 2: Summarize Cost Analysis

**Cost Categories to Summarize**:

| Cost Category | Typical Components | Output Format |
|--------------|-------------------|---------------|
| Development Cost | Personnel, software, testing, contingency | Table with breakdown |
| Operation Cost | Personnel, cloud resources, licenses | 3-year projection |
| Other Costs | Training, migration, consulting | One-time costs |

**Key Calculations**:
```
Total Investment = Development Cost + Operation Cost + Other Costs
Cost Breakdown % = (Category Cost / Total Investment) × 100%
```

### Step 3: Summarize Benefit Analysis

**Benefit Categories to Summarize**:

| Benefit Category | Typical Sources | Measurement Approach |
|-----------------|-----------------|---------------------|
| Direct Benefits | Efficiency gains, time savings | Quantifiable metrics |
| Indirect Benefits | Data quality, management efficiency | Qualitative + quantitative |
| Strategic Benefits | Digital transformation, capability building | Long-term value |

**Key Calculations**:
```
Total Benefits = Direct Benefits + Indirect Benefits + Strategic Benefits
Benefit Breakdown % = (Category Benefit / Total Benefits) × 100%
```

### Step 4: Summarize Financial Indicators

**Financial Indicators Table**:

| Indicator | Optimistic | Base | Conservative | Expected |
|-----------|-----------|------|-------------|----------|
| ROI | | | | |
| NPV | | | | |
| IRR | | | | |
| MIRR | | | | |
| Payback Period (Static) | | | | |
| Payback Period (Dynamic) | | | | |

**Expected Value Calculation**:
```
Expected Value = (Optimistic × 20%) + (Base × 60%) + (Conservative × 20%)
```

### Step 5: Summarize Risk Analysis

**Risk Summary Components**:

1. **Key Risk Factors**:
   - List top 3-5 sensitive variables
   - Include sensitivity coefficients
   - Identify risk levels

2. **Scenario Analysis Summary**:
   - Optimistic scenario (20% probability)
   - Base scenario (60% probability)
   - Conservative scenario (20% probability)

3. **Risk-Adjusted Metrics**:
   - Risk-adjusted ROI
   - Risk-adjusted NPV
   - Risk-adjusted IRR

### Step 6: Compile Business Case Summary Report

**Report Structure**:

```markdown
# Business Case Summary Report

## 1. Executive Summary
- Project overview
- Investment recommendation
- Key conclusions

## 2. Project Background
- Business context
- Project objectives
- Project scope

## 3. Cost Analysis Summary
- Investment costs
- Cost breakdown analysis
- Cost control measures

## 4. Benefit Analysis Summary
- Expected benefits
- Benefit realization path
- Benefit tracking mechanism

## 5. Financial Indicators Summary
- Core financial indicators
- Risk-adjusted indicators
- Industry benchmark comparison

## 6. Risk Analysis Summary
- Key risk factors
- Scenario analysis conclusions
- Risk mitigation strategies

## 7. Investment Decision Recommendation
- Investment recommendation
- Implementation recommendations
- Follow-up actions

## 8. Appendix List

## 9. Review Records
```

### Step 7: Internal Review

**Review Participants**:
- Product Manager (lead)
- Project Manager
- Technical Lead

**Review Checklist**:
- [ ] Data accuracy verified
- [ ] Logical consistency checked
- [ ] Conclusions supported by data
- [ ] Format compliance confirmed
- [ ] Appendices complete

**Review Outputs**:
- Internal review record
- Revision list (if needed)

### Step 8: Financial Review

**Reviewer**: Finance Lead

**Review Focus**:
- Cost data accuracy
- Benefit estimation reasonableness
- Financial indicator calculations
- Discount rate selection

**Review Results**:
- Approved: Proceed to investment decision
- Rejected: Revise financial data and resubmit

### Step 9: Investment Decision Approval

**Approver**: Project Sponsor

**Decision Criteria**:
1. Financial indicators meet investment standards
2. Risks are controllable
3. Strategic value is clear
4. Resources can be secured

**Approval Outcomes**:
- **Approved**: Proceed to implementation
- **Rejected**: Project termination
- **Need More Info**: Supplement and resubmit

**Output**: Business Case Approval Form (SYS-PI-BC-015)

### Step 10: Develop Follow-up Action Plan

**Action Plan Components**:

1. **Immediate Actions (1 week)**:
   - Formal project initiation
   - Team assembly
   - Kick-off meeting

2. **Short-term Actions (1 month)**:
   - Detailed project plan
   - Benefit tracking mechanism
   - Risk management plan
   - Supplier selection

3. **Medium-term Actions (3 months)**:
   - Requirements analysis
   - System design
   - Development environment setup
   - Development start

## Key Formulas

### Investment Efficiency

```
ROI = (Total Benefits - Total Investment) / Total Investment × 100%
```

### Risk-Adjusted ROI

```
Risk-Adjusted ROI = (Risk-Adjusted Benefits - Risk-Adjusted Investment) / Risk-Adjusted Investment × 100%
```

### Expected Financial Indicator

```
Expected Value = Σ(Scenario Value × Probability)
```

## Output Templates

### Cost Summary Table

| Cost Category | Amount | Percentage | Notes |
|--------------|--------|-----------|-------|
| Development | | | One-time |
| Operation | | | 3-year |
| Other | | | One-time |
| **Total** | | | |

### Benefit Summary Table

| Benefit Category | 3-Year Amount | Percentage | Realization Path |
|-----------------|--------------|-----------|-----------------|
| Direct | | | |
| Indirect | | | |
| Strategic | | | |
| **Total** | | | |

### Financial Indicators Summary

| Indicator | Optimistic | Base | Conservative | Industry Benchmark |
|-----------|-----------|------|-------------|-------------------|
| ROI | | | | |
| NPV | | | | |
| IRR | | | | |
| Payback Period | | | | |

### Investment Recommendation Format

**Recommendation**: [Strongly Recommend / Recommend / Not Recommend]

**Key Reasons**:
1. 
2. 
3. 

**Risk Warnings**:
- 
- 

**Implementation Suggestions**:
1. 
2. 
3. 

## Quality Control

### Data Quality Requirements

- All source documents must be completed and approved
- Data must be consistent across all modules
- Calculations must be verified
- Assumptions must be documented

### Review Quality Requirements

- Internal review must be completed before financial review
- Financial review must be completed before approval
- All review comments must be addressed
- Final approval must be documented

## Related Documents

### Input Documents

- Cost Analysis Documents (SYS-PI-BC-001~003)
- Benefit Analysis Documents (SYS-PI-BC-004~006)
- ROI Calculation Documents (SYS-PI-BC-007~008)
- Financial Indicators Documents (SYS-PI-BC-009~010)
- Sensitivity Analysis Documents (SYS-PI-BC-011~013)

### Output Documents

- Business Case Summary Report (SYS-PI-BC-014)
- Business Case Approval Form (SYS-PI-BC-015)

### Process Documents

- Business Case Overall Process
- Module-specific Process Standards
