# 认证模块开发文档

> **迭代编号**: sprint-1  
> **模块**: 认证模块  
> **状态**: ✅ 已完成

---

## 开发任务

- [√] 登录页面开发
- [√] 登录API开发
- [√] Token刷新机制
- [√] 登出功能开发

---

## 技术方案

### 架构设计

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   前端 (Vue3)   │────▶│   后端 (Nitro)  │────▶│   Redis缓存     │
│                 │◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       ▼
        │               ┌─────────────────┐
        │               │   JWT Token     │
        │               │   签发/验证     │
        │               └─────────────────┘
        │
        ▼
┌─────────────────┐
│  LocalStorage   │
│  Token存储      │
└─────────────────┘
```

### 认证流程

1. **用户登录**
   - 前端提交用户名/密码
   - 后端验证用户身份
   - 签发Access Token（30分钟有效期）和Refresh Token（7天有效期）
   - Token存储到Redis，设置过期时间

2. **Token刷新**
   - Access Token过期前自动刷新
   - 使用Refresh Token换取新的Access Token
   - 刷新时更新Redis中的Token记录

3. **用户登出**
   - 清除前端LocalStorage中的Token
   - 后端将Token加入黑名单（Redis）
   - 清除用户会话信息

### 安全策略

- **密码加密**: 使用bcrypt算法，salt rounds = 10
- **Token签名**: 使用HS256算法，密钥定期轮换
- **登录失败限制**: 5分钟内连续失败5次锁定账号30分钟
- **Token黑名单**: 登出后的Token加入黑名单，防止重放攻击

---

## 接口定义

### 1. 用户登录

**请求**
```http
POST /v1/sys/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123456",
  "captcha": "a3f8"
}
```

**响应**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 1800,
    "tokenType": "Bearer",
    "userInfo": {
      "id": "1",
      "username": "admin",
      "nickname": "管理员",
      "avatar": "https://...",
      "roles": ["admin"],
      "permissions": ["*"]
    }
  }
}
```

### 2. Token刷新

**请求**
```http
POST /v1/sys/auth/refresh
Authorization: Bearer {refreshToken}
```

**响应**
```json
{
  "code": 200,
  "message": "刷新成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 1800,
    "tokenType": "Bearer"
  }
}
```

### 3. 用户登出

**请求**
```http
POST /v1/sys/auth/logout
Authorization: Bearer {accessToken}
```

**响应**
```json
{
  "code": 200,
  "message": "登出成功",
  "data": null
}
```

### 4. 获取当前用户信息

**请求**
```http
GET /v1/sys/auth/userinfo
Authorization: Bearer {accessToken}
```

**响应**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "1",
    "username": "admin",
    "nickname": "管理员",
    "avatar": "https://...",
    "roles": ["admin"],
    "permissions": ["*"],
    "deptId": "1",
    "deptName": "技术部"
  }
}
```

---

## 测试用例

### 功能测试

| 用例编号 | 用例名称 | 前置条件 | 测试步骤 | 预期结果 | 实际结果 | 状态 |
|---------|---------|---------|---------|---------|---------|------|
| AUTH-001 | 正常登录 | 用户存在且密码正确 | 1. 输入正确用户名密码<br>2. 点击登录 | 登录成功，返回Token | 符合预期 | [√] 通过 |
| AUTH-002 | 密码错误 | 用户存在 | 1. 输入错误密码<br>2. 点击登录 | 提示密码错误 | 符合预期 | [√] 通过 |
| AUTH-003 | 用户不存在 | 用户不存在 | 1. 输入不存在的用户名<br>2. 点击登录 | 提示用户不存在 | 符合预期 | [√] 通过 |
| AUTH-004 | Token刷新 | 已登录且Token未过期 | 1. 调用刷新接口<br>2. 使用新Token访问 | 刷新成功，新Token可用 | 符合预期 | [√] 通过 |
| AUTH-005 | 正常登出 | 已登录 | 1. 点击登出按钮 | 登出成功，清除Token | 符合预期 | [√] 通过 |
| AUTH-006 | Token过期 | Token已过期 | 1. 使用过期Token访问 | 提示Token过期，自动刷新 | 符合预期 | [√] 通过 |

### 安全测试

| 用例编号 | 用例名称 | 测试步骤 | 预期结果 | 实际结果 | 状态 |
|---------|---------|---------|---------|---------|------|
| AUTH-007 | SQL注入测试 | 输入 `' OR '1'='1` | 登录失败，无SQL注入风险 | 符合预期 | [√] 通过 |
| AUTH-008 | XSS测试 | 输入 `<script>alert(1)</script>` | 登录失败，无XSS风险 | 符合预期 | [√] 通过 |
| AUTH-009 | 暴力破解防护 | 连续输入错误密码5次 | 账号锁定30分钟 | 符合预期 | [√] 通过 |
| AUTH-010 | Token伪造测试 | 使用伪造Token访问 | 验证失败，返回401 | 符合预期 | [√] 通过 |

---

## 开发记录

| 日期 | 工作内容 | 完成状态 |
|------|---------|---------|
| 2026-03-27 | 技术方案设计、项目初始化 | [√] 已完成 |
| 2026-03-28 | 登录页面开发、登录API开发 | [√] 已完成 |
| 2026-03-28 | Token刷新机制实现 | [√] 已完成 |
| 2026-03-28 | 登出功能开发 | [√] 已完成 |
| 2026-03-28 | 单元测试编写、代码审查 | [√] 已完成 |
| 2026-03-29 | 集成测试、Bug修复 | [√] 已完成 |

---

## 代码统计

| 指标 | 数值 |
|------|------|
| 前端代码行数 | 1,250 行 |
| 后端代码行数 | 890 行 |
| 测试代码行数 | 420 行 |
| 单元测试覆盖率 | 92% |
| 接口数量 | 4 个 |

---

## 相关文档

- [API接口文档](../../05-api-docs/auth-api.md)
- [前端组件文档](../../06-ui-docs/auth-components.md)
- [数据库设计](../../02-design/02-database/02-database-design/02-physical-data-model.md)

---

**记录人:** 赵六  
**日期:** 2026-03-29
