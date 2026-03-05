---
name: "requirement-refinement-process"
description: "Guides the requirement refinement process to break down business requirements into functional points, user stories, and technical specifications. Invoke when user needs to refine requirements, create user stories, analyze functional dependencies, or identify technical constraints."
---

# Requirement Refinement Process Skill

## Overview

This skill guides you through a systematic requirement refinement process to transform high-level business requirements into detailed, implementable functional specifications.

## When to Use

- Breaking down business requirements into functional points
- Writing detailed user stories with acceptance criteria
- Analyzing functional dependencies between modules
- Identifying technical constraints and limitations
- Creating requirement specifications for development

## Refinement Process

### Step 1: Functional Breakdown

**Objective:** Decompose business requirements into granular functional points.

**Actions:**
1. Review business requirements document
2. Identify all functional modules
3. Break down each module into specific features
4. Assign priority (P0/P1/P2) to each function
5. Create function dependency relationships

**Output:** `01-functional-breakdown.md`

**Template:**
```markdown
# 功能点拆解

## 一、业务需求回顾
| 需求编号 | 需求名称 | 优先级 |
|---------|---------|--------|

## 二、功能点拆解
### 2.1 [模块名称]
| 功能编号 | 功能点 | 功能描述 | 优先级 |
|---------|--------|---------|--------|

## 三、功能统计
| 模块 | P0 | P1 | P2 | 合计 |

## 四、功能依赖关系
```

---

### Step 2: User Stories

**Objective:** Create detailed user stories following INVEST principles.

**Actions:**
1. Identify all user roles
2. Create user stories for each role
3. Write acceptance criteria (Given-When-Then format)
4. Assign story points for estimation
5. Map user activities in journey format

**Output:** `02-user-stories.md`

**User Story Format:**
```markdown
#### US-XXX: [Story Title]

**用户故事：**
作为 <角色>，
我希望 <功能/目标>，
以便 <价值/原因>。

**验收标准：**
Given <前置条件>
When <操作/事件>
Then <预期结果>

**优先级：** P0/P1/P2
**故事点：** [点数]
**依赖：** [依赖项]
```

**INVEST Principles:**
- **I**ndependent: Stories should be independent
- **N**egotiable: Details can be discussed
- **V**aluable: Must provide value to users
- **E**stimable: Size can be estimated
- **S**mall: Can be completed in one iteration
- **T**estable: Has clear acceptance criteria

---

### Step 3: Functional Dependencies

**Objective:** Analyze and document dependencies between functions.

**Actions:**
1. Create dependency matrix between modules
2. Identify strong and weak dependencies
3. Draw dependency diagrams
4. Define implementation sequence
5. Identify risks in dependency chain

**Output:** `03-functional-dependencies.md`

**Key Sections:**
- Module dependency matrix
- Function dependency matrix
- Dependency diagrams
- Implementation sequence recommendations
- Risk identification

---

### Step 4: Technical Constraints

**Objective:** Identify all technical constraints and limitations.

**Actions:**
1. Document technology stack constraints
2. Define security requirements
3. Specify performance constraints
4. List compatibility requirements
5. Document deployment constraints

**Output:** `04-technical-constraints.md`

**Constraint Categories:**
- **Technology Stack:** Frontend, backend, database requirements
- **Security:** Authentication, data protection, interface security
- **Performance:** Response time, concurrency, resource usage
- **Compatibility:** Browser, mobile, integration compatibility
- **Deployment:** Environment, high availability, scalability

---

### Step 5: Requirements Specification

**Objective:** Create comprehensive requirements specification document.

**Actions:**
1. Summarize system overview
2. Detail functional requirements
3. Define non-functional requirements
4. Document interface requirements
5. Create requirement traceability matrix

**Output:** `05-requirements-specification.md`

**Document Structure:**
```markdown
# 需求规格说明

## 一、文档概述
## 二、系统概述
## 三、功能需求
## 四、非功能需求
## 五、接口需求
## 六、数据需求
## 七、附录
```

---

## Document Naming Convention

| Step | Document | Code |
|-----|---------|------|
| 1 | 功能点拆解 | SYS-RA-US-001 |
| 2 | 用户故事 | SYS-RA-US-002 |
| 3 | 功能依赖关系 | SYS-RA-US-003 |
| 4 | 技术约束条件 | SYS-RA-US-004 |
| 5 | 需求规格说明 | SYS-RA-US-005 |

---

## Quality Checklist

- [ ] All business requirements are covered by functional points
- [ ] User stories follow INVEST principles
- [ ] Acceptance criteria are testable
- [ ] Dependencies are clearly identified
- [ ] Technical constraints are realistic
- [ ] Requirements specification is complete
- [ ] Traceability matrix links all artifacts

---

## Best Practices

1. **Start with business requirements** - Always reference the BRD
2. **Involve stakeholders** - Validate user stories with users
3. **Keep it small** - Each user story should be completable in one sprint
4. **Prioritize ruthlessly** - Not everything can be P0
5. **Document dependencies** - Critical for planning
6. **Be specific** - Avoid vague requirements
7. **Think about testing** - If you can't test it, it's not a good requirement
