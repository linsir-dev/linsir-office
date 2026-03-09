-- ========================================================-- System Platform Index Creation Script
-- 索引创建脚本
-- ========================================================-- 文档编号: SYS-DB-SQL-003
-- 版本: 1.0
-- 日期: 2026-03-08
-- 作者: 数据库架构师
-- ========================================================

USE linsir_system;

SET NAMES utf8mb4;

-- ========================================================-- 说明：
-- 1. 主键索引在创建表时已自动创建
-- 2. 唯一索引在创建表时已定义
-- 3. 本脚本仅创建额外的业务索引
-- ========================================================

-- ========================================================-- 一、系统配置表索引
-- ========================================================

-- 1.1 租户基本信息配置表索引
-- 主键索引：id（已创建）
-- 唯一索引：uk_tenant_code（已创建）
-- 普通索引：idx_tenant_id, idx_status（已创建）
-- 额外索引：按行业类型查询
CREATE INDEX `idx_industry_type` ON `sys_tenant_config`(`industry_type`);
-- 额外索引：按公司规模查询
CREATE INDEX `idx_company_scale` ON `sys_tenant_config`(`company_scale`);
-- 额外索引：按到期时间查询（用于提醒）
CREATE INDEX `idx_expire_time` ON `sys_tenant_config`(`expire_time`);

-- 1.2 Web信息配置表索引
-- 主键索引：id（已创建）
-- 普通索引：idx_tenant_id（已创建）

-- 1.3 商务信息配置表索引
-- 主键索引：id（已创建）
-- 普通索引：idx_tenant_id, idx_contract_no（已创建）
-- 额外索引：按服务等级查询
CREATE INDEX `idx_service_level` ON `sys_business_config`(`service_level`);
-- 额外索引：按付款状态查询
CREATE INDEX `idx_payment_status` ON `sys_business_config`(`payment_status`);

-- ========================================================-- 二、数据字典表索引
-- ========================================================

-- 2.1 数据字典类型表索引
-- 主键索引：id（已创建）
-- 唯一索引：uk_dict_code（已创建）
-- 普通索引：idx_tenant_id, idx_status（已创建）

-- 2.2 数据字典项表索引
-- 主键索引：id（已创建）
-- 唯一索引：uk_dict_item（已创建）
-- 普通索引：idx_dict_type_id, idx_tenant_id, idx_status, idx_sort_order（已创建）

-- ========================================================-- 三、系统日志表索引
-- ========================================================

-- 3.1 操作日志表索引
-- 主键索引：id, create_time（已创建）
-- 普通索引：idx_user_id, idx_operation_type, idx_create_time, idx_tenant_id, idx_status（已创建）
-- 额外索引：按IP地址查询（安全审计）
CREATE INDEX `idx_ip_address` ON `sys_operation_log`(`ip_address`);
-- 额外索引：按请求URL查询
CREATE INDEX `idx_request_url` ON `sys_operation_log`(`request_url`(100));
-- 复合索引：用户+时间（查询用户操作历史）
CREATE INDEX `idx_user_time` ON `sys_operation_log`(`user_id`, `create_time`);
-- 复合索引：租户+时间（查询租户操作统计）
CREATE INDEX `idx_tenant_time` ON `sys_operation_log`(`tenant_id`, `create_time`);

-- 3.2 登录日志表索引
-- 主键索引：id, create_time（已创建）
-- 普通索引：idx_user_id, idx_username, idx_login_type, idx_create_time, idx_tenant_id, idx_status（已创建）
-- 额外索引：按IP地址查询（安全审计）
CREATE INDEX `idx_login_ip` ON `sys_login_log`(`ip_address`);
-- 额外索引：按IP归属地查询
CREATE INDEX `idx_ip_location` ON `sys_login_log`(`ip_location`);
-- 复合索引：用户+登录类型（统计登录方式）
CREATE INDEX `idx_user_login_type` ON `sys_login_log`(`user_id`, `login_type`);

-- ========================================================-- 四、用户管理表索引
-- ========================================================

-- 4.1 用户表索引
-- 主键索引：id（已创建）
-- 唯一索引：uk_username, uk_email, uk_phone, uk_employee_no（已创建）
-- 普通索引：idx_dept_id, idx_tenant_id, idx_status（已创建）
-- 额外索引：按昵称查询（支持搜索）
CREATE INDEX `idx_nickname` ON `sys_user`(`nickname`);
-- 额外索引：按性别查询
CREATE INDEX `idx_gender` ON `sys_user`(`gender`);
-- 复合索引：租户+状态（查询租户有效用户）
CREATE INDEX `idx_tenant_status` ON `sys_user`(`tenant_id`, `status`);
-- 复合索引：部门+状态（查询部门有效用户）
CREATE INDEX `idx_dept_status` ON `sys_user`(`dept_id`, `status`);

-- 4.2 用户角色关系表索引
-- 主键索引：id（已创建）
-- 唯一索引：uk_user_role（已创建）
-- 普通索引：idx_user_id, idx_role_id, idx_tenant_id（已创建）
-- 额外索引：按是否主角色查询
CREATE INDEX `idx_is_primary` ON `sys_user_role`(`is_primary`);

-- 4.3 用户部门关系表索引
-- 主键索引：id（已创建）
-- 唯一索引：uk_user_dept（已创建）
-- 普通索引：idx_user_id, idx_dept_id, idx_tenant_id（已创建）
-- 额外索引：按是否主部门查询
CREATE INDEX `idx_is_primary_dept` ON `sys_user_dept`(`is_primary`);

-- ========================================================-- 五、权限管理表索引
-- ========================================================

-- 5.1 角色表索引
-- 主键索引：id（已创建）
-- 唯一索引：uk_role_code（已创建）
-- 普通索引：idx_tenant_id, idx_status, idx_sort_order（已创建）
-- 额外索引：按角色类型查询
CREATE INDEX `idx_role_type` ON `sys_role`(`role_type`);
-- 额外索引：按数据范围查询
CREATE INDEX `idx_data_scope` ON `sys_role`(`data_scope`);
-- 复合索引：租户+角色类型（查询租户角色列表）
CREATE INDEX `idx_tenant_role_type` ON `sys_role`(`tenant_id`, `role_type`);

-- 5.2 角色权限关系表索引
-- 主键索引：id（已创建）
-- 唯一索引：uk_role_permission（已创建）
-- 普通索引：idx_role_id（已创建）
-- 额外索引：按权限ID查询
CREATE INDEX `idx_permission_id` ON `sys_role_permission`(`permission_id`);

-- 5.3 权限表索引
-- 主键索引：id（已创建）
-- 唯一索引：uk_perm_code（已创建）
-- 普通索引：idx_parent_id, idx_resource_type, idx_status（已创建）
-- 额外索引：按资源URL查询（权限校验）
CREATE INDEX `idx_resource_url` ON `sys_permission`(`resource_url`(100));
-- 额外索引：按HTTP方法查询
CREATE INDEX `idx_http_method` ON `sys_permission`(`http_method`);
-- 复合索引：父ID+排序（构建权限树）
CREATE INDEX `idx_parent_sort` ON `sys_permission`(`parent_id`, `sort_order`);

-- 5.4 菜单表索引
-- 主键索引：id（已创建）
-- 普通索引：idx_parent_id, idx_tenant_id, idx_status, idx_sort_order（已创建）
-- 额外索引：按菜单类型查询
CREATE INDEX `idx_menu_type` ON `sys_menu`(`menu_type`);
-- 额外索引：按权限标识查询
CREATE INDEX `idx_permission_code` ON `sys_menu`(`permission`);
-- 额外索引：按是否可见查询
CREATE INDEX `idx_is_visible` ON `sys_menu`(`is_visible`);
-- 复合索引：租户+菜单类型（查询租户菜单）
CREATE INDEX `idx_tenant_menu_type` ON `sys_menu`(`tenant_id`, `menu_type`);
-- 复合索引：父ID+排序+状态（构建菜单树）
CREATE INDEX `idx_parent_sort_status` ON `sys_menu`(`parent_id`, `sort_order`, `status`);

-- ========================================================-- 六、组织管理表索引
-- ========================================================

-- 6.1 部门表索引
-- 主键索引：id（已创建）
-- 唯一索引：uk_dept_code（已创建）
-- 普通索引：idx_parent_id, idx_tenant_id, idx_status（已创建）
-- 额外索引：按部门层级查询
CREATE INDEX `idx_dept_level` ON `sys_dept`(`dept_level`);
-- 额外索引：按负责人查询
CREATE INDEX `idx_leader_id` ON `sys_dept`(`leader_id`);
-- 额外索引：按祖先路径查询（支持树查询）
CREATE INDEX `idx_ancestors` ON `sys_dept`(`ancestors`(100));
-- 复合索引：租户+父ID（查询租户部门树）
CREATE INDEX `idx_tenant_parent` ON `sys_dept`(`tenant_id`, `parent_id`);

-- 6.2 岗位表索引
-- 主键索引：id（已创建）
-- 唯一索引：uk_position_code（已创建）
-- 普通索引：idx_tenant_id, idx_status（已创建）
-- 额外索引：按岗位级别查询
CREATE INDEX `idx_position_level` ON `sys_position`(`position_level`);
-- 复合索引：租户+岗位级别（查询租户岗位列表）
CREATE INDEX `idx_tenant_level` ON `sys_position`(`tenant_id`, `position_level`);

-- 6.3 员工表索引
-- 主键索引：id（已创建）
-- 唯一索引：uk_employee_no, uk_user_id（已创建）
-- 普通索引：idx_dept_id, idx_position_id, idx_tenant_id（已创建）
-- 额外索引：按员工姓名查询（支持搜索）
CREATE INDEX `idx_employee_name` ON `sys_employee`(`employee_name`);
-- 额外索引：按性别查询
CREATE INDEX `idx_emp_gender` ON `sys_employee`(`gender`);
-- 额外索引：按入职日期查询
CREATE INDEX `idx_entry_date` ON `sys_employee`(`entry_date`);
-- 额外索引：按在职状态查询
CREATE INDEX `idx_employment_status` ON `sys_employee`(`employment_status`);
-- 额外索引：按工作地点查询
CREATE INDEX `idx_work_location` ON `sys_employee`(`work_location`);
-- 复合索引：部门+在职状态（查询部门在职员工）
CREATE INDEX `idx_dept_emp_status` ON `sys_employee`(`dept_id`, `employment_status`);
-- 复合索引：租户+在职状态（查询租户员工统计）
CREATE INDEX `idx_tenant_emp_status` ON `sys_employee`(`tenant_id`, `employment_status`);

-- ========================================================-- 索引统计
-- ========================================================

-- 查询索引统计信息
SELECT
    TABLE_NAME as '表名',
    COUNT(*) as '索引数量'
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'linsir_system'
GROUP BY TABLE_NAME
ORDER BY TABLE_NAME;

-- 创建完成提示
SELECT '索引创建完成' as '状态';

-- ========================================================-- 审核签字-- ========================================================
/*
┌─────────────────────────────────────────────────────────┐
│                      审核签字区                          │
├─────────────────────────────────────────────────────────┤
│ 审核项目: 索引创建脚本 (SYS-DB-SQL-003)                   │
│ 审核内容: 主键索引、外键索引、业务索引设计                 │
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
