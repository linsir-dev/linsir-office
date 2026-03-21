import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "System项目AI文档",
  description: "项目准备与需求分析文档库",
  head: [
    ['link', { rel: 'icon', href: '/images/logo.png' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js' }]
  ],
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/images/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '项目计划', link: '/PROJECT-PLAN' },
      { text: '实施流程', link: '/project-implementation-flow' },
      { 
        text: '项目准备',
        items: [
          { text: '系统业务需求', link: '/00-project-preparation/01-system-business-requirements/01-business-requirements-v1.0' },
          { text: '需求分析', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/requirements-analysis-checklist' },
          { text: '技术调研', link: '/00-project-preparation/03-technical-research/00-technical-research-standard/technical-research-checklist' },
          { text: '项目可行性', link: '/00-project-preparation/04-project-feasibility/00-project-feasibility-standard/project-feasibility-checklist' }
        ]
      },
      { 
        text: '项目立项',
        items: [
          { text: '项目章程', link: '/01-project-initiation/01-project-charter/01-charter-documents/00-project-charter' },
          { text: '商业论证', link: '/01-project-initiation/02-business-case/06-business-case-summary/14-business-case-summary' },
          { text: '立项申请', link: '/01-project-initiation/03-project-application/01-application-documents/01-project-application-form' },
          { text: '立项审批', link: '/01-project-initiation/04-project-approval/01-approval-documents/01-project-approval-notice' }
        ]
      },
      { 
        text: '系统设计',
        items: [
          { text: '架构设计', link: '/02-design/01-architecture/00-architecture-standard/architecture-design-checklist' },
          { text: '数据库设计', link: '/02-design/02-database/00-database-standard/database-design-checklist' },
          { text: '接口设计', link: '/02-design/03-interface-design/00-interface-standard/interface-design-checklist' },
          { text: 'UI/UX设计', link: '/02-design/04-ui-ux-design/00-ui-ux-design-standards/ui-ux-design-checklist' }
        ]
      },
      { 
        text: '迭代开发',
        items: [
          { text: 'Sprint 1 - 核心功能', link: '/03-iterations/01-sprint-1-core/02-iteration-plan/01-iteration-goal' },
          { text: 'Sprint 2 - 扩展功能', link: '/03-iterations/02-sprint-2-extension/00-iteration-plan/01-iteration-goal' },
          { text: 'Sprint 3 - 优化完善', link: '/03-iterations/03-sprint-3-refinement/00-iteration-plan/01-iteration-goal' }
        ]
      },
      { 
        text: '测试验证',
        items: [
          { text: '单元测试', link: '/04-testing/01-unit/unit-testing' },
          { text: '集成测试', link: '/04-testing/02-integration/integration-testing' },
          { text: '系统测试', link: '/04-testing/03-system/system-testing' },
          { text: 'UAT测试', link: '/04-testing/04-uat/uat-testing' },
          { text: '测试报告', link: '/04-testing/05-testing-reports/testing-summary-report' }
        ]
      },
      { 
        text: '部署上线',
        items: [
          { text: '环境搭建', link: '/05-deployment/01-environment/environment-setup' },
          { text: '部署配置', link: '/05-deployment/02-config/deployment-config' },
          { text: '部署脚本', link: '/05-deployment/03-scripts/deployment-scripts' }
        ]
      },
      { 
        text: '运维维护',
        items: [
          { text: '监控配置', link: '/06-operations/01-monitoring/monitoring-config' },
          { text: '维护指南', link: '/06-operations/02-maintenance/maintenance-guide' }
        ]
      }
    ],

    sidebar: {
      '/': [
        {
          text: '项目指南',
          items: [
            { text: '项目计划', link: '/PROJECT-PLAN' },
            { text: '实施流程图', link: '/project-implementation-flow' }
          ]
        }
      ],
      '/00-project-preparation/01-system-business-requirements/': [
        {
          text: '系统业务需求',
          items: [
            { text: '业务需求 v1.0', link: '/00-project-preparation/01-system-business-requirements/01-business-requirements-v1.0' },
            { text: '业务需求 v1.1', link: '/00-project-preparation/01-system-business-requirements/02-business-requirements-v1.1' },
            { text: '需求评审', link: '/00-project-preparation/01-system-business-requirements/03-business-requirements-review' },
            { text: '评审回复', link: '/00-project-preparation/01-system-business-requirements/04-review-response' }
          ]
        },
        {
          text: '标准规范',
          items: [
            { text: '业务流程规范', link: '/00-project-preparation/01-system-business-requirements/00-system-business-requirements-standard/business-requirement-process-skill' }
          ]
        },
        {
          text: '示例文档',
          items: [
            { text: 'OA业务需求 v1.0', link: '/00-project-preparation/01-system-business-requirements/demo-business-requirements/01-oa-business-requirements-v1.0' },
            { text: 'OA业务需求 v1.1', link: '/00-project-preparation/01-system-business-requirements/demo-business-requirements/04-oa-business-requirements-v1.1' },
            { text: 'CRM业务需求', link: '/00-project-preparation/01-system-business-requirements/demo2Business/01-crm-business-requirements-v1.0' }
          ]
        }
      ],
      '/00-project-preparation/02-requirements-analysis/': [
        {
          text: '需求分析',
          items: [
            { text: '分析检查清单', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/requirements-analysis-checklist' }
          ]
        },
        {
          text: '流程图',
          collapsed: true,
          items: [
            { text: '需求分析流程图', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/01-process-diagrams/requirements-analysis-process' }
          ]
        },
        {
          text: '流程标准',
          collapsed: true,
          items: [
            { text: '用户访谈流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/02-process-standards/user-interview-process' },
            { text: '现状调研流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/02-process-standards/current-situation-research-process' },
            { text: '竞品分析流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/02-process-standards/competitor-analysis-process' },
            { text: '干系人分析流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/02-process-standards/stakeholder-analysis-process' },
            { text: '用户画像流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/02-process-standards/user-persona-process' },
            { text: '业务流程梳理流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/02-process-standards/business-process-refinement-process' },
            { text: '需求细化流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/02-process-standards/requirement-refinement-process' },
            { text: '需求优先级流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/02-process-standards/requirements-priority-process' },
            { text: '需求调研报告流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/02-process-standards/requirements-research-report-process' }
          ]
        },
        {
          text: '技能文档',
          collapsed: true,
          items: [
            { text: '用户访谈技能', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/03-skills/user-interview-process-skill' },
            { text: '现状调研技能', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/03-skills/current-situation-research-process-skill' },
            { text: '竞品分析技能', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/03-skills/competitor-analysis-process-skill' },
            { text: '干系人分析技能', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/03-skills/stakeholder-analysis-process-skill' },
            { text: '用户画像技能', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/03-skills/user-persona-process-skill' },
            { text: '业务流程梳理技能', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/03-skills/business-process-refinement-process-skill' },
            { text: '需求细化技能', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/03-skills/requirement-refinement-process-skill' },
            { text: '需求优先级技能', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/03-skills/requirements-priority-process-skill' },
            { text: '需求调研报告技能', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/03-skills/requirements-research-report-process-skill' }
          ]
        },
        {
          text: '用户访谈记录',
          collapsed: true,
          items: [
            { text: '访谈计划', link: '/00-project-preparation/02-requirements-analysis/01-user-interview-records/01-interview-plan' },
            { text: '访谈大纲', link: '/00-project-preparation/02-requirements-analysis/01-user-interview-records/02-interview-outline' },
            { text: 'CEO访谈记录', link: '/00-project-preparation/02-requirements-analysis/01-user-interview-records/03-interview-records/01-ceo-interview-record' },
            { text: 'IT总监访谈记录', link: '/00-project-preparation/02-requirements-analysis/01-user-interview-records/03-interview-records/02-it-director-interview-record' },
            { text: '行政经理访谈记录', link: '/00-project-preparation/02-requirements-analysis/01-user-interview-records/03-interview-records/03-admin-manager-interview-record' },
            { text: '运营主管访谈记录', link: '/00-project-preparation/02-requirements-analysis/01-user-interview-records/03-interview-records/04-operation-supervisor-interview-record' },
            { text: 'HR专员访谈记录', link: '/00-project-preparation/02-requirements-analysis/01-user-interview-records/03-interview-records/05-hr-specialist-interview-record' },
            { text: '开发工程师访谈记录', link: '/00-project-preparation/02-requirements-analysis/01-user-interview-records/03-interview-records/06-developer-interview-record' },
            { text: '业务系统管理员访谈记录', link: '/00-project-preparation/02-requirements-analysis/01-user-interview-records/03-interview-records/07-business-system-manager-interview-record' },
            { text: '访谈总结', link: '/00-project-preparation/02-requirements-analysis/01-user-interview-records/04-interview-summary' },
            { text: '访谈纪要', link: '/00-project-preparation/02-requirements-analysis/01-user-interview-records/05-interview-minutes' }
          ]
        },
        {
          text: '现状调研报告',
          collapsed: true,
          items: [
            { text: '现有系统-ERP', link: '/00-project-preparation/02-requirements-analysis/02-current-situation-report/01-existing-systems-docs/01-erp-system/system-overview' },
            { text: '现有系统-CRM', link: '/00-project-preparation/02-requirements-analysis/02-current-situation-report/01-existing-systems-docs/02-crm-system/system-overview' },
            { text: '现有系统-OA', link: '/00-project-preparation/02-requirements-analysis/02-current-situation-report/01-existing-systems-docs/03-oa-system/system-overview' },
            { text: '现有系统-财务', link: '/00-project-preparation/02-requirements-analysis/02-current-situation-report/01-existing-systems-docs/04-finance-system/system-overview' },
            { text: '现有系统-HR', link: '/00-project-preparation/02-requirements-analysis/02-current-situation-report/01-existing-systems-docs/05-hr-system/system-overview' },
            { text: '用户入职流程', link: '/00-project-preparation/02-requirements-analysis/02-current-situation-report/02-business-process-flow/01-user-onboarding-process' },
            { text: '用户离职流程', link: '/00-project-preparation/02-requirements-analysis/02-current-situation-report/02-business-process-flow/02-user-offboarding-process' },
            { text: '密码重置流程', link: '/00-project-preparation/02-requirements-analysis/02-current-situation-report/02-business-process-flow/03-password-reset-process' },
            { text: '权限申请流程', link: '/00-project-preparation/02-requirements-analysis/02-current-situation-report/02-business-process-flow/04-permission-application-process' },
            { text: '组织架构同步流程', link: '/00-project-preparation/02-requirements-analysis/02-current-situation-report/02-business-process-flow/05-org-structure-sync-process' },
            { text: '痛点分析', link: '/00-project-preparation/02-requirements-analysis/02-current-situation-report/03-pain-points-analysis' },
            { text: '流程瓶颈分析', link: '/00-project-preparation/02-requirements-analysis/02-current-situation-report/05-process-bottleneck-analysis' },
            { text: '现状调研报告', link: '/00-project-preparation/02-requirements-analysis/02-current-situation-report/06-current-situation-report' }
          ]
        },
        {
          text: '竞品分析',
          collapsed: true,
          items: [
            { text: '竞品范围', link: '/00-project-preparation/02-requirements-analysis/03-competitor-analysis/01-competitor-scope' },
            { text: '核心功能分析', link: '/00-project-preparation/02-requirements-analysis/03-competitor-analysis/02-core-function-analysis' },
            { text: '竞品优缺点', link: '/00-project-preparation/02-requirements-analysis/03-competitor-analysis/03-competitor-pros-cons' },
            { text: '经验教训', link: '/00-project-preparation/02-requirements-analysis/03-competitor-analysis/04-lessons-learned' },
            { text: '竞品分析报告', link: '/00-project-preparation/02-requirements-analysis/03-competitor-analysis/05-competitor-analysis-report' }
          ]
        },
        {
          text: '干系人分析',
          collapsed: true,
          items: [
            { text: '干系人识别', link: '/00-project-preparation/02-requirements-analysis/04-stakeholder-analysis/01-stakeholder-identification' },
            { text: '干系人分析', link: '/00-project-preparation/02-requirements-analysis/04-stakeholder-analysis/02-stakeholder-analysis' },
            { text: '干系人登记册', link: '/00-project-preparation/02-requirements-analysis/04-stakeholder-analysis/03-stakeholder-register' }
          ]
        },
        {
          text: '用户故事地图',
          collapsed: true,
          items: [
            { text: '功能拆解', link: '/00-project-preparation/02-requirements-analysis/05-user-story-mapping/01-functional-breakdown' },
            { text: '用户故事', link: '/00-project-preparation/02-requirements-analysis/05-user-story-mapping/02-user-stories' },
            { text: '功能依赖', link: '/00-project-preparation/02-requirements-analysis/05-user-story-mapping/03-functional-dependencies' },
            { text: '技术约束', link: '/00-project-preparation/02-requirements-analysis/05-user-story-mapping/04-technical-constraints' },
            { text: '需求规格说明', link: '/00-project-preparation/02-requirements-analysis/05-user-story-mapping/05-requirements-specification' }
          ]
        },
        {
          text: '用户画像',
          collapsed: true,
          items: [
            { text: '用户角色', link: '/00-project-preparation/02-requirements-analysis/06-user-persona/01-user-roles' },
            { text: '使用场景', link: '/00-project-preparation/02-requirements-analysis/06-user-persona/02-usage-scenarios' },
            { text: '用户旅程图', link: '/00-project-preparation/02-requirements-analysis/06-user-persona/03-user-journey-map' },
            { text: '痛点与期望', link: '/00-project-preparation/02-requirements-analysis/06-user-persona/04-pain-points-expectations' },
            { text: '用户画像文档', link: '/00-project-preparation/02-requirements-analysis/06-user-persona/05-user-persona-document' }
          ]
        },
        {
          text: '业务流程梳理',
          collapsed: true,
          items: [
            { text: '用户入职流程', link: '/00-project-preparation/02-requirements-analysis/07-business-process-refinement/01-core-business-process/01-user-onboarding-process' },
            { text: '用户离职流程', link: '/00-project-preparation/02-requirements-analysis/07-business-process-refinement/01-core-business-process/02-user-offboarding-process' },
            { text: '权限申请流程', link: '/00-project-preparation/02-requirements-analysis/07-business-process-refinement/01-core-business-process/03-permission-application-process' },
            { text: '异常流程', link: '/00-project-preparation/02-requirements-analysis/07-business-process-refinement/02-exception-processes' },
            { text: '业务规则', link: '/00-project-preparation/02-requirements-analysis/07-business-process-refinement/03-business-rules' },
            { text: '流程图', link: '/00-project-preparation/02-requirements-analysis/07-business-process-refinement/04-process-flow-diagrams' },
            { text: '业务流程文档', link: '/00-project-preparation/02-requirements-analysis/07-business-process-refinement/05-business-process-document' }
          ]
        },
        {
          text: '需求优先级',
          collapsed: true,
          items: [
            { text: 'MoSCoW分类', link: '/00-project-preparation/02-requirements-analysis/08-requirements-priority/01-moscow-classification' },
            { text: '价值评估', link: '/00-project-preparation/02-requirements-analysis/08-requirements-priority/02-value-assessment' },
            { text: '成本评估', link: '/00-project-preparation/02-requirements-analysis/08-requirements-priority/03-cost-assessment' },
            { text: '迭代计划', link: '/00-project-preparation/02-requirements-analysis/08-requirements-priority/04-iteration-plan' },
            { text: '需求优先级矩阵', link: '/00-project-preparation/02-requirements-analysis/08-requirements-priority/05-requirements-priority-matrix' }
          ]
        },
        {
          text: '需求调研报告',
          collapsed: true,
          items: [
            { text: '需求调研报告 v1.0', link: '/00-project-preparation/02-requirements-analysis/09-requirements-research-report/01-requirements-research-report' },
            { text: '需求调研报告 v1.1', link: '/00-project-preparation/02-requirements-analysis/09-requirements-research-report/01-requirements-research-report-v1.1' },
            { text: '报告评审', link: '/00-project-preparation/02-requirements-analysis/09-requirements-research-report/02-requirements-research-report-review' }
          ]
        }
      ],
      '/00-project-preparation/03-technical-research/': [
        {
          text: '技术调研',
          items: [
            { text: '调研检查清单', link: '/00-project-preparation/03-technical-research/00-technical-research-standard/technical-research-checklist' }
          ]
        },
        {
          text: '流程图',
          collapsed: true,
          items: [
            { text: '技术调研流程图', link: '/00-project-preparation/03-technical-research/00-technical-research-standard/01-process-diagrams/technical-research-process' }
          ]
        },
        {
          text: '流程标准',
          collapsed: true,
          items: [
            { text: '技术选型流程', link: '/00-project-preparation/03-technical-research/00-technical-research-standard/02-process-standards/technology-selection-process' },
            { text: '架构调研流程', link: '/00-project-preparation/03-technical-research/00-technical-research-standard/02-process-standards/architecture-research-process' },
            { text: '技术验证流程', link: '/00-project-preparation/03-technical-research/00-technical-research-standard/02-process-standards/technical-validation-process' },
            { text: '风险评估流程', link: '/00-project-preparation/03-technical-research/00-technical-research-standard/02-process-standards/risk-assessment-process' }
          ]
        },
        {
          text: '技能文档',
          collapsed: true,
          items: [
            { text: '技术选型技能', link: '/00-project-preparation/03-technical-research/00-technical-research-standard/03-skills/technology-selection-process-skill' },
            { text: '架构调研技能', link: '/00-project-preparation/03-technical-research/00-technical-research-standard/03-skills/architecture-research-process-skill' },
            { text: '技术验证技能', link: '/00-project-preparation/03-technical-research/00-technical-research-standard/03-skills/technical-validation-process-skill' },
            { text: '风险评估技能', link: '/00-project-preparation/03-technical-research/00-technical-research-standard/03-skills/risk-assessment-process-skill' }
          ]
        },
        {
          text: '技术选型',
          collapsed: true,
          items: [
            { text: '技术选型总览', link: '/00-project-preparation/03-technical-research/01-technology-selection/00-technology-selection-summary' },
            { text: '前端技术选型', link: '/00-project-preparation/03-technical-research/01-technology-selection/01-frontend-selection' },
            { text: '后端技术选型', link: '/00-project-preparation/03-technical-research/01-technology-selection/02-backend-selection' },
            { text: '数据库选型', link: '/00-project-preparation/03-technical-research/01-technology-selection/03-database-selection' },
            { text: '认证协议选型', link: '/00-project-preparation/03-technical-research/01-technology-selection/04-auth-protocol-selection' },
            { text: '缓存选型', link: '/00-project-preparation/03-technical-research/01-technology-selection/05-cache-selection' },
            { text: '部署选型', link: '/00-project-preparation/03-technical-research/01-technology-selection/06-deployment-selection' }
          ]
        },
        {
          text: '架构调研',
          collapsed: true,
          items: [
            { text: '架构调研总览', link: '/00-project-preparation/03-technical-research/02-architecture-research/00-architecture-research-summary' },
            { text: '架构模式', link: '/00-project-preparation/03-technical-research/02-architecture-research/01-architecture-pattern' },
            { text: '前后端分离', link: '/00-project-preparation/03-technical-research/02-architecture-research/02-frontend-backend-separation' },
            { text: '数据流架构', link: '/00-project-preparation/03-technical-research/02-architecture-research/03-data-flow-architecture' },
            { text: '安全架构', link: '/00-project-preparation/03-technical-research/02-architecture-research/04-security-architecture' },
            { text: '部署架构', link: '/00-project-preparation/03-technical-research/02-architecture-research/05-deployment-architecture' }
          ]
        },
        {
          text: '技术验证',
          collapsed: true,
          items: [
            { text: '技术验证总览', link: '/00-project-preparation/03-technical-research/03-technical-validation/00-technical-validation-summary' },
            { text: 'SSO POC报告', link: '/00-project-preparation/03-technical-research/03-technical-validation/01-sso-poc-report' },
            { text: '集成 POC报告', link: '/00-project-preparation/03-technical-research/03-technical-validation/02-integration-poc-report' },
            { text: '性能 POC报告', link: '/00-project-preparation/03-technical-research/03-technical-validation/03-performance-poc-report' },
            { text: '安全 POC报告', link: '/00-project-preparation/03-technical-research/03-technical-validation/04-security-poc-report' }
          ]
        },
        {
          text: '风险评估',
          collapsed: true,
          items: [
            { text: '风险评估总览', link: '/00-project-preparation/03-technical-research/04-risk-assessment/00-risk-assessment-summary' },
            { text: '技术成熟度风险', link: '/00-project-preparation/03-technical-research/04-risk-assessment/01-technology-maturity-risk' },
            { text: '团队能力风险', link: '/00-project-preparation/03-technical-research/04-risk-assessment/02-team-capability-risk' },
            { text: '第三方风险', link: '/00-project-preparation/03-technical-research/04-risk-assessment/03-third-party-risk' }
          ]
        },
        {
          text: '技术可行性报告',
          collapsed: true,
          items: [
            { text: '技术可行性报告 v1.0', link: '/00-project-preparation/03-technical-research/05-technical-feasibility-report/01-technical-feasibility-report' },
            { text: '技术可行性报告 v1.1', link: '/00-project-preparation/03-technical-research/05-technical-feasibility-report/01-technical-feasibility-report-v1.1' },
            { text: '报告评审', link: '/00-project-preparation/03-technical-research/05-technical-feasibility-report/02-technical-feasibility-report-review' }
          ]
        }
      ],
      '/00-project-preparation/04-project-feasibility/': [
        {
          text: '项目可行性',
          items: [
            { text: '可行性检查清单', link: '/00-project-preparation/04-project-feasibility/00-project-feasibility-standard/project-feasibility-checklist' }
          ]
        },
        {
          text: '流程图',
          collapsed: true,
          items: [
            { text: '项目可行性流程图', link: '/00-project-preparation/04-project-feasibility/00-project-feasibility-standard/01-process-diagrams/project-feasibility-process' }
          ]
        },
        {
          text: '流程标准',
          collapsed: true,
          items: [
            { text: '成本效益分析流程', link: '/00-project-preparation/04-project-feasibility/00-project-feasibility-standard/02-process-standards/cost-benefit-analysis-process' },
            { text: '项目风险评估流程', link: '/00-project-preparation/04-project-feasibility/00-project-feasibility-standard/02-process-standards/project-risk-assessment-process' },
            { text: '初步方案流程', link: '/00-project-preparation/04-project-feasibility/00-project-feasibility-standard/02-process-standards/preliminary-proposal-process' }
          ]
        },
        {
          text: '技能文档',
          collapsed: true,
          items: [
            { text: '成本效益分析技能', link: '/00-project-preparation/04-project-feasibility/00-project-feasibility-standard/03-skills/cost-benefit-analysis-process-skill' },
            { text: '项目风险评估技能', link: '/00-project-preparation/04-project-feasibility/00-project-feasibility-standard/03-skills/project-risk-assessment-process-skill' },
            { text: '初步方案技能', link: '/00-project-preparation/04-project-feasibility/00-project-feasibility-standard/03-skills/preliminary-proposal-process-skill' }
          ]
        },
        {
          text: '成本效益分析',
          collapsed: true,
          items: [
            { text: '成本效益总览', link: '/00-project-preparation/04-project-feasibility/01-cost-benefit-analysis/00-cost-benefit-summary' },
            { text: '成本估算', link: '/00-project-preparation/04-project-feasibility/01-cost-benefit-analysis/01-cost-estimate' },
            { text: '效益分析', link: '/00-project-preparation/04-project-feasibility/01-cost-benefit-analysis/02-benefit-analysis' },
            { text: 'ROI分析', link: '/00-project-preparation/04-project-feasibility/01-cost-benefit-analysis/03-roi-analysis' }
          ]
        },
        {
          text: '项目风险评估',
          collapsed: true,
          items: [
            { text: '项目风险总览', link: '/00-project-preparation/04-project-feasibility/02-project-risk-assessment/00-project-risk-summary' },
            { text: '进度风险', link: '/00-project-preparation/04-project-feasibility/02-project-risk-assessment/01-schedule-risk' },
            { text: '资源风险', link: '/00-project-preparation/04-project-feasibility/02-project-risk-assessment/02-resource-risk' },
            { text: '业务风险', link: '/00-project-preparation/04-project-feasibility/02-project-risk-assessment/03-business-risk' }
          ]
        },
        {
          text: '初步方案',
          collapsed: true,
          items: [
            { text: '初步方案文档', link: '/00-project-preparation/04-project-feasibility/03-preliminary-proposal/00-preliminary-proposal' },
            { text: '项目范围', link: '/00-project-preparation/04-project-feasibility/03-preliminary-proposal/01-project-scope' },
            { text: '实施计划', link: '/00-project-preparation/04-project-feasibility/03-preliminary-proposal/02-implementation-plan' },
            { text: '资源需求', link: '/00-project-preparation/04-project-feasibility/03-preliminary-proposal/03-resource-requirements' },
            { text: '方案评审', link: '/00-project-preparation/04-project-feasibility/03-preliminary-proposal/00-preliminary-proposal-review' }
          ]
        }
      ],
      '/01-project-initiation/01-project-charter/': [
        {
          text: '项目章程',
          items: [
            { text: '项目章程检查清单', link: '/01-project-initiation/01-project-charter/00-project-charter-standard/project-charter-checklist' }
          ]
        },
        {
          text: '流程图',
          collapsed: true,
          items: [
            { text: '项目章程流程图', link: '/01-project-initiation/01-project-charter/00-project-charter-standard/01-process-diagrams/project-charter-process-guide' }
          ]
        },
        {
          text: '流程标准',
          collapsed: true,
          items: [
            { text: '项目章程流程', link: '/01-project-initiation/01-project-charter/00-project-charter-standard/02-process-standards/project-charter-process' }
          ]
        },
        {
          text: '技能文档',
          collapsed: true,
          items: [
            { text: '项目章程技能', link: '/01-project-initiation/01-project-charter/00-project-charter-standard/03-skills/project-charter-process-skill' }
          ]
        },
        {
          text: '章程文档',
          collapsed: true,
          items: [
            { text: '项目章程', link: '/01-project-initiation/01-project-charter/01-charter-documents/00-project-charter' },
            { text: '项目章程评审', link: '/01-project-initiation/01-project-charter/01-charter-documents/00-project-charter-review' },
            { text: '项目标识', link: '/01-project-initiation/01-project-charter/01-charter-documents/01-project-identity' },
            { text: '项目授权', link: '/01-project-initiation/01-project-charter/01-charter-documents/02-project-authorization' },
            { text: '业务目标', link: '/01-project-initiation/01-project-charter/01-charter-documents/03-business-objectives' },
            { text: '成功标准', link: '/01-project-initiation/01-project-charter/01-charter-documents/04-success-criteria' },
            { text: '项目范围', link: '/01-project-initiation/01-project-charter/01-charter-documents/05-project-scope' },
            { text: '范围边界', link: '/01-project-initiation/01-project-charter/01-charter-documents/06-scope-boundaries' },
            { text: '干系人登记册', link: '/01-project-initiation/01-project-charter/01-charter-documents/07-stakeholder-register' },
            { text: '项目约束', link: '/01-project-initiation/01-project-charter/01-charter-documents/08-project-constraints' },
            { text: '假设日志', link: '/01-project-initiation/01-project-charter/01-charter-documents/09-assumption-log' },
            { text: '风险登记册', link: '/01-project-initiation/01-project-charter/01-charter-documents/10-risk-register' },
            { text: '里程碑计划', link: '/01-project-initiation/01-project-charter/01-charter-documents/11-milestone-schedule' },
            { text: '资源需求', link: '/01-project-initiation/01-project-charter/01-charter-documents/12-resource-requirements' },
            { text: '章程审批', link: '/01-project-initiation/01-project-charter/01-charter-documents/13-charter-approval' }
          ]
        }
      ],
      '/01-project-initiation/02-business-case/': [
        {
          text: '商业论证',
          items: [
            { text: '商业论证检查清单', link: '/01-project-initiation/02-business-case/00-business-case-standard/business-case-checklist' }
          ]
        },
        {
          text: '流程图',
          collapsed: true,
          items: [
            { text: '商业论证流程图', link: '/01-project-initiation/02-business-case/00-business-case-standard/01-process-diagrams/business-case-process' }
          ]
        },
        {
          text: '流程标准',
          collapsed: true,
          items: [
            { text: '成本分析流程', link: '/01-project-initiation/02-business-case/00-business-case-standard/02-process-standards/cost-analysis-process' },
            { text: '效益分析流程', link: '/01-project-initiation/02-business-case/00-business-case-standard/02-process-standards/02-benefit-analysis-process' },
            { text: 'ROI计算流程', link: '/01-project-initiation/02-business-case/00-business-case-standard/02-process-standards/03-roi-calculation-process' },
            { text: '财务指标流程', link: '/01-project-initiation/02-business-case/00-business-case-standard/02-process-standards/04-financial-indicators-process' },
            { text: '敏感性分析流程', link: '/01-project-initiation/02-business-case/00-business-case-standard/02-process-standards/05-sensitivity-analysis-process' },
            { text: '商业论证汇总流程', link: '/01-project-initiation/02-business-case/00-business-case-standard/02-process-standards/06-business-case-summary-process' }
          ]
        },
        {
          text: '技能文档',
          collapsed: true,
          items: [
            { text: '成本分析技能', link: '/01-project-initiation/02-business-case/00-business-case-standard/03-skills/cost-analysis-skill' },
            { text: '效益分析技能', link: '/01-project-initiation/02-business-case/00-business-case-standard/03-skills/benefit-analysis-skill' },
            { text: 'ROI计算技能', link: '/01-project-initiation/02-business-case/00-business-case-standard/03-skills/roi-calculation-skill' },
            { text: '财务指标技能', link: '/01-project-initiation/02-business-case/00-business-case-standard/03-skills/financial-indicators-skill' },
            { text: '敏感性分析技能', link: '/01-project-initiation/02-business-case/00-business-case-standard/03-skills/sensitivity-analysis-skill' },
            { text: '商业论证汇总技能', link: '/01-project-initiation/02-business-case/00-business-case-standard/03-skills/business-case-summary-skill' }
          ]
        },
        {
          text: '成本分析',
          collapsed: true,
          items: [
            { text: '开发成本', link: '/01-project-initiation/02-business-case/01-cost-analysis/01-cost-development' },
            { text: '运维成本', link: '/01-project-initiation/02-business-case/01-cost-analysis/02-cost-operation' },
            { text: '其他成本', link: '/01-project-initiation/02-business-case/01-cost-analysis/03-cost-other' }
          ]
        },
        {
          text: '效益分析',
          collapsed: true,
          items: [
            { text: '直接效益', link: '/01-project-initiation/02-business-case/02-benefit-analysis/04-benefit-direct' },
            { text: '间接效益', link: '/01-project-initiation/02-business-case/02-benefit-analysis/05-benefit-indirect' },
            { text: '战略效益', link: '/01-project-initiation/02-business-case/02-benefit-analysis/06-benefit-strategic' }
          ]
        },
        {
          text: 'ROI计算',
          collapsed: true,
          items: [
            { text: 'ROI计算', link: '/01-project-initiation/02-business-case/03-roi-calculation/07-roi-calculation' },
            { text: '投资回收期', link: '/01-project-initiation/02-business-case/03-roi-calculation/08-payback-period' }
          ]
        },
        {
          text: '财务指标',
          collapsed: true,
          items: [
            { text: 'NPV分析', link: '/01-project-initiation/02-business-case/04-financial-indicators/09-npv-analysis' },
            { text: 'IRR分析', link: '/01-project-initiation/02-business-case/04-financial-indicators/10-irr-analysis' }
          ]
        },
        {
          text: '敏感性分析',
          collapsed: true,
          items: [
            { text: '敏感性变量', link: '/01-project-initiation/02-business-case/05-sensitivity-analysis/11-sensitivity-variables' },
            { text: '情景分析', link: '/01-project-initiation/02-business-case/05-sensitivity-analysis/12-scenario-analysis' },
            { text: '风险调整ROI', link: '/01-project-initiation/02-business-case/05-sensitivity-analysis/13-risk-adjusted-roi' }
          ]
        },
        {
          text: '商业论证汇总',
          collapsed: true,
          items: [
            { text: '商业论证汇总 v1.0', link: '/01-project-initiation/02-business-case/06-business-case-summary/14-business-case-summary' },
            { text: '商业论证汇总 v1.1', link: '/01-project-initiation/02-business-case/06-business-case-summary/14-business-case-summary-v1.1' },
            { text: '商业论证评审', link: '/01-project-initiation/02-business-case/06-business-case-summary/14-business-case-summary-review' },
            { text: '商业论证审批', link: '/01-project-initiation/02-business-case/06-business-case-summary/15-business-case-approval' }
          ]
        }
      ],
      '/01-project-initiation/03-project-application/': [
        {
          text: '立项申请',
          items: [
            { text: '立项申请检查清单', link: '/01-project-initiation/03-project-application/00-project-application-standard/project-application-checklist' }
          ]
        },
        {
          text: '流程图',
          collapsed: true,
          items: [
            { text: '立项申请流程图', link: '/01-project-initiation/03-project-application/00-project-application-standard/01-process-diagrams/project-application-process-guide' }
          ]
        },
        {
          text: '流程标准',
          collapsed: true,
          items: [
            { text: '立项申请文档流程', link: '/01-project-initiation/03-project-application/00-project-application-standard/02-process-standards/project-application-documents-process' },
            { text: '支撑材料流程', link: '/01-project-initiation/03-project-application/00-project-application-standard/02-process-standards/supporting-materials-process' },
            { text: '审批流程', link: '/01-project-initiation/03-project-application/00-project-application-standard/02-process-standards/approval-process' }
          ]
        },
        {
          text: '技能文档',
          collapsed: true,
          items: [
            { text: '立项申请文档技能', link: '/01-project-initiation/03-project-application/00-project-application-standard/03-skills/project-application-documents-skill' },
            { text: '支撑材料技能', link: '/01-project-initiation/03-project-application/00-project-application-standard/03-skills/supporting-materials-skill' },
            { text: '审批技能', link: '/01-project-initiation/03-project-application/00-project-application-standard/03-skills/approval-process-skill' }
          ]
        },
        {
          text: '申请文档',
          collapsed: true,
          items: [
            { text: '立项申请表', link: '/01-project-initiation/03-project-application/01-application-documents/01-project-application-form' },
            { text: '立项申请报告', link: '/01-project-initiation/03-project-application/01-application-documents/02-project-application-report' },
            { text: '投资预算明细', link: '/01-project-initiation/03-project-application/01-application-documents/03-investment-budget-detail' }
          ]
        },
        {
          text: '支撑材料',
          collapsed: true,
          items: [
            { text: '章程摘要', link: '/01-project-initiation/03-project-application/02-supporting-materials/04-charter-summary' },
            { text: '商业论证摘要', link: '/01-project-initiation/03-project-application/02-supporting-materials/05-business-case-summary' },
            { text: '技术可行性', link: '/01-project-initiation/03-project-application/02-supporting-materials/06-technical-feasibility' },
            { text: '部门评审', link: '/01-project-initiation/03-project-application/02-supporting-materials/07-department-review' },
            { text: '财务评审', link: '/01-project-initiation/03-project-application/02-supporting-materials/08-finance-review' },
            { text: '技术评审', link: '/01-project-initiation/03-project-application/02-supporting-materials/09-technical-review' },
            { text: '高层审批', link: '/01-project-initiation/03-project-application/02-supporting-materials/10-executive-approval' },
            { text: '项目演示', link: '/01-project-initiation/03-project-application/02-supporting-materials/11-project-presentation' },
            { text: '功能需求', link: '/01-project-initiation/03-project-application/02-supporting-materials/12-functional-requirements' }
          ]
        }
      ],
      '/01-project-initiation/04-project-approval/': [
        {
          text: '立项审批',
          items: [
            { text: '立项审批检查清单', link: '/01-project-initiation/04-project-approval/00-project-approval-standard/project-approval-checklist' }
          ]
        },
        {
          text: '流程图',
          collapsed: true,
          items: [
            { text: '立项审批流程图', link: '/01-project-initiation/04-project-approval/00-project-approval-standard/01-process-diagrams/project-approval-process-guide' }
          ]
        },
        {
          text: '流程标准',
          collapsed: true,
          items: [
            { text: '立项审批文档流程', link: '/01-project-initiation/04-project-approval/00-project-approval-standard/02-process-standards/project-approval-documents-process' },
            { text: '项目启动流程', link: '/01-project-initiation/04-project-approval/00-project-approval-standard/02-process-standards/project-launch-process' }
          ]
        },
        {
          text: '技能文档',
          collapsed: true,
          items: [
            { text: '立项审批文档技能', link: '/01-project-initiation/04-project-approval/00-project-approval-standard/03-skills/project-approval-documents-skill' },
            { text: '项目启动技能', link: '/01-project-initiation/04-project-approval/00-project-approval-standard/03-skills/project-launch-skill' }
          ]
        },
        {
          text: '审批文档',
          collapsed: true,
          items: [
            { text: '立项审批通知', link: '/01-project-initiation/04-project-approval/01-approval-documents/01-project-approval-notice' },
            { text: '项目授权书', link: '/01-project-initiation/04-project-approval/01-approval-documents/02-project-authorization-letter' }
          ]
        },
        {
          text: '项目启动',
          collapsed: true,
          items: [
            { text: '项目启动通知', link: '/01-project-initiation/04-project-approval/02-project-launch/03-project-launch-notice' },
            { text: '启动会议纪要', link: '/01-project-initiation/04-project-approval/02-project-launch/04-project-kickoff-minutes' }
          ]
        }
      ],
      '/02-design/01-architecture/': [
        {
          text: '架构设计',
          items: [
            { text: '架构设计检查清单', link: '/02-design/01-architecture/00-architecture-standard/architecture-design-checklist' }
          ]
        },
        {
          text: '流程图',
          collapsed: true,
          items: [
            { text: '架构设计流程图', link: '/02-design/01-architecture/00-architecture-standard/01-process-diagrams/architecture-design-process-guide' }
          ]
        },
        {
          text: '流程标准',
          collapsed: true,
          items: [
            { text: '业务领域分析流程', link: '/02-design/01-architecture/00-architecture-standard/02-process-standards/01-business-domain-analysis-process' },
            { text: '业务流程分析流程', link: '/02-design/01-architecture/00-architecture-standard/02-process-standards/02-business-process-analysis-process' },
            { text: '业务场景分析流程', link: '/02-design/01-architecture/00-architecture-standard/02-process-standards/03-business-scenarios-analysis-process' },
            { text: '需求映射流程', link: '/02-design/01-architecture/00-architecture-standard/02-process-standards/04-requirement-mapping-process' },
            { text: '现状评估流程', link: '/02-design/01-architecture/00-architecture-standard/02-process-standards/05-current-assessment-process' },
            { text: '技术选型流程', link: '/02-design/01-architecture/00-architecture-standard/02-process-standards/06-technology-selection-process' },
            { text: '架构约束流程', link: '/02-design/01-architecture/00-architecture-standard/02-process-standards/07-architecture-constraints-process' },
            { text: '系统架构设计流程', link: '/02-design/01-architecture/00-architecture-standard/02-process-standards/08-system-architecture-design-process' },
            { text: '技术架构流程', link: '/02-design/01-architecture/00-architecture-standard/02-process-standards/08-technical-architecture-process' },
            { text: '部署架构流程', link: '/02-design/01-architecture/00-architecture-standard/02-process-standards/09-deployment-architecture-process' },
            { text: '安全架构流程', link: '/02-design/01-architecture/00-architecture-standard/02-process-standards/10-security-architecture-process' },
            { text: '服务设计流程', link: '/02-design/01-architecture/00-architecture-standard/02-process-standards/11-service-design-process' },
            { text: '开发组件流程', link: '/02-design/01-architecture/00-architecture-standard/02-process-standards/12-development-components-process' },
            { text: '部署组件流程', link: '/02-design/01-architecture/00-architecture-standard/02-process-standards/13-deployment-components-process' },
            { text: '架构技术清单流程', link: '/02-design/01-architecture/00-architecture-standard/02-process-standards/14-architecture-technology-list-process' },
            { text: '安全检查清单流程', link: '/02-design/01-architecture/00-architecture-standard/02-process-standards/15-security-checklist-process' }
          ]
        },
        {
          text: '技能文档',
          collapsed: true,
          items: [
            { text: '业务领域分析技能', link: '/02-design/01-architecture/00-architecture-standard/03-skills/business-domain-analysis-process.skill' },
            { text: '业务流程分析技能', link: '/02-design/01-architecture/00-architecture-standard/03-skills/business-process-analysis-process.skill' },
            { text: '业务场景分析技能', link: '/02-design/01-architecture/00-architecture-standard/03-skills/business-scenarios-analysis-process.skill' },
            { text: '需求映射技能', link: '/02-design/01-architecture/00-architecture-standard/03-skills/requirement-mapping-process.skill' },
            { text: '现状评估技能', link: '/02-design/01-architecture/00-architecture-standard/03-skills/current-assessment-process.skill' },
            { text: '技术选型技能', link: '/02-design/01-architecture/00-architecture-standard/03-skills/technology-selection-process.skill' },
            { text: '架构约束技能', link: '/02-design/01-architecture/00-architecture-standard/03-skills/architecture-constraints-process.skill' },
            { text: '系统架构设计技能', link: '/02-design/01-architecture/00-architecture-standard/03-skills/system-architecture-design-process.skill' },
            { text: '技术架构技能', link: '/02-design/01-architecture/00-architecture-standard/03-skills/technical-architecture-process.skill' },
            { text: '部署架构技能', link: '/02-design/01-architecture/00-architecture-standard/03-skills/deployment-architecture-process.skill' },
            { text: '安全架构技能', link: '/02-design/01-architecture/00-architecture-standard/03-skills/security-architecture-process.skill' },
            { text: '服务设计技能', link: '/02-design/01-architecture/00-architecture-standard/03-skills/service-design-process.skill' },
            { text: '开发组件技能', link: '/02-design/01-architecture/00-architecture-standard/03-skills/development-components-process.skill' },
            { text: '部署组件技能', link: '/02-design/01-architecture/00-architecture-standard/03-skills/deployment-components-process.skill' },
            { text: '架构技术清单技能', link: '/02-design/01-architecture/00-architecture-standard/03-skills/architecture-technology-list-process.skill' },
            { text: '安全检查清单技能', link: '/02-design/01-architecture/00-architecture-standard/03-skills/security-checklist-process.skill' }
          ]
        },
        {
          text: '业务分析',
          collapsed: true,
          items: [
            { text: '领域边界', link: '/02-design/01-architecture/01-business-analysis/01-domain-analysis/01-domain-boundaries' },
            { text: '领域模型', link: '/02-design/01-architecture/01-business-analysis/01-domain-analysis/02-domain-model' },
            { text: '领域分析评审', link: '/02-design/01-architecture/01-business-analysis/01-domain-analysis/03-domain-analysis-review-record' },
            { text: '核心流程', link: '/02-design/01-architecture/01-business-analysis/02-business-process/01-core-processes' },
            { text: '业务规则', link: '/02-design/01-architecture/01-business-analysis/02-business-process/02-business-rules' },
            { text: '业务流程评审', link: '/02-design/01-architecture/01-business-analysis/02-business-process/03-business-process-review-record' },
            { text: '用户场景', link: '/02-design/01-architecture/01-business-analysis/03-business-scenarios/01-user-scenarios' },
            { text: '集成场景', link: '/02-design/01-architecture/01-business-analysis/03-business-scenarios/02-integration-scenarios' },
            { text: '业务场景评审', link: '/02-design/01-architecture/01-business-analysis/03-business-scenarios/03-business-scenarios-review-record' }
          ]
        },
        {
          text: '架构分析',
          collapsed: true,
          items: [
            { text: '功能需求映射', link: '/02-design/01-architecture/02-architecture-analysis/01-requirement-mapping/01-functional-requirements-mapping' },
            { text: '非功能需求映射', link: '/02-design/01-architecture/02-architecture-analysis/01-requirement-mapping/02-non-functional-requirements-mapping' },
            { text: '需求映射评审', link: '/02-design/01-architecture/02-architecture-analysis/01-requirement-mapping/03-requirement-mapping-review-record' },
            { text: '现有架构清单', link: '/02-design/01-architecture/02-architecture-analysis/02-current-assessment/01-current-architecture-inventory' },
            { text: '架构差距分析', link: '/02-design/01-architecture/02-architecture-analysis/02-current-assessment/02-architecture-gap-analysis' },
            { text: '现状评估评审', link: '/02-design/01-architecture/02-architecture-analysis/02-current-assessment/03-current-assessment-review-record' },
            { text: '技术选型报告', link: '/02-design/01-architecture/02-architecture-analysis/03-technology-selection/01-technology-selection-report' },
            { text: '架构风格决策', link: '/02-design/01-architecture/02-architecture-analysis/03-technology-selection/02-architecture-style-adr' },
            { text: '技术选型评审', link: '/02-design/01-architecture/02-architecture-analysis/03-technology-selection/03-technology-selection-review-record' },
            { text: '技术约束', link: '/02-design/01-architecture/02-architecture-analysis/04-architecture-constraints/01-technical-constraints' },
            { text: '安全合规', link: '/02-design/01-architecture/02-architecture-analysis/04-architecture-constraints/02-security-compliance' },
            { text: '架构约束评审', link: '/02-design/01-architecture/02-architecture-analysis/04-architecture-constraints/03-architecture-constraints-review-record' }
          ]
        },
        {
          text: '架构设计',
          collapsed: true,
          items: [
            { text: '逻辑架构', link: '/02-design/01-architecture/03-architecture-design/01-system-architecture/01-logical-architecture' },
            { text: '物理架构', link: '/02-design/01-architecture/03-architecture-design/01-system-architecture/02-physical-architecture' },
            { text: '系统架构评审', link: '/02-design/01-architecture/03-architecture-design/01-system-architecture/03-system-architecture-review-record' },
            { text: '前端架构', link: '/02-design/01-architecture/03-architecture-design/02-technical-architecture/01-frontend-architecture' },
            { text: '后端架构', link: '/02-design/01-architecture/03-architecture-design/02-technical-architecture/02-backend-architecture' },
            { text: '数据架构', link: '/02-design/01-architecture/03-architecture-design/02-technical-architecture/03-data-architecture' },
            { text: '技术架构评审', link: '/02-design/01-architecture/03-architecture-design/02-technical-architecture/04-technical-architecture-review-record' },
            { text: '部署架构', link: '/02-design/01-architecture/03-architecture-design/03-deployment-architecture/01-deployment-architecture' },
            { text: '高可用架构', link: '/02-design/01-architecture/03-architecture-design/03-deployment-architecture/02-high-availability-architecture' },
            { text: '部署架构评审', link: '/02-design/01-architecture/03-architecture-design/03-deployment-architecture/03-deployment-architecture-review-record' },
            { text: '认证授权架构', link: '/02-design/01-architecture/03-architecture-design/04-security-architecture/01-authentication-authorization-architecture' },
            { text: '数据安全架构', link: '/02-design/01-architecture/03-architecture-design/04-security-architecture/02-data-security-architecture' },
            { text: '安全架构评审', link: '/02-design/01-architecture/03-architecture-design/04-security-architecture/03-security-architecture-review-record' },
            { text: '服务划分', link: '/02-design/01-architecture/03-architecture-design/05-service-design/01-service-division' },
            { text: '服务交互', link: '/02-design/01-architecture/03-architecture-design/05-service-design/02-service-interaction' },
            { text: '服务设计评审', link: '/02-design/01-architecture/03-architecture-design/05-service-design/03-service-design-review-record' },
            { text: '前端组件', link: '/02-design/01-architecture/03-architecture-design/06-development-components/01-frontend-components' },
            { text: '后端组件', link: '/02-design/01-architecture/03-architecture-design/06-development-components/02-backend-components' },
            { text: '开发组件评审', link: '/02-design/01-architecture/03-architecture-design/06-development-components/03-development-components-review-record' },
            { text: '容器化', link: '/02-design/01-architecture/03-architecture-design/07-deployment-components/01-containerization' },
            { text: '运维组件', link: '/02-design/01-architecture/03-architecture-design/07-deployment-components/02-operation-components' },
            { text: '部署组件评审', link: '/02-design/01-architecture/03-architecture-design/07-deployment-components/03-deployment-components-review-record' }
          ]
        },
        {
          text: '技术清单',
          collapsed: true,
          items: [
            { text: '前端技术清单', link: '/02-design/01-architecture/04-architecture-technology-list/01-technology-selection-list/01-frontend-technology-list' },
            { text: '后端技术清单', link: '/02-design/01-architecture/04-architecture-technology-list/01-technology-selection-list/02-backend-technology-list' },
            { text: '基础设施技术清单', link: '/02-design/01-architecture/04-architecture-technology-list/01-technology-selection-list/03-infrastructure-technology-list' },
            { text: '技术清单评审', link: '/02-design/01-architecture/04-architecture-technology-list/01-technology-selection-list/04-technology-selection-list-review-record' },
            { text: '认证安全清单', link: '/02-design/01-architecture/04-architecture-technology-list/02-security-checklist/01-authentication-security-checklist' },
            { text: '授权安全清单', link: '/02-design/01-architecture/04-architecture-technology-list/02-security-checklist/02-authorization-security-checklist' },
            { text: '数据安全清单', link: '/02-design/01-architecture/04-architecture-technology-list/02-security-checklist/03-data-security-checklist' },
            { text: '等保三级清单', link: '/02-design/01-architecture/04-architecture-technology-list/02-security-checklist/04-compliance-level3-checklist' },
            { text: '安全检查清单评审', link: '/02-design/01-architecture/04-architecture-technology-list/02-security-checklist/05-security-checklist-review-record' }
          ]
        },
        {
          text: '架构评审',
          collapsed: true,
          items: [
            { text: '架构评审通知', link: '/02-design/01-architecture/05-architecture-review/01-architecture-review-notice' },
            { text: '架构评审议程', link: '/02-design/01-architecture/05-architecture-review/02-architecture-review-agenda' },
            { text: '架构评审报告', link: '/02-design/01-architecture/05-architecture-review/03-architecture-review-report' },
            { text: '架构评审记录', link: '/02-design/01-architecture/05-architecture-review/04-architecture-review-record' },
            { text: '架构基线', link: '/02-design/01-architecture/05-architecture-review/05-architecture-baseline' }
          ]
        }
      ],
      '/02-design/02-database/': [
        {
          text: '数据库设计',
          items: [
            { text: '数据库设计检查清单', link: '/02-design/02-database/00-database-standard/database-design-checklist' }
          ]
        },
        {
          text: '流程图',
          collapsed: true,
          items: [
            { text: '数据库设计流程图', link: '/02-design/02-database/00-database-standard/01-process-diagrams/database-design-process-guide' }
          ]
        },
        {
          text: '流程标准',
          collapsed: true,
          items: [
            { text: '数据库设计标准流程', link: '/02-design/02-database/00-database-standard/02-process-standards/01-database-design-standard-process' },
            { text: '数据库设计流程', link: '/02-design/02-database/00-database-standard/02-process-standards/02-database-design-process' },
            { text: '数据字典流程', link: '/02-design/02-database/00-database-standard/02-process-standards/03-data-dictionary-process' },
            { text: 'SQL脚本流程', link: '/02-design/02-database/00-database-standard/02-process-standards/04-sql-scripts-process' }
          ]
        },
        {
          text: '技能文档',
          collapsed: true,
          items: [
            { text: '数据库设计标准技能', link: '/02-design/02-database/00-database-standard/03-skills/database-design-standard-process.skill' },
            { text: '数据库设计技能', link: '/02-design/02-database/00-database-standard/03-skills/database-design-process.skill' },
            { text: '数据字典技能', link: '/02-design/02-database/00-database-standard/03-skills/data-dictionary-process.skill' },
            { text: 'SQL脚本技能', link: '/02-design/02-database/00-database-standard/03-skills/sql-scripts-process.skill' }
          ]
        },
        {
          text: '设计标准',
          collapsed: true,
          items: [
            { text: '数据库命名规范', link: '/02-design/02-database/01-database-design-standard/01-database-naming-convention' },
            { text: 'SQL编码规范', link: '/02-design/02-database/01-database-design-standard/02-sql-coding-standard' },
            { text: '数据库评审标准', link: '/02-design/02-database/01-database-design-standard/03-database-review-standard' },
            { text: '数据字典标准', link: '/02-design/02-database/01-database-design-standard/04-data-dictionary-standard' }
          ]
        },
        {
          text: '数据库设计',
          collapsed: true,
          items: [
            { text: '逻辑数据模型', link: '/02-design/02-database/02-database-design/01-logical-data-model' },
            { text: '物理数据模型', link: '/02-design/02-database/02-database-design/02-physical-data-model' },
            { text: '数据库索引设计', link: '/02-design/02-database/02-database-design/03-database-index-design' },
            { text: '数据库分区设计', link: '/02-design/02-database/02-database-design/04-database-partition-design' },
            { text: '数据库备份策略', link: '/02-design/02-database/02-database-design/05-database-backup-strategy' },
            { text: '数据库设计评审', link: '/02-design/02-database/02-database-design/06-database-design-review-record' }
          ]
        },
        {
          text: '数据字典',
          collapsed: true,
          items: [
            { text: '系统数据字典', link: '/02-design/02-database/03-data-dictionary/01-system-data-dictionary' },
            { text: '业务数据字典', link: '/02-design/02-database/03-data-dictionary/02-business-data-dictionary' },
            { text: '数据字典评审', link: '/02-design/02-database/03-data-dictionary/03-data-dictionary-review-record' }
          ]
        },
        {
          text: 'SQL脚本',
          collapsed: true,
          items: [
            { text: '迁移脚本说明', link: '/02-design/02-database/04-sql-scripts/04-migration-scripts/README' },
            { text: 'SQL脚本评审', link: '/02-design/02-database/04-sql-scripts/sql-scripts-review-record' }
          ]
        },
        {
          text: '数据库评审',
          collapsed: true,
          items: [
            { text: '评审通知', link: '/02-design/02-database/05-database-review/01-database-review-notice' },
            { text: '评审议程', link: '/02-design/02-database/05-database-review/02-database-review-agenda' },
            { text: '评审报告', link: '/02-design/02-database/05-database-review/03-database-review-report' },
            { text: '评审记录', link: '/02-design/02-database/05-database-review/04-database-review-record' },
            { text: '数据库基线', link: '/02-design/02-database/05-database-review/05-database-baseline' }
          ]
        }
      ],
      '/02-design/03-interface-design/': [
        {
          text: '接口设计',
          items: [
            { text: '接口设计检查清单', link: '/02-design/03-interface-design/00-interface-standard/interface-design-checklist' }
          ]
        },
        {
          text: '流程图',
          collapsed: true,
          items: [
            { text: '接口设计流程图', link: '/02-design/03-interface-design/00-interface-standard/01-process-diagrams/interface-design-process' }
          ]
        },
        {
          text: '流程标准',
          collapsed: true,
          items: [
            { text: '接口标准流程', link: '/02-design/03-interface-design/00-interface-standard/02-process-standards/05-interface-standard-process' },
            { text: 'API接口清单流程', link: '/02-design/03-interface-design/00-interface-standard/02-process-standards/06-api-interface-list-process' }
          ]
        },
        {
          text: '技能文档',
          collapsed: true,
          items: [
            { text: '接口标准技能', link: '/02-design/03-interface-design/00-interface-standard/03-skills/interface-standard-process.skill' },
            { text: 'API接口清单技能', link: '/02-design/03-interface-design/00-interface-standard/03-skills/api-interface-list-process.skill' }
          ]
        },
        {
          text: 'REST API标准',
          collapsed: true,
          items: [
            { text: 'RESTful API标准', link: '/02-design/03-interface-design/01-rest-api-standard/01-restful-api-standard' },
            { text: '接口安全标准', link: '/02-design/03-interface-design/01-rest-api-standard/02-interface-security-standard' },
            { text: '接口版本标准', link: '/02-design/03-interface-design/01-rest-api-standard/03-interface-version-standard' }
          ]
        },
        {
          text: 'API接口规范',
          collapsed: true,
          items: [
            { text: 'API接口清单', link: '/02-design/03-interface-design/02-api-specification/01-api-interface-list' },
            { text: '用户API规范', link: '/02-design/03-interface-design/02-api-specification/02-user-api-specification' },
            { text: '角色API规范', link: '/02-design/03-interface-design/02-api-specification/03-role-api-specification' },
            { text: '组织API规范', link: '/02-design/03-interface-design/02-api-specification/04-org-api-specification' },
            { text: '系统API规范', link: '/02-design/03-interface-design/02-api-specification/05-system-api-specification' }
          ]
        },
        {
          text: '接口评审',
          collapsed: true,
          items: [
            { text: '接口评审通知', link: '/02-design/03-interface-design/03-interface-review/01-interface-review-notice' },
            { text: '接口评审议程', link: '/02-design/03-interface-design/03-interface-review/02-interface-review-agenda' },
            { text: '接口评审报告', link: '/02-design/03-interface-design/03-interface-review/03-interface-review-report' },
            { text: '接口评审记录', link: '/02-design/03-interface-design/03-interface-review/04-interface-review-record' },
            { text: '接口基线', link: '/02-design/03-interface-design/03-interface-review/05-interface-baseline' }
          ]
        }
      ],
      '/02-design/04-ui-ux-design/': [
        {
          text: 'UI/UX设计',
          items: [
            { text: 'UI/UX设计检查清单', link: '/02-design/04-ui-ux-design/00-ui-ux-design-standards/ui-ux-design-checklist' }
          ]
        },
        {
          text: '流程图',
          collapsed: true,
          items: [
            { text: 'UI/UX整体流程', link: '/02-design/04-ui-ux-design/00-ui-ux-design-standards/01-process-diagrams/01-ui-ux-overall-process' }
          ]
        },
        {
          text: '流程标准',
          collapsed: true,
          items: [
            { text: '用户研究流程', link: '/02-design/04-ui-ux-design/00-ui-ux-design-standards/02-process-standards/01-user-research-process' },
            { text: '信息架构流程', link: '/02-design/04-ui-ux-design/00-ui-ux-design-standards/02-process-standards/02-information-architecture-process' },
            { text: '交互设计流程', link: '/02-design/04-ui-ux-design/00-ui-ux-design-standards/02-process-standards/03-interaction-design-process' },
            { text: '视觉设计流程', link: '/02-design/04-ui-ux-design/00-ui-ux-design-standards/02-process-standards/04-visual-design-process' },
            { text: '原型设计流程', link: '/02-design/04-ui-ux-design/00-ui-ux-design-standards/02-process-standards/05-prototype-design-process' },
            { text: '模块设计流程', link: '/02-design/04-ui-ux-design/00-ui-ux-design-standards/02-process-standards/06-module-design-process' }
          ]
        },
        {
          text: '技能文档',
          collapsed: true,
          items: [
            { text: 'UI/UX设计技能', link: '/02-design/04-ui-ux-design/00-ui-ux-design-standards/03-skills/ui-ux-design-process.skill' }
          ]
        },
        {
          text: '用户研究',
          collapsed: true,
          items: [
            { text: '用户画像设计', link: '/02-design/04-ui-ux-design/01-user-research/01-user-personas-design' },
            { text: '用户行为模式', link: '/02-design/04-ui-ux-design/01-user-research/02-user-behavior-patterns' },
            { text: '交互习惯研究', link: '/02-design/04-ui-ux-design/01-user-research/03-interaction-habits-research' },
            { text: '视觉偏好研究', link: '/02-design/04-ui-ux-design/01-user-research/04-visual-preference-research' },
            { text: '设计场景', link: '/02-design/04-ui-ux-design/01-user-research/05-design-scenarios' },
            { text: '设计机会', link: '/02-design/04-ui-ux-design/01-user-research/06-design-opportunities' },
            { text: '用户研究评审', link: '/02-design/04-ui-ux-design/01-user-research/07-user-research-review-record' }
          ]
        },
        {
          text: '信息架构',
          collapsed: true,
          items: [
            { text: '站点地图', link: '/02-design/04-ui-ux-design/02-information-architecture/01-site-map' },
            { text: '导航结构', link: '/02-design/04-ui-ux-design/02-information-architecture/02-navigation-structure' },
            { text: '内容分类', link: '/02-design/04-ui-ux-design/02-information-architecture/03-content-classification' },
            { text: '信息架构评审', link: '/02-design/04-ui-ux-design/02-information-architecture/04-information-architecture-review-record' }
          ]
        },
        {
          text: '交互设计',
          collapsed: true,
          items: [
            { text: '任务流程设计', link: '/02-design/04-ui-ux-design/03-interaction-design/01-task-flows/01-task-flow-design' },
            { text: '线框图设计', link: '/02-design/04-ui-ux-design/03-interaction-design/01-task-flows/02-wireframe-design' },
            { text: '交互规范', link: '/02-design/04-ui-ux-design/03-interaction-design/01-task-flows/03-interaction-specification' },
            { text: '交互设计评审', link: '/02-design/04-ui-ux-design/03-interaction-design/01-task-flows/04-interaction-design-review-record' }
          ]
        },
        {
          text: '线框图设计',
          collapsed: true,
          items: [
            { text: '设计系统', link: '/02-design/04-ui-ux-design/03-interaction-design/02-wireframes/01-design-system' },
            { text: '视觉设计', link: '/02-design/04-ui-ux-design/03-interaction-design/02-wireframes/02-visual-design' },
            { text: '高保真原型', link: '/02-design/04-ui-ux-design/03-interaction-design/02-wireframes/03-mockups-design' },
            { text: '视觉设计评审', link: '/02-design/04-ui-ux-design/03-interaction-design/02-wireframes/04-visual-design-review-record' }
          ]
        },
        {
          text: '原型设计',
          collapsed: true,
          items: [
            { text: '原型规范', link: '/02-design/04-ui-ux-design/05-prototypes/01-prototype-specification' },
            { text: '交互原型', link: '/02-design/04-ui-ux-design/05-prototypes/02-interactive-prototype' },
            { text: '原型评审', link: '/02-design/04-ui-ux-design/05-prototypes/03-prototype-review-record' }
          ]
        },
        {
          text: '模块设计',
          collapsed: true,
          items: [
            { text: '用户管理模块', link: '/02-design/04-ui-ux-design/06-module-design/01-user-management-module' },
            { text: '组织模块', link: '/02-design/04-ui-ux-design/06-module-design/02-organization-module' },
            { text: '权限模块', link: '/02-design/04-ui-ux-design/06-module-design/03-permission-module' },
            { text: '系统配置模块', link: '/02-design/04-ui-ux-design/06-module-design/04-system-config-module' },
            { text: '模块设计评审', link: '/02-design/04-ui-ux-design/06-module-design/05-module-design-review-record' }
          ]
        }
      ],
      '/03-iterations/': [
        {
          text: '迭代开发',
          items: [
            { text: '迭代检查清单', link: '/03-iterations/00-sprint-standards/iteration-checklist' }
          ]
        },
        {
          text: '迭代标准',
          collapsed: true,
          items: [
            { text: '流程图', link: '/03-iterations/00-sprint-standards/01-process-diagrams/iteration-process-diagrams' },
            { text: '流程标准', link: '/03-iterations/00-sprint-standards/02-process-standards/iteration-process-standards' },
            { text: '技能文档', link: '/03-iterations/00-sprint-standards/03-skills/iteration-process-skill' }
          ]
        },
        {
          text: 'Sprint 1 - 核心功能',
          collapsed: true,
          items: [
            { text: '产品工作', link: '/03-iterations/01-sprint-1-core/01-product-work/01-requirement-selection/requirement-selection-record' },
            { text: '原型设计', link: '/03-iterations/01-sprint-1-core/01-product-work/02-prototype-design/prototype-design' },
            { text: '产品评审', link: '/03-iterations/01-sprint-1-core/01-product-work/03-product-review/product-review-record' },
            { text: '迭代目标', link: '/03-iterations/01-sprint-1-core/02-iteration-plan/01-iteration-goal' },
            { text: '用户故事', link: '/03-iterations/01-sprint-1-core/02-iteration-plan/02-user-stories' },
            { text: '任务分解', link: '/03-iterations/01-sprint-1-core/02-iteration-plan/03-task-breakdown' },
            { text: '工作量估算', link: '/03-iterations/01-sprint-1-core/02-iteration-plan/04-effort-estimation' },
            { text: '每日站会模板', link: '/03-iterations/01-sprint-1-core/03-daily-standup/daily-standup-template' },
            { text: '认证模块开发', link: '/03-iterations/01-sprint-1-core/04-development/01-auth-module/auth-module-development' },
            { text: '用户模块开发', link: '/03-iterations/01-sprint-1-core/04-development/02-user-module/user-module-development' },
            { text: '组织模块开发', link: '/03-iterations/01-sprint-1-core/04-development/03-organization-module/organization-module-development' },
            { text: 'CI/CD记录', link: '/03-iterations/01-sprint-1-core/05-ci-cd/ci-cd-records' },
            { text: '迭代评审', link: '/03-iterations/01-sprint-1-core/06-iteration-review/iteration-review' },
            { text: '迭代回顾', link: '/03-iterations/01-sprint-1-core/07-retrospective/iteration-retrospective' }
          ]
        },
        {
          text: 'Sprint 2 - 扩展功能',
          collapsed: true,
          items: [
            { text: '迭代目标', link: '/03-iterations/02-sprint-2-extension/00-iteration-plan/01-iteration-goal' },
            { text: '用户故事', link: '/03-iterations/02-sprint-2-extension/00-iteration-plan/02-user-stories' },
            { text: '任务分解', link: '/03-iterations/02-sprint-2-extension/00-iteration-plan/03-task-breakdown' },
            { text: '工作量估算', link: '/03-iterations/02-sprint-2-extension/00-iteration-plan/04-effort-estimation' },
            { text: '每日站会模板', link: '/03-iterations/02-sprint-2-extension/01-daily-standup/daily-standup-template' },
            { text: '权限模块开发', link: '/03-iterations/02-sprint-2-extension/02-development/01-permission-module/permission-module-development' },
            { text: '角色模块开发', link: '/03-iterations/02-sprint-2-extension/02-development/02-role-module/role-module-development' },
            { text: '系统配置模块开发', link: '/03-iterations/02-sprint-2-extension/02-development/03-system-config-module/system-config-module-development' },
            { text: 'CI/CD记录', link: '/03-iterations/02-sprint-2-extension/03-ci-cd/ci-cd-records' },
            { text: '迭代评审', link: '/03-iterations/02-sprint-2-extension/04-iteration-review/iteration-review' },
            { text: '迭代回顾', link: '/03-iterations/02-sprint-2-extension/05-retrospective/iteration-retrospective' }
          ]
        },
        {
          text: 'Sprint 3 - 优化完善',
          collapsed: true,
          items: [
            { text: '迭代目标', link: '/03-iterations/03-sprint-3-refinement/00-iteration-plan/01-iteration-goal' },
            { text: '用户故事', link: '/03-iterations/03-sprint-3-refinement/00-iteration-plan/02-user-stories' },
            { text: '任务分解', link: '/03-iterations/03-sprint-3-refinement/00-iteration-plan/03-task-breakdown' },
            { text: '工作量估算', link: '/03-iterations/03-sprint-3-refinement/00-iteration-plan/04-effort-estimation' },
            { text: '每日站会模板', link: '/03-iterations/03-sprint-3-refinement/01-daily-standup/daily-standup-template' },
            { text: '审计日志模块开发', link: '/03-iterations/03-sprint-3-refinement/02-development/01-audit-log-module/audit-log-module-development' },
            { text: '通知模块开发', link: '/03-iterations/03-sprint-3-refinement/02-development/02-notification-module/notification-module-development' },
            { text: '性能优化', link: '/03-iterations/03-sprint-3-refinement/02-development/03-performance-optimization/performance-optimization' },
            { text: 'CI/CD记录', link: '/03-iterations/03-sprint-3-refinement/03-ci-cd/ci-cd-records' },
            { text: '迭代评审', link: '/03-iterations/03-sprint-3-refinement/04-iteration-review/iteration-review' },
            { text: '迭代回顾', link: '/03-iterations/03-sprint-3-refinement/05-retrospective/iteration-retrospective' }
          ]
        },
        {
          text: '迭代汇总',
          collapsed: true,
          items: [
            { text: '迭代总结', link: '/03-iterations/04-sprint-summary/iteration-summary' }
          ]
        }
      ],
      '/04-testing/': [
        {
          text: '测试验证',
          items: [
            { text: '单元测试', link: '/04-testing/01-unit/unit-testing' },
            { text: '集成测试', link: '/04-testing/02-integration/integration-testing' },
            { text: '系统测试', link: '/04-testing/03-system/system-testing' },
            { text: 'UAT测试', link: '/04-testing/04-uat/uat-testing' },
            { text: '测试总结报告', link: '/04-testing/05-testing-reports/testing-summary-report' }
          ]
        }
      ],
      '/05-deployment/': [
        {
          text: '部署上线',
          items: [
            { text: '环境搭建', link: '/05-deployment/01-environment/environment-setup' },
            { text: '部署配置', link: '/05-deployment/02-config/deployment-config' },
            { text: '部署脚本', link: '/05-deployment/03-scripts/deployment-scripts' }
          ]
        }
      ],
      '/06-operations/': [
        {
          text: '运维维护',
          items: [
            { text: '监控配置', link: '/06-operations/01-monitoring/monitoring-config' },
            { text: '维护指南', link: '/06-operations/02-maintenance/maintenance-guide' },
            { text: '备份策略', link: '/06-operations/03-backup/backup-strategy' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    search: {
      provider: 'local'
    },

    outline: {
      level: 'deep'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 linsir | 鄂ICP备99999999号'
    }
  }
})
