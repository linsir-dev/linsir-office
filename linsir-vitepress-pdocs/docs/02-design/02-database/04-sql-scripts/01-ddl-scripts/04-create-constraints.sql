-- ========================================================-- System Platform Constraint Creation Script
-- 约束创建脚本
-- ========================================================-- 文档编号: SYS-DB-SQL-004
-- 版本: 1.0
-- 日期: 2026-03-08
-- 作者: 数据库架构师
-- ========================================================

USE linsir_system;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ========================================================-- 说明：
-- 1. 主键约束在创建表时已自动创建
-- 2. 唯一约束在创建表时已定义
-- 3. 本脚本创建外键约束和检查约束
-- 4. 外键约束名规则：fk_从表_主表
-- ========================================================

-- ========================================================-- 一、数据字典表外键约束
-- ========================================================

-- 1.1 数据字典项表外键约束
-- 外键：dict_type_id -> sys_dict_type.id
ALTER TABLE `sys_dict_item`
    ADD CONSTRAINT `fk_dict_item_type`
    FOREIGN KEY (`dict_type_id`)
    REFERENCES `sys_dict_type`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- ========================================================-- 二、用户管理表外键约束
-- ========================================================

-- 2.1 用户表外键约束
-- 外键：dept_id -> sys_dept.id
ALTER TABLE `sys_user`
    ADD CONSTRAINT `fk_user_dept`
    FOREIGN KEY (`dept_id`)
    REFERENCES `sys_dept`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- 2.2 用户角色关系表外键约束
-- 外键：user_id -> sys_user.id
ALTER TABLE `sys_user_role`
    ADD CONSTRAINT `fk_user_role_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `sys_user`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- 外键：role_id -> sys_role.id
ALTER TABLE `sys_user_role`
    ADD CONSTRAINT `fk_user_role_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `sys_role`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- 2.3 用户部门关系表外键约束
-- 外键：user_id -> sys_user.id
ALTER TABLE `sys_user_dept`
    ADD CONSTRAINT `fk_user_dept_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `sys_user`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- 外键：dept_id -> sys_dept.id
ALTER TABLE `sys_user_dept`
    ADD CONSTRAINT `fk_user_dept_dept`
    FOREIGN KEY (`dept_id`)
    REFERENCES `sys_dept`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- ========================================================-- 三、权限管理表外键约束
-- ========================================================

-- 3.1 角色权限关系表外键约束
-- 外键：role_id -> sys_role.id
ALTER TABLE `sys_role_permission`
    ADD CONSTRAINT `fk_role_perm_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `sys_role`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- 外键：permission_id -> sys_permission.id
ALTER TABLE `sys_role_permission`
    ADD CONSTRAINT `fk_role_perm_perm`
    FOREIGN KEY (`permission_id`)
    REFERENCES `sys_permission`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- 3.2 菜单表外键约束
-- 外键：parent_id -> sys_menu.id（自引用）
ALTER TABLE `sys_menu`
    ADD CONSTRAINT `fk_menu_parent`
    FOREIGN KEY (`parent_id`)
    REFERENCES `sys_menu`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- 3.3 权限表外键约束
-- 外键：parent_id -> sys_permission.id（自引用）
ALTER TABLE `sys_permission`
    ADD CONSTRAINT `fk_perm_parent`
    FOREIGN KEY (`parent_id`)
    REFERENCES `sys_permission`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- ========================================================-- 四、组织管理表外键约束
-- ========================================================

-- 4.1 部门表外键约束
-- 外键：parent_id -> sys_dept.id（自引用）
ALTER TABLE `sys_dept`
    ADD CONSTRAINT `fk_dept_parent`
    FOREIGN KEY (`parent_id`)
    REFERENCES `sys_dept`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- 外键：leader_id -> sys_user.id
ALTER TABLE `sys_dept`
    ADD CONSTRAINT `fk_dept_leader`
    FOREIGN KEY (`leader_id`)
    REFERENCES `sys_user`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- 4.2 员工表外键约束
-- 外键：user_id -> sys_user.id
ALTER TABLE `sys_employee`
    ADD CONSTRAINT `fk_emp_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `sys_user`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- 外键：dept_id -> sys_dept.id
ALTER TABLE `sys_employee`
    ADD CONSTRAINT `fk_emp_dept`
    FOREIGN KEY (`dept_id`)
    REFERENCES `sys_dept`(`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

-- 外键：position_id -> sys_position.id
ALTER TABLE `sys_employee`
    ADD CONSTRAINT `fk_emp_position`
    FOREIGN KEY (`position_id`)
    REFERENCES `sys_position`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- ========================================================-- 五、检查约束
-- ========================================================

-- 说明：MySQL 8.0.16+ 支持CHECK约束，但之前的版本会解析但忽略CHECK约束
-- 这里使用触发器来实现复杂的业务规则检查

-- 5.1 用户表检查约束（通过触发器实现）
DELIMITER //

CREATE TRIGGER `trg_check_user_status`
BEFORE INSERT ON `sys_user`
FOR EACH ROW
BEGIN
    -- 检查状态值范围
    IF NEW.status NOT IN (0, 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: status must be 0 or 1';
    END IF;
    -- 检查性别值范围
    IF NEW.gender NOT IN (0, 1, 2) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: gender must be 0, 1 or 2';
    END IF;
END//

CREATE TRIGGER `trg_check_user_status_update`
BEFORE UPDATE ON `sys_user`
FOR EACH ROW
BEGIN
    -- 检查状态值范围
    IF NEW.status NOT IN (0, 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: status must be 0 or 1';
    END IF;
    -- 检查性别值范围
    IF NEW.gender NOT IN (0, 1, 2) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: gender must be 0, 1 or 2';
    END IF;
END//

-- 5.2 角色表检查约束（通过触发器实现）
CREATE TRIGGER `trg_check_role_type`
BEFORE INSERT ON `sys_role`
FOR EACH ROW
BEGIN
    -- 检查角色类型值范围
    IF NEW.role_type NOT IN (1, 2) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: role_type must be 1 or 2';
    END IF;
    -- 检查数据范围值
    IF NEW.data_scope NOT IN (1, 2, 3, 4, 5) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: data_scope must be between 1 and 5';
    END IF;
    -- 检查状态值范围
    IF NEW.status NOT IN (0, 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: status must be 0 or 1';
    END IF;
END//

-- 5.3 员工表检查约束（通过触发器实现）
CREATE TRIGGER `trg_check_employee_status`
BEFORE INSERT ON `sys_employee`
FOR EACH ROW
BEGIN
    -- 检查在职状态值范围
    IF NEW.employment_status NOT IN (1, 2, 3, 4, 5) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: employment_status must be between 1 and 5';
    END IF;
    -- 检查性别值范围
    IF NEW.gender NOT IN (0, 1, 2) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: gender must be 0, 1 or 2';
    END IF;
END//

-- 5.4 菜单表检查约束（通过触发器实现）
CREATE TRIGGER `trg_check_menu_type`
BEFORE INSERT ON `sys_menu`
FOR EACH ROW
BEGIN
    -- 检查菜单类型值范围
    IF NEW.menu_type NOT IN (1, 2, 3) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: menu_type must be 1, 2 or 3';
    END IF;
    -- 检查状态值范围
    IF NEW.status NOT IN (0, 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: status must be 0 or 1';
    END IF;
END//

-- 5.5 权限表检查约束（通过触发器实现）
CREATE TRIGGER `trg_check_perm_type`
BEFORE INSERT ON `sys_permission`
FOR EACH ROW
BEGIN
    -- 检查资源类型值范围
    IF NEW.resource_type NOT IN (1, 2, 3) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: resource_type must be 1, 2 or 3';
    END IF;
    -- 检查状态值范围
    IF NEW.status NOT IN (0, 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: status must be 0 or 1';
    END IF;
END//

DELIMITER ;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================-- 约束统计
-- ========================================================

-- 查询外键约束统计
SELECT
    TABLE_NAME as '表名',
    CONSTRAINT_NAME as '约束名',
    CONSTRAINT_TYPE as '约束类型'
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_SCHEMA = 'linsir_system'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
ORDER BY TABLE_NAME, CONSTRAINT_NAME;

-- 查询触发器统计
SELECT
    TRIGGER_NAME as '触发器名',
    EVENT_MANIPULATION as '事件',
    ACTION_TIMING as '时机',
    EVENT_OBJECT_TABLE as '表名'
FROM INFORMATION_SCHEMA.TRIGGERS
WHERE TRIGGER_SCHEMA = 'linsir_system'
ORDER BY EVENT_OBJECT_TABLE, TRIGGER_NAME;

-- 创建完成提示
SELECT '约束创建完成' as '状态';

-- ========================================================-- 审核签字-- ========================================================
/*
┌─────────────────────────────────────────────────────────┐
│                      审核签字区                          │
├─────────────────────────────────────────────────────────┤
│ 审核项目: 约束创建脚本 (SYS-DB-SQL-004)                   │
│ 审核内容: 外键约束、检查约束、触发器设计                   │
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
