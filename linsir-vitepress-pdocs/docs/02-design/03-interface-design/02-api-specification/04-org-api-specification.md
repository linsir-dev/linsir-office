# 组织架构模块接口规范

> **文档编号**: SYS-INT-API-ORG-001  
> **模块**: 组织架构 (ORG)  
> **基础路径**: `/api/v1/orgs`  
> **版本**: v1  
> **日期**: 2026-03-09  
> **作者**: 系统架构师  
> **状态**: ✅ 已评审

---

## 一、模块概述

### 1.1 功能说明

组织架构模块提供部门管理和岗位管理功能，支持树形结构的组织架构管理，实现人员和部门的关联。

### 1.2 接口列表

| 序号 | 接口名称 | 方法 | 路径 | 权限要求 |
|-----|---------|------|------|---------|
| 1 | 查询部门树 | GET | `/depts/tree` | org:read |
| 2 | 创建部门 | POST | `/depts` | org:create |
| 3 | 查询部门详情 | GET | `/depts/{id}` | org:read |
| 4 | 更新部门 | PUT | `/depts/{id}` | org:update |
| 5 | 删除部门 | DELETE | `/depts/{id}` | org:delete |
| 6 | 查询部门用户 | GET | `/depts/{id}/users` | org:read, user:read |
| 7 | 查询岗位列表 | GET | `/posts` | org:read |
| 8 | 创建岗位 | POST | `/posts` | org:create |
| 9 | 更新岗位 | PUT | `/posts/{id}` | org:update |
| 10 | 删除岗位 | DELETE | `/posts/{id}` | org:delete |

---

## 二、接口详细定义

### 1. 查询部门树

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 查询部门树 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/orgs/depts/tree` |
| 权限要求 | org:read |

#### 请求参数

**Query参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| status | integer | 否 | 状态：0-禁用，1-启用 | 1 |

#### 响应数据

**成功响应**:

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "code": "company",
      "name": "总公司",
      "parentId": 0,
      "path": "/1/",
      "level": 1,
      "sort": 1,
      "leader": "张总",
      "phone": "010-12345678",
      "email": "company@example.com",
      "status": 1,
      "statusName": "启用",
      "userCount": 100,
      "children": [
        {
          "id": 2,
          "code": "tech",
          "name": "技术部",
          "parentId": 1,
          "path": "/1/2/",
          "level": 2,
          "sort": 1,
          "leader": "李经理",
          "phone": "010-12345679",
          "email": "tech@example.com",
          "status": 1,
          "statusName": "启用",
          "userCount": 30,
          "children": [
            {
              "id": 3,
              "code": "backend",
              "name": "后端组",
              "parentId": 2,
              "path": "/1/2/3/",
              "level": 3,
              "sort": 1,
              "leader": "王组长",
              "status": 1,
              "statusName": "启用",
              "userCount": 15,
              "children": []
            }
          ]
        }
      ]
    }
  ],
  "error": null,
  "message": "ok"
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 部门ID |
| code | string | 部门编码 |
| name | string | 部门名称 |
| parentId | integer | 父部门ID，0表示顶级部门 |
| path | string | 部门路径，如 /1/2/3/ |
| level | integer | 部门层级 |
| sort | integer | 排序号 |
| leader | string | 负责人姓名 |
| phone | string | 联系电话 |
| email | string | 邮箱 |
| status | integer | 状态：0-禁用，1-启用 |
| statusName | string | 状态名称 |
| userCount | integer | 部门用户数 |
| children | array | 子部门列表 |

---

### 2. 创建部门

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 创建部门 |
| 请求方法 | POST |
| 接口路径 | `/api/v1/orgs/depts` |
| 权限要求 | org:create |

#### 请求参数

**Body参数** (application/json):

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| code | string | 是 | 部门编码，唯一，2-50字符 | frontend |
| name | string | 是 | 部门名称，2-50字符 | 前端组 |
| parentId | integer | 否 | 父部门ID，默认0 | 2 |
| sort | integer | 否 | 排序号，默认0 | 2 |
| leader | string | 否 | 负责人姓名 | 赵组长 |
| phone | string | 否 | 联系电话 | 010-12345680 |
| email | string | 否 | 邮箱 | frontend@example.com |
| status | integer | 否 | 状态：0-禁用，1-启用，默认1 | 1 |

#### 请求示例

```http
POST /api/v1/orgs/depts
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "code": "frontend",
  "name": "前端组",
  "parentId": 2,
  "sort": 2,
  "leader": "赵组长",
  "phone": "010-12345680",
  "email": "frontend@example.com",
  "status": 1
}
```

#### 响应数据

**成功响应**:

```json
{
  "code": 0,
  "data": {
    "id": 4,
    "code": "frontend",
    "name": "前端组",
    "parentId": 2,
    "path": "/1/2/4/",
    "level": 3,
    "status": 1,
    "createTime": "2024-03-09T10:00:00Z"
  },
  "error": null,
  "message": "ok"
}
```

---

### 3. 查询部门详情

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 查询部门详情 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/orgs/depts/{id}` |
| 权限要求 | org:read |

#### 请求参数

**Path参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| id | integer | 是 | 部门ID | 2 |

#### 响应数据

```json
{
  "code": 0,
  "data": {
    "id": 2,
    "code": "tech",
    "name": "技术部",
    "parentId": 1,
    "parentName": "总公司",
    "path": "/1/2/",
    "level": 2,
    "sort": 1,
    "leader": "李经理",
    "phone": "010-12345679",
    "email": "tech@example.com",
    "status": 1,
    "statusName": "启用",
    "userCount": 30,
    "createTime": "2024-01-01T10:00:00Z",
    "updateTime": "2024-03-09T10:00:00Z"
  },
  "error": null,
  "message": "ok"
}
```

---

### 4. 更新部门

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 更新部门 |
| 请求方法 | PUT |
| 接口路径 | `/api/v1/orgs/depts/{id}` |
| 权限要求 | org:update |

#### 请求参数

**Path参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| id | integer | 是 | 部门ID | 2 |

**Body参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| name | string | 否 | 部门名称 |
| sort | integer | 否 | 排序号 |
| leader | string | 否 | 负责人 |
| phone | string | 否 | 联系电话 |
| email | string | 否 | 邮箱 |
| status | integer | 否 | 状态 |

**注意**: 不能修改部门编码和父部门ID，如需调整部门位置，需使用专门的移动接口。

---

### 5. 删除部门

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 删除部门 |
| 请求方法 | DELETE |
| 接口路径 | `/api/v1/orgs/depts/{id}` |
| 权限要求 | org:delete |

#### 响应数据

**错误响应**:

```json
{
  "code": -1,
  "data": {
    "childrenCount": 3
  },
  "error": "该部门有子部门，无法删除",
  "message": "该部门有子部门，无法删除"
}
```

或

```json
{
  "code": -1,
  "data": {
    "userCount": 10
  },
  "error": "该部门有关联用户，无法删除",
  "message": "该部门有关联用户，无法删除"
}
```

---

### 6. 查询部门用户

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 查询部门用户 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/orgs/depts/{id}/users` |
| 权限要求 | org:read, user:read |

#### 请求参数

**Path参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| id | integer | 是 | 部门ID | 2 |

**Query参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| page | integer | 否 | 当前页码，默认1 | 1 |
| size | integer | 否 | 每页大小，默认10 | 10 |
| recursive | boolean | 否 | 是否包含子部门用户，默认false | true |

#### 响应数据

```json
{
  "code": 0,
  "data": {
    "items": [
      {
        "id": 1,
        "username": "zhangsan",
        "nickname": "张三",
        "email": "zhangsan@example.com",
        "phone": "13800138000",
        "postName": "高级工程师",
        "isMainDept": true,
        "joinTime": "2024-01-01T10:00:00Z"
      }
    ],
    "total": 30
  },
  "error": null,
  "message": "ok"
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|-----|------|------|
| postName | string | 岗位名称 |
| isMainDept | boolean | 是否主部门 |
| joinTime | string | 加入部门时间 |

---

### 7. 查询岗位列表

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 查询岗位列表 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/orgs/posts` |
| 权限要求 | org:read |

#### 请求参数

**Query参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| page | integer | 否 | 当前页码，默认1 | 1 |
| size | integer | 否 | 每页大小，默认10 | 10 |
| keyword | string | 否 | 搜索关键词 | 工程师 |
| status | integer | 否 | 状态：0-禁用，1-启用 | 1 |

#### 响应数据

```json
{
  "code": 0,
  "data": {
    "items": [
      {
        "id": 1,
        "code": "senior-engineer",
        "name": "高级工程师",
        "level": 3,
        "levelName": "P7",
        "sort": 1,
        "status": 1,
        "statusName": "启用",
        "userCount": 10,
        "createTime": "2024-01-01T10:00:00Z"
      }
    ],
    "total": 20
  },
  "error": null,
  "message": "ok"
}
```

---

### 8. 创建岗位

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 创建岗位 |
| 请求方法 | POST |
| 接口路径 | `/api/v1/orgs/posts` |
| 权限要求 | org:create |

#### 请求参数

**Body参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| code | string | 是 | 岗位编码，唯一 | architect |
| name | string | 是 | 岗位名称 | 架构师 |
| level | integer | 否 | 岗位等级 | 5 |
| levelName | string | 否 | 等级名称 | P9 |
| sort | integer | 否 | 排序号 | 1 |
| status | integer | 否 | 状态：0-禁用，1-启用 | 1 |

#### 请求示例

```http
POST /api/v1/orgs/posts
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "code": "architect",
  "name": "架构师",
  "level": 5,
  "levelName": "P9",
  "sort": 1,
  "status": 1
}
```

---

### 9. 更新岗位

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 更新岗位 |
| 请求方法 | PUT |
| 接口路径 | `/api/v1/orgs/posts/{id}` |
| 权限要求 | org:update |

#### 请求参数

**Path参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| id | integer | 是 | 岗位ID | 1 |

**Body参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| name | string | 否 | 岗位名称 |
| level | integer | 否 | 岗位等级 |
| levelName | string | 否 | 等级名称 |
| sort | integer | 否 | 排序号 |
| status | integer | 否 | 状态 |

---

### 10. 删除岗位

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 删除岗位 |
| 请求方法 | DELETE |
| 接口路径 | `/api/v1/orgs/posts/{id}` |
| 权限要求 | org:delete |

#### 响应数据

**错误响应** (409 Conflict):

```json
{
  "code": 409,
  "message": "该岗位有关联用户，无法删除",
  "data": {
    "userCount": 5
  },
  "timestamp": 1709827200000
}
```

---

## 三、数据模型

### 3.1 部门对象 (Department)

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| id | integer | 是 | 部门ID |
| code | string | 是 | 部门编码，唯一，2-50字符 |
| name | string | 是 | 部门名称，2-50字符 |
| parentId | integer | 是 | 父部门ID，0表示顶级 |
| path | string | 是 | 部门路径，如 /1/2/3/ |
| level | integer | 是 | 部门层级 |
| sort | integer | 否 | 排序号 |
| leader | string | 否 | 负责人姓名 |
| phone | string | 否 | 联系电话 |
| email | string | 否 | 邮箱 |
| status | integer | 是 | 状态：0-禁用，1-启用 |
| userCount | integer | 否 | 部门用户数 |
| createTime | datetime | 是 | 创建时间 |
| updateTime | datetime | 是 | 更新时间 |

### 3.2 岗位对象 (Post)

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| id | integer | 是 | 岗位ID |
| code | string | 是 | 岗位编码，唯一 |
| name | string | 是 | 岗位名称 |
| level | integer | 否 | 岗位等级 |
| levelName | string | 否 | 等级名称 |
| sort | integer | 否 | 排序号 |
| status | integer | 是 | 状态：0-禁用，1-启用 |
| userCount | integer | 否 | 岗位用户数 |
| createTime | datetime | 是 | 创建时间 |
| updateTime | datetime | 是 | 更新时间 |

---

## 四、组织架构规则

### 4.1 部门层级限制

- 最大层级：5级
- 顶级部门：parentId = 0
- 部门路径：自动计算，格式如 `/1/2/3/`

### 4.2 部门编码规则

- 格式：小写字母、数字、连字符
- 唯一性：全系统唯一
- 示例：`company`, `tech`, `backend`, `frontend`

### 4.3 岗位等级

| 等级 | 名称 | 说明 |
|-----|------|------|
| 1 | P5 | 初级工程师 |
| 2 | P6 | 中级工程师 |
| 3 | P7 | 高级工程师 |
| 4 | P8 | 资深工程师 |
| 5 | P9 | 架构师 |

---

## 五、错误码

| 错误码 | 错误信息 | 说明 |
|-------|---------|------|
| 400 | 请求参数错误 | 参数校验失败 |
| 401 | 未认证 | Token无效或过期 |
| 403 | 无权限 | 用户无此操作权限 |
| 404 | 部门/岗位不存在 | 指定的ID不存在 |
| 409 | 数据冲突 | 编码已存在或有依赖关系 |
| 422 | 层级超限 | 部门层级超过最大限制 |
| 500 | 服务器内部错误 | 系统异常 |

---

## 六、相关文档

- [API接口清单](./01-api-interface-list.md)
- [用户管理模块接口规范](./02-user-api-specification.md)
- [角色权限模块接口规范](./03-role-api-specification.md)
- [RESTful API设计规范](../01-rest-api-standard/01-restful-api-standard.md)

---

## 七、评审记录

### 7.1 评审意见

| 序号 | 评审项 | 评审结果 | 评审意见 |
|-----|--------|---------|---------|
| 1 | 接口完整性 | ✓ 通过 | 覆盖部门和岗位管理所有功能 |
| 2 | 接口规范性 | ✓ 通过 | 符合RESTful API设计规范 |
| 3 | 树形结构 | ✓ 通过 | 部门树设计合理，支持5级层级 |
| 4 | 岗位等级 | ✓ 通过 | 岗位等级体系（P5-P9）设计清晰 |
| 5 | 数据模型 | ✓ 通过 | 模型设计完整，路径计算逻辑清晰 |

### 7.2 评审结论

**评审结论**: 通过

**评审意见**: 组织架构模块接口规范完整，树形结构设计合理，岗位等级体系清晰，可作为开发依据。

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
| 1.0 | 2026-03-09 | 系统架构师 | 初始版本，定义组织架构模块10个接口 |
| 1.1 | 2026-03-11 | 系统架构师 | 统一响应格式，与Mock服务保持一致 |
