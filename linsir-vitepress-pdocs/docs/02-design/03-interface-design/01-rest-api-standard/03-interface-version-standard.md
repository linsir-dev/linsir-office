# 接口版本管理规范

> **文档编号**: SYS-INT-STD-003  
> **版本**: 1.0  
> **日期**: 2026-03-09  
> **作者**: 系统架构师  
> **状态**: ✅ 已评审

---

## 一、概述

### 1.1 文档目的

本文档定义System平台API接口的版本管理规范，确保API的平滑演进，同时保持向后兼容性，降低版本升级对客户端的影响。

### 1.2 适用范围

适用于System平台所有API接口的版本管理和控制。

### 1.3 版本管理原则

- **向后兼容**: 新版本尽可能兼容旧版本
- **渐进式升级**: 提供平滑的升级路径
- **文档清晰**: 版本变更必须文档化
- **生命周期管理**: 明确版本的支持周期

---

## 二、版本号规范

### 2.1 语义化版本号

采用语义化版本控制（Semantic Versioning）：

```
主版本号.次版本号.修订号
MAJOR.MINOR.PATCH
```

**示例**: `v1.2.3`

### 2.2 版本号变更规则

| 版本号 | 变更时机 | 兼容性 | 示例 |
|-------|---------|--------|------|
| MAJOR | 重大变更、不兼容修改 | 不兼容 | 1.x.x → 2.0.0 |
| MINOR | 新增功能、向后兼容 | 兼容 | 1.1.x → 1.2.0 |
| PATCH | Bug修复、向后兼容 | 兼容 | 1.1.1 → 1.1.2 |

### 2.3 API版本与系统版本

| 版本类型 | 格式 | 说明 | 示例 |
|---------|------|------|------|
| API版本 | v{MAJOR} | URL路径中的版本 | v1, v2 |
| 系统版本 | {MAJOR}.{MINOR}.{PATCH} | 完整系统版本 | 1.2.3 |

---

## 三、版本控制策略

### 3.1 URL路径版本（推荐）

在URL路径中指定API版本：

```
/api/v1/users
/api/v2/users
```

**优点**:
- 版本清晰可见
- 易于缓存
- 支持多版本并行

**缺点**:
- URL变更
- 需要维护多个版本代码

### 3.2 请求头版本（备选）

通过请求头指定版本：

```http
GET /api/users
Accept: application/vnd.system.v1+json
```

或自定义Header：

```http
GET /api/users
X-API-Version: v1
```

**优点**:
- URL保持不变
- 更RESTful

**缺点**:
- 版本不够直观
- 缓存配置复杂

### 3.3 查询参数版本（不推荐）

```
/api/users?version=v1
```

**缺点**:
- 不符合RESTful规范
- 容易被忽略

---

## 四、版本演进策略

### 4.1 向后兼容变更

以下变更为向后兼容，只需更新MINOR版本：

| 变更类型 | 说明 | 示例 |
|---------|------|------|
| 新增接口 | 添加新的API端点 | POST /api/v1/users/batch |
| 新增字段 | 响应中添加新字段 | 新增 `phone` 字段 |
| 新增参数 | 请求中添加可选参数 | 新增 `keyword` 查询参数 |
| 放宽限制 | 放宽参数校验规则 | 用户名长度从6-20改为3-30 |

### 4.2 不兼容变更

以下变更为不兼容，需要更新MAJOR版本：

| 变更类型 | 说明 | 示例 |
|---------|------|------|
| 删除接口 | 移除API端点 | 删除 POST /api/v1/users/old |
| 删除字段 | 移除响应字段 | 删除 `age` 字段 |
| 修改URL | 变更资源路径 | /api/v1/users → /api/v1/user |
| 修改字段名 | 重命名字段 | `userName` → `username` |
| 修改数据类型 | 变更字段类型 | `status` 从 int 改为 string |
| 加强限制 | 加强参数校验 | 密码复杂度要求提高 |
| 修改业务逻辑 | 核心业务逻辑变更 | 用户状态流转规则变更 |

### 4.3 废弃（Deprecation）流程

#### 4.3.1 废弃通知

1. **提前通知**: 至少提前3个月通知客户端
2. **文档标注**: 在API文档中标注废弃状态
3. **响应标记**: 在响应Header中添加废弃警告

```http
Deprecation: true
Sunset: Sat, 31 Dec 2024 23:59:59 GMT
```

#### 4.3.2 废弃周期

| 阶段 | 时长 | 状态 | 说明 |
|-----|------|------|------|
| 活跃 | - | Active | 正常维护，新功能添加 |
| 维护 | 6个月 | Maintenance | 只修复Bug，不添加新功能 |
| 废弃 | 3个月 | Deprecated | 通知客户端迁移 |
| 下线 | - | End of Life | 完全停止服务 |

---

## 五、版本兼容性

### 5.1 兼容性矩阵

| 客户端版本 | v1 API | v2 API | v3 API |
|-----------|--------|--------|--------|
| Client v1 | ✅ 支持 | ❌ 不支持 | ❌ 不支持 |
| Client v2 | ✅ 支持 | ✅ 支持 | ❌ 不支持 |
| Client v3 | ❌ 不支持 | ✅ 支持 | ✅ 支持 |

### 5.2 多版本支持策略

同时支持多个API版本：

```
当前版本: v2 (推荐)
维护版本: v1 (维护模式，6个月后下线)
开发版本: v3 (预览版，不稳定)
```

### 5.3 版本协商

当客户端未指定版本时，返回默认版本：

```http
GET /api/users
# 未指定版本，返回最新稳定版 v2

GET /api/v1/users
# 明确指定 v1 版本
```

---

## 六、版本文档

### 6.1 版本变更日志

每个版本必须包含变更日志：

```markdown
## v2.1.0 (2024-03-01)

### 新增
- 添加用户批量导入接口
- 支持用户标签功能

### 变更
- 优化用户查询性能

### 修复
- 修复分页参数越界问题

### 废弃
- 废弃 `POST /api/v2/users/batch-delete`，使用 `DELETE /api/v2/users/batch` 替代
```

### 6.2 版本迁移指南

提供详细的版本迁移文档：

```markdown
# v1 到 v2 迁移指南

## 破坏性变更

### 1. 用户状态字段变更
- v1: `status` (int) - 0:禁用, 1:启用
- v2: `status` (string) - "disabled", "enabled", "locked"

### 2. 分页参数变更
- v1: `pageNum`, `pageSize`
- v2: `page`, `size`

## 迁移步骤

1. 更新API调用URL
2. 修改字段映射
3. 测试验证
```

### 6.3 API文档版本化

Swagger/OpenAPI文档按版本管理：

```
/api-docs/v1/swagger.json
/api-docs/v2/swagger.json
```

---

## 七、版本实现

### 7.1 后端实现

#### 7.1.1 Spring Boot多版本支持

```java
@RestController
@RequestMapping("/api/v1/users")
public class UserControllerV1 {
    // v1 实现
}

@RestController
@RequestMapping("/api/v2/users")
public class UserControllerV2 {
    // v2 实现
}
```

#### 7.1.2 版本拦截器

```java
@Component
public class VersionInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                            HttpServletResponse response, 
                            Object handler) {
        String version = extractVersion(request.getRequestURI());
        request.setAttribute("apiVersion", version);
        return true;
    }
}
```

### 7.2 前端实现

#### 7.2.1 API版本配置

```javascript
// api.config.js
const API_VERSION = 'v2';

const apiClient = axios.create({
  baseURL: `/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

#### 7.2.2 版本适配层

```javascript
// api.adapter.js
class UserApiAdapter {
  constructor(version) {
    this.version = version;
  }
  
  async getUser(id) {
    const response = await apiClient.get(`/users/${id}`);
    return this.transformUser(response.data);
  }
  
  transformUser(data) {
    if (this.version === 'v1') {
      // v1 数据转换
      return {
        id: data.id,
        name: data.userName,
        status: data.status === 1 ? 'enabled' : 'disabled'
      };
    }
    return data;
  }
}
```

---

## 八、版本监控

### 8.1 版本使用统计

监控各版本API的使用情况：

| 版本 | 请求量(QPS) | 客户端数量 | 占比 |
|-----|------------|-----------|------|
| v1 | 100 | 5 | 5% |
| v2 | 1800 | 50 | 90% |
| v3 | 100 | 3 | 5% |

### 8.2 版本下线决策

当旧版本使用率低于阈值时，可考虑下线：

```
下线条件:
- 版本使用率 < 5%
- 已发布新版本 > 6个月
- 已通知客户端 > 3个月
```

---

## 九、最佳实践

### 9.1 版本规划

- 提前规划版本路线图
- 避免频繁发布MAJOR版本
- 保持版本变更的可预测性

### 9.2 向后兼容设计

- 新增字段使用可选值
- 使用扩展字段容纳未来变更
- 避免删除或重命名现有字段

### 9.3 版本测试

- 每个版本独立测试
- 版本间兼容性测试
- 迁移脚本测试

---

## 十、相关文档

- [RESTful API设计规范](./01-restful-api-standard.md)
- [接口安全规范](./02-interface-security-standard.md)
- [API接口清单](../02-api-specification/01-api-interface-list.md)

---

## 十一、评审记录

### 11.1 评审意见

| 序号 | 评审项 | 评审结果 | 评审意见 |
|-----|--------|---------|---------|
| 1 | 版本号规范 | ✓ 通过 | 语义化版本规范清晰 |
| 2 | 版本控制策略 | ✓ 通过 | URL路径版本策略合理 |
| 3 | 版本演进策略 | ✓ 通过 | 向后兼容设计完善 |
| 4 | 废弃流程 | ✓ 通过 | 废弃周期和通知机制完整 |
| 5 | 版本实现 | ✓ 通过 | 前后端实现方案可行 |

### 11.2 评审结论

**评审结论**: 通过

**评审意见**: 本文档建立了完整的接口版本管理规范，涵盖版本号定义、控制策略、演进规则、废弃流程等方面，能够有效指导API版本的生命周期管理。

### 11.3 签字确认

| 角色 | 姓名 | 签字 | 日期 | 意见 |
|-----|------|------|------|------|
| 技术总监 | 张总 | _______________ | 2026-03-09 | 同意 |
| 系统架构师 | 李工 | _______________ | 2026-03-09 | 同意 |
| 后端架构师 | 王工 | _______________ | 2026-03-09 | 同意 |
| 前端负责人 | 陈工 | _______________ | 2026-03-09 | 同意 |

---

## 十二、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-09 | 系统架构师 | 初始版本，建立接口版本管理规范 |
