# 后端技术架构设计

> **文档编号**: SYS-DES-ARCH-BACKEND-001  
> **版本**: 1.0  
> **创建日期**: 2026-03-08  
> **作者**: 架构师  
> **状态**: 🔄 进行中

---

## 1. 概述

### 1.1 目的

本文档定义System平台后端技术架构设计，包括技术选型、项目结构、分层架构、服务设计、安全设计等。

### 1.2 适用范围

- System服务（用户/权限/组织）
- Config服务（系统配置）
- Audit服务（审计日志）
- 通用组件和工具

### 1.3 设计原则

1. **分层架构**：清晰的职责分离（Controller/Service/Mapper/Entity）
2. **领域驱动**：基于DDD的领域模型设计
3. **可扩展性**：支持水平扩展和服务拆分
4. **安全性**：认证授权、数据加密、防攻击

---

## 2. 技术选型

### 2.1 核心技术栈

| 技术 | 版本 | 用途 | 选择理由 |
|-----|------|------|---------|
| Spring Boot | 3.2.x | 基础框架 | 自动配置，生态丰富，微服务支持 |
| Spring Cloud | 2023.x | 微服务框架 | 服务注册、配置中心、网关 |
| Spring Security | 6.x | 安全框架 | 认证授权，OAuth2支持 |
| MyBatis Plus | 3.5.x | ORM框架 | 简化CRUD，代码生成，分页插件 |
| MySQL | 8.0 | 关系数据库 | 主从复制，性能优化 |
| Redis | 7.x | 缓存数据库 | 高性能缓存，分布式锁 |
| Elasticsearch | 8.x | 搜索引擎 | 全文检索，日志分析 |
| RabbitMQ | 3.12.x | 消息队列 | 异步消息，削峰填谷 |
| JWT | 0.12.x | Token认证 | 无状态认证，跨域支持 |

### 2.2 微服务组件

| 组件 | 技术 | 用途 |
|-----|------|------|
| 服务注册 | Nacos | 服务发现与配置管理 |
| 服务网关 | Spring Cloud Gateway | 路由、限流、认证 |
| 负载均衡 | Spring Cloud LoadBalancer | 客户端负载均衡 |
| 熔断降级 | Sentinel | 流量控制，熔断降级 |
| 链路追踪 | Micrometer + Zipkin | 分布式链路追踪 |
| 监控告警 | Prometheus + Grafana | 指标监控和告警 |

### 2.3 技术栈架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      后端技术栈架构                          │
├─────────────────────────────────────────────────────────────┤
│  接入层                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Spring Cloud Gateway                    │   │
│  │         路由 / 限流 / 认证 / 日志 / 熔断             │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  服务层                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   System    │ │   Config    │ │   Audit     │           │
│  │   Service   │ │   Service   │ │   Service   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  基础层                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ Spring Boot │ │Spring Security│ │Spring Cloud │          │
│  │  (基础框架)  │ │  (安全框架)   │ │ (微服务)    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  数据层                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │    MySQL    │ │    Redis    │ │Elasticsearch│           │
│  │  (主数据)    │ │  (缓存)      │ │  (搜索)     │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  中间件                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Nacos     │ │  RabbitMQ   │ │  Sentinel   │           │
│  │ (注册配置)   │ │  (消息队列)  │ │ (熔断限流)  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 项目结构

### 3.1 多模块项目结构

```
linsir-cloud-system/                   # 后端项目根目录
├── linsir-server/                     # 服务端实现
│   ├── linsir-server-common/          # 通用模块
│   │   ├── linsir-common-core/        # 核心工具
│   │   ├── linsir-common-mybatis/     # MyBatis封装
│   │   ├── linsir-common-security/    # 安全模块
│   │   ├── linsir-common-redis/       # Redis封装
│   │   └── linsir-common-log/         # 日志模块
│   │
│   ├── linsir-server-gateway/         # 网关服务（独立）
│   │   ├── src/main/java/com/linsir/gateway/
│   │   │   ├── config/                # 网关配置
│   │   │   ├── filter/                # 网关过滤器
│   │   │   └── handler/               # 异常处理器
│   │   └── pom.xml
│   │
│   └── linsir-server-system/          # System服务（唯一业务服务）
│       ├── src/main/java/com/linsir/system/
│       │   ├── module/                # 按模块划分
│       │   │   ├── auth/              # 认证模块
│       │   │   │   ├── controller/    # 认证控制器
│       │   │   │   ├── service/       # 认证服务
│       │   │   │   │   └── impl/
│       │   │   │   └── dto/           # 认证DTO
│       │   │   │
│       │   │   ├── user/              # 用户模块
│       │   │   │   ├── controller/    # 用户控制器
│       │   │   │   ├── service/       # 用户服务
│       │   │   │   │   └── impl/
│       │   │   │   ├── mapper/        # 用户Mapper
│       │   │   │   ├── entity/        # 用户实体
│       │   │   │   └── dto/           # 用户DTO
│       │   │   │
│       │   │   ├── role/              # 角色权限模块
│       │   │   │   ├── controller/
│       │   │   │   ├── service/
│       │   │   │   │   └── impl/
│       │   │   │   ├── mapper/
│       │   │   │   ├── entity/
│       │   │   │   └── dto/
│       │   │   │
│       │   │   ├── dept/              # 组织架构模块
│       │   │   │   ├── controller/
│       │   │   │   ├── service/
│       │   │   │   │   └── impl/
│       │   │   │   ├── mapper/
│       │   │   │   ├── entity/
│       │   │   │   └── dto/
│       │   │   │
│       │   │   └── config/            # 系统配置模块
│       │   │       ├── controller/
│       │   │       ├── service/
│       │   │       │   └── impl/
│       │   │       ├── mapper/
│       │   │       ├── entity/
│       │   │       └── dto/
│       │   │
│       │   ├── common/                # 模块内通用
│       │   │   ├── enums/             # 全局枚举
│       │   │   └── config/            # 全局配置
│       │   │
│       │   └── SystemApplication.java # 启动类
│       │
│       ├── src/main/resources/
│       │   ├── mapper/                # XML映射文件
│       │   │   ├── user/
│       │   │   ├── role/
│       │   │   ├── dept/
│       │   │   └── config/
│       │   └── application.yml
│       │
│       └── pom.xml
│
├── linsir-api/                        # API接口定义
│   └── linsir-api-system/             # System服务API
│       ├── src/main/java/com/linsir/api/system/
│       │   ├── dto/                   # 数据传输对象
│       │   │   ├── auth/              # 认证相关DTO
│       │   │   ├── user/              # 用户相关DTO
│       │   │   ├── role/              # 角色权限DTO
│       │   │   └── dept/              # 组织架构DTO
│       │   ├── feign/                 # Feign接口（供其他服务调用）
│       │   ├── constants/             # 常量
│       │   └── enums/                 # 枚举
│       └── pom.xml
│
└── pom.xml                            # 根父POM
```

### 3.2 模块依赖关系

```
┌─────────────────────────────────────────────────────────────┐
│                        模块依赖图                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  linsir-cloud-system/                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌─────────────────┐    ┌─────────────────┐        │   │
│  │  │  linsir-server  │    │   linsir-api    │        │   │
│  │  │                 │    │                 │        │   │
│  │  │  ┌───────────┐  │    │  ┌───────────┐  │        │   │
│  │  │  │  Gateway  │  │    │  │   DTO     │  │        │   │
│  │  │  │  (网关)   │  │    │  │  Feign    │  │        │   │
│  │  │  └───────────┘  │    │  │  常量     │  │        │   │
│  │  │                 │    │  └───────────┘  │        │   │
│  │  │  ┌───────────┐  │    │                 │        │   │
│  │  │  │  System   │  │    │  (供其他服务   │        │   │
│  │  │  │  (唯一    │◀─┼────┤   依赖调用)    │        │   │
│  │  │  │  服务)    │  │    │                 │        │   │
│  │  │  └─────┬─────┘  │    └─────────────────┘        │   │
│  │  │        │        │                                 │   │
│  │  │        │ 依赖   │                                 │   │
│  │  │        ▼        │                                 │   │
│  │  │  ┌───────────┐  │                                 │   │
│  │  │  │  Common   │  │                                 │   │
│  │  │  │ (通用模块)│  │                                 │   │
│  │  │  └───────────┘  │                                 │   │
│  │  │                 │                                 │   │
│  │  └─────────────────┘                                 │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  说明：除网关外，只有一个System服务（包含认证/用户/权限/组织）│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 职责划分

| 模块 | 职责 | 说明 |
|-----|------|------|
| **Gateway** | 网关服务 | 路由、限流、认证、日志 |
| **System** | 唯一业务服务 | 认证、用户、角色权限、组织架构、系统配置 |
| **API** | 接口定义 | DTO、Feign接口、常量、枚举（供其他服务调用） |
| **Common** | 通用模块 | Core、Mybatis、Security、Redis、Log |

**设计原则：**
- **单一服务**：除网关外，只有一个System服务，避免微服务划分过小
- **模块内聚**：System服务内部按模块划分（auth/user/role/dept/config）
- **API独立**：DTO和Feign接口单独维护，供其他服务依赖
- **服务间调用**：通过Feign调用System服务，依赖API模块

---

## 4. 分层架构

### 4.1 分层设计

```
┌─────────────────────────────────────────────────────────────┐
│                      分层架构设计                            │
├─────────────────────────────────────────────────────────────┤
│  Controller层                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • 接收请求参数                                       │   │
│  │ • 调用Service层                                      │   │
│  │ • 返回统一响应                                       │   │
│  │ • 参数校验（@Valid）                                 │   │
│  │ • 权限注解（@PreAuthorize）                          │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Service层                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • 业务逻辑处理                                       │   │
│  │ • 事务管理（@Transactional）                         │   │
│  │ • 调用Mapper层                                       │   │
│  │ • 调用其他Service                                    │   │
│  │ • 数据转换（DTO/VO）                                 │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Mapper层                                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • 数据访问接口                                       │   │
│  │ • 继承BaseMapper                                     │   │
│  │ • 自定义SQL（XML或注解）                             │   │
│  │ • 分页查询                                           │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Entity层                                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • 数据库实体类                                       │   │
│  │ • 继承BaseEntity                                     │   │
│  │ • 字段映射（@TableField）                            │   │
│  │ • 逻辑删除（@TableLogic）                            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 代码示例

#### Controller层

```java
@RestController
@RequestMapping("/system/user")
@Tag(name = "用户管理", description = "用户管理相关接口")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/list")
    @Operation(summary = "获取用户列表")
    @PreAuthorize("@ss.hasPermi('system:user:list')")
    public Result<PageResult<UserVO>> list(UserQuery query) {
        return Result.success(userService.list(query));
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取用户详情")
    @PreAuthorize("@ss.hasPermi('system:user:query')")
    public Result<UserVO> getById(@PathVariable Long id) {
        return Result.success(userService.getById(id));
    }

    @PostMapping
    @Operation(summary = "新增用户")
    @PreAuthorize("@ss.hasPermi('system:user:create')")
    @Log(title = "用户管理", businessType = BusinessType.INSERT)
    public Result<Void> create(@Valid @RequestBody UserCreateDTO dto) {
        userService.create(dto);
        return Result.success();
    }

    @PutMapping("/{id}")
    @Operation(summary = "修改用户")
    @PreAuthorize("@ss.hasPermi('system:user:update')")
    @Log(title = "用户管理", businessType = BusinessType.UPDATE)
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody UserUpdateDTO dto) {
        userService.update(id, dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除用户")
    @PreAuthorize("@ss.hasPermi('system:user:delete')")
    @Log(title = "用户管理", businessType = BusinessType.DELETE)
    public Result<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return Result.success();
    }
}
```

#### Service层

```java
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final DeptService deptService;

    @Override
    public PageResult<UserVO> list(UserQuery query) {
        // 构建查询条件
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.isNotBlank(query.getUsername()), User::getUsername, query.getUsername())
               .like(StringUtils.isNotBlank(query.getNickname()), User::getNickname, query.getNickname())
               .eq(query.getStatus() != null, User::getStatus, query.getStatus())
               .eq(query.getDeptId() != null, User::getDeptId, query.getDeptId())
               .orderByDesc(User::getCreateTime);
        
        // 执行分页查询
        Page<User> page = page(new Page<>(query.getPageNum(), query.getPageSize()), wrapper);
        
        // 转换为VO
        List<UserVO> voList = page.getRecords().stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
        
        return new PageResult<>(page.getTotal(), voList);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void create(UserCreateDTO dto) {
        // 校验用户名唯一性
        if (count(new LambdaQueryWrapper<User>().eq(User::getUsername, dto.getUsername())) > 0) {
            throw new BusinessException("用户名已存在");
        }
        
        // 创建用户
        User user = new User();
        BeanUtils.copyProperties(dto, user);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        save(user);
        
        // 保存用户角色关联
        if (CollectionUtils.isNotEmpty(dto.getRoleIds())) {
            roleService.saveUserRoles(user.getId(), dto.getRoleIds());
        }
    }

    private UserVO convertToVO(User user) {
        UserVO vo = new UserVO();
        BeanUtils.copyProperties(user, vo);
        // 填充部门名称
        if (user.getDeptId() != null) {
            vo.setDeptName(deptService.getById(user.getDeptId()).getName());
        }
        return vo;
    }
}
```

#### Mapper层

```java
@Mapper
public interface UserMapper extends BaseMapper<User> {

    /**
     * 根据用户名查询用户
     */
    User selectByUsername(@Param("username") String username);

    /**
     * 查询用户角色列表
     */
    List<Role> selectRolesByUserId(@Param("userId") Long userId);

    /**
     * 查询用户权限列表
     */
    List<String> selectPermsByUserId(@Param("userId") Long userId);
}
```

```xml
<!-- UserMapper.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.linsir.system.mapper.UserMapper">

    <select id="selectByUsername" resultType="com.linsir.system.entity.User">
        SELECT * FROM sys_user WHERE username = #{username} AND deleted = 0
    </select>

    <select id="selectRolesByUserId" resultType="com.linsir.system.entity.Role">
        SELECT r.* FROM sys_role r
        INNER JOIN sys_user_role ur ON r.id = ur.role_id
        WHERE ur.user_id = #{userId} AND r.deleted = 0
    </select>

    <select id="selectPermsByUserId" resultType="java.lang.String">
        SELECT m.perms FROM sys_menu m
        INNER JOIN sys_role_menu rm ON m.id = rm.menu_id
        INNER JOIN sys_user_role ur ON rm.role_id = ur.role_id
        WHERE ur.user_id = #{userId} AND m.perms IS NOT NULL AND m.deleted = 0
    </select>

</mapper>
```

#### Entity层

```java
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_user")
public class User extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /** 用户名 */
    @TableField("username")
    private String username;

    /** 密码 */
    @TableField("password")
    private String password;

    /** 昵称 */
    @TableField("nickname")
    private String nickname;

    /** 邮箱 */
    @TableField("email")
    private String email;

    /** 手机号 */
    @TableField("mobile")
    private String mobile;

    /** 头像 */
    @TableField("avatar")
    private String avatar;

    /** 部门ID */
    @TableField("dept_id")
    private Long deptId;

    /** 状态（0正常 1停用） */
    @TableField("status")
    private Integer status;

    /** 逻辑删除 */
    @TableLogic
    @TableField("deleted")
    private Integer deleted;
}
```

---

## 5. 安全设计

### 5.1 认证授权架构

```
┌─────────────────────────────────────────────────────────────┐
│                      认证授权架构                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                                           │
│  │    客户端     │                                           │
│  └──────┬───────┘                                           │
│         │ 1. 登录请求（username/password）                   │
│         ▼                                                   │
│  ┌──────────────┐     ┌──────────────┐                     │
│  │    Auth      │────▶│    User      │                     │
│  │   Service    │     │   Service    │                     │
│  └──────┬───────┘     └──────────────┘                     │
│         │ 2. 生成JWT Token                                   │
│         ▼                                                   │
│  ┌──────────────┐                                           │
│  │    客户端     │◀─── Token                                  │
│  └──────┬───────┘                                           │
│         │ 3. 业务请求（Authorization: Bearer token）         │
│         ▼                                                   │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐│
│  │   Gateway    │────▶│ JWT Filter   │────▶│  Permission  ││
│  │              │     │  验证Token   │     │   鉴权       ││
│  └──────────────┘     └──────────────┘     └──────────────┘│
│                                                            │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 JWT认证实现

```java
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private final RedisTemplate<String, String> redisTemplate;

    /**
     * 生成Token
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", userDetails.getUsername());
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        String token = Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        // 存储到Redis
        redisTemplate.opsForValue().set(
                RedisKey.TOKEN_PREFIX + userDetails.getUsername(),
                token,
                jwtExpiration,
                TimeUnit.MILLISECONDS
        );

        return token;
    }

    /**
     * 验证Token
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 从Token获取用户名
     */
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    /**
     * 刷新Token
     */
    public String refreshToken(String token) {
        String username = getUsernameFromToken(token);
        // 重新生成Token
        // ...
        return newToken;
    }
}
```

### 5.3 权限控制

```java
@Component("ss")
@RequiredArgsConstructor
public class PermissionService {

    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * 判断是否有权限
     */
    public boolean hasPermi(String permission) {
        if (StringUtils.isEmpty(permission)) {
            return false;
        }
        
        LoginUser loginUser = SecurityUtils.getLoginUser();
        if (loginUser == null || CollectionUtils.isEmpty(loginUser.getPermissions())) {
            return false;
        }
        
        return loginUser.getPermissions().contains(permission);
    }

    /**
     * 判断是否有任意权限
     */
    public boolean hasAnyPermi(String... permissions) {
        if (permissions == null || permissions.length == 0) {
            return false;
        }
        
        LoginUser loginUser = SecurityUtils.getLoginUser();
        if (loginUser == null || CollectionUtils.isEmpty(loginUser.getPermissions())) {
            return false;
        }
        
        return Arrays.stream(permissions)
                .anyMatch(p -> loginUser.getPermissions().contains(p));
    }

    /**
     * 判断是否有角色
     */
    public boolean hasRole(String role) {
        if (StringUtils.isEmpty(role)) {
            return false;
        }
        
        LoginUser loginUser = SecurityUtils.getLoginUser();
        if (loginUser == null || CollectionUtils.isEmpty(loginUser.getRoles())) {
            return false;
        }
        
        return loginUser.getRoles().contains(role);
    }
}
```

### 5.4 接口安全

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final JwtTokenFilter jwtTokenFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 禁用CSRF（使用JWT不需要）
            .csrf(csrf -> csrf.disable())
            
            // 配置异常处理
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .accessDeniedHandler(jwtAccessDeniedHandler)
            )
            
            // 配置会话管理（无状态）
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // 配置请求授权
            .authorizeHttpRequests(auth -> auth
                // 放行登录接口
                .requestMatchers("/auth/login").permitAll()
                // 放行Swagger文档
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                // 其他请求需要认证
                .anyRequest().authenticated()
            )
            
            // 添加JWT过滤器
            .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

## 6. 异常处理

### 6.1 全局异常处理

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * 业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        log.warn("业务异常: {}", e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }

    /**
     * 参数校验异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        log.warn("参数校验失败: {}", message);
        return Result.error(400, message);
    }

    /**
     * 权限不足异常
     */
    @ExceptionHandler(AccessDeniedException.class)
    public Result<Void> handleAccessDeniedException(AccessDeniedException e) {
        log.warn("权限不足: {}", e.getMessage());
        return Result.error(403, "权限不足，无法访问");
    }

    /**
     * 其他异常
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("系统异常: ", e);
        return Result.error(500, "系统繁忙，请稍后重试");
    }
}
```

---

## 7. 日志设计

### 7.1 操作日志

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Log {
    /**
     * 模块
     */
    String title() default "";

    /**
     * 功能
     */
    BusinessType businessType() default BusinessType.OTHER;

    /**
     * 是否保存请求参数
     */
    boolean isSaveRequestData() default true;

    /**
     * 是否保存响应参数
     */
    boolean isSaveResponseData() default true;
}
```

```java
@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class LogAspect {

    private final AsyncLogService asyncLogService;

    @Around("@annotation(logAnnotation)")
    public Object around(ProceedingJoinPoint point, Log logAnnotation) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        // 执行方法
        Object result = point.proceed();
        
        long costTime = System.currentTimeMillis() - startTime;
        
        // 异步保存日志
        asyncLogService.saveLog(point, logAnnotation, result, costTime);
        
        return result;
    }
}
```

---

## 8. 相关文档

- [前端技术架构](./01-frontend-architecture.md)
- [数据技术架构](./03-data-architecture.md)
- [系统架构设计](../01-system-architecture/01-logical-architecture.md)

---

## 9. 修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 架构师 | 初始版本，定义后端技术架构 |
