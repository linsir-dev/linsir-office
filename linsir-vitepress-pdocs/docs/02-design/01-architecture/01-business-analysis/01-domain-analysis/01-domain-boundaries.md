# 领域边界划分

> **文档编号**：SYS-DES-BA-001  
> **文档版本**：1.0  
> **创建日期**：2026-03-08  
> **文档作者**：架构师  
> **文档状态**：✅ 已评审通过  
> **评审记录**：`00-review-records/01-domain-analysis-review-record.md`

---

## 1. 概述

### 1.1 文档目的
本文档基于业务需求分析，对System基础平台进行领域驱动设计（DDD），识别核心域、支撑域和通用域，划分限界上下文，为后续架构设计提供业务基础。

### 1.2 输入文档
- System系统业务需求文档（BRD）V1.1
- 用户画像文档
- 项目章程

### 1.3 领域设计方法
采用领域驱动设计（Domain-Driven Design, DDD）方法，通过以下步骤进行领域分析：
1. 识别业务领域和子域
2. 划分核心域、支撑域、通用域
3. 定义限界上下文（Bounded Context）
4. 建立上下文映射（Context Mapping）

---

## 2. 业务领域识别

### 2.1 业务领域全景

基于业务需求分析，System基础平台包含以下主要业务领域：

```
┌─────────────────────────────────────────────────────────────┐
│                    System 基础平台                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  用户管理域  │  │  权限管理域  │  │  组织管理域  │         │
│  │  User Mgmt  │  │Permission   │  │ Organization│         │
│  │             │  │   Mgmt      │  │    Mgmt     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  认证授权域  │  │  系统配置域  │  │  审计日志域  │         │
│  │  Auth       │  │  System     │  │   Audit     │         │
│  │  & Authz    │  │  Config     │  │    Log      │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 业务领域详细说明

#### 2.2.1 用户管理域（User Management Domain）

**业务描述**：
管理系统用户全生命周期，包括用户创建、编辑、禁用、删除，以及用户属性管理。用户是系统的核心实体，与员工（Employee）概念密切相关但不等同。

**用户与员工的关系**：
```
┌─────────────────────────────────────────────────────────────┐
│                    用户与员工关系模型                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────────┐              ┌──────────────┐           │
│   │    用户       │              │    员工       │           │
│   │    User       │◄────────────►│  Employee    │           │
│   │              │   1:1或1:0   │              │           │
│   │  - 系统身份    │   关系       │  - HR系统实体  │           │
│   │  - 登录凭证    │              │  - 人事信息    │           │
│   │  - 系统权限    │              │  - 薪酬信息    │           │
│   │  - 操作记录    │              │  - 考勤信息    │           │
│   └──────────────┘              └──────────────┘           │
│                                                             │
│   说明：                                                     │
│   1. 一个用户对应一个员工（在职员工必须有用系统账号）            │
│   2. 一个员工可以暂时没有用户（新员工未开通账号）               │
│   3. 用户离职后保留用户记录但禁用，员工记录标记为离职           │
│   4. 用户与员工通过员工编号（EmployeeNo）关联                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**核心业务能力**：
- 用户查询与查看
- 用户创建与批量导入
- 用户信息编辑
- 密码重置与管理
- 用户状态管理（启用/禁用/删除）
- 用户与组织关系管理
- 用户与员工关系维护

**业务规则**：
- 用户名全局唯一，字母开头，4-20位，允许字母数字下划线
- 用户必须属于一个主部门
- 用户可拥有多个角色
- 禁用用户5分钟内Token失效
- 删除用户需满足：从未登录、无操作日志、无待办事项
- **用户与员工关系规则**：
  - 员工入职时自动/手动创建用户账号
  - 员工离职时自动禁用用户账号
  - 员工调部门时同步更新用户部门
  - 员工信息变更（姓名、部门等）同步到用户

#### 2.2.2 权限管理域（Permission Management Domain）

**业务描述**：
基于RBAC模型实现权限管理，包括角色定义、菜单权限、操作权限和数据权限。

**核心业务能力**：
- 角色创建与管理
- 菜单权限分配
- 操作权限分配（查询、新增、编辑、删除、导出等）
- 数据权限范围设置
- 用户角色分配

**业务规则**：
- 角色编码全局唯一
- 操作权限依赖于菜单权限
- 数据权限范围：全部 > 本部门及子部门 > 本部门 > 本人
- 用户权限为多个角色的并集
- 系统预置角色不可删除（超级管理员、系统管理员、部门管理员、普通用户）

#### 2.2.3 组织管理域（Organization Management Domain）

**业务描述**：
管理企业组织架构，包括部门管理和岗位管理，支持多级树形结构。

**核心业务能力**：
- 部门创建与管理
- 部门树形结构维护
- 岗位创建与管理
- 部门负责人设置
- 组织架构可视化
- 用户部门分配（主部门/兼职部门）

**业务规则**：
- 部门编码全局唯一
- 支持多级树形结构（建议不超过5级）
- 有子部门的部门不可禁用
- 部门负责人自动获得部门管理员角色
- 一个用户只能有一个主部门，可有多个兼职部门

#### 2.2.4 认证授权域（Authentication & Authorization Domain）

**业务描述**：
提供统一身份认证和授权服务，支持多种认证协议和单点登录。

**核心业务能力**：
- 用户登录认证
- 密码验证与策略
- Token生成与管理
- 单点登录（SSO）
- 多因素认证（MFA）
- 会话管理
- 权限校验

**业务规则**：
- 密码长度8-20位，必须包含大小写字母、数字、特殊字符
- 登录失败5次锁定30分钟
- 会话超时30分钟无操作自动退出
- Token有效期：Access Token 2小时，Refresh Token 7天
- 支持OAuth 2.0、SAML、CAS、JWT协议

#### 2.2.5 系统配置域（System Configuration Domain）

**业务描述**：
管理系统级配置参数，支持动态配置和分组管理。

**核心业务能力**：
- 配置参数管理
- 配置分组管理
- 配置版本管理
- 配置变更审计
- 配置缓存管理

**业务规则**：
- 配置键全局唯一
- 支持多种数据类型（字符串、数字、布尔、JSON）
- 配置变更实时生效
- 敏感配置加密存储

#### 2.2.6 审计日志域（Audit Log Domain）

**业务描述**：
记录系统操作日志和安全审计日志，支持查询和分析。

**核心业务能力**：
- 操作日志记录
- 登录日志记录
- 安全事件记录
- 日志查询与检索
- 日志归档与清理

**业务规则**：
- 关键操作必须记录审计日志
- 审计日志不可修改、不可删除
- 日志保留期限：在线3个月，归档1年
- 敏感操作需记录操作前和操作后数据

---

## 3. 领域分类（核心域/支撑域/通用域）

### 3.1 领域分类矩阵

| 领域 | 类型 | 战略重要性 | 复杂度 | 竞争优势 |
|-----|------|-----------|-------|---------|
| 用户管理域 | **核心域** | 高 | 中 | 差异化能力 |
| 权限管理域 | **核心域** | 高 | 高 | 差异化能力 |
| 认证授权域 | **核心域** | 高 | 高 | 差异化能力 |
| 组织管理域 | 支撑域 | 中 | 中 | 支撑能力 |
| 系统配置域 | 通用域 | 低 | 低 | 通用能力 |
| 审计日志域 | 通用域 | 中 | 低 | 合规能力 |

### 3.2 核心域（Core Domain）

核心域是System平台的核心竞争力所在，需要投入最优秀的团队和资源进行设计和实现。

#### 3.2.1 用户管理域（核心域）

**战略重要性**：⭐⭐⭐⭐⭐

**理由**：
- 用户是系统的基础，所有业务都围绕用户展开
- 用户管理直接影响用户体验和系统安全
- 支持批量导入、多维度查询等差异化功能

**设计策略**：
- 采用领域驱动设计，深入挖掘业务规则
- 投入资深开发人员
- 建立完善的自动化测试

#### 3.2.2 权限管理域（核心域）

**战略重要性**：⭐⭐⭐⭐⭐

**理由**：
- 权限管理是系统安全的核心
- 支持RBAC模型和数据权限，是差异化能力
- 直接影响企业数据安全合规

**设计策略**：
- 精心设计权限模型，支持灵活扩展
- 性能优化，确保权限校验高效
- 完善的权限审计机制

#### 3.2.3 认证授权域（核心域）

**战略重要性**：⭐⭐⭐⭐⭐

**理由**：
- 认证授权是系统安全的第一道防线
- 支持SSO和多协议是核心竞争力
- 直接影响用户体验（单点登录）

**设计策略**：
- 采用业界标准协议（OAuth 2.0、JWT）
- 安全优先设计
- 支持多种认证方式扩展

### 3.3 支撑域（Supporting Domain）

支撑域支持核心域的业务实现，虽然重要但不具备差异化竞争优势。

#### 3.3.1 组织管理域（支撑域）

**战略重要性**：⭐⭐⭐

**理由**：
- 组织架构管理是用户管理的基础支撑
- 功能相对标准，行业内实现方式类似
- 主要支撑数据权限和业务流程

**设计策略**：
- 满足业务需求即可，不追求过度设计
- 可采用成熟的设计模式
- 关注与核心域的集成

### 3.4 通用域（Generic Domain）

通用域提供通用业务能力，可通过购买或开源方案实现。

#### 3.4.1 系统配置域（通用域）

**战略重要性**：⭐⭐

**理由**：
- 配置管理是通用功能
- 行业内实现方式标准化
- 不直接产生业务价值

**设计策略**：
- 可采用开源配置中心方案
- 满足基本功能需求
- 关注配置安全

#### 3.4.2 审计日志域（通用域）

**战略重要性**：⭐⭐⭐

**理由**：
- 审计日志是合规要求，非业务差异化
- 可采用成熟的日志方案（ELK）
- 主要满足等保合规要求

**设计策略**：
- 集成成熟的日志框架
- 满足合规要求即可
- 关注日志存储和检索性能

---

## 4. 限界上下文划分

### 4.1 限界上下文总览

```
┌─────────────────────────────────────────────────────────────────────┐
│                         System 基础平台                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────┐         ┌─────────────────────┐           │
│  │   用户管理上下文     │◄───────►│   组织管理上下文     │           │
│  │  User Management    │  用户   │  Organization       │           │
│  │     Context         │ 部门关系 │     Context         │           │
│  │                     │         │                     │           │
│  │  - 用户聚合          │         │  - 部门聚合          │           │
│  │  - 用户角色关系      │         │  - 岗位聚合          │           │
│  └──────────┬──────────┘         └──────────┬──────────┘           │
│             │                               │                      │
│             │ 用户权限                       │ 部门权限              │
│             ▼                               ▼                      │
│  ┌─────────────────────┐         ┌─────────────────────┐           │
│  │   权限管理上下文     │◄───────►│   认证授权上下文     │           │
│  │ Permission          │ 权限校验 │  Auth & Authz       │           │
│  │   Management        │         │     Context         │           │
│  │     Context         │         │                     │           │
│  │                     │         │  - 认证聚合          │           │
│  │  - 角色聚合          │         │  - 授权聚合          │           │
│  │  - 权限聚合          │         │  - Token聚合         │           │
│  └─────────────────────┘         └─────────────────────┘           │
│                                                                     │
│  ┌─────────────────────┐         ┌─────────────────────┐           │
│  │   系统配置上下文     │         │   审计日志上下文     │           │
│  │  System Config      │         │   Audit Log         │           │
│  │     Context         │         │     Context         │           │
│  │                     │         │                     │           │
│  │  - 配置聚合          │         │  - 操作日志聚合      │           │
│  │  - 配置分组聚合      │         │  - 登录日志聚合      │           │
│  └─────────────────────┘         └─────────────────────┘           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 限界上下文详细定义

#### 4.2.1 用户管理上下文（User Management Context）

**上下文职责**：
负责用户全生命周期管理，包括用户创建、编辑、查询、禁用、删除等操作。

**聚合（Aggregates）**：

1. **用户聚合（User Aggregate）**
   - 根实体：User（用户）
   - 值对象：
     - UserId（用户ID）
     - Username（用户名）
     - RealName（真实姓名）
     - Email（邮箱）
     - Phone（手机号）
     - Password（密码）
     - Status（状态）
     - CreatedAt（创建时间）
     - UpdatedAt（更新时间）
     - **EmployeeNo（员工编号）- 关联HR系统员工**
     - **EmployeeStatus（员工状态）- 在职/离职/试用期**
   - 领域事件：
     - UserCreated（用户创建）
     - UserUpdated（用户更新）
     - UserDisabled（用户禁用）
     - UserDeleted（用户删除）
     - PasswordReset（密码重置）
     - **EmployeeLinked（员工关联）**
     - **EmployeeUnlinked（员工解除关联）**

2. **用户角色关系聚合（UserRole Aggregate）**
   - 根实体：UserRole（用户角色关系）
   - 值对象：
     - UserId（用户ID）
     - RoleId（角色ID）
     - IsPrimary（是否主角色）
   - 领域事件：
     - RoleAssignedToUser（角色分配给用户）
     - RoleRemovedFromUser（角色从用户移除）

**领域服务**：
- UserQueryService（用户查询服务）
- UserImportService（用户导入服务）
- PasswordService（密码服务）

**上下文映射关系**：
- 与组织管理上下文：用户属于部门（Customer-Supplier）
- 与权限管理上下文：用户拥有角色（Customer-Supplier）
- 与认证授权上下文：提供用户认证信息（Customer-Supplier）
- **与HR系统（外部系统）：同步员工信息（Customer-Supplier）**

#### 4.2.2 权限管理上下文（Permission Management Context）

**上下文职责**：
负责角色定义、权限分配、数据权限管理，实现RBAC权限模型。

**聚合（Aggregates）**：

1. **角色聚合（Role Aggregate）**
   - 根实体：Role（角色）
   - 值对象：
     - RoleId（角色ID）
     - RoleCode（角色编码）
     - RoleName（角色名称）
     - Description（描述）
     - Status（状态）
     - IsSystem（是否系统预设）
   - 领域事件：
     - RoleCreated（角色创建）
     - RoleUpdated（角色更新）
     - RoleDeleted（角色删除）

2. **权限聚合（Permission Aggregate）**
   - 根实体：Permission（权限）
   - 值对象：
     - PermissionId（权限ID）
     - ResourceType（资源类型：菜单/操作/数据）
     - ResourceId（资源ID）
     - Operation（操作类型）
     - DataScope（数据范围）
   - 领域事件：
     - PermissionGranted（权限授予）
     - PermissionRevoked（权限撤销）

3. **角色权限关系聚合（RolePermission Aggregate）**
   - 根实体：RolePermission（角色权限关系）
   - 值对象：
     - RoleId（角色ID）
     - PermissionId（权限ID）

**领域服务**：
- PermissionCheckService（权限校验服务）
- DataScopeService（数据范围服务）
- RoleHierarchyService（角色层级服务）

**上下文映射关系**：
- 与用户管理上下文：角色分配给用户（Supplier-Customer）
- 与认证授权上下文：提供权限信息（Supplier-Customer）

#### 4.2.3 组织管理上下文（Organization Management Context）

**上下文职责**：
负责组织架构管理，包括部门管理和岗位管理。

**聚合（Aggregates）**：

1. **部门聚合（Department Aggregate）**
   - 根实体：Department（部门）
   - 值对象：
     - DeptId（部门ID）
     - DeptCode（部门编码）
     - DeptName（部门名称）
     - ParentId（上级部门ID）
     - LeaderId（负责人ID）
     - Description（描述）
     - SortOrder（排序号）
     - Status（状态）
   - 领域事件：
     - DepartmentCreated（部门创建）
     - DepartmentUpdated（部门更新）
     - DepartmentDisabled（部门禁用）

2. **岗位聚合（Position Aggregate）**
   - 根实体：Position（岗位）
   - 值对象：
     - PositionId（岗位ID）
     - PositionCode（岗位编码）
     - PositionName（岗位名称）
     - DeptId（所属部门ID）
     - Description（描述）

3. **用户部门关系聚合（UserDepartment Aggregate）**
   - 根实体：UserDepartment（用户部门关系）
   - 值对象：
     - UserId（用户ID）
     - DeptId（部门ID）
     - IsPrimary（是否主部门）

**领域服务**：
- DepartmentTreeService（部门树服务）
- OrganizationQueryService（组织查询服务）

**上下文映射关系**：
- 与用户管理上下文：提供部门信息（Supplier-Customer）
- 与权限管理上下文：提供数据权限范围（Supplier-Customer）

#### 4.2.4 认证授权上下文（Authentication & Authorization Context）

**上下文职责**：
负责用户认证和授权，支持多种认证协议和单点登录。

**聚合（Aggregates）**：

1. **认证聚合（Authentication Aggregate）**
   - 根实体：Authentication（认证记录）
   - 值对象：
     - AuthId（认证ID）
     - UserId（用户ID）
     - AuthType（认证类型：密码/短信/邮箱/第三方）
     - AuthStatus（认证状态）
     - AuthTime（认证时间）
     - ClientInfo（客户端信息）
   - 领域事件：
     - AuthenticationSuccess（认证成功）
     - AuthenticationFailed（认证失败）

2. **授权聚合（Authorization Aggregate）**
   - 根实体：Authorization（授权记录）
   - 值对象：
     - AuthzId（授权ID）
     - UserId（用户ID）
     - Resource（资源）
     - Action（操作）
     - Result（授权结果）
     - AuthzTime（授权时间）

3. **Token聚合（Token Aggregate）**
   - 根实体：Token（令牌）
   - 值对象：
     - TokenId（令牌ID）
     - UserId（用户ID）
     - AccessToken（访问令牌）
     - RefreshToken（刷新令牌）
     - ExpiresAt（过期时间）
     - TokenType（令牌类型）
   - 领域事件：
     - TokenCreated（令牌创建）
     - TokenRefreshed（令牌刷新）
     - TokenRevoked（令牌撤销）

4. **会话聚合（Session Aggregate）**
   - 根实体：Session（会话）
   - 值对象：
     - SessionId（会话ID）
     - UserId（用户ID）
     - TokenId（令牌ID）
     - LoginTime（登录时间）
     - LastAccessTime（最后访问时间）
     - ExpiresAt（过期时间）
     - ClientInfo（客户端信息）

**领域服务**：
- AuthenticationService（认证服务）
- AuthorizationService（授权服务）
- TokenService（令牌服务）
- SessionService（会话服务）
- SSOService（单点登录服务）

**上下文映射关系**：
- 与用户管理上下文：获取用户认证信息（Customer-Supplier）
- 与权限管理上下文：获取用户权限信息（Customer-Supplier）

#### 4.2.5 系统配置上下文（System Configuration Context）

**上下文职责**：
负责系统级配置参数管理，支持Web端展示配置和商务信息配置。

**聚合（Aggregates）**：

1. **配置聚合（Config Aggregate）**
   - 根实体：Config（配置）
   - 值对象：
     - ConfigId（配置ID）
     - ConfigKey（配置键）
     - ConfigValue（配置值）
     - ConfigType（配置类型：STRING/NUMBER/BOOLEAN/JSON）
     - Description（描述）
     - IsEncrypted（是否加密）
     - GroupId（分组ID）
     - SortOrder（排序号）
     - IsSystem（是否系统预设）
   - 领域事件：
     - ConfigCreated（配置创建）
     - ConfigUpdated（配置更新）
     - ConfigDeleted（配置删除）

2. **配置分组聚合（ConfigGroup Aggregate）**
   - 根实体：ConfigGroup（配置分组）
   - 值对象：
     - GroupId（分组ID）
     - GroupCode（分组编码）
     - GroupName（分组名称）
     - Description（描述）
     - Icon（分组图标）
     - SortOrder（排序号）

**配置分类详细说明**：

**A. Web端展示配置（Web Configuration）**

| 配置项 | 配置键 | 配置类型 | 说明 |
|-------|--------|---------|------|
| 系统名称 | web.system.name | STRING | 系统显示名称，如"System基础平台" |
| 系统Logo | web.system.logo | STRING | 系统Logo图片URL或Base64 |
| 系统图标 | web.system.favicon | STRING | 浏览器标签页图标 |
| 登录页背景图 | web.login.background | STRING | 登录页面背景图片URL |
| 登录页标题 | web.login.title | STRING | 登录页面显示的标题 |
| 版权信息 | web.footer.copyright | STRING | 页脚版权信息 |
| 备案信息 | web.footer.icp | STRING | ICP备案号 |
| 技术支持 | web.footer.support | STRING | 技术支持信息 |
| 主题颜色 | web.theme.primaryColor | STRING | 系统主题主色调 |
| 侧边栏风格 | web.theme.sidebarStyle | STRING | 侧边栏样式：dark/light |
| 默认语言 | web.locale.default | STRING | 默认语言：zh-CN/en-US |
| 多语言开关 | web.locale.enabled | BOOLEAN | 是否启用多语言切换 |
| 首页路由 | web.home.route | STRING | 登录后默认跳转页面 |
| 水印开关 | web.watermark.enabled | BOOLEAN | 是否显示用户水印 |
| 水印内容 | web.watermark.content | STRING | 水印显示内容模板 |

**B. 商务信息配置（Business Configuration）**

| 配置项 | 配置键 | 配置类型 | 说明 |
|-------|--------|---------|------|
| 企业名称 | biz.company.name | STRING | 企业全称 |
| 企业简称 | biz.company.shortName | STRING | 企业简称 |
| 统一社会信用代码 | biz.company.creditCode | STRING | 营业执照统一社会信用代码 |
| 企业类型 | biz.company.type | STRING | 企业类型 |
| 法人代表 | biz.legal.representative | STRING | 法人代表姓名 |
| 法人身份证号 | biz.legal.idCard | STRING | 法人代表身份证号（加密存储） |
| 法人手机号 | biz.legal.phone | STRING | 法人代表手机号（加密存储） |
| 注册地址 | biz.address.registered | STRING | 工商注册地址 |
| 办公地址 | biz.address.office | STRING | 实际办公地址 |
| 联系电话 | biz.contact.phone | STRING | 企业联系电话 |
| 联系邮箱 | biz.contact.email | STRING | 企业联系邮箱 |
| 开户银行 | biz.bank.name | STRING | 开户银行名称 |
| 银行账号 | biz.bank.account | STRING | 银行账号（加密存储） |
| 合同编号前缀 | biz.contract.prefix | STRING | 合同编号自动生成前缀 |
| 合同编号规则 | biz.contract.rule | STRING | 合同编号生成规则 |
| 合同模板 | biz.contract.template | STRING | 默认合同模板文件路径 |
| 发票抬头 | biz.invoice.title | STRING | 发票抬头名称 |
| 发票税号 | biz.invoice.taxNo | STRING | 纳税人识别号 |
| 发票地址 | biz.invoice.address | STRING | 发票注册地址 |
| 发票电话 | biz.invoice.phone | STRING | 发票注册电话 |
| 发票开户行 | biz.invoice.bank | STRING | 发票开户银行 |
| 发票账号 | biz.invoice.account | STRING | 发票银行账号（加密存储） |

**C. 系统参数配置（System Configuration）**

| 配置项 | 配置键 | 配置类型 | 说明 |
|-------|--------|---------|------|
| 密码有效期 | sys.security.passwordExpireDays | NUMBER | 密码过期天数 |
| 登录失败次数 | sys.security.maxLoginAttempts | NUMBER | 最大登录失败次数 |
| 锁定时间 | sys.security.lockDuration | NUMBER | 账号锁定时间（分钟） |
| 会话超时时间 | sys.security.sessionTimeout | NUMBER | 会话超时时间（分钟） |
| Token有效期 | sys.security.tokenExpireHours | NUMBER | Access Token有效期（小时） |
| 文件上传大小 | sys.upload.maxSize | NUMBER | 最大上传文件大小（MB） |
| 允许文件类型 | sys.upload.allowedTypes | STRING | 允许上传的文件类型 |
| 数据备份时间 | sys.backup.schedule | STRING | 定时备份Cron表达式 |
| 日志保留天数 | sys.log.retentionDays | NUMBER | 日志保留天数 |

**领域服务**：
- ConfigService（配置服务）
- ConfigCacheService（配置缓存服务）
- ConfigGroupService（配置分组服务）
- BusinessConfigService（商务配置服务）
- WebConfigService（Web配置服务）

#### 4.2.6 审计日志上下文（Audit Log Context）

**上下文职责**：
负责操作日志和安全审计日志记录。

**聚合（Aggregates）**：

1. **操作日志聚合（OperationLog Aggregate）**
   - 根实体：OperationLog（操作日志）
   - 值对象：
     - LogId（日志ID）
     - UserId（用户ID）
     - OperationType（操作类型）
     - ResourceType（资源类型）
     - ResourceId（资源ID）
     - OperationDetail（操作详情）
     - BeforeData（操作前数据）
     - AfterData（操作后数据）
     - OperationTime（操作时间）
     - ClientInfo（客户端信息）

2. **登录日志聚合（LoginLog Aggregate）**
   - 根实体：LoginLog（登录日志）
   - 值对象：
     - LogId（日志ID）
     - UserId（用户ID）
     - LoginType（登录类型）
     - LoginStatus（登录状态）
     - LoginTime（登录时间）
     - ClientInfo（客户端信息）

**领域服务**：
- AuditLogService（审计日志服务）
- LogQueryService（日志查询服务）

---

## 5. 上下文映射（Context Mapping）

### 5.1 上下文关系图

```
┌────────────────────────────────────────────────────────────────────┐
│                        上下文映射关系                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│   ┌──────────────┐                                                 │
│   │   用户管理    │◄───────────────────────────────────────────┐   │
│   │   上下文      │                                            │   │
│   └──────┬───────┘                                            │   │
│          │ Customer-Supplier                                  │   │
│          │ (用户部门关系)                                      │   │
│          ▼                                                     │   │
│   ┌──────────────┐    Customer-Supplier    ┌──────────────┐   │   │
│   │   组织管理    │◄───────────────────────►│   权限管理    │   │   │
│   │   上下文      │    (部门数据权限)        │   上下文      │   │   │
│   └──────────────┘                         └──────┬───────┘   │   │
│                                                   │           │   │
│          Customer-Supplier                        │ Supplier-Customer
│          (用户认证信息)                            │ (权限信息)   │
│                   ┌──────────────┐               │           │   │
│                   ▼              │               ▼           │   │
│   ┌──────────────┐    Supplier-Customer    ┌──────────────┐   │   │
│   │   认证授权    │◄───────────────────────►│   用户管理    │   │   │
│   │   上下文      │    (用户权限校验)        │   上下文      │   │   │
│   └──────────────┘                         └──────────────┘   │   │
│                                                                │   │
│   ┌──────────────┐                         ┌──────────────┐   │   │
│   │   系统配置    │                         │   审计日志    │   │   │
│   │   上下文      │                         │   上下文      │   │   │
│   └──────────────┘                         └──────────────┘   │   │
│                                                                │   │
│   ┌──────────────┐                                             │   │
│   │  HR系统      │  Customer-Supplier (员工信息同步)            │   │
│   │ (外部系统)   │─────────────────────────────────────────────┘   │
│   └──────────────┘                                                 │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 5.2 集成关系说明

#### 5.2.1 用户管理上下文 ↔ 组织管理上下文

**关系类型**：Customer-Supplier（客户-供应商）

**集成方式**：
- 用户管理上下文通过API从组织管理上下文获取部门信息
- 用户聚合引用部门ID（DeptId）

**集成协议**：
- REST API
- 数据同步（部门变更时通知用户管理上下文）

#### 5.2.2 用户管理上下文 ↔ 权限管理上下文

**关系类型**：Customer-Supplier（客户-供应商）

**集成方式**：
- 用户管理上下文通过API从权限管理上下文获取角色信息
- 用户角色关系聚合引用角色ID（RoleId）

**集成协议**：
- REST API
- 领域事件（角色变更时通知用户管理上下文）

#### 5.2.3 用户管理上下文 ↔ 认证授权上下文

**关系类型**：Customer-Supplier（客户-供应商）

**集成方式**：
- 认证授权上下文通过API从用户管理上下文获取用户认证信息
- 认证授权上下文通过API从用户管理上下文获取用户状态

**集成协议**：
- REST API
- 缓存同步（用户信息缓存）

#### 5.2.4 权限管理上下文 ↔ 认证授权上下文

**关系类型**：Supplier-Customer（供应商-客户）

**集成方式**：
- 认证授权上下文通过API从权限管理上下文获取用户权限信息
- 权限缓存到认证授权上下文

**集成协议**：
- REST API
- 缓存同步（权限信息缓存）

#### 5.2.5 组织管理上下文 ↔ 权限管理上下文

**关系类型**：Customer-Supplier（客户-供应商）

**集成方式**：
- 权限管理上下文通过API从组织管理上下文获取部门树
- 数据权限范围基于部门树计算

**集成协议**：
- REST API
- 缓存同步（部门树缓存）

#### 5.2.6 用户管理上下文 ↔ HR系统（外部系统）

**关系类型**：Customer-Supplier（客户-供应商）

**集成场景**：
1. **员工入职同步**
   - HR系统发起员工入职流程
   - 自动/手动触发用户账号创建
   - 同步员工基本信息（姓名、部门、岗位等）

2. **员工离职同步**
   - HR系统发起员工离职流程
   - 自动禁用用户账号
   - 保留用户历史记录

3. **员工调岗同步**
   - HR系统更新员工部门/岗位
   - 同步更新用户部门信息
   - 触发数据权限重新计算

4. **员工信息变更同步**
   - HR系统更新员工姓名、联系方式
   - 同步更新用户信息

**集成方式**：
- **实时同步**：通过消息队列（MQ）实时推送变更
- **定时同步**：定时任务批量同步差异数据
- **手动同步**：管理员手动触发同步

**集成协议**：
- REST API（HR系统提供标准接口）
- 消息队列（MQ）异步通知
- 数据推送（HR系统主动推送）

**数据映射**：

| HR系统字段 | System用户字段 | 说明 |
|-----------|---------------|------|
| EmployeeNo | EmployeeNo | 员工编号，主键关联 |
| EmployeeName | RealName | 员工姓名 |
| DepartmentCode | DeptId | 部门编码映射 |
| PositionCode | PositionId | 岗位编码映射 |
| Email | Email | 邮箱 |
| Mobile | Phone | 手机号 |
| Status | EmployeeStatus | 在职/离职/试用期 |
| EntryDate | CreatedAt | 入职日期映射为用户创建时间 |

**冲突处理策略**：
- 以HR系统数据为准（Source of Truth）
- System系统本地可扩展字段（如用户偏好设置）
- 冲突时记录日志，人工介入处理

---

## 6. 领域词汇表（Ubiquitous Language）

### 6.1 用户管理域词汇

| 中文术语 | 英文术语 | 定义 |
|---------|---------|------|
| 用户 | User | 系统的使用者，具有唯一身份标识 |
| 员工 | Employee | 企业雇员，HR系统管理的实体 |
| 用户名 | Username | 用户的登录名，全局唯一 |
| 真实姓名 | Real Name | 用户的真实姓名 |
| 员工编号 | Employee No | 员工在HR系统的唯一编号 |
| 主部门 | Primary Department | 用户的主要归属部门 |
| 兼职部门 | Secondary Department | 用户的次要归属部门 |
| 用户状态 | User Status | 用户账号的状态：启用/禁用/锁定 |
| 员工状态 | Employee Status | 员工在职状态：在职/离职/试用期 |
| 密码策略 | Password Policy | 密码复杂度要求和过期策略 |
| 用户-员工关联 | User-Employee Link | 用户与员工的对应关系 |

### 6.2 权限管理域词汇

| 中文术语 | 英文术语 | 定义 |
|---------|---------|------|
| 角色 | Role | 一组权限的集合 |
| 权限 | Permission | 对资源的访问许可 |
| 菜单权限 | Menu Permission | 访问菜单的权限 |
| 操作权限 | Operation Permission | 执行操作的权限（增删改查） |
| 数据权限 | Data Permission | 访问数据范围的权限 |
| 数据范围 | Data Scope | 数据访问的范围：全部/本部门及子部门/本部门/本人 |
| RBAC | Role-Based Access Control | 基于角色的访问控制模型 |

### 6.3 组织管理域词汇

| 中文术语 | 英文术语 | 定义 |
|---------|---------|------|
| 部门 | Department | 组织架构中的组织单元 |
| 部门树 | Department Tree | 部门的层级结构 |
| 岗位 | Position | 部门内的职位 |
| 部门负责人 | Department Leader | 部门的管理者 |
| 上级部门 | Parent Department | 当前部门的上级组织单元 |
| 子部门 | Child Department | 当前部门的下级组织单元 |

### 6.4 认证授权域词汇

| 中文术语 | 英文术语 | 定义 |
|---------|---------|------|
| 认证 | Authentication | 验证用户身份的过程 |
| 授权 | Authorization | 授予用户访问权限的过程 |
| 单点登录 | SSO (Single Sign-On) | 一次登录，多系统访问 |
| Token | Token | 访问令牌，用于身份验证 |
| Access Token | Access Token | 访问令牌，短期有效 |
| Refresh Token | Refresh Token | 刷新令牌，用于获取新的Access Token |
| 会话 | Session | 用户的登录会话 |
| OAuth 2.0 | OAuth 2.0 | 开放授权协议 |
| JWT | JSON Web Token | JSON格式的令牌标准 |

---

## 7. 附录

### 7.1 参考资料
- 《领域驱动设计：软件核心复杂性应对之道》（Eric Evans）
- 《实现领域驱动设计》（Vaughn Vernon）
- System系统业务需求文档（BRD）V1.1

### 7.2 修订记录

| 版本 | 日期 | 修订人 | 修订内容 |
|-----|------|-------|---------|
| 1.0 | 2026-03-08 | 架构师 | 初始版本 |

---

**文档编制**：架构师  
**文档审核**：技术负责人  
**编制日期**：2026-03-08
