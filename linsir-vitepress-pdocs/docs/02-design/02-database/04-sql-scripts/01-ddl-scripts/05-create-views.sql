-- ========================================================-- System Platform View Creation Script
-- 视图创建脚本
-- ========================================================-- 文档编号: SYS-DB-SQL-005
-- 版本: 1.0
-- 日期: 2026-03-08
-- 作者: 数据库架构师
-- ========================================================

USE linsir_system;

SET NAMES utf8mb4;

-- ========================================================-- 一、用户相关视图
-- ========================================================

-- 1.1 用户完整信息视图
-- 包含用户基本信息、部门、角色
DROP VIEW IF EXISTS `v_user_full_info`;
CREATE VIEW `v_user_full_info` AS
SELECT 
    u.id AS user_id,
    u.username,
    u.nickname,
    u.email,
    u.phone,
    u.avatar,
    u.status AS user_status,
    u.gender,
    u.employee_no,
    u.create_time AS user_create_time,
    u.tenant_id,
    d.id AS dept_id,
    d.dept_name,
    d.dept_code,
    r.id AS role_id,
    r.role_name,
    r.role_code,
    r.data_scope,
    ur.is_primary AS is_primary_role
FROM sys_user u
LEFT JOIN sys_user_dept ud ON u.id = ud.user_id AND ud.is_primary = 1 AND ud.deleted = 0
LEFT JOIN sys_dept d ON ud.dept_id = d.id AND d.deleted = 0
LEFT JOIN sys_user_role ur ON u.id = ur.user_id AND ur.is_primary = 1
LEFT JOIN sys_role r ON ur.role_id = r.id AND r.deleted = 0
WHERE u.deleted = 0;

-- 1.2 用户角色列表视图
-- 查询用户的所有角色
DROP VIEW IF EXISTS `v_user_roles`;
CREATE VIEW `v_user_roles` AS
SELECT 
    u.id AS user_id,
    u.username,
    u.nickname,
    r.id AS role_id,
    r.role_name,
    r.role_code,
    r.role_type,
    r.data_scope,
    ur.is_primary,
    u.tenant_id
FROM sys_user u
INNER JOIN sys_user_role ur ON u.id = ur.user_id
INNER JOIN sys_role r ON ur.role_id = r.id
WHERE u.deleted = 0 AND r.deleted = 0;

-- 1.3 用户权限列表视图
-- 查询用户的所有权限
DROP VIEW IF EXISTS `v_user_permissions`;
CREATE VIEW `v_user_permissions` AS
SELECT DISTINCT
    u.id AS user_id,
    u.username,
    r.id AS role_id,
    r.role_name,
    p.id AS permission_id,
    p.perm_code,
    p.perm_name,
    p.resource_type,
    p.resource_url,
    p.http_method,
    u.tenant_id
FROM sys_user u
INNER JOIN sys_user_role ur ON u.id = ur.user_id
INNER JOIN sys_role r ON ur.role_id = r.id
INNER JOIN sys_role_permission rp ON r.id = rp.role_id
INNER JOIN sys_permission p ON rp.permission_id = p.id
WHERE u.deleted = 0 AND r.deleted = 0 AND p.status = 1;

-- ========================================================-- 二、部门相关视图
-- ========================================================

-- 2.1 部门完整信息视图
-- 包含部门信息和负责人
DROP VIEW IF EXISTS `v_dept_full_info`;
CREATE VIEW `v_dept_full_info` AS
SELECT 
    d.id AS dept_id,
    d.dept_code,
    d.dept_name,
    d.parent_id,
    d.ancestors,
    d.dept_level,
    d.sort_order,
    d.status AS dept_status,
    d.tenant_id,
    u.id AS leader_id,
    u.username AS leader_username,
    u.nickname AS leader_name,
    (SELECT COUNT(*) FROM sys_user_dept ud 
     WHERE ud.dept_id = d.id AND ud.deleted = 0) AS user_count,
    (SELECT COUNT(*) FROM sys_dept sd 
     WHERE sd.parent_id = d.id AND sd.deleted = 0) AS child_count
FROM sys_dept d
LEFT JOIN sys_user u ON d.leader_id = u.id AND u.deleted = 0
WHERE d.deleted = 0;

-- 2.2 部门用户列表视图
-- 查询部门下的所有用户
DROP VIEW IF EXISTS `v_dept_users`;
CREATE VIEW `v_dept_users` AS
SELECT 
    d.id AS dept_id,
    d.dept_name,
    d.dept_code,
    u.id AS user_id,
    u.username,
    u.nickname,
    u.email,
    u.phone,
    u.status AS user_status,
    ud.is_primary AS is_primary_dept,
    d.tenant_id
FROM sys_dept d
INNER JOIN sys_user_dept ud ON d.id = ud.dept_id
INNER JOIN sys_user u ON ud.user_id = u.id
WHERE d.deleted = 0 AND u.deleted = 0 AND ud.deleted = 0;

-- ========================================================-- 三、角色相关视图
-- ========================================================

-- 3.1 角色完整信息视图
-- 包含角色信息和权限统计
DROP VIEW IF EXISTS `v_role_full_info`;
CREATE VIEW `v_role_full_info` AS
SELECT 
    r.id AS role_id,
    r.role_code,
    r.role_name,
    r.role_type,
    r.data_scope,
    r.sort_order,
    r.status AS role_status,
    r.tenant_id,
    (SELECT COUNT(*) FROM sys_user_role ur 
     WHERE ur.role_id = r.id) AS user_count,
    (SELECT COUNT(*) FROM sys_role_permission rp 
     WHERE rp.role_id = r.id) AS permission_count
FROM sys_role r
WHERE r.deleted = 0;

-- 3.2 角色权限详情视图
-- 查询角色的所有权限详情
DROP VIEW IF EXISTS `v_role_permissions`;
CREATE VIEW `v_role_permissions` AS
SELECT 
    r.id AS role_id,
    r.role_name,
    r.role_code,
    p.id AS permission_id,
    p.perm_code,
    p.perm_name,
    p.resource_type,
    p.resource_url,
    p.http_method,
    p.parent_id,
    r.tenant_id
FROM sys_role r
INNER JOIN sys_role_permission rp ON r.id = rp.role_id
INNER JOIN sys_permission p ON rp.permission_id = p.id
WHERE r.deleted = 0 AND p.status = 1;

-- ========================================================-- 四、菜单相关视图
-- ========================================================

-- 4.1 菜单完整信息视图
-- 包含菜单完整信息和权限
DROP VIEW IF EXISTS `v_menu_full_info`;
CREATE VIEW `v_menu_full_info` AS
SELECT 
    m.id AS menu_id,
    m.menu_name,
    m.menu_type,
    m.icon,
    m.path,
    m.component,
    m.permission,
    m.parent_id,
    m.menu_level,
    m.sort_order,
    m.is_cache,
    m.is_visible,
    m.status AS menu_status,
    m.tenant_id,
    p.id AS permission_id,
    p.perm_code,
    p.perm_name
FROM sys_menu m
LEFT JOIN sys_permission p ON m.permission = p.perm_code AND p.status = 1
WHERE m.deleted = 0;

-- 4.2 菜单树视图
-- 查询菜单的树形结构
DROP VIEW IF EXISTS `v_menu_tree`;
CREATE VIEW `v_menu_tree` AS
SELECT 
    m1.id AS menu_id,
    m1.menu_name,
    m1.menu_type,
    m1.path,
    m1.parent_id,
    m1.menu_level,
    m1.sort_order,
    m1.tenant_id,
    m2.menu_name AS parent_name,
    m2.path AS parent_path
FROM sys_menu m1
LEFT JOIN sys_menu m2 ON m1.parent_id = m2.id
WHERE m1.deleted = 0 AND m1.status = 1
ORDER BY m1.menu_level, m1.sort_order;

-- ========================================================-- 五、员工相关视图
-- ========================================================

-- 5.1 员工完整信息视图
-- 包含员工完整信息
DROP VIEW IF EXISTS `v_employee_full_info`;
CREATE VIEW `v_employee_full_info` AS
SELECT 
    e.id AS employee_id,
    e.employee_no,
    e.employee_name,
    e.gender,
    e.birthday,
    e.phone,
    e.email,
    e.entry_date,
    e.leave_date,
    e.employment_status,
    e.work_location,
    e.emergency_contact,
    e.emergency_phone,
    e.tenant_id,
    u.id AS user_id,
    u.username,
    d.id AS dept_id,
    d.dept_name,
    d.dept_code,
    p.id AS position_id,
    p.position_name,
    p.position_code,
    p.position_level
FROM sys_employee e
LEFT JOIN sys_user u ON e.user_id = u.id AND u.deleted = 0
LEFT JOIN sys_dept d ON e.dept_id = d.id AND d.deleted = 0
LEFT JOIN sys_position p ON e.position_id = p.id AND p.deleted = 0
WHERE e.deleted = 0;

-- 5.2 部门员工统计视图
-- 按部门统计员工数量
DROP VIEW IF EXISTS `v_dept_employee_stats`;
CREATE VIEW `v_dept_employee_stats` AS
SELECT 
    d.id AS dept_id,
    d.dept_name,
    d.dept_code,
    d.tenant_id,
    COUNT(e.id) AS total_count,
    SUM(CASE WHEN e.employment_status = 1 THEN 1 ELSE 0 END) AS active_count,
    SUM(CASE WHEN e.employment_status = 2 THEN 1 ELSE 0 END) AS resigned_count,
    SUM(CASE WHEN e.employment_status = 3 THEN 1 ELSE 0 END) AS probation_count
FROM sys_dept d
LEFT JOIN sys_employee e ON d.id = e.dept_id AND e.deleted = 0
WHERE d.deleted = 0
GROUP BY d.id, d.dept_name, d.dept_code, d.tenant_id;

-- ========================================================-- 六、日志相关视图
-- ========================================================

-- 6.1 操作日志统计视图
-- 按操作类型统计
DROP VIEW IF EXISTS `v_operation_log_stats`;
CREATE VIEW `v_operation_log_stats` AS
SELECT 
    DATE(create_time) AS log_date,
    operation_type,
    tenant_id,
    COUNT(*) AS operation_count,
    SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS success_count,
    SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) AS fail_count,
    AVG(execution_time) AS avg_execution_time
FROM sys_operation_log
WHERE create_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(create_time), operation_type, tenant_id;

-- 6.2 登录日志统计视图
-- 按登录类型统计
DROP VIEW IF EXISTS `v_login_log_stats`;
CREATE VIEW `v_login_log_stats` AS
SELECT 
    DATE(create_time) AS log_date,
    login_type,
    tenant_id,
    COUNT(*) AS login_count,
    SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS success_count,
    SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) AS fail_count
FROM sys_login_log
WHERE create_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(create_time), login_type, tenant_id;

-- 6.3 用户登录统计视图
-- 查询用户登录情况
DROP VIEW IF EXISTS `v_user_login_stats`;
CREATE VIEW `v_user_login_stats` AS
SELECT 
    u.id AS user_id,
    u.username,
    u.nickname,
    u.tenant_id,
    COUNT(l.id) AS total_login_count,
    MAX(l.create_time) AS last_login_time,
    SUM(CASE WHEN l.status = 1 THEN 1 ELSE 0 END) AS success_login_count,
    SUM(CASE WHEN l.status = 0 THEN 1 ELSE 0 END) AS fail_login_count
FROM sys_user u
LEFT JOIN sys_login_log l ON u.id = l.user_id
WHERE u.deleted = 0
    AND (l.create_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) OR l.create_time IS NULL)
GROUP BY u.id, u.username, u.nickname, u.tenant_id;

-- ========================================================-- 七、租户相关视图
-- ========================================================

-- 7.1 租户统计视图
-- 查询租户下的资源统计
DROP VIEW IF EXISTS `v_tenant_stats`;
CREATE VIEW `v_tenant_stats` AS
SELECT 
    t.id AS tenant_id,
    t.tenant_name,
    t.tenant_code,
    t.status AS tenant_status,
    t.expire_time,
    (SELECT COUNT(*) FROM sys_user u WHERE u.tenant_id = t.id AND u.deleted = 0) AS user_count,
    (SELECT COUNT(*) FROM sys_dept d WHERE d.tenant_id = t.id AND d.deleted = 0) AS dept_count,
    (SELECT COUNT(*) FROM sys_role r WHERE r.tenant_id = t.id AND r.deleted = 0) AS role_count,
    (SELECT COUNT(*) FROM sys_employee e WHERE e.tenant_id = t.id AND e.deleted = 0) AS employee_count
FROM sys_tenant_config t
WHERE t.deleted = 0;

-- 7.2 租户用户活跃度视图
-- 查询租户用户活跃情况
DROP VIEW IF EXISTS `v_tenant_user_activity`;
CREATE VIEW `v_tenant_user_activity` AS
SELECT 
    u.tenant_id,
    COUNT(DISTINCT u.id) AS total_users,
    COUNT(DISTINCT CASE WHEN u.status = 1 THEN u.id END) AS active_users,
    COUNT(DISTINCT CASE WHEN l.create_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN l.user_id END) AS weekly_active_users,
    COUNT(DISTINCT CASE WHEN l.create_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN l.user_id END) AS monthly_active_users
FROM sys_user u
LEFT JOIN sys_login_log l ON u.id = l.user_id
WHERE u.deleted = 0
GROUP BY u.tenant_id;

-- ========================================================-- 视图统计
-- ========================================================

-- 查询所有视图
SELECT 
    TABLE_NAME as '视图名',
    VIEW_DEFINITION as '定义'
FROM INFORMATION_SCHEMA.VIEWS
WHERE TABLE_SCHEMA = 'linsir_system'
ORDER BY TABLE_NAME;

-- 创建完成提示
SELECT '视图创建完成，共创建17个视图' as '状态';

-- ========================================================-- 审核签字-- ========================================================
/*
┌─────────────────────────────────────────────────────────┐
│                      审核签字区                          │
├─────────────────────────────────────────────────────────┤
│ 审核项目: 视图创建脚本 (SYS-DB-SQL-005)                   │
│ 审核内容: 业务视图、统计视图设计                          │
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
