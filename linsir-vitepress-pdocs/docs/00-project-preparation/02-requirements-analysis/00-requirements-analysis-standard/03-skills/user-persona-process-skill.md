---
name: "user-persona-process"
description: "Guides the user persona creation process to define user roles, analyze usage scenarios, map user journeys, and identify pain points. Invoke when user needs to create user personas, analyze user behaviors, or understand user needs for product design."
---

# User Persona Process Skill

## Overview

This skill guides you through a systematic user persona creation process to understand your users deeply, including their roles, behaviors, pain points, and expectations.

## When to Use

- Defining user roles for a product or system
- Analyzing user usage scenarios and behaviors
- Creating user journey maps
- Identifying user pain points and expectations
- Building comprehensive user personas for design reference

## Persona Creation Process

### Step 1: Define User Roles

**Objective:** Identify and define all user roles who will use the system.

**Actions:**
1. Review business requirements and stakeholder analysis
2. Identify distinct user types based on responsibilities
3. Define role attributes (permissions, scope, frequency)
4. Create typical user profiles for each role
5. Document role relationships and hierarchy

**Output:** `01-user-roles.md`

**Template:**
```markdown
# 用户角色定义

## 一、角色识别
| 角色编号 | 角色名称 | 描述 | 数量 | 频率 |

## 二、角色详细定义
### 2.1 [Role Name]
**基本信息:**
| 属性 | 描述 |

**职责描述:**
- [Responsibility 1]
- [Responsibility 2]

**权限范围:**
- [Permission 1]
- [Permission 2]

**典型用户:**
- 姓名, 职位, 部门, 工作年限, 技术能力

## 三、角色关系图
## 四、角色权限矩阵
## 五、角色使用统计
```

---

### Step 2: Analyze Usage Scenarios

**Objective:** Document typical scenarios for each user role.

**Actions:**
1. Identify key tasks for each role
2. Define scenario triggers and frequency
3. Document step-by-step workflows
4. Identify pain points in each scenario
5. Capture user expectations

**Output:** `02-usage-scenarios.md`

**Scenario Format:**
```markdown
### Scenario X: [Scenario Name]

**Scenario Description:**
- **Trigger:** What starts this scenario
- **Roles:** Who is involved
- **Frequency:** How often it occurs
- **Value:** Why it matters

**Usage Flow:**
1. Step 1
   └── Sub-step
2. Step 2

**Pain Points:**
- [Pain 1]
- [Pain 2]

**Expectations:**
- [Expectation 1]
- [Expectation 2]
```

---

### Step 3: Create User Journey Maps

**Objective:** Visualize the user experience across touchpoints.

**Actions:**
1. Define journey stages (Discover, Login, Use, Exit)
2. Map user actions at each stage
3. Identify touchpoints (pages, systems)
4. Plot emotion curve
5. Highlight pain points and opportunities

**Output:** `03-user-journey-map.md`

**Journey Map Elements:**
- **Stages:** Phases of the journey
- **Actions:** What users do
- **Touchpoints:** Interface elements
- **Emotions:** User feelings (😊 😐 😫)
- **Pain Points:** Friction areas
- **Opportunities:** Improvement ideas

---

### Step 4: Identify Pain Points and Expectations

**Objective:** Systematically capture user frustrations and desires.

**Actions:**
1. Collect pain points from interviews and scenarios
2. Categorize by impact and frequency
3. Map pain points to user expectations
4. Prioritize based on business value
5. Link to functional requirements

**Output:** `04-pain-points-expectations.md`

**Pain Point Format:**
```markdown
| ID | Description | Source | Impact | Frequency |
|----|-------------|--------|--------|-----------|
| P-001 | [Description] | Interview | High | Daily |
```

**Expectation Format:**
```markdown
| ID | Description | Value | Priority |
|----|-------------|-------|----------|
| E-001 | [Description] | High | P0 |
```

---

### Step 5: Create User Persona Document

**Objective:** Create comprehensive, visual user personas.

**Actions:**
1. Synthesize all research into persona cards
2. Include demographics, goals, behaviors
3. Add quotes and personality traits
4. Document pain points and expectations
5. Include device and usage preferences

**Output:** `05-user-persona-document.md`

**Persona Card Template:**
```markdown
### Persona: [Name]

```
┌─────────────────────────────────────┐
│  📷 [Avatar]                        │
│                                     │
│  基本信息                            │
│  ├── 姓名：[Name]                   │
│  ├── 职位：[Title]                  │
│  ├── 部门：[Department]             │
│  └── 技术能力：[Level]              │
│                                     │
│  工作目标                            │
│  ├── [Goal 1]                       │
│  └── [Goal 2]                       │
│                                     │
│  典型语录                            │
│  ├── "[Quote 1]"                   │
│  └── "[Quote 2]"                   │
│                                     │
│  痛点                                │
│  ├── [Pain 1]                       │
│  └── [Pain 2]                       │
│                                     │
│  期望                                │
│  ├── [Expectation 1]                │
│  └── [Expectation 2]                │
│                                     │
│  设备偏好                            │
│  └── [Device preferences]           │
└─────────────────────────────────────┘
```
```

---

## Document Naming Convention

| Step | Document | Code |
|-----|---------|------|
| 1 | 用户角色定义 | SYS-RA-UP-001 |
| 2 | 用户使用场景分析 | SYS-RA-UP-002 |
| 3 | 用户旅程图 | SYS-RA-UP-003 |
| 4 | 用户痛点和期望分析 | SYS-RA-UP-004 |
| 5 | 用户画像文档 | SYS-RA-UP-005 |

---

## Quality Checklist

- [ ] All stakeholders are represented as user roles
- [ ] Scenarios cover primary user tasks
- [ ] Journey maps include emotion curves
- [ ] Pain points are prioritized by impact
- [ ] Personas feel like real people
- [ ] Personas are based on actual research
- [ ] Each persona has distinct characteristics

---

## Best Practices

1. **Base on research** - Use interview data, not assumptions
2. **Keep it real** - Personas should feel like real people
3. **Focus on behaviors** - Not just demographics
4. **Limit the number** - 3-5 personas is usually enough
5. **Make them visual** - Use images and formatting
6. **Share widely** - Ensure team references personas
7. **Keep updated** - Refresh as you learn more

---

## Common Pitfalls

- **Too many personas** - Focus on primary users
- **Too generic** - Include specific details
- **Based on assumptions** - Always validate with research
- **Ignored after creation** - Reference in design decisions
- **Never updated** - Refresh periodically
