# Benefit Analysis Process Skill

**Skill名称**: benefit-analysis-process  
**创建日期**: 2026-03-13  
**版本**: 1.0  
**用途**: 指导收益分析流程

---

## Skill内容备份

```markdown
---
name: "benefit-analysis-process"
description: "Guides the benefit analysis process for business case development including direct benefits, indirect benefits, and strategic benefits analysis. Invoke when user needs to conduct benefit analysis, create benefit analysis documents, or evaluate project ROI."
---

# Benefit Analysis Process

This skill guides the benefit analysis process for System基础平台 projects, helping to identify, quantify, and document project benefits for business case development.

## When to Use

- User needs to conduct benefit analysis for a project
- User asks to create benefit analysis documents
- User needs to evaluate project ROI or benefits
- User wants to analyze efficiency gains or cost savings
- User asks for help with direct/indirect/strategic benefits

## Benefit Types

### 1. Direct Benefits (直接收益)

**Definition**: Quantifiable financial benefits that can be directly measured

**Categories**:
- **Efficiency Gains**: Time savings from improved processes
- **Cost Savings**: Reduction in operational costs
- **Labor Savings**: Reduction in headcount or labor hours

**Calculation Formula**:
```
Annual Savings = Monthly Occurrences × Time Saved per Occurrence × Labor Cost × 12
```

**Key Metrics**:
- User management efficiency
- Permission application efficiency
- Password reset efficiency
- IT operations labor savings

### 2. Indirect Benefits (间接收益)

**Definition**: Benefits that are difficult to quantify directly but provide significant value

**Categories**:
- **Data Quality**: Improved data consistency and accuracy
- **Management Efficiency**: Better organizational management
- **Employee Experience**: Improved user satisfaction
- **Technical Architecture**: Reduced system maintenance costs

**Assessment Methods**:
- Comparative analysis
- Expert evaluation
- Historical data reference

### 3. Strategic Benefits (战略收益)

**Definition**: Long-term strategic benefits that support business objectives

**Categories**:
- **Digital Transformation**: Foundation for digital initiatives
- **Organizational Capability**: Improved IT governance and agility
- **Competitive Advantage**: Technology leadership and efficiency
- **Risk Management**: Reduced security and operational risks
- **Ecosystem Building**: Platform for future system integration

## Analysis Process

### Step 1: Collect Baseline Data

**Required Data**:
- Current system user count
- Monthly new hire/termination numbers
- Monthly permission change requests
- Monthly password reset requests
- Current IT operations staffing
- Labor cost rates

**Data Sources**:
- HR systems
- IT service desk records
- System usage logs
- Financial records

### Step 2: Identify Benefit Types

**For Internal Systems** (like System基础平台):
- Focus on efficiency gains and cost savings
- Exclude revenue/sales benefits
- Include risk reduction benefits
- Consider long-term strategic value

**Checklist**:
- [ ] User management efficiency gains
- [ ] Permission management efficiency gains
- [ ] Password reset efficiency gains
- [ ] IT operations labor savings
- [ ] Data quality improvements
- [ ] Security risk reductions
- [ ] Compliance benefits
- [ ] Strategic positioning benefits

### Step 3: Quantify Direct Benefits

**Template for Each Benefit Item**:

```markdown
### [Benefit Name]

**Current State**:
- Problem description
- Current process time/cost

**Future State**:
- Improved process description
- New process time/cost

**Calculation**:

| Metric | Value |
|--------|-------|
| Monthly occurrences | XX |
| Original time | XX hours |
| New time | XX hours |
| Time saved | XX hours |
| Labor cost | XX yuan/hour |
| Monthly savings | XX yuan |
| Annual savings | XX yuan |
```

### Step 4: Evaluate Indirect Benefits

**Assessment Framework**:

| Benefit Category | Assessment Method | Value Range |
|-----------------|-------------------|-------------|
| Data Quality | Error reduction estimate | 10-50万/年 |
| Management Efficiency | Time savings estimate | 5-20万/年 |
| Employee Experience | Satisfaction improvement | Hard to quantify |
| Technical Architecture | Maintenance cost reduction | 20-50万/年 |

### Step 5: Analyze Strategic Benefits

**Key Areas**:
1. **Digital Transformation Support**
   - Unified user/permission/organization management
   - Foundation for digital initiatives
   - Data-driven decision making

2. **Organizational Capability**
   - IT governance maturity improvement
   - Standardization of system development
   - Resource utilization efficiency

3. **Competitive Advantages**
   - Technology leadership
   - Operational efficiency
   - Cost leadership

4. **Risk Management**
   - Security risk reduction
   - Compliance improvement
   - Business continuity

5. **Ecosystem Development**
   - Platform for system integration
   - Scalability for future growth
   - Long-term sustainability

### Step 6: Summarize Benefits

**Summary Table**:

| Benefit Type | Annual Benefit (10k yuan) | 3-Year Total (10k yuan) |
|-------------|---------------------------|-------------------------|
| Direct Benefits | XX | XX |
| Indirect Benefits | XX | XX |
| Strategic Benefits | XX | XX |
| **Total** | **XX** | **XX** |

### Step 7: Risk Assessment

**Risk Categories**:
- User adoption risk
- System stability risk
- Implementation delay risk
- Organizational change resistance

**Adjustment Factors**:
| Scenario | Adjustment Factor |
|-----------|-------------------|
| Optimistic | 100% |
| Baseline | 75-85% |
| Conservative | 50-70% |

### Step 8: Document Creation

**Required Documents**:
1. **Direct Benefit Analysis** (04-benefit-direct.md)
   - Efficiency gain calculations
   - Labor savings calculations
   - Annual benefit summary

2. **Indirect Benefit Analysis** (05-benefit-indirect.md)
   - Data quality improvements
   - Management efficiency gains
   - Employee experience improvements
   - Technical architecture benefits

3. **Strategic Benefit Analysis** (06-benefit-strategic.md)
   - Digital transformation support
   - Organizational capability building
   - Competitive advantage analysis
   - Risk management improvements
   - Ecosystem development

## Document Templates

### Direct Benefit Analysis Template

```markdown
# Direct Benefit Analysis

## 1. Efficiency Gain Benefits

### 1.1 [Process Name] Efficiency Gain

**Current Problems**:
- Problem 1
- Problem 2

**After Improvement**:
- Improvement 1
- Improvement 2

**Benefit Calculation**:

| Metric | Value |
|--------|-------|
| Monthly occurrences | XX |
| Original processing time | XX hours |
| New processing time | XX hours |
| Time saved | XX hours |
| Labor cost | XX yuan/hour |
| Monthly savings | XX yuan |
| Annual savings | XX yuan |

## 2. Labor Savings Benefits

### 2.1 [Role] Labor Savings

**Current State**:
- Current staffing level

**Future State**:
- Reduced staffing level

**Benefit Calculation**:

| Metric | Value |
|--------|-------|
| Labor reduction | XX people |
| Annual cost per person | XX yuan |
| Annual savings | XX yuan |

## 3. Direct Benefit Summary

| Benefit Category | Annual Benefit (10k yuan) |
|-----------------|---------------------------|
| Efficiency Gains | XX |
| Labor Savings | XX |
| **Total** | **XX** |
```

### Indirect Benefit Analysis Template

```markdown
# Indirect Benefit Analysis

## 1. [Benefit Category]

### 1.1 Current Problems
- Problem 1
- Problem 2

### 1.2 After Improvement
- Improvement 1
- Improvement 2

### 1.3 Benefit Assessment

| Benefit Item | Description | Estimated Value |
|-------------|-------------|-----------------|
| Benefit 1 | Description | XX 10k yuan/year |
| Benefit 2 | Description | Hard to quantify |

## 2. Indirect Benefit Summary

| Benefit Category | Annual Benefit (10k yuan) |
|-----------------|---------------------------|
| [Category 1] | XX |
| [Category 2] | XX |
| **Total** | **XX** |
```

### Strategic Benefit Analysis Template

```markdown
# Strategic Benefit Analysis

## 1. [Strategic Area]

### 1.1 Strategic Value
- Value description

### 1.2 Benefit Assessment

| Benefit Item | Description | Value |
|-------------|-------------|-------|
| Benefit 1 | Description | XX 10k yuan/year |
| Benefit 2 | Description | High strategic value |

## 2. Strategic Benefit Summary

| Benefit Category | Strategic Value Level |
|-----------------|----------------------|
| [Category 1] | ⭐⭐⭐⭐⭐ |
| [Category 2] | ⭐⭐⭐⭐ |
```

## Quality Checklist

### Data Quality Checks
- [ ] Baseline data is accurate and reliable
- [ ] Calculation formulas are correct
- [ ] Assumptions are reasonable and documented
- [ ] Benefit coverage is complete
- [ ] Risks are fully assessed

### Common Mistakes to Avoid
- [ ] Don't calculate sales/revenue for internal systems
- [ ] Avoid double-counting benefits
- [ ] Don't be overly optimistic (use conservative estimates)
- [ ] Don't ignore risk factors
- [ ] Don't miss significant benefit categories

## Example Calculations

### Example 1: Permission Application Efficiency

**Baseline**:
- Monthly permission applications: 200
- Original processing time: 4 hours
- New processing time: 1 hour
- Time saved: 3 hours
- Approver cost: 80 yuan/hour

**Calculation**:
```
Monthly savings = 200 × 3 × 80 = 48,000 yuan
Annual savings = 48,000 × 12 = 576,000 yuan
```

### Example 2: IT Operations Labor Savings

**Baseline**:
- Current IT operations staff: 5 people
- Future IT operations staff: 3 people
- Labor reduction: 2 people
- Annual cost per person: 250,000 yuan

**Calculation**:
```
Annual savings = 2 × 250,000 = 500,000 yuan
```

## Reference Documents

- Benefit Analysis Process Standard (SYS-PI-BC-PS-002)
- Direct Benefit Analysis Template (04-benefit-direct.md)
- Indirect Benefit Analysis Template (05-benefit-indirect.md)
- Strategic Benefit Analysis Template (06-benefit-strategic.md)

## Approval Process

1. **Preparation**: Product Manager
2. **Review**: Finance Manager / Strategy Manager
3. **Approval**: Project Sponsor

## Output Deliverables

1. Direct Benefit Analysis Document
2. Indirect Benefit Analysis Document
3. Strategic Benefit Analysis Document
4. Benefit Summary Report
5. Risk Assessment Report
```

---

## 使用说明

此Skill已导入到 `.trae/skills/benefit-analysis-process/SKILL.md`

当用户需要进行收益分析时，系统会自动调用此Skill。

## 创建记录

| 项目 | 内容 |
|-----|------|
| 创建日期 | 2026-03-13 |
| 创建人 | 产品经理 |
| 版本 | 1.0 |
| 对应流程标准 | SYS-PI-BC-PS-002 |
