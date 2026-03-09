# 服务划分设计

> **文档编号**: SYS-DES-ARCH-SVC-001  
> **版本**: 1.0  
> **创建日期**: 2026-03-08  
> **作者**: 架构师  
> **状态**: ✅ 已完成

---

## 1. 概述

### 1.1 目的

本文档定义System平台的服务划分设计，基于DDD领域驱动设计原则，合理划分服务边界，避免微服务划分过小，采用适度聚合的服务设计策略。

### 1.2 设计原则

1. **单一职责**：每个服务有明确的业务职责
2. **高内聚低耦合**：服务内部高内聚，服务间低耦合
3. **适度聚合**：避免微服务划分过小，相关功能适度聚合
4. **领域边界**：基于DDD领域边界划分服务
5. **独立部署**：每个服务可独立开发、测试、部署

### 1.3 服务划分策略

根据用户要求，将用户中心、认证授权、组织架构合并为**System服务**，避免微服务划分过小。

---

## 2. 服务架构总览

```
┌─────────────────────────────────────────────────────────────┐
│                    System平台服务架构                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    网关层 (Gateway)                  │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  • 路由转发                                  │   │   │
│  │  │  • 认证鉴权                                  │   │   │
│  │  │  • 限流熔断                                  │   │   │
│  │  │  • 日志记录                                  │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────┬───────────────────────────┘   │
│                            │                               │
│                            ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    核心域服务                        │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │                   System服务                 │   │   │
│  │  │  ┌─────────────┐ ┌─────────────┐ ┌─────────┐│   │   │
│  │  │  │   用户管理   │ │   权限管理   │ │ 组织架构││   │   │
│  │  │  │  (User)     │ │  (Auth)     │ │  (Org)  ││   │   │
│  │  │  └─────────────┘ └─────────────┘ └─────────┘│   │   │
│  │  │  ┌─────────────┐ ┌─────────────┐ ┌─────────┐│   │   │
│  │  │  │   员工管理   │ │   认证授权   │ │ 系统配置││   │   │
│  │  │  │  (Employee) │ │  (OAuth2)   │ │ (Config)││   │   │
│  │  │  └─────────────┘ └─────────────┘ └─────────┘│   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────┬───────────────────────────┘   │
│                            │                               │
│                            ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    支撑域服务                        │   │
│  │  ┌─────────────┐ ┌─────────────┐                   │   │
│  │  │  审计日志   │ │  通知服务   │                   │   │
│  │  │  (Audit)    │ │  (Notify)   │                   │   │
│  │  └─────────────┘ └─────────────┘                   │   │
│  └─────────────────────────┬───────────────────────────┘   │
│                            │                               │
│                            ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    通用域服务                        │   │
│  │  ┌─────────────┐ ┌─────────────┐                   │   │
│  │  │   文件服务   │ │   消息服务   │                   │   │
│  │  │  (File)     │ │  (Message)  │                   │   │
│  │  └─────────────┘ └─────────────┘                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 核心域服务 - System服务

### 3.1 服务定位

**服务名称**: System服务  
**服务职责**: 用户管理、员工管理、认证授权、权限管理、组织架构管理、系统配置管理  
**服务类型**: 核心域服务  
**部署方式**: 多实例部署（至少3个副本）

### 3.2 模块划分

```
┌─────────────────────────────────────────────────────────────┐
│                    System服务模块结构                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  linsir-system/                                             │
│  ├── src/main/java/com/linsir/system/                       │
│  │   ├── user/                    # 用户管理模块             │
│  │   │   ├── controller/                                     │
│  │   │   ├── service/                                        │
│  │   │   ├── mapper/                                         │
│  │   │   └── entity/                                         │
│  │   ├── employee/                # 员工管理模块             │
│  │   │   ├── controller/                                     │
│  │   │   ├── service/                                        │
│  │   │   ├── mapper/                                         │
│  │   │   └── entity/                                         │
│  │   ├── auth/                    # 认证授权模块             │
│  │   │   ├── controller/                                     │
│  │   │   ├── service/                                        │
│  │   │   ├── security/                                       │
│  │   │   └── jwt/                                            │
│  │   ├── permission/              # 权限管理模块             │
│  │   │   ├── controller/                                     │
│  │   │   ├── service/                                        │
│  │   │   └── rbac/                                           │
│  │   ├── organization/            # 组织架构模块             │
│  │   │   ├── controller/                                     │
│  │   │   ├── service/                                        │
│  │   │   ├── mapper/                                         │
│  │   │   └── entity/                                         │
│  │   └── config/                  # 系统配置模块             │
│  │       ├── controller/                                     │
│  │       ├── service/                                        │
│  │       ├── mapper/                                         │
│  │       └── entity/                                         │
│  └── src/main/resources/                                    │
│      ├── mapper/                                            │
│      └── application.yml                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 用户管理模块

#### 3.3.1 职责定义

| 功能 | 说明 |
|-----|------|
| 用户CRUD | 用户的增删改查 |
| 用户状态 | 启用/禁用/锁定 |
| 密码管理 | 密码修改、重置 |
| 用户绑定 | 绑定员工、绑定角色 |
| 用户导入导出 | Excel导入导出 |

#### 3.3.2 核心实体

```java
@Data
@TableName("sys_user")
public class User {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String username;
    private String password;
    
    @Encrypted
    private String email;
    
    @Encrypted
    private String phone;
    
    private String nickname;
    private String avatar;
    
    private Integer status;  // 0禁用 1启用 2锁定
    
    private Long employeeId;  // 关联员工
    
    private LocalDateTime lastLoginTime;
    private String lastLoginIp;
    
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    
    @TableLogic
    private Integer deleted;
}
```

#### 3.3.3 API接口

| 接口 | 方法 | 路径 | 权限 |
|-----|------|------|------|
| 用户列表 | GET | /api/system/users | user:read |
| 用户详情 | GET | /api/system/users/{id} | user:read |
| 创建用户 | POST | /api/system/users | user:create |
| 更新用户 | PUT | /api/system/users/{id} | user:update |
| 删除用户 | DELETE | /api/system/users/{id} | user:delete |
| 重置密码 | PUT | /api/system/users/{id}/password/reset | user:resetPwd |
| 修改状态 | PUT | /api/system/users/{id}/status | user:updateStatus |
| 分配角色 | PUT | /api/system/users/{id}/roles | user:assignRole |

### 3.4 员工管理模块

#### 3.4.1 职责定义

| 功能 | 说明 |
|-----|------|
| 员工CRUD | 员工的增删改查 |
| 入职离职 | 入职办理、离职办理 |
| 部门调动 | 部门变更记录 |
| 员工查询 | 按部门、岗位查询 |
| 员工统计 | 在职人数、离职率等 |

#### 3.4.2 核心实体

```java
@Data
@TableName("sys_employee")
public class Employee {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String employeeNo;  // 工号
    private String name;
    
    @Encrypted
    private String idCard;      // 身份证号
    
    @Encrypted
    private String phone;
    
    @Encrypted
    private String email;
    
    private Long deptId;        // 部门ID
    private Long positionId;    // 岗位ID
    
    private Integer gender;
    private LocalDate birthday;
    private LocalDate entryDate;   // 入职日期
    private LocalDate leaveDate;   // 离职日期
    
    private Integer status;     // 0离职 1在职 2试用期
    
    private Long userId;        // 关联用户
    
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    
    @TableLogic
    private Integer deleted;
}
```

#### 3.4.3 API接口

| 接口 | 方法 | 路径 | 权限 |
|-----|------|------|------|
| 员工列表 | GET | /api/system/employees | employee:read |
| 员工详情 | GET | /api/system/employees/{id} | employee:read |
| 创建员工 | POST | /api/system/employees | employee:create |
| 更新员工 | PUT | /api/system/employees/{id} | employee:update |
| 删除员工 | DELETE | /api/system/employees/{id} | employee:delete |
| 办理离职 | PUT | /api/system/employees/{id}/leave | employee:leave |
| 部门调动 | PUT | /api/system/employees/{id}/transfer | employee:transfer |
| 绑定用户 | PUT | /api/system/employees/{id}/bind-user | employee:bindUser |

### 3.5 认证授权模块

#### 3.5.1 职责定义

| 功能 | 说明 |
|-----|------|
| 用户认证 | 登录、登出、Token刷新 |
| Token管理 | JWT签发、验证、吊销 |
| 会话管理 | 会话创建、销毁、查询 |
| 登录安全 | 验证码、登录锁定、IP限制 |

#### 3.5.2 核心代码

```java
@RestController
@RequestMapping("/api/system/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * 用户登录
     */
    @PostMapping("/login")
    public Result<LoginVO> login(@RequestBody @Valid LoginDTO dto) {
        LoginVO vo = authService.login(dto);
        return Result.success(vo);
    }
    
    /**
     * Token刷新
     */
    @PostMapping("/refresh")
    public Result<TokenVO> refreshToken(@CookieValue("refreshToken") String refreshToken) {
        TokenVO vo = authService.refreshToken(refreshToken);
        return Result.success(vo);
    }
    
    /**
     * 用户登出
     */
    @PostMapping("/logout")
    public Result<Void> logout() {
        authService.logout();
        return Result.success();
    }
    
    /**
     * 获取当前用户信息
     */
    @GetMapping("/me")
    public Result<UserInfoVO> getCurrentUser() {
        UserInfoVO vo = authService.getCurrentUser();
        return Result.success(vo);
    }
}
```

#### 3.5.3 API接口

| 接口 | 方法 | 路径 | 说明 |
|-----|------|------|------|
| 用户登录 | POST | /api/system/auth/login | 无需认证 |
| Token刷新 | POST | /api/system/auth/refresh | 无需认证（需Cookie） |
| 用户登出 | POST | /api/system/auth/logout | 需认证 |
| 当前用户 | GET | /api/system/auth/me | 需认证 |
| 修改密码 | PUT | /api/system/auth/password | 需认证 |
| 获取验证码 | GET | /api/system/auth/captcha | 无需认证 |

### 3.6 权限管理模块

#### 3.6.1 职责定义

| 功能 | 说明 |
|-----|------|
| 角色管理 | 角色的增删改查 |
| 权限管理 | 菜单权限、按钮权限、接口权限 |
| 角色授权 | 为角色分配权限 |
| 用户授权 | 为用户分配角色 |
| 数据权限 | 数据范围配置 |

#### 3.6.2 核心实体

```java
@Data
@TableName("sys_role")
public class Role {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String roleCode;    // 角色编码
    private String roleName;    // 角色名称
    private String description; // 描述
    
    private Integer dataScope;  // 数据范围：1全部 2本部门 3本部门及子部门 4仅本人
    
    private Integer status;     // 0禁用 1启用
    
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    
    @TableLogic
    private Integer deleted;
}

@Data
@TableName("sys_permission")
public class Permission {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String permCode;    // 权限编码
    private String permName;    // 权限名称
    private Integer type;       // 1菜单 2按钮 3接口
    
    private Long parentId;      // 父权限ID
    private String path;        // 路由路径/接口路径
    private String component;   // 组件路径
    private String icon;        // 图标
    private Integer sort;       // 排序
    
    private Integer status;     // 0禁用 1启用
}
```

#### 3.6.3 API接口

| 接口 | 方法 | 路径 | 权限 |
|-----|------|------|------|
| 角色列表 | GET | /api/system/roles | role:read |
| 创建角色 | POST | /api/system/roles | role:create |
| 更新角色 | PUT | /api/system/roles/{id} | role:update |
| 删除角色 | DELETE | /api/system/roles/{id} | role:delete |
| 分配权限 | PUT | /api/system/roles/{id}/permissions | role:assignPerm |
| 权限列表 | GET | /api/system/permissions | permission:read |
| 创建权限 | POST | /api/system/permissions | permission:create |
| 更新权限 | PUT | /api/system/permissions/{id} | permission:update |
| 删除权限 | DELETE | /api/system/permissions/{id} | permission:delete |

### 3.7 组织架构模块

#### 3.7.1 职责定义

| 功能 | 说明 |
|-----|------|
| 部门管理 | 部门的增删改查 |
| 岗位管理 | 岗位的增删改查 |
| 组织架构树 | 部门树形结构 |
| 部门统计 | 部门人数统计 |

#### 3.7.2 核心实体

```java
@Data
@TableName("sys_dept")
public class Dept {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String deptCode;    // 部门编码
    private String deptName;    // 部门名称
    private String description; // 描述
    
    private Long parentId;      // 父部门ID
    private String ancestors;   // 祖先ID路径
    private Integer level;      // 层级
    
    private String leader;      // 负责人
    private String phone;
    private String email;
    
    private Integer sort;       // 排序
    private Integer status;     // 0禁用 1启用
    
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    
    @TableLogic
    private Integer deleted;
}

@Data
@TableName("sys_position")
public class Position {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String positionCode;  // 岗位编码
    private String positionName;  // 岗位名称
    private Integer level;        // 岗位级别
    
    private Integer sort;
    private Integer status;
    
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    
    @TableLogic
    private Integer deleted;
}
```

#### 3.7.3 API接口

| 接口 | 方法 | 路径 | 权限 |
|-----|------|------|------|
| 部门树 | GET | /api/system/depts/tree | dept:read |
| 部门列表 | GET | /api/system/depts | dept:read |
| 创建部门 | POST | /api/system/depts | dept:create |
| 更新部门 | PUT | /api/system/depts/{id} | dept:update |
| 删除部门 | DELETE | /api/system/depts/{id} | dept:delete |
| 岗位列表 | GET | /api/system/positions | position:read |
| 创建岗位 | POST | /api/system/positions | position:create |
| 更新岗位 | PUT | /api/system/positions/{id} | position:update |
| 删除岗位 | DELETE | /api/system/positions/{id} | position:delete |

### 3.8 系统配置模块

#### 3.8.1 职责定义

| 功能 | 说明 |
|-----|------|
| 配置项管理 | 系统配置项的增删改查 |
| 配置分类 | Web配置、商务配置、业务配置 |
| 配置缓存 | Redis缓存配置值 |
| 配置热更新 | 配置变更实时生效 |
| 配置导入导出 | Excel导入导出配置 |

#### 3.8.2 配置分类

| 分类 | 配置项示例 |
|-----|-----------|
| Web配置 | 系统名称、Logo、域名、主题色、版权信息 |
| 商务配置 | 公司名称、法人、地址、联系方式、营业执照 |
| 业务配置 | 密码策略、登录策略、文件上传限制、会话超时时间 |

#### 3.8.3 核心实体

```java
@Data
@TableName("sys_config")
public class Config {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String configKey;       // 配置键
    private String configValue;     // 配置值
    private String configName;      // 配置名称
    private String description;     // 配置说明
    
    private String category;        // 配置分类：web、business、system
    private String dataType;        // 数据类型：string、int、boolean、json
    
    private Boolean isSystem;       // 是否系统内置
    private Boolean isEncrypted;    // 是否加密存储
    
    private Integer sort;           // 排序
    private Integer status;         // 0禁用 1启用
    
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    
    @TableLogic
    private Integer deleted;
}
```

#### 3.8.4 API接口

| 接口 | 方法 | 路径 | 权限 |
|-----|------|------|------|
| 配置列表 | GET | /api/system/configs | config:read |
| 配置详情 | GET | /api/system/configs/{id} | config:read |
| 获取配置值 | GET | /api/system/configs/value/{key} | 无需权限（前端使用） |
| 批量获取配置 | GET | /api/system/configs/values | 无需权限（前端使用） |
| 创建配置 | POST | /api/system/configs | config:create |
| 更新配置 | PUT | /api/system/configs/{id} | config:update |
| 删除配置 | DELETE | /api/system/configs/{id} | config:delete |
| 刷新缓存 | POST | /api/system/configs/refresh-cache | config:refresh |

#### 3.8.5 配置服务类

```java
@Service
@Slf4j
public class ConfigService {
    
    @Autowired
    private ConfigMapper configMapper;
    
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    private static final String CONFIG_CACHE_PREFIX = "config:";
    private static final long CONFIG_CACHE_TTL = 3600; // 1小时
    
    /**
     * 获取配置值（带缓存）
     */
    public String getConfigValue(String key) {
        // 先从缓存获取
        String cacheKey = CONFIG_CACHE_PREFIX + key;
        String value = redisTemplate.opsForValue().get(cacheKey);
        
        if (StrUtil.isNotBlank(value)) {
            return value;
        }
        
        // 缓存未命中，从数据库获取
        Config config = configMapper.selectByKey(key);
        if (config == null || config.getStatus() != 1) {
            return null;
        }
        
        value = config.getConfigValue();
        
        // 解密（如果是加密配置）
        if (Boolean.TRUE.equals(config.getIsEncrypted())) {
            value = decryptValue(value);
        }
        
        // 写入缓存
        redisTemplate.opsForValue().set(cacheKey, value, CONFIG_CACHE_TTL, TimeUnit.SECONDS);
        
        return value;
    }
    
    /**
     * 更新配置
     */
    @Transactional
    public void updateConfig(Long id, String value) {
        Config config = configMapper.selectById(id);
        if (config == null) {
            throw new BusinessException("配置不存在");
        }
        
        // 系统内置配置不允许修改键
        if (Boolean.TRUE.equals(config.getIsSystem())) {
            throw new BusinessException("系统内置配置不允许修改");
        }
        
        // 加密存储（如果需要）
        if (Boolean.TRUE.equals(config.getIsEncrypted())) {
            value = encryptValue(value);
        }
        
        config.setConfigValue(value);
        config.setUpdateTime(LocalDateTime.now());
        configMapper.updateById(config);
        
        // 清除缓存
        clearConfigCache(config.getConfigKey());
        
        log.info("配置已更新: key={}, value={}", config.getConfigKey(), value);
    }
    
    /**
     * 清除配置缓存
     */
    public void clearConfigCache(String key) {
        redisTemplate.delete(CONFIG_CACHE_PREFIX + key);
        log.info("配置缓存已清除: key={}", key);
    }
    
    /**
     * 刷新所有配置缓存
     */
    public void refreshAllCache() {
        Set<String> keys = redisTemplate.keys(CONFIG_CACHE_PREFIX + "*");
        if (CollUtil.isNotEmpty(keys)) {
            redisTemplate.delete(keys);
        }
        log.info("所有配置缓存已刷新");
    }
    
    private String encryptValue(String value) {
        // TODO: 实现加密逻辑
        return value;
    }
    
    private String decryptValue(String value) {
        // TODO: 实现解密逻辑
        return value;
    }
}
```

---

## 4. 支撑域服务

### 4.1 审计日志服务 (Audit)

#### 4.1.1 职责定义

| 功能 | 说明 |
|-----|------|
| 操作日志 | 记录用户操作行为 |
| 登录日志 | 记录用户登录行为 |
| 数据变更日志 | 记录数据变更前后值 |
| 日志查询 | 多维度日志查询 |
| 日志导出 | 日志Excel导出 |

### 4.2 通知服务 (Notify)

#### 4.2.1 职责定义

| 功能 | 说明 |
|-----|------|
| 站内通知 | 系统内部消息通知 |
| 短信通知 | 短信发送（集成第三方） |
| 邮件通知 | 邮件发送 |
---

## 5. 通用域服务

### 5.1 文件服务 (File)

#### 5.1.1 职责定义

| 功能 | 说明 |
|-----|------|
| 文件上传 | 支持多类型文件上传 |
| 文件存储 | 本地/MinIO/OSS存储 |
| 文件下载 | 文件下载（权限校验） |
| 文件管理 | 文件列表、删除 |

### 5.2 消息服务 (Message)

#### 5.2.1 职责定义

| 功能 | 说明 |
|-----|------|
| 消息队列 | 基于Redis/RabbitMQ |
| 消息发送 | 异步消息发送 |
| 消息消费 | 消息监听消费 |
| 消息重试 | 失败消息重试机制 |

---

## 6. 服务依赖关系

```
┌─────────────────────────────────────────────────────────────┐
│                    服务依赖关系图                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Gateway                                                    │
│     │                                                       │
│     ▼                                                       │
│  System服务 ◀─────────────────────────┐                     │
│     │                                  │                     │
│     ├──▶ Config服务 (读取配置)         │                     │
│     ├──▶ Audit服务 (记录日志)          │                     │
│     ├──▶ Notify服务 (发送通知)         │                     │
│     ├──▶ File服务 (文件操作)           │                     │
│     └──▶ Message服务 (消息发送)        │                     │
│                                        │                     │
│  Config服务 ──────────────────────────▶│ 无外部依赖          │
│  Audit服务  ──────────────────────────▶│ 无外部依赖          │
│  Notify服务 ──────────────────────────▶│ 无外部依赖          │
│  File服务   ──────────────────────────▶│ 无外部依赖          │
│  Message服务──────────────────────────▶│ 无外部依赖          │
│                                                             │
│  说明：System服务是核心服务，其他服务为System服务提供支撑    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. 服务接口规范

### 7.1 REST API规范

```yaml
# 接口设计规范
api:
  # 基础路径
  base-path: /api/system
  
  # 版本控制
  version: v1
  
  # 响应格式
  response:
    success:
      code: 200
      message: "success"
      data: {}
    error:
      code: 500
      message: "error message"
      data: null
  
  # 分页参数
  pagination:
    page: pageNum      # 当前页
    size: pageSize     # 每页大小
    default-size: 10   # 默认每页大小
    max-size: 100      # 最大每页大小
```

### 7.2 统一响应格式

```java
@Data
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    private Long timestamp;
    
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMessage("success");
        result.setData(data);
        result.setTimestamp(System.currentTimeMillis());
        return result;
    }
    
    public static <T> Result<T> error(String message) {
        Result<T> result = new Result<>();
        result.setCode(500);
        result.setMessage(message);
        result.setTimestamp(System.currentTimeMillis());
        return result;
    }
}

@Data
public class PageResult<T> {
    private List<T> list;
    private Long total;
    private Long pageNum;
    private Long pageSize;
    private Long pages;
    private Boolean hasNextPage;
    private Boolean hasPreviousPage;
}
```

---

## 8. 修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 架构师 | 初始版本，定义服务划分设计 |
