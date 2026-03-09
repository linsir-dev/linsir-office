# 接口安全规范

> **文档编号**: SYS-INT-STD-002  
> **版本**: 1.0  
> **日期**: 2026-03-09  
> **作者**: 系统架构师  
> **状态**: ✅ 已评审

---

## 一、概述

### 1.1 文档目的

本文档定义System平台API接口的安全规范，确保接口通信的机密性、完整性和可用性，防止未授权访问和恶意攻击。

### 1.2 适用范围

适用于System平台所有API接口的安全设计和实现。

### 1.3 安全原则

- **最小权限原则**: 只授予必要的访问权限
- **纵深防御原则**: 多层安全机制防护
- **安全默认原则**: 默认启用安全机制
- **失败安全原则**: 出错时进入安全状态

---

## 二、认证机制

### 2.1 JWT认证

System平台采用JWT（JSON Web Token）进行身份认证。

#### 2.1.1 Token结构

```
Authorization: Bearer <access_token>
```

#### 2.1.2 Token组成

JWT由三部分组成，用`.`分隔：

```
header.payload.signature
```

**Header示例**:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload示例**:
```json
{
  "sub": "user_id",
  "username": "zhangsan",
  "roles": ["admin", "user"],
  "iat": 1709827200,
  "exp": 1709913600,
  "jti": "unique_token_id"
}
```

#### 2.1.3 Token有效期

| Token类型 | 有效期 | 说明 |
|----------|--------|------|
| Access Token | 2小时 | 用于接口访问认证 |
| Refresh Token | 7天 | 用于刷新Access Token |

#### 2.1.4 Token刷新机制

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token",
    "expiresIn": 7200
  }
}
```

### 2.2 OAuth2.0集成（可选）

支持第三方OAuth2.0认证：

```http
GET /api/v1/auth/oauth2/authorize?provider=wechat
```

支持的Provider:
- 微信 (wechat)
- 钉钉 (dingtalk)
- 企业微信 (wecom)

---

## 三、请求签名

### 3.1 签名机制

对于敏感接口，采用HMAC-SHA256请求签名。

### 3.2 签名参数

| 参数 | 说明 | 示例 |
|-----|------|------|
| appId | 应用ID | `app_123456` |
| timestamp | 时间戳（毫秒） | `1709827200000` |
| nonce | 随机字符串（16位） | `a1b2c3d4e5f6g7h8` |
| signature | 签名 | `hmac_sha256_signature` |

### 3.3 签名算法

```
Signature = HMAC-SHA256(
    appSecret,
    appId + timestamp + nonce + method + uri + body
)
```

**签名步骤**:
1. 拼接签名字符串: `appId={appId}&timestamp={timestamp}&nonce={nonce}&method={method}&uri={uri}&body={body}`
2. 使用HMAC-SHA256算法和appSecret进行签名
3. 将签名结果转为Base64字符串

### 3.4 请求示例

```http
POST /api/v1/payments
Content-Type: application/json
X-App-Id: app_123456
X-Timestamp: 1709827200000
X-Nonce: a1b2c3d4e5f6g7h8
X-Signature: hmac_sha256_signature

{
  "amount": 100.00,
  "currency": "CNY"
}
```

---

## 四、防重放攻击

### 4.1 时间戳校验

- 请求时间戳与服务器时间差不得超过5分钟
- 超时请求直接拒绝

```java
// 伪代码
if (Math.abs(serverTime - requestTime) > 5 * 60 * 1000) {
    throw new RequestExpiredException();
}
```

### 4.2 Nonce机制

- 每个请求必须携带唯一Nonce
- 服务端缓存已使用的Nonce（5分钟）
- 重复的Nonce直接拒绝

```java
// 伪代码
if (nonceCache.contains(nonce)) {
    throw new DuplicateRequestException();
}
nonceCache.put(nonce, expireTime);
```

### 4.3 请求序列号（可选）

对于关键业务接口，使用递增序列号：

```http
X-Request-Seq: 1001
```

---

## 五、限流策略

### 5.1 限流维度

| 维度 | 限流规则 | 说明 |
|-----|---------|------|
| 全局限流 | 10000 QPS | 整个系统 |
| 接口限流 | 1000 QPS | 单个接口 |
| 用户限流 | 100 QPS | 单个用户 |
| IP限流 | 60 QPS | 单个IP |

### 5.2 限流算法

采用令牌桶算法（Token Bucket）：

```
容量: 100 tokens
速率: 10 tokens/second
```

### 5.3 限流响应

```json
{
  "code": 429,
  "message": "请求过于频繁，请稍后重试",
  "data": {
    "retryAfter": 60
  }
}
```

### 5.4 限流Header

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1709827260
```

---

## 六、数据加密

### 6.1 传输加密

- **强制HTTPS**: 所有API必须使用HTTPS协议
- **TLS版本**: 最低TLS 1.2，推荐TLS 1.3
- **证书配置**: 使用有效SSL证书，定期更新

### 6.2 敏感数据加密

#### 6.2.1 请求加密（可选）

对于极高敏感数据，采用AES-256-GCM加密：

```http
POST /api/v1/sensitive-data
Content-Type: application/json
X-Encryption: AES-256-GCM

{
  "encryptedData": "base64_encoded_encrypted_data",
  "iv": "base64_encoded_iv",
  "tag": "base64_encoded_auth_tag"
}
```

#### 6.2.2 响应加密（可选）

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "encrypted": true,
    "encryptedData": "base64_encoded_encrypted_data",
    "iv": "base64_encoded_iv"
  }
}
```

### 6.3 字段级加密

敏感字段存储加密：

| 字段类型 | 加密算法 | 说明 |
|---------|---------|------|
| 手机号 | AES-256 | 存储加密 |
| 身份证号 | AES-256 | 存储加密 |
| 银行卡号 | AES-256 | 存储加密，展示脱敏 |
| 密码 | BCrypt | 哈希存储 |

---

## 七、安全Header

### 7.1 必须的安全Header

| Header | 值 | 说明 |
|-------|-----|------|
| Strict-Transport-Security | max-age=31536000; includeSubDomains | HSTS |
| X-Content-Type-Options | nosniff | 防止MIME嗅探 |
| X-Frame-Options | DENY | 防止点击劫持 |
| X-XSS-Protection | 1; mode=block | XSS防护 |
| Content-Security-Policy | default-src 'self' | CSP策略 |

### 7.2 CORS配置

```
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization, X-Request-ID
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

---

## 八、输入验证

### 8.1 参数校验规则

| 参数类型 | 校验规则 | 示例 |
|---------|---------|------|
| 字符串 | 长度、格式、特殊字符过滤 | `@Length(max=100)` |
| 数值 | 范围、精度 | `@Range(min=0, max=100)` |
| 枚举 | 值必须在枚举范围内 | `@Enum(UserStatus.class)` |
| 日期 | 格式、范围 | `@DateTimeFormat(iso=ISO.DATE)` |
| 邮箱 | 邮箱格式 | `@Email` |
| 手机号 | 手机号格式 | `@Pattern(regexp="^1[3-9]\\d{9}$")` |

### 8.2 SQL注入防护

- 使用参数化查询，禁止字符串拼接SQL
- 使用ORM框架（MyBatis-Plus）
- 输入过滤特殊字符

### 8.3 XSS防护

- 输入过滤：过滤`<script>`, `javascript:`等
- 输出编码：HTML实体编码
- Content-Type正确设置

---

## 九、日志审计

### 9.1 安全日志内容

| 字段 | 说明 | 示例 |
|-----|------|------|
| timestamp | 时间戳 | `2024-03-09T10:00:00Z` |
| userId | 用户ID | `1001` |
| requestId | 请求ID | `req-123456` |
| clientIp | 客户端IP | `192.168.1.1` |
| method | HTTP方法 | `POST` |
| uri | 请求URI | `/api/v1/users` |
| status | 响应状态 | `200` |
| userAgent | 用户代理 | `Mozilla/5.0...` |

### 9.2 敏感操作日志

以下操作必须记录安全日志：
- 用户登录/登出
- 密码修改
- 权限变更
- 敏感数据访问
- 配置修改

### 9.3 日志存储

- 安全日志独立存储
- 保留期限：180天
- 禁止修改和删除

---

## 十、安全测试

### 10.1 测试类型

| 测试类型 | 工具 | 频率 |
|---------|------|------|
| 漏洞扫描 | OWASP ZAP | 每周 |
| 依赖扫描 | Snyk | 每次构建 |
| 渗透测试 | 手动 | 每季度 |
| 代码审计 | SonarQube | 每次提交 |

### 10.2 安全测试用例

- 认证绕过测试
- 权限提升测试
- SQL注入测试
- XSS攻击测试
- CSRF攻击测试
- 敏感信息泄露测试

---

## 十一、安全响应

### 11.1 安全事件分级

| 级别 | 描述 | 响应时间 |
|-----|------|---------|
| P0 | 严重安全漏洞 | 1小时内 |
| P1 | 高危安全问题 | 4小时内 |
| P2 | 中危安全问题 | 24小时内 |
| P3 | 低危安全问题 | 7天内 |

### 11.2 应急响应流程

1. 发现安全事件
2. 评估影响范围
3. 遏制攻击扩散
4. 修复安全漏洞
5. 验证修复效果
6. 复盘总结改进

---

## 十二、安全最佳实践

### 12.1 开发安全

- 安全编码规范培训
- 代码审查包含安全检查
- 敏感信息不硬编码
- 错误信息不泄露系统信息

### 12.2 部署安全

- 生产环境配置检查
- 敏感配置文件加密
- 最小权限运行
- 安全组/防火墙配置

### 12.3 运维安全

- 定期安全扫描
- 日志监控告警
- 备份加密存储
- 灾备演练

---

## 十三、相关文档

- [RESTful API设计规范](./01-restful-api-standard.md)
- [接口版本管理规范](./03-interface-version-standard.md)
- [安全架构设计](../../03-architecture-design/04-security-architecture/)

---

## 十四、评审记录

### 14.1 评审意见

| 序号 | 评审项 | 评审结果 | 评审意见 |
|-----|--------|---------|---------|
| 1 | JWT认证机制 | ✓ 通过 | 认证方案合理，Token设计完善 |
| 2 | 请求签名机制 | ✓ 通过 | HMAC-SHA256算法安全可靠 |
| 3 | 防重放攻击 | ✓ 通过 | 时间戳+Nonce机制有效 |
| 4 | 限流策略 | ✓ 通过 | 多维度限流设计合理 |
| 5 | 数据加密 | ✓ 通过 | 传输加密和字段加密完整 |

### 14.2 评审结论

**评审结论**: 通过

**评审意见**: 本文档建立了完善的接口安全规范，涵盖认证、签名、防重放、限流、加密等多个方面，安全措施全面，符合企业级应用安全要求。

### 14.3 签字确认

| 角色 | 姓名 | 签字 | 日期 | 意见 |
|-----|------|------|------|------|
| 技术总监 | 张总 | _______________ | 2026-03-09 | 同意 |
| 系统架构师 | 李工 | _______________ | 2026-03-09 | 同意 |
| 安全工程师 | 刘工 | _______________ | 2026-03-09 | 同意 |
| 后端架构师 | 王工 | _______________ | 2026-03-09 | 同意 |

---

## 十五、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-09 | 系统架构师 | 初始版本，建立接口安全规范 |
