---
name: "stakeholder-analysis-process"
description: "Guides the stakeholder analysis process for requirements analysis. Invoke when user needs to identify stakeholders, analyze their interests and influence, or create stakeholder management documentation."
---

# Stakeholder Analysis Process Skill

## Overview

This skill guides you through a systematic stakeholder analysis process to identify all parties affected by or interested in the project, understand their needs and expectations, and develop appropriate management strategies.

## When to Use

- Starting a new project and need to identify all stakeholders
- Planning project communication and engagement strategies
- Managing stakeholder expectations and relationships
- Creating stakeholder management documentation
- Preparing for project kickoff or major decisions

## Analysis Process

### Step 1: Identify Stakeholders

**Objective:** Identify all internal and external stakeholders.

**Actions:**
1. Review organizational structure
2. Analyze business processes to identify participants
3. Review existing documentation and interview records
4. Identify external parties (vendors, partners, customers)

**Output:** `01-stakeholder-identification.md`

**Template:**
```markdown
# 干系人识别

## 一、干系人清单

### 1.1 内部干系人

#### 决策层
| 姓名 | 职位 | 部门 | 角色 |
|-----|------|------|------|

#### 管理层
| 姓名 | 职位 | 部门 | 角色 |
|-----|------|------|------|

#### 执行层
| 姓名 | 职位 | 部门 | 角色 |
|-----|------|------|------|

#### 最终用户
| 用户群体 | 人数 | 使用场景 |
|---------|------|---------|

### 1.2 外部干系人
| 姓名/组织 | 类型 | 角色 |
|----------|------|------|

## 二、干系人分类

### 2.1 按影响程度分类
| 影响程度 | 干系人 |
|---------|-------|
| **高影响** | |
| **中影响** | |
| **低影响** | |

### 2.2 按支持程度分类
| 支持程度 | 干系人 |
|---------|-------|
| **积极支持** | |
| **支持** | |
| **中立** | |
| **潜在抵触** | |

## 三、关键干系人

| 序号 | 干系人 | 关键作用 |
|-----|-------|---------|
```

---

### Step 2: Analyze Interests and Influence

**Objective:** Understand stakeholder interests, concerns, and influence levels.

**Actions:**
1. Analyze stakeholder interests and expectations
2. Identify stakeholder concerns and pain points
3. Assess stakeholder influence (power/authority)
4. Assess stakeholder interest (stake in project)
5. Identify potential conflicts

**Output:** `02-stakeholder-analysis.md`

**Key Analysis Areas:**
- **Interests:** What does the stakeholder want from the project?
- **Influence:** How much power does the stakeholder have?
- **Impact:** How much will the project affect the stakeholder?
- **Support Level:** Is the stakeholder supportive, neutral, or resistant?
- **Communication Needs:** What information does the stakeholder need?

**Analysis Framework:**
```
For each stakeholder:
- Interests (利益诉求)
- Concerns (关注点)
- Expected Benefits (期望收益)
- Influence Level (影响力)
- Interest Level (利益相关度)
- Support Level (支持程度)
- Potential Resistance (潜在抵触)
```

---

### Step 3: Create Influence-Interest Matrix

**Objective:** Map stakeholders based on influence and interest levels.

**Actions:**
1. Plot stakeholders on Influence-Interest matrix
2. Define management strategy for each quadrant
3. Identify key stakeholders requiring special attention

**Influence-Interest Matrix:**
```
                    影响力
              低 ◄─────────────────► 高
              │                      │
         高   │   保持满意       重点管理   │
    利        │                      │
    益   ─────┼──────────────────────┼─────
    相          │                      │
    关   低   │   最少努力       保持知情   │
    度          │                      │
              │                      │
              └──────────────────────┘
```

**Management Strategies:**
- **重点管理 (High Influence + High Interest):** Close management, frequent engagement
- **保持满意 (Low Influence + High Interest):** Keep satisfied, regular updates
- **保持知情 (High Influence + Low Interest):** Keep informed, monitor
- **最少努力 (Low Influence + Low Interest):** Minimum effort, occasional updates

---

### Step 4: Develop Communication Strategy

**Objective:** Create tailored communication plans for different stakeholders.

**Actions:**
1. Define communication content for each stakeholder
2. Determine communication frequency
3. Select appropriate communication channels
4. Assign communication owners

**Output:** `03-stakeholder-register.md` (includes communication plan)

**Communication Plan Template:**
```markdown
| 干系人 | 沟通内容 | 沟通频率 | 沟通方式 | 负责人 |
|-------|---------|---------|---------|--------|
```

---

### Step 5: Generate Stakeholder Register

**Objective:** Compile comprehensive stakeholder register with all information.

**Actions:**
1. Create stakeholder register with all details
2. Document communication plans
3. Define engagement strategies
4. Track stakeholder participation

**Output:** `03-stakeholder-register.md`

**Register Structure:**
```markdown
# 干系人登记册

## 一、干系人登记册

### 1.1 核心干系人
| 编号 | 姓名 | 职位 | 部门 | 角色 | 影响力 | 利益相关度 | 支持程度 | 管理策略 |

### 1.2 重要干系人
| 编号 | 姓名 | 职位 | 部门 | 角色 | 影响力 | 利益相关度 | 支持程度 | 管理策略 |

### 1.3 一般干系人
| 编号 | 姓名/群体 | 职位/类型 | 部门 | 角色 | 影响力 | 利益相关度 | 支持程度 | 管理策略 |

### 1.4 外部干系人
| 编号 | 组织名称 | 类型 | 角色 | 影响力 | 利益相关度 | 管理策略 |

## 二、干系人详细信息
| 属性 | 内容 |
|-----|------|
| **职位** | |
| **角色** | |
| **影响力** | |
| **主要诉求** | |
| **关注点** | |
| **管理策略** | |
| **沟通频率** | |

## 三、干系人沟通计划
| 干系人 | 沟通内容 | 沟通频率 | 沟通方式 | 负责人 |

## 四、干系人参与跟踪
| 干系人 | 需求访谈 | 方案评审 | UAT测试 | 培训参与 | 满意度 |
```

---

## Document Checklist

| Step | Document | Status |
|-----|---------|--------|
| 1 | 干系人识别 | ⬜ |
| 2 | 干系人分析 | ⬜ |
| 3 | 影响力评估 | ⬜ |
| 4 | 沟通策略 | ⬜ |
| 5 | 干系人登记册 | ⬜ |

---

## Best Practices

1. **Be Comprehensive:** Don't overlook any potential stakeholders
2. **Be Objective:** Assess influence and interest objectively
3. **Be Proactive:** Identify potential resistance early
4. **Be Flexible:** Stakeholder positions may change over time
5. **Be Communicative:** Regular communication builds trust

---

## Common Pitfalls to Avoid

- ❌ Focusing only on obvious stakeholders
- ❌ Ignoring informal influencers
- ❌ Underestimating potential resistance
- ❌ One-size-fits-all communication approach
- ❌ Not updating stakeholder analysis regularly

---

## Output Location

All stakeholder analysis documents should be stored in:
```
<project-path>/docs/XX-project-phase/XX-requirements-analysis/04-stakeholder-analysis/
```

---

**Skill Version:** 1.0  
**Last Updated:** 2026-03-08  
**Applicable Phase:** Requirements Analysis
