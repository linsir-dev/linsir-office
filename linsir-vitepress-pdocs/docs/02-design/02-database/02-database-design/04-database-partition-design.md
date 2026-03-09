# 数据库分区设计

> **文档编号**: SYS-DB-DES-004  
> **版本**: 1.0  
> **日期**: 2026-03-08  
> **作者**: 数据库架构师  
> **状态**: ✅ 已评审

---

## 一、概述

### 1.1 分区设计目标

- 优化大数据量表的查询性能
- 提高数据维护效率（清理、归档）
- 分散I/O压力
- 支持历史数据快速删除

### 1.2 分区策略选择

| 分区类型 | 适用场景 | 本项目应用 |
|---------|---------|-----------|
| RANGE分区 | 按时间范围分区 | ✅ 日志表 |
| LIST分区 | 按离散值分区 | ❌ 不适用 |
| HASH分区 | 均匀分布数据 | ❌ 不适用 |
| KEY分区 | 类似HASH分区 | ❌ 不适用 |

### 1.3 分区设计原则

1. **按需分区**: 仅对大数据量表进行分区
2. **时间维度**: 日志类表按时间分区
3. **分区粒度**: 按月分区，平衡管理复杂度
4. **预留分区**: 提前创建未来3个月的分区

---

## 二、分区表设计

### 2.1 操作日志表分区 (sys_operation_log)

**分区策略**: RANGE分区，按create_time按月分区

```sql
-- 创建分区表
CREATE TABLE `sys_operation_log` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `user_id` bigint DEFAULT NULL COMMENT '用户ID',
  `username` varchar(50) DEFAULT NULL COMMENT '用户名',
  `operation_type` varchar(50) NOT NULL COMMENT '操作类型',
  `operation_desc` varchar(200) DEFAULT NULL COMMENT '操作描述',
  `request_method` varchar(10) DEFAULT NULL COMMENT '请求方法',
  `request_url` varchar(500) DEFAULT NULL COMMENT '请求URL',
  `request_params` text COMMENT '请求参数',
  `response_data` text COMMENT '响应数据',
  `ip_address` varchar(50) DEFAULT NULL COMMENT 'IP地址',
  `user_agent` varchar(500) DEFAULT NULL COMMENT '用户代理',
  `execution_time` int DEFAULT NULL COMMENT '执行时间（毫秒）',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-失败，1-成功',
  `error_msg` text COMMENT '错误信息',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  PRIMARY KEY (`id`, `create_time`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_operation_type` (`operation_type`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表'
PARTITION BY RANGE (YEAR(create_time) * 100 + MONTH(create_time)) (
  PARTITION p202501 VALUES LESS THAN (202502),
  PARTITION p202502 VALUES LESS THAN (202503),
  PARTITION p202503 VALUES LESS THAN (202504),
  PARTITION p202504 VALUES LESS THAN (202505),
  PARTITION p202505 VALUES LESS THAN (202506),
  PARTITION p202506 VALUES LESS THAN (202507),
  PARTITION p202507 VALUES LESS THAN (202508),
  PARTITION p202508 VALUES LESS THAN (202509),
  PARTITION p202509 VALUES LESS THAN (202510),
  PARTITION p202510 VALUES LESS THAN (202511),
  PARTITION p202511 VALUES LESS THAN (202512),
  PARTITION p202512 VALUES LESS THAN (202601),
  PARTITION p202601 VALUES LESS THAN (202602),
  PARTITION p202602 VALUES LESS THAN (202603),
  PARTITION p202603 VALUES LESS THAN (202604),
  PARTITION p202604 VALUES LESS THAN (202605),
  PARTITION p202605 VALUES LESS THAN (202606),
  PARTITION p202606 VALUES LESS THAN (202607),
  PARTITION pmax VALUES LESS THAN MAXVALUE
);
```

**分区说明**:
- 按年月分区，格式：YYYYMM
- 提前创建18个月分区
- 最后使用MAXVALUE分区兜底

---

### 2.2 登录日志表分区 (sys_login_log)

**分区策略**: RANGE分区，按create_time按月分区

```sql
-- 创建分区表
CREATE TABLE `sys_login_log` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `user_id` bigint DEFAULT NULL COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `login_type` tinyint NOT NULL COMMENT '登录类型：1-账号密码，2-手机号，3-邮箱',
  `ip_address` varchar(50) DEFAULT NULL COMMENT 'IP地址',
  `ip_location` varchar(100) DEFAULT NULL COMMENT 'IP归属地',
  `user_agent` varchar(500) DEFAULT NULL COMMENT '用户代理',
  `browser` varchar(50) DEFAULT NULL COMMENT '浏览器',
  `os` varchar(50) DEFAULT NULL COMMENT '操作系统',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-失败，1-成功',
  `error_msg` varchar(500) DEFAULT NULL COMMENT '错误信息',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  PRIMARY KEY (`id`, `create_time`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_username` (`username`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录日志表'
PARTITION BY RANGE (YEAR(create_time) * 100 + MONTH(create_time)) (
  PARTITION p202501 VALUES LESS THAN (202502),
  PARTITION p202502 VALUES LESS THAN (202503),
  PARTITION p202503 VALUES LESS THAN (202504),
  PARTITION p202504 VALUES LESS THAN (202505),
  PARTITION p202505 VALUES LESS THAN (202506),
  PARTITION p202506 VALUES LESS THAN (202507),
  PARTITION p202507 VALUES LESS THAN (202508),
  PARTITION p202508 VALUES LESS THAN (202509),
  PARTITION p202509 VALUES LESS THAN (202510),
  PARTITION p202510 VALUES LESS THAN (202511),
  PARTITION p202511 VALUES LESS THAN (202512),
  PARTITION p202512 VALUES LESS THAN (202601),
  PARTITION p202601 VALUES LESS THAN (202602),
  PARTITION p202602 VALUES LESS THAN (202603),
  PARTITION p202603 VALUES LESS THAN (202604),
  PARTITION p202604 VALUES LESS THAN (202605),
  PARTITION p202605 VALUES LESS THAN (202606),
  PARTITION p202606 VALUES LESS THAN (202607),
  PARTITION pmax VALUES LESS THAN MAXVALUE
);
```

---

## 三、分区管理

### 3.1 分区维护脚本

```sql
-- 查看分区信息
SELECT 
    TABLE_NAME,
    PARTITION_NAME,
    PARTITION_METHOD,
    PARTITION_EXPRESSION,
    PARTITION_DESCRIPTION,
    TABLE_ROWS
FROM information_schema.PARTITIONS
WHERE TABLE_SCHEMA = 'db_system' 
AND TABLE_NAME IN ('sys_operation_log', 'sys_login_log')
ORDER BY TABLE_NAME, PARTITION_NAME;

-- 添加新分区
ALTER TABLE sys_operation_log ADD PARTITION (
    PARTITION p202607 VALUES LESS THAN (202608)
);

-- 删除旧分区（谨慎操作）
ALTER TABLE sys_operation_log DROP PARTITION p202501;

-- 清空分区数据
ALTER TABLE sys_operation_log TRUNCATE PARTITION p202501;

-- 重建分区
ALTER TABLE sys_operation_log REORGANIZE PARTITION pmax INTO (
    PARTITION p202607 VALUES LESS THAN (202608),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);
```

### 3.2 分区监控

```sql
-- 查看各分区数据量
SELECT 
    TABLE_NAME,
    PARTITION_NAME,
    TABLE_ROWS,
    ROUND(DATA_LENGTH / 1024 / 1024, 2) AS 'Data(MB)',
    ROUND(INDEX_LENGTH / 1024 / 1024, 2) AS 'Index(MB)'
FROM information_schema.PARTITIONS
WHERE TABLE_SCHEMA = 'db_system'
AND TABLE_NAME IN ('sys_operation_log', 'sys_login_log')
ORDER BY TABLE_NAME, PARTITION_NAME;

-- 查看分区使用情况
SELECT 
    PARTITION_NAME,
    COUNT(*) as row_count
FROM sys_operation_log PARTITION (p202503)
GROUP BY PARTITION_NAME;
```

---

## 四、分区查询优化

### 4.1 分区裁剪

```sql
-- 有效：使用分区键查询，会裁剪分区
SELECT * FROM sys_operation_log 
WHERE create_time >= '2025-03-01' 
AND create_time < '2025-04-01';

-- 有效：使用分区键范围查询
SELECT * FROM sys_operation_log 
WHERE create_time BETWEEN '2025-03-01' AND '2025-03-31';

-- 无效：不使用分区键，扫描全部分区
SELECT * FROM sys_operation_log 
WHERE user_id = 1001;
```

### 4.2 分区键查询建议

| 查询场景 | 建议 | 示例 |
|---------|------|------|
| 按月查询 | 使用create_time范围 | WHERE create_time BETWEEN '2025-03-01' AND '2025-03-31' |
| 按租户查询 | 结合create_time | WHERE tenant_id = 1 AND create_time >= '2025-03-01' |
| 按用户查询 | 结合create_time | WHERE user_id = 1 AND create_time >= '2025-03-01' |
| 统计报表 | 使用分区裁剪 | 按月统计时利用分区特性 |

---

## 五、数据归档策略

### 5.1 归档方案

| 表名 | 保留周期 | 归档方式 | 归档目标 |
|-----|---------|---------|---------|
| sys_operation_log | 12个月 | 分区删除 | 归档库或删除 |
| sys_login_log | 6个月 | 分区删除 | 归档库或删除 |

### 5.2 归档脚本

```sql
-- 创建归档存储过程
DELIMITER $$

CREATE PROCEDURE ArchiveOldPartitions()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE partition_name VARCHAR(64);
    DECLARE cur CURSOR FOR 
        SELECT PARTITION_NAME 
        FROM information_schema.PARTITIONS 
        WHERE TABLE_SCHEMA = 'db_system' 
        AND TABLE_NAME = 'sys_operation_log'
        AND PARTITION_NAME != 'pmax'
        AND PARTITION_DESCRIPTION < YEAR(CURDATE() - INTERVAL 12 MONTH) * 100 
                                   + MONTH(CURDATE() - INTERVAL 12 MONTH);
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO partition_name;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        SET @sql = CONCAT('ALTER TABLE sys_operation_log DROP PARTITION ', partition_name);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        
    END LOOP;
    CLOSE cur;
END$$

DELIMITER ;

-- 创建定时事件（每月1号执行）
CREATE EVENT IF NOT EXISTS evt_archive_partitions
ON SCHEDULE EVERY 1 MONTH
STARTS DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01 02:00:00')
DO CALL ArchiveOldPartitions();
```

---

## 六、分区统计

| 表名 | 分区类型 | 分区数 | 分区键 | 适用场景 |
|-----|---------|-------|-------|---------|
| sys_operation_log | RANGE | 18+1 | create_time | 操作日志，按月归档 |
| sys_login_log | RANGE | 18+1 | create_time | 登录日志，按月归档 |

---

## 七、审核记录

### 7.1 审核状态

| 审核项 | 状态 | 审核人 | 审核日期 |
|-------|------|-------|---------|
| 分区策略设计 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 分区键选择 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 分区管理脚本 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 归档策略 | ✓ 通过 | 技术负责人 | 2026-03-08 |

### 7.2 签字确认

| 角色 | 姓名 | 签字 | 日期 |
|-----|------|------|------|
| 编制人 | 数据库架构师 | _____________ | 2026-03-08 |
| 审核人 | 技术负责人 | _____________ | 2026-03-08 |
| 批准人 | 项目经理 | _____________ | 2026-03-08 |

---

## 八、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 数据库架构师 | 初始版本，创建分区设计文档 |
