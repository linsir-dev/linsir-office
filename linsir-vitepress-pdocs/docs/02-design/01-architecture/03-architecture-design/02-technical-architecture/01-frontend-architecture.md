# 前端技术架构设计

> **文档编号**: SYS-DES-ARCH-FRONTEND-001  
> **版本**: 1.0  
> **创建日期**: 2026-03-08  
> **作者**: 架构师  
> **状态**: 🔄 进行中

---

## 1. 概述

### 1.1 目的

本文档定义System平台前端技术架构设计，包括技术选型、项目结构、组件设计、状态管理、路由设计等。

### 1.2 适用范围

- Web管理端（Vue3 + Element Plus）
- 移动端（可选，暂不实现）
- 第三方集成（iframe嵌入）

### 1.3 设计原则

1. **组件化**：高内聚、低耦合的组件设计
2. **可复用性**：通用组件和业务组件分离
3. **可维护性**：清晰的代码结构和规范
4. **性能优化**：懒加载、缓存、按需加载

---

## 2. 技术选型

### 2.1 核心技术栈

| 技术 | 版本 | 用途 | 选择理由 |
|-----|------|------|---------|
| Vue 3 | 3.4.x | 前端框架 | 组合式API，性能优化，TypeScript支持 |
| TypeScript | 5.x | 类型系统 | 类型安全，IDE支持，可维护性 |
| Vite | 5.x | 构建工具 | 快速冷启动，HMR，ESM原生支持 |
| Element Plus | 2.5.x | UI组件库 | 企业级组件，Vue3适配，文档完善 |
| Pinia | 2.1.x | 状态管理 | Vue官方推荐，TypeScript友好 |
| Vue Router | 4.x | 路由管理 | Vue3官方路由，组合式API支持 |
| Axios | 1.6.x | HTTP客户端 | 拦截器，请求/响应处理 |
| ECharts | 5.x | 图表库 | 数据可视化，丰富图表类型 |

### 2.2 开发工具

| 工具 | 版本 | 用途 |
|-----|------|------|
| ESLint | 8.x | 代码规范检查 |
| Prettier | 3.x | 代码格式化 |
| Stylelint | 15.x | CSS规范检查 |
| Husky | 9.x | Git钩子管理 |
| Vitest | 1.x | 单元测试 |
| Cypress | 13.x | E2E测试 |

### 2.3 技术栈架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      前端技术栈架构                          │
├─────────────────────────────────────────────────────────────┤
│  展示层                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Element   │ │   ECharts   │ │  自定义组件  │           │
│  │    Plus     │ │             │ │             │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  应用层                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  Vue Router │ │    Pinia    │ │   Composables│          │
│  │   (路由)    │ │  (状态管理)  │ │  (组合函数)  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  基础层                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │    Vue 3    │ │ TypeScript  │ │    Axios    │           │
│  │  (核心框架)  │ │  (类型系统)  │ │  (HTTP请求)  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  工程化                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │    Vite     │ │  ESLint/    │ │  Vitest/    │           │
│  │  (构建工具)  │ │  Prettier   │ │  Cypress    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 项目结构

### 3.1 目录结构

```
linsir-vue-admin/                    # 前端Monorepo根目录
├── packages/
│   └── @linsir/                     # 组织命名空间
│       ├── components/              # 通用组件库（项目依赖）
│       │   ├── src/
│       │   │   ├── AppTable/        # 表格组件
│       │   │   ├── AppForm/         # 表单组件
│       │   │   ├── AppSearch/       # 搜索组件
│       │   │   ├── AppDialog/       # 对话框组件
│       │   │   ├── AppTree/         # 树形组件
│       │   │   └── index.ts         # 组件库入口
│       │   ├── package.json
│       │   └── vite.config.ts
│       │
│       ├── composables/             # 通用组合函数库（项目依赖）
│       │   ├── src/
│       │   │   ├── useTable.ts      # 表格逻辑
│       │   │   ├── useForm.ts       # 表单逻辑
│       │   │   ├── useAuth.ts       # 权限逻辑
│       │   │   ├── useDict.ts       # 字典逻辑
│       │   │   └── index.ts         # 组合函数入口
│       │   ├── package.json
│       │   └── tsconfig.json
│       │
│       ├── directives/              # 通用指令库（项目依赖）
│       │   ├── src/
│       │   │   ├── permission.ts    # 权限指令
│       │   │   ├── debounce.ts      # 防抖指令
│       │   │   └── index.ts         # 指令入口
│       │   ├── package.json
│       │   └── tsconfig.json
│       │
│       └── utils/                   # 通用工具库（项目依赖）
│           ├── src/
│           │   ├── request.ts       # Axios封装
│           │   ├── storage.ts       # 存储封装
│           │   ├── validate.ts      # 验证工具
│           │   ├── format.ts        # 格式化工具
│           │   └── index.ts         # 工具入口
│           ├── package.json
│           └── tsconfig.json
│
├── apps/
│   └── linsir-web-system/           # 具体业务项目
│       ├── public/                  # 静态资源
│       │   ├── favicon.ico
│       │   └── logo.png
│       ├── src/
│       │   ├── api/                 # API接口
│       │   │   ├── system/          # System服务API
│       │   │   │   ├── user.ts
│       │   │   │   ├── role.ts
│       │   │   │   ├── dept.ts
│       │   │   │   └── auth.ts
│       │   │   ├── config/
│       │   │   └── audit/
│       │   │
│       │   ├── assets/              # 静态资源
│       │   │   ├── images/
│       │   │   ├── icons/
│       │   │   └── styles/
│       │   │       ├── variables.scss
│       │   │       ├── mixins.scss
│       │   │       └── index.scss
│       │   │
│       │   ├── components/          # 业务组件（仅本项目使用）
│       │   │   ├── UserSelect/      # 用户选择器
│       │   │   ├── DeptSelect/      # 部门选择器
│       │   │   └── RoleSelect/      # 角色选择器
│       │   │
│       │   ├── layouts/             # 布局组件
│       │   │   ├── default/
│       │   │   │   ├── index.vue
│       │   │   │   ├── components/
│       │   │   │   │   ├── Navbar.vue
│       │   │   │   │   ├── Sidebar.vue
│       │   │   │   │   ├── TagsView.vue
│       │   │   │   │   └── AppMain.vue
│       │   │   │   └── index.scss
│       │   │   └── blank/
│       │   │       └── index.vue
│       │   │
│       │   ├── router/              # 路由配置
│       │   │   ├── index.ts
│       │   │   ├── routes.ts
│       │   │   └── guards.ts
│       │   │
│       │   ├── stores/              # Pinia状态管理
│       │   │   ├── index.ts
│       │   │   ├── modules/
│       │   │   │   ├── user.ts
│       │   │   │   ├── app.ts
│       │   │   │   ├── permission.ts
│       │   │   │   └── tagsView.ts
│       │   │   └── plugins/
│       │   │       └── persist.ts
│       │   │
│       │   ├── types/               # TypeScript类型
│       │   │   ├── api.d.ts
│       │   │   ├── global.d.ts
│       │   │   └── components.d.ts
│       │   │
│       │   ├── views/               # 页面视图
│       │   │   ├── login/
│       │   │   ├── dashboard/
│       │   │   ├── system/
│       │   │   │   ├── user/
│       │   │   │   ├── role/
│       │   │   │   ├── dept/
│       │   │   │   └── menu/
│       │   │   ├── config/
│       │   │   └── audit/
│       │   │
│       │   ├── App.vue
│       │   ├── main.ts
│       │   └── env.d.ts
│       │
│       ├── tests/
│       ├── .env
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
│
├── package.json                     # 根package.json (pnpm workspace)
├── pnpm-workspace.yaml              # pnpm工作区配置
├── tsconfig.json
└── README.md
```

### 3.2 目录说明

#### 3.2.1 公共库 (packages/@linsir/)

| 目录 | 说明 | 规范 |
|-----|------|------|
| `components/` | 通用组件库 | 所有项目共享，独立发布 |
| `composables/` | 通用组合函数库 | 逻辑复用，命名useXxx |
| `directives/` | 通用指令库 | 权限、防抖等通用指令 |
| `utils/` | 通用工具库 | 请求、存储、验证等工具 |

#### 3.2.2 业务项目 (apps/linsir-web-system/)

| 目录 | 说明 | 规范 |
|-----|------|------|
| `api/` | API接口定义 | 按服务划分，统一错误处理 |
| `components/` | 业务组件 | 仅本项目使用的业务组件 |
| `layouts/` | 布局组件 | 支持多布局切换 |
| `router/` | 路由配置 | 动态路由，权限控制 |
| `stores/` | 状态管理 | 按模块划分，持久化配置 |
| `views/` | 页面视图 | 按功能模块划分 |

### 3.3 依赖关系

```
┌─────────────────────────────────────────────────────────────┐
│                      依赖关系图                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  apps/linsir-web-system/                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  package.json                                       │   │
│  │  {                                                  │   │
│  │    "dependencies": {                                │   │
│  │      "@linsir/components": "workspace:*",           │   │
│  │      "@linsir/composables": "workspace:*",          │   │
│  │      "@linsir/directives": "workspace:*",           │   │
│  │      "@linsir/utils": "workspace:*"                 │   │
│  │    }                                                │   │
│  │  }                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│           ┌────────────────┼────────────────┐               │
│           ▼                ▼                ▼               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ @linsir/    │  │ @linsir/    │  │ @linsir/    │         │
│  │ components  │  │ composables │  │ directives  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.4 使用示例

```typescript
// apps/linsir-web-system/src/main.ts
import { createApp } from 'vue'
import App from './App.vue'

// 引入公共库
import { AppTable, AppForm, AppDialog } from '@linsir/components'
import { useTable, useForm } from '@linsir/composables'
import { permission, debounce } from '@linsir/directives'
import { request, storage } from '@linsir/utils'

const app = createApp(App)

// 注册公共组件
app.component('AppTable', AppTable)
app.component('AppForm', AppForm)
app.component('AppDialog', AppDialog)

// 注册公共指令
app.directive('permission', permission)
app.directive('debounce', debounce)

app.mount('#app')
```

---

## 4. 组件设计

### 4.1 组件分类

```
┌─────────────────────────────────────────────────────────────┐
│                        组件体系                              │
├─────────────────────────────────────────────────────────────┤
│  基础组件 (Element Plus)                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ Button  │ │  Input  │ │ Select  │ │  Table  │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│  通用组件 (Common)                                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │AppTable │ │ AppForm │ │AppSearch│ │AppDialog│           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│  业务组件 (Business)                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│  │UserSel  │ │DeptSel  │ │RoleSel  │                       │
│  └─────────┘ └─────────┘ └─────────┘                       │
├─────────────────────────────────────────────────────────────┤
│  布局组件 (Layout)                                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ Navbar  │ │ Sidebar │ │TagsView │ │ AppMain │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 通用组件规范

#### AppTable 表格组件

```vue
<template>
  <AppTable
    :data="tableData"
    :columns="columns"
    :loading="loading"
    :pagination="pagination"
    @page-change="handlePageChange"
    @selection-change="handleSelectionChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn } from '@/components/common/AppTable/types'

const columns: TableColumn[] = [
  { type: 'selection', width: 50 },
  { prop: 'username', label: '用户名', width: 120 },
  { prop: 'nickname', label: '昵称' },
  { prop: 'status', label: '状态', slot: 'status' },
  { prop: 'createTime', label: '创建时间', width: 180 },
  { type: 'action', label: '操作', width: 200, fixed: 'right' }
]
</script>
```

#### AppForm 表单组件

```vue
<template>
  <AppForm
    :model="formModel"
    :fields="formFields"
    :rules="formRules"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
const formFields = [
  { type: 'input', prop: 'username', label: '用户名' },
  { type: 'input', prop: 'password', label: '密码', props: { type: 'password' } },
  { type: 'select', prop: 'status', label: '状态', options: statusOptions },
  { type: 'tree-select', prop: 'deptId', label: '部门', data: deptTree }
]
</script>
```

### 4.3 组件开发规范

| 规范项 | 说明 | 示例 |
|-------|------|------|
| 命名 | PascalCase | `UserSelect.vue` |
| 文件 | 目录+index.vue | `UserSelect/index.vue` |
| Props | 显式类型定义 | `defineProps<{ name: string }>()` |
| Emits | 显式类型定义 | `defineEmits<{ submit: [data: FormData] }>()` |
| 样式 | Scoped + BEM | `.user-select__header` |

---

## 5. 状态管理

### 5.1 Pinia Store设计

```
┌─────────────────────────────────────────────────────────────┐
│                      Pinia Store架构                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Store入口                          │   │
│  │                    stores/index.ts                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│           ┌────────────────┼────────────────┐               │
│           ▼                ▼                ▼               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  user.ts    │  │  app.ts     │  │permission.ts│         │
│  │  用户状态   │  │  应用状态   │  │  权限状态   │         │
│  │             │  │             │  │             │         │
│  │ • userInfo  │  │ • sidebar   │  │ • routes    │         │
│  │ • token     │  │ • device    │  │ • buttons   │         │
│  │ • roles     │  │ • language  │  │ • roles     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Store示例

#### User Store

```typescript
// stores/modules/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/types/api'
import { login, getUserInfo } from '@/api/system/auth'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)
  
  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.username || '')
  
  // Actions
  const loginAction = async (loginForm: LoginForm) => {
    const res = await login(loginForm)
    token.value = res.token
    return res
  }
  
  const getInfo = async () => {
    const res = await getUserInfo()
    userInfo.value = res
    return res
  }
  
  const logout = () => {
    token.value = ''
    userInfo.value = null
  }
  
  return {
    token,
    userInfo,
    isLoggedIn,
    username,
    loginAction,
    getInfo,
    logout
  }
}, {
  persist: {
    key: 'user',
    paths: ['token']
  }
})
```

### 5.3 状态持久化

```typescript
// stores/plugins/persist.ts
import type { PiniaPluginContext } from 'pinia'

export function persistPlugin({ store }: PiniaPluginContext) {
  const persistKey = `pinia-${store.$id}`
  
  // 恢复状态
  const savedState = localStorage.getItem(persistKey)
  if (savedState) {
    store.$patch(JSON.parse(savedState))
  }
  
  // 监听变化
  store.$subscribe((mutation, state) => {
    localStorage.setItem(persistKey, JSON.stringify(state))
  })
}
```

---

## 6. 路由设计

### 6.1 路由结构

```typescript
// router/routes.ts
import type { RouteRecordRaw } from 'vue-router'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: () => import('@/layouts/default/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  }
]

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'system' },
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理', permission: 'system:user:list' }
      },
      {
        path: 'role',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理', permission: 'system:role:list' }
      },
      {
        path: 'dept',
        component: () => import('@/views/system/dept/index.vue'),
        meta: { title: '部门管理', permission: 'system:dept:list' }
      },
      {
        path: 'menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: { title: '菜单管理', permission: 'system:menu:list' }
      }
    ]
  }
]
```

### 6.2 路由守卫

```typescript
// router/guards.ts
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/modules/permission'

export function setupRouterGuards(router: Router) {
  // 白名单
  const whiteList = ['/login', '/404']
  
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()
    
    // 设置页面标题
    document.title = to.meta.title ? `${to.meta.title} - System平台` : 'System平台'
    
    if (userStore.token) {
      if (to.path === '/login') {
        next('/')
      } else {
        // 获取用户信息和权限
        if (!userStore.userInfo) {
          await userStore.getInfo()
          const routes = await permissionStore.generateRoutes()
          routes.forEach(route => router.addRoute(route))
          next({ ...to, replace: true })
        } else {
          next()
        }
      }
    } else {
      if (whiteList.includes(to.path)) {
        next()
      } else {
        next(`/login?redirect=${to.path}`)
      }
    }
  })
}
```

---

## 7. HTTP请求封装

### 7.1 Axios封装

```typescript
// utils/request.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data
    
    if (code === 200) {
      return data
    }
    
    // 业务错误
    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message))
  },
  (error: AxiosError) => {
    const { response } = error
    
    if (response) {
      switch (response.status) {
        case 401:
          ElMessageBox.confirm('登录已过期，请重新登录', '提示', {
            confirmButtonText: '重新登录',
            type: 'warning'
          }).then(() => {
            const userStore = useUserStore()
            userStore.logout()
            location.reload()
          })
          break
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error(response.data?.message || '网络错误')
      }
    }
    
    return Promise.reject(error)
  }
)

export default request
```

### 7.2 API定义示例

```typescript
// api/system/user.ts
import request from '@/utils/request'
import type { User, UserQuery, UserForm } from '@/types/api'

export const getUserList = (params: UserQuery) => {
  return request.get<PageResult<User>>('/system/user/list', { params })
}

export const getUserById = (id: number) => {
  return request.get<User>(`/system/user/${id}`)
}

export const createUser = (data: UserForm) => {
  return request.post('/system/user', data)
}

export const updateUser = (id: number, data: UserForm) => {
  return request.put(`/system/user/${id}`, data)
}

export const deleteUser = (id: number) => {
  return request.delete(`/system/user/${id}`)
}

export const exportUser = (params: UserQuery) => {
  return request.get('/system/user/export', { 
    params,
    responseType: 'blob'
  })
}
```

---

## 8. 权限控制

### 8.1 权限指令

```typescript
// directives/permission.ts
import type { Directive } from 'vue'
import { useUserStore } from '@/stores/modules/user'

export const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding
    const userStore = useUserStore()
    const permissions = userStore.userInfo?.permissions || []
    
    if (value && !permissions.includes(value)) {
      el.parentNode?.removeChild(el)
    }
  }
}

// 使用
// <el-button v-permission="'system:user:create'">新增</el-button>
```

### 8.2 权限判断

```typescript
// composables/useAuth.ts
import { computed } from 'vue'
import { useUserStore } from '@/stores/modules/user'

export function useAuth() {
  const userStore = useUserStore()
  
  const hasPermission = (permission: string) => {
    const permissions = userStore.userInfo?.permissions || []
    return permissions.includes(permission)
  }
  
  const hasRole = (role: string) => {
    const roles = userStore.userInfo?.roles || []
    return roles.includes(role)
  }
  
  const hasAnyPermission = (permissions: string[]) => {
    return permissions.some(p => hasPermission(p))
  }
  
  return {
    hasPermission,
    hasRole,
    hasAnyPermission
  }
}
```

---

## 9. 性能优化

### 9.1 优化策略

| 优化项 | 策略 | 实现 |
|-------|------|------|
| 路由懒加载 | 按需加载页面组件 | `() => import('@/views/xxx')` |
| 组件懒加载 | 按需加载大型组件 | `defineAsyncComponent` |
| 资源优化 | 图片压缩、CDN加速 | Vite插件 |
| 缓存优化 | 接口缓存、状态持久化 | Pinia持久化 |
| 代码分割 | 按路由分割代码 | Vite自动处理 |

### 9.2 性能监控

```typescript
// utils/performance.ts
export function measurePerformance() {
  // 页面加载时间
  window.addEventListener('load', () => {
    const timing = performance.timing
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart
    console.log(`页面加载时间: ${pageLoadTime}ms`)
  })
  
  // 资源加载时间
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'resource') {
        console.log(`${entry.name}: ${entry.duration}ms`)
      }
    }
  })
  observer.observe({ entryTypes: ['resource'] })
}
```

---

## 10. 开发规范

### 10.1 代码规范

- **ESLint**: 使用`@antfu/eslint-config`配置
- **Prettier**: 统一代码格式
- **Stylelint**: CSS/SCSS规范检查
- **Commitizen**: 规范提交信息

### 10.2 命名规范

| 类型 | 规范 | 示例 |
|-----|------|------|
| 组件 | PascalCase | `UserSelect.vue` |
| 组合函数 | camelCase + use前缀 | `useTable.ts` |
| Store | camelCase + use前缀 | `useUserStore.ts` |
| 类型 | PascalCase | `UserInfo` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL` |

### 10.3 文件组织

```
src/
├── api/           # API接口
├── assets/        # 静态资源
├── components/    # 组件
│   ├── common/    # 通用组件
│   └── business/  # 业务组件
├── composables/   # 组合函数
├── directives/    # 自定义指令
├── layouts/       # 布局组件
├── router/        # 路由配置
├── stores/        # 状态管理
├── types/         # TypeScript类型
├── utils/         # 工具函数
└── views/         # 页面视图
```

---

## 11. 相关文档

- [后端技术架构](./02-backend-architecture.md)
- [数据技术架构](./03-data-architecture.md)
- [系统架构设计](../01-system-architecture/01-logical-architecture.md)

---

## 12. 修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 架构师 | 初始版本，定义前端技术架构 |
