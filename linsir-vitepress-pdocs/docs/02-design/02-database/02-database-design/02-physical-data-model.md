# 物理数据模型

> **文档编号**: SYS-DB-DES-002  
> **版本**: 1.0  
> **日期**: 2026-03-08  
> **作者**: 数据库架构师  
> **状态**: ✅ 已评审

---

## 一、概述

### 1.1 文档目的

本文档基于逻辑数据模型，设计System平台的物理数据模型（Physical Data Model），定义具体的表结构、字段类型、约束条件，为数据库实施提供基础。

### 1.2 输入文档

- 逻辑数据模型（SYS-DB-DES-001）
- 数据库命名规范
- MySQL 8.0 数据库规范

### 1.3 设计原则

- **性能优先**: 考虑查询性能，合理设计字段类型和索引
- **空间优化**: 选择合适的数据类型，避免空间浪费
- **可维护性**: 清晰的命名和完整的注释
- **兼容性**: 遵循MySQL 8.0标准

---

## 二、数据库设计

### 2.1 数据库信息

| 属性 | 值 |
|-----|---|
| 数据库名 | `db_system` |
| 字符集 | `utf8mb4` |
| 排序规则 | `utf8mb4_unicode_ci` |
| 存储引擎 | `InnoDB` |
| 时区 | `+08:00` |

### 2.2 建库语句

```sql
CREATE DATABASE IF NOT EXISTS `db_system` 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;

USE `db_system`;
```

---

## 三、表结构设计

### 3.1 用户管理域

#### 3.1.1 用户表 (sys_user)

**表说明**: 存储系统用户的基本信息

**表结构**:

```sql
CREATE TABLE `sys_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码（加密存储）',
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `avatar` varchar(200) DEFAULT NULL COMMENT '头像URL',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `gender` tinyint DEFAULT '0' COMMENT '性别：0-未知，1-男，2-女',
  `employee_no` varchar(50) DEFAULT NULL COMMENT '员工编号',
  `dept_id` bigint DEFAULT NULL COMMENT '主属部门ID',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志：0-正常，1-删除',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_phone` (`phone`),
  UNIQUE KEY `uk_employee_no` (`employee_no`),
  KEY `idx_dept_id` (`dept_id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
```

**字段说明**:

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 |
|-------|---------|------|-------|------|
| id | BIGINT | 否 | 自增 | 主键 |
| username | VARCHAR(50) | 否 | - | 用户名，唯一 |
| password | VARCHAR(100) | 否 | - | BCrypt加密 |
| nickname | VARCHAR(50) | 是 | NULL | 显示名称 |
| email | VARCHAR(100) | 是 | NULL | 邮箱，唯一 |
| phone | VARCHAR(20) | 是 | NULL | 手机号，唯一 |
| avatar | VARCHAR(200) | 是 | NULL | 头像URL |
| status | TINYINT | 否 | 1 | 0-禁用，1-启用 |
| gender | TINYINT | 是 | 0 | 0-未知，1-男，2-女 |
| employee_no | VARCHAR(50) | 是 | NULL | 员工编号，唯一 |
| dept_id | BIGINT | 是 | NULL | 外键：sys_dept.id |
| remark | VARCHAR(500) | 是 | NULL | 备注 |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 |
| update_time | DATETIME | 否 | CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 是 | NULL | 创建人ID |
| update_by | BIGINT | 是 | NULL | 更新人ID |
| deleted | TINYINT | 否 | 0 | 逻辑删除标志 |
| tenant_id | BIGINT | 否 | - | 租户ID |

---

#### 3.1.2 用户角色关系表 (sys_user_role)

**表说明**: 用户与角色的多对多关系

```sql
CREATE TABLE `sys_user_role` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '关系ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `is_primary` tinyint NOT NULL DEFAULT '0' COMMENT '是否主角色：0-否，1-是',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role` (`user_id`,`role_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关系表';
```

---

#### 3.1.3 用户部门关系表 (sys_user_dept)

**表说明**: 用户与部门的多对多关系

```sql
CREATE TABLE `sys_user_dept` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '关系ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `dept_id` bigint NOT NULL COMMENT '部门ID',
  `is_primary` tinyint NOT NULL DEFAULT '0' COMMENT '是否主部门：0-否，1-是',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_dept` (`user_id`,`dept_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_dept_id` (`dept_id`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户部门关系表';
```

---

### 3.2 权限管理域

#### 3.2.1 角色表 (sys_role)

**表说明**: 系统角色定义

```sql
CREATE TABLE `sys_role` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_code` varchar(50) NOT NULL COMMENT '角色编码',
  `role_name` varchar(50) NOT NULL COMMENT '角色名称',
  `role_type` tinyint NOT NULL DEFAULT '2' COMMENT '角色类型：1-系统角色，2-业务角色',
  `data_scope` tinyint NOT NULL DEFAULT '1' COMMENT '数据范围：1-全部，2-本部门，3-本部门及子部门，4-仅本人，5-自定义',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `sort_order` int NOT NULL DEFAULT '0' COMMENT '排序号',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';
```

---

#### 3.2.2 角色权限关系表 (sys_role_permission)

**表说明**: 角色与权限的多对多关系

```sql
CREATE TABLE `sys_role_permission` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '关系ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `permission_id` bigint NOT NULL COMMENT '权限ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_permission` (`role_id`,`permission_id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关系表';
```

---

#### 3.2.3 权限表 (sys_permission)

**表说明**: 系统权限定义

```sql
CREATE TABLE `sys_permission` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  `perm_code` varchar(100) NOT NULL COMMENT '权限编码',
  `perm_name` varchar(50) NOT NULL COMMENT '权限名称',
  `resource_type` tinyint NOT NULL COMMENT '资源类型：1-菜单，2-按钮，3-接口',
  `resource_url` varchar(200) DEFAULT NULL COMMENT '资源URL',
  `http_method` varchar(10) DEFAULT NULL COMMENT 'HTTP方法：GET/POST/PUT/DELETE',
  `parent_id` bigint NOT NULL DEFAULT '0' COMMENT '父权限ID，0表示根',
  `sort_order` int NOT NULL DEFAULT '0' COMMENT '排序号',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_perm_code` (`perm_code`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_resource_type` (`resource_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';
```

---

#### 3.2.4 菜单表 (sys_menu)

**表说明**: 系统菜单定义

```sql
CREATE TABLE `sys_menu` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `menu_name` varchar(50) NOT NULL COMMENT '菜单名称',
  `menu_type` tinyint NOT NULL COMMENT '菜单类型：1-目录，2-菜单，3-按钮',
  `icon` varchar(100) DEFAULT NULL COMMENT '菜单图标',
  `path` varchar(200) DEFAULT NULL COMMENT '路由路径',
  `component` varchar(200) DEFAULT NULL COMMENT '组件路径',
  `permission` varchar(100) DEFAULT NULL COMMENT '权限标识',
  `parent_id` bigint NOT NULL DEFAULT '0' COMMENT '父菜单ID，0表示根',
  `menu_level` int NOT NULL DEFAULT '1' COMMENT '菜单层级',
  `sort_order` int NOT NULL DEFAULT '0' COMMENT '排序号',
  `is_cache` tinyint NOT NULL DEFAULT '0' COMMENT '是否缓存：0-否，1-是',
  `is_visible` tinyint NOT NULL DEFAULT '1' COMMENT '是否可见：0-否，1-是',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单表';
```

---

### 3.3 组织管理域

#### 3.3.1 部门表 (sys_dept)

**表说明**: 组织架构部门

```sql
CREATE TABLE `sys_dept` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '部门ID',
  `dept_code` varchar(50) NOT NULL COMMENT '部门编码',
  `dept_name` varchar(50) NOT NULL COMMENT '部门名称',
  `parent_id` bigint NOT NULL DEFAULT '0' COMMENT '父部门ID，0表示根',
  `ancestors` varchar(500) DEFAULT NULL COMMENT '祖先路径，如：0,1,2,',
  `dept_level` int NOT NULL DEFAULT '1' COMMENT '部门层级',
  `leader_id` bigint DEFAULT NULL COMMENT '负责人ID',
  `sort_order` int NOT NULL DEFAULT '0' COMMENT '排序号',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dept_code` (`dept_code`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_leader_id` (`leader_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='部门表';
```

---

#### 3.3.2 岗位表 (sys_position)

**表说明**: 岗位定义

```sql
CREATE TABLE `sys_position` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '岗位ID',
  `position_code` varchar(50) NOT NULL COMMENT '岗位编码',
  `position_name` varchar(50) NOT NULL COMMENT '岗位名称',
  `position_level` int DEFAULT NULL COMMENT '岗位级别，数字越小级别越高',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `sort_order` int NOT NULL DEFAULT '0' COMMENT '排序号',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_position_code` (`position_code`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='岗位表';
```

---

#### 3.3.3 员工表 (sys_employee)

**表说明**: 员工信息

```sql
CREATE TABLE `sys_employee` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '员工ID',
  `employee_no` varchar(50) NOT NULL COMMENT '员工编号',
  `employee_name` varchar(50) NOT NULL COMMENT '员工姓名',
  `user_id` bigint DEFAULT NULL COMMENT '关联用户ID',
  `dept_id` bigint NOT NULL COMMENT '所属部门ID',
  `position_id` bigint DEFAULT NULL COMMENT '岗位ID',
  `gender` tinyint DEFAULT '0' COMMENT '性别：0-未知，1-男，2-女',
  `birthday` date DEFAULT NULL COMMENT '出生日期',
  `id_card` varchar(100) DEFAULT NULL COMMENT '身份证号（加密存储）',
  `phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `entry_date` date DEFAULT NULL COMMENT '入职日期',
  `leave_date` date DEFAULT NULL COMMENT '离职日期',
  `employment_status` tinyint NOT NULL DEFAULT '1' COMMENT '在职状态：1-在职，2-离职，3-试用期',
  `work_location` varchar(100) DEFAULT NULL COMMENT '工作地点',
  `address` varchar(200) DEFAULT NULL COMMENT '家庭住址',
  `emergency_contact` varchar(50) DEFAULT NULL COMMENT '紧急联系人',
  `emergency_phone` varchar(20) DEFAULT NULL COMMENT '紧急联系电话',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_no` (`employee_no`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_dept_id` (`dept_id`),
  KEY `idx_position_id` (`position_id`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='员工表';
```

---

### 3.4 系统配置域

#### 3.4.1 租户基本信息配置表 (sys_tenant_config)

**表说明**: 租户基本信息配置

```sql
CREATE TABLE `sys_tenant_config` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `tenant_name` varchar(100) NOT NULL COMMENT '租户名称',
  `tenant_code` varchar(50) NOT NULL COMMENT '租户编码',
  `logo_url` varchar(200) DEFAULT NULL COMMENT '租户Logo',
  `contact_name` varchar(50) DEFAULT NULL COMMENT '联系人姓名',
  `contact_phone` varchar(20) DEFAULT NULL COMMENT '联系人电话',
  `contact_email` varchar(100) DEFAULT NULL COMMENT '联系人邮箱',
  `address` varchar(200) DEFAULT NULL COMMENT '公司地址',
  `industry_type` varchar(50) DEFAULT NULL COMMENT '行业类型',
  `company_scale` varchar(50) DEFAULT NULL COMMENT '公司规模',
  `expire_time` datetime DEFAULT NULL COMMENT '到期时间',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '租户状态：0-禁用，1-启用',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_code` (`tenant_code`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='租户基本信息配置表';
```

---

#### 3.4.2 Web信息配置表 (sys_web_config)

**表说明**: Web端配置信息

```sql
CREATE TABLE `sys_web_config` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `site_title` varchar(100) DEFAULT NULL COMMENT '网站标题',
  `site_logo` varchar(200) DEFAULT NULL COMMENT '网站Logo',
  `site_favicon` varchar(200) DEFAULT NULL COMMENT '网站图标',
  `login_bg_image` varchar(200) DEFAULT NULL COMMENT '登录背景图',
  `login_title` varchar(100) DEFAULT NULL COMMENT '登录页标题',
  `copyright` varchar(200) DEFAULT NULL COMMENT '版权信息',
  `icp_record` varchar(100) DEFAULT NULL COMMENT 'ICP备案号',
  `theme_color` varchar(20) DEFAULT NULL COMMENT '主题色',
  `sidebar_theme` tinyint DEFAULT '1' COMMENT '侧边栏主题：1-深色，2-浅色',
  `layout_mode` tinyint DEFAULT '1' COMMENT '布局模式：1-左侧菜单，2-顶部菜单',
  `is_show_watermark` tinyint NOT NULL DEFAULT '0' COMMENT '是否显示水印：0-否，1-是',
  `watermark_text` varchar(100) DEFAULT NULL COMMENT '水印文字',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Web信息配置表';
```

---

#### 3.4.3 商务信息配置表 (sys_business_config)

**表说明**: 商务信息配置

```sql
CREATE TABLE `sys_business_config` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `contract_no` varchar(50) DEFAULT NULL COMMENT '合同编号',
  `contract_start_date` date DEFAULT NULL COMMENT '合同开始日期',
  `contract_end_date` date DEFAULT NULL COMMENT '合同结束日期',
  `service_type` varchar(50) DEFAULT NULL COMMENT '服务类型',
  `service_level` varchar(50) DEFAULT NULL COMMENT '服务等级',
  `max_user_count` int DEFAULT NULL COMMENT '最大用户数',
  `max_storage_size` bigint DEFAULT NULL COMMENT '最大存储空间（MB）',
  `payment_cycle` tinyint DEFAULT NULL COMMENT '付款周期：1-月付，2-季付，3-年付',
  `payment_status` tinyint DEFAULT NULL COMMENT '付款状态：0-未付款，1-已付款',
  `invoice_title` varchar(200) DEFAULT NULL COMMENT '发票抬头',
  `invoice_tax_no` varchar(50) DEFAULT NULL COMMENT '发票税号',
  `invoice_address` varchar(200) DEFAULT NULL COMMENT '发票地址',
  `invoice_phone` varchar(20) DEFAULT NULL COMMENT '发票电话',
  `invoice_bank` varchar(100) DEFAULT NULL COMMENT '开户银行',
  `invoice_account` varchar(50) DEFAULT NULL COMMENT '银行账号',
  `sales_manager` varchar(50) DEFAULT NULL COMMENT '销售经理',
  `sales_phone` varchar(20) DEFAULT NULL COMMENT '销售电话',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商务信息配置表';
```

---

#### 3.4.4 数据字典类型表 (sys_dict_type)

**表说明**: 数据字典类型

```sql
CREATE TABLE `sys_dict_type` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '类型ID',
  `dict_code` varchar(50) NOT NULL COMMENT '字典编码',
  `dict_name` varchar(50) NOT NULL COMMENT '字典名称',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dict_code` (`dict_code`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据字典类型表';
```

---

#### 3.4.5 数据字典项表 (sys_dict_item)

**表说明**: 数据字典项

```sql
CREATE TABLE `sys_dict_item` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '项ID',
  `dict_type_id` bigint NOT NULL COMMENT '字典类型ID',
  `item_code` varchar(50) NOT NULL COMMENT '项编码',
  `item_label` varchar(50) NOT NULL COMMENT '项标签',
  `item_value` varchar(100) NOT NULL COMMENT '项值',
  `sort_order` int NOT NULL DEFAULT '0' COMMENT '排序号',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  PRIMARY KEY (`id`),
  KEY `idx_dict_type_id` (`dict_type_id`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据字典项表';
```

---

### 3.5 审计日志域

#### 3.5.1 操作日志表 (sys_operation_log)

**表说明**: 用户操作日志

```sql
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
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_operation_type` (`operation_type`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';
```

---

#### 3.5.2 登录日志表 (sys_login_log)

**表说明**: 用户登录日志

```sql
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
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_username` (`username`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录日志表';
```

---

## 四、约束汇总

### 4.1 主键约束

| 表名 | 主键字段 | 说明 |
|-----|---------|------|
| sys_user | id | 自增主键 |
| sys_role | id | 自增主键 |
| sys_permission | id | 自增主键 |
| sys_menu | id | 自增主键 |
| sys_dept | id | 自增主键 |
| sys_position | id | 自增主键 |
| sys_employee | id | 自增主键 |
| sys_tenant_config | id | 自增主键 |
| sys_web_config | id | 自增主键 |
| sys_business_config | id | 自增主键 |
| sys_dict_type | id | 自增主键 |
| sys_dict_item | id | 自增主键 |
| sys_operation_log | id | 自增主键 |
| sys_login_log | id | 自增主键 |

### 4.2 唯一约束

| 表名 | 字段 | 约束名 | 说明 |
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
| sys_employee | user_id | uk_user_id | 用户ID唯一 |
| sys_tenant_config | tenant_code | uk_tenant_code | 租户编码唯一 |
| sys_dict_type | dict_code | uk_dict_code | 字典编码唯一 |

### 4.3 外键约束

| 子表 | 字段 | 父表 | 父字段 | 级联规则 |
|-----|------|------|-------|---------|
| sys_user | dept_id | sys_dept | id | ON DELETE SET NULL |
| sys_user_role | user_id | sys_user | id | ON DELETE CASCADE |
| sys_user_role | role_id | sys_role | id | ON DELETE CASCADE |
| sys_user_dept | user_id | sys_user | id | ON DELETE CASCADE |
| sys_user_dept | dept_id | sys_dept | id | ON DELETE CASCADE |
| sys_role_permission | role_id | sys_role | id | ON DELETE CASCADE |
| sys_role_permission | permission_id | sys_permission | id | ON DELETE CASCADE |
| sys_employee | user_id | sys_user | id | ON DELETE SET NULL |
| sys_employee | dept_id | sys_dept | id | ON DELETE RESTRICT |
| sys_employee | position_id | sys_position | id | ON DELETE SET NULL |
| sys_dict_item | dict_type_id | sys_dict_type | id | ON DELETE CASCADE |

---

## 五、表统计

| 域 | 表数量 | 表名 |
|---|-------|------|
| 用户管理域 | 3 | sys_user, sys_user_role, sys_user_dept |
| 权限管理域 | 4 | sys_role, sys_role_permission, sys_permission, sys_menu |
| 组织管理域 | 3 | sys_dept, sys_position, sys_employee |
| 系统配置域 | 5 | sys_tenant_config, sys_web_config, sys_business_config, sys_dict_type, sys_dict_item |
| 审计日志域 | 2 | sys_operation_log, sys_login_log |
| **总计** | **17** | - |

---

## 六、审核记录

### 6.1 审核状态

| 审核项 | 状态 | 审核人 | 审核日期 |
|-------|------|-------|---------|
| 表结构设计 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 约束设计 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 字段类型定义 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 外键关系 | ✓ 通过 | 技术负责人 | 2026-03-08 |

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
| 1.0 | 2026-03-08 | 数据库架构师 | 初始版本，创建物理数据模型 |
