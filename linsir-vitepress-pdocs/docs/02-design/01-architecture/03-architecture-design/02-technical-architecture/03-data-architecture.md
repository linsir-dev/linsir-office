# 数据技术架构设计

> **文档编号**: SYS-DES-ARCH-DATA-001  
> **版本**: 1.0  
> **创建日期**: 2026-03-08  
> **作者**: 架构师  
> **状态**: 🔄 进行中

---

## 1. 概述

### 1.1 目的

本文档定义System平台数据技术架构设计，包括数据库设计、缓存设计、数据流转、数据安全、数据备份等。

### 1.2 适用范围

- 关系型数据库（MySQL）
- 缓存数据库（Redis）
- 搜索引擎（Elasticsearch）
- 文件存储（MinIO）
- 数据同步与迁移

### 1.3 设计原则

1. **数据一致性**：核心业务数据强一致性
2. **高可用性**：数据多副本，故障自动切换
3. **安全性**：数据加密、访问控制、审计日志
4. **可扩展性**：支持水平扩展和数据分片

---

## 2. 数据存储架构

### 2.1 存储组件选型

| 组件 | 版本 | 用途 | 选择理由 |
|-----|------|------|---------|
| MySQL | 8.0 | 主数据存储 | 事务支持，主从复制，性能优化 |
| Redis | 7.x | 缓存/会话 | 高性能，数据结构丰富，分布式锁 |
| Elasticsearch | 8.x | 日志搜索 | 操作日志、审计日志全文检索 |
| MinIO | 最新版 | 文件存储 | S3兼容，分布式，高性能 |

### 2.2 数据分层架构

```
┌─────────────────────────────────────────────────────────────┐
│                      数据分层架构                            │
├─────────────────────────────────────────────────────────────┤
│  应用层                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   System    │ │   Config    │ │   Audit     │           │
│  │   Service   │ │   Service   │ │   Service   │           │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘           │
│         │               │               │                  │
├─────────┼───────────────┼───────────────┼──────────────────┤
│  缓存层  │               │               │                  │
│  ┌──────┴───────────────┴───────────────┴──────────────┐   │
│  │                    Redis Cluster                     │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│  │  │ 会话缓存 │ │ 数据缓存 │ │ 分布式锁 │ │ 热点数据 │   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  主数据层                                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  MySQL 8.0 Cluster                   │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │   Master    │ │   Slave 1   │ │   Slave 2   │   │   │
│  │  │  (写操作)   │ │  (读操作)   │ │  (读操作)   │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  搜索层                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Elasticsearch 8.x Cluster               │   │
│  │  ┌─────────┐ ┌─────────┐                           │   │
│  │  │ 操作日志 │ │ 审计日志 │                           │   │
│  │  └─────────┘ └─────────┘                           │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  文件层                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  MinIO Cluster                       │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐               │   │
│  │  │ 用户头像 │ │ 附件文件 │ │ 导出文件 │               │   │
│  │  └─────────┘ └─────────┘ └─────────┘               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 数据库设计

### 3.1 MySQL架构

#### 3.1.1 主从复制架构

```
┌─────────────────────────────────────────────────────────────┐
│                    MySQL主从复制架构                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                                           │
│  │   应用服务    │                                           │
│  └──────┬───────┘                                           │
│         │                                                   │
│         │ 读写分离                                          │
│         ▼                                                   │
│  ┌──────────────┐                                           │
│  │  ShardingSphere  │                                       │
│  │  （读写分离代理） │                                       │
│  └──────┬───────┘                                           │
│         │                                                   │
│    ┌────┴────┐                                              │
│    │         │                                               │
│    ▼         ▼                                               │
│  ┌────┐   ┌────┐   ┌────┐                                   │
│  │Master│──▶│Slave1│   │Slave2│                              │
│  │ (写) │   │ (读) │   │ (读) │                              │
│  └──┬───┘   └────┘   └────┘                                   │
│     │                                                       │
│     │ Binlog复制                                            │
│     └───────────────────────────────▶                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 3.1.2 数据库实例规划

| 实例 | 角色 | 配置 | 用途 |
|-----|------|------|------|
| mysql-master | 主库 | 8C16G | 写操作、实时读 |
| mysql-slave-1 | 从库 | 8C16G | 读操作、报表查询 |
| mysql-slave-2 | 从库 | 8C16G | 读操作、备份 |

#### 3.1.3 数据库配置

```yaml
# MySQL主库配置
[mysqld]
server-id=1
log-bin=mysql-bin
binlog-format=ROW
binlog-row-image=FULL
innodb_buffer_pool_size=8G
innodb_log_file_size=1G
max_connections=500
character-set-server=utf8mb4
default-storage-engine=InnoDB
```

```yaml
# MySQL从库配置
[mysqld]
server-id=2
relay-log=mysql-relay-bin
read-only=1
innodb_buffer_pool_size=8G
max_connections=500
```

### 3.2 数据库表设计规范

#### 3.2.1 命名规范

| 对象类型 | 命名规范 | 示例 |
|---------|---------|------|
| 表名 | sys_模块_表名 | sys_user, sys_role |
| 主键 | id | BIGINT AUTO_INCREMENT |
| 外键 | 表名_id | dept_id, role_id |
| 索引 | idx_字段名 | idx_username |
| 唯一索引 | uk_字段名 | uk_username |

#### 3.2.2 通用字段

```sql
-- 所有表必须包含的字段
CREATE TABLE sys_example (
    id              BIGINT          PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    create_by       BIGINT          DEFAULT NULL COMMENT '创建者',
    create_time     DATETIME        DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by       BIGINT          DEFAULT NULL COMMENT '更新者',
    update_time     DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted         TINYINT         DEFAULT 0 COMMENT '删除标志（0正常 1删除）',
    remark          VARCHAR(500)    DEFAULT NULL COMMENT '备注',
    -- 业务字段...
    INDEX idx_create_time (create_time),
    INDEX idx_deleted (deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='示例表';
```

#### 3.2.3 索引设计原则

1. **主键索引**：所有表必须有主键，使用自增BIGINT
2. **唯一索引**：业务唯一字段必须加唯一索引
3. **普通索引**：高频查询字段加索引
4. **联合索引**：多字段查询使用联合索引
5. **索引优化**：避免过多索引，定期分析慢查询

### 3.3 数据库设计规范

> **说明**：具体表结构设计请参考《数据库设计文档》，本文档仅定义技术架构层面的设计规范。

#### 3.3.1 命名规范

| 对象类型 | 命名规范 | 示例 |
|---------|---------|------|
| 表名 | sys_模块_表名 | sys_user, sys_role |
| 主键 | id | BIGINT AUTO_INCREMENT |
| 外键 | 表名_id | dept_id, role_id |
| 索引 | idx_字段名 | idx_username |
| 唯一索引 | uk_字段名 | uk_username |

#### 3.3.2 通用字段规范

所有业务表必须包含以下字段：

| 字段名 | 类型 | 说明 |
|-------|------|------|
| id | BIGINT | 主键ID，自增 |
| create_by | BIGINT | 创建者ID |
| create_time | DATETIME | 创建时间 |
| update_by | BIGINT | 更新者ID |
| update_time | DATETIME | 更新时间 |
| deleted | TINYINT | 逻辑删除标志（0正常 1删除） |
| remark | VARCHAR(500) | 备注 |

#### 3.3.3 索引设计原则

1. **主键索引**：所有表必须有主键，使用自增BIGINT
2. **唯一索引**：业务唯一字段必须加唯一索引
3. **普通索引**：高频查询字段加索引
4. **联合索引**：多字段查询使用联合索引
5. **索引优化**：避免过多索引，定期分析慢查询

#### 3.3.4 预估数据量

| 表类别 | 表名示例 | 预估数据量 | 增长趋势 |
|-------|---------|-----------|---------|
| 用户类 | sys_user | 1万-10万 | 缓慢增长 |
| 配置类 | sys_config | 100-1000 | 基本稳定 |
| 日志类 | sys_oper_log | 100万+/年 | 快速增长 |
| 审计类 | sys_audit_log | 500万+/年 | 快速增长 |

---

## 4. 缓存设计

### 4.1 Redis架构

#### 4.1.1 Redis Cluster架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Redis Cluster架构                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                                           │
│  │   应用服务    │                                           │
│  └──────┬───────┘                                           │
│         │                                                   │
│         │ Jedis/Lettuce                                     │
│         ▼                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Redis Cluster                       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │  Master 1   │ │  Master 2   │ │  Master 3   │   │   │
│  │  │  (0-5460)   │ │ (5461-10922)│ │(10923-16383)│   │   │
│  │  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘   │   │
│  │         │               │               │          │   │
│  │         ▼               ▼               ▼          │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │  Slave 1    │ │  Slave 2    │ │  Slave 3    │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4.1.2 缓存策略

| 缓存类型 | 用途 | 过期时间 | 更新策略 |
|---------|------|---------|---------|
| 会话缓存 | 用户登录状态 | 30分钟 | 访问续期 |
| 用户缓存 | 用户信息 | 1小时 | 更新时失效 |
| 字典缓存 | 系统字典 | 24小时 | 定时刷新 |
| 权限缓存 | 用户权限 | 1小时 | 更新时失效 |
| 热点数据 | 频繁访问数据 | 10分钟 | 定时刷新 |

#### 4.1.3 缓存策略说明

> **详细Key设计规范请参考《缓存设计详细文档》**

| Key前缀 | 用途 | 示例 |
|--------|------|------|
| user:* | 用户相关缓存 | user:info:{userId} |
| dict:* | 字典相关缓存 | dict:{dictType} |
| session:* | 会话相关缓存 | session:{token} |
| rate:* | 限流相关缓存 | rate:limit:{ip} |

### 4.2 缓存实现

```java
@Component
@RequiredArgsConstructor
public class RedisCacheService {

    private final StringRedisTemplate redisTemplate;

    /**
     * 缓存用户信息
     */
    public void setUserCache(Long userId, User user) {
        String key = RedisKey.USER_INFO + userId;
        redisTemplate.opsForValue().set(key, JSON.toJSONString(user), 1, TimeUnit.HOURS);
    }

    /**
     * 获取用户信息
     */
    public User getUserCache(Long userId) {
        String key = RedisKey.USER_INFO + userId;
        String json = redisTemplate.opsForValue().get(key);
        return StringUtils.isNotBlank(json) ? JSON.parseObject(json, User.class) : null;
    }

    /**
     * 删除用户缓存
     */
    public void deleteUserCache(Long userId) {
        String key = RedisKey.USER_INFO + userId;
        redisTemplate.delete(key);
    }

    /**
     * 分布式锁
     */
    public boolean tryLock(String key, long expireTime) {
        Boolean result = redisTemplate.opsForValue()
                .setIfAbsent(key, "1", expireTime, TimeUnit.SECONDS);
        return Boolean.TRUE.equals(result);
    }

    /**
     * 释放锁
     */
    public void unlock(String key) {
        redisTemplate.delete(key);
    }
}
```

---

## 5. 搜索引擎设计

### 5.1 Elasticsearch架构

```
┌─────────────────────────────────────────────────────────────┐
│                  Elasticsearch架构                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Elasticsearch Cluster                   │   │
│  │                                                      │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │  Master节点  │ │  Data节点1  │ │  Data节点2  │   │   │
│  │  │  (管理集群)  │ │  (存储数据)  │ │  (存储数据)  │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  │                                                      │   │
│  │  索引设计：                                          │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │ user_index  │ │operate_log  │ │ audit_log   │   │   │
│  │  │  用户搜索   │ │  操作日志   │ │  审计日志   │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 索引设计

> **说明**：ES仅用于日志检索，业务数据查询使用MySQL+Redis

#### 5.2.1 操作日志索引

```json
{
  "mappings": {
    "properties": {
      "logId": { "type": "long" },
      "title": { "type": "keyword" },
      "businessType": { "type": "integer" },
      "method": { "type": "keyword" },
      "requestMethod": { "type": "keyword" },
      "operName": { "type": "keyword" },
      "operUrl": { "type": "keyword" },
      "operIp": { "type": "ip" },
      "operParam": { "type": "text" },
      "jsonResult": { "type": "text" },
      "status": { "type": "integer" },
      "errorMsg": { "type": "text" },
      "operTime": { "type": "date" },
      "costTime": { "type": "long" }
    }
  }
}
```

---

## 6. 数据安全

### 6.1 数据加密

#### 6.1.1 敏感字段加密

```java
@Component
public class DataEncryptor {

    @Value("${encrypt.key}")
    private String encryptKey;

    /**
     * 加密敏感数据
     */
    public String encrypt(String data) {
        if (StringUtils.isBlank(data)) {
            return data;
        }
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            SecretKeySpec keySpec = new SecretKeySpec(encryptKey.getBytes(), "AES");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encrypted = cipher.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("加密失败", e);
        }
    }

    /**
     * 解密敏感数据
     */
    public String decrypt(String encryptedData) {
        if (StringUtils.isBlank(encryptedData)) {
            return encryptedData;
        }
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            SecretKeySpec keySpec = new SecretKeySpec(encryptKey.getBytes(), "AES");
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(encryptedData));
            return new String(decrypted);
        } catch (Exception e) {
            throw new RuntimeException("解密失败", e);
        }
    }
}
```

#### 6.1.2 密码加密

```java
@Component
public class PasswordEncoder {

    private static final int STRENGTH = 10;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(STRENGTH);

    public String encode(String password) {
        return encoder.encode(password);
    }

    public boolean matches(String password, String encodedPassword) {
        return encoder.matches(password, encodedPassword);
    }
}
```

### 6.2 数据脱敏

```java
@Component
public class DataMasker {

    /**
     * 手机号脱敏
     */
    public String maskMobile(String mobile) {
        if (StringUtils.isBlank(mobile) || mobile.length() != 11) {
            return mobile;
        }
        return mobile.substring(0, 3) + "****" + mobile.substring(7);
    }

    /**
     * 邮箱脱敏
     */
    public String maskEmail(String email) {
        if (StringUtils.isBlank(email) || !email.contains("@")) {
            return email;
        }
        String[] parts = email.split("@");
        String name = parts[0];
        String domain = parts[1];
        String maskedName = name.substring(0, Math.min(2, name.length())) + "***";
        return maskedName + "@" + domain;
    }

    /**
     * 身份证号脱敏
     */
    public String maskIdCard(String idCard) {
        if (StringUtils.isBlank(idCard) || idCard.length() != 18) {
            return idCard;
        }
        return idCard.substring(0, 6) + "********" + idCard.substring(14);
    }
}
```

---

## 7. 数据备份

### 7.1 备份策略

| 备份类型 | 频率 | 保留时间 | 存储位置 |
|---------|------|---------|---------|
| 全量备份 | 每周日 | 4周 | 异地存储 |
| 增量备份 | 每天 | 7天 | 本地存储 |
| 事务日志 | 实时 | 24小时 | 本地存储 |
| Redis RDB | 每小时 | 7天 | 本地存储 |
| Redis AOF | 实时 | - | 本地存储 |

### 7.2 MySQL备份脚本

```bash
#!/bin/bash
# mysql_backup.sh

BACKUP_DIR="/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="linsir_system"

# 全量备份
mysqldump -u backup -p'password' --single-transaction \
    --routines --triggers --events \
    $DB_NAME > $BACKUP_DIR/full_${DATE}.sql

# 压缩
gzip $BACKUP_DIR/full_${DATE}.sql

# 删除旧备份（保留4周）
find $BACKUP_DIR -name "full_*.sql.gz" -mtime +28 -delete

# 上传到异地存储
aws s3 cp $BACKUP_DIR/full_${DATE}.sql.gz s3://linsir-backup/mysql/
```

### 7.3 数据恢复流程

```
1. 停止应用服务
2. 备份当前数据（防止恢复失败）
3. 恢复数据
   - 全量恢复：mysql < full_backup.sql
   - 增量恢复：mysqlbinlog binlog.000001 | mysql
4. 验证数据完整性
5. 启动应用服务
6. 验证业务功能
```

---

## 8. 数据流转

### 8.1 数据同步架构

```
┌─────────────────────────────────────────────────────────────┐
│                      数据同步架构                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MySQL ────▶ Canal ────▶ Kafka ────▶ ES/Redis              │
│   │                                                        │
│   │ Binlog                                                 │
│   ▼                                                        │
│  业务数据                                                   │
│                                                             │
│  同步场景：                                                 │
│  1. MySQL ──▶ ES：日志检索（操作日志、审计日志）            │
│  2. MySQL ──▶ Redis：缓存预热、数据同步                      │
│  3. 业务 ──▶ MinIO：文件上传                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Canal数据同步

```java
@Component
@Slf4j
public class CanalClient {

    @Autowired
    private ElasticsearchRestTemplate elasticsearchTemplate;

    @Autowired
    private StringRedisTemplate redisTemplate;

    /**
     * 处理Canal消息
     */
    @KafkaListener(topics = "canal-topic")
    public void handleCanalMessage(CanalMessage message) {
        String table = message.getTable();
        String type = message.getType(); // INSERT/UPDATE/DELETE
        
        switch (table) {
            case "sys_user":
            case "sys_role":
            case "sys_dept":
                // 业务数据变更，只清理Redis缓存
                invalidateCache(table, message);
                break;
            case "sys_oper_log":
            case "sys_audit_log":
                // 日志数据同步到ES
                syncLogToES(table, message);
                break;
        }
    }

    private void invalidateCache(String table, CanalMessage message) {
        // 根据表名清理对应缓存
        Long id = message.getData().get("id");
        String cacheKey = table.replace("sys_", "") + ":" + id;
        redisTemplate.delete(cacheKey);
    }

    private void syncLogToES(String table, CanalMessage message) {
        // 同步日志数据到ES
        LogDocument logDoc = convertToLogDocument(message.getData());
        elasticsearchTemplate.save(logDoc);
    }
}
```

---

## 9. 相关文档

- [前端技术架构](./01-frontend-architecture.md)
- [后端技术架构](./02-backend-architecture.md)
- [系统架构设计](../01-system-architecture/01-logical-architecture.md)

---

## 10. 修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 架构师 | 初始版本，定义数据技术架构 |
