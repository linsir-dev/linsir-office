-- ========================================================-- System Platform Permission Grant Script-- DCL权限脚本-- ========================================================-- 文档编号: SYS-DB-SQL-007-- 版本: 1.0-- 日期: 2026-03-08-- 作者: 数据库架构师-- ========================================================

USE linsir_system;

SET NAMES utf8mb4;

-- ========================================================-- 说明：
-- 本脚本创建数据库用户并分配权限
-- 根据安全原则，遵循最小权限原则
-- ========================================================

-- ========================================================-- 一、创建应用数据库用户-- ========================================================

-- 1.1 创建应用只读用户（用于报表查询等）
-- DROP USER IF EXISTS 'app_reader'@'%';
-- CREATE USER 'app_reader'@'%' IDENTIFIED BY 'Reader@123456';

-- 1.2 创建应用读写用户（用于普通业务操作）
-- DROP USER IF EXISTS 'app_writer'@'%';
-- CREATE USER 'app_writer'@'%' IDENTIFIED BY 'Writer@123456';

-- 1.3 创建应用管理员用户（用于DDL操作）
-- DROP USER IF EXISTS 'app_admin'@'%';
-- CREATE USER 'app_admin'@'%' IDENTIFIED BY 'Admin@123456';

-- ========================================================-- 二、应用只读用户权限-- ========================================================

-- 2.1 授予数据库连接权限
-- GRANT USAGE ON *.* TO 'app_reader'@'%';

-- 2.2 授予SELECT权限（只读）
-- GRANT SELECT ON linsir_system.* TO 'app_reader'@'%';

-- 2.3 授予视图查询权限
-- GRANT SHOW VIEW ON linsir_system.* TO 'app_reader'@'%';

-- 2.4 授予存储过程执行权限（如果有）
-- GRANT EXECUTE ON PROCEDURE linsir_system.* TO 'app_reader'@'%';

-- ========================================================-- 三、应用读写用户权限-- ========================================================

-- 3.1 授予数据库连接权限
-- GRANT USAGE ON *.* TO 'app_writer'@'%';

-- 3.2 授予DML权限（增删改查）
-- GRANT SELECT, INSERT, UPDATE, DELETE ON linsir_system.* TO 'app_writer'@'%';

-- 3.3 授予视图查询权限
-- GRANT SHOW VIEW ON linsir_system.* TO 'app_writer'@'%';

-- 3.4 授予存储过程执行权限
-- GRANT EXECUTE ON PROCEDURE linsir_system.* TO 'app_writer'@'%';

-- 3.5 授予函数执行权限
-- GRANT EXECUTE ON FUNCTION linsir_system.* TO 'app_writer'@'%';

-- ========================================================-- 四、应用管理员用户权限-- ========================================================

-- 4.1 授予数据库连接权限
-- GRANT USAGE ON *.* TO 'app_admin'@'%';

-- 4.2 授予所有权限（除GRANT OPTION）
-- GRANT ALL PRIVILEGES ON linsir_system.* TO 'app_admin'@'%';

-- 4.3 授予视图创建权限
-- GRANT CREATE VIEW ON linsir_system.* TO 'app_admin'@'%';

-- 4.4 授予触发器创建权限
-- GRANT TRIGGER ON linsir_system.* TO 'app_admin'@'%';

-- 4.5 授予存储过程创建权限
-- GRANT CREATE ROUTINE, ALTER ROUTINE ON linsir_system.* TO 'app_admin'@'%';

-- ========================================================-- 五、备份用户权限-- ========================================================

-- 5.1 创建备份用户
-- DROP USER IF EXISTS 'backup_user'@'localhost';
-- CREATE USER 'backup_user'@'localhost' IDENTIFIED BY 'Backup@123456';

-- 5.2 授予备份权限
-- GRANT SELECT, LOCK TABLES, SHOW VIEW, EVENT, TRIGGER ON linsir_system.* TO 'backup_user'@'localhost';

-- 5.3 授予RELOAD权限（用于FLUSH TABLES WITH READ LOCK）
-- GRANT RELOAD ON *.* TO 'backup_user'@'localhost';

-- ========================================================-- 六、监控用户权限-- ========================================================

-- 6.1 创建监控用户
-- DROP USER IF EXISTS 'monitor_user'@'%';
-- CREATE USER 'monitor_user'@'%' IDENTIFIED BY 'Monitor@123456';

-- 6.2 授予监控权限
-- GRANT PROCESS, REPLICATION CLIENT ON *.* TO 'monitor_user'@'%';
-- GRANT SELECT ON performance_schema.* TO 'monitor_user'@'%';
-- GRANT SELECT ON information_schema.* TO 'monitor_user'@'%';

-- ========================================================-- 七、权限刷新-- ========================================================

-- 刷新权限使更改生效
-- FLUSH PRIVILEGES;

-- ========================================================-- 八、权限验证查询-- ========================================================

-- 8.1 查询用户权限
SELECT 
    user AS '用户名',
    host AS '主机',
    select_priv AS 'SELECT',
    insert_priv AS 'INSERT',
    update_priv AS 'UPDATE',
    delete_priv AS 'DELETE',
    create_priv AS 'CREATE',
    drop_priv AS 'DROP',
    grant_priv AS 'GRANT',
    index_priv AS 'INDEX',
    alter_priv AS 'ALTER',
    show_db_priv AS 'SHOW_DB',
    super_priv AS 'SUPER',
    execute_priv AS 'EXECUTE',
    trigger_priv AS 'TRIGGER',
    event_priv AS 'EVENT',
    create_view_priv AS 'CREATE_VIEW',
    show_view_priv AS 'SHOW_VIEW'
FROM mysql.user
WHERE user LIKE 'app_%' OR user LIKE 'backup_%' OR user LIKE 'monitor_%'
ORDER BY user, host;

-- 8.2 查询数据库级权限
SELECT 
    db AS '数据库',
    user AS '用户名',
    host AS '主机',
    select_priv AS 'SELECT',
    insert_priv AS 'INSERT',
    update_priv AS 'UPDATE',
    delete_priv AS 'DELETE',
    create_priv AS 'CREATE',
    drop_priv AS 'DROP',
    grant_priv AS 'GRANT',
    index_priv AS 'INDEX',
    alter_priv AS 'ALTER',
    create_view_priv AS 'CREATE_VIEW',
    show_view_priv AS 'SHOW_VIEW',
    trigger_priv AS 'TRIGGER'
FROM mysql.db
WHERE db = 'linsir_system'
ORDER BY user, host;

-- 8.3 查询表级权限
SELECT 
    table_schema AS '数据库',
    table_name AS '表名',
    user AS '用户名',
    host AS '主机',
    table_priv AS '表权限',
    column_priv AS '列权限'
FROM mysql.tables_priv
WHERE table_schema = 'linsir_system'
ORDER BY table_name, user, host;

-- ========================================================-- 九、安全建议-- ========================================================

/*
安全建议：

1. 密码策略
   - 使用强密码（至少12位，包含大小写字母、数字、特殊字符）
   - 定期更换密码（建议90天）
   - 禁止使用默认密码

2. 网络访问控制
   - 限制用户访问IP（使用'user'@'ip'格式）
   - 禁止root用户远程访问
   - 使用VPN或私有网络连接数据库

3. 权限最小化
   - 只授予必要的权限
   - 定期审计用户权限
   - 及时回收不再需要的权限

4. 连接安全
   - 启用SSL/TLS加密连接
   - 设置连接超时
   - 限制最大连接数

5. 审计日志
   - 启用通用查询日志
   - 启用慢查询日志
   - 定期分析访问日志

6. 示例用户创建命令（取消注释后执行）：

   -- 创建应用只读用户
   CREATE USER 'app_reader'@'10.0.0.%' IDENTIFIED BY 'YourStrongPassword';
   GRANT SELECT ON linsir_system.* TO 'app_reader'@'10.0.0.%';
   
   -- 创建应用读写用户
   CREATE USER 'app_writer'@'10.0.0.%' IDENTIFIED BY 'YourStrongPassword';
   GRANT SELECT, INSERT, UPDATE, DELETE ON linsir_system.* TO 'app_writer'@'10.0.0.%';
   
   -- 创建应用管理员用户
   CREATE USER 'app_admin'@'10.0.0.%' IDENTIFIED BY 'YourStrongPassword';
   GRANT ALL PRIVILEGES ON linsir_system.* TO 'app_admin'@'10.0.0.%';
   
   FLUSH PRIVILEGES;
*/

-- ========================================================-- 权限脚本说明-- ========================================================

SELECT 'DCL权限脚本创建完成' AS '状态',
       '请根据实际环境取消注释并修改密码后执行' AS '说明',
       '建议在生产环境中使用IP白名单限制访问' AS '安全提示';

-- ========================================================-- 审核签字-- ========================================================
/*
┌─────────────────────────────────────────────────────────┐
│                      审核签字区                          │
├─────────────────────────────────────────────────────────┤
│ 审核项目: 权限配置脚本 (SYS-DB-SQL-007)                   │
│ 审核内容: 数据库用户权限、安全策略                        │
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
