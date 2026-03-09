# 后端组件设计

> **文档编号**: SYS-DES-ARCH-COMP-002  
> **版本**: 1.0  
> **创建日期**: 2026-03-08  
> **作者**: 架构师  
> **状态**: ✅ 已完成

---

## 1. 概述

### 1.1 目的

本文档定义System平台后端组件设计规范，包括统一响应封装、全局异常处理、数据校验组件等，确保后端开发的一致性和可维护性。

### 1.2 设计原则

1. **统一规范**：统一响应格式、异常处理、日志记录
2. **高内聚低耦合**：组件职责单一，依赖关系清晰
3. **可扩展性**：易于扩展和定制
4. **可测试性**：便于单元测试和集成测试

---

## 2. 基础组件选型

System平台后端组件基于 **Spring Boot 3.2.x** 生态进行封装和扩展。

> **技术选型详情** 请参考架构技术清单文档。

### 2.1 组件封装策略

System平台后端组件采用**基于Spring生态扩展**的策略：

1. **Starter封装**：基于Spring Boot Starter机制封装通用组件
2. **自动配置**：利用Spring Boot自动配置简化组件使用
3. **注解驱动**：通过注解简化组件配置和使用

## 3. 统一响应封装

### 3.1 响应对象设计

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Result<T> implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    /**
     * 状态码
     */
    private Integer code;
    
    /**
     * 消息
     */
    private String message;
    
    /**
     * 数据
     */
    private T data;
    
    /**
     * 时间戳
     */
    private Long timestamp;
    
    /**
     * 请求ID
     */
    private String requestId;
    
    public Result() {
        this.timestamp = System.currentTimeMillis();
        this.requestId = MDC.get("traceId");
    }
    
    // 成功响应
    public static <T> Result<T> success() {
        return Result.<T>builder()
                .code(ResultCode.SUCCESS.getCode())
                .message(ResultCode.SUCCESS.getMessage())
                .timestamp(System.currentTimeMillis())
                .requestId(MDC.get("traceId"))
                .build();
    }
    
    public static <T> Result<T> success(T data) {
        return Result.<T>builder()
                .code(ResultCode.SUCCESS.getCode())
                .message(ResultCode.SUCCESS.getMessage())
                .data(data)
                .timestamp(System.currentTimeMillis())
                .requestId(MDC.get("traceId"))
                .build();
    }
    
    public static <T> Result<T> success(String message, T data) {
        return Result.<T>builder()
                .code(ResultCode.SUCCESS.getCode())
                .message(message)
                .data(data)
                .timestamp(System.currentTimeMillis())
                .requestId(MDC.get("traceId"))
                .build();
    }
    
    // 失败响应
    public static <T> Result<T> error(String message) {
        return Result.<T>builder()
                .code(ResultCode.ERROR.getCode())
                .message(message)
                .timestamp(System.currentTimeMillis())
                .requestId(MDC.get("traceId"))
                .build();
    }
    
    public static <T> Result<T> error(ResultCode resultCode) {
        return Result.<T>builder()
                .code(resultCode.getCode())
                .message(resultCode.getMessage())
                .timestamp(System.currentTimeMillis())
                .requestId(MDC.get("traceId"))
                .build();
    }
    
    public static <T> Result<T> error(Integer code, String message) {
        return Result.<T>builder()
                .code(code)
                .message(message)
                .timestamp(System.currentTimeMillis())
                .requestId(MDC.get("traceId"))
                .build();
    }
}
```

### 2.2 状态码枚举

```java
@Getter
@AllArgsConstructor
public enum ResultCode {
    
    // 成功
    SUCCESS(200, "操作成功"),
    
    // 客户端错误
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未授权"),
    FORBIDDEN(403, "禁止访问"),
    NOT_FOUND(404, "资源不存在"),
    METHOD_NOT_ALLOWED(405, "请求方法不允许"),
    
    // 服务端错误
    ERROR(500, "服务器内部错误"),
    SERVICE_UNAVAILABLE(503, "服务不可用"),
    
    // 业务错误
    USER_NOT_FOUND(1001, "用户不存在"),
    USER_ALREADY_EXISTS(1002, "用户已存在"),
    PASSWORD_ERROR(1003, "密码错误"),
    ACCOUNT_LOCKED(1004, "账号已被锁定"),
    TOKEN_EXPIRED(1005, "令牌已过期"),
    TOKEN_INVALID(1006, "令牌无效"),
    PERMISSION_DENIED(1007, "权限不足"),
    
    // 数据错误
    DATA_NOT_FOUND(2001, "数据不存在"),
    DATA_ALREADY_EXISTS(2002, "数据已存在"),
    DATA_VALIDATION_ERROR(2003, "数据验证失败");
    
    private final Integer code;
    private final String message;
}
```

### 2.3 分页响应

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageResult<T> implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    /**
     * 当前页
     */
    private Long current;
    
    /**
     * 每页大小
     */
    private Long size;
    
    /**
     * 总记录数
     */
    private Long total;
    
    /**
     * 总页数
     */
    private Long pages;
    
    /**
     * 数据列表
     */
    private List<T> records;
    
    /**
     * 是否有下一页
     */
    private Boolean hasNext;
    
    /**
     * 是否有上一页
     */
    private Boolean hasPrevious;
    
    public static <T> PageResult<T> of(IPage<T> page) {
        return PageResult.<T>builder()
                .current(page.getCurrent())
                .size(page.getSize())
                .total(page.getTotal())
                .pages(page.getPages())
                .records(page.getRecords())
                .hasNext(page.getCurrent() < page.getPages())
                .hasPrevious(page.getCurrent() > 1)
                .build();
    }
    
    public static <T> PageResult<T> of(Long current, Long size, Long total, List<T> records) {
        long pages = (total + size - 1) / size;
        return PageResult.<T>builder()
                .current(current)
                .size(size)
                .total(total)
                .pages(pages)
                .records(records)
                .hasNext(current < pages)
                .hasPrevious(current > 1)
                .build();
    }
}
```

---

## 4. 全局异常处理

### 4.1 异常体系设计

```java
/**
 * 基础业务异常
 */
@Getter
public class BusinessException extends RuntimeException {
    
    private final Integer code;
    
    public BusinessException(String message) {
        super(message);
        this.code = ResultCode.ERROR.getCode();
    }
    
    public BusinessException(ResultCode resultCode) {
        super(resultCode.getMessage());
        this.code = resultCode.getCode();
    }
    
    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }
}

/**
 * 参数验证异常
 */
@Getter
public class ValidationException extends BusinessException {
    
    private final List<FieldError> errors;
    
    public ValidationException(String message) {
        super(ResultCode.DATA_VALIDATION_ERROR.getCode(), message);
        this.errors = new ArrayList<>();
    }
    
    public ValidationException(List<FieldError> errors) {
        super(ResultCode.DATA_VALIDATION_ERROR.getCode(), "数据验证失败");
        this.errors = errors;
    }
    
    @Data
    @AllArgsConstructor
    public static class FieldError {
        private String field;
        private String message;
    }
}

/**
 * 认证异常
 */
@Getter
public class AuthenticationException extends BusinessException {
    
    public AuthenticationException(String message) {
        super(ResultCode.UNAUTHORIZED.getCode(), message);
    }
}

/**
 * 授权异常
 */
@Getter
public class AuthorizationException extends BusinessException {
    
    public AuthorizationException(String message) {
        super(ResultCode.FORBIDDEN.getCode(), message);
    }
}
```

### 3.2 全局异常处理器

```java
@Slf4j
@RestControllerAdvice
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
     * 参数验证异常
     */
    @ExceptionHandler(ValidationException.class)
    public Result<Void> handleValidationException(ValidationException e) {
        log.warn("参数验证异常: {}", e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }
    
    /**
     * MethodArgumentNotValidException
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        List<String> errors = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
        String message = String.join(", ", errors);
        log.warn("参数验证异常: {}", message);
        return Result.error(ResultCode.BAD_REQUEST.getCode(), message);
    }
    
    /**
     * ConstraintViolationException
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public Result<Void> handleConstraintViolationException(ConstraintViolationException e) {
        List<String> errors = e.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.toList());
        String message = String.join(", ", errors);
        log.warn("参数验证异常: {}", message);
        return Result.error(ResultCode.BAD_REQUEST.getCode(), message);
    }
    
    /**
     * 认证异常
     */
    @ExceptionHandler(AuthenticationException.class)
    public Result<Void> handleAuthenticationException(AuthenticationException e) {
        log.warn("认证异常: {}", e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }
    
    /**
     * 授权异常
     */
    @ExceptionHandler(AuthorizationException.class)
    public Result<Void> handleAuthorizationException(AuthorizationException e) {
        log.warn("授权异常: {}", e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }
    
    /**
     * 其他异常
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("系统异常: ", e);
        return Result.error(ResultCode.ERROR.getCode(), "系统繁忙，请稍后重试");
    }
}
```

---

## 5. 数据校验组件

### 5.1 校验注解

```java
/**
 * 手机号校验
 */
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PhoneValidator.class)
public @interface Phone {
    String message() default "手机号格式不正确";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

/**
 * 手机号校验器
 */
public class PhoneValidator implements ConstraintValidator<Phone, String> {
    
    private static final Pattern PHONE_PATTERN = Pattern.compile("^1[3-9]\\d{9}$");
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (StrUtil.isBlank(value)) {
            return true;
        }
        return PHONE_PATTERN.matcher(value).matches();
    }
}

/**
 * 身份证号校验
 */
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = IdCardValidator.class)
public @interface IdCard {
    String message() default "身份证号格式不正确";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

/**
 * 枚举值校验
 */
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = EnumValidator.class)
public @interface EnumValue {
    String message() default "枚举值不正确";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    
    /**
     * 枚举类
     */
    Class<? extends Enum<?>> enumClass();
    
    /**
     * 枚举值字段名
     */
    String enumField() default "code";
}
```

### 4.2 校验工具类

```java
@Component
public class ValidationUtils {
    
    @Autowired
    private Validator validator;
    
    /**
     * 校验对象
     */
    public void validate(Object object, Class<?>... groups) {
        Set<ConstraintViolation<Object>> violations = validator.validate(object, groups);
        if (!violations.isEmpty()) {
            List<ValidationException.FieldError> errors = violations.stream()
                    .map(v -> new ValidationException.FieldError(
                            v.getPropertyPath().toString(),
                            v.getMessage()
                    ))
                    .collect(Collectors.toList());
            throw new ValidationException(errors);
        }
    }
    
    /**
     * 校验对象并返回错误信息
     */
    public List<String> validateAndGetErrors(Object object, Class<?>... groups) {
        Set<ConstraintViolation<Object>> violations = validator.validate(object, groups);
        return violations.stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .collect(Collectors.toList());
    }
    
    /**
     * 校验是否通过
     */
    public boolean isValid(Object object, Class<?>... groups) {
        Set<ConstraintViolation<Object>> violations = validator.validate(object, groups);
        return violations.isEmpty();
    }
}
```

---

## 6. 日志组件

### 6.1 操作日志注解

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface OperationLog {
    
    /**
     * 模块名称
     */
    String module();
    
    /**
     * 操作类型
     */
    OperationType type();
    
    /**
     * 操作描述
     */
    String description() default "";
    
    /**
     * 是否保存请求参数
     */
    boolean saveParams() default true;
    
    /**
     * 是否保存响应结果
     */
    boolean saveResult() default false;
}

public enum OperationType {
    CREATE("新增"),
    UPDATE("修改"),
    DELETE("删除"),
    QUERY("查询"),
    EXPORT("导出"),
    IMPORT("导入"),
    LOGIN("登录"),
    LOGOUT("登出"),
    OTHER("其他");
    
    private final String label;
    
    OperationType(String label) {
        this.label = label;
    }
    
    public String getLabel() {
        return label;
    }
}
```

### 5.2 操作日志切面

```java
@Slf4j
@Aspect
@Component
public class OperationLogAspect {
    
    @Autowired
    private OperationLogService operationLogService;
    
    @Around("@annotation(operationLog)")
    public Object around(ProceedingJoinPoint point, OperationLog operationLog) throws Throwable {
        // 获取请求信息
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        
        // 获取登录用户
        LoginUser loginUser = SecurityUtils.getLoginUser();
        
        // 构建日志对象
        OperationLogEntity logEntity = new OperationLogEntity();
        logEntity.setModule(operationLog.module());
        logEntity.setType(operationLog.type().name());
        logEntity.setDescription(operationLog.description());
        logEntity.setRequestUrl(request.getRequestURI());
        logEntity.setRequestMethod(request.getMethod());
        logEntity.setIpAddress(IpUtils.getIpAddress(request));
        logEntity.setUserId(loginUser != null ? loginUser.getUserId() : null);
        logEntity.setUsername(loginUser != null ? loginUser.getUsername() : null);
        logEntity.setStartTime(LocalDateTime.now());
        
        // 保存请求参数
        if (operationLog.saveParams()) {
            logEntity.setRequestParams(JSONUtil.toJsonStr(point.getArgs()));
        }
        
        Object result;
        try {
            // 执行方法
            result = point.proceed();
            
            // 设置成功状态
            logEntity.setStatus(1);
            
            // 保存响应结果
            if (operationLog.saveResult()) {
                logEntity.setResponseResult(JSONUtil.toJsonStr(result));
            }
            
        } catch (Exception e) {
            // 设置失败状态
            logEntity.setStatus(0);
            logEntity.setErrorMsg(e.getMessage());
            throw e;
        } finally {
            // 设置结束时间和耗时
            logEntity.setEndTime(LocalDateTime.now());
            logEntity.setDuration(ChronoUnit.MILLIS.between(logEntity.getStartTime(), logEntity.getEndTime()));
            
            // 异步保存日志
            operationLogService.saveLog(logEntity);
        }
        
        return result;
    }
}
```

---

## 7. 工具类组件

### 7.1 安全工具类

```java
@Component
public class SecurityUtils {
    
    /**
     * 获取当前登录用户
     */
    public static LoginUser getLoginUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof LoginUser) {
            return (LoginUser) authentication.getPrincipal();
        }
        return null;
    }
    
    /**
     * 获取当前用户ID
     */
    public static Long getUserId() {
        LoginUser loginUser = getLoginUser();
        return loginUser != null ? loginUser.getUserId() : null;
    }
    
    /**
     * 获取当前租户ID
     */
    public static Long getTenantId() {
        LoginUser loginUser = getLoginUser();
        return loginUser != null ? loginUser.getTenantId() : null;
    }
    
    /**
     * 判断是否已登录
     */
    public static boolean isAuthenticated() {
        return getLoginUser() != null;
    }
    
    /**
     * 判断是否有权限
     */
    public static boolean hasPermission(String permission) {
        LoginUser loginUser = getLoginUser();
        if (loginUser == null) {
            return false;
        }
        return loginUser.getPermissions().contains(permission);
    }
    
    /**
     * 判断是否有角色
     */
    public static boolean hasRole(String role) {
        LoginUser loginUser = getLoginUser();
        if (loginUser == null) {
            return false;
        }
        return loginUser.getRoles().contains(role);
    }
}
```

### 6.2 IP工具类

```java
public class IpUtils {
    
    private static final String UNKNOWN = "unknown";
    
    /**
     * 获取客户端IP地址
     */
    public static String getIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (isEmpty(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (isEmpty(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (isEmpty(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (isEmpty(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (isEmpty(ip)) {
            ip = request.getRemoteAddr();
        }
        
        // 多个代理情况，取第一个IP
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        
        return ip;
    }
    
    private static boolean isEmpty(String ip) {
        return ip == null || ip.isEmpty() || UNKNOWN.equalsIgnoreCase(ip);
    }
}
```

---

## 8. 组件使用规范

### 8.1 Controller层规范

```java
@RestController
@RequestMapping("/api/system/user")
@Tag(name = "用户管理")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/list")
    @Operation(summary = "用户列表")
    @OperationLog(module = "用户管理", type = OperationType.QUERY, description = "查询用户列表")
    public Result<PageResult<UserVO>> list(UserQuery query) {
        PageResult<UserVO> result = userService.queryPage(query);
        return Result.success(result);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "用户详情")
    public Result<UserVO> getById(@PathVariable Long id) {
        UserVO user = userService.getById(id);
        return Result.success(user);
    }
    
    @PostMapping
    @Operation(summary = "新增用户")
    @OperationLog(module = "用户管理", type = OperationType.CREATE, description = "新增用户")
    @PreAuthorize("hasPermission('user:create')")
    public Result<Void> create(@Validated @RequestBody UserDTO dto) {
        userService.create(dto);
        return Result.success();
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "修改用户")
    @OperationLog(module = "用户管理", type = OperationType.UPDATE, description = "修改用户")
    @PreAuthorize("hasPermission('user:update')")
    public Result<Void> update(@PathVariable Long id, @Validated @RequestBody UserDTO dto) {
        userService.update(id, dto);
        return Result.success();
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "删除用户")
    @OperationLog(module = "用户管理", type = OperationType.DELETE, description = "删除用户")
    @PreAuthorize("hasPermission('user:delete')")
    public Result<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return Result.success();
    }
}
```

### 7.2 Service层规范

```java
@Service
@Transactional(rollbackFor = Exception.class)
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Override
    public PageResult<UserVO> queryPage(UserQuery query) {
        // 构建查询条件
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StrUtil.isNotBlank(query.getUsername()), User::getUsername, query.getUsername())
               .like(StrUtil.isNotBlank(query.getRealName()), User::getRealName, query.getRealName())
               .eq(query.getDeptId() != null, User::getDeptId, query.getDeptId())
               .eq(query.getStatus() != null, User::getStatus, query.getStatus())
               .orderByDesc(User::getCreateTime);
        
        // 执行分页查询
        Page<User> page = userMapper.selectPage(new Page<>(query.getPageNum(), query.getPageSize()), wrapper);
        
        // 转换VO
        List<UserVO> voList = page.getRecords().stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
        
        return PageResult.of(page.getCurrent(), page.getSize(), page.getTotal(), voList);
    }
    
    @Override
    public void create(UserDTO dto) {
        // 校验用户名是否已存在
        if (userMapper.exists(new LambdaQueryWrapper<User>().eq(User::getUsername, dto.getUsername()))) {
            throw new BusinessException(ResultCode.USER_ALREADY_EXISTS);
        }
        
        // 创建用户
        User user = new User();
        BeanUtil.copyProperties(dto, user);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setCreateBy(SecurityUtils.getUserId());
        user.setCreateTime(LocalDateTime.now());
        
        userMapper.insert(user);
        
        // 保存用户角色关系
        saveUserRoles(user.getUserId(), dto.getRoleIds());
    }
    
    private UserVO convertToVO(User user) {
        UserVO vo = new UserVO();
        BeanUtil.copyProperties(user, vo);
        return vo;
    }
}
```

---

## 9. 输出文件

| 序号 | 文件名称 | 文件编号 | 说明 |
|-----|---------|---------|------|
| 1 | 前端组件设计 | SYS-DES-ARCH-COMP-001 | 前端组件规范 |
| 2 | 后端组件设计 | SYS-DES-ARCH-COMP-002 | 本文档 |
