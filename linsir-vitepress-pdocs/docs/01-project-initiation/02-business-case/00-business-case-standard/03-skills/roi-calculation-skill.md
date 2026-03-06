# ROI Calculation Process Skill

**Skill名称**: roi-calculation-process  
**创建日期**: 2026-03-13  
**版本**: 1.0  
**用途**: 指导ROI计算和投资回收期分析流程

---

## Skill内容备份

```markdown
---
name: "roi-calculation-process"
description: "Guides the ROI calculation and payback period analysis process for business case development. Invoke when user needs to calculate ROI, analyze investment payback period, or evaluate project financial feasibility."
---

# ROI Calculation Process

This skill guides the ROI calculation and payback period analysis process for System基础平台 projects, helping to evaluate project financial feasibility and investment returns.

## When to Use

- User needs to calculate ROI for a project
- User asks to analyze investment payback period
- User needs to evaluate project financial feasibility
- User wants to perform sensitivity analysis on ROI
- User asks for help with investment decision analysis

## ROI Calculation Process

### Step 1: Collect Cost Data

**Required Data**:
- Development cost (including risk reserve)
- Operation cost (by year)
- Other costs (training, migration, management)

**Data Sources**:
- Development cost analysis document
- Operation cost analysis document
- Other cost analysis document

**Output**:
- Cost summary table

### Step 2: Collect Benefit Data

**Required Data**:
- Direct benefits (efficiency gains, labor savings)
- Indirect benefits (quantifiable portion)
- Strategic benefits (quantifiable portion)

**Data Sources**:
- Direct benefit analysis document
- Indirect benefit analysis document
- Strategic benefit analysis document

**Output**:
- Benefit summary table

### Step 3: Calculate Total Investment Cost

**Formula**:
```
Total Investment Cost = Development Cost + Operation Cost (years) + Other Costs
```

### Step 4: Calculate Total Benefits

**Formula**:
```
Total Benefits = Direct Benefits + Indirect Benefits + Strategic Benefits
```

**Year 1 Benefit Adjustment**:
- System typically goes live mid-year
- Year 1 benefits should be discounted (50-70% of annual)
- Conservative: 50%
- Baseline: 60%
- Optimistic: 70%

### Step 5: Calculate Base ROI

**ROI Formula**:
```
ROI = (Total Benefits - Total Cost) / Total Cost × 100%
```

### Step 6: Scenario Analysis

**Scenario Definition**:

| Scenario | Description | Benefit Adjustment | Cost Adjustment |
|----------|-------------|-------------------|-----------------|
| Optimistic | Exceeds expectations | 100% | 100% |
| Baseline | Meets expectations | 85% | 100% |
| Conservative | Below expectations | 70% | 110% |

### Step 7: Sensitivity Analysis

**Key Variables**:
- Direct benefit variation
- Indirect benefit variation
- Strategic benefit variation
- Development cost variation
- Operation cost variation

### Step 8: Calculate Payback Period

**Static Payback Period**:
```
Static Payback = Year when cumulative cash flow turns positive - 1 + 
                 |Previous year cumulative cash flow| / Current year net cash flow
```

**Dynamic Payback Period (with discounting)**:
```
Discounted Cash Flow = Future Cash Flow / (1 + Discount Rate)^n
Dynamic Payback = Time when cumulative discounted cash flow turns positive
```

**Discount Rate Selection**:
- Typically 8-12%
- Recommend 10% as baseline

### Step 9: Compare with Industry Benchmarks

**IT Project ROI Benchmarks**:
| Project Type | Typical ROI Range | Excellent ROI |
|--------------|-------------------|---------------|
| Internal System | 50%-150% | >150% |
| Infrastructure | 30%-100% | >100% |
| Digital Transformation | 100%-300% | >250% |

### Step 10: Document Creation

**Required Documents**:
1. ROI Calculation (07-roi-calculation.md)
2. Payback Period Analysis (08-payback-period.md)

## ROI Calculation Methods

### Base ROI Calculation

**Formula**:
```
ROI = (Total Benefits - Total Cost) / Total Cost × 100%
```

### Annual ROI Calculation

**Formula**:
```
Annual ROI = (Annual Benefits - Annual Cost) / Annual Cost × 100%
```

### Cumulative ROI Calculation

**Formula**:
```
Cumulative ROI = (Cumulative Benefits - Cumulative Cost) / Cumulative Cost × 100%
```

## Payback Period Calculation Methods

### Static Payback Period

**Formula**:
```
Static Payback = Year - 1 + |Previous Year Cumulative| / Current Year Net Cash Flow
```

### Dynamic Payback Period

**Formula**:
```
Discounted Cash Flow = Future Cash Flow / (1 + Discount Rate)^n
```

## Quality Checklist

### Data Quality Checks
- [ ] Cost data matches cost analysis documents
- [ ] Benefit data matches benefit analysis documents
- [ ] Year 1 benefits properly adjusted for go-live timing
- [ ] All cost categories included
- [ ] All benefit categories included

### Calculation Quality Checks
- [ ] ROI formula applied correctly
- [ ] Payback period calculation correct
- [ ] Discount rate selection justified
- [ ] Scenario analysis covers all major risks
- [ ] Sensitivity analysis identifies key variables

## Common Mistakes to Avoid

| Mistake | Incorrect | Correct |
|---------|-----------|---------|
| Cost omission | Excluding operation costs | Include full lifecycle costs |
| Benefit overestimation | Year 1 at 100% | Discount Year 1 (50-70%) |
| Calculation error | Wrong formula | Use standard ROI formula |
| Incomplete scenarios | Only optimistic | Include optimistic, baseline, conservative |
| Missing sensitivity | No sensitivity analysis | Include sensitivity matrix |

## Reference Documents

- ROI Calculation Process Standard (SYS-PI-BC-PS-003)
- ROI Calculation Document (07-roi-calculation.md)
- Payback Period Analysis Document (08-payback-period.md)

## Approval Process

1. **Preparation**: Product Manager
2. **Review**: Finance Manager
3. **Approval**: Project Sponsor

## Output Deliverables

1. ROI Calculation Document
2. Payback Period Analysis Document
3. Cost Summary Report
4. Benefit Summary Report
5. Scenario Analysis Report
6. Sensitivity Analysis Report
```

---

## 使用说明

此Skill已导入到 `.trae/skills/roi-calculation-process/SKILL.md`

当用户需要进行ROI计算时，系统会自动调用此Skill。

## 创建记录

| 项目 | 内容 |
|-----|------|
| 创建日期 | 2026-03-13 |
| 创建人 | 产品经理 |
| 版本 | 1.0 |
| 对应流程标准 | SYS-PI-BC-PS-003 |
