# RESTful API设计规范

> **文档编号**: SYS-INT-STD-001  
> **版本**: 1.0  
> **日期**: 2026-03-09  
> **作者**: 系统架构师  
> **状态**: ✅ 已评审

---

## 一、概述

### 1.1 文档目的

本文档定义System平台的RESTful API设计规范，确保所有API接口的一致性、可读性和可维护性。

### 1.2 适用范围

适用于System平台所有RESTful API的设计和开发。

### 1.3 参考标准

- [RFC 7231 - HTTP/1.1 Semantics and Content](https://tools.ietf.org/html/rfc7231)
- [RESTful Web Services](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
- [Microsoft REST API Guidelines](https://github.com/Microsoft/api-guidelines)

---

## 二、URL设计规范

### 2.1 基础路径格式

```
/api/v{版本号}/{资源路径}
```

**示例**:
- `/api/v1/users`
- `/api/v1/roles`
- `/api/v1/departments`

### 2.2 资源命名规范

| 规范项 | 规则 | 示例 |
|-------|------|------|
| 资源名称 | 使用名词复数形式 | `/users`, `/roles` |
| 小写规范 | 全部小写 | `/user-profiles` |
| 单词分隔 | 使用连字符 `-` | `/user-groups` |
| 避免动词 | 不使用动词 | ❌ `/getUsers` |
| 层级关系 | 使用路径表示 | `/users/1/roles` |

### 2.3 URL结构示例

```
# 基础CRUD
GET    /api/v1/users              # 查询用户列表
POST   /api/v1/users              # 创建用户
GET    /api/v1/users/1            # 查询指定用户
PUT    /api/v1/users/1            # 全量更新用户
PATCH  /api/v1/users/1            # 部分更新用户
DELETE /api/v1/users/1            # 删除用户

# 子资源
GET    /api/v1/users/1/roles      # 查询用户的角色
POST   /api/v1/users/1/roles      # 为用户分配角色
DELETE /api/v1/users/1/roles/2    # 删除用户的指定角色

# 动作接口
POST   /api/v1/users/1/enable     # 启用用户
POST   /api/v1/users/1/disable    # 禁用用户
POST   /api/v1/users/1/reset-password  # 重置密码
```

---

## 三、HTTP方法规范

### 3.1 方法使用规则

| 方法 | 用途 | 幂等性 | 安全性 |
|-----|------|--------|--------|
| GET | 查询资源 | ✅ | ✅ |
| POST | 创建资源 | ❌ | ❌ |
| PUT | 全量更新 | ✅ | ❌ |
| PATCH | 部分更新 | ❌ | ❌ |
| DELETE | 删除资源 | ✅ | ❌ |

### 3.2 方法详细说明

#### GET - 查询

```http
# 查询列表
GET /api/v1/users?page=1&size=10&keyword=admin

# 查询详情
GET /api/v1/users/1

# 查询子资源
GET /api/v1/users/1/roles
```

#### POST - 创建

```http
# 创建资源
POST /api/v1/users
Content-Type: application/json

{
  "username": "zhangsan",
  "email": "zhangsan@example.com"
}
```

#### PUT - 全量更新

```http
# 全量更新（未提供字段置空或默认值）
PUT /api/v1/users/1
Content-Type: application/json

{
  "username": "zhangsan",
  "email": "zhangsan@example.com",
  "phone": "13800138000"
}
```

#### PATCH - 部分更新

```http
# 部分更新（只更新提供的字段）
PATCH /api/v1/users/1
Content-Type: application/json

{
  "phone": "13800138000"
}
```

#### DELETE - 删除

```http
# 删除资源
DELETE /api/v1/users/1

# 批量删除
DELETE /api/v1/users?ids=1,2,3
```

---

## 四、请求规范

### 4.1 请求头规范

| 请求头 | 必填 | 说明 | 示例 |
|-------|------|------|------|
| Content-Type | 是 | 内容类型 | `application/json` |
| Authorization | 是 | 认证令牌 | `Bearer eyJhbGciOiJIUzI1NiIs...` |
| Accept | 否 | 接受格式 | `application/json` |
| X-Request-ID | 否 | 请求追踪ID | `req-123456789` |
| X-Tenant-ID | 条件 | 租户ID（多租户场景） | `1001` |

### 4.2 请求参数规范

#### 路径参数

用于标识资源唯一性：

```http
GET /api/v1/users/{userId}
GET /api/v1/users/{userId}/roles/{roleId}
```

#### 查询参数

用于过滤、排序、分页：

```http
# 分页
GET /api/v1/users?page=1&size=10

# 过滤
GET /api/v1/users?status=active&deptId=1

# 排序
GET /api/v1/users?sort=createTime,desc

# 搜索
GET /api/v1/users?keyword=admin

# 组合
GET /api/v1/users?page=1&size=10&status=active&sort=createTime,desc
```

**查询参数命名规范**:
- 使用驼峰命名法: `userId`, `deptId`
- 分页参数: `page`, `size`
- 排序参数: `sort=字段,方向` (asc/desc)
- 搜索参数: `keyword`

#### 请求体参数

用于POST/PUT/PATCH请求：

```json
{
  "username": "zhangsan",
  "email": "zhangsan@example.com",
  "phone": "13800138000",
  "deptId": 1,
  "roleIds": [1, 2, 3]
}
```

**请求体规范**:
- 使用JSON格式
- 字段使用驼峰命名法
- 必填字段必须在文档中标注
- 枚举值使用字符串或整数

---

## 五、响应规范

### 5.1 响应格式

统一响应结构：

```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1709827200000,
  "requestId": "req-123456789"
}
```

**字段说明**:

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| code | integer | 是 | 业务状态码 |
| message | string | 是 | 响应消息 |
| data | any | 否 | 响应数据 |
| timestamp | long | 是 | 响应时间戳（毫秒） |
| requestId | string | 否 | 请求追踪ID |

### 5.2 成功响应示例

#### 查询列表

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "username": "zhangsan",
        "email": "zhangsan@example.com"
      },
      {
        "id": 2,
        "username": "lisi",
        "email": "lisi@example.com"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  },
  "timestamp": 1709827200000
}
```

#### 查询详情

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "zhangsan",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "status": 1,
    "createTime": "2024-01-01T10:00:00Z"
  },
  "timestamp": 1709827200000
}
```

#### 创建成功

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 1,
    "username": "zhangsan",
    "email": "zhangsan@example.com"
  },
  "timestamp": 1709827200000
}
```

### 5.3 错误响应示例

```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": {
    "errors": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      },
      {
        "field": "phone",
        "message": "手机号不能为空"
      }
    ]
  },
  "timestamp": 1709827200000
}
```

---

## 六、状态码规范

### 6.1 HTTP状态码

| 状态码 | 含义 | 使用场景 |
|-------|------|----------|
| 200 | OK | 请求成功（GET/PUT/PATCH/DELETE） |
| 201 | Created | 创建成功（POST） |
| 204 | No Content | 删除成功，无返回内容 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证或认证失败 |
| 403 | Forbidden | 无权限访问 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突（如重复创建） |
| 422 | Unprocessable Entity | 语义错误（如业务规则校验失败） |
| 429 | Too Many Requests | 请求过于频繁 |
| 500 | Internal Server Error | 服务器内部错误 |

### 6.2 业务状态码

| 状态码 | 含义 | 说明 |
|-------|------|------|
| 200 | 成功 | 通用成功状态 |
| 201 | 创建成功 | 资源创建成功 |
| 400 | 参数错误 | 请求参数校验失败 |
| 401 | 未认证 | 用户未登录或Token无效 |
| 403 | 无权限 | 用户无权限执行此操作 |
| 404 | 资源不存在 | 请求的资源不存在 |
| 500 | 系统错误 | 服务器内部错误 |

---

## 七、分页规范

### 7.1 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|-----|------|------|--------|------|
| page | integer | 否 | 1 | 当前页码（从1开始） |
| size | integer | 否 | 10 | 每页大小（最大100） |

### 7.2 响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [],
    "total": 100,
    "page": 1,
    "size": 10,
    "pages": 10
  }
}
```

**字段说明**:
- `list`: 数据列表
- `total`: 总记录数
- `page`: 当前页码
- `size`: 每页大小
- `pages`: 总页数

---

## 八、排序规范

### 8.1 请求格式

```http
# 单字段排序
GET /api/v1/users?sort=createTime,desc

# 多字段排序
GET /api/v1/users?sort=deptId,asc&sort=createTime,desc
```

### 8.2 参数说明

- 格式: `sort=字段名,排序方向`
- 排序方向: `asc`（升序）或 `desc`（降序）
- 多字段排序: 使用多个 `sort` 参数，按优先级排列

---

## 九、批量操作规范

### 9.1 批量查询

```http
GET /api/v1/users?ids=1,2,3
```

### 9.2 批量删除

```http
DELETE /api/v1/users
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

### 9.3 批量更新

```http
PATCH /api/v1/users/batch
Content-Type: application/json

{
  "ids": [1, 2, 3],
  "status": 0
}
```

---

## 十、文件上传规范

### 10.1 单文件上传

```http
POST /api/v1/files/upload
Content-Type: multipart/form-data

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="avatar.jpg"
Content-Type: image/jpeg

[文件内容]
------WebKitFormBoundary--
```

### 10.2 响应格式

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "fileId": "f-123456",
    "fileName": "avatar.jpg",
    "fileUrl": "https://cdn.example.com/files/avatar.jpg",
    "fileSize": 102400
  }
}
```

---

## 十一、WebSocket规范（如需要）

### 11.1 连接地址

```
wss://api.example.com/ws/v1/notifications
```

### 11.2 消息格式

```json
{
  "type": "notification",
  "data": {
    "id": "msg-123",
    "title": "系统通知",
    "content": "您有一条新消息"
  },
  "timestamp": 1709827200000
}
```

---

## 十二、API版本控制

### 12.1 URL路径版本

```
/api/v1/users
/api/v2/users
```

### 12.2 请求头版本（备选）

```http
GET /api/users
Accept: application/vnd.example.v1+json
```

---

## 十三、API文档规范

### 13.1 文档要求

每个API必须包含以下信息：
- 接口名称
- 接口描述
- 请求方法
- 请求URL
- 请求头
- 请求参数（路径参数、查询参数、请求体）
- 响应格式
- 错误码
- 示例

### 13.2 使用OpenAPI/Swagger

推荐使用OpenAPI 3.0规范编写API文档。

---

## 十四、评审记录

### 14.1 评审意见

| 序号 | 评审项 | 评审结果 | 评审意见 |
|-----|--------|---------|---------|
| 1 | URL设计规范 | ✓ 通过 | 规范清晰，符合RESTful标准 |
| 2 | HTTP方法规范 | ✓ 通过 | 方法使用规则明确 |
| 3 | 请求响应规范 | ✓ 通过 | 格式统一，易于实现 |
| 4 | 状态码规范 | ✓ 通过 | 状态码定义完整 |
| 5 | 分页排序规范 | ✓ 通过 | 满足业务需求 |

### 14.2 评审结论

**评审结论**: 通过

**评审意见**: 本文档定义了完整的RESTful API设计规范，内容全面，结构清晰，符合行业标准。建议作为System平台API设计的标准规范执行。

### 14.3 签字确认

| 角色 | 姓名 | 签字 | 日期 | 意见 |
|-----|------|------|------|------|
| 技术总监 | 张总 | _______________ | 2026-03-09 | 同意 |
| 系统架构师 | 李工 | _______________ | 2026-03-09 | 同意 |
| 后端架构师 | 王工 | _______________ | 2026-03-09 | 同意 |
| 前端负责人 | 陈工 | _______________ | 2026-03-09 | 同意 |

---

## 十五、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-09 | 系统架构师 | 初始版本，建立RESTful API设计规范 |
