# 需求分析规范目录

本目录存放需求调研与分析阶段的标准规范、流程文档和工具。

## 目录结构

```
00-requirements-analysis-standard/
├── README.md                              # 本文件
├── requirements-analysis-checklist.md     # 需求分析检查清单
├── 01-process-diagrams/                   # 流程图
│   ├── README.md
│   ├── requirements-analysis-process.mmd
│   └── requirements-analysis-process.png
├── 02-process-standards/                  # 流程规范
│   ├── README.md
│   ├── user-interview-process.md
│   ├── current-situation-research-process.md
│   ├── competitor-analysis-process.md
│   ├── stakeholder-analysis-process.md
│   ├── requirement-refinement-process.md
│   ├── user-persona-process.md
│   ├── business-process-refinement-process.md
│   ├── requirements-priority-process.md
│   └── requirements-research-report-process.md
└── 03-skills/                             # Skills
    ├── README.md
    ├── user-interview-process-skill.md
    ├── current-situation-research-process-skill.md
    ├── competitor-analysis-process-skill.md
    ├── stakeholder-analysis-process-skill.md
    ├── requirement-refinement-process-skill.md
    ├── user-persona-process-skill.md
    ├── business-process-refinement-process-skill.md
    ├── requirements-priority-process-skill.md
    └── requirements-research-report-process-skill.md
```

## 文件分类说明

### 1. 根目录文件

| 文件 | 说明 |
|-----|------|
| `requirements-analysis-checklist.md` | 需求分析全流程检查清单，跟踪各阶段完成状态 |

### 2. 01-process-diagrams（流程图）

存放需求分析相关的流程图文件：
- Mermaid源文件（.mmd）
- 导出的图片文件（.png）

### 3. 02-process-standards（流程规范）

存放各环节的流程规范文档：
- 流程目标和范围
- 详细执行步骤
- 输出文档规范
- 质量检查清单
- 最佳实践

### 4. 03-skills（Skills）

存放Skill文件：
- 与 `.trae/skills/` 目录下的Skill文件内容一致
- 用于留存和参考

## 需求分析阶段（9个部分）

| 序号 | 阶段 | 规范文档 | Skill |
|-----|------|---------|----------|
| 01 | 用户访谈 | user-interview-process.md | user-interview-process-skill.md |
| 02 | 现状调研 | current-situation-research-process.md | current-situation-research-process-skill.md |
| 03 | 竞品分析 | competitor-analysis-process.md | competitor-analysis-process-skill.md |
| 04 | 干系人分析 | stakeholder-analysis-process.md | stakeholder-analysis-process-skill.md |
| 05 | 需求细化 | requirement-refinement-process.md | requirement-refinement-process-skill.md |
| 06 | 用户画像 | user-persona-process.md | user-persona-process-skill.md |
| 07 | 业务流程梳理 | business-process-refinement-process.md | business-process-refinement-process-skill.md |
| 08 | 需求优先级排序 | requirements-priority-process.md | requirements-priority-process-skill.md |
| 09 | 需求调研报告 | requirements-research-report-process.md | requirements-research-report-process-skill.md |

## 使用流程

1. **开始新阶段前**：阅读对应的流程规范文档
2. **执行阶段任务**：按照规范文档的步骤执行
3. **完成任务后**：更新检查清单中的状态
4. **需要指导时**：查看对应的Skill文件

## 注意事项

- 流程规范文档和Skill文件内容一致，只是用途不同
- 实际生效的Skill文件位于 `.trae/skills/` 目录
- 检查清单需要实时更新，反映最新进度
