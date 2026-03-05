---
name: "business-process-refinement-process"
description: "Guides the business process refinement process to detail core workflows, identify exceptions, define business rules, and create flow diagrams. Invoke when user needs to refine business processes, document workflows, or create process specifications."
---

# Business Process Refinement Process Skill

## Overview

This skill guides you through a systematic business process refinement process to document, analyze, and optimize business workflows for system implementation.

## When to Use

- Detailing core business processes from user stories
- Identifying exception flows and edge cases
- Defining business rules and constraints
- Creating process flow diagrams
- Documenting complete business process specifications

## Refinement Process

### Step 1: Detail Core Business Processes

**Objective:** Document the main business workflows in detail.

**Actions:**
1. Identify core processes from user stories and scenarios
2. Define process metadata (trigger, participants, goal)
3. Document step-by-step workflow
4. Define inputs and outputs for each step
5. Specify processing time and SLAs

**Output:** `01-core-business-process/[process-name].md`

**Process Document Template:**
```markdown
# [Process Name]

## 一、流程概述
### 1.1 流程基本信息
| 属性 | 描述 |
|-----|------|
| 流程名称 | [Name] |
| 流程编号 | [Code] |
| 触发条件 | [Trigger] |
| 主要参与者 | [Participants] |

### 1.2 流程目标
- [Goal 1]
- [Goal 2]

## 二、流程图
[Flowchart]

## 三、流程步骤详细说明
### 步骤X: [Step Name]
| 属性 | 描述 |
|-----|------|
| 步骤编号 | SX |
| 执行角色 | [Role] |
| 输入 | [Input] |
| 输出 | [Output] |

## 四、异常流程
## 五、业务规则汇总
## 六、流程指标
```

---

### Step 2: Identify Exception Processes

**Objective:** Document exception flows and boundary cases.

**Actions:**
1. Identify potential failure points in core processes
2. Define exception scenarios
3. Document handling procedures for each exception
4. Define escalation paths
5. Document boundary conditions and limits

**Output:** `02-exception-processes.md`

**Exception Categories:**
- **Data Exceptions:** Invalid input, missing data, duplicates
- **System Exceptions:** Service unavailable, timeout, errors
- **Business Exceptions:** Policy violations, approval rejections
- **Security Exceptions:** Unauthorized access, authentication failures

---

### Step 3: Define Business Rules

**Objective:** Document all business rules and constraints.

**Actions:**
1. Extract rules from process documentation
2. Categorize rules by domain
3. Define rule priority
4. Document rule dependencies
5. Validate rule completeness

**Output:** `03-business-rules.md`

**Rule Format:**
```markdown
| 规则编号 | 规则名称 | 规则描述 | 适用场景 |
|---------|---------|---------|---------|
| BR-XXX | [Name] | [Description] | [Scenario] |
```

**Rule Categories:**
- User Management Rules
- Organization Rules
- Permission Rules
- Security Rules
- Audit Rules

---

### Step 4: Create Process Flow Diagrams

**Objective:** Create visual representations of processes.

**Actions:**
1. Create flowcharts for each core process
2. Use standard notation (BPMN or flowchart)
3. Include swimlanes for different roles
4. Show decision points and branches
5. Export diagrams as images

**Output:** `04-process-flow-diagrams.md`

**Diagram Types:**
- **Flowchart:** Sequential process flow
- **Swimlane:** Multi-role process flow
- **Sequence Diagram:** System interaction flow
- **State Diagram:** Status transitions

**Tools:**
- Mermaid (Markdown-compatible)
- BPMN tools
- Visio/Lucidchart

---

### Step 5: Create Business Process Document

**Objective:** Create comprehensive process documentation.

**Actions:**
1. Summarize all processes
2. Create process relationship maps
3. Document process metrics and KPIs
4. Create process index/reference
5. Include version history

**Output:** `05-business-process-document.md`

**Document Structure:**
```markdown
# 业务流程文档

## 一、文档概述
## 二、核心业务流程
## 三、异常流程
## 四、业务规则
## 五、流程图
## 六、流程指标
## 七、附录
```

---

## Document Naming Convention

| Step | Document | Code |
|-----|---------|------|
| 1 | 核心业务流程 | SYS-RA-BP-001~003 |
| 2 | 异常流程和边界情况 | SYS-RA-BP-004 |
| 3 | 业务规则定义 | SYS-RA-BP-005 |
| 4 | 业务流程图 | SYS-RA-BP-006 |
| 5 | 业务流程文档 | SYS-RA-BP-007 |

---

## Quality Checklist

- [ ] All core processes are documented
- [ ] Exception flows are identified
- [ ] Business rules are complete and consistent
- [ ] Flow diagrams are clear and accurate
- [ ] Process metrics are defined
- [ ] Document is comprehensive and well-organized

---

## Best Practices

1. **Start with user stories** - Base processes on actual user needs
2. **Involve stakeholders** - Validate processes with business users
3. **Keep it practical** - Focus on real workflows, not ideal ones
4. **Document exceptions** - Don't forget error handling
5. **Use visual aids** - Diagrams help understanding
6. **Define metrics** - Measure process effectiveness
7. **Version control** - Track changes to processes

---

## Common Pitfalls

- **Missing exceptions** - Always consider what can go wrong
- **Overly complex** - Keep processes as simple as possible
- **Unclear ownership** - Define who does what
- **No metrics** - Define how to measure success
- **Outdated diagrams** - Keep diagrams in sync with text
