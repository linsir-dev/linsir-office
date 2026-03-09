# 数据库命名规范

> **文档编号**: SYS-DB-STD-001  
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

本文档定义System平台数据库设计的命名规范，确保数据库对象命名的一致性、可读性和可维护性。

### 1.2 适用范围

- 数据库名称
- 表名称
- 字段名称
- 索引名称
- 约束名称
- 视图名称
- 存储过程/函数名称

### 1.3 命名原则

1. **简洁性**: 名称应简洁明了，避免过长
2. **可读性**: 使用有意义的英文单词或缩写
3. **一致性**: 全系统遵循统一的命名规则
4. **规范性**: 避免使用保留字和特殊字符

---

## 二、数据库命名规范

### 2.1 命名规则

```
格式: db_<系统名>[_<环境标识>]

示例:
- db_system          # 生产环境
- db_system_dev      # 开发环境
- db_system_test     # 测试环境
```

### 2.2 规则说明

| 项目 | 规则 | 示例 |
|-----|------|------|
| 前缀 | 统一使用 `db_` | db_ |
| 系统名 | 小写字母，多个单词用下划线连接 | system, user_center |
| 环境标识 | dev/test/prod，可选 | _dev, _test |

---

## 三、表命名规范

### 3.1 命名规则

```
格式: <前缀>_<模块名>_<表名>

示例:
- sys_user              # 系统用户表
- sys_role              # 系统角色表
- sys_user_role         # 用户角色关系表
- biz_order             # 业务订单表
- log_operation         # 操作日志表
```

### 3.2 前缀定义

| 前缀 | 含义 | 使用场景 |
|-----|------|---------|
| sys_ | 系统模块 | 用户、角色、权限、配置等系统基础表 |
| biz_ | 业务模块 | 业务相关的核心数据表 |
| log_ | 日志模块 | 操作日志、登录日志等 |
| tmp_ | 临时表 | 临时数据处理表，使用后清理 |
| bak_ | 备份表 | 数据备份表，定期清理 |
| his_ | 历史表 | 历史数据归档表 |

### 3.3 模块名定义

| 模块名 | 说明 | 示例表 |
|-------|------|-------|
| user | 用户管理 | sys_user, sys_user_role |
| role | 角色权限 | sys_role, sys_permission |
| dept | 组织架构 | sys_dept, sys_position |
| config | 系统配置 | sys_config, sys_dict |
| log | 日志审计 | log_operation, log_login |

### 3.4 表名长度限制

- 表名总长度不超过 **30** 个字符
- 模块名不超过 **10** 个字符
- 表名部分不超过 **20** 个字符

---

## 四、字段命名规范

### 4.1 命名规则

```
格式: <业务含义>[_<修饰词>]

示例:
- user_name             # 用户名
- create_time           # 创建时间
- is_deleted            # 是否删除
- parent_id             # 父级ID
- sort_order            # 排序号
```

### 4.2 常用字段命名

#### 4.2.1 主键字段

| 字段名 | 数据类型 | 说明 |
|-------|---------|------|
| id | BIGINT | 主键ID，自增 |

#### 4.2.2 审计字段

| 字段名 | 数据类型 | 说明 |
|-------|---------|------|
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |
| create_by | BIGINT | 创建人ID |
| update_by | BIGINT | 更新人ID |

#### 4.2.3 状态字段

| 字段名 | 数据类型 | 说明 |
|-------|---------|------|
| status | TINYINT | 状态（0-禁用, 1-启用） |
| deleted | TINYINT | 删除标志（0-正常, 1-删除） |
| is_xxx | TINYINT | 是否xxx（0-否, 1-是） |

#### 4.2.4 关系字段

| 字段名 | 数据类型 | 说明 |
|-------|---------|------|
| xxx_id | BIGINT | 外键关联字段 |
| parent_id | BIGINT | 父级ID（自关联） |
| tenant_id | BIGINT | 租户ID（多租户） |

#### 4.2.5 排序字段

| 字段名 | 数据类型 | 说明 |
|-------|---------|------|
| sort_order | INT | 排序号（升序） |
| sort_no | INT | 排序编号 |

### 4.3 字段命名规则

| 规则 | 说明 | 正确示例 | 错误示例 |
|-----|------|---------|---------|
| 小写字母 | 全部使用小写 | user_name | UserName |
| 下划线分隔 | 单词间用下划线 | create_time | createTime |
| 避免缩写 | 使用完整单词 | description | desc |
| 单数形式 | 不使用复数 | user | users |
| 避免保留字 | 不使用SQL保留字 | user_name | name |

---

## 五、索引命名规范

### 5.1 命名规则

```
格式: <前缀>_<表名>_<字段名>[_<序号>]

示例:
- idx_user_username         # 用户表用户名索引
- idx_user_phone            # 用户表手机号索引
- idx_order_user_id_status  # 订单表用户ID和状态联合索引
- uk_user_email             # 用户表邮箱唯一索引
- pk_user                   # 用户表主键索引
```

### 5.2 前缀定义

| 前缀 | 含义 | 使用场景 |
|-----|------|---------|
| idx_ | 普通索引 | 非唯一索引 |
| uk_ | 唯一索引 | 唯一约束索引 |
| pk_ | 主键索引 | 主键约束索引 |
| fk_ | 外键索引 | 外键约束索引 |
| ft_ | 全文索引 | 全文搜索索引 |

### 5.3 索引命名示例

| 索引类型 | 表名 | 字段 | 索引名称 |
|---------|------|------|---------|
| 普通索引 | sys_user | username | idx_user_username |
| 普通索引 | sys_user | phone | idx_user_phone |
| 联合索引 | sys_user | dept_id, status | idx_user_dept_status |
| 唯一索引 | sys_user | email | uk_user_email |
| 主键索引 | sys_user | id | pk_user |
| 外键索引 | sys_user_role | user_id | fk_user_role_user_id |

---

## 六、约束命名规范

### 6.1 命名规则

```
格式: <前缀>_<表名>[_<字段名>]

示例:
- pk_user                   # 用户表主键约束
- uk_user_username          # 用户表用户名唯一约束
- uk_user_email             # 用户表邮箱唯一约束
- fk_user_dept_id           # 用户表部门外键约束
- chk_user_status           # 用户表状态检查约束
```

### 6.2 前缀定义

| 前缀 | 含义 | 使用场景 |
|-----|------|---------|
| pk_ | Primary Key | 主键约束 |
| uk_ | Unique Key | 唯一约束 |
| fk_ | Foreign Key | 外键约束 |
| chk_ | Check | 检查约束 |

---

## 七、视图命名规范

### 7.1 命名规则

```
格式: <前缀>_<视图描述>

示例:
- v_user_role               # 用户角色视图
- v_user_detail             # 用户详情视图
- v_order_statistics        # 订单统计视图
```

### 7.2 前缀定义

| 前缀 | 含义 | 使用场景 |
|-----|------|---------|
| v_ | 普通视图 | 常规查询视图 |
| v_stat_ | 统计视图 | 数据统计视图 |
| v_report_ | 报表视图 | 报表查询视图 |

---

## 八、存储过程/函数命名规范

### 8.1 命名规则

```
格式: <前缀>_<功能描述>

示例:
- sp_batch_update_status    # 批量更新状态存储过程
- sp_data_cleanup           # 数据清理存储过程
- fn_calc_age               # 计算年龄函数
- fn_get_user_name          # 获取用户名函数
```

### 8.2 前缀定义

| 前缀 | 含义 | 使用场景 |
|-----|------|---------|
| sp_ | Stored Procedure | 存储过程 |
| fn_ | Function | 函数 |
| trg_ | Trigger | 触发器 |

---

## 九、命名禁用清单

### 9.1 禁用保留字

以下单词禁止作为对象名称：

```
SELECT, INSERT, UPDATE, DELETE, FROM, WHERE, AND, OR, NOT
NULL, TRUE, FALSE, TABLE, INDEX, VIEW, DATABASE, SCHEMA
USER, ROLE, GRANT, REVOKE, PRIMARY, FOREIGN, KEY, REFERENCES
ORDER, GROUP, BY, HAVING, JOIN, INNER, OUTER, LEFT, RIGHT
```

### 9.2 禁用特殊字符

- 禁止使用空格
- 禁止使用连字符 `-`
- 禁止使用点号 `.`
- 禁止使用斜杠 `/` `\`
- 禁止使用中文

### 9.3 禁用前缀/后缀

- 禁止使用 `tbl_` 作为表前缀
- 禁止使用 `col_` 作为字段前缀
- 禁止使用 `sp_` 作为存储过程前缀（系统保留）
- 禁止使用 `fn_` 作为函数前缀（系统保留）

---

## 十、命名示例汇总

### 10.1 完整示例

```sql
-- 数据库
CREATE DATABASE db_system CHARACTER SET utf8mb4;

-- 表
CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    status TINYINT DEFAULT 1,
    dept_id BIGINT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    tenant_id BIGINT DEFAULT 0,
    
    -- 约束
    CONSTRAINT pk_user PRIMARY KEY (id),
    CONSTRAINT uk_user_username UNIQUE (username),
    CONSTRAINT uk_user_email UNIQUE (email),
    CONSTRAINT fk_user_dept_id FOREIGN KEY (dept_id) REFERENCES sys_dept(id)
);

-- 索引
CREATE INDEX idx_user_phone ON sys_user(phone);
CREATE INDEX idx_user_dept_status ON sys_user(dept_id, status);

-- 视图
CREATE VIEW v_user_role AS
SELECT u.id, u.username, r.role_name
FROM sys_user u
LEFT JOIN sys_user_role ur ON u.id = ur.user_id
LEFT JOIN sys_role r ON ur.role_id = r.id;
```

---

## 十一、审核签字

| 角色 | 签字 | 日期 |
|-----|------|------|
| 编制人 | 数据库架构师 | 2026-03-08 |
| 审核人 | 技术总监 | 2026-03-08 |
| 批准人 | 技术总监 | 2026-03-08 |

**审核意见**: 规范内容完整，命名规则清晰，符合项目要求，同意发布实施。

---

## 十二、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 数据库架构师 | 初始版本，建立数据库命名规范 |
