---
name: "sensitivity-analysis-process"
description: "Guides the sensitivity analysis process including variable identification, scenario analysis, and risk-adjusted ROI calculation for business case development. Invoke when user needs to identify project risks, perform sensitivity analysis, evaluate different scenarios, or calculate risk-adjusted returns."
---

# Sensitivity Analysis Process

## When to Use

- User needs to identify project risk factors
- User asks to perform sensitivity analysis
- User wants to evaluate different scenarios (optimistic, base, conservative)
- User needs to calculate risk-adjusted ROI
- User asks for risk management recommendations

## Sensitivity Analysis Process

### Step 1: Identify Key Variables

**Variable Categories**:

| Category | Typical Variables | Description |
|----------|------------------|-------------|
| **Cost** | Development cost, operation cost, other costs | Variables affecting project investment |
| **Benefit** | Direct benefit, indirect benefit, strategic benefit | Variables affecting project returns |
| **Time** | Go-live date, project duration | Variables affecting cash flow timing |
| **External** | Discount rate, inflation rate | Variables affecting capital cost |

**Identification Methods**:
1. Historical project experience
2. Similar project case studies
3. Expert interviews and brainstorming
4. Stakeholder feedback

### Step 2: Determine Variable Change Ranges

**Range Setting Principles**:

| Scenario | Change Range | Basis |
|----------|-------------|-------|
| Optimistic | -10% ~ +10% | Ideal situation |
| Base | 0% | Most likely situation |
| Conservative | -40% ~ +30% | Risk situation |

**Typical Change Ranges**:

| Variable Type | Pessimistic | Base | Optimistic |
|--------------|-------------|------|------------|
| Cost | +20%~+30% | 100% | -10% |
| Benefit | -30%~-40% | 100% | +10% |
| Time | Delay 3 months | On time | Advance 1 month |
| External | Unfavorable | Base | Favorable |

### Step 3: Single-Factor Sensitivity Analysis

**Analysis Method**:
Change one variable at a time while keeping others constant, observe impact on financial indicators.

**Analysis Steps**:
1. Select variable to analyze
2. Set variable change range
3. Calculate financial indicators at different change levels
4. Record analysis results

**Output Template**:

| Variable Change | Financial Indicator 1 | Financial Indicator 2 | ... |
|----------------|----------------------|----------------------|-----|
| -30% | | | |
| -20% | | | |
| -10% | | | |
| Base | | | |
| +10% | | | |
| +20% | | | |
| +30% | | | |

### Step 4: Calculate Sensitivity Coefficient

**Formula**:
```
Sensitivity Coefficient = (Financial Indicator Change Rate) / (Variable Change Rate)

Example:
Sensitivity = (NPV Change Rate) / (Variable Change Rate)
            = (New NPV - Original NPV) / Original NPV / Variable Change Rate
```

**Sensitivity Levels**:

| Sensitivity Coefficient (Absolute) | Level | Color |
|-----------------------------------|-------|-------|
| > 0.8 | High | 🔴 Red |
| 0.5 ~ 0.8 | Medium-High | 🟡 Yellow |
| 0.3 ~ 0.5 | Medium | 🟢 Green |
| < 0.3 | Low | ⚪ Gray |

### Step 5: Sensitivity Ranking

**Ranking Method**:
Sort by absolute value of sensitivity coefficient (descending)

**Output Formats**:
1. Sensitivity ranking table
2. Tornado diagram
3. Sensitivity matrix

### Step 6: Build Analysis Scenarios

**Scenario Settings**:

| Scenario | Probability | Characteristics | Purpose |
|----------|------------|-----------------|---------|
| Optimistic | 20% | All favorable factors occur | Upper bound assessment |
| Base | 60% | Most likely normal situation | Primary decision basis |
| Conservative | 20% | Major risk factors occur | Lower bound assessment |

**Scenario Parameter Settings**:

| Parameter | Optimistic | Base | Conservative |
|-----------|-----------|------|-------------|
| Cost adjustment | -10% | 100% | +20% |
| Benefit adjustment | +10% | 100% | -30% |
| Time adjustment | Advance 1 month | On time | Delay 2 months |

### Step 7: Scenario Analysis Calculation

**Calculation Content**:
1. Cost and benefit under each scenario
2. Financial indicators under each scenario (ROI, NPV, IRR)
3. Expected financial indicators (probability-weighted)

**Expected Financial Indicator Calculation**:
```
Expected Value = Σ(Scenario Value × Probability)

Example:
Expected NPV = NPV_optimistic×P_optimistic + NPV_base×P_base + NPV_conservative×P_conservative
```

### Step 8: Risk-Adjusted ROI

**Risk Adjustment Methods**:

1. **Certainty Equivalent Method**:
   ```
   Risk-Adjusted Benefit = Expected Benefit × Risk Adjustment Factor
   ```

2. **Risk-Adjusted Discount Rate Method**:
   ```
   Risk-Adjusted Discount Rate = Base Discount Rate + Risk Premium
   ```

3. **Probability-Weighted Method**:
   ```
   Risk-Adjusted ROI = (Risk-Adjusted Benefit - Risk-Adjusted Cost) / Risk-Adjusted Cost
   ```

**Risk Adjustment Factors**:

| Risk Level | Risk Adjustment Factor | Applicable Situation |
|-----------|----------------------|---------------------|
| Low risk | 0.95 | Mature technology, clear requirements |
| Low-Medium risk | 0.90 | Standard projects |
| Medium risk | 0.85 | General projects |
| Medium-High risk | 0.80 | Innovative projects |
| High risk | 0.75 | Breakthrough projects |

### Step 9: Develop Risk Management Recommendations

**Measures for High-Sensitivity Variables**:

| Sensitive Variable | Risk Measure | Responsible Party |
|-------------------|--------------|------------------|
| Strategic benefit | Establish tracking mechanism, regular assessment | PMO |
| Indirect benefit | Data quality monitoring, process optimization | Business department |
| Direct benefit | User training, feature optimization | Product team |

**General Risk Management Recommendations**:
1. Establish risk monitoring mechanism
2. Develop risk response plans
3. Regular risk assessment
4. Dynamic strategy adjustment

### Step 10: Compile Analysis Report

**Report Contents**:
1. Sensitivity variable identification results
2. Single-factor sensitivity analysis results
3. Sensitivity ranking and tornado diagram
4. Scenario analysis results
5. Risk-adjusted ROI
6. Risk management recommendations
7. Conclusions and investment recommendations

### Step 11: Review and Approval

**Review Checklist**:
- [ ] Variable identification complete
- [ ] Change ranges reasonable
- [ ] Calculations correct
- [ ] Sensitivity ranking correct
- [ ] Scenario settings reasonable
- [ ] Probability estimates reasonable
- [ ] Risk adjustment method reasonable
- [ ] Risk management recommendations feasible
- [ ] Conclusions consistent with data

**Approval Process**:
Preparer → Finance Lead Review → Project Sponsor Approval

## Key Formulas

### Sensitivity Coefficient

```
Sensitivity Coefficient = (Financial Indicator Change Rate) / (Variable Change Rate)

Where:
- Financial Indicator Change Rate = (New Value - Original Value) / Original Value
- Variable Change Rate = (New Variable Value - Original Variable Value) / Original Variable Value
```

### Expected Financial Indicator

```
Expected Value = Σ(Scenario Value × Probability)

Example:
Expected NPV = NPV_optimistic×P_optimistic + NPV_base×P_base + NPV_conservative×P_conservative
```

### Risk-Adjusted ROI

```
Risk-Adjusted ROI = (Risk-Adjusted Benefit - Risk-Adjusted Cost) / Risk-Adjusted Cost × 100%

Where:
- Risk-Adjusted Benefit = Expected Benefit × Risk Adjustment Factor
- Risk-Adjusted Cost = Expected Cost × (1 + Cost Risk Premium)
```

## Output Templates

### Sensitivity Analysis Table

| Variable | Change Range | NPV Change | IRR Change | Sensitivity Coefficient | Sensitivity Level |
|----------|-------------|-----------|-----------|------------------------|------------------|
| Variable A | -30%~+30% | | | | |
| Variable B | -30%~+30% | | | | |

### Scenario Analysis Table

| Scenario | Probability | Cost | Benefit | ROI | NPV | IRR |
|----------|------------|------|---------|-----|-----|-----|
| Optimistic | 20% | | | | | |
| Base | 60% | | | | | |
| Conservative | 20% | | | | | |
| Expected | 100% | | | | | |

### Risk-Adjusted Analysis Table

| Risk Level | Risk Adjustment Factor | Risk-Adjusted Benefit | Risk-Adjusted Cost | Risk-Adjusted ROI |
|-----------|----------------------|----------------------|-------------------|------------------|
| Low risk | 0.95 | | | |
| Medium risk | 0.85 | | | |
| High risk | 0.75 | | | |

## Quality Control

### Data Quality Requirements

- Variable identification must be comprehensive, covering all key factors
- Change range settings must have basis
- Scenario probability estimates must be reasonable

### Calculation Verification Requirements

- Sensitivity coefficient calculations must be verified
- Scenario analysis calculations must be cross-verified
- Risk-adjusted calculations must be reasonableness-checked

## Related Documents

- Sensitivity Variable Analysis (SYS-PI-BC-011)
- Scenario Analysis (SYS-PI-BC-012)
- Risk-Adjusted ROI (SYS-PI-BC-013)
- NPV Analysis (SYS-PI-BC-009)
- IRR Analysis (SYS-PI-BC-010)
