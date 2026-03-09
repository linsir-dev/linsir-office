# 数据库迁移脚本说明

> **文档编号**: SYS-DB-SQL-MIG-001  
> **版本**: 1.0  
> **日期**: 2026-03-08  
> **作者**: 数据库架构师

---

## 一、概述

### 1.1 目的

本文档说明数据库迁移脚本的管理规范，确保数据库版本的可追溯性和可回滚性。

### 1.2 适用范围

- 数据库结构变更（DDL）
- 数据迁移（DML）
- 索引优化
- 约束变更

---

## 二、迁移工具选择

### 2.1 推荐工具

| 工具 | 特点 | 适用场景 |
|-----|------|---------|
| **Flyway** | 简单、轻量、社区活跃 | 中小型项目 |
| **Liquibase** | 功能丰富、支持多数据库 | 大型企业项目 |
| **MyBatis Migrations** | 与MyBatis集成好 | 使用MyBatis的项目 |

### 2.2 本项目选择

本项目推荐使用 **Flyway** 作为数据库迁移工具。

**选择理由**：
- 简单易用，学习成本低
- 与Spring Boot集成良好
- 支持SQL和Java两种迁移方式
- 社区活跃，文档完善

---

## 三、迁移脚本规范

### 3.1 文件命名规范

#### Flyway命名规范

```
V<版本号>__<描述>.sql
```

**格式说明**：
- `V`：版本前缀（大写）
- `<版本号>`：数字，使用点号分隔（如 1.0.0）
- `__`：双下划线分隔符
- `<描述>`：简短描述，使用下划线连接
- `.sql`：文件扩展名

**示例**：
```
V1.0.0__init_schema.sql           # 初始化数据库结构
V1.0.1__add_user_index.sql        # 添加用户表索引
V1.1.0__add_department_table.sql  # 添加部门表
V1.1.1__update_dictionary_data.sql # 更新字典数据
```

### 3.2 文件内容规范

#### 头部注释模板

```sql
-- ========================================================
-- Database Migration Script
-- 数据库迁移脚本
-- ========================================================
-- 版本: V1.0.0
-- 描述: 初始化数据库结构
-- 作者: 数据库架构师
-- 日期: 2026-03-08
-- 类型: DDL
-- ========================================================
-- 变更内容:
--   1. 创建租户配置表
--   2. 创建用户表
--   3. 创建角色表
-- ========================================================
-- 回滚说明:
--   此脚本为基础初始化脚本，不提供回滚
-- ========================================================
```

#### 脚本内容要求

1. **原子性**：每个脚本应包含一个完整的变更，要么全部成功，要么全部失败
2. **幂等性**：脚本可以重复执行而不产生错误（使用 IF EXISTS / IF NOT EXISTS）
3. **可回滚性**：提供对应的回滚脚本（Undo脚本）

### 3.3 脚本类型

| 类型 | 前缀 | 说明 | 示例 |
|-----|------|------|------|
| 版本脚本 | V | 正常版本升级 | V1.0.0__init_schema.sql |
| 回滚脚本 | U | 版本回滚 | U1.0.0__init_schema.sql |
| 可重复脚本 | R | 可重复执行 | R__update_stored_procedures.sql |

---

## 四、迁移脚本目录结构

```
04-migration-scripts/
├── README.md                          # 本文档
├── flyway.conf                        # Flyway配置文件（可选）
├── /
│   ├── V1.0.0__init_schema.sql        # 初始化数据库结构
│   ├── V1.0.1__add_user_index.sql     # 添加用户表索引
│   ├── V1.1.0__add_department_table.sql # 添加部门表
│   └── ...
└── undo/                              # 回滚脚本（可选）
    ├── U1.0.1__add_user_index.sql
    └── ...
```

---

## 五、迁移脚本示例

### 5.1 创建表迁移脚本

**文件**: `V1.1.0__add_department_table.sql`

```sql
-- ========================================================
-- Database Migration Script
-- 数据库迁移脚本
-- ========================================================
-- 版本: V1.1.0
-- 描述: 添加部门表
-- 作者: 数据库架构师
-- 日期: 2026-03-08
-- 类型: DDL
-- ========================================================

-- 创建部门表
CREATE TABLE IF NOT EXISTS `sys_dept` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '部门ID',
    `dept_code` varchar(50) NOT NULL COMMENT '部门编码',
    `dept_name` varchar(100) NOT NULL COMMENT '部门名称',
    `parent_id` bigint NOT NULL DEFAULT '0' COMMENT '父部门ID',
    `ancestors` varchar(500) DEFAULT NULL COMMENT '祖先路径',
    `dept_level` int NOT NULL DEFAULT '1' COMMENT '部门层级',
    `sort_order` int NOT NULL DEFAULT '0' COMMENT '排序',
    `leader_id` bigint DEFAULT NULL COMMENT '负责人ID',
    `phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
    `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
    `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
    `remark` varchar(500) DEFAULT NULL COMMENT '备注',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
    `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
    `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志：0-正常，1-删除',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_dept_code` (`dept_code`),
    KEY `idx_parent_id` (`parent_id`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='部门表';

-- 添加外键约束
ALTER TABLE `sys_dept`
    ADD CONSTRAINT `fk_dept_parent` 
    FOREIGN KEY (`parent_id`) 
    REFERENCES `sys_dept`(`id`) 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE;

-- 记录迁移日志
SELECT '部门表创建成功' as '迁移结果';
```

### 5.2 数据迁移脚本

**文件**: `V1.2.0__migrate_user_data.sql`

```sql
-- ========================================================
-- Database Migration Script
-- 数据库迁移脚本
-- ========================================================
-- 版本: V1.2.0
-- 描述: 迁移用户数据到新表结构
-- 作者: 数据库架构师
-- 日期: 2026-03-08
-- 类型: DML
-- ========================================================

-- 开始事务
START TRANSACTION;

-- 1. 创建临时表存储旧数据
CREATE TEMPORARY TABLE IF NOT EXISTS `tmp_user_backup` AS
SELECT * FROM `sys_user` WHERE 1=0;

-- 2. 备份旧数据
INSERT INTO `tmp_user_backup`
SELECT * FROM `sys_user`;

-- 3. 添加新字段
ALTER TABLE `sys_user` 
    ADD COLUMN IF NOT EXISTS `employee_no` varchar(50) DEFAULT NULL COMMENT '员工编号' AFTER `gender`,
    ADD COLUMN IF NOT EXISTS `work_location` varchar(100) DEFAULT NULL COMMENT '工作地点' AFTER `address`;

-- 4. 迁移数据（示例：从其他表同步员工编号）
UPDATE `sys_user` u
INNER JOIN `sys_employee` e ON u.id = e.user_id
SET u.employee_no = e.employee_no
WHERE u.employee_no IS NULL;

-- 5. 验证数据完整性
SELECT 
    COUNT(*) as '总用户数',
    COUNT(employee_no) as '有员工编号的用户',
    COUNT(*) - COUNT(employee_no) as '无员工编号的用户'
FROM `sys_user`;

-- 提交事务
COMMIT;

-- 记录迁移日志
SELECT '用户数据迁移成功' as '迁移结果';
```

### 5.3 索引优化脚本

**文件**: `V1.3.0__optimize_user_query.sql`

```sql
-- ========================================================
-- Database Migration Script
-- 数据库迁移脚本
-- ========================================================
-- 版本: V1.3.0
-- 描述: 优化用户查询性能
-- 作者: 数据库架构师
-- 日期: 2026-03-08
-- 类型: DDL
-- ========================================================

-- 1. 分析现有索引使用情况
-- （此查询用于分析，不执行变更）
-- SELECT 
--     TABLE_NAME,
--     INDEX_NAME,
--     CARDINALITY
-- FROM INFORMATION_SCHEMA.STATISTICS
-- WHERE TABLE_SCHEMA = 'linsir_system'
--     AND TABLE_NAME = 'sys_user';

-- 2. 添加复合索引优化查询
CREATE INDEX IF NOT EXISTS `idx_user_tenant_status` 
ON `sys_user`(`tenant_id`, `status`);

-- 3. 添加查询索引
CREATE INDEX IF NOT EXISTS `idx_user_create_time` 
ON `sys_user`(`create_time`);

-- 4. 删除冗余索引（如果有）
-- DROP INDEX IF EXISTS `idx_redundant_index` ON `sys_user`;

-- 记录迁移日志
SELECT '用户表索引优化完成' as '迁移结果';
```

---

## 六、回滚脚本规范

### 6.1 回滚脚本命名

```
U<版本号>__<描述>.sql
```

**示例**：
```
U1.1.0__add_department_table.sql  # 回滚 V1.1.0 的变更
```

### 6.2 回滚脚本示例

**文件**: `U1.1.0__add_department_table.sql`

```sql
-- ========================================================
-- Database Migration Rollback Script
-- 数据库迁移回滚脚本
-- ========================================================
-- 版本: U1.1.0
-- 描述: 回滚部门表创建
-- 作者: 数据库架构师
-- 日期: 2026-03-08
-- 类型: DDL
-- ========================================================
-- 警告: 此操作将删除部门表及所有数据，请谨慎执行！
-- ========================================================

-- 删除外键约束
ALTER TABLE `sys_dept` 
    DROP FOREIGN KEY IF EXISTS `fk_dept_parent`;

-- 删除部门表
DROP TABLE IF EXISTS `sys_dept`;

-- 记录回滚日志
SELECT '部门表已删除，回滚完成' as '回滚结果';
```

---

## 七、Flyway集成配置

### 7.1 Maven依赖

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
    <version>9.22.3</version>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
    <version>9.22.3</version>
</dependency>
```

### 7.2 Spring Boot配置

```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
    baseline-version: 0
    validate-on-migrate: true
    out-of-order: false
    clean-disabled: true
```

### 7.3 配置文件（flyway.conf）

```properties
# Flyway配置
flyway.url=jdbc:mysql://localhost:3306/linsir_system
flyway.user=app_admin
flyway.password=your_password
flyway.locations=filesystem:04-migration-scripts
flyway.baselineOnMigrate=true
flyway.baselineVersion=0
flyway.validateOnMigrate=true
flyway.cleanDisabled=true
```

---

## 八、迁移执行流程

### 8.1 开发环境

1. 编写迁移脚本
2. 本地测试执行
3. 验证结果
4. 提交代码

### 8.2 测试环境

1. 从代码仓库获取最新脚本
2. 执行迁移命令
3. 验证数据完整性
4. 运行功能测试

```bash
# Flyway命令行执行
flyway -configFiles=flyway.conf migrate

# 查看迁移状态
flyway -configFiles=flyway.conf info

# 验证迁移
flyway -configFiles=flyway.conf validate
```

### 8.3 生产环境

1. 申请变更窗口
2. 备份数据库
3. 执行迁移
4. 验证结果
5. 监控应用状态

---

## 九、迁移注意事项

### 9.1 大表变更

对于大表（超过100万条记录）的结构变更：

1. **使用pt-online-schema-change**（Percona Toolkit）
   ```bash
   pt-online-schema-change \
       --alter "ADD COLUMN new_field VARCHAR(100)" \
       D=linsir_system,t=sys_user \
       --execute
   ```

2. **使用gh-ost**（GitHub Online Schema Migration）
   ```bash
   gh-ost \
       --database="linsir_system" \
       --table="sys_user" \
       --alter="ADD COLUMN new_field VARCHAR(100)" \
       --execute
   ```

### 9.2 数据迁移

1. **分批处理**：大量数据迁移时分批执行，避免锁表
2. **事务控制**：合理使用事务，避免事务过大
3. **数据验证**：迁移后验证数据完整性
4. **备份策略**：迁移前必须备份数据

### 9.3 并发控制

1. **避免高峰期**：在低峰期执行迁移
2. **锁表时间**：控制锁表时间在可接受范围内
3. **在线DDL**：优先使用在线DDL工具

---

## 十、迁移检查清单

### 10.1 脚本编写检查

- [ ] 脚本命名符合规范
- [ ] 包含完整的头部注释
- [ ] 使用 IF EXISTS / IF NOT EXISTS 确保幂等性
- [ ] 包含回滚说明
- [ ] 脚本在本地测试通过

### 10.2 迁移前检查

- [ ] 数据库已备份
- [ ] 迁移脚本已审核
- [ ] 变更窗口已申请
- [ ] 回滚方案已准备
- [ ] 相关人员已通知

### 10.3 迁移后检查

- [ ] 迁移执行成功
- [ ] 数据完整性验证通过
- [ ] 应用功能测试通过
- [ ] 性能测试通过（如有需要）
- [ ] 监控无异常

---

## 十一、相关文档

| 文档名称 | 文档编号 | 位置 |
|---------|---------|------|
| SQL编码规范 | DB-STD-002 | 01-database-design-standard/02-sql-coding-standard.md |
| SQL脚本开发流程 | DB-PROC-004 | 02-process-standards/04-sql-scripts-process.md |
| Flyway官方文档 | - | https://documentation.red-gate.com/flyway |

---

## 十二、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 数据库架构师 | 初始版本，定义迁移脚本规范 |
