# 系统管理模块接口规范

> **文档编号**: SYS-INT-API-SYS-001  
> **模块**: 系统管理 (SYS)  
> **基础路径**: `/api/v1/sys`  
> **版本**: v1  
> **日期**: 2026-03-09  
> **作者**: 系统架构师  
> **状态**: ✅ 已评审

---

## 一、模块概述

### 1.1 功能说明

系统管理模块提供系统级功能，包括用户认证、字典管理、参数配置、文件管理、日志查询等基础服务。

### 1.2 接口列表

| 序号 | 接口名称 | 方法 | 路径 | 权限要求 |
|-----|---------|------|------|---------|
| 1 | 用户登录 | POST | `/auth/login` | 公开 |
| 2 | 用户登出 | POST | `/auth/logout` | 需要认证 |
| 3 | 刷新Token | POST | `/auth/refresh` | 需要认证 |
| 4 | 查询字典列表 | GET | `/dicts` | dict:read |
| 5 | 查询字典项 | GET | `/dicts/{code}/items` | dict:read |
| 6 | 文件上传 | POST | `/files/upload` | file:upload |
| 7 | 查询登录日志 | GET | `/logs/login` | log:read |

---

## 二、接口详细定义

### 1. 用户登录

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 用户登录 |
| 请求方法 | POST |
| 接口路径 | `/api/v1/sys/auth/login` |
| 权限要求 | 公开（无需认证） |

#### 请求参数

**Body参数** (application/json):

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| username | string | 是 | 用户名 | zhangsan |
| password | string | 是 | 密码 | ****** |
| captcha | string | 条件 | 验证码（启用时必填） | abc123 |
| captchaKey | string | 条件 | 验证码标识 | uuid-key |

#### 请求示例

```http
POST /api/v1/sys/auth/login
Content-Type: application/json

{
  "username": "zhangsan",
  "password": "123456",
  "captcha": "abc123",
  "captchaKey": "captcha-uuid-123"
}
```

#### 响应数据

**成功响应**:

```json
{
  "code": 0,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200,
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "username": "zhangsan",
      "nickname": "张三",
      "avatar": "https://cdn.example.com/avatar/1.jpg",
      "roles": ["admin", "user"],
      "permissions": ["user:create", "user:update"]
    }
  },
  "error": null,
  "message": "ok"
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|-----|------|------|
| accessToken | string | 访问令牌，有效期2小时 |
| refreshToken | string | 刷新令牌，有效期7天 |
| expiresIn | integer | 访问令牌有效期（秒） |
| tokenType | string | 令牌类型，固定Bearer |
| user | object | 用户信息 |
| user.roles | array | 用户角色列表 |
| user.permissions | array | 用户权限列表 |

**错误响应**:

```json
{
  "code": -1,
  "data": null,
  "error": "用户名或密码错误",
  "message": "用户名或密码错误"
}
```

---

### 2. 用户登出

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 用户登出 |
| 请求方法 | POST |
| 接口路径 | `/api/v1/sys/auth/logout` |
| 权限要求 | 需要认证 |

#### 请求头

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### 响应数据

```json
{
  "code": 0,
  "data": null,
  "error": null,
  "message": "ok"
}
```

---

### 3. 刷新Token

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 刷新Token |
| 请求方法 | POST |
| 接口路径 | `/api/v1/sys/auth/refresh` |
| 权限要求 | 需要认证 |

#### 请求参数

**Body参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| refreshToken | string | 是 | 刷新令牌 | eyJhbGciOiJIUzI1NiIs... |

#### 响应数据

```json
{
  "code": 0,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200
  },
  "error": null,
  "message": "ok"
}
```

---

### 4. 查询字典列表

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 查询字典列表 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/sys/dicts` |
| 权限要求 | dict:read |

#### 请求参数

**Query参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| page | integer | 否 | 当前页码，默认1 | 1 |
| size | integer | 否 | 每页大小，默认10 | 10 |
| keyword | string | 否 | 搜索关键词 | user_status |
| status | integer | 否 | 状态：0-禁用，1-启用 | 1 |

#### 响应数据

```json
{
  "code": 0,
  "data": {
    "items": [
      {
        "id": 1,
        "code": "user_status",
        "name": "用户状态",
        "description": "用户账号状态字典",
        "status": 1,
        "statusName": "启用",
        "itemCount": 2,
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

### 5. 查询字典项

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 查询字典项 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/sys/dicts/{code}/items` |
| 权限要求 | dict:read |

#### 请求参数

**Path参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| code | string | 是 | 字典编码 | user_status |

#### 响应数据

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "dictCode": "user_status",
      "itemCode": "0",
      "itemName": "禁用",
      "sort": 1,
      "status": 1,
      "remark": "账号已禁用"
    },
    {
      "id": 2,
      "dictCode": "user_status",
      "itemCode": "1",
      "itemName": "启用",
      "sort": 2,
      "status": 1,
      "remark": "账号正常使用"
    }
  ],
  "error": null,
  "message": "ok"
}
```

**使用场景**: 前端下拉框、状态显示等需要枚举值的地方。

---

### 6. 文件上传

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 文件上传 |
| 请求方法 | POST |
| 接口路径 | `/api/v1/sys/files/upload` |
| 权限要求 | file:upload |

#### 请求参数

**Body参数** (multipart/form-data):

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| file | File | 是 | 文件 | - |
| type | string | 否 | 文件类型：image/doc/other | image |
| module | string | 否 | 业务模块：user/avatar/attachment | avatar |

#### 请求示例

```http
POST /api/v1/sys/files/upload
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="avatar.jpg"
Content-Type: image/jpeg

[文件内容]
------WebKitFormBoundary
Content-Disposition: form-data; name="type"

image
------WebKitFormBoundary
Content-Disposition: form-data; name="module"

avatar
------WebKitFormBoundary--
```

#### 响应数据

```json
{
  "code": 0,
  "data": {
    "fileId": "f-123456789",
    "fileName": "avatar.jpg",
    "originalName": "my-avatar.jpg",
    "fileUrl": "https://cdn.example.com/files/2024/03/09/avatar-123456.jpg",
    "fileSize": 102400,
    "fileType": "image/jpeg",
    "uploadTime": "2024-03-09T10:00:00Z"
  },
  "error": null,
  "message": "ok"
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|-----|------|------|
| fileId | string | 文件唯一标识 |
| fileName | string | 存储文件名 |
| originalName | string | 原始文件名 |
| fileUrl | string | 文件访问URL |
| fileSize | integer | 文件大小（字节） |
| fileType | string | 文件MIME类型 |

---

### 7. 查询登录日志

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 查询登录日志 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/sys/logs/login` |
| 权限要求 | log:read |

#### 请求参数

**Query参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| page | integer | 否 | 当前页码，默认1 | 1 |
| size | integer | 否 | 每页大小，默认10 | 10 |
| username | string | 否 | 用户名 | zhangsan |
| status | integer | 否 | 登录状态：0-失败，1-成功 | 1 |
| startTime | string | 否 | 开始时间 | 2024-03-01T00:00:00Z |
| endTime | string | 否 | 结束时间 | 2024-03-09T23:59:59Z |

#### 响应数据

```json
{
  "code": 0,
  "data": {
    "items": [
      {
        "id": 1,
        "username": "zhangsan",
        "ip": "192.168.1.100",
        "location": "北京市",
        "browser": "Chrome 120.0",
        "os": "Windows 10",
        "status": 1,
        "statusName": "成功",
        "message": "登录成功",
        "loginTime": "2024-03-09T10:00:00Z"
      },
      {
        "id": 2,
        "username": "zhangsan",
        "ip": "192.168.1.100",
        "location": "北京市",
        "browser": "Chrome 120.0",
        "os": "Windows 10",
        "status": 0,
        "statusName": "失败",
        "message": "密码错误",
        "loginTime": "2024-03-09T09:55:00Z"
      }
    ],
    "total": 100
  },
  "error": null,
  "message": "ok"
}
```

---

## 三、租户服务接口

**模块代码**: TENANT  
**基础路径**: `/api/v1/tenant-service`  
**服务归属**: 租户服务（独立微服务）

> **说明**: 租户服务为独立微服务，前端直接调用。登录页面和配置模块都通过调用租户服务接口实现租户信息管理。

### 8. 获取租户基础信息

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 获取租户基础信息 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/tenant-service/base` |
| 权限要求 | tenant:read |

#### 响应数据

```json
{
  "code": 0,
  "data": {
    "id": 106,
    "tenantCode": "ZHBM-106",
    "name": "凌越科技",
    "tel": "400-888-8888",
    "phone": "13800138002",
    "fax": "400-888-8889",
    "address": "北京市海淀区中关村软件园",
    "enable": 0,
    "timeExpiration": "2029-12-31 23:59:59",
    "isDeleted": 0,
    "description": "专注于企业级软件开发与技术服务。",
    "createdBy": "admin",
    "createdTime": "2025-03-02T10:00:00Z",
    "updatedBy": "admin",
    "updatedTime": "2025-03-02T10:00:00Z"
  },
  "error": null,
  "message": "ok"
}
```

---

### 9. 更新租户基础信息

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 更新租户基础信息 |
| 请求方法 | PUT |
| 接口路径 | `/api/v1/tenant-service/base` |
| 权限要求 | tenant:update |

#### 请求参数

**Body参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| name | string | 是 | 租户名称 |
| tel | string | 否 | 固定电话 |
| phone | string | 否 | 手机号码 |
| fax | string | 否 | 传真 |
| address | string | 否 | 地址 |
| description | string | 否 | 描述 |

#### 请求示例

```http
PUT /api/v1/tenant-service/base
Content-Type: application/json

{
  "name": "凌越科技有限公司",
  "tel": "400-888-8888",
  "phone": "13800138002",
  "fax": "400-888-8889",
  "address": "北京市海淀区中关村软件园",
  "description": "专注于企业级软件开发与技术服务。"
}
```

#### 响应数据

```json
{
  "code": 0,
  "data": null,
  "error": null,
  "message": "ok"
}
```

---

### 10. 获取Web扩展配置

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 获取Web扩展配置 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/tenant-service/web-ext` |
| 权限要求 | tenant:read |

#### 响应数据

```json
{
  "code": 0,
  "data": {
    "id": 204,
    "title": "凌越科技",
    "slogan": "科技创新，引领未来",
    "logo": "http://ygde.oss-cn-zhangjiakou.aliyuncs.com/l/linsir.png",
    "inset": "",
    "loginBackground": "https://via.placeholder.com/1920x1080/722ed1/ffffff?text=登录背景",
    "domainName": "localhost",
    "enableGuidePage": 0,
    "guidePageBackground": "https://via.placeholder.com/1920x1080/722ed1/ffffff?text=引导页"
  },
  "error": null,
  "message": "ok"
}
```

---

### 11. 更新Web扩展配置

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 更新Web扩展配置 |
| 请求方法 | PUT |
| 接口路径 | `/api/v1/tenant-config/web-ext` |
| 权限要求 | tenant:update |

#### 请求参数

**Body参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| title | string | 否 | 系统标题 |
| slogan | string | 否 | 系统标语 |
| logo | string | 否 | 系统Logo URL |
| inset | string | 否 | 插画 URL |
| loginBackground | string | 否 | 登录背景 URL |
| domainName | string | 否 | 绑定域名 |
| enableGuidePage | number | 否 | 启用引导页：0-否，1-是 |
| guidePageBackground | string | 否 | 引导页背景 URL |

#### 请求示例

```http
PUT /api/v1/tenant-service/web-ext
Content-Type: application/json

{
  "title": "凌越科技",
  "slogan": "科技创新，引领未来",
  "logo": "http://ygde.oss-cn-zhangjiakou.aliyuncs.com/l/linsir.png",
  "loginBackground": "https://via.placeholder.com/1920x1080/722ed1/ffffff?text=登录背景",
  "domainName": "localhost",
  "enableGuidePage": 0
}
```

#### 响应数据

```json
{
  "code": 0,
  "data": null,
  "error": null,
  "message": "ok"
}
```

---

### 12. 获取商务扩展配置

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 获取商务扩展配置 |
| 请求方法 | GET |
| 接口路径 | `/api/v1/tenant-service/business-ext` |
| 权限要求 | tenant:read |

#### 响应数据

```json
{
  "code": 0,
  "data": {
    "id": 301,
    "firmName": "宜昌公交集团有限责任公司",
    "creditCode": "9142050017916088XJ",
    "legalPerson": "王杰",
    "administrativeDivision": "湖北省宜昌市",
    "businessArea": "公共交通服务",
    "businessHead": "张经理",
    "openBankAccount": "4220012345678901234",
    "bankAccountPerson": "宜昌公交集团有限责任公司",
    "openBank": "中国工商银行宜昌分行"
  },
  "error": null,
  "message": "ok"
}
```

---

### 13. 更新商务扩展配置

#### 基本信息

| 项目 | 内容 |
|-----|------|
| 接口名称 | 更新商务扩展配置 |
| 请求方法 | PUT |
| 接口路径 | `/api/v1/tenant-config/business-ext` |
| 权限要求 | tenant:update |

#### 请求参数

**Body参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| firmName | string | 否 | 企业名称 |
| creditCode | string | 否 | 统一社会信用代码 |
| legalPerson | string | 否 | 法人代表 |
| administrativeDivision | string | 否 | 行政区划 |
| businessArea | string | 否 | 经营范围 |
| businessHead | string | 否 | 业务负责人 |
| openBankAccount | string | 否 | 开户银行账号 |
| bankAccountPerson | string | 否 | 账户持有人 |
| openBank | string | 否 | 开户银行 |

#### 请求示例

```http
PUT /api/v1/tenant-service/business-ext
Content-Type: application/json

{
  "firmName": "宜昌公交集团有限责任公司",
  "creditCode": "9142050017916088XJ",
  "legalPerson": "王杰",
  "administrativeDivision": "湖北省宜昌市",
  "businessArea": "公共交通服务",
  "businessHead": "张经理",
  "openBankAccount": "4220012345678901234",
  "bankAccountPerson": "宜昌公交集团有限责任公司",
  "openBank": "中国工商银行宜昌分行"
}
```

#### 响应数据

```json
{
  "code": 0,
  "data": null,
  "error": null,
  "message": "ok"
}
```

---

## 四、数据模型

### 4.1 字典对象 (Dict)

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| id | integer | 是 | 字典ID |
| code | string | 是 | 字典编码，唯一 |
| name | string | 是 | 字典名称 |
| description | string | 否 | 字典描述 |
| status | integer | 是 | 状态：0-禁用，1-启用 |
| createTime | datetime | 是 | 创建时间 |

### 4.2 字典项对象 (DictItem)

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| id | integer | 是 | 字典项ID |
| dictCode | string | 是 | 所属字典编码 |
| itemCode | string | 是 | 字典项编码 |
| itemName | string | 是 | 字典项名称 |
| sort | integer | 否 | 排序号 |
| status | integer | 是 | 状态 |
| remark | string | 否 | 备注 |

### 4.3 文件对象 (File)

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| fileId | string | 是 | 文件唯一标识 |
| fileName | string | 是 | 存储文件名 |
| originalName | string | 是 | 原始文件名 |
| fileUrl | string | 是 | 文件访问URL |
| fileSize | integer | 是 | 文件大小 |
| fileType | string | 是 | 文件类型 |
| module | string | 否 | 业务模块 |
| uploadTime | datetime | 是 | 上传时间 |

### 4.4 登录日志对象 (LoginLog)

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| id | integer | 是 | 日志ID |
| username | string | 是 | 用户名 |
| ip | string | 是 | IP地址 |
| location | string | 否 | 登录地点 |
| browser | string | 否 | 浏览器信息 |
| os | string | 否 | 操作系统 |
| status | integer | 是 | 登录状态 |
| message | string | 否 | 登录消息 |
| loginTime | datetime | 是 | 登录时间 |

---

## 五、错误码

| 错误码 | 错误信息 | 说明 |
|-------|---------|------|
| 400 | 请求参数错误 | 参数校验失败 |
| 401 | 未认证/认证失败 | Token无效、过期或用户名密码错误 |
| 403 | 无权限 | 用户无此操作权限 |
| 404 | 字典/配置不存在 | 指定的编码不存在 |
| 413 | 文件过大 | 上传文件超过大小限制 |
| 415 | 不支持的文件类型 | 文件类型不允许上传 |
| 500 | 服务器内部错误 | 系统异常 |

---

## 六、相关文档

- [API接口清单](./01-api-interface-list.md)
- [用户管理模块接口规范](./02-user-api-specification.md)
- [角色权限模块接口规范](./03-role-api-specification.md)
- [组织架构模块接口规范](./04-org-api-specification.md)
- [RESTful API设计规范](../01-rest-api-standard/01-restful-api-standard.md)

---

## 七、评审记录

### 6.1 评审意见

| 序号 | 评审项 | 评审结果 | 评审意见 |
|-----|--------|---------|---------|
| 1 | 接口完整性 | ✓ 通过 | 覆盖系统管理所有基础功能 |
| 2 | 接口规范性 | ✓ 通过 | 符合RESTful API设计规范 |
| 3 | 认证设计 | ✓ 通过 | JWT认证设计合理，Token刷新机制完善 |
| 4 | 字典设计 | ✓ 通过 | 字典管理设计灵活，便于扩展 |
| 5 | 文件上传 | ✓ 通过 | 文件上传接口设计完整，限制规则明确 |

### 6.2 评审结论

**评审结论**: 通过

**评审意见**: 系统管理模块接口规范完整，认证机制设计合理，基础功能覆盖全面，可作为开发依据。

### 6.3 签字确认

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
| 1.0 | 2026-03-09 | 系统架构师 | 初始版本，定义系统管理模块8个接口 |
| 1.1 | 2026-03-11 | 系统架构师 | 统一响应格式，与Mock服务保持一致 |
| 1.2 | 2026-03-11 | 系统架构师 | 新增租户配置模块，删除参数配置接口，调整配置结构为三部分 |
| 1.3 | 2026-03-11 | 系统架构师 | 租户配置接口归属租户服务，前端直接调用租户服务 |
