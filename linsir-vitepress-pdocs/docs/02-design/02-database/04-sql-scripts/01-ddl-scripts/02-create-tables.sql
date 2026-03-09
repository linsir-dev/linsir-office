-- ========================================================-- System Platform Table Creation Script
-- 表结构创建脚本
-- ========================================================-- 文档编号: SYS-DB-SQL-002
-- 版本: 1.0
-- 日期: 2026-03-08
-- 作者: 数据库架构师
-- ========================================================

USE linsir_system;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ========================================================-- 一、系统配置表
-- ========================================================

-- 1.1 租户基本信息配置表
DROP TABLE IF EXISTS `sys_tenant_config`;
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
    `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志：0-正常，1-删除',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_tenant_code` (`tenant_code`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='租户基本信息配置表';

-- 1.2 Web信息配置表
DROP TABLE IF EXISTS `sys_web_config`;
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
    `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志：0-正常，1-删除',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    PRIMARY KEY (`id`),
    KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Web信息配置表';

-- 1.3 商务信息配置表
DROP TABLE IF EXISTS `sys_business_config`;
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
    `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志：0-正常，1-删除',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    PRIMARY KEY (`id`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_contract_no` (`contract_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商务信息配置表';

-- ========================================================-- 二、数据字典表
-- ========================================================

-- 2.1 数据字典类型表
DROP TABLE IF EXISTS `sys_dict_type`;
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
    `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志：0-正常，1-删除',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_dict_code` (`dict_code`, `tenant_id`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据字典类型表';

-- 2.2 数据字典项表
DROP TABLE IF EXISTS `sys_dict_item`;
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
    `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志：0-正常，1-删除',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_dict_item` (`dict_type_id`, `item_code`, `tenant_id`),
    KEY `idx_dict_type_id` (`dict_type_id`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_status` (`status`),
    KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据字典项表';

-- ========================================================-- 三、系统日志表
-- ========================================================

-- 3.1 操作日志表（按月分区）
DROP TABLE IF EXISTS `sys_operation_log`;
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
    KEY `idx_create_time` (`create_time`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表'
PARTITION BY RANGE (YEAR(create_time) * 100 + MONTH(create_time)) (
    PARTITION p202401 VALUES LESS THAN (202402),
    PARTITION p202402 VALUES LESS THAN (202403),
    PARTITION p202403 VALUES LESS THAN (202404),
    PARTITION p202404 VALUES LESS THAN (202405),
    PARTITION p202405 VALUES LESS THAN (202406),
    PARTITION p202406 VALUES LESS THAN (202407),
    PARTITION p202407 VALUES LESS THAN (202408),
    PARTITION p202408 VALUES LESS THAN (202409),
    PARTITION p202409 VALUES LESS THAN (202410),
    PARTITION p202410 VALUES LESS THAN (202411),
    PARTITION p202411 VALUES LESS THAN (202412),
    PARTITION p202412 VALUES LESS THAN (202413),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);

-- 3.2 登录日志表（按月分区）
DROP TABLE IF EXISTS `sys_login_log`;
CREATE TABLE `sys_login_log` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '日志ID',
    `user_id` bigint DEFAULT NULL COMMENT '用户ID',
    `username` varchar(50) NOT NULL COMMENT '用户名',
    `login_type` tinyint NOT NULL COMMENT '登录类型：1-账号密码，2-手机号，3-邮箱，4-第三方',
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
    KEY `idx_login_type` (`login_type`),
    KEY `idx_create_time` (`create_time`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录日志表'
PARTITION BY RANGE (YEAR(create_time) * 100 + MONTH(create_time)) (
    PARTITION p202401 VALUES LESS THAN (202402),
    PARTITION p202402 VALUES LESS THAN (202403),
    PARTITION p202403 VALUES LESS THAN (202404),
    PARTITION p202404 VALUES LESS THAN (202405),
    PARTITION p202405 VALUES LESS THAN (202406),
    PARTITION p202406 VALUES LESS THAN (202407),
    PARTITION p202407 VALUES LESS THAN (202408),
    PARTITION p202408 VALUES LESS THAN (202409),
    PARTITION p202409 VALUES LESS THAN (202410),
    PARTITION p202410 VALUES LESS THAN (202411),
    PARTITION p202411 VALUES LESS THAN (202412),
    PARTITION p202412 VALUES LESS THAN (202413),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);

-- ========================================================-- 四、用户管理表
-- ========================================================

-- 4.1 用户表
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `username` varchar(50) NOT NULL COMMENT '用户名',
    `password` varchar(100) NOT NULL COMMENT '密码',
    `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
    `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
    `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
    `avatar` varchar(200) DEFAULT NULL COMMENT '头像',
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
    UNIQUE KEY `uk_username` (`username`, `tenant_id`),
    UNIQUE KEY `uk_email` (`email`, `tenant_id`),
    UNIQUE KEY `uk_phone` (`phone`, `tenant_id`),
    UNIQUE KEY `uk_employee_no` (`employee_no`, `tenant_id`),
    KEY `idx_dept_id` (`dept_id`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 4.2 用户角色关系表
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '关系ID',
    `user_id` bigint NOT NULL COMMENT '用户ID',
    `role_id` bigint NOT NULL COMMENT '角色ID',
    `is_primary` tinyint NOT NULL DEFAULT '0' COMMENT '是否主角色：0-否，1-是',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_role` (`user_id`, `role_id`, `tenant_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_role_id` (`role_id`),
    KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关系表';

-- 4.3 用户部门关系表
DROP TABLE IF EXISTS `sys_user_dept`;
CREATE TABLE `sys_user_dept` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '关系ID',
    `user_id` bigint NOT NULL COMMENT '用户ID',
    `dept_id` bigint NOT NULL COMMENT '部门ID',
    `is_primary` tinyint NOT NULL DEFAULT '0' COMMENT '是否主部门：0-否，1-是',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_dept` (`user_id`, `dept_id`, `tenant_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_dept_id` (`dept_id`),
    KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户部门关系表';

-- ========================================================-- 五、权限管理表
-- ========================================================

-- 5.1 角色表
DROP TABLE IF EXISTS `sys_role`;
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
    `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志：0-正常，1-删除',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_role_code` (`role_code`, `tenant_id`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_status` (`status`),
    KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- 5.2 角色权限关系表
DROP TABLE IF EXISTS `sys_role_permission`;
CREATE TABLE `sys_role_permission` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '关系ID',
    `role_id` bigint NOT NULL COMMENT '角色ID',
    `permission_id` bigint NOT NULL COMMENT '权限ID',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_role_permission` (`role_id`, `permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关系表';

-- 5.3 权限表
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '权限ID',
    `perm_code` varchar(100) NOT NULL COMMENT '权限编码',
    `perm_name` varchar(50) NOT NULL COMMENT '权限名称',
    `resource_type` tinyint NOT NULL COMMENT '资源类型：1-菜单，2-按钮，3-接口',
    `resource_url` varchar(200) DEFAULT NULL COMMENT '资源URL',
    `http_method` varchar(10) DEFAULT NULL COMMENT 'HTTP方法',
    `parent_id` bigint NOT NULL DEFAULT '0' COMMENT '父权限ID',
    `sort_order` int NOT NULL DEFAULT '0' COMMENT '排序号',
    `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_perm_code` (`perm_code`),
    KEY `idx_parent_id` (`parent_id`),
    KEY `idx_resource_type` (`resource_type`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';

-- 5.4 菜单表
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
    `menu_name` varchar(50) NOT NULL COMMENT '菜单名称',
    `menu_type` tinyint NOT NULL COMMENT '菜单类型：1-目录，2-菜单，3-按钮',
    `icon` varchar(100) DEFAULT NULL COMMENT '菜单图标',
    `path` varchar(200) DEFAULT NULL COMMENT '路由路径',
    `component` varchar(200) DEFAULT NULL COMMENT '组件路径',
    `permission` varchar(100) DEFAULT NULL COMMENT '权限标识',
    `parent_id` bigint NOT NULL DEFAULT '0' COMMENT '父菜单ID',
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
    `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志：0-正常，1-删除',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    PRIMARY KEY (`id`),
    KEY `idx_parent_id` (`parent_id`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_status` (`status`),
    KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单表';

-- ========================================================-- 六、组织管理表
-- ========================================================

-- 6.1 部门表
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '部门ID',
    `dept_code` varchar(50) NOT NULL COMMENT '部门编码',
    `dept_name` varchar(50) NOT NULL COMMENT '部门名称',
    `parent_id` bigint NOT NULL DEFAULT '0' COMMENT '父部门ID',
    `ancestors` varchar(500) DEFAULT NULL COMMENT '祖先路径',
    `dept_level` int NOT NULL DEFAULT '1' COMMENT '部门层级',
    `leader_id` bigint DEFAULT NULL COMMENT '负责人ID',
    `sort_order` int NOT NULL DEFAULT '0' COMMENT '排序号',
    `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
    `remark` varchar(500) DEFAULT NULL COMMENT '备注',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
    `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
    `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志：0-正常，1-删除',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_dept_code` (`dept_code`, `tenant_id`),
    KEY `idx_parent_id` (`parent_id`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='部门表';

-- 6.2 岗位表
DROP TABLE IF EXISTS `sys_position`;
CREATE TABLE `sys_position` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '岗位ID',
    `position_code` varchar(50) NOT NULL COMMENT '岗位编码',
    `position_name` varchar(50) NOT NULL COMMENT '岗位名称',
    `position_level` int DEFAULT NULL COMMENT '岗位级别',
    `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
    `sort_order` int NOT NULL DEFAULT '0' COMMENT '排序号',
    `remark` varchar(500) DEFAULT NULL COMMENT '备注',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
    `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
    `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志：0-正常，1-删除',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_position_code` (`position_code`, `tenant_id`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='岗位表';

-- 6.3 员工表
DROP TABLE IF EXISTS `sys_employee`;
CREATE TABLE `sys_employee` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '员工ID',
    `employee_no` varchar(50) NOT NULL COMMENT '员工编号',
    `employee_name` varchar(50) NOT NULL COMMENT '员工姓名',
    `user_id` bigint DEFAULT NULL COMMENT '关联用户ID',
    `dept_id` bigint NOT NULL COMMENT '所属部门ID',
    `position_id` bigint DEFAULT NULL COMMENT '岗位ID',
    `gender` tinyint DEFAULT '0' COMMENT '性别：0-未知，1-男，2-女',
    `birthday` date DEFAULT NULL COMMENT '出生日期',
    `id_card` varchar(100) DEFAULT NULL COMMENT '身份证号',
    `phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
    `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
    `entry_date` date DEFAULT NULL COMMENT '入职日期',
    `leave_date` date DEFAULT NULL COMMENT '离职日期',
    `employment_status` tinyint NOT NULL DEFAULT '1' COMMENT '在职状态：1-在职，2-离职，3-试用期，4-实习，5-停薪留职',
    `work_location` varchar(100) DEFAULT NULL COMMENT '工作地点',
    `address` varchar(200) DEFAULT NULL COMMENT '家庭住址',
    `emergency_contact` varchar(50) DEFAULT NULL COMMENT '紧急联系人',
    `emergency_phone` varchar(20) DEFAULT NULL COMMENT '紧急联系电话',
    `remark` varchar(500) DEFAULT NULL COMMENT '备注',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
    `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
    `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '删除标志：0-正常，1-删除',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_employee_no` (`employee_no`, `tenant_id`),
    UNIQUE KEY `uk_user_id` (`user_id`, `tenant_id`),
    KEY `idx_dept_id` (`dept_id`),
    KEY `idx_position_id` (`position_id`),
    KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='员工表';

SET FOREIGN_KEY_CHECKS = 1;

-- 创建完成提示
SELECT '表结构创建完成，共创建17张表' as '状态';

-- ========================================================-- 审核签字-- ========================================================
/*
┌─────────────────────────────────────────────────────────┐
│                      审核签字区                          │
├─────────────────────────────────────────────────────────┤
│ 审核项目: 表结构创建脚本 (SYS-DB-SQL-002)                 │
│ 审核内容: 表结构设计、字段定义、约束设置                   │
│                                                         │
│ 审核结果: [√] 通过  [ ] 不通过                           │
│ 审核意见:                                               │
│ _______________________________________________________ │
│ _______________________________________________________ │
│                                                         │
│ 审核人: _________________  日期: _________________       │
│ 批准人: _________________  日期: _________________       │
└─────────────────────────────────────────────────────────┘
*/
