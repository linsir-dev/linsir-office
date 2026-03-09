# 业务数据字典

> **文档编号**: SYS-DB-DICT-002  
> **版本**: 1.0  
> **日期**: 2026-03-08  
> **作者**: 数据库架构师  
> **状态**: ✅ 已评审

---

## 一、概述

### 1.1 文档目的

本文档定义System平台业务级数据字典，包括用户管理、权限管理、组织管理等核心业务模块的数据详细说明。

### 1.2 适用范围

适用于System平台所有业务模块的数据管理。

### 1.3 数据分类

| 分类 | 说明 | 包含表 |
|-----|------|-------|
| 用户管理 | 用户信息和关系 | sys_user, sys_user_role, sys_user_dept |
| 权限管理 | 角色权限配置 | sys_role, sys_role_permission, sys_permission, sys_menu |
| 组织管理 | 组织架构信息 | sys_dept, sys_position, sys_employee |

---

## 二、用户管理表字典

### 2.1 用户表 (sys_user)

**表说明**: 存储系统用户的基本信息

#### 2.1.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_user |
| 中文名 | 用户表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |

#### 2.1.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 用户ID | 主键 |
| username | VARCHAR(50) | 否 | - | 用户名 | 登录账号，唯一 |
| password | VARCHAR(100) | 否 | - | 密码 | BCrypt加密存储 |
| nickname | VARCHAR(50) | 是 | NULL | 昵称 | 显示名称 |
| email | VARCHAR(100) | 是 | NULL | 邮箱 | 唯一，可用于登录 |
| phone | VARCHAR(20) | 是 | NULL | 手机号 | 唯一，可用于登录 |
| avatar | VARCHAR(200) | 是 | NULL | 头像 | 头像图片URL |
| status | TINYINT | 否 | 1 | 状态 | 0-禁用, 1-启用 |
| gender | TINYINT | 是 | 0 | 性别 | 0-未知, 1-男, 2-女 |
| employee_no | VARCHAR(50) | 是 | NULL | 员工编号 | 关联员工，唯一 |
| dept_id | BIGINT | 是 | NULL | 主属部门ID | 外键：sys_dept.id |
| remark | VARCHAR(500) | 是 | NULL | 备注 | - |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | - |
| update_time | DATETIME | 否 | CURRENT_TIMESTAMP | 更新时间 | - |
| create_by | BIGINT | 是 | NULL | 创建人ID | - |
| update_by | BIGINT | 是 | NULL | 更新人ID | - |
| deleted | TINYINT | 否 | 0 | 删除标志 | 0-正常, 1-删除 |
| tenant_id | BIGINT | 否 | - | 租户ID | 当前租户标识 |

#### 2.1.3 枚举值定义

**status（用户状态）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 0 | 禁用 | 账号被禁用，无法登录 |
| 1 | 启用 | 账号正常可用 |

**gender（性别）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 0 | 未知 | 未设置性别 |
| 1 | 男 | 男性 |
| 2 | 女 | 女性 |

#### 2.1.4 业务规则

1. **用户名规则**: 3-20个字符，支持字母、数字、下划线，必须以字母开头
2. **密码规则**: 8-20个字符，必须包含字母和数字
3. **邮箱规则**: 符合邮箱格式，全局唯一
4. **手机号规则**: 符合手机号格式，全局唯一
5. **员工编号**: 关联sys_employee表，一个用户最多关联一个员工

---

### 2.2 用户角色关系表 (sys_user_role)

**表说明**: 用户与角色的多对多关系

#### 2.2.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_user_role |
| 中文名 | 用户角色关系表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |

#### 2.2.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 关系ID | 主键 |
| user_id | BIGINT | 否 | - | 用户ID | 外键：sys_user.id |
| role_id | BIGINT | 否 | - | 角色ID | 外键：sys_role.id |
| is_primary | TINYINT | 否 | 0 | 是否主角色 | 0-否, 1-是 |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | - |
| create_by | BIGINT | 是 | NULL | 创建人ID | - |
| tenant_id | BIGINT | 否 | - | 租户ID | 当前租户标识 |

#### 2.2.3 枚举值定义

**is_primary（是否主角色）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 0 | 否 | 普通角色 |
| 1 | 是 | 主角色，用于数据权限判断 |

#### 2.2.4 业务规则

1. 一个用户可以有多个角色
2. 一个角色可以分配给多个用户
3. 一个用户只能有一个主角色（is_primary=1）
4. 用户-角色组合唯一

---

### 2.3 用户部门关系表 (sys_user_dept)

**表说明**: 用户与部门的多对多关系

#### 2.3.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_user_dept |
| 中文名 | 用户部门关系表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |

#### 2.3.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 关系ID | 主键 |
| user_id | BIGINT | 否 | - | 用户ID | 外键：sys_user.id |
| dept_id | BIGINT | 否 | - | 部门ID | 外键：sys_dept.id |
| is_primary | TINYINT | 否 | 0 | 是否主部门 | 0-否, 1-是 |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | - |
| create_by | BIGINT | 是 | NULL | 创建人ID | - |
| tenant_id | BIGINT | 否 | - | 租户ID | 当前租户标识 |

#### 2.3.3 枚举值定义

**is_primary（是否主部门）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 0 | 否 | 兼职部门 |
| 1 | 是 | 主属部门 |

#### 2.3.4 业务规则

1. 一个用户可以属于多个部门
2. 一个部门可以有多个用户
3. 一个用户只能有一个主部门（is_primary=1）
4. 用户-部门组合唯一

---

## 三、权限管理表字典

### 3.1 角色表 (sys_role)

**表说明**: 系统角色定义

#### 3.1.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_role |
| 中文名 | 角色表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |

#### 3.1.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 角色ID | 主键 |
| role_code | VARCHAR(50) | 否 | - | 角色编码 | 唯一标识 |
| role_name | VARCHAR(50) | 否 | - | 角色名称 | 显示名称 |
| role_type | TINYINT | 否 | 2 | 角色类型 | 1-系统角色, 2-业务角色 |
| data_scope | TINYINT | 否 | 1 | 数据范围 | 见枚举值 |
| status | TINYINT | 否 | 1 | 状态 | 0-禁用, 1-启用 |
| sort_order | INT | 否 | 0 | 排序号 | 显示顺序 |
| remark | VARCHAR(500) | 是 | NULL | 备注 | - |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | - |
| update_time | DATETIME | 否 | CURRENT_TIMESTAMP | 更新时间 | - |
| create_by | BIGINT | 是 | NULL | 创建人ID | - |
| update_by | BIGINT | 是 | NULL | 更新人ID | - |
| deleted | TINYINT | 否 | 0 | 删除标志 | 0-正常, 1-删除 |
| tenant_id | BIGINT | 否 | - | 租户ID | 当前租户标识 |

#### 3.1.3 枚举值定义

**role_type（角色类型）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 1 | 系统角色 | 系统预置角色，不可删除 |
| 2 | 业务角色 | 用户自定义角色 |

**data_scope（数据范围）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 1 | 全部数据 | 可查看所有数据 |
| 2 | 本部门数据 | 仅可查看本部门数据 |
| 3 | 本部门及子部门 | 可查看本部门及子部门数据 |
| 4 | 仅本人数据 | 仅可查看自己的数据 |
| 5 | 自定义 | 自定义数据范围 |

**status（角色状态）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 0 | 禁用 | 角色被禁用 |
| 1 | 启用 | 角色正常可用 |

#### 3.1.4 系统预置角色

| 角色编码 | 角色名称 | 角色类型 | 数据范围 |
|---------|---------|---------|---------|
| super_admin | 超级管理员 | 系统角色 | 全部数据 |
| tenant_admin | 租户管理员 | 系统角色 | 全部数据 |
| dept_manager | 部门经理 | 业务角色 | 本部门及子部门 |
| normal_user | 普通用户 | 业务角色 | 仅本人数据 |

---

### 3.2 角色权限关系表 (sys_role_permission)

**表说明**: 角色与权限的多对多关系

#### 3.2.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_role_permission |
| 中文名 | 角色权限关系表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |

#### 3.2.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 关系ID | 主键 |
| role_id | BIGINT | 否 | - | 角色ID | 外键：sys_role.id |
| permission_id | BIGINT | 否 | - | 权限ID | 外键：sys_permission.id |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | - |
| create_by | BIGINT | 是 | NULL | 创建人ID | - |

#### 3.2.3 业务规则

1. 一个角色可以有多个权限
2. 一个权限可以分配给多个角色
3. 角色-权限组合唯一

---

### 3.3 权限表 (sys_permission)

**表说明**: 系统权限定义

#### 3.3.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_permission |
| 中文名 | 权限表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |

#### 3.3.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 权限ID | 主键 |
| perm_code | VARCHAR(100) | 否 | - | 权限编码 | 唯一标识 |
| perm_name | VARCHAR(50) | 否 | - | 权限名称 | 显示名称 |
| resource_type | TINYINT | 否 | - | 资源类型 | 见枚举值 |
| resource_url | VARCHAR(200) | 是 | NULL | 资源URL | API路径或页面路径 |
| http_method | VARCHAR(10) | 是 | NULL | HTTP方法 | GET/POST/PUT/DELETE |
| parent_id | BIGINT | 否 | 0 | 父权限ID | 0表示根权限 |
| sort_order | INT | 否 | 0 | 排序号 | 显示顺序 |
| status | TINYINT | 否 | 1 | 状态 | 0-禁用, 1-启用 |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | - |
| update_time | DATETIME | 否 | CURRENT_TIMESTAMP | 更新时间 | - |

#### 3.3.3 枚举值定义

**resource_type（资源类型）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 1 | 菜单 | 页面菜单权限 |
| 2 | 按钮 | 页面按钮权限 |
| 3 | 接口 | API接口权限 |

**status（权限状态）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 0 | 禁用 | 权限被禁用 |
| 1 | 启用 | 权限正常可用 |

---

### 3.4 菜单表 (sys_menu)

**表说明**: 系统菜单定义

#### 3.4.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_menu |
| 中文名 | 菜单表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |

#### 3.4.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 菜单ID | 主键 |
| menu_name | VARCHAR(50) | 否 | - | 菜单名称 | 显示名称 |
| menu_type | TINYINT | 否 | - | 菜单类型 | 见枚举值 |
| icon | VARCHAR(100) | 是 | NULL | 菜单图标 | 图标类名 |
| path | VARCHAR(200) | 是 | NULL | 路由路径 | 前端路由 |
| component | VARCHAR(200) | 是 | NULL | 组件路径 | 前端组件 |
| permission | VARCHAR(100) | 是 | NULL | 权限标识 | 对应权限编码 |
| parent_id | BIGINT | 否 | 0 | 父菜单ID | 0表示根菜单 |
| menu_level | INT | 否 | 1 | 菜单层级 | 1-3级 |
| sort_order | INT | 否 | 0 | 排序号 | 显示顺序 |
| is_cache | TINYINT | 否 | 0 | 是否缓存 | 0-否, 1-是 |
| is_visible | TINYINT | 否 | 1 | 是否可见 | 0-否, 1-是 |
| status | TINYINT | 否 | 1 | 状态 | 0-禁用, 1-启用 |
| remark | VARCHAR(500) | 是 | NULL | 备注 | - |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | - |
| update_time | DATETIME | 否 | CURRENT_TIMESTAMP | 更新时间 | - |
| create_by | BIGINT | 是 | NULL | 创建人ID | - |
| update_by | BIGINT | 是 | NULL | 更新人ID | - |
| deleted | TINYINT | 否 | 0 | 删除标志 | 0-正常, 1-删除 |
| tenant_id | BIGINT | 否 | - | 租户ID | 当前租户标识 |

#### 3.4.3 枚举值定义

**menu_type（菜单类型）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 1 | 目录 | 菜单目录，可展开 |
| 2 | 菜单 | 页面菜单，可点击 |
| 3 | 按钮 | 页面按钮权限 |

**is_cache（是否缓存）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 0 | 否 | 不缓存页面 |
| 1 | 是 | 缓存页面 |

**is_visible（是否可见）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 0 | 否 | 隐藏菜单 |
| 1 | 是 | 显示菜单 |

---

## 四、组织管理表字典

### 4.1 部门表 (sys_dept)

**表说明**: 组织架构部门

#### 4.1.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_dept |
| 中文名 | 部门表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |

#### 4.1.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 部门ID | 主键 |
| dept_code | VARCHAR(50) | 否 | - | 部门编码 | 唯一标识 |
| dept_name | VARCHAR(50) | 否 | - | 部门名称 | 显示名称 |
| parent_id | BIGINT | 否 | 0 | 父部门ID | 0表示根部门 |
| ancestors | VARCHAR(500) | 是 | NULL | 祖先路径 | 如：0,1,2, |
| dept_level | INT | 否 | 1 | 部门层级 | 1-N级 |
| leader_id | BIGINT | 是 | NULL | 负责人ID | 外键：sys_user.id |
| sort_order | INT | 否 | 0 | 排序号 | 显示顺序 |
| status | TINYINT | 否 | 1 | 状态 | 0-禁用, 1-启用 |
| remark | VARCHAR(500) | 是 | NULL | 备注 | - |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | - |
| update_time | DATETIME | 否 | CURRENT_TIMESTAMP | 更新时间 | - |
| create_by | BIGINT | 是 | NULL | 创建人ID | - |
| update_by | BIGINT | 是 | NULL | 更新人ID | - |
| deleted | TINYINT | 否 | 0 | 删除标志 | 0-正常, 1-删除 |
| tenant_id | BIGINT | 否 | - | 租户ID | 当前租户标识 |

#### 4.1.3 枚举值定义

**status（部门状态）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 0 | 禁用 | 部门被禁用 |
| 1 | 启用 | 部门正常可用 |

#### 4.1.4 业务规则

1. 部门编码唯一，建议使用层级编码（如：01, 0101, 0102）
2. 支持多级部门结构
3. ancestors字段存储完整路径，便于查询
4. 删除部门前需确保无子部门和员工

---

### 4.2 岗位表 (sys_position)

**表说明**: 岗位定义

#### 4.2.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_position |
| 中文名 | 岗位表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |

#### 4.2.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 岗位ID | 主键 |
| position_code | VARCHAR(50) | 否 | - | 岗位编码 | 唯一标识 |
| position_name | VARCHAR(50) | 否 | - | 岗位名称 | 显示名称 |
| position_level | INT | 是 | NULL | 岗位级别 | 数字越小级别越高 |
| status | TINYINT | 否 | 1 | 状态 | 0-禁用, 1-启用 |
| sort_order | INT | 否 | 0 | 排序号 | 显示顺序 |
| remark | VARCHAR(500) | 是 | NULL | 备注 | - |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | - |
| update_time | DATETIME | 否 | CURRENT_TIMESTAMP | 更新时间 | - |
| create_by | BIGINT | 是 | NULL | 创建人ID | - |
| update_by | BIGINT | 是 | NULL | 更新人ID | - |
| deleted | TINYINT | 否 | 0 | 删除标志 | 0-正常, 1-删除 |
| tenant_id | BIGINT | 否 | - | 租户ID | 当前租户标识 |

#### 4.2.3 枚举值定义

**status（岗位状态）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 0 | 禁用 | 岗位被禁用 |
| 1 | 启用 | 岗位正常可用 |

#### 4.2.4 业务规则

1. 岗位编码唯一
2. 岗位级别数字越小级别越高（如：1-总裁，2-总监，3-经理）
3. 岗位与部门独立，一个岗位可属于多个部门

---

### 4.3 员工表 (sys_employee)

**表说明**: 员工信息

#### 4.3.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_employee |
| 中文名 | 员工表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |

#### 4.3.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 员工ID | 主键 |
| employee_no | VARCHAR(50) | 否 | - | 员工编号 | 唯一标识 |
| employee_name | VARCHAR(50) | 否 | - | 员工姓名 | 真实姓名 |
| user_id | BIGINT | 是 | NULL | 关联用户ID | 外键：sys_user.id，唯一 |
| dept_id | BIGINT | 否 | - | 所属部门ID | 外键：sys_dept.id |
| position_id | BIGINT | 是 | NULL | 岗位ID | 外键：sys_position.id |
| gender | TINYINT | 是 | 0 | 性别 | 0-未知, 1-男, 2-女 |
| birthday | DATE | 是 | NULL | 出生日期 | - |
| id_card | VARCHAR(100) | 是 | NULL | 身份证号 | 加密存储 |
| phone | VARCHAR(20) | 是 | NULL | 联系电话 | - |
| email | VARCHAR(100) | 是 | NULL | 邮箱 | - |
| entry_date | DATE | 是 | NULL | 入职日期 | - |
| leave_date | DATE | 是 | NULL | 离职日期 | - |
| employment_status | TINYINT | 否 | 1 | 在职状态 | 见枚举值 |
| work_location | VARCHAR(100) | 是 | NULL | 工作地点 | - |
| address | VARCHAR(200) | 是 | NULL | 家庭住址 | - |
| emergency_contact | VARCHAR(50) | 是 | NULL | 紧急联系人 | - |
| emergency_phone | VARCHAR(20) | 是 | NULL | 紧急联系电话 | - |
| remark | VARCHAR(500) | 是 | NULL | 备注 | - |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | - |
| update_time | DATETIME | 否 | CURRENT_TIMESTAMP | 更新时间 | - |
| create_by | BIGINT | 是 | NULL | 创建人ID | - |
| update_by | BIGINT | 是 | NULL | 更新人ID | - |
| deleted | TINYINT | 否 | 0 | 删除标志 | 0-正常, 1-删除 |
| tenant_id | BIGINT | 否 | - | 租户ID | 当前租户标识 |

#### 4.3.3 枚举值定义

**gender（性别）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 0 | 未知 | 未设置性别 |
| 1 | 男 | 男性 |
| 2 | 女 | 女性 |

**employment_status（在职状态）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 1 | 在职 | 正常在职 |
| 2 | 离职 | 已离职 |
| 3 | 试用期 | 试用期内 |
| 4 | 实习 | 实习期 |
| 5 | 停薪留职 | 停薪留职 |

#### 4.3.4 业务规则

1. 员工编号唯一，建议使用工号规则（如：年份+序号）
2. 一个员工最多关联一个用户账号（1:1或1:0）
3. 身份证号加密存储，确保隐私安全
4. 离职后保留员工信息，但标记为离职状态

---

## 五、数据字典统计

### 5.1 表统计

| 类别 | 表数量 | 字段总数 | 枚举值数量 |
|-----|-------|---------|-----------|
| 用户管理 | 3 | 48 | 6 |
| 权限管理 | 4 | 56 | 18 |
| 组织管理 | 3 | 54 | 8 |
| **总计** | **10** | **158** | **32** |

### 5.2 关系统计

| 关系类型 | 数量 | 说明 |
|---------|------|------|
| 1:1 | 1 | 用户-员工 |
| 1:N | 12 | 部门-用户、角色-用户等 |
| M:N | 3 | 用户-角色、用户-部门、角色-权限 |

---

## 六、审核记录

### 6.1 审核状态

| 审核项 | 状态 | 审核人 | 审核日期 |
|-------|------|-------|---------|
| 用户管理表字典 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 权限管理表字典 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 组织管理表字典 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 枚举值定义 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 业务规则完整性 | ✓ 通过 | 技术负责人 | 2026-03-08 |

### 6.2 签字确认

| 角色 | 姓名 | 签字 | 日期 |
|-----|------|------|------|
| 编制人 | 数据库架构师 | _____________ | 2026-03-08 |
| 审核人 | 技术负责人 | _____________ | 2026-03-08 |
| 批准人 | 项目经理 | _____________ | 2026-03-08 |

---

## 七、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 数据库架构师 | 初始版本，创建业务数据字典 |
