# 服务交互设计

> **文档编号**: SYS-DES-ARCH-SVC-002  
> **版本**: 1.0  
> **创建日期**: 2026-03-08  
> **作者**: 架构师  
> **状态**: ✅ 已完成

---

## 1. 概述

### 1.1 目的

本文档定义System平台的服务交互设计，包括服务间调用方式、通信协议、数据格式、异常处理等规范。

### 1.2 设计原则

1. **同步调用最小化**：优先使用异步消息，减少同步调用
2. **服务自治**：每个服务独立管理自己的数据
3. **最终一致性**：接受分布式系统的最终一致性
4. **熔断降级**：服务调用失败时自动熔断降级
5. **幂等设计**：关键接口支持幂等调用

---

## 2. 服务交互架构

```
┌─────────────────────────────────────────────────────────────┐
│                    服务交互架构图                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    HTTP/REST    ┌─────────────────────┐   │
│  │   前端      │ ◀──────────────▶ │      Gateway        │   │
│  └─────────────┘                  └──────────┬──────────┘   │
│                                              │              │
│                                              │ HTTP/REST    │
│                                              ▼              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    System服务                        │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│  │  │ 用户模块 │ │ 员工模块 │ │ 权限模块 │ │ 组织模块 │   │   │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │   │
│  │       └───────────┴───────────┴───────────┘         │   │
│  │                      │                              │   │
│  │                      │ 内部调用（本地方法）          │   │
│  │                      ▼                              │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │           共享数据库 (MySQL)                 │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────┬───────────────────────────┘   │
│                            │ HTTP/REST                    │
│              ┌─────────────┼─────────────┐                │
│              ▼             ▼             ▼                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │Config服务   │ │Audit服务    │ │Notify服务   │         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
│                            │                              │
│                            │ Message Queue                │
│                            ▼                              │
│  ┌─────────────┐ ┌─────────────┐                         │
│  │File服务     │ │Message服务  │                         │
│  └─────────────┘ └─────────────┘                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 服务间通信方式

### 3.1 通信方式选择

| 场景 | 通信方式 | 说明 |
|-----|---------|------|
| 前端 ↔ Gateway | HTTP/REST | 标准REST API |
| Gateway ↔ System | HTTP/REST | 同步调用 |
| System ↔ Config | HTTP/REST | 同步调用，配置读取 |
| System ↔ Audit | HTTP/REST | 异步调用（日志记录） |
| System ↔ Notify | Message Queue | 异步通知 |
| System ↔ File | HTTP/REST | 同步调用，文件操作 |
| System ↔ Message | Message Queue | 异步消息 |

### 3.2 同步调用（HTTP/REST）

#### 3.2.1 调用方式

```java
/**
 * 服务间同步调用示例 - System服务调用Config服务
 */
@Service
public class ConfigClient {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Value("${service.config.url}")
    private String configServiceUrl;
    
    /**
     * 获取配置值
     */
    public String getConfigValue(String configKey) {
        String url = configServiceUrl + "/api/config/values/" + configKey;
        
        ResponseEntity<Result<String>> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            createRequestEntity(),
            new ParameterizedTypeReference<Result<String>>() {}
        );
        
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return response.getBody().getData();
        }
        
        // 降级处理：返回默认值
        return getDefaultValue(configKey);
    }
    
    private HttpEntity<Void> createRequestEntity() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Request-From", "system-service");
        headers.set("X-Tenant-Id", TenantContext.getCurrentTenantId());
        return new HttpEntity<>(headers);
    }
}
```

#### 3.2.2 Feign客户端（推荐）

```java
/**
 * Config服务Feign客户端
 */
@FeignClient(
    name = "config-service",
    url = "${service.config.url}",
    fallbackFactory = ConfigClientFallbackFactory.class
)
public interface ConfigClient {
    
    @GetMapping("/api/config/values/{key}")
    Result<String> getConfigValue(@PathVariable("key") String key);
    
    @GetMapping("/api/config/values/batch")
    Result<Map<String, String>> getConfigValues(@RequestParam("keys") List<String> keys);
}

/**
 * 降级处理
 */
@Component
@Slf4j
public class ConfigClientFallbackFactory implements FallbackFactory<ConfigClient> {
    
    @Override
    public ConfigClient create(Throwable cause) {
        log.error("Config服务调用失败，触发降级", cause);
        
        return new ConfigClient() {
            @Override
            public Result<String> getConfigValue(String key) {
                // 返回本地缓存或默认值
                return Result.success(getLocalDefaultValue(key));
            }
            
            @Override
            public Result<Map<String, String>> getConfigValues(List<String> keys) {
                Map<String, String> defaults = new HashMap<>();
                keys.forEach(key -> defaults.put(key, getLocalDefaultValue(key)));
                return Result.success(defaults);
            }
        };
    }
}
```

### 3.3 异步调用（消息队列）

#### 3.3.1 消息生产者

```java
/**
 * 通知消息生产者
 */
@Service
@Slf4j
public class NotifyMessageProducer {
    
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    private static final String NOTIFY_QUEUE = "queue:notify";
    
    /**
     * 发送站内通知
     */
    public void sendSiteMessage(Long userId, String title, String content) {
        NotifyMessage message = NotifyMessage.builder()
            .type(NotifyType.SITE)
            .userId(userId)
            .title(title)
            .content(content)
            .createTime(LocalDateTime.now())
            .build();
        
        try {
            String json = JSONUtil.toJsonStr(message);
            redisTemplate.opsForList().rightPush(NOTIFY_QUEUE, json);
            log.info("通知消息已发送: userId={}, title={}", userId, title);
        } catch (Exception e) {
            log.error("通知消息发送失败", e);
            // 降级：保存到数据库，定时任务补偿
            saveToDbForRetry(message);
        }
    }
    
    /**
     * 发送短信通知
     */
    public void sendSmsMessage(String phone, String templateCode, Map<String, String> params) {
        SmsMessage message = SmsMessage.builder()
            .type(NotifyType.SMS)
            .phone(phone)
            .templateCode(templateCode)
            .params(params)
            .createTime(LocalDateTime.now())
            .build();
        
        try {
            String json = JSONUtil.toJsonStr(message);
            redisTemplate.opsForList().rightPush(NOTIFY_QUEUE, json);
            log.info("短信消息已发送: phone={}, template={}", phone, templateCode);
        } catch (Exception e) {
            log.error("短信消息发送失败", e);
            saveToDbForRetry(message);
        }
    }
    
    private void saveToDbForRetry(Object message) {
        // 保存到数据库，定时任务补偿发送
        // TODO: 实现补偿机制
    }
}
```

#### 3.3.2 消息消费者

```java
/**
 * 通知消息消费者
 */
@Component
@Slf4j
public class NotifyMessageConsumer {
    
    @Autowired
    private NotifyService notifyService;
    
    @Autowired
    private SmsService smsService;
    
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    private static final String NOTIFY_QUEUE = "queue:notify";
    
    /**
     * 监听通知队列
     */
    @Scheduled(fixedDelay = 1000)
    public void consumeNotifyMessage() {
        String json = redisTemplate.opsForList().leftPop(NOTIFY_QUEUE);
        
        if (StrUtil.isBlank(json)) {
            return;
        }
        
        try {
            NotifyMessage message = JSONUtil.toBean(json, NotifyMessage.class);
            
            switch (message.getType()) {
                case SITE:
                    handleSiteMessage(message);
                    break;
                case SMS:
                    handleSmsMessage(JSONUtil.toBean(json, SmsMessage.class));
                    break;
                case EMAIL:
                    handleEmailMessage(JSONUtil.toBean(json, EmailMessage.class));
                    break;
                default:
                    log.warn("未知消息类型: {}", message.getType());
            }
        } catch (Exception e) {
            log.error("消息处理失败: {}", json, e);
            // 重试机制
            retryMessage(json);
        }
    }
    
    private void handleSiteMessage(NotifyMessage message) {
        notifyService.sendSiteMessage(message.getUserId(), message.getTitle(), message.getContent());
    }
    
    private void handleSmsMessage(SmsMessage message) {
        smsService.sendSms(message.getPhone(), message.getTemplateCode(), message.getParams());
    }
    
    private void retryMessage(String json) {
        // 实现重试逻辑，超过最大重试次数后转入死信队列
        // TODO: 实现重试机制
    }
}
```

---

## 4. 服务调用规范

### 4.1 调用链路

```
┌─────────────────────────────────────────────────────────────┐
│                    服务调用链路图                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  前端请求                                                    │
│     │                                                       │
│     ▼                                                       │
│  ┌─────────────┐                                            │
│  │   Gateway   │  1. 路由转发                                │
│  │             │  2. 认证鉴权                                │
│  │             │  3. 限流熔断                                │
│  └──────┬──────┘                                            │
│         │                                                   │
│         │ HTTP/REST                                         │
│         ▼                                                   │
│  ┌─────────────┐                                            │
│  │System服务   │  1. 参数校验                                │
│  │             │  2. 业务处理                                │
│  │             │  3. 数据持久化                              │
│  │             │  4. 发送异步消息                            │
│  └──────┬──────┘                                            │
│         │                                                   │
│         ├──▶ Config服务 (同步)                              │
│         │      读取系统配置                                  │
│         │                                                   │
│         ├──▶ Audit服务 (异步)                               │
│         │      记录操作日志                                  │
│         │                                                   │
│         └──▶ Message Queue                                  │
│                发送通知消息                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 接口设计规范

#### 4.2.1 URL规范

```
/api/{service}/{module}/{resource}/{action}

示例：
- /api/system/users              # 用户列表
- /api/system/users/{id}         # 用户详情
- /api/system/users/{id}/roles   # 用户角色
- /api/config/values/{key}       # 配置值
- /api/audit/logs/operation      # 操作日志
```

#### 4.2.2 请求方法规范

| 方法 | 用途 | 示例 |
|-----|------|------|
| GET | 查询 | GET /api/system/users |
| POST | 创建 | POST /api/system/users |
| PUT | 全量更新 | PUT /api/system/users/{id} |
| PATCH | 部分更新 | PATCH /api/system/users/{id}/status |
| DELETE | 删除 | DELETE /api/system/users/{id} |

#### 4.2.3 请求头规范

| 请求头 | 说明 | 示例 |
|-------|------|------|
| Authorization | 认证Token | Bearer eyJhbG... |
| X-Tenant-Id | 租户ID | 1001 |
| X-Request-Id | 请求ID（链路追踪） | req-123456 |
| X-Request-From | 请求来源 | system-service |
| Content-Type | 内容类型 | application/json |

### 4.3 响应规范

#### 4.3.1 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员"
  },
  "timestamp": 1709904000000
}
```

#### 4.3.2 分页响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {"id": 1, "username": "admin"},
      {"id": 2, "username": "user1"}
    ],
    "total": 100,
    "pageNum": 1,
    "pageSize": 10,
    "pages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "timestamp": 1709904000000
}
```

#### 4.3.3 错误响应

```json
{
  "code": 400,
  "message": "参数校验失败：用户名不能为空",
  "data": null,
  "timestamp": 1709904000000
}
```

### 4.4 异常处理规范

#### 4.4.1 全局异常处理

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
        return Result.error(400, "参数校验失败：" + message);
    }
    
    /**
     * 服务调用异常
     */
    @ExceptionHandler(ServiceCallException.class)
    public Result<Void> handleServiceCallException(ServiceCallException e) {
        log.error("服务调用异常: {}", e.getMessage(), e);
        return Result.error(503, "服务暂时不可用，请稍后重试");
    }
    
    /**
     * 其他异常
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("系统异常: {}", e.getMessage(), e);
        return Result.error(500, "系统繁忙，请稍后重试");
    }
}
```

---

## 5. 熔断降级设计

### 5.1 熔断器配置

```yaml
# Resilience4j熔断配置
resilience4j:
  circuitbreaker:
    instances:
      configService:
        registerHealthIndicator: true
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
        waitDurationInOpenState: 10s
        failureRateThreshold: 50
        eventConsumerBufferSize: 10
```

### 5.2 熔断器使用

```java
@Service
@Slf4j
public class ConfigService {
    
    @Autowired
    private ConfigClient configClient;
    
    @CircuitBreaker(name = "configService", fallbackMethod = "getConfigValueFallback")
    public String getConfigValue(String key) {
        Result<String> result = configClient.getConfigValue(key);
        if (result.getCode() == 200) {
            return result.getData();
        }
        throw new ServiceCallException("Config服务调用失败");
    }
    
    /**
     * 降级方法
     */
    public String getConfigValueFallback(String key, Throwable throwable) {
        log.warn("Config服务降级，key={}, error={}", key, throwable.getMessage());
        return getLocalDefaultValue(key);
    }
    
    private String getLocalDefaultValue(String key) {
        // 从本地缓存或配置文件获取默认值
        Map<String, String> defaults = new HashMap<>();
        defaults.put("system.name", "System平台");
        defaults.put("system.logo", "/logo.png");
        defaults.put("upload.maxSize", "10485760");
        return defaults.getOrDefault(key, "");
    }
}
```

---

## 6. 幂等设计

### 6.1 幂等性保证

```java
/**
 * 幂等性拦截器
 */
@Component
public class IdempotencyInterceptor implements HandlerInterceptor {
    
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    private static final String IDEMPOTENCY_KEY_PREFIX = "idempotency:";
    private static final long IDEMPOTENCY_EXPIRE = 60; // 60秒
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 只处理POST/PUT/DELETE请求
        String method = request.getMethod();
        if (!Arrays.asList("POST", "PUT", "DELETE").contains(method)) {
            return true;
        }
        
        // 获取幂等性Token
        String idempotencyKey = request.getHeader("X-Idempotency-Key");
        if (StrUtil.isBlank(idempotencyKey)) {
            return true; // 没有Token，不保证幂等
        }
        
        // 检查是否已处理
        String key = IDEMPOTENCY_KEY_PREFIX + idempotencyKey;
        Boolean success = redisTemplate.opsForValue().setIfAbsent(key, "1", IDEMPOTENCY_EXPIRE, TimeUnit.SECONDS);
        
        if (Boolean.FALSE.equals(success)) {
            // 重复请求
            throw new BusinessException(409, "重复请求，请稍后重试");
        }
        
        return true;
    }
}
```

### 6.2 使用示例

```java
/**
 * 创建用户（支持幂等）
 */
@PostMapping("/users")
public Result<UserVO> createUser(@RequestBody @Valid UserCreateDTO dto,
                                  @RequestHeader("X-Idempotency-Key") String idempotencyKey) {
    UserVO vo = userService.createUser(dto);
    return Result.success(vo);
}
```

---

## 7. 链路追踪

### 7.1 TraceId传递

```java
/**
 * TraceId过滤器
 */
@Component
public class TraceIdFilter implements Filter {
    
    private static final String TRACE_ID_HEADER = "X-Request-Id";
    private static final String TRACE_ID_MDC_KEY = "traceId";
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String traceId = httpRequest.getHeader(TRACE_ID_HEADER);
        
        if (StrUtil.isBlank(traceId)) {
            traceId = generateTraceId();
        }
        
        // 放入MDC，日志中自动打印
        MDC.put(TRACE_ID_MDC_KEY, traceId);
        
        try {
            chain.doFilter(request, response);
        } finally {
            MDC.remove(TRACE_ID_MDC_KEY);
        }
    }
    
    private String generateTraceId() {
        return "req-" + System.currentTimeMillis() + "-" + RandomUtil.randomNumbers(6);
    }
}
```

### 7.2 Feign TraceId传递

```java
/**
 * Feign请求拦截器 - 传递TraceId
 */
@Component
public class FeignTraceIdInterceptor implements RequestInterceptor {
    
    @Override
    public void apply(RequestTemplate template) {
        String traceId = MDC.get("traceId");
        if (StrUtil.isNotBlank(traceId)) {
            template.header("X-Request-Id", traceId);
        }
        
        // 传递租户ID
        String tenantId = TenantContext.getCurrentTenantId();
        if (StrUtil.isNotBlank(tenantId)) {
            template.header("X-Tenant-Id", tenantId);
        }
    }
}
```

---

## 8. 服务接口清单

### 8.1 System服务接口

| 接口 | 方法 | 路径 | 说明 |
|-----|------|------|------|
| 用户列表 | GET | /api/system/users | 分页查询用户 |
| 用户详情 | GET | /api/system/users/{id} | 查询用户详情 |
| 创建用户 | POST | /api/system/users | 创建用户 |
| 更新用户 | PUT | /api/system/users/{id} | 更新用户 |
| 删除用户 | DELETE | /api/system/users/{id} | 删除用户 |
| 登录 | POST | /api/system/auth/login | 用户登录 |
| 刷新Token | POST | /api/system/auth/refresh | 刷新Token |
| 登出 | POST | /api/system/auth/logout | 用户登出 |
| 角色列表 | GET | /api/system/roles | 查询角色列表 |
| 权限列表 | GET | /api/system/permissions | 查询权限列表 |
| 部门树 | GET | /api/system/depts/tree | 查询部门树 |

### 8.2 Config服务接口

| 接口 | 方法 | 路径 | 说明 |
|-----|------|------|------|
| 获取配置 | GET | /api/config/values/{key} | 获取单个配置 |
| 批量获取 | GET | /api/config/values/batch | 批量获取配置 |
| 获取分类配置 | GET | /api/config/categories/{category} | 获取分类下所有配置 |

### 8.3 Audit服务接口

| 接口 | 方法 | 路径 | 说明 |
|-----|------|------|------|
| 记录操作日志 | POST | /api/audit/operation-logs | 记录操作日志（内部） |
| 查询操作日志 | GET | /api/audit/operation-logs | 查询操作日志 |
| 查询登录日志 | GET | /api/audit/login-logs | 查询登录日志 |

---

## 9. 修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 架构师 | 初始版本，定义服务交互设计 |
