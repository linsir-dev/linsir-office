---
name: "competitor-analysis-process"
description: "Guides the competitor analysis process for requirements analysis. Invoke when user needs to conduct competitor analysis, analyze competitor products, or create competitor analysis documentation."
---

# Competitor Analysis Process Skill

## Overview

This skill guides you through a systematic competitor analysis process to understand market landscape, identify competitive advantages, and extract valuable insights for product development.

## When to Use

- Starting a new product and need to understand the competitive landscape
- Planning features and want to learn from competitors
- Creating product strategy documents
- Conducting market research
- Preparing for product positioning

## Analysis Process

### Step 1: Determine Competitor Scope

**Objective:** Identify direct and indirect competitors to analyze.

**Actions:**
1. Identify direct competitors (similar products, same target market)
2. Identify indirect competitors (alternative solutions)
3. Document competitor basic information

**Output:** `01-competitor-scope.md`

**Template:**
```markdown
# 竞品范围确定

## 一、分析目标

## 二、竞品范围

### 2.1 直接竞品

| 竞品名称 | 厂商 | 定位 | 核心功能 | 市场占有率 |
|---------|------|------|---------|-----------|

### 2.2 间接竞品

| 竞品名称 | 厂商 | 定位 | 相关功能 | 参考价值 |
|---------|------|------|---------|---------|

## 三、分析维度

## 四、信息来源
```

---

### Step 2: Analyze Core Functions

**Objective:** Compare core features across competitors.

**Actions:**
1. Analyze organization management features
2. Analyze user management features
3. Analyze permission management features
4. Analyze system integration capabilities
5. Analyze user experience

**Output:** `02-core-function-analysis.md`

**Key Comparison Areas:**
- Organization Management (structure, departments, roles)
- User Management (lifecycle, authentication, status)
- Permission Management (RBAC, data permissions, field permissions)
- System Integration (SSO, APIs, application ecosystem)
- User Experience (interface, interaction, mobile support)

---

### Step 3: Analyze Pros and Cons

**Objective:** Identify strengths and weaknesses of each competitor.

**Actions:**
1. List competitor advantages
2. List competitor disadvantages
3. Identify differentiation opportunities
4. Define product positioning

**Output:** `03-competitor-pros-cons.md`

**Analysis Framework:**
```
For each competitor:
- Advantages (功能、体验、生态、技术)
- Disadvantages (复杂度、定制化、安全、学习成本)
- Differentiation opportunities
```

---

### Step 4: Extract Lessons Learned

**Objective:** Identify valuable features and practices to learn from.

**Actions:**
1. List features worth learning from each competitor
2. Prioritize by importance (P0/P1/P2/P3)
3. Document implementation suggestions

**Output:** `04-lessons-learned.md`

**Priority Levels:**
- **P0 (Must Have):** Core competitive features
- **P1 (Should Have):** Important differentiators
- **P2 (Nice to Have):** Enhancement features
- **P3 (Future Consideration):** Innovative features

---

### Step 5: Generate Analysis Report

**Objective:** Compile comprehensive competitor analysis report.

**Actions:**
1. Write executive summary
2. Document competitor profiles
3. Present function comparisons
4. Provide strategic recommendations
5. Define competitive positioning

**Output:** `05-competitor-analysis-report.md`

**Report Structure:**
```markdown
# 竞品分析报告

## 一、执行摘要
## 二、竞品概况
## 三、功能对比分析
## 四、竞品优缺点分析
## 五、可借鉴功能点
## 六、竞争策略建议
## 七、风险与应对
## 八、结论与建议
## 九、附录
```

---

## Document Checklist

| Step | Document | Status |
|-----|---------|--------|
| 1 | 竞品范围确定 | ⬜ |
| 2 | 核心功能分析 | ⬜ |
| 3 | 优缺点分析 | ⬜ |
| 4 | 可借鉴功能点 | ⬜ |
| 5 | 竞品分析报告 | ⬜ |

---

## Best Practices

1. **Be Objective:** Analyze based on facts, not opinions
2. **Focus on Users:** Always consider user needs and pain points
3. **Look Beyond Features:** Consider ecosystem, pricing, and support
4. **Identify Gaps:** Find opportunities competitors are missing
5. **Stay Current:** Competitor landscape changes rapidly

---

## Common Pitfalls to Avoid

- ❌ Copying features without understanding user needs
- ❌ Focusing only on direct competitors
- ❌ Ignoring market trends and emerging players
- ❌ Analysis paralysis - too much detail, no action
- ❌ Not updating analysis regularly

---

## Output Location

All competitor analysis documents should be stored in:
```
<project-path>/docs/XX-project-phase/XX-requirements-analysis/03-competitor-analysis/
```

---

**Skill Version:** 1.0  
**Last Updated:** 2026-03-08  
**Applicable Phase:** Requirements Analysis
