# 用户管理模块接口规范

> **文档编号**: SYS-INT-API-USER-001  
> **模块**: 用户管理 (USER)  
> **基础路径**: `/api/v1/users`  
> **版本**: v1  
> **日期**: 2026-03-09  
> **作者**: 系统架构师  
> **状态**: ✅ 已评审

---

## 一、模块概述

### 1.1 功能说明

用户管理模块提供系统用户的增删改查、状态管理、密码管理、角色分配等功能。

### 1.2 接口列表

| 序号 | 接口名称 | 方法 | 路径 | 权限要求 |
|-----|---------|------|------|---------|
| 1 | 查询用户列表 | GET | `/users` | user:read |
| 2 | 创建用户 | POST | `/users` | user:create |
| 3 | 查询用户详情 | GET | `/users/{id}` | user:read |
| 4 | 更新用户 | PUT | `/users/{id}` | user:update |
| 5 | 部分更新用户 | PATCH | `/users/{id}` | user:update |
| 6 | 删除用户 | DELETE | `/users/{id}` | user:delete |
| 7 | 批量删除用户 | DELETE | `/users/batch` | user:delete |
| 8 | 启用用户 | POST | `/users/{id}/enable` | user:update |
| 9 | 禁用用户 | POST | `/users/{id}/disable` | user:update |
| 10 | 重置密码 | POST | `/users/{id}/reset-password` | user:update |
| 11 | 修改密码 | POST | `/users/{id}/change-password` | user:update |
| 12 | 查询用户角色 | GET | `/users/{id}/roles` | user:read, role:read |
| 13 | 分配用户角色 | POST | `/users/{id}/roles` | user:update, role:update |
| 14 | 查询用户部门 | GET | `/users/{id}/depts` | user:read, org:read |
| 15 | 导出用户 | POST | `/users/export` | user:read |

---

## 二、接口详细定义

### 1. 查询用户列表

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 查询用户列表 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/users` |
| 权限要求 | user:read |

#### 请求参数

**Query参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| page | integer | 否 | 当前页码，默认1 | 1 |
| size | integer | 否 | 每页大小，默认10 | 10 |
| keyword | string | 否 | 搜索关键词（用户名/昵称/手机号） | zhangsan |
| status | integer | 否 | 用户状态：0-禁用，1-启用 | 1 |
| deptId | integer | 否 | 部门ID | 1 |
| roleId | integer | 否 | 角色ID | 1 |
| startTime | string | 否 | 创建时间开始（ISO 8601） | 2024-01-01T00:00:00Z |
| endTime | string | 否 | 创建时间结束（ISO 8601） | 2024-12-31T23:59:59Z |
| sort | string | 否 | 排序字段，格式：字段,方向 | createTime,desc |

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
        "username": "zhangsan",
        "nickname": "张三",
        "email": "zhangsan@example.com",
        "phone": "13800138000",
        "avatar": "https://cdn.example.com/avatar/1.jpg",
        "status": 1,
        "statusName": "启用",
        "deptId": 1,
        "deptName": "技术部",
        "roleIds": [1, 2],
        "roleNames": ["系统管理员", "普通用户"],
        "createTime": "2024-01-01T10:00:00Z",
        "updateTime": "2024-01-01T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10,
    "pages": 10
  },
  "timestamp": 1709827200000
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 用户ID |
| username | string | 用户名 |
| nickname | string | 昵称 |
| email | string | 邮箱 |
| phone | string | 手机号 |
| avatar | string | 头像URL |
| status | integer | 状态：0-禁用，1-启用 |
| statusName | string | 状态名称 |
| deptId | integer | 部门ID |
| deptName | string | 部门名称 |
| roleIds | array | 角色ID列表 |
| roleNames | array | 角色名称列表 |
| createTime | string | 创建时间（ISO 8601） |
| updateTime | string | 更新时间（ISO 8601） |

#### 请求示例

```http
GET /api/v1/users?page=1&size=10&keyword=zhangsan&status=1&sort=createTime,desc
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

### 2. 创建用户

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 创建用户 |
| 请求方法 | POST |
| 接口路径 | `/api/v1/users` |
| 权限要求 | user:create |

#### 请求参数

**Body参数** (application/json):

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| username | string | 是 | 用户名，3-20字符 | zhangsan |
| nickname | string | 否 | 昵称，2-50字符 | 张三 |
| email | string | 是 | 邮箱 | zhangsan@example.com |
| phone | string | 否 | 手机号 | 13800138000 |
| password | string | 是 | 密码，6-20字符 | ****** |
| avatar | string | 否 | 头像URL | https://... |
| gender | integer | 否 | 性别：0-未知，1-男，2-女 | 1 |
| deptId | integer | 否 | 部门ID | 1 |
| roleIds | array | 否 | 角色ID列表 | [1, 2] |
| remark | string | 否 | 备注 | 新员工 |

#### 请求示例

```http
POST /api/v1/users
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "username": "zhangsan",
  "nickname": "张三",
  "email": "zhangsan@example.com",
  "phone": "13800138000",
  "password": "123456",
  "gender": 1,
  "deptId": 1,
  "roleIds": [1, 2],
  "remark": "技术部新员工"
}
```

#### 响应数据

**成功响应** (201 Created):

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 1,
    "username": "zhangsan",
    "nickname": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "status": 1,
    "createTime": "2024-03-09T10:00:00Z"
  },
  "timestamp": 1709827200000
}
```

**错误响应** (400 Bad Request):

```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": {
    "errors": [
      {
        "field": "username",
        "message": "用户名已存在"
      }
    ]
  },
  "timestamp": 1709827200000
}
```

---

### 3. 查询用户详情

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 查询用户详情 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/users/{id}` |
| 权限要求 | user:read |

#### 请求参数

**Path参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| id | integer | 是 | 用户ID | 1 |

#### 响应数据

**成功响应** (200 OK):

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "zhangsan",
    "nickname": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "avatar": "https://cdn.example.com/avatar/1.jpg",
    "gender": 1,
    "genderName": "男",
    "status": 1,
    "statusName": "启用",
    "deptId": 1,
    "deptName": "技术部",
    "roleIds": [1, 2],
    "roleNames": ["系统管理员", "普通用户"],
    "remark": "技术部新员工",
    "lastLoginTime": "2024-03-09T09:00:00Z",
    "lastLoginIp": "192.168.1.1",
    "createTime": "2024-01-01T10:00:00Z",
    "updateTime": "2024-03-09T10:00:00Z"
  },
  "timestamp": 1709827200000
}
```

---

### 4. 更新用户

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 更新用户 |
| 请求方法 | PUT |
| 接口路径 | `/api/v1/users/{id}` |
| 权限要求 | user:update |

#### 请求参数

**Path参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| id | integer | 是 | 用户ID | 1 |

**Body参数** (application/json):

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| nickname | string | 否 | 昵称 |
| email | string | 否 | 邮箱 |
| phone | string | 否 | 手机号 |
| avatar | string | 否 | 头像URL |
| gender | integer | 否 | 性别 |
| deptId | integer | 否 | 部门ID |
| remark | string | 否 | 备注 |

**注意**: PUT请求为全量更新，未提供的字段将被置空或设为默认值。

#### 请求示例

```http
PUT /api/v1/users/1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "nickname": "张三三",
  "email": "zhangsan.new@example.com",
  "phone": "13900139000",
  "deptId": 2,
  "remark": "已调岗至产品部"
}
```

---

### 5. 部分更新用户

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 部分更新用户 |
| 请求方法 | PATCH |
| 接口路径 | `/api/v1/users/{id}` |
| 权限要求 | user:update |

#### 请求参数

**Path参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| id | integer | 是 | 用户ID | 1 |

**Body参数** (application/json):

只提供需要更新的字段。

#### 请求示例

```http
PATCH /api/v1/users/1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "phone": "13900139000"
}
```

---

### 6. 删除用户

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 删除用户 |
| 请求方法 | DELETE |
| 接口路径 | `/api/v1/users/{id}` |
| 权限要求 | user:delete |

#### 请求参数

**Path参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| id | integer | 是 | 用户ID | 1 |

#### 响应数据

**成功响应** (200 OK):

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null,
  "timestamp": 1709827200000
}
```

**错误响应** (409 Conflict):

```json
{
  "code": 409,
  "message": "该用户有关联数据，无法删除",
  "data": null,
  "timestamp": 1709827200000
}
```

---

### 7. 批量删除用户

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 批量删除用户 |
| 请求方法 | DELETE |
| 接口路径 | `/api/v1/users/batch` |
| 权限要求 | user:delete |

#### 请求参数

**Body参数** (application/json):

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| ids | array | 是 | 用户ID列表 | [1, 2, 3] |

#### 请求示例

```http
DELETE /api/v1/users/batch
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "ids": [1, 2, 3]
}
```

---

### 8. 启用用户

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 启用用户 |
| 请求方法 | POST |
| 接口路径 | `/api/v1/users/{id}/enable` |
| 权限要求 | user:update |

#### 请求参数

**Path参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| id | integer | 是 | 用户ID | 1 |

#### 响应数据

**成功响应** (200 OK):

```json
{
  "code": 200,
  "message": "启用成功",
  "data": {
    "id": 1,
    "status": 1,
    "statusName": "启用"
  },
  "timestamp": 1709827200000
}
```

---

### 9. 禁用用户

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 禁用用户 |
| 请求方法 | POST |
| 接口路径 | `/api/v1/users/{id}/disable` |
| 权限要求 | user:update |

#### 响应数据

**成功响应** (200 OK):

```json
{
  "code": 200,
  "message": "禁用成功",
  "data": {
    "id": 1,
    "status": 0,
    "statusName": "禁用"
  },
  "timestamp": 1709827200000
}
```

---

### 10. 重置密码

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 重置密码 |
| 请求方法 | POST |
| 接口路径 | `/api/v1/users/{id}/reset-password` |
| 权限要求 | user:update |

#### 请求参数

**Path参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| id | integer | 是 | 用户ID | 1 |

**Body参数** (application/json):

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| newPassword | string | 是 | 新密码 | ****** |

#### 响应数据

**成功响应** (200 OK):

```json
{
  "code": 200,
  "message": "密码重置成功",
  "data": null,
  "timestamp": 1709827200000
}
```

---

### 11. 修改密码

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 修改密码 |
| 请求方法 | POST |
| 接口路径 | `/api/v1/users/{id}/change-password` |
| 权限要求 | user:update |

#### 请求参数

**Path参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| id | integer | 是 | 用户ID | 1 |

**Body参数** (application/json):

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| oldPassword | string | 是 | 原密码 | ****** |
| newPassword | string | 是 | 新密码 | ****** |

#### 响应数据

**错误响应** (400 Bad Request):

```json
{
  "code": 400,
  "message": "原密码错误",
  "data": null,
  "timestamp": 1709827200000
}
```

---

### 12. 查询用户角色

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 查询用户角色 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/users/{id}/roles` |
| 权限要求 | user:read, role:read |

#### 响应数据

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "code": "admin",
      "name": "系统管理员",
      "description": "拥有所有权限"
    },
    {
      "id": 2,
      "code": "user",
      "name": "普通用户",
      "description": "普通用户权限"
    }
  ],
  "timestamp": 1709827200000
}
```

---

### 13. 分配用户角色

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 分配用户角色 |
| 请求方法 | POST |
| 接口路径 | `/api/v1/users/{id}/roles` |
| 权限要求 | user:update, role:update |

#### 请求参数

**Body参数** (application/json):

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| roleIds | array | 是 | 角色ID列表 | [1, 2] |

#### 请求示例

```http
POST /api/v1/users/1/roles
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "roleIds": [1, 2]
}
```

---

### 14. 查询用户部门

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 查询用户部门 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/users/{id}/depts` |
| 权限要求 | user:read, org:read |

#### 响应数据

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "code": "tech",
      "name": "技术部",
      "parentId": 0,
      "path": "/1/",
      "isMain": true
    }
  ],
  "timestamp": 1709827200000
}
```

---

### 15. 导出用户

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 导出用户 |
| 请求方法 | POST |
| 接口路径 | `/api/v1/users/export` |
| 权限要求 | user:read |

#### 请求参数

**Body参数** (application/json):

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| keyword | string | 否 | 搜索关键词 | zhangsan |
| status | integer | 否 | 用户状态 | 1 |
| deptId | integer | 否 | 部门ID | 1 |
| format | string | 否 | 导出格式：xlsx/csv，默认xlsx | xlsx |

#### 响应数据

**成功响应**: 返回文件流

```http
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="users_20240309.xlsx"
```

---

## 三、数据模型

### 3.1 用户对象 (User)

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| id | integer | 是 | 用户ID |
| username | string | 是 | 用户名，3-20字符，字母数字下划线 |
| nickname | string | 否 | 昵称，2-50字符 |
| email | string | 是 | 邮箱，唯一 |
| phone | string | 否 | 手机号，11位数字 |
| avatar | string | 否 | 头像URL |
| gender | integer | 否 | 性别：0-未知，1-男，2-女 |
| password | string | 是 | 密码，加密存储 |
| status | integer | 是 | 状态：0-禁用，1-启用 |
| deptId | integer | 否 | 主部门ID |
| remark | string | 否 | 备注，最多500字符 |
| lastLoginTime | datetime | 否 | 最后登录时间 |
| lastLoginIp | string | 否 | 最后登录IP |
| createTime | datetime | 是 | 创建时间 |
| updateTime | datetime | 是 | 更新时间 |

### 3.2 用户状态枚举

| 值 | 名称 | 说明 |
|---|------|------|
| 0 | 禁用 | 用户无法登录 |
| 1 | 启用 | 用户正常使用 |

### 3.3 性别枚举

| 值 | 名称 | 说明 |
|---|------|------|
| 0 | 未知 | 未设置性别 |
| 1 | 男 | 男性 |
| 2 | 女 | 女性 |

---

## 四、错误码

| 错误码 | 错误信息 | 说明 |
|-------|---------|------|
| 400 | 请求参数错误 | 参数校验失败 |
| 401 | 未认证 | Token无效或过期 |
| 403 | 无权限 | 用户无此操作权限 |
| 404 | 用户不存在 | 指定的用户ID不存在 |
| 409 | 数据冲突 | 用户名/邮箱已存在 |
| 422 | 业务规则校验失败 | 如：不能删除当前登录用户 |
| 500 | 服务器内部错误 | 系统异常 |

---

## 五、相关文档

- [API接口清单](./01-api-interface-list.md)
- [RESTful API设计规范](../01-rest-api-standard/01-restful-api-standard.md)
- [接口安全规范](../01-rest-api-standard/02-interface-security-standard.md)

---

## 六、评审记录

### 6.1 评审意见

| 序号 | 评审项 | 评审结果 | 评审意见 |
|-----|--------|---------|---------|
| 1 | 接口完整性 | ✓ 通过 | 覆盖用户管理所有功能点 |
| 2 | 接口规范性 | ✓ 通过 | 符合RESTful API设计规范 |
| 3 | 权限设计 | ✓ 通过 | 权限编码规范，粒度合理 |
| 4 | 请求参数 | ✓ 通过 | 参数定义清晰，校验规则明确 |
| 5 | 响应格式 | ✓ 通过 | 统一响应格式，字段完整 |

### 6.2 评审结论

**评审结论**: 通过

**评审意见**: 用户管理模块接口规范完整，设计合理，可作为开发依据。

### 6.3 签字确认

| 角色 | 姓名 | 签字 | 日期 | 意见 |
|-----|------|------|------|------|
| 技术总监 | 张总 | _______________ | 2026-03-09 | 同意 |
| 系统架构师 | 李工 | _______________ | 2026-03-09 | 同意 |
| 后端架构师 | 王工 | _______________ | 2026-03-09 | 同意 |
| 前端负责人 | 陈工 | _______________ | 2026-03-09 | 同意 |

---

## 七、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-09 | 系统架构师 | 初始版本，定义用户管理模块15个接口 |
