import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "System项目AI文档",
  description: "项目准备与需求分析文档库",
  head: [
    ['link', { rel: 'icon', href: '/images/logo.png' }]
  ],
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/images/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '开始使用', link: '/getting-started' },
      { text: '实施流程', link: '/project-implementation-flow' },
      { 
        text: '项目准备',
        items: [
          { text: '项目计划', link: '/PROJECT-PLAN' },
          { text: '实施流程图', link: '/project-implementation-flow' },
          { text: '系统业务需求', link: '/00-project-preparation/01-system-business-requirements/01-business-requirements-v1.0' },
          { text: '需求分析', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/requirements-analysis-checklist' }
        ]
      }
    ],

    sidebar: {
      '/': [
        {
          text: '项目指南',
          items: [
            { text: '开始使用', link: '/getting-started' },
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
          text: '标准规范',
          collapsed: true,
          items: [
            { text: '需求分析流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/requirements-analysis-process' },
            { text: '用户访谈流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/user-interview-process' },
            { text: '用户访谈技能', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/user-interview-process-skill' },
            { text: '现状调研流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/current-situation-research-process' },
            { text: '竞品分析流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/competitor-analysis-process' },
            { text: '干系人分析流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/stakeholder-analysis-process' },
            { text: '用户画像流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/user-persona-process' },
            { text: '业务流程梳理流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/business-process-refinement-process' },
            { text: '需求细化流程', link: '/00-project-preparation/02-requirements-analysis/00-requirements-analysis-standard/requirement-refinement-process' }
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
      copyright: 'Copyright © 2026 项目文档中心 | 京ICP备XXXXXXXX号'
    }
  }
})
