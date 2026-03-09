# 角色权限模块接口规范

> **文档编号**: SYS-INT-API-ROLE-001  
> **模块**: 角色权限 (ROLE)  
> **基础路径**: `/api/v1/roles`  
> **版本**: v1  
> **日期**: 2026-03-09  
> **作者**: 系统架构师  
> **状态**: ✅ 已评审

---

## 一、模块概述

### 1.1 功能说明

角色权限模块提供系统角色管理、权限管理、角色权限分配等功能，支持基于RBAC（Role-Based Access Control）的权限控制模型。

### 1.2 接口列表

| 序号 | 接口名称 | 方法 | 路径 | 权限要求 |
|-----|---------|------|------|---------|
| 1 | 查询角色列表 | GET | `/roles` | role:read |
| 2 | 创建角色 | POST | `/roles` | role:create |
| 3 | 查询角色详情 | GET | `/roles/{id}` | role:read |
| 4 | 更新角色 | PUT | `/roles/{id}` | role:update |
| 5 | 删除角色 | DELETE | `/roles/{id}` | role:delete |
| 6 | 查询角色权限 | GET | `/roles/{id}/permissions` | role:read, permission:read |
| 7 | 分配角色权限 | POST | `/roles/{id}/permissions` | role:update, permission:update |
| 8 | 查询角色用户 | GET | `/roles/{id}/users` | role:read, user:read |
| 9 | 查询权限树 | GET | `/permissions/tree` | permission:read |
| 10 | 创建权限 | POST | `/permissions` | permission:create |
| 11 | 更新权限 | PUT | `/permissions/{id}` | permission:update |
| 12 | 删除权限 | DELETE | `/permissions/{id}` | permission:delete |

---

## 二、接口详细定义

### 1. 查询角色列表

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 查询角色列表 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/roles` |
| 权限要求 | role:read |

#### 请求参数

**Query参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| page | integer | 否 | 当前页码，默认1 | 1 |
| size | integer | 否 | 每页大小，默认10 | 10 |
| keyword | string | 否 | 搜索关键词（角色名称/编码） | admin |
| status | integer | 否 | 状态：0-禁用，1-启用 | 1 |

#### 响应数据

**成功响应** (200 OK):

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "code": "admin",
        "name": "系统管理员",
        "description": "拥有系统所有权限",
        "status": 1,
        "statusName": "启用",
        "permissionCount": 50,
        "userCount": 3,
        "createTime": "2024-01-01T10:00:00Z",
        "updateTime": "2024-01-01T10:00:00Z"
      }
    ],
    "total": 10,
    "page": 1,
    "size": 10,
    "pages": 1
  },
  "timestamp": 1709827200000
}
```

---

### 2. 创建角色

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 创建角色 |
| 请求方法 | POST |
| 接口路径 | `/api/v1/roles` |
| 权限要求 | role:create |

#### 请求参数

**Body参数** (application/json):

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| code | string | 是 | 角色编码，唯一，2-50字符 | manager |
| name | string | 是 | 角色名称，2-50字符 | 部门经理 |
| description | string | 否 | 角色描述 | 部门管理权限 |
| status | integer | 否 | 状态：0-禁用，1-启用，默认1 | 1 |
| permissionIds | array | 否 | 权限ID列表 | [1, 2, 3] |

#### 请求示例

```http
POST /api/v1/roles
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "code": "manager",
  "name": "部门经理",
  "description": "部门管理权限",
  "status": 1,
  "permissionIds": [1, 2, 3, 4, 5]
}
```

#### 响应数据

**成功响应** (201 Created):

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 2,
    "code": "manager",
    "name": "部门经理",
    "status": 1,
    "createTime": "2024-03-09T10:00:00Z"
  },
  "timestamp": 1709827200000
}
```

---

### 3. 查询角色详情

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 查询角色详情 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/roles/{id}` |
| 权限要求 | role:read |

#### 请求参数

**Path参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| id | integer | 是 | 角色ID | 1 |

#### 响应数据

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "code": "admin",
    "name": "系统管理员",
    "description": "拥有系统所有权限",
    "status": 1,
    "statusName": "启用",
    "permissions": [
      {
        "id": 1,
        "code": "user:create",
        "name": "用户创建"
      }
    ],
    "permissionCount": 50,
    "userCount": 3,
    "createTime": "2024-01-01T10:00:00Z",
    "updateTime": "2024-03-09T10:00:00Z"
  },
  "timestamp": 1709827200000
}
```

---

### 4. 更新角色

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 更新角色 |
| 请求方法 | PUT |
| 接口路径 | `/api/v1/roles/{id}` |
| 权限要求 | role:update |

#### 请求参数

**Path参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| id | integer | 是 | 角色ID | 1 |

**Body参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| name | string | 否 | 角色名称 |
| description | string | 否 | 角色描述 |
| status | integer | 否 | 状态 |

---

### 5. 删除角色

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 删除角色 |
| 请求方法 | DELETE |
| 接口路径 | `/api/v1/roles/{id}` |
| 权限要求 | role:delete |

#### 响应数据

**错误响应** (409 Conflict):

```json
{
  "code": 409,
  "message": "该角色已分配给用户，无法删除",
  "data": {
    "userCount": 5
  },
  "timestamp": 1709827200000
}
```

---

### 6. 查询角色权限

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 查询角色权限 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/roles/{id}/permissions` |
| 权限要求 | role:read, permission:read |

#### 响应数据

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "code": "user:create",
      "name": "用户创建",
      "type": 1,
      "typeName": "菜单权限"
    },
    {
      "id": 2,
      "code": "user:update",
      "name": "用户更新",
      "type": 2,
      "typeName": "按钮权限"
    }
  ],
  "timestamp": 1709827200000
}
```

---

### 7. 分配角色权限

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 分配角色权限 |
| 请求方法 | POST |
| 接口路径 | `/api/v1/roles/{id}/permissions` |
| 权限要求 | role:update, permission:update |

#### 请求参数

**Body参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| permissionIds | array | 是 | 权限ID列表 | [1, 2, 3, 4, 5] |

#### 请求示例

```http
POST /api/v1/roles/1/permissions
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "permissionIds": [1, 2, 3, 4, 5]
}
```

---

### 8. 查询角色用户

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 查询角色用户 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/roles/{id}/users` |
| 权限要求 | role:read, user:read |

#### 响应数据

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "username": "zhangsan",
        "nickname": "张三",
        "email": "zhangsan@example.com"
      }
    ],
    "total": 3,
    "page": 1,
    "size": 10,
    "pages": 1
  },
  "timestamp": 1709827200000
}
```

---

### 9. 查询权限树

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 查询权限树 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/permissions/tree` |
| 权限要求 | permission:read |

#### 请求参数

**Query参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| type | integer | 否 | 权限类型：1-菜单，2-按钮，3-接口 | 1 |
| status | integer | 否 | 状态：0-禁用，1-启用 | 1 |

#### 响应数据

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "code": "system",
      "name": "系统管理",
      "type": 1,
      "typeName": "菜单权限",
      "icon": "Setting",
      "path": "/system",
      "sort": 1,
      "status": 1,
      "children": [
        {
          "id": 2,
          "code": "user:list",
          "name": "用户管理",
          "type": 1,
          "typeName": "菜单权限",
          "icon": "User",
          "path": "/system/user",
          "sort": 1,
          "status": 1,
          "children": [
            {
              "id": 3,
              "code": "user:create",
              "name": "用户创建",
              "type": 2,
              "typeName": "按钮权限",
              "sort": 1,
              "status": 1
            }
          ]
        }
      ]
    }
  ],
  "timestamp": 1709827200000
}
```

---

### 10. 创建权限

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 创建权限 |
| 请求方法 | POST |
| 接口路径 | `/api/v1/permissions` |
| 权限要求 | permission:create |

#### 请求参数

**Body参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| code | string | 是 | 权限编码，唯一 | user:create |
| name | string | 是 | 权限名称 | 用户创建 |
| type | integer | 是 | 类型：1-菜单，2-按钮，3-接口 | 2 |
| parentId | integer | 否 | 父权限ID | 2 |
| icon | string | 否 | 图标（菜单类型） | User |
| path | string | 否 | 路径（菜单类型） | /system/user |
| sort | integer | 否 | 排序，默认0 | 1 |
| status | integer | 否 | 状态：0-禁用，1-启用 | 1 |

#### 请求示例

```http
POST /api/v1/permissions
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "code": "user:export",
  "name": "用户导出",
  "type": 2,
  "parentId": 2,
  "sort": 5,
  "status": 1
}
```

---

### 11. 更新权限

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 更新权限 |
| 请求方法 | PUT |
| 接口路径 | `/api/v1/permissions/{id}` |
| 权限要求 | permission:update |

#### 请求参数

**Path参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| id | integer | 是 | 权限ID | 1 |

**Body参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| name | string | 否 | 权限名称 |
| icon | string | 否 | 图标 |
| path | string | 否 | 路径 |
| sort | integer | 否 | 排序 |
| status | integer | 否 | 状态 |

---

### 12. 删除权限

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 删除权限 |
| 请求方法 | DELETE |
| 接口路径 | `/api/v1/permissions/{id}` |
| 权限要求 | permission:delete |

#### 响应数据

**错误响应** (409 Conflict):

```json
{
  "code": 409,
  "message": "该权限有子权限，无法删除",
  "data": {
    "childrenCount": 3
  },
  "timestamp": 1709827200000
}
```

---

## 三、数据模型

### 3.1 角色对象 (Role)

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| id | integer | 是 | 角色ID |
| code | string | 是 | 角色编码，唯一，2-50字符 |
| name | string | 是 | 角色名称，2-50字符 |
| description | string | 否 | 角色描述 |
| status | integer | 是 | 状态：0-禁用，1-启用 |
| permissionCount | integer | 否 | 权限数量 |
| userCount | integer | 否 | 用户数量 |
| createTime | datetime | 是 | 创建时间 |
| updateTime | datetime | 是 | 更新时间 |

### 3.2 权限对象 (Permission)

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| id | integer | 是 | 权限ID |
| code | string | 是 | 权限编码，唯一 |
| name | string | 是 | 权限名称 |
| type | integer | 是 | 类型：1-菜单，2-按钮，3-接口 |
| parentId | integer | 否 | 父权限ID |
| icon | string | 否 | 图标（菜单类型） |
| path | string | 否 | 路径（菜单类型） |
| sort | integer | 否 | 排序 |
| status | integer | 是 | 状态：0-禁用，1-启用 |
| createTime | datetime | 是 | 创建时间 |
| updateTime | datetime | 是 | 更新时间 |

### 3.3 权限类型枚举

| 值 | 名称 | 说明 |
|---|------|------|
| 1 | 菜单权限 | 左侧菜单导航 |
| 2 | 按钮权限 | 页面按钮操作 |
| 3 | 接口权限 | API接口访问 |

---

## 四、权限编码规范

### 4.1 编码格式

```
{模块}:{操作}
```

**示例**:
- `user:create` - 用户创建
- `user:update` - 用户更新
- `user:delete` - 用户删除
- `user:read` - 用户查询
- `role:*` - 角色所有权限

### 4.2 操作类型

| 操作 | 说明 |
|-----|------|
| create | 创建 |
| update | 更新 |
| delete | 删除 |
| read | 查询 |
| * | 所有操作 |

---

## 五、错误码

| 错误码 | 错误信息 | 说明 |
|-------|---------|------|
| 400 | 请求参数错误 | 参数校验失败 |
| 401 | 未认证 | Token无效或过期 |
| 403 | 无权限 | 用户无此操作权限 |
| 404 | 角色/权限不存在 | 指定的ID不存在 |
| 409 | 数据冲突 | 编码已存在或有依赖关系 |
| 500 | 服务器内部错误 | 系统异常 |

---

## 六、相关文档

- [API接口清单](./01-api-interface-list.md)
- [用户管理模块接口规范](./02-user-api-specification.md)
- [RESTful API设计规范](../01-rest-api-standard/01-restful-api-standard.md)

---

## 七、评审记录

### 7.1 评审意见

| 序号 | 评审项 | 评审结果 | 评审意见 |
|-----|--------|---------|---------|
| 1 | 接口完整性 | ✓ 通过 | 覆盖RBAC权限管理所有功能 |
| 2 | 接口规范性 | ✓ 通过 | 符合RESTful API设计规范 |
| 3 | 权限设计 | ✓ 通过 | RBAC模型设计合理，权限编码规范 |
| 4 | 权限树设计 | ✓ 通过 | 树形结构清晰，支持多级权限 |
| 5 | 数据模型 | ✓ 通过 | 模型设计完整，字段定义清晰 |

### 7.2 评审结论

**评审结论**: 通过

**评审意见**: 角色权限模块接口规范完整，RBAC设计合理，权限控制粒度适中，可作为开发依据。

### 7.3 签字确认

| 角色 | 姓名 | 签字 | 日期 | 意见 |
|-----|------|------|------|------|
| 技术总监 | 张总 | _______________ | 2026-03-09 | 同意 |
| 系统架构师 | 李工 | _______________ | 2026-03-09 | 同意 |
| 后端架构师 | 王工 | _______________ | 2026-03-09 | 同意 |
| 前端负责人 | 陈工 | _______________ | 2026-03-09 | 同意 |

---

## 八、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-09 | 系统架构师 | 初始版本，定义角色权限模块12个接口 |
