# 数据安全架构设计

> **文档编号**: SYS-DES-ARCH-SEC-002  
> **版本**: 1.0  
> **创建日期**: 2026-03-08  
> **作者**: 架构师  
> **状态**: 🔄 进行中

---

## 1. 概述

### 1.1 目的

本文档定义System平台的数据安全架构设计，包括数据加密方案、敏感数据保护、审计日志方案，确保系统数据的机密性、完整性和可追溯性。

### 1.2 设计目标

| 目标 | 说明 |
|-----|------|
| 传输加密 | 所有数据传输采用TLS 1.3加密 |
| 存储加密 | 敏感数据字段级加密存储 |
| 密码安全 | 密码采用bcrypt算法加密存储 |
| 数据脱敏 | 敏感数据展示时脱敏处理 |
| 审计追溯 | 完整的数据操作审计日志 |

### 1.3 设计原则

1. **最小权限**：数据访问遵循最小权限原则
2. **加密优先**：敏感数据默认加密存储
3. **审计完整**：所有数据操作可追溯
4. **脱敏展示**：敏感数据前端展示脱敏

---

## 2. 数据安全架构总览

```
┌─────────────────────────────────────────────────────────────┐
│                    数据安全架构总览                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    传输层安全                        │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  • TLS 1.3 加密传输                          │   │   │
│  │  │  • 证书管理 (Let's Encrypt)                  │   │   │
│  │  │  • HSTS 强制HTTPS                            │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                               │
│                            ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    应用层安全                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │  数据加密   │ │  数据脱敏   │ │  数据校验   │   │   │
│  │  │  (AES/RSA)  │ │  (Masking)  │ │  (Sign)     │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                               │
│                            ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    存储层安全                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │  数据库加密 │ │  文件加密   │ │  密钥管理   │   │   │
│  │  │ (TDE/列级)  │ │ (AES-256)   │ │ (HSM/Vault) │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                               │
│                            ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    审计层                            │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │  操作日志   │ │  安全日志   │ │  审计报告   │   │   │
│  │  │ (MySQL)     │ │ (ELK)       │ │ (定时生成)  │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 传输层安全

### 3.1 TLS 1.3配置

#### 3.1.1 Nginx SSL配置

```nginx
# nginx.conf - SSL配置
server {
    listen 443 ssl http2;
    server_name api.linsir.com;
    
    # 证书配置
    ssl_certificate /etc/nginx/ssl/linsir.crt;
    ssl_certificate_key /etc/nginx/ssl/linsir.key;
    
    # TLS 1.3配置
    ssl_protocols TLSv1.3;
    ssl_ciphers TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256;
    ssl_prefer_server_ciphers off;
    
    # 会话缓存
    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/nginx/ssl/chain.crt;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # 安全响应头
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    location / {
        proxy_pass http://gateway_cluster;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTP自动跳转HTTPS
server {
    listen 80;
    server_name api.linsir.com;
    return 301 https://$server_name$request_uri;
}
```

#### 3.1.2 Spring Boot HTTPS配置

```yaml
# application-secure.yml
server:
  port: 8443
  ssl:
    enabled: true
    protocol: TLS
    enabled-protocols: TLSv1.3
    key-store: classpath:keystore.p12
    key-store-password: ${KEYSTORE_PASSWORD}
    key-store-type: PKCS12
    key-alias: linsir
```

### 3.2 证书管理

```yaml
# cert-manager配置 (Kubernetes)
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@linsir.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx

---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: linsir-tls
  namespace: linsir-prod
spec:
  secretName: linsir-tls-secret
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
    - api.linsir.com
    - admin.linsir.com
```

---

## 4. 存储层加密

### 4.1 数据库加密

#### 4.1.1 MySQL TDE配置

```ini
# my.cnf - 透明数据加密
[mysqld]
# 启用InnoDB表空间加密
early-plugin-load=keyring_file.so
keyring_file_data=/var/lib/mysql-keyring/keyring

# 默认加密所有新表
default_table_encryption=ON

# 加密日志
innodb_redo_log_encrypt=ON
innodb_undo_log_encrypt=ON
binlog_encryption=ON
```

#### 4.1.2 列级加密实现

```java
@Component
public class ColumnEncryption {
    
    @Value("${security.encryption.key}")
    private String encryptionKey;
    
    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;
    
    /**
     * 加密字段
     */
    public String encrypt(String plainText) {
        if (StringUtils.isEmpty(plainText)) {
            return plainText;
        }
        
        try {
            byte[] iv = new byte[GCM_IV_LENGTH];
            SecureRandom random = new SecureRandom();
            random.nextBytes(iv);
            
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            SecretKeySpec keySpec = new SecretKeySpec(encryptionKey.getBytes(StandardCharsets.UTF_8), "AES");
            
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, parameterSpec);
            byte[] encrypted = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            
            // IV + 密文
            byte[] combined = new byte[iv.length + encrypted.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(encrypted, 0, combined, iv.length, encrypted.length);
            
            return Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            throw new EncryptionException("加密失败", e);
        }
    }
    
    /**
     * 解密字段
     */
    public String decrypt(String encryptedText) {
        if (StringUtils.isEmpty(encryptedText)) {
            return encryptedText;
        }
        
        try {
            byte[] combined = Base64.getDecoder().decode(encryptedText);
            
            byte[] iv = new byte[GCM_IV_LENGTH];
            byte[] encrypted = new byte[combined.length - GCM_IV_LENGTH];
            
            System.arraycopy(combined, 0, iv, 0, iv.length);
            System.arraycopy(combined, iv.length, encrypted, 0, encrypted.length);
            
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            SecretKeySpec keySpec = new SecretKeySpec(encryptionKey.getBytes(StandardCharsets.UTF_8), "AES");
            
            cipher.init(Cipher.DECRYPT_MODE, keySpec, parameterSpec);
            byte[] decrypted = cipher.doFinal(encrypted);
            
            return new String(decrypted, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new EncryptionException("解密失败", e);
        }
    }
}
```

#### 4.1.3 MyBatis Plus加密拦截器

```java
@Intercepts({
    @Signature(type = Executor.class, method = "update", 
               args = {MappedStatement.class, Object.class})
})
@Component
public class EncryptionInterceptor implements Interceptor {
    
    @Autowired
    private ColumnEncryption columnEncryption;
    
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        Object parameter = invocation.getArgs()[1];
        
        if (parameter != null) {
            encryptFields(parameter);
        }
        
        return invocation.proceed();
    }
    
    private void encryptFields(Object parameter) {
        Class<?> clazz = parameter.getClass();
        
        for (Field field : clazz.getDeclaredFields()) {
            if (field.isAnnotationPresent(Encrypted.class)) {
                try {
                    field.setAccessible(true);
                    Object value = field.get(parameter);
                    if (value instanceof String) {
                        String encrypted = columnEncryption.encrypt((String) value);
                        field.set(parameter, encrypted);
                    }
                } catch (IllegalAccessException e) {
                    log.error("字段加密失败", e);
                }
            }
        }
    }
}

/**
 * 加密注解
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Encrypted {
}
```

### 4.2 敏感字段加密示例

```java
@Data
@TableName("sys_user")
public class User {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String username;
    
    @Encrypted
    private String email;
    
    @Encrypted
    private String phone;
    
    @Encrypted
    private String idCard;
    
    // 密码使用bcrypt加密，不使用AES
    private String password;
}
```

---

## 5. 数据脱敏

### 5.1 脱敏策略

| 字段类型 | 脱敏规则 | 示例 |
|---------|---------|------|
| 手机号 | 保留前3后4 | 138****8888 |
| 邮箱 | 保留首字母和域名 | z***@linsir.com |
| 身份证号 | 保留前6后4 | 110101********1234 |
| 银行卡号 | 保留后4位 | **** **** **** 1234 |
| 姓名 | 保留姓 | 张** |
| 地址 | 保留省市 | 北京市****** |

### 5.2 脱敏工具类

```java
@Component
public class DataMasking {
    
    /**
     * 手机号脱敏
     */
    public static String maskPhone(String phone) {
        if (StringUtils.isEmpty(phone) || phone.length() != 11) {
            return phone;
        }
        return phone.substring(0, 3) + "****" + phone.substring(7);
    }
    
    /**
     * 邮箱脱敏
     */
    public static String maskEmail(String email) {
        if (StringUtils.isEmpty(email) || !email.contains("@")) {
            return email;
        }
        String[] parts = email.split("@");
        String name = parts[0];
        String domain = parts[1];
        
        if (name.length() <= 1) {
            return "*@" + domain;
        }
        
        return name.charAt(0) + "***@" + domain;
    }
    
    /**
     * 身份证号脱敏
     */
    public static String maskIdCard(String idCard) {
        if (StringUtils.isEmpty(idCard) || idCard.length() != 18) {
            return idCard;
        }
        return idCard.substring(0, 6) + "********" + idCard.substring(14);
    }
    
    /**
     * 姓名脱敏
     */
    public static String maskName(String name) {
        if (StringUtils.isEmpty(name)) {
            return name;
        }
        if (name.length() == 1) {
            return name;
        }
        if (name.length() == 2) {
            return name.charAt(0) + "*";
        }
        return name.charAt(0) + "**";
    }
}
```

### 5.3 脱敏注解与序列化

```java
/**
 * 脱敏注解
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Masked {
    MaskType value();
}

public enum MaskType {
    PHONE,
    EMAIL,
    ID_CARD,
    NAME,
    BANK_CARD,
    ADDRESS
}

/**
 * 脱敏序列化器
 */
public class MaskingSerializer extends JsonSerializer<String> {
    
    private final MaskType maskType;
    
    public MaskingSerializer(MaskType maskType) {
        this.maskType = maskType;
    }
    
    @Override
    public void serialize(String value, JsonGenerator gen, 
                         SerializerProvider serializers) throws IOException {
        String masked = mask(value);
        gen.writeString(masked);
    }
    
    private String mask(String value) {
        switch (maskType) {
            case PHONE:
                return DataMasking.maskPhone(value);
            case EMAIL:
                return DataMasking.maskEmail(value);
            case ID_CARD:
                return DataMasking.maskIdCard(value);
            case NAME:
                return DataMasking.maskName(value);
            default:
                return value;
        }
    }
}

/**
 * 脱敏模块
 */
public class MaskingModule extends Module {
    
    @Override
    public String getModuleName() {
        return "MaskingModule";
    }
    
    @Override
    public Version version() {
        return Version.unknownVersion();
    }
    
    @Override
    public void setupModule(SetupContext context) {
        context.addBeanSerializerModifier(new BeanSerializerModifier() {
            @Override
            public List<BeanPropertyWriter> changeProperties(
                    SerializationConfig config, 
                    BeanDescription beanDesc, 
                    List<BeanPropertyWriter> beanProperties) {
                
                for (BeanPropertyWriter writer : beanProperties) {
                    Masked masked = writer.getAnnotation(Masked.class);
                    if (masked != null) {
                        writer.assignSerializer(new MaskingSerializer(masked.value()));
                    }
                }
                return beanProperties;
            }
        });
    }
}
```

### 5.4 脱敏使用示例

```java
@Data
public class UserVO {
    private Long id;
    private String username;
    
    @Masked(MaskType.EMAIL)
    private String email;
    
    @Masked(MaskType.PHONE)
    private String phone;
    
    @Masked(MaskType.NAME)
    private String realName;
    
    @Masked(MaskType.ID_CARD)
    private String idCard;
}
```

---

## 6. 审计日志

### 6.1 审计日志架构

```
┌─────────────────────────────────────────────────────────────┐
│                    审计日志架构                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    应用服务层                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │ @OperationLog│ │ @LoginLog   │ │ @DataLog    │   │   │
│  │  │  操作日志   │ │  登录日志   │ │  数据变更   │   │   │
│  │  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘   │   │
│  └─────────┼───────────────┼───────────────┼──────────┘   │
│            │               │               │               │
│            └───────────────┼───────────────┘               │
│                            │                               │
│                            ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    日志收集层                        │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  • AOP拦截器                                 │   │   │
│  │  │  • 异步写入                                  │   │   │
│  │  │  • 日志队列                                  │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────┬───────────────────────────┘   │
│                            │                               │
│                            ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    日志存储层                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │   MySQL     │ │   Redis     │ │   ELK       │   │   │
│  │  │ (结构化日志)│ │ (缓存队列)  │ │ (全文检索)  │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 审计日志注解

```java
/**
 * 操作日志注解
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface OperationLog {
    String module();           // 模块名称
    OperationType type();      // 操作类型
    String description() default "";  // 操作描述
    boolean saveParams() default true;  // 是否保存参数
    boolean saveResult() default false; // 是否保存结果
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

### 6.3 操作日志实现

```java
@Aspect
@Component
public class OperationLogAspect {
    
    @Autowired
    private OperationLogService logService;
    
    @Around("@annotation(operationLog)")
    public Object around(ProceedingJoinPoint point, OperationLog operationLog) throws Throwable {
        // 1. 记录开始时间
        long startTime = System.currentTimeMillis();
        
        // 2. 获取请求信息
        HttpServletRequest request = ((ServletRequestAttributes) 
            RequestContextHolder.getRequestAttributes()).getRequest();
        
        // 3. 获取登录用户
        LoginUser user = SecurityUtils.getLoginUser();
        
        // 4. 执行方法
        Object result = null;
        Exception exception = null;
        try {
            result = point.proceed();
            return result;
        } catch (Exception e) {
            exception = e;
            throw e;
        } finally {
            // 5. 保存操作日志
            saveLog(point, operationLog, request, user, startTime, result, exception);
        }
    }
    
    private void saveLog(ProceedingJoinPoint point, OperationLog operationLog,
                        HttpServletRequest request, LoginUser user,
                        long startTime, Object result, Exception exception) {
        
        OperationLogEntity logEntity = new OperationLogEntity();
        
        // 基本信息
        logEntity.setModule(operationLog.module());
        logEntity.setType(operationLog.type().getLabel());
        logEntity.setDescription(operationLog.description());
        
        // 用户信息
        if (user != null) {
            logEntity.setUserId(user.getUserId());
            logEntity.setUsername(user.getUsername());
        }
        
        // 请求信息
        logEntity.setIp(IpUtils.getIpAddress(request));
        logEntity.setUri(request.getRequestURI());
        logEntity.setMethod(request.getMethod());
        logEntity.setUserAgent(request.getHeader("User-Agent"));
        
        // 方法信息
        MethodSignature signature = (MethodSignature) point.getSignature();
        logEntity.setClassName(signature.getDeclaringTypeName());
        logEntity.setMethodName(signature.getName());
        
        // 参数信息
        if (operationLog.saveParams()) {
            logEntity.setParams(JsonUtils.toJson(point.getArgs()));
        }
        
        // 执行结果
        logEntity.setStatus(exception == null ? 1 : 0);
        logEntity.setErrorMsg(exception != null ? exception.getMessage() : null);
        
        if (operationLog.saveResult() && result != null) {
            logEntity.setResult(JsonUtils.toJson(result));
        }
        
        // 执行时间
        logEntity.setExecuteTime(System.currentTimeMillis() - startTime);
        
        // 异步保存
        logService.saveAsync(logEntity);
    }
}
```

### 6.4 数据变更日志

```java
@Aspect
@Component
public class DataChangeLogAspect {
    
    @Autowired
    private DataChangeLogService dataChangeLogService;
    
    @Around("execution(* com.linsir.system.mapper.*.update*(..)) || " +
            "execution(* com.linsir.system.mapper.*.insert*(..)) || " +
            "execution(* com.linsir.system.mapper.*.delete*(..))")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        // 1. 获取操作类型
        String methodName = point.getSignature().getName();
        DataChangeType changeType = getChangeType(methodName);
        
        // 2. 获取变更前数据（更新和删除）
        Object oldData = null;
        if (changeType == DataChangeType.UPDATE || changeType == DataChangeType.DELETE) {
            oldData = getOldData(point);
        }
        
        // 3. 执行操作
        Object result = point.proceed();
        
        // 4. 获取变更后数据（新增和更新）
        Object newData = null;
        if (changeType == DataChangeType.CREATE || changeType == DataChangeType.UPDATE) {
            newData = getNewData(point, result);
        }
        
        // 5. 保存数据变更日志
        saveDataChangeLog(point, changeType, oldData, newData);
        
        return result;
    }
    
    private void saveDataChangeLog(ProceedingJoinPoint point, DataChangeType changeType,
                                   Object oldData, Object newData) {
        DataChangeLogEntity logEntity = new DataChangeLogEntity();
        
        // 表名
        String tableName = getTableName(point);
        logEntity.setTableName(tableName);
        
        // 变更类型
        logEntity.setChangeType(changeType.getLabel());
        
        // 变更前数据
        if (oldData != null) {
            logEntity.setOldData(JsonUtils.toJson(oldData));
        }
        
        // 变更后数据
        if (newData != null) {
            logEntity.setNewData(JsonUtils.toJson(newData));
        }
        
        // 变更内容差异
        if (oldData != null && newData != null) {
            logEntity.setDiffData(JsonUtils.toJson(calculateDiff(oldData, newData)));
        }
        
        // 操作人
        LoginUser user = SecurityUtils.getLoginUser();
        if (user != null) {
            logEntity.setOperatorId(user.getUserId());
            logEntity.setOperatorName(user.getUsername());
        }
        
        logEntity.setOperateTime(LocalDateTime.now());
        
        // 异步保存
        dataChangeLogService.saveAsync(logEntity);
    }
}
```

### 6.5 日志存储表结构

```sql
-- 操作日志表
CREATE TABLE sys_operation_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '日志ID',
    module VARCHAR(50) NOT NULL COMMENT '模块名称',
    type VARCHAR(20) NOT NULL COMMENT '操作类型',
    description VARCHAR(255) COMMENT '操作描述',
    user_id BIGINT COMMENT '用户ID',
    username VARCHAR(50) COMMENT '用户名',
    ip VARCHAR(50) COMMENT 'IP地址',
    uri VARCHAR(255) COMMENT '请求URI',
    method VARCHAR(10) COMMENT '请求方法',
    class_name VARCHAR(255) COMMENT '类名',
    method_name VARCHAR(100) COMMENT '方法名',
    params TEXT COMMENT '请求参数',
    result TEXT COMMENT '返回结果',
    status TINYINT DEFAULT 1 COMMENT '状态：0失败 1成功',
    error_msg TEXT COMMENT '错误信息',
    execute_time BIGINT COMMENT '执行时长(ms)',
    user_agent VARCHAR(500) COMMENT '浏览器UA',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_module (module),
    INDEX idx_type (type),
    INDEX idx_user_id (user_id),
    INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

-- 数据变更日志表
CREATE TABLE sys_data_change_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '日志ID',
    table_name VARCHAR(50) NOT NULL COMMENT '表名',
    change_type VARCHAR(20) NOT NULL COMMENT '变更类型',
    old_data JSON COMMENT '变更前数据',
    new_data JSON COMMENT '变更后数据',
    diff_data JSON COMMENT '差异数据',
    operator_id BIGINT COMMENT '操作人ID',
    operator_name VARCHAR(50) COMMENT '操作人姓名',
    operate_time DATETIME NOT NULL COMMENT '操作时间',
    INDEX idx_table_name (table_name),
    INDEX idx_change_type (change_type),
    INDEX idx_operate_time (operate_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据变更日志表';

-- 登录日志表
CREATE TABLE sys_login_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '日志ID',
    user_id BIGINT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    login_type VARCHAR(20) COMMENT '登录类型',
    ip VARCHAR(50) COMMENT 'IP地址',
    location VARCHAR(100) COMMENT '登录地点',
    user_agent VARCHAR(500) COMMENT '浏览器UA',
    status TINYINT DEFAULT 1 COMMENT '状态：0失败 1成功',
    error_msg VARCHAR(255) COMMENT '错误信息',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (user_id),
    INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='登录日志表';
```

---

## 7. 密钥管理

### 7.1 密钥管理架构

```
┌─────────────────────────────────────────────────────────────┐
│                    密钥管理架构                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    应用层                            │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  • 密钥获取                                  │   │   │
│  │  │  • 密钥缓存                                  │   │   │
│  │  │  • 密钥轮换                                  │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────┬───────────────────────────┘   │
│                            │                               │
│                            ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    密钥管理层                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │ HashiCorp   │ │  AWS KMS    │ │  阿里云KMS  │   │   │
│  │  │  Vault      │ │             │ │             │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  └─────────────────────────┬───────────────────────────┘   │
│                            │                               │
│                            ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    硬件安全层                        │   │
│  │  ┌─────────────┐ ┌─────────────┐                   │   │
│  │  │    HSM      │ │   TPM       │                   │   │
│  │  │ (硬件加密机)│ │ (可信模块)  │                   │   │
│  │  └─────────────┘ └─────────────┘                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 HashiCorp Vault配置

```yaml
# Vault配置
spring:
  cloud:
    vault:
      enabled: true
      uri: https://vault.linsir.com:8200
      authentication: KUBERNETES
      kubernetes:
        role: linsir-system
        service-account-token-file: /var/run/secrets/kubernetes.io/serviceaccount/token
      kv:
        enabled: true
        backend: secret
        default-context: linsir/system

# 密钥配置
encryption:
  keys:
    database:
      path: secret/data/linsir/system/database
      key-name: encryption-key
    jwt:
      path: secret/data/linsir/system/jwt
      key-name: signing-key
```

### 7.3 密钥服务实现

```java
@Service
public class KeyManagementService {
    
    @Autowired
    private VaultTemplate vaultTemplate;
    
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    private static final String KEY_CACHE_PREFIX = "key:cache:";
    private static final long KEY_CACHE_TTL = 3600; // 1小时
    
    /**
     * 获取密钥
     */
    public String getKey(String path, String keyName) {
        String cacheKey = KEY_CACHE_PREFIX + path + ":" + keyName;
        
        // 1. 从缓存获取
        String cachedKey = redisTemplate.opsForValue().get(cacheKey);
        if (StringUtils.hasText(cachedKey)) {
            return cachedKey;
        }
        
        // 2. 从Vault获取
        VaultResponse response = vaultTemplate.read(path);
        if (response == null || response.getData() == null) {
            throw new KeyNotFoundException("密钥未找到: " + path);
        }
        
        String key = (String) response.getData().get(keyName);
        if (!StringUtils.hasText(key)) {
            throw new KeyNotFoundException("密钥未找到: " + keyName);
        }
        
        // 3. 缓存密钥
        redisTemplate.opsForValue().set(cacheKey, key, KEY_CACHE_TTL, TimeUnit.SECONDS);
        
        return key;
    }
    
    /**
     * 轮换密钥
     */
    public void rotateKey(String path, String keyName) {
        // 1. 生成新密钥
        String newKey = generateKey();
        
        // 2. 更新Vault
        Map<String, Object> data = new HashMap<>();
        data.put(keyName, newKey);
        vaultTemplate.write(path, data);
        
        // 3. 清除缓存
        String cacheKey = KEY_CACHE_PREFIX + path + ":" + keyName;
        redisTemplate.delete(cacheKey);
        
        // 4. 记录轮换日志
        log.info("密钥已轮换: {}/{}", path, keyName);
    }
    
    /**
     * 生成随机密钥
     */
    private String generateKey() {
        byte[] keyBytes = new byte[32];
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(keyBytes);
        return Base64.getEncoder().encodeToString(keyBytes);
    }
}
```

---

## 8. 数据分类与分级

### 8.1 数据分类

| 分类 | 说明 | 示例 |
|-----|------|------|
| 公开数据 | 可公开访问的数据 | 系统公告、帮助文档 |
| 内部数据 | 企业内部使用的数据 | 组织架构、部门信息 |
| 敏感数据 | 需要保护的个人数据 | 手机号、邮箱、身份证号 |
| 机密数据 | 高度敏感的数据 | 密码、密钥、财务数据 |

### 8.2 数据分级保护

| 级别 | 存储加密 | 传输加密 | 访问控制 | 审计要求 |
|-----|---------|---------|---------|---------|
| 公开 | 否 | 是 | 无需认证 | 可选 |
| 内部 | 否 | 是 | 需认证 | 建议 |
| 敏感 | 是 | 是 | 需授权 | 必须 |
| 机密 | 是+HSM | 是 | 严格授权 | 必须 |

---

## 9. 修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 架构师 | 初始版本，定义数据安全架构设计 |
