# 认证授权架构设计

> **文档编号**: SYS-DES-ARCH-SEC-001  
> **版本**: 1.0  
> **创建日期**: 2026-03-08  
> **作者**: 架构师  
> **状态**: 🔄 进行中

---

## 1. 概述

### 1.1 目的

本文档定义System平台的认证授权架构设计，包括OAuth 2.0 + JWT认证方案、SSO单点登录架构、RBAC权限模型实现，确保系统的身份认证和访问控制安全可靠。

### 1.2 设计目标

| 目标 | 说明 |
|-----|------|
| 统一认证 | 支持多应用统一登录认证 |
| 单点登录 | 一次登录，多处访问 |
| 细粒度授权 | 支持菜单、按钮、数据级别权限控制 |
| 安全传输 | 所有认证信息HTTPS传输 |
| 会话安全 | Token过期、刷新、吊销机制 |

### 1.3 设计原则

1. **安全性**：采用业界标准安全协议
2. **无状态**：服务端无会话状态，支持水平扩展
3. **可扩展**：支持多种认证方式扩展
4. **易集成**：提供标准SDK和API

---

## 2. 认证授权架构总览

```
┌─────────────────────────────────────────────────────────────┐
│                    认证授权架构总览                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    客户端层                          │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │   Web端     │ │   移动端    │ │  第三方应用 │   │   │
│  │  │  (Vue3)    │ │   (APP)     │ │  (OAuth2)   │   │   │
│  │  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘   │   │
│  └─────────┼───────────────┼───────────────┼──────────┘   │
│            │               │               │               │
│            └───────────────┼───────────────┘               │
│                            │                               │
│                            ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    网关层 (Gateway)                  │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  • Token校验                                 │   │   │
│  │  │  • 请求转发                                  │   │   │
│  │  │  • 限流熔断                                  │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────┬───────────────────────────┘   │
│                            │                               │
│                            ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    System服务                        │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  ┌─────────────┐  ┌─────────────┐          │   │   │
│  │  │  │   认证服务   │  │   授权服务   │          │   │   │
│  │  │  │  (Auth)     │  │  (RBAC)     │          │   │   │
│  │  │  └─────────────┘  └─────────────┘          │   │   │
│  │  │  ┌─────────────┐  ┌─────────────┐          │   │   │
│  │  │  │   用户服务   │  │   会话管理   │          │   │   │
│  │  │  │  (User)     │  │  (Session)  │          │   │   │
│  │  │  └─────────────┘  └─────────────┘          │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────┬───────────────────────────┘   │
│                            │                               │
│                            ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    数据存储层                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │   MySQL     │ │   Redis     │ │   JWT密钥   │   │   │
│  │  │  (用户/权限)│ │  (Token/   │ │  (HSM/Vault)│   │   │
│  │  │             │ │   Session)  │ │             │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 认证架构设计

### 3.1 认证流程

#### 3.1.1 用户名密码认证

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  客户端  │────▶│  Gateway│────▶│  System │────▶│  Redis  │
│         │     │         │     │  服务   │     │         │
└────┬────┘     └─────────┘     └────┬────┘     └─────────┘
     │                               │
     │ 1. POST /api/system/auth/login │
     │───────────────────────────────▶│
     │    {username, password}        │
     │                               │
     │                               │ 2. 校验用户名密码
     │                               │    (bcrypt比对)
     │                               │
     │                               │ 3. 查询用户权限
     │                               │    (RBAC查询)
     │                               │
     │                               │ 4. 生成JWT Token
     │                               │    (Access + Refresh)
     │                               │
     │                               │ 5. 存储Token到Redis
     │                               │    (设置过期时间)
     │                               │
     │ 6. 返回Token                   │
     │◀───────────────────────────────│
     │    {accessToken, refreshToken, │
     │     expiresIn, userInfo}       │
     │                               │
```

#### 3.1.2 Token刷新流程

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  客户端  │────▶│  Gateway│────▶│  System │────▶│  Redis  │
│         │     │         │     │  服务   │     │         │
└────┬────┘     └─────────┘     └────┬────┘     └─────────┘
     │                               │
     │ 1. POST /api/system/auth/     │
     │    refresh                    │
     │───────────────────────────────▶│
     │    {refreshToken}              │
     │                               │
     │                               │ 2. 校验Refresh Token
     │                               │    (验证签名和过期)
     │                               │
     │                               │ 3. 检查Token黑名单
     │                               │    (是否已吊销)
     │                               │
     │                               │ 4. 生成新Token对
     │                               │    (Access + Refresh)
     │                               │
     │                               │ 5. 旧Token加入黑名单
     │                               │    (设置过期时间)
     │                               │
     │ 6. 返回新Token                 │
     │◀───────────────────────────────│
     │    {accessToken, refreshToken, │
     │     expiresIn}                 │
     │                               │
```

### 3.2 JWT Token设计

#### 3.2.1 Token结构

```json
// Access Token Payload
{
  "iss": "linsir-system",           // 签发者
  "sub": "user_12345",              // 主题(用户ID)
  "aud": "linsir-web",              // 受众
  "exp": 1709836800,                // 过期时间(2小时)
  "iat": 1709829600,                // 签发时间
  "jti": "uuid_token_id",           // Token唯一标识
  "userId": "12345",
  "username": "zhangsan",
  "tenantId": "tenant_001",
  "roles": ["admin", "user"],
  "permissions": ["user:create", "user:read"]
}

// Refresh Token Payload
{
  "iss": "linsir-system",
  "sub": "user_12345",
  "aud": "linsir-web",
  "exp": 1712428800,                // 过期时间(30天)
  "iat": 1709829600,
  "jti": "uuid_refresh_token_id",
  "tokenType": "refresh"
}
```

#### 3.2.2 Token配置

```yaml
# application-security.yml
security:
  jwt:
    # Access Token配置
    access-token:
      secret: ${JWT_ACCESS_SECRET}     # 从环境变量读取
      expiration: 7200                 # 2小时(秒)
      issuer: linsir-system
    
    # Refresh Token配置
    refresh-token:
      secret: ${JWT_REFRESH_SECRET}    # 从环境变量读取
      expiration: 2592000              # 30天(秒)
      issuer: linsir-system
    
    # Token存储配置
    storage:
      type: redis                      # redis/memory
      prefix: "auth:token:"
      blacklist-prefix: "auth:blacklist:"
```

### 3.3 认证接口设计

| 接口 | 方法 | 路径 | 说明 |
|-----|------|------|------|
| 用户登录 | POST | /api/system/auth/login | 用户名密码登录 |
| Token刷新 | POST | /api/system/auth/refresh | 刷新Access Token |
| 用户登出 | POST | /api/system/auth/logout | 用户主动登出 |
| 获取当前用户 | GET | /api/system/auth/me | 获取当前登录用户信息 |
| 修改密码 | PUT | /api/system/auth/password | 修改当前用户密码 |

### 3.4 认证代码实现

#### 3.4.1 JWT工具类

```java
@Component
public class JwtTokenProvider {
    
    @Value("${security.jwt.access-token.secret}")
    private String accessTokenSecret;
    
    @Value("${security.jwt.access-token.expiration}")
    private long accessTokenExpiration;
    
    @Value("${security.jwt.refresh-token.secret}")
    private String refreshTokenSecret;
    
    @Value("${security.jwt.refresh-token.expiration}")
    private long refreshTokenExpiration;
    
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    private static final String TOKEN_PREFIX = "auth:token:";
    private static final String BLACKLIST_PREFIX = "auth:blacklist:";
    
    /**
     * 生成Access Token
     */
    public String generateAccessToken(UserDetails user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + accessTokenExpiration * 1000);
        
        String token = Jwts.builder()
            .setSubject(user.getUserId())
            .setIssuer("linsir-system")
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .setId(UUID.randomUUID().toString())
            .claim("userId", user.getUserId())
            .claim("username", user.getUsername())
            .claim("tenantId", user.getTenantId())
            .claim("roles", user.getRoles())
            .claim("permissions", user.getPermissions())
            .signWith(Keys.hmacShaKeyFor(accessTokenSecret.getBytes()), SignatureAlgorithm.HS512)
            .compact();
        
        // 存储Token到Redis
        storeToken(user.getUserId(), token, accessTokenExpiration);
        
        return token;
    }
    
    /**
     * 生成Refresh Token
     */
    public String generateRefreshToken(UserDetails user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenExpiration * 1000);
        
        return Jwts.builder()
            .setSubject(user.getUserId())
            .setIssuer("linsir-system")
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .setId(UUID.randomUUID().toString())
            .claim("tokenType", "refresh")
            .signWith(Keys.hmacShaKeyFor(refreshTokenSecret.getBytes()), SignatureAlgorithm.HS512)
            .compact();
    }
    
    /**
     * 验证Access Token
     */
    public boolean validateAccessToken(String token) {
        try {
            // 1. 验证Token签名和过期
            Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(accessTokenSecret.getBytes()))
                .build()
                .parseClaimsJws(token);
            
            // 2. 检查Token是否在黑名单
            String jti = getJtiFromToken(token);
            Boolean isBlacklisted = redisTemplate.hasKey(BLACKLIST_PREFIX + jti);
            
            return !Boolean.TRUE.equals(isBlacklisted);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    
    /**
     * 将Token加入黑名单
     */
    public void blacklistToken(String token) {
        String jti = getJtiFromToken(token);
        Date expiration = getExpirationDateFromToken(token);
        long ttl = expiration.getTime() - System.currentTimeMillis();
        
        if (ttl > 0) {
            redisTemplate.opsForValue()
                .set(BLACKLIST_PREFIX + jti, "1", ttl, TimeUnit.MILLISECONDS);
        }
    }
    
    /**
     * 从Token中获取Claims
     */
    public Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(Keys.hmacShaKeyFor(accessTokenSecret.getBytes()))
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
    
    private void storeToken(String userId, String token, long expiration) {
        String key = TOKEN_PREFIX + userId;
        redisTemplate.opsForSet().add(key, token);
        redisTemplate.expire(key, expiration, TimeUnit.SECONDS);
    }
    
    private String getJtiFromToken(String token) {
        return getClaimsFromToken(token).getId();
    }
    
    private Date getExpirationDateFromToken(String token) {
        return getClaimsFromToken(token).getExpiration();
    }
}
```

#### 3.4.2 认证过滤器

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // 1. 从请求中获取Token
        String token = getTokenFromRequest(request);
        
        // 2. 验证Token
        if (StringUtils.hasText(token) && tokenProvider.validateAccessToken(token)) {
            // 3. 从Token中获取用户信息
            String userId = tokenProvider.getClaimsFromToken(token).getSubject();
            
            // 4. 加载用户详情
            UserDetails userDetails = userDetailsService.loadUserById(userId);
            
            // 5. 创建认证对象
            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            
            authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request));
            
            // 6. 设置安全上下文
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

---

## 4. 授权架构设计

### 4.1 RBAC权限模型

```
┌─────────────────────────────────────────────────────────────┐
│                    RBAC权限模型                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐       ┌─────────┐       ┌─────────┐           │
│  │  用户   │◀─────▶│  角色   │◀─────▶│  权限   │           │
│  │  User   │  N:M  │  Role   │  N:M  │Permission│          │
│  └────┬────┘       └────┬────┘       └────┬────┘           │
│       │                 │                 │                │
│       │                 │                 │                │
│       ▼                 ▼                 ▼                │
│  ┌─────────┐       ┌─────────┐       ┌─────────┐           │
│  │ 用户表  │       │ 角色表  │       │ 权限表  │           │
│  │ sys_user│       │sys_role │       │sys_perm │           │
│  └─────────┘       └─────────┘       └─────────┘           │
│       │                 │                 │                │
│       │                 │                 │                │
│       └────────┬────────┴────────┬────────┘                │
│                │                 │                         │
│                ▼                 ▼                         │
│         ┌─────────────┐   ┌─────────────┐                 │
│         │ 用户角色关联 │   │ 角色权限关联 │                 │
│         │sys_user_role│   │sys_role_perm│                 │
│         └─────────────┘   └─────────────┘                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 权限粒度

| 粒度级别 | 说明 | 示例 |
|---------|------|------|
| 菜单权限 | 控制页面菜单显示 | 系统管理菜单、用户管理菜单 |
| 按钮权限 | 控制操作按钮显示 | 新增按钮、删除按钮 |
| 接口权限 | 控制API访问 | POST /api/system/users |
| 数据权限 | 控制数据范围 | 本部门数据、全部数据 |

### 4.3 权限注解

```java
/**
 * 要求登录
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireLogin {
}

/**
 * 要求角色
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireRole {
    String[] value();
    Logical logical() default Logical.AND;
}

/**
 * 要求权限
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequirePermission {
    String[] value();
    Logical logical() default Logical.AND;
}

/**
 * 数据权限
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface DataPermission {
    DataScope scope() default DataScope.SELF;
}

public enum DataScope {
    ALL,           // 全部数据
    DEPT_ONLY,     // 本部门数据
    DEPT_AND_CHILD,// 本部门及子部门
    SELF_ONLY      // 仅本人数据
}
```

### 4.4 权限控制实现

```java
@RestController
@RequestMapping("/api/system/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * 查询用户列表 - 需要user:read权限
     */
    @GetMapping
    @RequirePermission("user:read")
    @DataPermission(scope = DataScope.DEPT_AND_CHILD)
    public Result<PageResult<UserVO>> list(UserQuery query) {
        // 数据权限拦截器会自动添加部门过滤条件
        return Result.success(userService.list(query));
    }
    
    /**
     * 创建用户 - 需要user:create权限
     */
    @PostMapping
    @RequirePermission("user:create")
    @OperationLog(module = "用户管理", type = OperationType.CREATE)
    public Result<Void> create(@RequestBody @Valid UserCreateDTO dto) {
        userService.create(dto);
        return Result.success();
    }
    
    /**
     * 更新用户 - 需要user:update权限
     */
    @PutMapping("/{id}")
    @RequirePermission("user:update")
    @OperationLog(module = "用户管理", type = OperationType.UPDATE)
    public Result<Void> update(@PathVariable Long id, 
                               @RequestBody @Valid UserUpdateDTO dto) {
        userService.update(id, dto);
        return Result.success();
    }
    
    /**
     * 删除用户 - 需要user:delete权限和管理员角色
     */
    @DeleteMapping("/{id}")
    @RequirePermission("user:delete")
    @RequireRole("admin")
    @OperationLog(module = "用户管理", type = OperationType.DELETE)
    public Result<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return Result.success();
    }
}
```

### 4.5 数据权限拦截器

```java
@Component
@Intercepts({
    @Signature(type = Executor.class, method = "query", 
               args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class}),
    @Signature(type = Executor.class, method = "update", 
               args = {MappedStatement.class, Object.class})
})
public class DataPermissionInterceptor implements Interceptor {
    
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        // 1. 获取当前登录用户
        LoginUser user = SecurityUtils.getLoginUser();
        if (user == null) {
            return invocation.proceed();
        }
        
        // 2. 获取方法上的@DataPermission注解
        DataPermission dataPermission = getDataPermissionAnnotation();
        if (dataPermission == null) {
            return invocation.proceed();
        }
        
        // 3. 根据数据范围添加过滤条件
        DataScope scope = dataPermission.scope();
        if (user.isSuperAdmin()) {
            // 超级管理员查看全部数据
            return invocation.proceed();
        }
        
        // 4. 修改SQL添加数据权限过滤
        String originalSql = getOriginalSql(invocation);
        String filteredSql = addDataScopeFilter(originalSql, scope, user);
        setNewSql(invocation, filteredSql);
        
        return invocation.proceed();
    }
    
    private String addDataScopeFilter(String sql, DataScope scope, LoginUser user) {
        StringBuilder filterSql = new StringBuilder(sql);
        
        switch (scope) {
            case DEPT_ONLY:
                filterSql.append(" AND dept_id = ").append(user.getDeptId());
                break;
            case DEPT_AND_CHILD:
                Set<Long> childDeptIds = getChildDeptIds(user.getDeptId());
                filterSql.append(" AND dept_id IN (")
                         .append(StringUtils.join(childDeptIds, ","))
                         .append(")");
                break;
            case SELF_ONLY:
                filterSql.append(" AND create_by = ").append(user.getUserId());
                break;
            default:
                break;
        }
        
        return filterSql.toString();
    }
}
```

---

## 5. SSO单点登录架构

### 5.1 SSO架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                    SSO单点登录架构                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   应用A     │  │   应用B     │  │   应用C     │         │
│  │  (OA系统)   │  │  (CRM系统)  │  │  (ERP系统)  │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                │
│         └────────────────┼────────────────┘                │
│                          │                                 │
│                          ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    System服务(SSO中心)               │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  • 统一认证                                  │   │   │
│  │  │  • Token签发                                 │   │   │
│  │  │  • 会话管理                                  │   │   │
│  │  │  • 应用注册                                  │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────┬───────────────────────────┘   │
│                            │                               │
│                            ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    统一登录页                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 SSO登录流程

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  应用A   │     │  应用B   │     │  SSO中心 │     │  Redis  │
│         │     │         │     │         │     │         │
└────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     │               │               │               │
     │ 1. 访问应用A   │               │               │
     │   (无Token)   │               │               │
     │───────────────│               │               │
     │               │               │               │
     │ 2. 重定向到    │               │               │
     │   SSO登录页    │               │               │
     │◀──────────────│               │               │
     │               │               │               │
     │ 3. 登录成功    │               │               │
     │──────────────▶│               │               │
     │               │               │               │
     │               │ 4. 创建SSO    │               │
     │               │    Session    │──────────────▶│
     │               │               │               │
     │ 5. 返回Token   │               │               │
     │◀──────────────│               │               │
     │               │               │               │
     │ 6. 访问应用B   │               │               │
     │               │───────────────│               │
     │               │               │               │
     │               │ 7. 携带Token   │               │
     │               │   验证SSO      │───────────────│
     │               │   Session      │               │
     │               │               │               │
     │               │ 8. 免登录      │               │
     │               │◀──────────────│               │
     │               │               │               │
```

### 5.3 应用注册配置

```yaml
# SSO应用注册配置
sso:
  applications:
    - appId: "oa-system"
      appName: "OA办公系统"
      appSecret: "${OA_APP_SECRET}"
      redirectUris:
        - "https://oa.linsir.com/sso/callback"
      logoutUris:
        - "https://oa.linsir.com/sso/logout"
      scopes:
        - "user:read"
        - "dept:read"
      
    - appId: "crm-system"
      appName: "CRM客户系统"
      appSecret: "${CRM_APP_SECRET}"
      redirectUris:
        - "https://crm.linsir.com/sso/callback"
      logoutUris:
        - "https://crm.linsir.com/sso/logout"
      scopes:
        - "user:read"
        - "customer:read"
        - "customer:write"
```

---

## 6. 前端Token安全处理

### 6.1 Token存储策略

#### 6.1.1 存储方案对比

| 存储方式 | 优点 | 缺点 | 适用场景 |
|---------|------|------|---------|
| localStorage | 持久化、容量大 | XSS攻击可窃取 | 非敏感数据 |
| sessionStorage | 会话级、较安全 | 页面关闭丢失 | 临时数据 |
| Cookie(httpOnly) | 防XSS、可设SameSite | 容量小、CSRF风险 | **推荐：Access Token** |
| Cookie(secure) | HTTPS传输 | 需HTTPS | **推荐：Refresh Token** |
| Memory | 最安全 | 页面刷新丢失 | 临时缓存 |

#### 6.1.2 推荐存储方案

```
┌─────────────────────────────────────────────────────────────┐
│                    Token存储方案                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Access Token                                               │
│  ├── 存储位置：Memory (Pinia/Vuex)                         │
│  ├── 过期时间：2小时                                        │
│  └── 使用方式：请求头 Authorization: Bearer {token}         │
│                                                             │
│  Refresh Token                                              │
│  ├── 存储位置：HttpOnly Cookie                              │
│  ├── 过期时间：30天                                         │
│  ├── SameSite: Strict                                       │
│  └── Secure: true (仅HTTPS)                                 │
│                                                             │
│  临时缓存                                                   │
│  ├── 存储位置：sessionStorage                               │
│  └── 内容：用户信息、权限列表                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 前端Token管理实现

#### 6.2.1 Token管理器 (TypeScript)

```typescript
// stores/auth.ts - Pinia Store
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { loginApi, refreshTokenApi, logoutApi } from '@/api/auth'

interface UserInfo {
  userId: string
  username: string
  realName: string
  avatar: string
  roles: string[]
  permissions: string[]
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  
  // Access Token存储在内存中（页面刷新丢失）
  const accessToken = ref<string>('')
  
  // 用户信息存储在内存中
  const userInfo = ref<UserInfo | null>(null)
  
  // 是否已登录
  const isLoggedIn = computed(() => !!accessToken.value)
  
  /**
   * 登录
   */
  async function login(username: string, password: string) {
    try {
      const res = await loginApi({ username, password })
      
      // Access Token存入内存
      accessToken.value = res.accessToken
      
      // 用户信息存入内存
      userInfo.value = res.userInfo
      
      // 权限信息存入sessionStorage（可选，用于页面刷新后恢复）
      sessionStorage.setItem('user_permissions', JSON.stringify(res.userInfo.permissions))
      
      return true
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }
  
  /**
   * 刷新Token
   */
  async function refreshToken() {
    try {
      // Refresh Token在HttpOnly Cookie中，会自动携带
      const res = await refreshTokenApi()
      
      // 更新Access Token
      accessToken.value = res.accessToken
      
      return true
    } catch (error) {
      console.error('刷新Token失败:', error)
      // 刷新失败，退出登录
      await logout()
      return false
    }
  }
  
  /**
   * 退出登录
   */
  async function logout() {
    try {
      // 调用后端登出接口（清除Cookie中的Refresh Token）
      await logoutApi()
    } finally {
      // 清除内存中的Token
      accessToken.value = ''
      userInfo.value = null
      
      // 清除sessionStorage
      sessionStorage.removeItem('user_permissions')
      
      // 跳转到登录页
      router.push('/login')
    }
  }
  
  /**
   * 获取Access Token（供请求拦截器使用）
   */
  function getAccessToken(): string {
    return accessToken.value
  }
  
  /**
   * 获取租户ID（供请求拦截器使用）
   */
  function getTenantId(): string {
    return userInfo.value?.tenantId || ''
  }
  
  return {
    accessToken,
    userInfo,
    isLoggedIn,
    login,
    refreshToken,
    logout,
    getAccessToken,
    getTenantId
  }
})
```

#### 6.2.2 Axios请求拦截器

```typescript
// utils/request.ts
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 是否正在刷新Token
let isRefreshing = false
// 等待刷新Token的请求队列
let refreshSubscribers: Array<(token: string) => void> = []

/**
 * 订阅Token刷新
 */
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

/**
 * 通知所有订阅者新Token
 */
function onTokenRefreshed(newToken: string) {
  refreshSubscribers.forEach(callback => callback(newToken))
  refreshSubscribers = []
}

/**
 * 请求拦截器
 */
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    const token = authStore.getAccessToken()
    const tenantId = authStore.getTenantId()
    
    // 添加Access Token到请求头
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加租户ID到请求头（多租户支持）
    if (tenantId && config.headers) {
      config.headers['X-Tenant-Id'] = tenantId
    }
    
    // 添加请求时间戳（防重放攻击）
    config.headers['X-Request-Time'] = Date.now().toString()
    
    // 添加请求签名（可选，高安全场景）
    // config.headers['X-Request-Sign'] = generateSign(config)
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error: AxiosError) => {
    const { response, config } = error
    const authStore = useAuthStore()
    
    // 401 Unauthorized - Token过期
    if (response?.status === 401 && config) {
      // 避免重复刷新
      if (!isRefreshing) {
        isRefreshing = true
        
        try {
          // 尝试刷新Token
          const success = await authStore.refreshToken()
          
          if (success) {
            // 刷新成功，通知所有等待的请求
            const newToken = authStore.getAccessToken()
            onTokenRefreshed(newToken)
            
            // 重试原请求
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${newToken}`
            return request(config)
          }
        } catch (refreshError) {
          console.error('Token刷新失败:', refreshError)
        } finally {
          isRefreshing = false
        }
      } else {
        // 正在刷新中，将请求加入队列等待
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${newToken}`
            resolve(request(config))
          })
        })
      }
      
      // 刷新失败，退出登录
      await authStore.logout()
      ElMessage.error('登录已过期，请重新登录')
      return Promise.reject(error)
    }
    
    // 403 Forbidden - 无权限
    if (response?.status === 403) {
      ElMessage.error('没有操作权限')
    }
    
    // 其他错误
    const errorMsg = (response?.data as any)?.message || '请求失败'
    ElMessage.error(errorMsg)
    
    return Promise.reject(error)
  }
)

export default request
```

#### 6.2.3 路由守卫

```typescript
// router/guards.ts
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

// 白名单路由（无需登录）
const whiteList = ['/login', '/register', '/forget-password', '/404']

export function setupRouterGuards(router: Router) {
  // 前置守卫
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    // 设置页面标题
    document.title = to.meta.title ? `${to.meta.title} - Linsir` : 'Linsir'
    
    // 检查是否在白名单
    if (whiteList.includes(to.path)) {
      // 已登录用户访问登录页，跳转到首页
      if (authStore.isLoggedIn && to.path === '/login') {
        next('/')
        return
      }
      next()
      return
    }
    
    // 检查是否已登录
    if (!authStore.isLoggedIn) {
      ElMessage.warning('请先登录')
      next(`/login?redirect=${to.path}`)
      return
    }
    
    // 检查路由权限
    if (to.meta.permission) {
      const hasPermission = authStore.userInfo?.permissions?.includes(to.meta.permission as string)
      if (!hasPermission) {
        ElMessage.error('没有访问权限')
        next('/403')
        return
      }
    }
    
    next()
  })
  
  // 后置守卫
  router.afterEach(() => {
    // 关闭loading等
  })
  
  // 错误处理
  router.onError((error) => {
    console.error('路由错误:', error)
  })
}
```

#### 6.2.4 XSS防护

```typescript
// utils/security.ts

/**
 * 转义HTML特殊字符（防XSS）
 */
export function escapeHtml(str: string): string {
  if (!str) return str
  
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char])
}

/**
 * 净化URL（防钓鱼）
 */
export function sanitizeUrl(url: string): string {
  // 只允许http/https协议
  if (!url.match(/^https?:\/\//i)) {
    return 'about:blank'
  }
  return url
}

/**
 * 安全地解析JSON（防原型链污染）
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    // 使用reviver函数过滤危险键
    return JSON.parse(json, (key, value) => {
      // 过滤原型链相关键
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return undefined
      }
      return value
    })
  } catch {
    return defaultValue
  }
}

/**
 * 生成随机Token（防CSRF）
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}
```

#### 6.2.5 页面可见性监听（防止Token泄露）

```typescript
// composables/usePageVisibility.ts
import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function usePageVisibility() {
  const authStore = useAuthStore()
  
  let visibilityTimeout: NodeJS.Timeout | null = null
  
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // 页面隐藏，设置超时清除敏感数据
      visibilityTimeout = setTimeout(() => {
        // 可选：清除内存中的敏感数据
        // authStore.clearSensitiveData()
        console.log('页面长时间未激活，敏感数据已清理')
      }, 5 * 60 * 1000) // 5分钟
    } else {
      // 页面显示，清除超时
      if (visibilityTimeout) {
        clearTimeout(visibilityTimeout)
        visibilityTimeout = null
      }
    }
  }
  
  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })
  
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    if (visibilityTimeout) {
      clearTimeout(visibilityTimeout)
    }
  })
}
```

### 6.3 前端安全最佳实践

| 安全措施 | 实现方式 | 说明 |
|---------|---------|------|
| Token存储 | Memory + HttpOnly Cookie | Access Token存内存，Refresh Token存Cookie |
| Token刷新 | 自动静默刷新 | 401时自动刷新，避免用户感知 |
| 并发控制 | 请求队列 | 刷新Token时排队等待 |
| XSS防护 | 输入转义 | 所有用户输入转义后展示 |
| CSRF防护 | SameSite Cookie | Cookie设置SameSite=Strict |
| 会话超时 | 页面可见性监听 | 长时间未操作清理敏感数据 |
| 安全响应头 | Nginx配置 | CSP、HSTS、X-Frame-Options |

---

## 7. 后端安全配置

### 7.1 密码安全

```java
@Component
public class PasswordEncoder {
    
    private static final int STRENGTH = 10;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(STRENGTH);
    
    /**
     * 密码加密
     */
    public String encode(String rawPassword) {
        return encoder.encode(rawPassword);
    }
    
    /**
     * 密码验证
     */
    public boolean matches(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }
    
    /**
     * 密码强度校验
     */
    public boolean isStrongPassword(String password) {
        // 至少8位，包含大小写字母、数字、特殊字符
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        return Pattern.matches(regex, password);
    }
}
```

### 6.2 安全响应头

```java
@Component
public class SecurityHeadersFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // 防止点击劫持
        httpResponse.setHeader("X-Frame-Options", "DENY");
        
        // XSS防护
        httpResponse.setHeader("X-XSS-Protection", "1; mode=block");
        
        // 内容类型嗅探防护
        httpResponse.setHeader("X-Content-Type-Options", "nosniff");
        
        // HSTS
        httpResponse.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        
        // CSP
        httpResponse.setHeader("Content-Security-Policy", 
            "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
        
        chain.doFilter(request, response);
    }
}
```

### 6.3 登录安全策略

```yaml
security:
  login:
    # 登录失败锁定
    max-fail-attempts: 5           # 最大失败次数
    lock-duration: 30m             # 锁定时间
    
    # 验证码策略
    captcha:
      enabled: true
      max-fail-before-captcha: 3   # 失败3次后需要验证码
      
    # 会话安全
    session:
      max-concurrent: 1            # 单用户最大并发会话数
      timeout: 2h                  # 会话超时时间
      
    # IP限制
    ip:
      whitelist:                   # IP白名单
        - "192.168.1.0/24"
      blacklist:                   # IP黑名单
        - "10.0.0.100"
```

---

## 7. 接口安全设计

### 7.1 API安全策略

| 策略 | 实现方式 | 说明 |
|-----|---------|------|
| HTTPS | TLS 1.3 | 强制HTTPS传输 |
| 请求签名 | HMAC-SHA256 | 防篡改 |
| 请求限流 | 令牌桶算法 | 防暴力破解 |
| 防重放 | 时间戳+随机数 | 防重放攻击 |

### 7.2 网关安全配置

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: system-service
          uri: lb://system-service
          predicates:
            - Path=/api/system/**
          filters:
            - StripPrefix=1
            # 请求限流
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 100
                redis-rate-limiter.burstCapacity: 200
                key-resolver: "#{@userKeyResolver}"
            # 重试
            - name: Retry
              args:
                retries: 3
                statuses: BAD_GATEWAY,SERVICE_UNAVAILABLE
```

---

## 8. 修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 架构师 | 初始版本，定义认证授权架构设计 |
