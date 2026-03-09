# 领域模型设计

> **文档编号**：SYS-DES-BA-002  
> **文档版本**：1.0  
> **创建日期**：2026-03-08  
> **文档作者**：架构师  
> **文档状态**：✅ 已评审通过  
> **评审记录**：`00-review-records/01-domain-analysis-review-record.md`

---

## 1. 概述

### 1.1 文档目的
本文档基于领域边界划分，详细设计System基础平台的领域模型，包括实体、值对象、聚合、领域事件和领域服务，为后续架构设计和开发实现提供详细的业务模型指导。

### 1.2 输入文档
- 领域边界划分（SYS-DES-BA-001）
- System系统业务需求文档（BRD）V1.1

### 1.3 设计原则
- **单一职责原则**：每个聚合只负责一个业务概念
- **高内聚低耦合**：聚合内部高内聚，聚合之间低耦合
- **业务一致性**：领域模型忠实反映业务规则
- **可扩展性**：支持未来业务扩展

---

## 2. 领域模型总览

### 2.1 领域模型全景图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           System 领域模型全景图                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        用户管理上下文                                 │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │   │
│  │  │   用户聚合   │◄──►│ 用户角色关系 │    │ 用户部门关系 │             │   │
│  │  │  User Agg   │    │   聚合      │    │   聚合      │             │   │
│  │  │             │    │ UserRole    │    │UserDept     │             │   │
│  │  │ - User      │    │             │    │             │             │   │
│  │  │ - UserId    │    │ - UserId    │    │ - UserId    │             │   │
│  │  │ - Username  │    │ - RoleId    │    │ - DeptId    │             │   │
│  │  │ - Password  │    │ - IsPrimary │    │ - IsPrimary │             │   │
│  │  │ - EmployeeNo│    │             │    │             │             │   │
│  │  └─────────────┘    └─────────────┘    └─────────────┘             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        权限管理上下文                                 │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │   │
│  │  │   角色聚合   │◄──►│ 角色权限关系 │    │   权限聚合   │             │   │
│  │  │  Role Agg   │    │   聚合      │    │ Permission  │             │   │
│  │  │             │    │RolePerm     │    │   Agg       │             │   │
│  │  │ - Role      │    │             │    │             │             │   │
│  │  │ - RoleId    │    │ - RoleId    │    │ - Permission│             │   │
│  │  │ - RoleCode  │    │ - PermId    │    │ - Resource  │             │   │
│  │  │ - RoleName  │    │             │    │ - Operation │             │   │
│  │  └─────────────┘    └─────────────┘    └─────────────┘             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        组织管理上下文                                 │   │
│  │  ┌─────────────┐    ┌─────────────┐                                │   │
│  │  │   部门聚合   │    │   岗位聚合   │                                │   │
│  │  │ Department  │    │  Position   │                                │   │
│  │  │    Agg      │    │    Agg      │                                │   │
│  │  │             │    │             │                                │   │
│  │  │ - Department│    │ - Position  │                                │   │
│  │  │ - DeptId    │    │ - PositionId│                                │   │
│  │  │ - DeptCode  │    │ - Position  │                                │   │
│  │  │ - ParentId  │    │   Code      │                                │   │
│  │  └─────────────┘    └─────────────┘                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        认证授权上下文                                 │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │   │
│  │  │   认证聚合   │    │   授权聚合   │    │   Token聚合  │             │   │
│  │  │    Auth     │    │    Authz    │    │   Token     │             │   │
│  │  │    Agg      │    │    Agg      │    │    Agg      │             │   │
│  │  │             │    │             │    │             │             │   │
│  │  │ - AuthRecord│    │ - AuthzRec  │    │ - Token     │             │   │
│  │  │ - AuthType  │    │ - Resource  │    │ - AccessTok │             │   │
│  │  │ - AuthStatus│    │ - Action    │    │ - RefreshTok│             │   │
│  │  └─────────────┘    └─────────────┘    └─────────────┘             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        系统配置上下文                                 │   │
│  │  ┌─────────────┐    ┌─────────────────────────────────────────┐    │   │
│  │  │  配置分组聚合 │    │              配置聚合                    │    │   │
│  │  │ ConfigGroup │    │               Config                     │    │   │
│  │  │    Agg      │    │                Agg                       │    │   │
│  │  │             │    │                                          │    │   │
│  │  │ - GroupId   │    │  - ConfigId    - ConfigKey    - GroupId  │    │   │
│  │  │ - GroupCode │    │  - ConfigValue - ConfigType  - IsEncrypt │    │   │
│  │  │ - GroupName │    │  - web.* / biz.* / sys.*                 │    │   │
│  │  └─────────────┘    └─────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 用户管理上下文领域模型

### 3.1 用户聚合（User Aggregate）

#### 3.1.1 聚合根：User（用户）

```java
// 伪代码示例
@Entity
@Table(name = "sys_user")
public class User extends BaseAggregateRoot<UserId> {
    
    // 标识
    private UserId userId;
    private Username username;
    
    // 基本信息
    private RealName realName;
    private Email email;
    private Phone phone;
    private Password password;
    
    // 员工关联
    private EmployeeNo employeeNo;      // 员工编号
    private EmployeeStatus employeeStatus;  // 员工状态
    
    // 部门关联
    private DeptId primaryDeptId;       // 主部门ID
    private PositionId positionId;      // 岗位ID
    
    // 状态
    private UserStatus status;          // 用户状态
    private LocalDateTime lastLoginTime; // 最后登录时间
    private String lastLoginIp;         // 最后登录IP
    
    // 审计
    private LocalDateTime createdAt;
    private UserId createdBy;
    private LocalDateTime updatedAt;
    private UserId updatedBy;
    
    // 领域方法
    public void disable() {
        this.status = UserStatus.DISABLED;
        registerEvent(new UserDisabledEvent(this.userId));
    }
    
    public void resetPassword() {
        this.password = Password.generateRandom();
        registerEvent(new PasswordResetEvent(this.userId, this.email));
    }
    
    public void linkEmployee(EmployeeNo employeeNo) {
        this.employeeNo = employeeNo;
        this.employeeStatus = EmployeeStatus.ACTIVE;
        registerEvent(new EmployeeLinkedEvent(this.userId, employeeNo));
    }
    
    public void unlinkEmployee() {
        EmployeeNo oldEmployeeNo = this.employeeNo;
        this.employeeNo = null;
        this.employeeStatus = null;
        registerEvent(new EmployeeUnlinkedEvent(this.userId, oldEmployeeNo));
    }
}
```

#### 3.1.2 值对象定义

| 值对象 | 属性 | 校验规则 |
|-------|------|---------|
| **UserId** | value: String | UUID格式，系统生成 |
| **Username** | value: String | 字母开头，4-20位，允许字母数字下划线，全局唯一 |
| **RealName** | value: String | 2-20位中文或英文 |
| **Email** | value: String | 符合邮箱格式，唯一 |
| **Phone** | value: String | 大陆手机号11位，唯一 |
| **Password** | value: String, salt: String | bcrypt加密存储，长度60位 |
| **EmployeeNo** | value: String | HR系统员工编号，唯一 |
| **EmployeeStatus** | value: Enum | ACTIVE(在职), RESIGNED(离职), PROBATION(试用期) |
| **UserStatus** | value: Enum | ENABLED(启用), DISABLED(禁用), LOCKED(锁定) |

#### 3.1.3 领域事件

| 领域事件 | 触发条件 | 事件属性 |
|---------|---------|---------|
| UserCreatedEvent | 用户创建 | userId, username, email, createdAt |
| UserUpdatedEvent | 用户更新 | userId, updatedFields, updatedAt |
| UserDisabledEvent | 用户禁用 | userId, disabledAt, disabledBy |
| UserDeletedEvent | 用户删除 | userId, deletedAt, deletedBy |
| PasswordResetEvent | 密码重置 | userId, email, resetAt |
| PasswordChangedEvent | 密码修改 | userId, changedAt |
| EmployeeLinkedEvent | 关联员工 | userId, employeeNo, linkedAt |
| EmployeeUnlinkedEvent | 解除关联 | userId, employeeNo, unlinkedAt |
| UserLoginSuccessEvent | 登录成功 | userId, loginTime, loginIp, clientInfo |
| UserLoginFailedEvent | 登录失败 | username, failTime, failIp, failReason |

### 3.2 用户角色关系聚合（UserRole Aggregate）

#### 3.2.1 聚合根：UserRole（用户角色关系）

```java
@Entity
@Table(name = "sys_user_role")
public class UserRole extends BaseAggregateRoot<UserRoleId> {
    
    private UserRoleId userRoleId;
    private UserId userId;
    private RoleId roleId;
    private boolean isPrimary;      // 是否主角色
    private LocalDateTime assignedAt;
    private UserId assignedBy;
    
    // 领域方法
    public void setAsPrimary() {
        this.isPrimary = true;
        registerEvent(new PrimaryRoleSetEvent(this.userId, this.roleId));
    }
}
```

#### 3.2.2 值对象

| 值对象 | 属性 | 校验规则 |
|-------|------|---------|
| UserRoleId | value: String | UUID格式 |
| UserId | value: String | 引用用户聚合 |
| RoleId | value: String | 引用角色聚合 |

#### 3.2.3 领域事件

| 领域事件 | 触发条件 | 事件属性 |
|---------|---------|---------|
| RoleAssignedToUserEvent | 角色分配 | userId, roleId, assignedAt, assignedBy |
| RoleRemovedFromUserEvent | 角色移除 | userId, roleId, removedAt, removedBy |
| PrimaryRoleSetEvent | 设置主角色 | userId, roleId, setAt |

### 3.3 用户部门关系聚合（UserDepartment Aggregate）

#### 3.3.1 聚合根：UserDepartment（用户部门关系）

```java
@Entity
@Table(name = "sys_user_dept")
public class UserDepartment extends BaseAggregateRoot<UserDeptId> {
    
    private UserDeptId userDeptId;
    private UserId userId;
    private DeptId deptId;
    private boolean isPrimary;      // 是否主部门
    private LocalDateTime assignedAt;
    
    // 领域方法
    public void changeToPrimary() {
        this.isPrimary = true;
        registerEvent(new PrimaryDepartmentChangedEvent(this.userId, this.deptId));
    }
}
```

---

## 4. 权限管理上下文领域模型

### 4.1 角色聚合（Role Aggregate）

#### 4.1.1 聚合根：Role（角色）

```java
@Entity
@Table(name = "sys_role")
public class Role extends BaseAggregateRoot<RoleId> {
    
    private RoleId roleId;
    private RoleCode roleCode;        // 角色编码
    private RoleName roleName;        // 角色名称
    private String description;       // 描述
    private RoleStatus status;        // 状态
    private boolean isSystem;         // 是否系统预设
    private DataScope dataScope;      // 数据权限范围
    
    // 审计
    private LocalDateTime createdAt;
    private UserId createdBy;
    private LocalDateTime updatedAt;
    private UserId updatedBy;
    
    // 领域方法
    public void assignPermission(PermissionId permissionId) {
        // 检查权限是否已分配
        // 创建角色权限关系
        registerEvent(new PermissionAssignedToRoleEvent(this.roleId, permissionId));
    }
    
    public void revokePermission(PermissionId permissionId) {
        // 移除角色权限关系
        registerEvent(new PermissionRevokedFromRoleEvent(this.roleId, permissionId));
    }
    
    public void setDataScope(DataScope dataScope) {
        this.dataScope = dataScope;
        registerEvent(new RoleDataScopeChangedEvent(this.roleId, dataScope));
    }
}
```

#### 4.1.2 值对象

| 值对象 | 属性 | 校验规则 |
|-------|------|---------|
| RoleId | value: String | UUID格式 |
| RoleCode | value: String | 全局唯一，字母开头，2-50位 |
| RoleName | value: String | 2-50位中文或英文 |
| RoleStatus | value: Enum | ENABLED(启用), DISABLED(禁用) |
| DataScope | value: Enum | ALL(全部), DEPT_AND_CHILD(本部门及子部门), DEPT(本部门), SELF(本人) |

#### 4.1.3 领域事件

| 领域事件 | 触发条件 | 事件属性 |
|---------|---------|---------|
| RoleCreatedEvent | 角色创建 | roleId, roleCode, roleName, createdAt |
| RoleUpdatedEvent | 角色更新 | roleId, updatedFields, updatedAt |
| RoleDeletedEvent | 角色删除 | roleId, deletedAt |
| RoleStatusChangedEvent | 状态变更 | roleId, oldStatus, newStatus, changedAt |
| PermissionAssignedToRoleEvent | 权限分配 | roleId, permissionId, assignedAt |
| PermissionRevokedFromRoleEvent | 权限撤销 | roleId, permissionId, revokedAt |
| RoleDataScopeChangedEvent | 数据范围变更 | roleId, oldScope, newScope, changedAt |

### 4.2 权限聚合（Permission Aggregate）

#### 4.2.1 聚合根：Permission（权限）

```java
@Entity
@Table(name = "sys_permission")
public class Permission extends BaseAggregateRoot<PermissionId> {
    
    private PermissionId permissionId;
    private ResourceType resourceType;    // 资源类型
    private ResourceId resourceId;        // 资源ID
    private OperationType operation;      // 操作类型
    private String description;
    
    // 领域方法
    public boolean implies(Permission other) {
        // 判断当前权限是否包含其他权限
        return this.resourceId.equals(other.resourceId) &&
               this.operation.implies(other.operation);
    }
}
```

#### 4.2.2 值对象

| 值对象 | 属性 | 校验规则 |
|-------|------|---------|
| PermissionId | value: String | UUID格式 |
| ResourceType | value: Enum | MENU(菜单), BUTTON(按钮), API(API接口), DATA(数据) |
| ResourceId | value: String | 资源唯一标识 |
| OperationType | value: Enum | VIEW(查看), CREATE(创建), UPDATE(更新), DELETE(删除), EXPORT(导出) |

### 4.3 角色权限关系聚合（RolePermission Aggregate）

#### 4.3.1 聚合根：RolePermission（角色权限关系）

```java
@Entity
@Table(name = "sys_role_permission")
public class RolePermission extends BaseAggregateRoot<RolePermissionId> {
    
    private RolePermissionId rolePermissionId;
    private RoleId roleId;
    private PermissionId permissionId;
    private LocalDateTime grantedAt;
    private UserId grantedBy;
}
```

---

## 5. 组织管理上下文领域模型

### 5.1 部门聚合（Department Aggregate）

#### 5.1.1 聚合根：Department（部门）

```java
@Entity
@Table(name = "sys_department")
public class Department extends BaseAggregateRoot<DeptId> {
    
    private DeptId deptId;
    private DeptCode deptCode;          // 部门编码
    private DeptName deptName;          // 部门名称
    private DeptId parentId;            // 上级部门ID
    private UserId leaderId;            // 负责人ID
    private String description;
    private int sortOrder;              // 排序号
    private DeptStatus status;          // 状态
    private String treePath;            // 树路径，如：/1/2/5/
    private int treeLevel;              // 树层级
    
    // 审计
    private LocalDateTime createdAt;
    private UserId createdBy;
    private LocalDateTime updatedAt;
    private UserId updatedBy;
    
    // 领域方法
    public void changeParent(DeptId newParentId) {
        // 检查新父部门是否为自己的子部门（避免循环）
        // 更新父部门
        // 重新计算树路径和层级
        this.parentId = newParentId;
        registerEvent(new DepartmentParentChangedEvent(this.deptId, newParentId));
    }
    
    public void setLeader(UserId leaderId) {
        this.leaderId = leaderId;
        registerEvent(new DepartmentLeaderChangedEvent(this.deptId, leaderId));
    }
    
    public void disable() {
        // 检查是否有子部门
        // 检查是否有用户
        this.status = DeptStatus.DISABLED;
        registerEvent(new DepartmentDisabledEvent(this.deptId));
    }
    
    public List<DeptId> getTreePathIds() {
        // 解析treePath获取路径上的所有部门ID
        return Arrays.stream(treePath.split("/"))
                     .filter(s -> !s.isEmpty())
                     .map(DeptId::new)
                     .collect(Collectors.toList());
    }
}
```

#### 5.1.2 值对象

| 值对象 | 属性 | 校验规则 |
|-------|------|---------|
| DeptId | value: String | UUID格式 |
| DeptCode | value: String | 全局唯一，2-50位 |
| DeptName | value: String | 2-50位中文或英文 |
| DeptStatus | value: Enum | ENABLED(启用), DISABLED(禁用) |

#### 5.1.3 领域事件

| 领域事件 | 触发条件 | 事件属性 |
|---------|---------|---------|
| DepartmentCreatedEvent | 部门创建 | deptId, deptCode, deptName, parentId, createdAt |
| DepartmentUpdatedEvent | 部门更新 | deptId, updatedFields, updatedAt |
| DepartmentParentChangedEvent | 父部门变更 | deptId, oldParentId, newParentId, changedAt |
| DepartmentLeaderChangedEvent | 负责人变更 | deptId, oldLeaderId, newLeaderId, changedAt |
| DepartmentDisabledEvent | 部门禁用 | deptId, disabledAt |
| DepartmentDeletedEvent | 部门删除 | deptId, deletedAt |

### 5.2 岗位聚合（Position Aggregate）

#### 5.2.1 聚合根：Position（岗位）

```java
@Entity
@Table(name = "sys_position")
public class Position extends BaseAggregateRoot<PositionId> {
    
    private PositionId positionId;
    private PositionCode positionCode;    // 岗位编码
    private PositionName positionName;    // 岗位名称
    private DeptId deptId;                // 所属部门
    private String description;
    private PositionStatus status;
    
    // 审计
    private LocalDateTime createdAt;
    private UserId createdBy;
}
```

#### 5.2.2 值对象

| 值对象 | 属性 | 校验规则 |
|-------|------|---------|
| PositionId | value: String | UUID格式 |
| PositionCode | value: String | 部门内唯一，2-50位 |
| PositionName | value: String | 2-50位中文或英文 |
| PositionStatus | value: Enum | ENABLED(启用), DISABLED(禁用) |

---

## 6. 认证授权上下文领域模型

### 6.1 认证聚合（Authentication Aggregate）

#### 6.1.1 聚合根：AuthenticationRecord（认证记录）

```java
@Entity
@Table(name = "sys_auth_record")
public class AuthenticationRecord extends BaseAggregateRoot<AuthId> {
    
    private AuthId authId;
    private UserId userId;
    private AuthType authType;          // 认证类型
    private AuthStatus authStatus;      // 认证状态
    private LocalDateTime authTime;     // 认证时间
    private String clientInfo;          // 客户端信息（IP、浏览器、OS等）
    private String failReason;          // 失败原因
    
    // 领域方法
    public static AuthenticationRecord success(UserId userId, AuthType type, String clientInfo) {
        AuthenticationRecord record = new AuthenticationRecord();
        record.userId = userId;
        record.authType = type;
        record.authStatus = AuthStatus.SUCCESS;
        record.authTime = LocalDateTime.now();
        record.clientInfo = clientInfo;
        record.registerEvent(new AuthenticationSuccessEvent(userId, type, record.authTime));
        return record;
    }
    
    public static AuthenticationRecord failure(String username, AuthType type, String clientInfo, String failReason) {
        AuthenticationRecord record = new AuthenticationRecord();
        record.authType = type;
        record.authStatus = AuthStatus.FAILED;
        record.authTime = LocalDateTime.now();
        record.clientInfo = clientInfo;
        record.failReason = failReason;
        record.registerEvent(new AuthenticationFailedEvent(username, type, record.authTime, failReason));
        return record;
    }
}
```

#### 6.1.2 值对象

| 值对象 | 属性 | 校验规则 |
|-------|------|---------|
| AuthId | value: String | UUID格式 |
| AuthType | value: Enum | PASSWORD(密码), SMS(短信), EMAIL(邮箱), OAUTH(OAuth), MFA(多因素) |
| AuthStatus | value: Enum | SUCCESS(成功), FAILED(失败) |

### 6.2 Token聚合（Token Aggregate）

#### 6.2.1 聚合根：Token（令牌）

```java
@Entity
@Table(name = "sys_token")
public class Token extends BaseAggregateRoot<TokenId> {
    
    private TokenId tokenId;
    private UserId userId;
    private AccessToken accessToken;        // 访问令牌
    private RefreshToken refreshToken;      // 刷新令牌
    private LocalDateTime accessTokenExpiresAt;   // Access Token过期时间
    private LocalDateTime refreshTokenExpiresAt;  // Refresh Token过期时间
    private TokenStatus status;             // 令牌状态
    private String clientInfo;
    private LocalDateTime createdAt;
    
    // 领域方法
    public static Token create(UserId userId, String clientInfo) {
        Token token = new Token();
        token.userId = userId;
        token.accessToken = AccessToken.generate();
        token.refreshToken = RefreshToken.generate();
        token.accessTokenExpiresAt = LocalDateTime.now().plusHours(2);
        token.refreshTokenExpiresAt = LocalDateTime.now().plusDays(7);
        token.status = TokenStatus.ACTIVE;
        token.clientInfo = clientInfo;
        token.createdAt = LocalDateTime.now();
        token.registerEvent(new TokenCreatedEvent(userId, token.accessToken, token.createdAt));
        return token;
    }
    
    public Token refresh() {
        // 验证Refresh Token是否过期
        if (LocalDateTime.now().isAfter(refreshTokenExpiresAt)) {
            throw new TokenExpiredException("Refresh token expired");
        }
        
        // 生成新的Token
        this.accessToken = AccessToken.generate();
        this.accessTokenExpiresAt = LocalDateTime.now().plusHours(2);
        registerEvent(new TokenRefreshedEvent(this.userId, this.accessToken, LocalDateTime.now()));
        return this;
    }
    
    public void revoke() {
        this.status = TokenStatus.REVOKED;
        registerEvent(new TokenRevokedEvent(this.userId, this.accessToken, LocalDateTime.now()));
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(accessTokenExpiresAt);
    }
}
```

#### 6.2.2 值对象

| 值对象 | 属性 | 校验规则 |
|-------|------|---------|
| TokenId | value: String | UUID格式 |
| AccessToken | value: String | JWT格式，包含userId, exp, iat等claims |
| RefreshToken | value: String | 随机字符串，长度32位 |
| TokenStatus | value: Enum | ACTIVE(有效), EXPIRED(过期), REVOKED(撤销) |

---

## 7. 领域服务设计

### 7.1 用户管理领域服务

#### 7.1.1 UserDomainService

```java
@Service
public class UserDomainService {
    
    @Autowired
    private UserMapper userMapper;  // MyBatis Plus Mapper
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * 创建用户
     */
    public User createUser(CreateUserCommand command) {
        // 检查用户名唯一性
        if (userMapper.selectCountByUsername(command.getUsername()) > 0) {
            throw new DuplicateUsernameException("Username already exists");
        }
        
        // 检查邮箱唯一性
        if (userMapper.selectCountByEmail(command.getEmail()) > 0) {
            throw new DuplicateEmailException("Email already exists");
        }
        
        // 创建用户
        User user = User.builder()
            .userId(UserId.generate())
            .username(new Username(command.getUsername()))
            .realName(new RealName(command.getRealName()))
            .email(new Email(command.getEmail()))
            .phone(new Phone(command.getPhone()))
            .password(Password.encode(command.getInitialPassword(), passwordEncoder))
            .primaryDeptId(new DeptId(command.getDeptId()))
            .status(UserStatus.ENABLED)
            .build();
        
        userMapper.insert(user);
        return user;
    }
    
    /**
     * 批量导入用户
     */
    public UserImportResult importUsers(List<ImportUserCommand> commands) {
        // 数据校验
        // 批量创建
        // 返回导入结果
    }
    
    /**
     * 同步员工信息
     */
    public void syncEmployeeInfo(UserId userId, EmployeeSyncInfo syncInfo) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        
        // 更新员工信息
        user.updateEmployeeInfo(syncInfo);
        userMapper.updateById(user);
    }
}
```

### 7.2 权限管理领域服务

#### 7.2.1 PermissionDomainService

```java
@Service
public class PermissionDomainService {
    
    @Autowired
    private RoleMapper roleMapper;  // MyBatis Plus Mapper
    
    @Autowired
    private UserMapper userMapper;  // MyBatis Plus Mapper
    
    /**
     * 检查用户是否有权限
     */
    public boolean hasPermission(UserId userId, Permission permission) {
        // 获取用户所有角色
        List<Role> roles = roleMapper.selectByUserId(userId);
        
        // 检查任一角色是否有权限
        return roles.stream()
            .anyMatch(role -> role.hasPermission(permission));
    }
    
    /**
     * 获取用户数据权限范围
     */
    public DataScope getUserDataScope(UserId userId) {
        List<Role> roles = roleMapper.selectByUserId(userId);
        
        // 取最大权限范围
        return roles.stream()
            .map(Role::getDataScope)
            .max(Comparator.comparingInt(DataScope::getPriority))
            .orElse(DataScope.SELF);
    }
    
    /**
     * 分配角色给用户
     */
    public void assignRoleToUser(UserId userId, RoleId roleId, boolean isPrimary) {
        // 创建用户角色关系
        // 如果是主角色，取消其他主角色
        // 发布领域事件
    }
}
```

### 7.3 认证授权领域服务

#### 7.3.1 AuthenticationDomainService

```java
@Service
public class AuthenticationDomainService {
    
    @Autowired
    private UserMapper userMapper;  // MyBatis Plus Mapper
    
    @Autowired
    private TokenMapper tokenMapper;  // MyBatis Plus Mapper
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private LoginAttemptCache loginAttemptCache;
    
    /**
     * 用户登录
     */
    public Token authenticate(LoginCommand command) {
        // 检查登录失败次数
        if (loginAttemptCache.isLocked(command.getUsername())) {
            throw new AccountLockedException("Account locked due to too many failed attempts");
        }
        
        // 查找用户
        User user = userMapper.selectByUsername(command.getUsername());
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        
        // 检查用户状态
        if (user.getStatus() != UserStatus.ENABLED) {
            throw new AccountDisabledException("Account disabled");
        }
        
        // 验证密码
        if (!passwordEncoder.matches(command.getPassword(), user.getPassword().getValue())) {
            loginAttemptCache.recordFailedAttempt(command.getUsername());
            AuthenticationRecord.failure(command.getUsername(), AuthType.PASSWORD, 
                command.getClientInfo(), "Invalid password");
            throw new InvalidPasswordException("Invalid password");
        }
        
        // 清除登录失败记录
        loginAttemptCache.clearAttempts(command.getUsername());
        
        // 记录认证成功
        AuthenticationRecord.success(user.getUserId(), AuthType.PASSWORD, command.getClientInfo());
        
        // 创建Token
        Token token = Token.create(user.getUserId(), command.getClientInfo());
        tokenMapper.insert(token);
        
        return token;
    }
    
    /**
     * 刷新Token
     */
    public Token refreshToken(String refreshToken) {
        Token token = tokenMapper.selectByRefreshToken(refreshToken);
        if (token == null) {
            throw new TokenNotFoundException("Token not found");
        }
        
        token.refresh();
        tokenMapper.updateById(token);
        
        return token;
    }
    
    /**
     * 撤销Token
     */
    public void revokeToken(String accessToken) {
        Token token = tokenMapper.selectByAccessToken(accessToken);
        if (token == null) {
            throw new TokenNotFoundException("Token not found");
        }
        
        token.revoke();
        tokenMapper.updateById(token);
    }
}
```

---

## 7. 系统配置上下文领域模型

### 7.1 配置聚合（Config Aggregate）

#### 7.1.1 聚合根：Config（配置）

```java
@Entity
@Table(name = "sys_config")
public class Config extends BaseAggregateRoot<ConfigId> {
    
    private ConfigId configId;
    private ConfigKey configKey;          // 配置键
    private ConfigValue configValue;      // 配置值
    private ConfigType configType;        // 配置类型
    private String description;           // 描述
    private boolean isEncrypted;          // 是否加密
    private GroupId groupId;              // 分组ID
    private int sortOrder;                // 排序号
    private boolean isSystem;             // 是否系统预设
    
    // 审计
    private LocalDateTime createdAt;
    private UserId createdBy;
    private LocalDateTime updatedAt;
    private UserId updatedBy;
    
    // 领域方法
    public void updateValue(ConfigValue newValue) {
        // 校验值类型
        validateValueType(newValue);
        
        // 如需要加密则加密存储
        if (this.isEncrypted) {
            newValue = encryptValue(newValue);
        }
        
        this.configValue = newValue;
        this.updatedAt = LocalDateTime.now();
        registerEvent(new ConfigUpdatedEvent(this.configId, this.configKey, newValue));
    }
    
    public ConfigValue getDecryptedValue() {
        if (this.isEncrypted) {
            return decryptValue(this.configValue);
        }
        return this.configValue;
    }
    
    private void validateValueType(ConfigValue value) {
        switch (this.configType) {
            case NUMBER:
                // 验证是否为数字
                break;
            case BOOLEAN:
                // 验证是否为布尔值
                break;
            case JSON:
                // 验证是否为有效JSON
                break;
            default:
                // STRING类型无需验证
        }
    }
}
```

#### 7.1.2 值对象

| 值对象 | 属性 | 校验规则 |
|-------|------|---------|
| ConfigId | value: String | UUID格式 |
| ConfigKey | value: String | 全局唯一，格式：category.subcategory.name，如web.system.name |
| ConfigValue | value: String | 根据configType进行格式校验 |
| ConfigType | value: Enum | STRING(字符串), NUMBER(数字), BOOLEAN(布尔), JSON(JSON对象) |
| GroupId | value: String | 引用配置分组 |

#### 7.1.3 配置键命名规范

```
配置键格式：{category}.{subcategory}.{name}

分类说明：
├── web.*          # Web端展示配置
│   ├── web.system.*    # 系统基本信息
│   ├── web.login.*     # 登录页配置
│   ├── web.footer.*    # 页脚配置
│   ├── web.theme.*     # 主题配置
│   ├── web.locale.*    # 国际化配置
│   └── web.watermark.* # 水印配置
│
├── biz.*          # 商务信息配置
│   ├── biz.company.*   # 企业信息
│   ├── biz.legal.*     # 法人信息
│   ├── biz.address.*   # 地址信息
│   ├── biz.contact.*   # 联系信息
│   ├── biz.bank.*      # 银行信息
│   ├── biz.contract.*  # 合同配置
│   └── biz.invoice.*   # 发票信息
│
└── sys.*          # 系统参数配置
    ├── sys.security.*  # 安全配置
    ├── sys.upload.*    # 上传配置
    ├── sys.backup.*    # 备份配置
    └── sys.log.*       # 日志配置
```

#### 7.1.4 领域事件

| 领域事件 | 触发条件 | 事件属性 |
|---------|---------|---------|
| ConfigCreatedEvent | 配置创建 | configId, configKey, configType, createdAt |
| ConfigUpdatedEvent | 配置更新 | configId, configKey, oldValue, newValue, updatedAt |
| ConfigDeletedEvent | 配置删除 | configId, configKey, deletedAt |
| ConfigCacheRefreshedEvent | 配置缓存刷新 | configKey, refreshedAt |

### 7.2 配置分组聚合（ConfigGroup Aggregate）

#### 7.2.1 聚合根：ConfigGroup（配置分组）

```java
@Entity
@Table(name = "sys_config_group")
public class ConfigGroup extends BaseAggregateRoot<GroupId> {
    
    private GroupId groupId;
    private GroupCode groupCode;      // 分组编码
    private GroupName groupName;      // 分组名称
    private String description;       // 描述
    private String icon;              // 分组图标
    private int sortOrder;            // 排序号
    
    // 审计
    private LocalDateTime createdAt;
    private UserId createdBy;
}
```

#### 7.2.2 值对象

| 值对象 | 属性 | 校验规则 |
|-------|------|---------|
| GroupId | value: String | UUID格式 |
| GroupCode | value: String | 全局唯一，如：web、biz、sys |
| GroupName | value: String | 2-50位中文或英文 |

### 7.3 系统配置领域服务

#### 7.3.1 ConfigDomainService

```java
@Service
public class ConfigDomainService {
    
    @Autowired
    private ConfigMapper configMapper;  // MyBatis Plus Mapper
    
    @Autowired
    private ConfigGroupMapper configGroupMapper;
    
    @Autowired
    private ConfigCacheManager cacheManager;
    
    /**
     * 获取配置值
     */
    public ConfigValue getConfigValue(ConfigKey key) {
        // 先从缓存获取
        ConfigValue cached = cacheManager.get(key);
        if (cached != null) {
            return cached;
        }
        
        // 从数据库获取
        Config config = configMapper.selectByKey(key);
        if (config == null) {
            throw new ConfigNotFoundException("Config not found: " + key);
        }
        
        ConfigValue value = config.getDecryptedValue();
        
        // 放入缓存
        cacheManager.put(key, value);
        
        return value;
    }
    
    /**
     * 获取Web配置（按分组）
     */
    public Map<String, ConfigValue> getWebConfigs() {
        List<Config> configs = configMapper.selectByGroupPrefix("web");
        return configs.stream()
            .collect(Collectors.toMap(
                c -> c.getConfigKey().getValue(),
                Config::getDecryptedValue
            ));
    }
    
    /**
     * 获取商务配置
     */
    public BusinessConfigDTO getBusinessConfig() {
        List<Config> configs = configMapper.selectByGroupPrefix("biz");
        
        BusinessConfigDTO dto = new BusinessConfigDTO();
        configs.forEach(config -> {
            String key = config.getConfigKey().getValue();
            ConfigValue value = config.getDecryptedValue();
            
            switch (key) {
                case "biz.company.name":
                    dto.setCompanyName(value.getValue());
                    break;
                case "biz.company.creditCode":
                    dto.setCreditCode(value.getValue());
                    break;
                case "biz.legal.representative":
                    dto.setLegalRepresentative(value.getValue());
                    break;
                // ... 其他字段映射
            }
        });
        
        return dto;
    }
    
    /**
     * 批量更新配置
     */
    @Transactional
    public void batchUpdateConfigs(Map<ConfigKey, ConfigValue> configMap, UserId operator) {
        configMap.forEach((key, value) -> {
            Config config = configMapper.selectByKey(key);
            if (config != null) {
                config.updateValue(value);
                config.setUpdatedBy(operator);
                config.setUpdatedAt(LocalDateTime.now());
                configMapper.updateById(config);
            }
        });
        
        // 刷新缓存
        cacheManager.refreshBatch(configMap.keySet());
    }
    
    /**
     * 初始化系统默认配置
     */
    @Transactional
    public void initDefaultConfigs() {
        // Web端默认配置
        createConfigIfNotExists("web.system.name", "System基础平台", ConfigType.STRING, "web");
        createConfigIfNotExists("web.login.title", "欢迎登录", ConfigType.STRING, "web");
        createConfigIfNotExists("web.theme.primaryColor", "#1890ff", ConfigType.STRING, "web");
        createConfigIfNotExists("web.locale.default", "zh-CN", ConfigType.STRING, "web");
        
        // 系统安全默认配置
        createConfigIfNotExists("sys.security.passwordExpireDays", "90", ConfigType.NUMBER, "sys");
        createConfigIfNotExists("sys.security.maxLoginAttempts", "5", ConfigType.NUMBER, "sys");
        createConfigIfNotExists("sys.security.lockDuration", "30", ConfigType.NUMBER, "sys");
        createConfigIfNotExists("sys.security.sessionTimeout", "30", ConfigType.NUMBER, "sys");
        createConfigIfNotExists("sys.security.tokenExpireHours", "2", ConfigType.NUMBER, "sys");
    }
    
    private void createConfigIfNotExists(String key, String value, ConfigType type, String groupCode) {
        if (configMapper.selectByKey(new ConfigKey(key)) == null) {
            ConfigGroup group = configGroupMapper.selectByCode(groupCode);
            
            Config config = Config.builder()
                .configId(ConfigId.generate())
                .configKey(new ConfigKey(key))
                .configValue(new ConfigValue(value))
                .configType(type)
                .groupId(group != null ? group.getGroupId() : null)
                .isSystem(true)
                .build();
            
            configMapper.insert(config);
        }
    }
}
```

---

## 8. 领域事件处理

### 8.1 事件发布与订阅

```java
// 事件发布
public class DomainEventPublisher {
    
    @Autowired
    private ApplicationEventPublisher publisher;
    
    public void publish(DomainEvent event) {
        publisher.publishEvent(event);
    }
}

// 事件订阅示例
@Component
public class UserEventHandler {
    
    @Autowired
    private TokenMapper tokenMapper;  // MyBatis Plus Mapper
    
    @Autowired
    private AuditLogService auditLogService;
    
    /**
     * 用户禁用事件处理
     */
    @EventListener
    public void onUserDisabled(UserDisabledEvent event) {
        // 撤销该用户的所有Token
        List<Token> tokens = tokenMapper.selectByUserIdAndStatus(event.getUserId(), TokenStatus.ACTIVE);
        tokens.forEach(Token::revoke);
        tokens.forEach(tokenMapper::updateById);
        
        // 记录审计日志
        auditLogService.logOperation("USER_DISABLED", event.getUserId(), null, null);
    }
    
    /**
     * 员工关联事件处理
     */
    @EventListener
    public void onEmployeeLinked(EmployeeLinkedEvent event) {
        // 同步员工信息
        // 发送通知
    }
}
```

---

## 9. 附录

### 9.1 实体关系图（ER图）

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            实体关系图（简化版）                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐        │
│  │    User      │1       *│  UserRole    │*       1│     Role     │        │
│  │    用户      │────────►│  用户角色关系 │◄────────│     角色     │        │
│  │              │         │              │         │              │        │
│  │  PK: user_id │         │  PK: id      │         │  PK: role_id │        │
│  │  FK: dept_id │         │  FK: user_id │         │  FK: data_   │        │
│  │  FK: emp_no  │         │  FK: role_id │         │      scope   │        │
│  └──────┬───────┘         └──────────────┘         └──────┬───────┘        │
│         │                                                 │                │
│         │1                                               *│                │
│         │                                                 │                │
│         ▼                                                 ▼                │
│  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐        │
│  │ Department   │1       *│  UserDept    │*       1│RolePermission│        │
│  │    部门      │◄────────│  用户部门关系 │────────►│  角色权限关系 │        │
│  │              │         │              │         │              │        │
│  │  PK: dept_id │         │  PK: id      │         │  PK: id      │        │
│  │  FK: parent  │         │  FK: user_id │         │  FK: role_id │        │
│  └──────────────┘         │  FK: dept_id │         │  FK: perm_id │        │
│                           └──────────────┘         └──────┬───────┘        │
│                                                           │                │
│                                                           *                │
│                                                           │                │
│                                                           ▼                │
│                                                  ┌──────────────┐          │
│                                                  │  Permission  │          │
│                                                  │    权限      │          │
│                                                  │              │          │
│                                                  │  PK: perm_id │          │
│                                                  └──────────────┘          │
│                                                                             │
│  ┌──────────────┐         ┌──────────────┐                                  │
│  │    Token     │*       1│    User      │                                  │
│  │    令牌      │◄────────│    用户      │                                  │
│  │              │         │              │                                  │
│  │  PK: token_id│         │              │                                  │
│  │  FK: user_id │         │              │                                  │
│  └──────────────┘         └──────────────┘                                  │
│                                                                             │
│  ┌──────────────┐         ┌──────────────┐                                  │
│  │ ConfigGroup  │1       *│    Config    │                                  │
│  │  配置分组    │◄────────│    配置      │                                  │
│  │              │         │              │                                  │
│  │  PK: group_id│         │  PK: config  │                                  │
│  │  group_code  │         │  FK: group_id│                                  │
│  │  group_name  │         │  config_key  │                                  │
│  └──────────────┘         │  config_value│                                  │
│                           └──────────────┘                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 修订记录

| 版本 | 日期 | 修订人 | 修订内容 |
|-----|------|-------|---------|
| 1.0 | 2026-03-08 | 架构师 | 初始版本 |

---

**文档编制**：架构师  
**文档审核**：技术负责人  
**编制日期**：2026-03-08
