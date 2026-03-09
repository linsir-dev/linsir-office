-- ========================================================-- System Platform Data Initialization Script-- DML初始化脚本-- ========================================================-- 文档编号: SYS-DB-SQL-006-- 版本: 1.0-- 日期: 2026-03-08-- 作者: 数据库架构师-- ========================================================

USE linsir_system;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ========================================================-- 一、初始化租户数据-- ========================================================

-- 1.1 创建默认租户（系统管理员租户）
INSERT INTO `sys_tenant_config` (
    `tenant_name`, `tenant_code`, `logo_url`, `contact_name`, 
    `contact_phone`, `contact_email`, `address`, `industry_type`, 
    `company_scale`, `expire_time`, `status`, `remark`, `tenant_id`
) VALUES (
    '系统管理租户', 'SYSTEM', NULL, '系统管理员',
    NULL, 'admin@system.com', NULL, 'technology', 
    'small', '2099-12-31 23:59:59', 1, '系统默认租户', 0
);

-- 1.2 创建示例租户
INSERT INTO `sys_tenant_config` (
    `tenant_name`, `tenant_code`, `logo_url`, `contact_name`, 
    `contact_phone`, `contact_email`, `address`, `industry_type`, 
    `company_scale`, `expire_time`, `status`, `remark`, `tenant_id`
) VALUES 
(
    '示例科技公司', 'DEMO_TECH', NULL, '张三',
    '13800138000', 'zhangsan@demotech.com', '北京市海淀区', 'technology',
    'medium', '2027-12-31 23:59:59', 1, '示例租户', 1
);

-- 1.3 初始化Web配置
INSERT INTO `sys_web_config` (
    `site_title`, `site_logo`, `site_favicon`, `login_bg_image`,
    `login_title`, `copyright`, `icp_record`, `theme_color`,
    `sidebar_theme`, `layout_mode`, `is_show_watermark`, `watermark_text`, `tenant_id`
) VALUES 
(
    'System管理平台', NULL, NULL, NULL,
    'System管理平台', '© 2026 System Platform. All rights reserved.', NULL, '#1890ff',
    1, 1, 0, NULL, 0
),
(
    '示例科技管理系统', NULL, NULL, NULL,
    '示例科技管理系统', '© 2026 示例科技. All rights reserved.', '京ICP备XXXXXXXX号', '#1890ff',
    1, 1, 0, NULL, 1
);

-- ========================================================-- 二、初始化数据字典-- ========================================================

-- 2.1 创建数据字典类型
INSERT INTO `sys_dict_type` (`dict_code`, `dict_name`, `status`, `remark`, `tenant_id`) VALUES
('sys_user_status', '用户状态', 1, '用户账号状态', 0),
('sys_gender', '性别', 1, '性别类型', 0),
('sys_role_type', '角色类型', 1, '角色分类', 0),
('sys_data_scope', '数据范围', 1, '数据权限范围', 0),
('sys_menu_type', '菜单类型', 1, '菜单分类', 0),
('sys_dept_status', '部门状态', 1, '部门启用状态', 0),
('sys_position_status', '岗位状态', 1, '岗位启用状态', 0),
('sys_employment_status', '在职状态', 1, '员工在职状态', 0),
('sys_industry_type', '行业类型', 1, '企业行业分类', 0),
('sys_company_scale', '公司规模', 1, '企业规模分类', 0),
('sys_service_level', '服务等级', 1, 'SLA服务等级', 0),
('sys_payment_cycle', '付款周期', 1, '付款方式', 0),
('sys_payment_status', '付款状态', 1, '付款状态', 0),
('sys_operation_type', '操作类型', 1, '系统操作类型', 0),
('sys_login_type', '登录类型', 1, '登录方式', 0),
('sys_resource_type', '资源类型', 1, '权限资源类型', 0);

-- 2.2 创建数据字典项
-- 用户状态
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'disabled', '禁用', '0', 1, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_user_status';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'enabled', '启用', '1', 2, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_user_status';

-- 性别
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'unknown', '未知', '0', 1, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_gender';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'male', '男', '1', 2, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_gender';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'female', '女', '2', 3, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_gender';

-- 角色类型
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'system', '系统角色', '1', 1, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_role_type';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'business', '业务角色', '2', 2, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_role_type';

-- 数据范围
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'all', '全部数据', '1', 1, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_data_scope';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'dept', '本部门数据', '2', 2, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_data_scope';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'dept_and_child', '本部门及子部门', '3', 3, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_data_scope';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'self', '仅本人数据', '4', 4, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_data_scope';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'custom', '自定义', '5', 5, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_data_scope';

-- 菜单类型
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'directory', '目录', '1', 1, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_menu_type';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'menu', '菜单', '2', 2, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_menu_type';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'button', '按钮', '3', 3, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_menu_type';

-- 在职状态
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'active', '在职', '1', 1, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_employment_status';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'resigned', '离职', '2', 2, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_employment_status';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'probation', '试用期', '3', 3, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_employment_status';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'intern', '实习', '4', 4, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_employment_status';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'leave', '停薪留职', '5', 5, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_employment_status';

-- 行业类型
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'technology', '互联网/科技', 'technology', 1, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_industry_type';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'finance', '金融', 'finance', 2, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_industry_type';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'manufacturing', '制造业', 'manufacturing', 3, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_industry_type';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'retail', '零售', 'retail', 4, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_industry_type';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'education', '教育', 'education', 5, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_industry_type';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'healthcare', '医疗', 'healthcare', 6, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_industry_type';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'other', '其他', 'other', 7, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_industry_type';

-- 公司规模
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'small', '小型企业', 'small', 1, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_company_scale';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'medium', '中型企业', 'medium', 2, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_company_scale';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'large', '大型企业', 'large', 3, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_company_scale';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'xlarge', '超大型企业', 'xlarge', 4, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_company_scale';

-- 登录类型
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'password', '账号密码', '1', 1, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_login_type';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'phone', '手机号', '2', 2, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_login_type';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'email', '邮箱', '3', 3, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_login_type';
INSERT INTO `sys_dict_item` (`dict_type_id`, `item_code`, `item_label`, `item_value`, `sort_order`, `status`, `tenant_id`) 
SELECT id, 'oauth', '第三方', '4', 4, 1, 0 FROM sys_dict_type WHERE dict_code = 'sys_login_type';

-- ========================================================-- 三、初始化权限数据-- ========================================================

-- 3.1 创建系统权限
INSERT INTO `sys_permission` (`perm_code`, `perm_name`, `resource_type`, `resource_url`, `http_method`, `parent_id`, `sort_order`, `status`) VALUES
('system', '系统管理', 1, '/system', NULL, 0, 1, 1),
('system:user', '用户管理', 1, '/system/user', NULL, 1, 1, 1),
('system:user:list', '用户列表', 2, '/system/user/list', 'GET', 2, 1, 1),
('system:user:add', '新增用户', 2, '/system/user', 'POST', 2, 2, 1),
('system:user:edit', '修改用户', 2, '/system/user', 'PUT', 2, 3, 1),
('system:user:delete', '删除用户', 2, '/system/user', 'DELETE', 2, 4, 1),
('system:role', '角色管理', 1, '/system/role', NULL, 1, 2, 1),
('system:role:list', '角色列表', 2, '/system/role/list', 'GET', 8, 1, 1),
('system:role:add', '新增角色', 2, '/system/role', 'POST', 8, 2, 1),
('system:role:edit', '修改角色', 2, '/system/role', 'PUT', 8, 3, 1),
('system:role:delete', '删除角色', 2, '/system/role', 'DELETE', 8, 4, 1),
('system:dept', '部门管理', 1, '/system/dept', NULL, 1, 3, 1),
('system:dept:list', '部门列表', 2, '/system/dept/list', 'GET', 13, 1, 1),
('system:dept:add', '新增部门', 2, '/system/dept', 'POST', 13, 2, 1),
('system:dept:edit', '修改部门', 2, '/system/dept', 'PUT', 13, 3, 1),
('system:dept:delete', '删除部门', 2, '/system/dept', 'DELETE', 13, 4, 1),
('system:menu', '菜单管理', 1, '/system/menu', NULL, 1, 4, 1),
('system:menu:list', '菜单列表', 2, '/system/menu/list', 'GET', 18, 1, 1),
('system:menu:add', '新增菜单', 2, '/system/menu', 'POST', 18, 2, 1),
('system:menu:edit', '修改菜单', 2, '/system/menu', 'PUT', 18, 3, 1),
('system:menu:delete', '删除菜单', 2, '/system/menu', 'DELETE', 18, 4, 1),
('system:dict', '字典管理', 1, '/system/dict', NULL, 1, 5, 1),
('system:dict:list', '字典列表', 2, '/system/dict/list', 'GET', 23, 1, 1),
('system:dict:add', '新增字典', 2, '/system/dict', 'POST', 23, 2, 1),
('system:dict:edit', '修改字典', 2, '/system/dict', 'PUT', 23, 3, 1),
('system:dict:delete', '删除字典', 2, '/system/dict', 'DELETE', 23, 4, 1),
('system:config', '参数管理', 1, '/system/config', NULL, 1, 6, 1),
('system:config:list', '参数列表', 2, '/system/config/list', 'GET', 28, 1, 1),
('system:config:add', '新增参数', 2, '/system/config', 'POST', 28, 2, 1),
('system:config:edit', '修改参数', 2, '/system/config', 'PUT', 28, 3, 1),
('system:config:delete', '删除参数', 2, '/system/config', 'DELETE', 28, 4, 1),
('system:log', '日志管理', 1, '/system/log', NULL, 1, 7, 1),
('system:log:operation', '操作日志', 2, '/system/log/operation', 'GET', 33, 1, 1),
('system:log:login', '登录日志', 2, '/system/log/login', 'GET', 33, 2, 1);

-- ========================================================-- 四、初始化角色数据-- ========================================================

-- 4.1 创建超级管理员角色（系统租户）
INSERT INTO `sys_role` (`role_code`, `role_name`, `role_type`, `data_scope`, `status`, `sort_order`, `remark`, `tenant_id`) VALUES
('super_admin', '超级管理员', 1, 1, 1, 1, '系统超级管理员，拥有所有权限', 0);

-- 4.2 创建租户管理员角色
INSERT INTO `sys_role` (`role_code`, `role_name`, `role_type`, `data_scope`, `status`, `sort_order`, `remark`, `tenant_id`) VALUES
('tenant_admin', '租户管理员', 1, 1, 1, 2, '租户管理员，管理租户内所有资源', 1);

-- 4.3 创建普通用户角色
INSERT INTO `sys_role` (`role_code`, `role_name`, `role_type`, `data_scope`, `status`, `sort_order`, `remark`, `tenant_id`) VALUES
('normal_user', '普通用户', 2, 4, 1, 3, '普通用户，仅可查看自己的数据', 1);

-- 4.4 分配权限给超级管理员
INSERT INTO `sys_role_permission` (`role_id`, `permission_id`)
SELECT 1, id FROM sys_permission;

-- 4.5 分配权限给租户管理员
INSERT INTO `sys_role_permission` (`role_id`, `permission_id`)
SELECT 2, id FROM sys_permission;

-- ========================================================-- 五、初始化部门数据-- ========================================================

-- 5.1 创建根部门（系统租户）
INSERT INTO `sys_dept` (`dept_code`, `dept_name`, `parent_id`, `ancestors`, `dept_level`, `sort_order`, `status`, `remark`, `tenant_id`) VALUES
('00', '系统管理部', 0, '0,', 1, 1, 1, '系统管理部门', 0);

-- 5.2 创建示例租户部门
INSERT INTO `sys_dept` (`dept_code`, `dept_name`, `parent_id`, `ancestors`, `dept_level`, `sort_order`, `status`, `remark`, `tenant_id`) VALUES
('01', '示例科技公司', 0, '0,', 1, 1, 1, '公司根部门', 1),
('0101', '技术部', 2, '0,2,', 2, 1, 1, '技术研发部门', 1),
('0102', '产品部', 2, '0,2,', 2, 2, 1, '产品设计部门', 1),
('0103', '运营部', 2, '0,2,', 2, 3, 1, '运营推广部门', 1),
('010101', '后端开发组', 3, '0,2,3,', 3, 1, 1, '后端开发团队', 1),
('010102', '前端开发组', 3, '0,2,3,', 3, 2, 1, '前端开发团队', 1);

-- ========================================================-- 六、初始化岗位数据-- ========================================================

-- 6.1 创建岗位
INSERT INTO `sys_position` (`position_code`, `position_name`, `position_level`, `status`, `sort_order`, `remark`, `tenant_id`) VALUES
('CEO', '首席执行官', 1, 1, 1, '公司最高管理者', 1),
('CTO', '首席技术官', 2, 1, 2, '技术负责人', 1),
('MANAGER', '部门经理', 3, 1, 3, '部门负责人', 1),
('LEADER', '团队主管', 4, 1, 4, '团队负责人', 1),
('SENIOR', '高级工程师', 5, 1, 5, '高级工程师', 1),
('ENGINEER', '工程师', 6, 1, 6, '普通工程师', 1);

-- ========================================================-- 七、初始化用户数据-- ========================================================

-- 7.1 创建超级管理员用户（密码：admin123，BCrypt加密）
INSERT INTO `sys_user` (
    `username`, `password`, `nickname`, `email`, `phone`, 
    `status`, `gender`, `dept_id`, `remark`, `tenant_id`
) VALUES (
    'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', 
    '系统管理员', 'admin@system.com', NULL,
    1, 1, 1, '系统超级管理员', 0
);

-- 7.2 创建示例租户管理员
INSERT INTO `sys_user` (
    `username`, `password`, `nickname`, `email`, `phone`, 
    `status`, `gender`, `dept_id`, `remark`, `tenant_id`
) VALUES (
    'zhangsan', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', 
    '张三', 'zhangsan@demotech.com', '13800138000',
    1, 1, 2, '租户管理员', 1
);

-- 7.3 创建示例普通用户
INSERT INTO `sys_user` (
    `username`, `password`, `nickname`, `email`, `phone`, 
    `status`, `gender`, `dept_id`, `remark`, `tenant_id`
) VALUES 
(
    'lisi', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', 
    '李四', 'lisi@demotech.com', '13800138001',
    1, 1, 3, '后端开发工程师', 1
),
(
    'wangwu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', 
    '王五', 'wangwu@demotech.com', '13800138002',
    1, 1, 4, '前端开发工程师', 1
);

-- ========================================================-- 八、初始化用户角色关系-- ========================================================

-- 8.1 分配超级管理员角色
INSERT INTO `sys_user_role` (`user_id`, `role_id`, `is_primary`, `tenant_id`) VALUES
(1, 1, 1, 0);

-- 8.2 分配租户管理员角色
INSERT INTO `sys_user_role` (`user_id`, `role_id`, `is_primary`, `tenant_id`) VALUES
(2, 2, 1, 1);

-- 8.3 分配普通用户角色
INSERT INTO `sys_user_role` (`user_id`, `role_id`, `is_primary`, `tenant_id`) VALUES
(3, 3, 1, 1),
(4, 3, 1, 1);

-- ========================================================-- 九、初始化用户部门关系-- ========================================================

-- 9.1 分配超级管理员到系统部门
INSERT INTO `sys_user_dept` (`user_id`, `dept_id`, `is_primary`, `tenant_id`) VALUES
(1, 1, 1, 0);

-- 9.2 分配示例用户到部门
INSERT INTO `sys_user_dept` (`user_id`, `dept_id`, `is_primary`, `tenant_id`) VALUES
(2, 2, 1, 1),
(3, 3, 1, 1),
(4, 4, 1, 1);

-- ========================================================-- 十、初始化员工数据-- ========================================================

-- 10.1 创建示例员工
INSERT INTO `sys_employee` (
    `employee_no`, `employee_name`, `user_id`, `dept_id`, `position_id`,
    `gender`, `phone`, `email`, `entry_date`, `employment_status`, `tenant_id`
) VALUES 
(
    'EMP2024001', '张三', 2, 2, 2,
    1, '13800138000', 'zhangsan@demotech.com', '2024-01-01', 1, 1
),
(
    'EMP2024002', '李四', 3, 3, 6,
    1, '13800138001', 'lisi@demotech.com', '2024-02-01', 1, 1
),
(
    'EMP2024003', '王五', 4, 4, 6,
    1, '13800138002', 'wangwu@demotech.com', '2024-03-01', 1, 1
);

-- ========================================================-- 十一、初始化菜单数据-- ========================================================

-- 11.1 创建系统菜单
INSERT INTO `sys_menu` (`menu_name`, `menu_type`, `icon`, `path`, `component`, `permission`, `parent_id`, `menu_level`, `sort_order`, `is_cache`, `is_visible`, `status`, `tenant_id`) VALUES
('系统管理', 1, 'SettingOutlined', '/system', NULL, NULL, 0, 1, 1, 0, 1, 1, 0),
('用户管理', 2, 'UserOutlined', '/system/user', 'system/user/index', 'system:user:list', 1, 2, 1, 0, 1, 1, 0),
('新增用户', 3, NULL, NULL, NULL, 'system:user:add', 2, 3, 1, 0, 0, 1, 0),
('修改用户', 3, NULL, NULL, NULL, 'system:user:edit', 2, 3, 2, 0, 0, 1, 0),
('删除用户', 3, NULL, NULL, NULL, 'system:user:delete', 2, 3, 3, 0, 0, 1, 0),
('角色管理', 2, 'TeamOutlined', '/system/role', 'system/role/index', 'system:role:list', 1, 2, 2, 0, 1, 1, 0),
('部门管理', 2, 'ApartmentOutlined', '/system/dept', 'system/dept/index', 'system:dept:list', 1, 2, 3, 0, 1, 1, 0),
('菜单管理', 2, 'MenuOutlined', '/system/menu', 'system/menu/index', 'system:menu:list', 1, 2, 4, 0, 1, 1, 0),
('字典管理', 2, 'BookOutlined', '/system/dict', 'system/dict/index', 'system:dict:list', 1, 2, 5, 0, 1, 1, 0),
('参数管理', 2, 'ToolOutlined', '/system/config', 'system/config/index', 'system:config:list', 1, 2, 6, 0, 1, 1, 0),
('日志管理', 1, 'FileTextOutlined', '/system/log', NULL, NULL, 0, 1, 2, 0, 1, 1, 0),
('操作日志', 2, NULL, '/system/log/operation', 'system/log/operation', 'system:log:operation', 11, 2, 1, 0, 1, 1, 0),
('登录日志', 2, NULL, '/system/log/login', 'system/log/login', 'system:log:login', 11, 2, 2, 0, 1, 1, 0);

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================-- 初始化统计-- ========================================================

SELECT '数据初始化完成' as '状态',
    (SELECT COUNT(*) FROM sys_tenant_config WHERE deleted = 0) as '租户数',
    (SELECT COUNT(*) FROM sys_dict_type WHERE deleted = 0) as '字典类型数',
    (SELECT COUNT(*) FROM sys_dict_item WHERE deleted = 0) as '字典项数',
    (SELECT COUNT(*) FROM sys_permission WHERE status = 1) as '权限数',
    (SELECT COUNT(*) FROM sys_role WHERE deleted = 0) as '角色数',
    (SELECT COUNT(*) FROM sys_dept WHERE deleted = 0) as '部门数',
    (SELECT COUNT(*) FROM sys_position WHERE deleted = 0) as '岗位数',
    (SELECT COUNT(*) FROM sys_user WHERE deleted = 0) as '用户数',
    (SELECT COUNT(*) FROM sys_employee WHERE deleted = 0) as '员工数',
    (SELECT COUNT(*) FROM sys_menu WHERE deleted = 0) as '菜单数';

-- ========================================================-- 审核签字-- ========================================================
/*
┌─────────────────────────────────────────────────────────┐
│                      审核签字区                          │
├─────────────────────────────────────────────────────────┤
│ 审核项目: 数据初始化脚本 (SYS-DB-SQL-006)                 │
│ 审核内容: 租户数据、字典数据、权限数据、用户数据           │
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
