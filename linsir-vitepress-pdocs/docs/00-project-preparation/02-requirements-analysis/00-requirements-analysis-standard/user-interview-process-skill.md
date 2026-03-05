---
name: "user-interview-process"
description: "Guides the user interview process for requirements analysis. Invoke when user needs to conduct user interviews, create interview plans, outlines, records, or summaries for requirements gathering."
---

# 用户访谈流程 Skill

## 概述

本 Skill 指导如何系统化地进行用户访谈，以获取真实、全面的业务需求。适用于需求调研与分析阶段。

## 何时使用

- 需要进行用户需求调研时
- 创建访谈计划、提纲、记录或纪要时
- 需要整理访谈结果并形成文档时

## 访谈流程

### 第一阶段：准备阶段

#### 1. 制定访谈计划
**输入：** 业务需求文档（BRD）
**输出：** `01-interview-plan.md`

**内容要求：**
- 访谈目标
- 访谈对象（分层：决策层、管理层、执行层）
- 访谈时间安排
- 访谈议题
- 材料准备清单

#### 2. 准备访谈提纲
**输出：** `02-interview-outline.md`

**内容要求：**
- **层级话题**：针对不同层级设计专项问题
  - 决策层：战略定位、投资回报、成功标准
  - 管理层：技术架构、业务需求、管理痛点
  - 执行层：日常操作、具体痛点、功能需求
- **通用话题**：所有层级统一问题
  - 当前痛点
  - 期望功能
  - 优先级排序

---

### 第二阶段：执行阶段

#### 3. 执行访谈并记录
**输出：** `03-interview-records/XX-xxx-interview-record.md`

**访谈记录结构：**
```markdown
# XXX访谈记录

## 一、访谈基本信息
- 访谈时间
- 访谈地点
- 访谈对象
- 记录人

## 二、层级话题
### 2.1 话题1
- 问题
- 回答要点

## 三、通用话题
### 3.1 当前痛点
...

## 四、关键发现
- 核心需求
- 痛点
- 建议

## 五、待确认事项
...

## 六、后续行动
...
```

**记录规范：**
- 当天完成记录
- 客观记录，不添加个人理解
- 标注关键信息和待确认事项

---

### 第三阶段：整理阶段

#### 4. 整理访谈记录（详细版）
**输出：** `04-interview-summary.md`

**内容要求：**
- 访谈概况（基本信息、执行情况、质量评估）
- 核心发现汇总（共性痛点、层级特定痛点、核心需求）
- 关键数据汇总
- 风险与问题
- 共识与分歧
- 后续行动建议

#### 5. 输出访谈纪要（精简版）
**输出：** `05-interview-minutes.md`

**内容要求：**
- 访谈概况（精简）
- 核心发现（战略、技术、业务层面）
- 关键数据
- 风险与问题
- 后续行动建议

---

## 目录结构规范

```
01-user-interview-records/
├── 01-interview-plan.md              # 访谈计划
├── 02-interview-outline.md           # 访谈提纲
├── 03-interview-records/             # 访谈记录目录
│   ├── 01-ceo-interview-record.md
│   ├── 02-it-director-interview-record.md
│   ├── 03-admin-manager-interview-record.md
│   ├── 04-operation-supervisor-interview-record.md
│   ├── 05-hr-specialist-interview-record.md
│   ├── 06-developer-interview-record.md
│   └── 07-business-system-manager-interview-record.md
├── 04-interview-summary.md           # 访谈整理（详细版）
└── 05-interview-minutes.md           # 访谈纪要（精简版）
```

---

## 最佳实践

### 成功因素
1. **分层设计**：按决策层、管理层、执行层设计不同议题
2. **通用+专项**：通用话题保证一致性，专项话题挖掘深度
3. **及时记录**：访谈当天完成记录，保证信息准确性
4. **结构清晰**：使用统一的记录模板

### 注意事项
1. **预留缓冲时间**：连续访谈容易疲劳，建议间隔30分钟以上
2. **提前发送提纲**：让受访者提前准备，提高访谈效率
3. **客观记录**：不添加个人理解和判断
4. **及时确认**：对模糊信息及时与受访者确认

---

## 审核检查清单

- [ ] 访谈计划完整（时间、对象、议题）
- [ ] 访谈提纲覆盖所有层级
- [ ] 访谈记录当天完成
- [ ] 访谈记录包含关键发现、待确认事项、后续行动
- [ ] 访谈整理汇总所有访谈核心发现
- [ ] 访谈纪要提炼核心发现和行动建议
- [ ] 所有文档路径正确

---

## 输出物清单

| 序号 | 文档名称 | 文档路径 | 说明 |
|-----|---------|---------|------|
| 1 | 访谈计划 | `01-interview-plan.md` | 访谈时间、对象、议题 |
| 2 | 访谈提纲 | `02-interview-outline.md` | 层级话题+通用话题 |
| 3 | 访谈记录 | `03-interview-records/*.md` | 每人一份 |
| 4 | 访谈整理 | `04-interview-summary.md` | 详细版汇总 |
| 5 | 访谈纪要 | `05-interview-minutes.md` | 精简版汇总 |
