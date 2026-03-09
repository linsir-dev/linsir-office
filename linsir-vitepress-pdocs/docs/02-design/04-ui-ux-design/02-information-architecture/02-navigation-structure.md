# 导航结构设计

**文档编号**: SYS-UX-IA-002  
**版本**: 1.0 (基线版本)  
**日期**: 2026-03-09  
**编制**: UI/UX设计师  
**审核**: 产品经理  
**批准**: 项目总监  
**状态**: ✓ 已基线

---

## 一、文档概述

### 1.1 文档目的

本文档定义系统的导航结构，包括主导航、辅助导航、面包屑导航等，确保用户能够高效地在系统中定位和切换功能模块。

### 1.2 参考文档

- [站点地图](01-site-map.md)
- [设计导向用户画像](../01-user-research/01-user-personas-design.md)
- [用户行为模式分析](../01-user-research/02-user-behavior-patterns.md)

---

## 二、导航设计原则

### 2.1 核心原则

| 原则 | 描述 | 设计体现 |
|------|------|---------|
| **可见性** | 导航始终可见，用户知道当前位置 | 固定侧边栏、高亮当前菜单 |
| **一致性** | 导航结构保持一致 | 统一的菜单样式、交互方式 |
| **高效性** | 减少点击次数，快速到达目标 | 常用功能快捷入口、收藏功能 |
| **可扩展性** | 支持未来功能扩展 | 层级清晰、支持子菜单 |
| **权限控制** | 根据角色显示不同菜单 | 动态菜单、权限过滤 |

### 2.2 用户类型导航差异

| 用户类型 | 导航特点 | 设计策略 |
|---------|---------|---------|
| 系统管理员 | 功能全面、层级较深 | 完整菜单树、支持折叠展开 |
| 部门负责人 | 关注数据、移动优先 | 简化菜单、快捷入口突出 |
| 普通用户 | 功能简单、操作少 | 精简菜单、突出常用功能 |

---

## 三、主导航结构

### 3.1 侧边栏导航（桌面端）

```
┌─────────────────────────────────────┐
│  Logo / 系统名称                     │
├─────────────────────────────────────┤
│                                     │
│  🏠 首页                            │
│                                     │
│  👤 用户管理                        │
│     ├─ 用户列表                     │
│     ├─ 用户创建                     │
│     └─ 批量导入                     │
│                                     │
│  🏢 组织架构                        │
│     ├─ 部门管理                     │
│     ├─ 组织架构图                   │
│     └─ 岗位管理                     │
│                                     │
│  🔐 权限管理                        │
│     ├─ 角色列表                     │
│     └─ 权限分配                     │
│                                     │
│  📊 系统监控                        │
│     ├─ 在线用户                     │
│     └─ 系统状态                     │
│                                     │
│  📝 日志管理                        │
│     ├─ 操作日志                     │
│     └─ 登录日志                     │
│                                     │
│  ⚙️ 系统配置                        │
│     ├─ 参数配置                     │
│     └─ 字典管理                     │
│                                     │
├─────────────────────────────────────┤
│  👤 个人中心    ⚙️ 设置    🚪 退出   │
└─────────────────────────────────────┘
```

### 3.2 菜单层级定义

| 层级 | 名称 | 说明 | 示例 |
|-----|------|------|------|
| L1 | 一级菜单 | 主导航分类 | 用户管理、组织架构 |
| L2 | 二级菜单 | 功能页面 | 用户列表、部门管理 |
| L3 | 三级菜单 | 子功能/操作 | 创建用户、编辑部门 |

### 3.3 菜单配置

#### 3.3.1 菜单数据结构

```typescript
interface MenuItem {
  id: string;           // 菜单ID
  name: string;         // 菜单名称
  icon: string;         // 图标
  path: string;         // 路由路径
  component?: string;   // 组件名称
  children?: MenuItem[]; // 子菜单
  hidden?: boolean;     // 是否隐藏
  permission?: string;  // 权限标识
  sort: number;         // 排序
  meta: {
    title: string;      // 页面标题
    keepAlive?: boolean; // 缓存页面
    breadcrumb?: boolean; // 显示面包屑
  };
}
```

#### 3.3.2 完整菜单配置

```typescript
const menuConfig: MenuItem[] = [
  {
    id: 'home',
    name: '首页',
    icon: 'HomeOutlined',
    path: '/home',
    component: 'Home',
    sort: 1,
    meta: { title: '首页', keepAlive: true }
  },
  {
    id: 'user',
    name: '用户管理',
    icon: 'UserOutlined',
    path: '/user',
    sort: 2,
    permission: 'user:view',
    children: [
      {
        id: 'user-list',
        name: '用户列表',
        path: '/user/list',
        component: 'UserList',
        permission: 'user:list',
        meta: { title: '用户列表', keepAlive: true }
      },
      {
        id: 'user-create',
        name: '用户创建',
        path: '/user/create',
        component: 'UserCreate',
        hidden: true,
        meta: { title: '创建用户' }
      },
      {
        id: 'user-import',
        name: '批量导入',
        path: '/user/import',
        component: 'UserImport',
        permission: 'user:import',
        meta: { title: '批量导入' }
      }
    ]
  },
  {
    id: 'org',
    name: '组织架构',
    icon: 'ApartmentOutlined',
    path: '/org',
    sort: 3,
    permission: 'org:view',
    children: [
      {
        id: 'org-dept',
        name: '部门管理',
        path: '/org/dept',
        component: 'DeptManagement',
        permission: 'org:dept:view',
        meta: { title: '部门管理', keepAlive: true }
      },
      {
        id: 'org-chart',
        name: '组织架构图',
        path: '/org/chart',
        component: 'OrgChart',
        permission: 'org:chart:view',
        meta: { title: '组织架构图' }
      },
      {
        id: 'org-post',
        name: '岗位管理',
        path: '/org/post',
        component: 'PostManagement',
        permission: 'org:post:view',
        meta: { title: '岗位管理', keepAlive: true }
      }
    ]
  },
  {
    id: 'role',
    name: '权限管理',
    icon: 'SafetyOutlined',
    path: '/role',
    sort: 4,
    permission: 'role:view',
    children: [
      {
        id: 'role-list',
        name: '角色列表',
        path: '/role/list',
        component: 'RoleList',
        permission: 'role:list',
        meta: { title: '角色列表', keepAlive: true }
      },
      {
        id: 'role-permission',
        name: '权限分配',
        path: '/role/permission/:id',
        component: 'RolePermission',
        hidden: true,
        meta: { title: '权限分配' }
      }
    ]
  },
  {
    id: 'monitor',
    name: '系统监控',
    icon: 'MonitorOutlined',
    path: '/monitor',
    sort: 5,
    permission: 'monitor:view',
    children: [
      {
        id: 'monitor-online',
        name: '在线用户',
        path: '/monitor/online',
        component: 'OnlineUsers',
        permission: 'monitor:online:view',
        meta: { title: '在线用户', keepAlive: true }
      },
      {
        id: 'monitor-status',
        name: '系统状态',
        path: '/monitor/status',
        component: 'SystemStatus',
        permission: 'monitor:status:view',
        meta: { title: '系统状态' }
      }
    ]
  },
  {
    id: 'log',
    name: '日志管理',
    icon: 'FileTextOutlined',
    path: '/log',
    sort: 6,
    permission: 'log:view',
    children: [
      {
        id: 'log-operation',
        name: '操作日志',
        path: '/log/operation',
        component: 'OperationLog',
        permission: 'log:operation:view',
        meta: { title: '操作日志', keepAlive: true }
      },
      {
        id: 'log-login',
        name: '登录日志',
        path: '/log/login',
        component: 'LoginLog',
        permission: 'log:login:view',
        meta: { title: '登录日志', keepAlive: true }
      }
    ]
  },
  {
    id: 'config',
    name: '系统配置',
    icon: 'SettingOutlined',
    path: '/config',
    sort: 7,
    permission: 'config:view',
    children: [
      {
        id: 'config-param',
        name: '参数配置',
        path: '/config/param',
        component: 'ParamConfig',
        permission: 'config:param:view',
        meta: { title: '参数配置', keepAlive: true }
      },
      {
        id: 'config-dict',
        name: '字典管理',
        path: '/config/dict',
        component: 'DictManagement',
        permission: 'config:dict:view',
        meta: { title: '字典管理', keepAlive: true }
      }
    ]
  }
];
```

---

## 四、辅助导航

### 4.1 顶部导航栏

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🍔  │  面包屑：首页 > 用户管理 > 用户列表                    🔔  👤  ⬇️   │
│      │                                                    (通知)(头像)(下拉)│
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 4.1.1 顶部栏组件

| 组件 | 功能 | 交互 |
|------|------|------|
| 折叠按钮 | 收起/展开侧边栏 | 点击切换 |
| 面包屑 | 显示当前位置导航 | 点击跳转 |
| 通知图标 | 系统消息提醒 | 点击展开消息列表 |
| 用户头像 | 个人中心入口 | 点击展开下拉菜单 |

#### 4.1.2 用户下拉菜单

```
┌─────────────────┐
│  👤 个人中心     │
├─────────────────┤
│  ⚙️ 账号设置     │
│  🔒 修改密码     │
├─────────────────┤
│  🌙 深色模式     │
├─────────────────┤
│  ❓ 帮助中心     │
│  📋 关于系统     │
├─────────────────┤
│  🚪 退出登录     │
└─────────────────┘
```

### 4.2 面包屑导航

#### 4.2.1 面包屑规则

| 场景 | 面包屑显示 | 示例 |
|------|-----------|------|
| 首页 | 仅显示首页 | 首页 |
| 一级页面 | 首页 > 当前页 | 首页 > 用户列表 |
| 二级页面 | 首页 > 父级 > 当前页 | 首页 > 用户管理 > 创建用户 |
| 详情页 | 首页 > 列表 > 详情 | 首页 > 用户列表 > 用户详情 |

#### 4.2.2 面包屑配置

```typescript
// 面包屑映射配置
const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
  '/home': [{ title: '首页', path: '/home' }],
  '/user/list': [
    { title: '首页', path: '/home' },
    { title: '用户管理', path: '/user' },
    { title: '用户列表', path: '/user/list' }
  ],
  '/user/create': [
    { title: '首页', path: '/home' },
    { title: '用户管理', path: '/user' },
    { title: '用户列表', path: '/user/list' },
    { title: '创建用户', path: '/user/create' }
  ],
  '/user/detail/:id': [
    { title: '首页', path: '/home' },
    { title: '用户管理', path: '/user' },
    { title: '用户列表', path: '/user/list' },
    { title: '用户详情', path: '' }
  ]
};
```

### 4.3 快捷导航

#### 4.3.1 快捷入口（首页）

```
┌─────────────────────────────────────────────────────────────┐
│  快捷入口                                                    │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  ➕      │  │  👥      │  │  🏢      │  │  🔐      │   │
│  │ 新建用户 │  │ 用户管理 │  │ 部门管理 │  │ 角色权限 │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### 4.3.2 最近访问

```
┌─────────────────────────────────────────────────────────────┐
│  最近访问                              [管理]               │
├─────────────────────────────────────────────────────────────┤
│  📄 用户列表                    2分钟前                     │
│  📄 部门管理                    15分钟前                    │
│  📄 角色权限分配                1小时前                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 五、移动端导航

### 5.1 底部导航栏

```
┌─────────────────────────────────────────┐
│                                         │
│              页面内容区域                │
│                                         │
├─────────────────────────────────────────┤
│    🏠      📋      ➕      🔔      👤   │
│   首页    工作台   快捷    消息    我的  │
└─────────────────────────────────────────┘
```

### 5.2 移动端菜单结构

| 底部导航 | 页面内容 |
|---------|---------|
| 首页 | 数据概览、快捷入口 |
| 工作台 | 常用功能列表、待办事项 |
| 快捷 | 快速创建、扫码、搜索 |
| 消息 | 系统通知、审批提醒 |
| 我的 | 个人信息、设置、关于 |

### 5.3 移动端侧边抽屉

```
┌─────────────────────────────────────────┐
│  👤 张三                    ✕ 关闭      │
│  系统管理员                              │
├─────────────────────────────────────────┤
│  🏠 首页                                │
│  👤 用户管理  >                         │
│  🏢 组织架构  >                         │
│  🔐 权限管理  >                         │
│  📊 系统监控  >                         │
│  📝 日志管理  >                         │
│  ⚙️ 系统配置  >                         │
├─────────────────────────────────────────┤
│  🌙 深色模式                    [开关]  │
├─────────────────────────────────────────┤
│  ❓ 帮助中心                             │
│  🚪 退出登录                             │
└─────────────────────────────────────────┘
```

---

## 六、导航交互设计

### 6.1 菜单交互

| 交互 | 行为 | 效果 |
|------|------|------|
| 点击菜单项 | 导航到对应页面 | 页面切换，菜单高亮 |
| 点击父菜单 | 展开/收起子菜单 | 子菜单显示/隐藏 |
| 悬停父菜单 | 显示子菜单（桌面端） | 子菜单浮层显示 |
| 右键菜单项 | 显示上下文菜单 | 新标签页打开等选项 |

### 6.2 菜单状态

```
┌─────────────────────────────────────┐
│                                     │
│  🏠 首页              ◀── 正常状态   │
│                                     │
│  👤 用户管理 ▼        ◀── 展开状态   │
│     ├─ 用户列表       ◀── 子菜单    │
│     ├─ 用户创建 ✓     ◀── 选中状态   │
│     └─ 批量导入       ◀── 子菜单    │
│                                     │
│  🏢 组织架构 ▶        ◀── 折叠状态   │
│                                     │
│  🔒 权限管理          ◀── 禁用状态   │
│                                     │
└─────────────────────────────────────┘
```

### 6.3 页面切换动画

| 场景 | 动画效果 | 时长 |
|------|---------|------|
| 菜单展开/收起 | 高度渐变 | 300ms |
| 页面切换 | 淡入淡出 | 200ms |
| 子菜单显示 | 滑动+淡入 | 250ms |
| 侧边栏折叠 | 宽度渐变 | 300ms |

---

## 七、权限控制

### 7.1 菜单权限映射

| 菜单 | 权限标识 | 角色 |
|------|---------|------|
| 用户管理 | user:view | 管理员 |
| 用户创建 | user:create | 管理员 |
| 组织架构 | org:view | 管理员 |
| 权限管理 | role:view | 管理员 |
| 系统监控 | monitor:view | 管理员 |
| 日志管理 | log:view | 管理员 |
| 系统配置 | config:view | 管理员 |
| 个人中心 | profile:view | 所有用户 |

### 7.2 动态菜单生成

```typescript
// 根据权限过滤菜单
function filterMenuByPermission(
  menus: MenuItem[], 
  permissions: string[]
): MenuItem[] {
  return menus
    .filter(menu => !menu.permission || permissions.includes(menu.permission))
    .map(menu => ({
      ...menu,
      children: menu.children 
        ? filterMenuByPermission(menu.children, permissions)
        : undefined
    }))
    .filter(menu => !menu.children || menu.children.length > 0);
}
```

---

## 八、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-09 | UI/UX设计师 | 初始版本，创建导航结构设计 |

---

**文档状态**: ⏳ 进行中  
**最后更新**: 2026-03-09  
**文档作者**: UI/UX设计师
