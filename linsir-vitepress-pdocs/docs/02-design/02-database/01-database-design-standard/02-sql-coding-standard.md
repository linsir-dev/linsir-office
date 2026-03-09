# SQL编码规范

> **文档编号**: SYS-DB-STD-002  
> **版本**: 1.0  
> **日期**: 2026-03-08  
> **作者**: 数据库架构师  
> **状态**: ✅ 已发布  
> **审核状态**: ✓ 已审核通过  
> **审核日期**: 2026-03-08  
> **审核人**: 技术总监

---

## 一、概述

### 1.1 目的

本文档定义System平台SQL编码规范，确保SQL代码的可读性、可维护性和性能。

### 1.2 适用范围

- DDL语句（CREATE, ALTER, DROP）
- DML语句（SELECT, INSERT, UPDATE, DELETE）
- DCL语句（GRANT, REVOKE）
- 存储过程和函数
- 视图定义

### 1.3 编码原则

1. **可读性**: 代码应易于阅读和理解
2. **一致性**: 遵循统一的编码风格
3. **性能**: 编写高效的SQL语句
4. **安全**: 防止SQL注入等安全问题

---

## 二、基本格式规范

### 2.1 大小写规范

| 类型 | 规范 | 示例 |
|-----|------|------|
| SQL关键字 | 大写 | SELECT, FROM, WHERE |
| 表名 | 小写 | sys_user, sys_role |
| 字段名 | 小写 | user_name, create_time |
| 函数 | 大写 | COUNT(), SUM(), MAX() |

### 2.2 缩进规范

```sql
-- 正确：使用2个空格缩进
SELECT 
  u.id,
  u.username,
  r.role_name
FROM sys_user u
LEFT JOIN sys_role r ON u.id = r.user_id
WHERE u.status = 1
  AND u.deleted = 0
ORDER BY u.create_time DESC;

-- 错误：不使用缩进或缩进不一致
SELECT u.id, u.username, r.role_name
FROM sys_user u
LEFT JOIN sys_role r ON u.id = r.user_id
WHERE u.status = 1 AND u.deleted = 0
ORDER BY u.create_time DESC;
```

### 2.3 换行规范

```sql
-- 正确：每个子句换行
SELECT 
  id,
  username,
  email
FROM sys_user
WHERE status = 1
  AND deleted = 0
ORDER BY create_time DESC
LIMIT 10;

-- 错误：所有内容在一行
SELECT id, username, email FROM sys_user WHERE status = 1 AND deleted = 0 ORDER BY create_time DESC LIMIT 10;
```

### 2.4 逗号位置

```sql
-- 正确：逗号在行尾
SELECT 
  id,
  username,
  email,
  phone
FROM sys_user;

-- 错误：逗号在行首
SELECT 
  id
  , username
  , email
  , phone
FROM sys_user;
```

---

## 三、SELECT语句规范

### 3.1 基本结构

```sql
SELECT 
  [列名列表]
FROM [表名]
[JOIN子句]
[WHERE子句]
[GROUP BY子句]
[HAVING子句]
[ORDER BY子句]
[LIMIT子句];
```

### 3.2 列选择规范

```sql
-- 正确：明确指定需要的列
SELECT 
  id,
  username,
  email,
  create_time
FROM sys_user;

-- 错误：使用SELECT *（除非确实需要所有列）
SELECT * FROM sys_user;

-- 正确：使用表别名
SELECT 
  u.id,
  u.username,
  r.role_name
FROM sys_user u
LEFT JOIN sys_role r ON u.id = r.user_id;
```

### 3.3 别名规范

```sql
-- 正确：表使用有意义的别名
SELECT 
  u.id,
  u.username,
  r.role_name,
  d.dept_name
FROM sys_user u
LEFT JOIN sys_user_role ur ON u.id = ur.user_id
LEFT JOIN sys_role r ON ur.role_id = r.id
LEFT JOIN sys_dept d ON u.dept_id = d.id;

-- 正确：列别名使用AS关键字
SELECT 
  COUNT(*) AS total_count,
  MAX(create_time) AS latest_time
FROM sys_user;
```

### 3.4 WHERE子句规范

```sql
-- 正确：每个条件单独一行，AND/OR在行首
SELECT 
  id,
  username
FROM sys_user
WHERE status = 1
  AND deleted = 0
  AND create_time >= '2026-01-01';

-- 正确：使用IN代替多个OR
SELECT 
  id,
  username
FROM sys_user
WHERE status IN (1, 2, 3);

-- 错误：多个OR条件
SELECT 
  id,
  username
FROM sys_user
WHERE status = 1 OR status = 2 OR status = 3;
```

### 3.5 JOIN规范

```sql
-- 正确：明确指定JOIN类型
SELECT 
  u.id,
  u.username,
  r.role_name
FROM sys_user u
INNER JOIN sys_user_role ur ON u.id = ur.user_id
LEFT JOIN sys_role r ON ur.role_id = r.id
WHERE u.status = 1;

-- 正确：JOIN条件使用ON子句
SELECT 
  u.id,
  u.username,
  r.role_name
FROM sys_user u
LEFT JOIN sys_role r ON u.id = r.user_id AND r.status = 1;

-- 错误：使用WHERE代替ON
SELECT 
  u.id,
  u.username,
  r.role_name
FROM sys_user u, sys_role r
WHERE u.id = r.user_id;
```

### 3.6 ORDER BY规范

```sql
-- 正确：明确指定排序方向
SELECT 
  id,
  username,
  create_time
FROM sys_user
ORDER BY create_time DESC, username ASC;

-- 错误：不明确排序方向（默认ASC，但应显式指定）
SELECT 
  id,
  username,
  create_time
FROM sys_user
ORDER BY create_time;
```

---

## 四、INSERT语句规范

### 4.1 基本结构

```sql
-- 正确：明确指定列名
INSERT INTO sys_user (
  username,
  email,
  phone,
  status,
  create_time,
  tenant_id
) VALUES (
  'zhangsan',
  'zhangsan@example.com',
  '13800138000',
  1,
  NOW(),
  1
);

-- 错误：不指定列名
INSERT INTO sys_user VALUES ('zhangsan', 'zhangsan@example.com', ...);
```

### 4.2 批量插入规范

```sql
-- 正确：使用单条INSERT多值
INSERT INTO sys_user (
  username,
  email,
  status,
  create_time
) VALUES 
  ('user1', 'user1@example.com', 1, NOW()),
  ('user2', 'user2@example.com', 1, NOW()),
  ('user3', 'user3@example.com', 1, NOW());

-- 错误：多条INSERT语句
INSERT INTO sys_user (username, email, status, create_time) VALUES ('user1', 'user1@example.com', 1, NOW());
INSERT INTO sys_user (username, email, status, create_time) VALUES ('user2', 'user2@example.com', 1, NOW());
INSERT INTO sys_user (username, email, status, create_time) VALUES ('user3', 'user3@example.com', 1, NOW());
```

### 4.3 INSERT SELECT规范

```sql
-- 正确：明确指定列
INSERT INTO sys_user_backup (
  id,
  username,
  email,
  create_time
)
SELECT 
  id,
  username,
  email,
  create_time
FROM sys_user
WHERE create_time < '2025-01-01';
```

---

## 五、UPDATE语句规范

### 5.1 基本结构

```sql
-- 正确：使用WHERE子句
UPDATE sys_user
SET 
  email = 'newemail@example.com',
  update_time = NOW()
WHERE id = 100;

-- 错误：不使用WHERE子句（会更新所有记录）
UPDATE sys_user SET status = 0;
```

### 5.2 多表UPDATE规范

```sql
-- 正确：使用JOIN语法
UPDATE sys_user u
LEFT JOIN sys_dept d ON u.dept_id = d.id
SET u.dept_name = d.dept_name
WHERE u.deleted = 0;
```

### 5.3 安全更新

```sql
-- 正确：先SELECT确认，再UPDATE
-- 第一步：确认要更新的记录
SELECT id, username, email 
FROM sys_user 
WHERE dept_id = 10;

-- 第二步：执行更新
UPDATE sys_user
SET status = 0
WHERE dept_id = 10;
```

---

## 六、DELETE语句规范

### 6.1 基本结构

```sql
-- 正确：使用WHERE子句
DELETE FROM sys_user
WHERE id = 100;

-- 错误：不使用WHERE子句（会删除所有记录）
DELETE FROM sys_user;
```

### 6.2 逻辑删除优先

```sql
-- 推荐：使用逻辑删除
UPDATE sys_user
SET deleted = 1,
    update_time = NOW()
WHERE id = 100;

-- 不推荐：物理删除
DELETE FROM sys_user
WHERE id = 100;
```

### 6.3 安全删除

```sql
-- 正确：先SELECT确认，再DELETE
-- 第一步：确认要删除的记录
SELECT id, username 
FROM sys_user 
WHERE status = 0 
  AND create_time < '2024-01-01';

-- 第二步：执行删除
DELETE FROM sys_user
WHERE status = 0
  AND create_time < '2024-01-01';
```

---

## 七、DDL语句规范

### 7.1 建表规范

```sql
-- 正确：完整的建表语句
CREATE TABLE sys_user (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    email VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    phone VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    dept_id BIGINT DEFAULT NULL COMMENT '部门ID',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标志：0-正常，1-删除',
    tenant_id BIGINT NOT NULL DEFAULT 0 COMMENT '租户ID',
    
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_username (username),
    UNIQUE KEY uk_user_email (email),
    KEY idx_user_phone (phone),
    KEY idx_user_dept_status (dept_id, status),
    CONSTRAINT fk_user_dept_id FOREIGN KEY (dept_id) REFERENCES sys_dept (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

### 7.2 字段定义规范

| 数据类型 | 使用场景 | 示例 |
|---------|---------|------|
| BIGINT | 主键、大数据量 | `id BIGINT NOT NULL AUTO_INCREMENT` |
| INT | 普通整数、状态 | `status TINYINT NOT NULL DEFAULT 1` |
| VARCHAR | 变长字符串 | `username VARCHAR(50) NOT NULL` |
| CHAR | 定长字符串 | `phone CHAR(11)` |
| DECIMAL | 精确小数 | `amount DECIMAL(18,2) NOT NULL` |
| DATETIME | 日期时间 | `create_time DATETIME NOT NULL` |
| DATE | 日期 | `birthday DATE` |
| TEXT | 长文本 | `description TEXT` |
| JSON | JSON数据 | `config JSON` |

### 7.3 修改表结构规范

```sql
-- 正确：使用ALTER TABLE添加字段
ALTER TABLE sys_user
ADD COLUMN nickname VARCHAR(50) DEFAULT NULL COMMENT '昵称' AFTER username;

-- 正确：修改字段
ALTER TABLE sys_user
MODIFY COLUMN email VARCHAR(150) DEFAULT NULL COMMENT '邮箱';

-- 正确：添加索引
ALTER TABLE sys_user
ADD INDEX idx_user_nickname (nickname);

-- 正确：删除索引
ALTER TABLE sys_user
DROP INDEX idx_user_nickname;
```

---

## 八、注释规范

### 8.1 注释类型

```sql
-- 单行注释：使用--，后面跟一个空格
SELECT id FROM sys_user; -- 查询用户ID

/*
  多行注释：用于较长的说明
  这是多行注释的示例
*/
SELECT * FROM sys_user;
```

### 8.2 表注释

```sql
CREATE TABLE sys_user (
    ...
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表：存储系统用户基本信息';
```

### 8.3 字段注释

```sql
CREATE TABLE sys_user (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID：主键，自增',
    username VARCHAR(50) NOT NULL COMMENT '用户名：登录账号，全局唯一',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用，1-启用，默认1',
    ...
);
```

### 8.4 复杂查询注释

```sql
/*
  功能：查询用户及其角色信息
  作者：张三
  日期：2026-03-08
  说明：用于用户管理页面的列表展示
*/
SELECT 
    u.id,
    u.username,
    GROUP_CONCAT(r.role_name) AS role_names
FROM sys_user u
LEFT JOIN sys_user_role ur ON u.id = ur.user_id
LEFT JOIN sys_role r ON ur.role_id = r.id
WHERE u.deleted = 0
GROUP BY u.id;
```

---

## 九、性能优化规范

### 9.1 索引使用规范

```sql
-- 正确：使用索引字段作为查询条件
SELECT * FROM sys_user WHERE username = 'zhangsan';

-- 正确：避免在索引字段上使用函数
SELECT * FROM sys_user WHERE create_time >= '2026-01-01';

-- 错误：在索引字段上使用函数
SELECT * FROM sys_user WHERE DATE(create_time) = '2026-01-01';
```

### 9.2 避免全表扫描

```sql
-- 正确：使用LIMIT限制返回行数
SELECT * FROM sys_user WHERE status = 1 LIMIT 100;

-- 正确：使用EXISTS代替IN（子查询数据量大时）
SELECT * FROM sys_user u
WHERE EXISTS (
    SELECT 1 FROM sys_user_role ur 
    WHERE ur.user_id = u.id
);

-- 错误：使用IN（子查询数据量大时性能差）
SELECT * FROM sys_user
WHERE id IN (SELECT user_id FROM sys_user_role);
```

### 9.3 分页查询规范

```sql
-- 正确：使用LIMIT分页
SELECT 
    id,
    username,
    email,
    create_time
FROM sys_user
WHERE status = 1
ORDER BY create_time DESC
LIMIT 0, 20;  -- 第1页，每页20条

-- 正确：深分页优化
SELECT 
    u.id,
    u.username,
    u.email
FROM sys_user u
INNER JOIN (
    SELECT id
    FROM sys_user
    WHERE status = 1
    ORDER BY create_time DESC
    LIMIT 10000, 20
) tmp ON u.id = tmp.id;
```

---

## 十、安全规范

### 10.1 防止SQL注入

```sql
-- 正确：使用参数化查询（应用程序层面）
-- 不要直接拼接SQL字符串
-- String sql = "SELECT * FROM sys_user WHERE username = ?";

-- 错误：字符串拼接（存在SQL注入风险）
-- String sql = "SELECT * FROM sys_user WHERE username = '" + username + "'";
```

### 10.2 权限控制

```sql
-- 正确：最小权限原则
-- 应用程序数据库用户只授予必要的权限
GRANT SELECT, INSERT, UPDATE ON db_system.sys_user TO 'app_user'@'%';

-- 错误：授予所有权限
GRANT ALL PRIVILEGES ON db_system.* TO 'app_user'@'%';
```

### 10.3 敏感数据处理

```sql
-- 正确：密码加密存储
-- 在应用程序中加密后存储
UPDATE sys_user SET password = '$2a$10$...' WHERE id = 1;

-- 正确：查询时隐藏敏感字段
SELECT 
    id,
    username,
    email,
    -- 不查询password字段
    status,
    create_time
FROM sys_user;
```

---

## 十一、审核签字

| 角色 | 签字 | 日期 |
|-----|------|------|
| 编制人 | 数据库架构师 | 2026-03-08 |
| 审核人 | 技术总监 | 2026-03-08 |
| 批准人 | 技术总监 | 2026-03-08 |

**审核意见**: 编码规范内容详实，覆盖全面，符合项目开发要求，同意发布实施。

---

## 十二、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 数据库架构师 | 初始版本，建立SQL编码规范 |
