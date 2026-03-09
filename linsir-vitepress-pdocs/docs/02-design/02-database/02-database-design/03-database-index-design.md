# 数据库索引设计

> **文档编号**: SYS-DB-DES-003  
> **版本**: 1.0  
> **日期**: 2026-03-08  
> **作者**: 数据库架构师  
> **状态**: ✅ 已评审

---

## 一、概述

### 1.1 设计目标

- 优化查询性能，减少全表扫描
- 平衡读写性能，避免过度索引
- 支持业务关键查询场景
- 控制索引存储空间

### 1.2 设计原则

1. **选择性原则**: 优先在高选择性字段上创建索引
2. **最左前缀原则**: 联合索引按查询条件顺序排列
3. **覆盖索引原则**: 常用查询尽量使用覆盖索引
4. **避免冗余**: 避免重复索引和不必要的索引
5. **控制数量**: 单表索引不超过5个

---

## 二、索引分类

### 2.1 主键索引 (Primary Key)

所有表的主键自动创建聚簇索引。

| 表名 | 主键字段 | 索引类型 |
|-----|---------|---------|
| sys_user | id | 聚簇索引 |
| sys_role | id | 聚簇索引 |
| sys_permission | id | 聚簇索引 |
| sys_menu | id | 聚簇索引 |
| sys_dept | id | 聚簇索引 |
| sys_position | id | 聚簇索引 |
| sys_employee | id | 聚簇索引 |
| sys_tenant_config | id | 聚簇索引 |
| sys_web_config | id | 聚簇索引 |
| sys_business_config | id | 聚簇索引 |
| sys_dict_type | id | 聚簇索引 |
| sys_dict_item | id | 聚簇索引 |
| sys_operation_log | id | 聚簇索引 |
| sys_login_log | id | 聚簇索引 |

### 2.2 唯一索引 (Unique Index)

| 表名 | 字段 | 索引名 | 说明 |
|-----|------|-------|------|
| sys_user | username | uk_username | 用户名唯一 |
| sys_user | email | uk_email | 邮箱唯一 |
| sys_user | phone | uk_phone | 手机号唯一 |
| sys_user | employee_no | uk_employee_no | 员工编号唯一 |
| sys_role | role_code | uk_role_code | 角色编码唯一 |
| sys_permission | perm_code | uk_perm_code | 权限编码唯一 |
| sys_dept | dept_code | uk_dept_code | 部门编码唯一 |
| sys_position | position_code | uk_position_code | 岗位编码唯一 |
| sys_employee | employee_no | uk_employee_no | 员工编号唯一 |
| sys_employee | user_id | uk_user_id | 用户关联唯一 |
| sys_tenant_config | tenant_code | uk_tenant_code | 租户编码唯一 |
| sys_dict_type | dict_code | uk_dict_code | 字典编码唯一 |

### 2.3 普通索引 (Normal Index)

#### 用户管理域

| 表名 | 索引名 | 字段 | 说明 |
|-----|-------|------|------|
| sys_user | idx_dept_id | dept_id | 部门查询 |
| sys_user | idx_tenant_id | tenant_id | 租户查询 |
| sys_user | idx_create_time | create_time | 时间范围查询 |
| sys_user_role | idx_user_id | user_id | 用户角色查询 |
| sys_user_role | idx_role_id | role_id | 角色用户查询 |
| sys_user_role | idx_tenant_id | tenant_id | 租户查询 |
| sys_user_dept | idx_user_id | user_id | 用户部门查询 |
| sys_user_dept | idx_dept_id | dept_id | 部门用户查询 |
| sys_user_dept | idx_tenant_id | tenant_id | 租户查询 |

#### 权限管理域

| 表名 | 索引名 | 字段 | 说明 |
|-----|-------|------|------|
| sys_role | idx_tenant_id | tenant_id | 租户查询 |
| sys_role | idx_status | status | 状态查询 |
| sys_role_permission | idx_role_id | role_id | 角色权限查询 |
| sys_role_permission | idx_permission_id | permission_id | 权限角色查询 |
| sys_permission | idx_parent_id | parent_id | 父权限查询 |
| sys_permission | idx_resource_type | resource_type | 资源类型查询 |
| sys_menu | idx_parent_id | parent_id | 父菜单查询 |
| sys_menu | idx_tenant_id | tenant_id | 租户查询 |
| sys_menu | idx_status | status | 状态查询 |

#### 组织管理域

| 表名 | 索引名 | 字段 | 说明 |
|-----|-------|------|------|
| sys_dept | idx_parent_id | parent_id | 父部门查询 |
| sys_dept | idx_tenant_id | tenant_id | 租户查询 |
| sys_dept | idx_leader_id | leader_id | 负责人查询 |
| sys_position | idx_tenant_id | tenant_id | 租户查询 |
| sys_position | idx_status | status | 状态查询 |
| sys_employee | idx_dept_id | dept_id | 部门查询 |
| sys_employee | idx_position_id | position_id | 岗位查询 |
| sys_employee | idx_tenant_id | tenant_id | 租户查询 |

#### 系统配置域

| 表名 | 索引名 | 字段 | 说明 |
|-----|-------|------|------|
| sys_tenant_config | idx_tenant_id | tenant_id | 租户查询 |
| sys_tenant_config | idx_status | status | 状态查询 |
| sys_web_config | idx_tenant_id | tenant_id | 租户查询 |
| sys_business_config | idx_tenant_id | tenant_id | 租户查询 |
| sys_dict_type | idx_tenant_id | tenant_id | 租户查询 |
| sys_dict_item | idx_dict_type_id | dict_type_id | 字典类型查询 |
| sys_dict_item | idx_tenant_id | tenant_id | 租户查询 |

#### 审计日志域

| 表名 | 索引名 | 字段 | 说明 |
|-----|-------|------|------|
| sys_operation_log | idx_user_id | user_id | 用户查询 |
| sys_operation_log | idx_operation_type | operation_type | 操作类型查询 |
| sys_operation_log | idx_create_time | create_time | 时间范围查询 |
| sys_operation_log | idx_tenant_id | tenant_id | 租户查询 |
| sys_login_log | idx_user_id | user_id | 用户查询 |
| sys_login_log | idx_username | username | 用户名查询 |
| sys_login_log | idx_create_time | create_time | 时间范围查询 |
| sys_login_log | idx_tenant_id | tenant_id | 租户查询 |

---

## 三、联合索引设计

### 3.1 关系表联合索引

| 表名 | 索引名 | 字段组合 | 说明 |
|-----|-------|---------|------|
| sys_user_role | uk_user_role | user_id, role_id | 唯一约束 |
| sys_user_dept | uk_user_dept | user_id, dept_id | 唯一约束 |
| sys_role_permission | uk_role_permission | role_id, permission_id | 唯一约束 |

### 3.2 复合查询索引

| 表名 | 索引名 | 字段组合 | 适用场景 |
|-----|-------|---------|---------|
| sys_user | idx_tenant_status | tenant_id, status | 租户+状态查询 |
| sys_operation_log | idx_tenant_time | tenant_id, create_time | 租户日志时间查询 |
| sys_login_log | idx_tenant_time | tenant_id, create_time | 租户登录时间查询 |

---

## 四、索引优化建议

### 4.1 避免索引失效

| 场景 | 说明 | 建议 |
|-----|------|------|
| 函数操作 | WHERE UPPER(username) = 'xxx' | 避免在索引字段上使用函数 |
| 类型转换 | WHERE id = '123' (id为数字) | 确保类型匹配 |
| 前导模糊 | WHERE username LIKE '%xxx' | 避免前导通配符 |
| OR条件 | WHERE a = 1 OR b = 2 | 考虑使用UNION |
| 不等于 | WHERE status != 0 | 可能不走索引 |
| NULL判断 | WHERE col IS NULL | 确保字段有NOT NULL约束 |

### 4.2 索引维护

```sql
-- 查看索引使用情况
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    CARDINALITY
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'db_system'
ORDER BY TABLE_NAME, INDEX_NAME;

-- 查看表索引大小
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    ROUND(SUM(DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) AS 'Size(MB)'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'db_system'
GROUP BY TABLE_NAME;
```

### 4.3 索引监控

```sql
-- 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;

-- 查看慢查询
SELECT * FROM mysql.slow_log 
WHERE start_time > DATE_SUB(NOW(), INTERVAL 1 DAY)
ORDER BY query_time DESC;
```

---

## 五、索引统计

| 域 | 表数量 | 索引总数 | 平均索引数 |
|---|-------|---------|-----------|
| 用户管理域 | 3 | 12 | 4 |
| 权限管理域 | 4 | 15 | 3.75 |
| 组织管理域 | 3 | 11 | 3.67 |
| 系统配置域 | 5 | 14 | 2.8 |
| 审计日志域 | 2 | 8 | 4 |
| **总计** | **17** | **60** | **3.53** |

---

## 六、审核记录

### 6.1 审核状态

| 审核项 | 状态 | 审核人 | 审核日期 |
|-------|------|-------|---------|
| 主键索引设计 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 外键索引设计 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 业务索引设计 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 联合索引设计 | ✓ 通过 | 技术负责人 | 2026-03-08 |

### 6.2 签字确认

| 角色 | 姓名 | 签字 | 日期 |
|-----|------|------|------|
| 编制人 | 数据库架构师 | _____________ | 2026-03-08 |
| 审核人 | 技术负责人 | _____________ | 2026-03-08 |
| 批准人 | 项目经理 | _____________ | 2026-03-08 |

---

## 七、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 数据库架构师 | 初始版本，创建索引设计文档 |
