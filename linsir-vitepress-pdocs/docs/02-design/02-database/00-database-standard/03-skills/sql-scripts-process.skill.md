---
name: "sql-scripts-process"
description: "Guides the SQL scripts development process including DDL (database, tables, indexes, constraints, views), DML (data initialization), and DCL (permissions) scripts creation, review, and deployment. Invoke when user needs to create SQL scripts, database scripts, or manage database schema changes."
---

# SQL Scripts Process

This skill guides the complete SQL scripts workflow for System platform projects.

## When to Use

Invoke this skill when:
- User needs to create SQL scripts for database operations
- User asks for DDL scripts (database, tables, indexes, constraints, views)
- User asks for DML scripts (data initialization, migration)
- User asks for DCL scripts (user permissions, grants)
- User needs to review SQL scripts
- User asks for database schema changes
- User needs SQL script templates or standards

## Process Overview

The SQL scripts process includes 6 main steps:
1. Script Planning - Plan script categories and dependencies
2. DDL Script Development - Create database structure scripts
3. DML Script Development - Create data initialization scripts
4. DCL Script Development - Create permission scripts
5. Script Review - Review and approve scripts
6. Script Deployment - Execute scripts in target environments

## Step 1: Script Planning

### Input Documents
- Physical Data Model Design Document
- Data Dictionary Document
- Database Design Standards
- SQL Coding Standards

### Activities
1. Identify tables to create based on physical data model
2. Design indexes based on query requirements
3. Define foreign key constraints based on business relationships
4. Design views based on business needs
5. Plan initialization data based on system requirements
6. Define security requirements for permissions

### Output
- Script inventory (type, filename, dependencies)
- Script execution order table

### Script Classification

| Category | Directory | Naming Convention | Description |
|----------|-----------|-------------------|-------------|
| DDL | 01-ddl-scripts/ | XX-action-object.sql | Database structure definition |
| DML | 02-dml-scripts/ | XX-action-data.sql | Data operations |
| DCL | 03-dcl-scripts/ | XX-action-permission.sql | Permission control |
| Migration | 04-migration-scripts/ | Vversion__description.sql | Version migration |

## Step 2: DDL Script Development

### 2.1 Database Creation Script

**File**: `01-create-database.sql`

**Template**:
```sql
-- ========================================================
-- Document Header (Required)
-- ========================================================
-- Document ID: SYS-DB-SQL-001
-- Version: 1.0
-- Date: YYYY-MM-DD
-- Author: Developer Name
-- ========================================================

-- Create database
CREATE DATABASE IF NOT EXISTS database_name
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

-- Use database
USE database_name;

-- Set parameters
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
```

**Checklist**:
- [ ] Character set is utf8mb4
- [ ] Collation is utf8mb4_unicode_ci
- [ ] Document header included

### 2.2 Table Creation Script

**File**: `02-create-tables.sql`

**Template**:
```sql
DROP TABLE IF EXISTS `table_name`;
CREATE TABLE `table_name` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Primary Key ID',
    -- Business fields
    `business_field` varchar(100) NOT NULL COMMENT 'Business field',
    -- Required fields
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create time',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update time',
    `create_by` bigint DEFAULT NULL COMMENT 'Creator ID',
    `update_by` bigint DEFAULT NULL COMMENT 'Updater ID',
    `deleted` tinyint NOT NULL DEFAULT '0' COMMENT 'Delete flag',
    `tenant_id` bigint NOT NULL COMMENT 'Tenant ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_unique_identifier` (`unique_field`),
    KEY `idx_index_name` (`index_field`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table comment';
```

**Checklist**:
- [ ] Table name uses lowercase with underscore, sys_ prefix
- [ ] Includes required fields: id, create_time, update_time, create_by, update_by, deleted, tenant_id
- [ ] All fields have COMMENT
- [ ] Primary key uses bigint auto-increment
- [ ] Storage engine is InnoDB
- [ ] Character set is utf8mb4

### 2.3 Index Creation Script

**File**: `03-create-indexes.sql`

**Template**:
```sql
-- Regular index
CREATE INDEX `idx_table_field` ON `table_name`(`field_name`);

-- Composite index
CREATE INDEX `idx_table_field1_field2` ON `table_name`(`field1`, `field2`);

-- Prefix index (for long text)
CREATE INDEX `idx_table_field` ON `table_name`(`field_name`(100));
```

**Index Design Principles**:
1. Primary key index: Every table must have a primary key
2. Unique index: For unique constraint fields
3. Foreign key index: Auto-created for foreign key fields
4. Query index: For WHERE conditions, ORDER BY, JOIN fields
5. Composite index: Follow leftmost prefix principle

**Checklist**:
- [ ] Index naming: idx_table_field
- [ ] No duplicate indexes
- [ ] Control index count per table (recommend ≤5)

### 2.4 Constraint Creation Script

**File**: `04-create-constraints.sql`

**Template**:
```sql
-- Foreign key constraint
ALTER TABLE `child_table`
    ADD CONSTRAINT `fk_child_parent` 
    FOREIGN KEY (`foreign_key_field`) 
    REFERENCES `parent_table`(`primary_key_field`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE;

-- Check constraint (MySQL 8.0.16+)
ALTER TABLE `table_name`
    ADD CONSTRAINT `chk_constraint_name` 
    CHECK (`field` IN (value1, value2));
```

**Foreign Key Strategies**:
- ON DELETE CASCADE: Cascade delete (for strong relationships)
- ON DELETE SET NULL: Set null (for weak relationships)
- ON DELETE RESTRICT: Prevent delete (default)

**Checklist**:
- [ ] Foreign key naming: fk_child_parent
- [ ] Cascade strategy is reasonable
- [ ] Foreign key field type matches primary key

### 2.5 View Creation Script

**File**: `05-create-views.sql`

**Template**:
```sql
DROP VIEW IF EXISTS `v_view_name`;

CREATE VIEW `v_view_name` AS
SELECT 
    field_list
FROM table1
LEFT JOIN table2 ON join_condition
WHERE filter_condition;
```

**View Naming Conventions**:
- User views: v_user_xxx
- Department views: v_dept_xxx
- Role views: v_role_xxx
- Statistics views: v_xxx_stats

**Checklist**:
- [ ] View naming: v_view_name
- [ ] Use DROP VIEW IF EXISTS to avoid errors
- [ ] View logic is clear, performance acceptable

## Step 3: DML Script Development

**File**: `01-init-data.sql`

**Template**:
```sql
-- Initialize tenant data
INSERT INTO `sys_tenant_config` (fields) VALUES (values);

-- Initialize dictionary data
INSERT INTO `sys_dict_type` (fields) VALUES (values);
INSERT INTO `sys_dict_item` (fields) VALUES (values);

-- Initialize permission data
INSERT INTO `sys_permission` (fields) VALUES (values);

-- Initialize role data
INSERT INTO `sys_role` (fields) VALUES (values);

-- Initialize menu data
INSERT INTO `sys_menu` (fields) VALUES (values);

-- Initialize user data (password encrypted with BCrypt)
INSERT INTO `sys_user` (username, password, ...) 
VALUES ('admin', '$2a$10$...', ...);

-- Initialize role-permission relationships
INSERT INTO `sys_role_permission` (role_id, permission_id) VALUES (1, 1);

-- Initialize user-role relationships
INSERT INTO `sys_user_role` (user_id, role_id, is_primary) VALUES (1, 1, 1);
```

**Data Initialization Order**:
1. Tenant data (sys_tenant_config)
2. Dictionary data (sys_dict_type, sys_dict_item)
3. Permission data (sys_permission)
4. Role data (sys_role)
5. Menu data (sys_menu)
6. Department data (sys_dept)
7. Position data (sys_position)
8. User data (sys_user)
9. Role-permission relationships (sys_role_permission)
10. User-role relationships (sys_user_role)
11. User-department relationships (sys_user_dept)
12. Employee data (sys_employee)

**Checklist**:
- [ ] Data initialization order is correct (parent tables first)
- [ ] Passwords are encrypted
- [ ] Foreign key referenced data exists
- [ ] Includes initialization statistics query

## Step 4: DCL Script Development

**File**: `01-grant-permissions.sql`

**Template**:
```sql
-- ========================================================
-- Description:
-- This script creates database users and assigns permissions
-- Follows principle of least privilege
-- ========================================================

-- 1. Create read-only user (for reports, analytics)
-- DROP USER IF EXISTS 'app_reader'@'%';
-- CREATE USER 'app_reader'@'%' IDENTIFIED BY 'strong_password';

-- 2. Create read-write user (for business operations)
-- DROP USER IF EXISTS 'app_writer'@'%';
-- CREATE USER 'app_writer'@'%' IDENTIFIED BY 'strong_password';

-- 3. Create admin user (for DDL operations)
-- DROP USER IF EXISTS 'app_admin'@'%';
-- CREATE USER 'app_admin'@'%' IDENTIFIED BY 'strong_password';

-- Read-only user permissions
-- GRANT SELECT ON database_name.* TO 'app_reader'@'%';

-- Read-write user permissions
-- GRANT SELECT, INSERT, UPDATE, DELETE ON database_name.* TO 'app_writer'@'%';

-- Admin user permissions
-- GRANT ALL PRIVILEGES ON database_name.* TO 'app_admin'@'%';

-- Flush privileges
-- FLUSH PRIVILEGES;
```

**User Classification**:

| User Type | Permission Scope | Use Case |
|-----------|------------------|----------|
| app_reader | SELECT | Report queries, data analysis |
| app_writer | SELECT, INSERT, UPDATE, DELETE | Business operations |
| app_admin | ALL PRIVILEGES | DDL operations, maintenance |
| backup_user | SELECT, LOCK TABLES | Data backup |
| monitor_user | PROCESS, REPLICATION CLIENT | Monitoring queries |

**Security Requirements**:
1. Passwords must be strong (12+ chars, mixed case, numbers, special chars)
2. Production environment restricts user access IP (use 'user'@'ip' format)
3. Follow principle of least privilege
4. Regular audit of user permissions
5. Revoke unnecessary permissions promptly

**Checklist**:
- [ ] Default commented state, manual enable required
- [ ] Includes security best practices
- [ ] Password uses placeholder prompting for change

## Step 5: Script Review

### 5.1 Self-Test Check

**Pre-execution check**:
```bash
# Check SQL syntax
mysql -u root -p --dry-run < script.sql

# Check script execution time
mysql -u root -p -e "source script.sql;" 2>&1 | tee execution.log
```

**Checklist**:
- [ ] SQL syntax is correct
- [ ] No duplicate creation errors (use IF EXISTS/IF NOT EXISTS)
- [ ] Foreign key dependency order is correct
- [ ] Character set settings are consistent

### 5.2 Code Review

**Review Content**:

| Check Category | Check Item | Standard |
|----------------|------------|----------|
| Naming | Database naming | Lowercase, underscore |
| | Table naming | sys_ prefix, lowercase underscore |
| | Field naming | Lowercase underscore |
| | Index naming | idx_table_field |
| | Foreign key naming | fk_child_parent |
| | View naming | v_view_name |
| Structure | Primary key design | bigint auto-increment |
| | Required fields | Include standard fields |
| | Field comments | All fields have comments |
| | Storage engine | InnoDB |
| | Character set | utf8mb4 |
| Index | Primary key index | Every table must have |
| | Foreign key index | Auto-created for foreign keys |
| | Query index | Cover query conditions |
| Security | Password encryption | BCrypt encryption |
| | Permission control | Principle of least privilege |
| | SQL injection prevention | Use parameterized queries |
| Performance | Large table partitioning | Consider partitioning for 10M+ rows |
| | Index count | ≤5 per table |
| | Large fields | TEXT/BLOB stored separately |

### 5.3 Review Record

**Document**: `sql-scripts-review-record.md`

**Content Requirements**:
- Review overview (object, scope, date)
- Review personnel (reviewer, approver)
- Review content (DDL/DML/DCL script review details)
- Review conclusion (pass/fail)
- Review signatures

## Step 6: Script Deployment

### 6.1 Test Environment Execution

**Execution Steps**:
1. Backup test database
2. Execute DDL scripts in order
3. Execute DML initialization scripts
4. Execute DCL permission scripts (optional)
5. Verify data integrity
6. Run functional tests

**Verification Queries**:
```sql
-- Verify tables
SHOW TABLES;

-- Verify table structure
DESCRIBE sys_user;

-- Verify indexes
SHOW INDEX FROM sys_user;

-- Verify foreign keys
SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE REFERENCED_TABLE_NAME IS NOT NULL;

-- Verify data
SELECT COUNT(*) FROM sys_user;
```

### 6.2 Production Environment Execution

**Execution Steps**:
1. Apply for change window
2. Backup production database
3. Execute scripts in maintenance window
4. Verify execution results
5. Resume business access

**Safety Requirements**:
- Must execute in maintenance window
- Must have rollback plan
- Must have personnel on standby
- Must record execution logs

## Quality Standards

### SQL Script Quality Standards

| Quality Dimension | Requirement | Check Method |
|-------------------|-------------|--------------|
| Correctness | Syntax correct, logic correct | Syntax check, unit test |
| Completeness | Cover all requirements | Requirement traceability |
| Consistency | Naming, style consistent | Code review |
| Security | No SQL injection risk | Security scan |
| Performance | High execution efficiency | Performance test |
| Maintainability | Clear comments, clear structure | Code review |

### Review Pass Criteria

- All check items passed
- No high-risk issues
- Medium-risk issues have solutions
- Reviewer and approver signatures confirmed

## Related Documents

| Document Name | Document ID | Location |
|---------------|-------------|----------|
| Database Naming Convention | DB-STD-001 | 01-database-design-standard/01-database-naming-convention.md |
| SQL Coding Standard | DB-STD-002 | 01-database-design-standard/02-sql-coding-standard.md |
| Physical Data Model | SYS-DB-DES-002 | 02-database-design/02-physical-data-model.md |
| Data Dictionary | SYS-DB-DICT-001 | 03-data-dictionary/01-system-data-dictionary.md |

## Process Metrics

| Metric Name | Target | Description |
|-------------|--------|-------------|
| Script Development Cycle | ≤5 days | From design to review completion |
| Review Pass Rate | ≥95% | First review pass ratio |
| Production Issue Rate | ≤1% | Production script issue ratio |
| Rollback Rate | ≤2% | Script execution rollback ratio |
