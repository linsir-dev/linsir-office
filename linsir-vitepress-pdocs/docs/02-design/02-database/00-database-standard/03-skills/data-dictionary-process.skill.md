---
name: "data-dictionary-process"
description: "Guides the data dictionary creation process including system dictionary, business dictionary, field definitions, enum values, and review. Invoke when user needs to create data dictionary, define database fields, or manage data dictionary documentation."
---

# Data Dictionary Process

This skill guides the complete data dictionary workflow for System platform projects.

## When to Use

Invoke this skill when:
- User needs to create data dictionary for database tables
- User asks for field definitions or enum value documentation
- User needs to document database schema
- User wants to create system dictionary or business dictionary
- User asks for data dictionary review process
- User needs data dictionary templates or standards

## Process Overview

The data dictionary process includes 6 main steps:
1. **Prepare Input Documents** - Collect physical data model and design docs
2. **Establish Standards** - Define dictionary format and naming conventions
3. **Create System Dictionary** - Document system config, dict tables, logs
4. **Create Business Dictionary** - Document user, permission, org tables
5. **Review Dictionary** - Conduct technical review
6. **Establish Baseline** - Archive and version control

## Step-by-Step Guide

### Step 1: Prepare Input Documents

**Required Inputs**:
- Physical data model document
- Database design documents
- Business requirements document

**Tasks**:
- [ ] Collect physical data model
- [ ] Organize database design documents
- [ ] Analyze business requirements
- [ ] Determine dictionary scope

### Step 2: Establish Standards

**Create Standards Document**:
- Dictionary format specification
- Field description standards
- Enum value definition standards
- Dictionary maintenance process

**Standard Requirements**:

| Standard Item | Requirement |
|--------------|-------------|
| Document Format | Markdown with unified template |
| Field Description | Include name, type, nullable, default, description, rules |
| Enum Values | Include value, label, description columns |
| Version Control | Update revision record for each change |

### Step 3: Create System Dictionary

**Document**: SYS-DB-DICT-001

**Tables to Document**:

**System Config Tables**:
- sys_tenant_config (19 fields, 18 enums)
- sys_web_config (20 fields, 5 enums)
- sys_business_config (25 fields, 6 enums)

**Dictionary Tables**:
- sys_dict_type (11 fields, 16 enums)
- sys_dict_item (13 fields, 50+ enums)

**Log Tables**:
- sys_operation_log (16 fields, 11 enums)
- sys_login_log (14 fields, 6 enums)

**Template for Each Table**:
```markdown
### Table Name (table_name)

**Description**: Table purpose

#### Basic Information
| Attribute | Value |
|-----------|-------|
| Table Name | table_name |
| Chinese Name | 表中文名 |
| Engine | InnoDB |
| Charset | utf8mb4 |

#### Field Dictionary
| Field | Type | Nullable | Default | Description | Rules |
|-------|------|----------|---------|-------------|-------|
| id | BIGINT | No | Auto | Primary ID | PK |

#### Enum Definitions
**status**:
| Value | Label | Description |
|-------|-------|-------------|
| 0 | Disabled | Account disabled |
| 1 | Enabled | Account enabled |

#### Business Rules
1. Rule 1
2. Rule 2
```

### Step 4: Create Business Dictionary

**Document**: SYS-DB-DICT-002

**Tables to Document**:

**User Management**:
- sys_user (20 fields, 3 enums)
- sys_user_role (7 fields, 2 enums)
- sys_user_dept (7 fields, 2 enums)

**Permission Management**:
- sys_role (14 fields, 10 enums)
- sys_role_permission (6 fields)
- sys_permission (12 fields, 6 enums)
- sys_menu (20 fields, 10 enums)

**Organization Management**:
- sys_dept (16 fields, 2 enums)
- sys_position (13 fields, 2 enums)
- sys_employee (26 fields, 7 enums)

### Step 5: Review Dictionary

**Document**: SYS-DB-DICT-003

**Review Checklist**:

| Check Item | Content | Pass Criteria |
|-----------|---------|---------------|
| Field Completeness | All fields have definitions | 100% coverage |
| Data Types | Type selection is reasonable | Follows standards |
| Enum Values | Enums are fully defined | All enum fields covered |
| Business Rules | Rules are clearly described | Key fields have rules |
| Relationships | Table relationships are accurate | FK correct |

**Review Participants**:
- Review Lead: Technical Lead
- Presenter: Database Architect
- Reviewers: System Architect, Backend Lead, Frontend Lead, QA Lead
- Recorder: Project Manager

### Step 6: Establish Baseline

**Tasks**:
- [ ] Archive dictionary documents
- [ ] Establish version baseline
- [ ] Notify stakeholders

## Output Documents

| No. | Document | Code | Description |
|-----|----------|------|-------------|
| 1 | System Data Dictionary | SYS-DB-DICT-001 | System-level dictionary |
| 2 | Business Data Dictionary | SYS-DB-DICT-002 | Business-level dictionary |
| 3 | Dictionary Review Record | SYS-DB-DICT-003 | Review documentation |

## Quality Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Field Definition Completeness | 100% | All fields must have definitions |
| Enum Definition Completeness | 100% | All enum fields must have values |
| Business Rule Coverage | ≥90% | Key fields must have rules |
| Dictionary Completion Time | ≤3 days | From design to review |
| Review Issues | ≤5 | Issues per review |
| Review Pass Rate | ≥90% | First-time pass rate |

## Common Enum Values

### Status Enums
```
0 - Disabled (禁用)
1 - Enabled (启用)
```

### Gender Enums
```
0 - Unknown (未知)
1 - Male (男)
2 - Female (女)
```

### Role Type Enums
```
1 - System Role (系统角色)
2 - Business Role (业务角色)
```

### Data Scope Enums
```
1 - All Data (全部数据)
2 - Dept Only (本部门)
3 - Dept & Children (本部门及子部门)
4 - Self Only (仅本人)
5 - Custom (自定义)
```

### Menu Type Enums
```
1 - Directory (目录)
2 - Menu (菜单)
3 - Button (按钮)
```

### Employment Status Enums
```
1 - Active (在职)
2 - Resigned (离职)
3 - Probation (试用期)
4 - Intern (实习)
5 - Leave (停薪留职)
```

## Best Practices

1. **Field Naming**: Use lowercase with underscores (snake_case)
2. **Data Types**: Choose appropriate types, avoid over-sizing
3. **Nullable Fields**: Minimize nullable fields, use defaults when possible
4. **Enum Values**: Use integers for enums, document all values
5. **Business Rules**: Document constraints and validation rules
6. **Version Control**: Update revision record for every change
7. **Consistency**: Maintain consistent format across all tables
8. **Completeness**: Include all fields, even audit fields

## Example: Complete Table Dictionary

```markdown
### User Table (sys_user)

**Description**: Stores system user basic information

#### Basic Information
| Attribute | Value |
|-----------|-------|
| Table Name | sys_user |
| Chinese Name | 用户表 |
| Engine | InnoDB |
| Charset | utf8mb4 |
| Row Count | ~10,000 |

#### Field Dictionary
| Field | Type | Nullable | Default | Description | Rules |
|-------|------|----------|---------|-------------|-------|
| id | BIGINT | No | Auto | User ID | PK |
| username | VARCHAR(50) | No | - | Username | Unique, 3-20 chars |
| password | VARCHAR(100) | No | - | Password | BCrypt encrypted |
| email | VARCHAR(100) | Yes | NULL | Email | Unique, valid format |
| phone | VARCHAR(20) | Yes | NULL | Phone | Unique, valid format |
| status | TINYINT | No | 1 | Status | 0=Disabled, 1=Enabled |
| create_time | DATETIME | No | CURRENT_TIMESTAMP | Create Time | - |
| tenant_id | BIGINT | No | - | Tenant ID | Multi-tenant |

#### Enum Definitions
**status**:
| Value | Label | Description |
|-------|-------|-------------|
| 0 | Disabled | Account disabled, cannot login |
| 1 | Enabled | Account active |

#### Business Rules
1. Username: 3-20 chars, letters/numbers/underscore, start with letter
2. Password: 8-20 chars, must contain letters and numbers
3. Email: Must be unique, valid email format
4. Phone: Must be unique, valid phone format
5. One user can only link to one employee (1:1 or 1:0)

#### Indexes
| Index Name | Fields | Type | Purpose |
|------------|--------|------|---------|
| pk_sys_user | id | Primary | Primary key |
| uk_username | username | Unique | Username unique |
| uk_email | email | Unique | Email unique |
| uk_phone | phone | Unique | Phone unique |
| idx_tenant | tenant_id | Normal | Tenant query |
| idx_status | status | Normal | Status filter |
```
