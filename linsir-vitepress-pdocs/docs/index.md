---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "System系统基础平台"
  text: "AI赋能项目管理"
  tagline: 采用瀑布+敏捷混合模式，覆盖项目全生命周期管理
  actions:
    - theme: brand
      text: 开始使用
      link: /getting-started
    - theme: alt
      text: 项目计划
      link: /PROJECT-PLAN

features:
  - icon: 📋
    title: 项目准备
    details: 需求调研、技术预研、可行性分析、方案设计。为项目奠定坚实基础。
  - icon: 🚀
    title: 项目立项
    details: 编写项目章程、商业论证、ROI分析、立项审批。正式启动项目。
  - icon: 🏗️
    title: 系统设计
    details: 架构设计、数据库设计、接口设计、UI/UX设计。构建技术蓝图。
  - icon: ⚡
    title: 迭代开发
    details: 敏捷迭代、每日站会、持续集成、迭代评审。快速交付价值。
  - icon: 🧪
    title: 测试验证
    details: 单元测试、集成测试、系统测试、UAT验收。确保质量可靠。
  - icon: 🎯
    title: 部署上线
    details: 部署准备、生产部署、上线验证、监控配置。顺利发布产品。
  - icon: 🔧
    title: 运维维护
    details: 持续运维、监控报警、迭代优化、新需求响应。保障稳定运行。
---

## 项目实施流程

<div class="project-phases">

### 第一阶段：项目准备（瀑布）
![项目准备](/imgs/01-phase1-project-preparation.png)

### 第二阶段：项目立项（瀑布）
![项目立项](/imgs/02-phase2-project-initiation.png)

### 第三阶段：系统设计（瀑布）
![系统设计](/imgs/03-phase3-system-design.png)

### 第四阶段：迭代开发（敏捷）
![迭代开发](/imgs/04-phase4-iterative-development.png)

### 第五阶段：测试验证（瀑布+敏捷）
![测试验证](/imgs/05-phase5-testing-validation.png)

### 第六阶段：部署上线（瀑布）
![部署上线](/imgs/06-phase6-deployment.png)

### 第七阶段：运维维护（敏捷）
![运维维护](/imgs/07-phase7-operations-maintenance.png)

</div>

<style>
.project-phases img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
}
.project-phases h3 {
  margin-top: 2rem;
  color: var(--vp-c-brand);
}
</style>
