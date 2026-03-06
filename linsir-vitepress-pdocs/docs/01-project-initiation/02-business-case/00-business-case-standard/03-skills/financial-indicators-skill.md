---
name: "financial-indicators-process"
description: "Guides the financial indicators analysis process including NPV, IRR, and MIRR calculation for business case development. Invoke when user needs to calculate NPV, analyze IRR, evaluate project financial feasibility, or perform financial sensitivity analysis."
---

# Financial Indicators Analysis Process

## When to Use

- User needs to calculate NPV for a project
- User asks to analyze IRR or MIRR
- User needs to evaluate project financial feasibility
- User wants to perform financial sensitivity analysis
- User asks for help with investment decision based on financial indicators

## Financial Indicators Analysis Process

### Step 1: Collect Cash Flow Data

**Required Data**:
- Initial investment (Year 0)
- Annual operating costs
- Annual benefits realization
- Net cash flow by period

**Sources**:
- Cost analysis documents
- Benefit analysis documents
- ROI calculation documents

**Output**:
- Project cash flow schedule
- Net cash flow data by period

### Step 2: Determine Discount Rate

**Discount Rate Selection Criteria**:

| Basis | Typical Value | Use Case |
|-------|--------------|----------|
| Company WACC | 8-10% | Standard projects |
| Industry benchmark | 10-15% | Benchmark analysis |
| Risk-adjusted | WACC + premium | High-risk projects |
| Required return | Company-set | Investment decisions |

**Current Project**: 10%
- Based on company WACC (8-10%)
- IT industry standard
- Consistent with ROI calculation

### Step 3: NPV Calculation

**Formula**:
```
NPV = Σ(CFt / (1 + r)^t) - C0
```

**Calculation Steps**:
1. Calculate discount factor for each period: 1 / (1 + r)^t
2. Calculate present value for each period: CFt × discount factor
3. Sum all present values
4. Calculate NPV: Sum of PVs - Initial investment

**Evaluation Criteria**:

| NPV Range | Rating | Recommendation |
|-----------|--------|----------------|
| > 5M | Excellent | Strongly recommend |
| 2M-5M | Good | Recommend |
| 0-2M | Fair | Consider |
| < 0 | Poor | Not recommend |

### Step 4: IRR Calculation

**Method**: Trial and error

**Steps**:
1. Start with initial discount rate (e.g., 10%)
2. Calculate NPV
3. Adjust discount rate until NPV approaches 0
4. Use linear interpolation for precise IRR
5. Verify IRR (NPV calculated with IRR should ≈ 0)

**Evaluation Criteria**:

| IRR vs Required Return | Rating | Recommendation |
|----------------------|--------|----------------|
| IRR > 2× required | Excellent | Strongly recommend |
| IRR > 1.5× required | Good | Recommend |
| IRR > required | Fair | Consider |
| IRR ≤ required | Poor | Not recommend |

### Step 5: MIRR Calculation

**Steps**:
1. Calculate PV of negative cash flows (using financing rate)
2. Calculate FV of positive cash flows (using reinvestment rate)
3. Calculate MIRR: (FV / |PV|)^(1/n) - 1

**Parameters**:
- Financing rate: Company WACC
- Reinvestment rate: Required return or WACC

### Step 6: Sensitivity Analysis

**Dimensions**:

| Dimension | Range | Purpose |
|-----------|-------|---------|
| Discount rate | 5%-20% | Test cost of capital sensitivity |
| Benefit change | -30% to +10% | Test benefit realization risk |
| Cost change | -20% to +50% | Test cost control risk |

**Output**:
- Sensitivity analysis table
- Sensitivity curves

### Step 7: Industry Benchmark Comparison

**Compare**:
- NPV vs industry NPV benchmark
- IRR vs industry IRR benchmark
- PV benefit/cost ratio

**Industry Benchmarks**:

| Project Type | Typical IRR | Excellent IRR |
|-------------|-------------|---------------|
| Internal system | 15-30% | >30% |
| Infrastructure | 10-20% | >20% |
| Digital transformation | 20-50% | >40% |

### Step 8: Compile Analysis Report

**Report Contents**:
1. Cash flow data summary
2. NPV calculation process and results
3. IRR calculation process and results
4. MIRR calculation results
5. Sensitivity analysis
6. Industry benchmark comparison
7. Conclusions and recommendations

### Step 9: Review and Approval

**Review Checklist**:
- [ ] Cash flow data accuracy
- [ ] Discount rate selection rationale
- [ ] Calculation process correctness
- [ ] Results verification
- [ ] Sensitivity analysis completeness
- [ ] Industry benchmark comparison reasonableness
- [ ] Conclusion consistency with data

**Approval Process**:
Preparer → Finance Lead Review → Project Sponsor Approval

## Key Formulas

### Discount Factor
```
Discount Factor = 1 / (1 + r)^t
```

### NPV
```
NPV = Σ(CFt / (1 + r)^t) - C0
```

### IRR
```
Σ(CFt / (1 + IRR)^t) - C0 = 0
Solve for IRR where NPV = 0
```

### MIRR
```
MIRR = (FV / |PV|)^(1/n) - 1
```

## Output Templates

### NPV Analysis Template

| Year | Cash Flow | Discount Factor | Present Value | Cumulative PV |
|------|-----------|-----------------|---------------|---------------|
| Year 0 | | 1.000 | | |
| Year 1 | | | | |
| Year 2 | | | | |
| Year 3 | | | | |
| **NPV** | | | | |

### IRR Calculation Template

| Discount Rate | NPV | Relation to 0 |
|---------------|-----|---------------|
| | | |
| | | |
| **IRR** | **≈0** | |

### Sensitivity Analysis Template

| Scenario | Parameter Change | NPV | IRR | Rating |
|----------|-----------------|-----|-----|--------|
| Optimistic | | | | |
| Base | | | | |
| Conservative | | | | |

## Quality Control

### Data Quality Requirements
- Cash flow data must be consistent with cost and benefit analysis
- Discount rate selection must have clear rationale
- Calculation process must retain intermediate results

### Calculation Verification
- NPV verification: Sum of PVs = NPV + Initial investment
- IRR verification: NPV calculated with IRR should ≈ 0
- MIRR verification: FV/PV = (1+MIRR)^n

## Related Documents

- NPV Analysis (SYS-PI-BC-009)
- IRR Analysis (SYS-PI-BC-010)
- ROI Calculation (SYS-PI-BC-007)
- Payback Period Analysis (SYS-PI-BC-008)
