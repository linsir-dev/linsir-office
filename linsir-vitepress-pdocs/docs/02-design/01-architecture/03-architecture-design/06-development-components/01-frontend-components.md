# 前端组件设计

> **文档编号**: SYS-DES-ARCH-COMP-001  
> **版本**: 1.0  
> **创建日期**: 2026-03-08  
> **作者**: 架构师  
> **状态**: ✅ 已完成

---

## 1. 概述

### 1.1 目的

本文档定义System平台前端组件设计规范，包括基础UI组件库和业务组件，确保前端开发的一致性和可维护性。

### 1.2 设计原则

1. **一致性**：组件风格统一，交互一致
2. **可复用性**：组件高度可复用，减少重复代码
3. **可扩展性**：组件易于扩展和定制
4. **可维护性**：代码结构清晰，易于维护

---

## 2. 基础UI组件库

### 2.1 基础组件选型

System平台前端组件基于 **Element Plus 2.5.x** 进行封装和扩展。

> **技术选型详情** 请参考架构技术清单文档。

### 2.2 组件封装策略

System平台组件采用**基于Element Plus扩展**的策略：

1. **继承扩展**：继承Element Plus组件，增加业务功能
2. **组合封装**：组合多个Element Plus组件，形成业务组件
3. **定制主题**：基于Element Plus主题系统，定制System平台主题

### 2.3 组件库架构

### 2.3 组件库架构

```
system-ui/
├── components/           # 组件目录
│   ├── Basic/           # 基础组件
│   ├── Form/            # 表单组件
│   ├── Data/            # 数据展示组件
│   ├── Navigation/      # 导航组件
│   └── Feedback/        # 反馈组件
├── styles/              # 样式系统
│   ├── variables.scss   # SCSS变量
│   ├── mixins.scss      # 混合宏
│   └── theme.scss       # 主题配置
├── utils/               # 工具函数
└── index.ts             # 入口文件
```

### 2.4 基础组件

#### 2.2.1 SysButton（按钮）

基于Element Plus Button扩展，增加权限控制功能。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| type | string | 'default' | 按钮类型 |
| size | string | 'default' | 按钮尺寸 |
| permission | string | - | 权限标识 |
| confirm | boolean | false | 是否需要确认 |
| confirmText | string | - | 确认提示文本 |

**示例:**

```vue
<template>
  <SysButton 
    type="primary" 
    permission="user:create"
    :confirm="true"
    confirmText="确定要创建用户吗？"
    @click="handleCreate"
  >
    创建用户
  </SysButton>
</template>
```

#### 2.2.2 SysTable（表格）

基于Element Plus Table扩展，增加分页、排序、筛选、权限控制等功能。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| data | array | [] | 表格数据 |
| columns | array | [] | 列配置 |
| pagination | boolean | true | 是否显示分页 |
| pageSize | number | 10 | 每页条数 |
| total | number | 0 | 总条数 |
| loading | boolean | false | 加载状态 |
| rowKey | string | 'id' | 行唯一标识 |
| selection | boolean | false | 是否支持多选 |

**Columns配置:**

| 属性 | 类型 | 说明 |
|-----|------|------|
| prop | string | 字段名 |
| label | string | 列标题 |
| width | string/number | 列宽 |
| sortable | boolean | 是否可排序 |
| filterable | boolean | 是否可筛选 |
| permission | string | 查看权限 |
| formatter | function | 格式化函数 |
| slots | object | 自定义插槽 |

**示例:**

```vue
<template>
  <SysTable
    :data="userList"
    :columns="columns"
    :total="total"
    :loading="loading"
    @page-change="handlePageChange"
    @sort-change="handleSortChange"
  />
</template>

<script setup>
const columns = [
  { prop: 'username', label: '用户名', width: 120, sortable: true },
  { prop: 'realName', label: '姓名', width: 100 },
  { prop: 'deptName', label: '部门', filterable: true },
  { prop: 'status', label: '状态', formatter: formatStatus },
  { prop: 'createTime', label: '创建时间', width: 180, sortable: true },
  { 
    prop: 'action', 
    label: '操作', 
    width: 200,
    slots: {
      default: ({ row }) => (
        <>
          <SysButton type="text" permission="user:edit" onClick={() => handleEdit(row)}>编辑</SysButton>
          <SysButton type="text" permission="user:delete" confirm onClick={() => handleDelete(row)}>删除</SysButton>
        </>
      )
    }
  }
]
</script>
```

#### 2.2.3 SysForm（表单）

基于Element Plus Form扩展，增加动态表单、表单验证、权限控制等功能。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| model | object | {} | 表单数据 |
| fields | array | [] | 字段配置 |
| rules | object | {} | 验证规则 |
| labelWidth | string | '100px' | 标签宽度 |
| inline | boolean | false | 行内表单 |
| disabled | boolean | false | 是否禁用 |

**Fields配置:**

| 属性 | 类型 | 说明 |
|-----|------|------|
| prop | string | 字段名 |
| label | string | 标签 |
| type | string | 组件类型 |
| options | array | 选项（select/radio/checkbox） |
| props | object | 组件属性 |
| rules | array | 验证规则 |
| permission | string | 编辑权限 |
| visible | boolean/function | 是否显示 |

**支持的组件类型:**

| 类型 | 组件 | 说明 |
|-----|------|------|
| input | ElInput | 输入框 |
| select | SysSelect | 下拉选择 |
| radio | ElRadioGroup | 单选框 |
| checkbox | ElCheckboxGroup | 复选框 |
| date | ElDatePicker | 日期选择 |
| datetime | ElDatePicker | 日期时间选择 |
| number | ElInputNumber | 数字输入 |
| textarea | ElInput | 文本域 |
| switch | ElSwitch | 开关 |
| upload | SysUpload | 文件上传 |
| editor | SysEditor | 富文本编辑器 |
| dept | SysDeptTree | 部门选择 |
| user | SysUserSelect | 用户选择 |

**示例:**

```vue
<template>
  <SysForm
    :model="form"
    :fields="fields"
    :rules="rules"
    @submit="handleSubmit"
  />
</template>

<script setup>
const fields = [
  { prop: 'username', label: '用户名', type: 'input', rules: [{ required: true }] },
  { prop: 'realName', label: '姓名', type: 'input' },
  { 
    prop: 'deptId', 
    label: '部门', 
    type: 'dept',
    props: { multiple: false }
  },
  { 
    prop: 'roleIds', 
    label: '角色', 
    type: 'select',
    options: roleOptions,
    props: { multiple: true }
  },
  { prop: 'status', label: '状态', type: 'switch' }
]
</script>
```

#### 2.2.4 SysSelect（下拉选择）

基于Element Plus Select扩展，增加数据字典支持、远程搜索等功能。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| modelValue | string/number/array | - | 绑定值 |
| dictType | string | - | 数据字典类型 |
| options | array | [] | 选项数据 |
| remote | boolean | false | 是否远程搜索 |
| remoteMethod | function | - | 远程搜索方法 |
| multiple | boolean | false | 是否多选 |
| clearable | boolean | true | 是否可清空 |

**示例:**

```vue
<template>
  <!-- 使用数据字典 -->
  <SysSelect v-model="status" dictType="sys_user_status" />
  
  <!-- 远程搜索 -->
  <SysSelect 
    v-model="userId" 
    remote 
    :remoteMethod="searchUser"
    placeholder="请输入用户名搜索"
  />
</template>
```

#### 2.2.5 SysDialog（对话框）

基于Element Plus Dialog扩展，增加全屏、拖拽、自适应等功能。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| modelValue | boolean | false | 是否显示 |
| title | string | - | 标题 |
| width | string | '50%' | 宽度 |
| fullscreen | boolean | false | 是否全屏 |
| draggable | boolean | true | 是否可拖拽 |
| closeOnClickModal | boolean | false | 点击遮罩关闭 |
| showFooter | boolean | true | 显示底部按钮 |

**示例:**

```vue
<template>
  <SysDialog 
    v-model="visible" 
    title="用户详情"
    width="800px"
    @confirm="handleConfirm"
  >
    <UserForm v-model="form" />
  </SysDialog>
</template>
```

---

## 3. 业务组件

### 3.1 SysDeptTree（部门树）

部门选择树形组件，支持单选/多选、懒加载、搜索等功能。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| modelValue | string/number/array | - | 选中值 |
| multiple | boolean | false | 是否多选 |
| checkStrictly | boolean | false | 是否严格选择 |
| lazy | boolean | true | 是否懒加载 |
| filterable | boolean | true | 是否可搜索 |

**示例:**

```vue
<template>
  <!-- 单选 -->
  <SysDeptTree v-model="deptId" />
  
  <!-- 多选 -->
  <SysDeptTree v-model="deptIds" :multiple="true" />
</template>
```

### 3.2 SysUserSelect（用户选择器）

用户选择组件，支持单选/多选、远程搜索、部门筛选等功能。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| modelValue | string/number/array | - | 选中值 |
| multiple | boolean | false | 是否多选 |
| deptId | string/number | - | 部门筛选 |
| roleId | string/number | - | 角色筛选 |
| placeholder | string | '请选择用户' | 占位符 |

**示例:**

```vue
<template>
  <SysUserSelect 
    v-model="userId" 
    :deptId="form.deptId"
    placeholder="请选择负责人"
  />
</template>
```

### 3.3 SysRoleSelect（角色选择器）

角色选择组件，支持单选/多选、权限筛选等功能。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| modelValue | string/number/array | - | 选中值 |
| multiple | boolean | true | 是否多选 |
| dataScope | string | - | 数据权限筛选 |

### 3.4 SysMenuTree（菜单树）

菜单权限树形组件，用于菜单管理和权限分配。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| modelValue | array | [] | 选中值 |
| showCheckbox | boolean | true | 是否显示复选框 |
| checkStrictly | boolean | true | 父子不关联 |
| filterPermission | boolean | true | 只显示有权限的菜单 |

### 3.5 SysDictSelect（字典选择）

数据字典选择组件，自动加载字典数据。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| modelValue | string/number | - | 绑定值 |
| dictType | string | - | 字典类型（必填） |
| type | string | 'select' | 组件类型（select/radio/checkbox） |

**示例:**

```vue
<template>
  <!-- 下拉选择 -->
  <SysDictSelect v-model="status" dictType="sys_user_status" />
  
  <!-- 单选按钮 -->
  <SysDictSelect v-model="gender" dictType="sys_user_gender" type="radio" />
  
  <!-- 复选框 -->
  <SysDictSelect v-model="hobbies" dictType="sys_user_hobby" type="checkbox" />
</template>
```

### 3.6 SysUpload（文件上传）

文件上传组件，支持多文件、图片预览、上传进度等功能。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| modelValue | string/array | - | 文件URL或URL数组 |
| multiple | boolean | false | 是否多文件 |
| accept | string | - | 接受文件类型 |
| maxSize | number | 10 | 最大文件大小(MB) |
| maxCount | number | 5 | 最大文件数量 |
| listType | string | 'text' | 列表类型（text/picture/picture-card） |

### 3.7 SysIconSelect（图标选择器）

图标选择组件，支持搜索和预览。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| modelValue | string | - | 选中的图标类名 |
| placeholder | string | '请选择图标' | 占位符 |

### 3.8 SysPermissionMatrix（权限矩阵）

权限矩阵组件，用于角色权限分配。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| modelValue | array | [] | 选中的权限标识数组 |
| permissions | array | [] | 权限列表 |
| modules | array | [] | 模块分组 |

**示例:**

```vue
<template>
  <SysPermissionMatrix 
    v-model="selectedPermissions"
    :permissions="permissionList"
    :modules="moduleList"
  />
</template>
```

---

## 4. 组件使用规范

### 4.1 命名规范

- 组件文件名使用大驼峰命名法，如 `SysButton.vue`
- 组件标签使用大驼峰命名法，如 `<SysButton />`
- 组件Props使用小驼峰命名法，如 `confirmText`

### 4.2 样式规范

- 组件样式使用SCSS编写
- 样式变量统一在 `styles/variables.scss` 中定义
- 组件样式使用BEM命名规范

### 4.3 文档规范

- 每个组件必须包含使用文档
- 文档包含Props、Events、Slots说明
- 提供完整的代码示例

---

## 5. 组件开发流程

1. **需求分析**：明确组件功能和适用场景
2. **API设计**：设计Props、Events、Slots
3. **代码开发**：实现组件功能
4. **单元测试**：编写测试用例
5. **文档编写**：编写使用文档和示例
6. **代码评审**：提交评审并修改
7. **发布上线**：合并到主分支

---

## 6. 输出文件

| 序号 | 文件名称 | 文件编号 | 说明 |
|-----|---------|---------|------|
| 1 | 前端组件设计 | SYS-DES-ARCH-COMP-001 | 本文档 |
