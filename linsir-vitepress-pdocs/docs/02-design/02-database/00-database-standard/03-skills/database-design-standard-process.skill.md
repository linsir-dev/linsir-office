# Skill: database-design-standard-process

> **Name**: database-design-standard-process  
> **Description**: Guides the creation, review, and publication of database design standard documents including naming conventions, SQL coding standards, review standards, and data dictionary standards. Invoke when user needs to create database design standards or establish database development guidelines.  
> **Version**: 1.0  
> **Date**: 2026-03-08  
> **Author**: Database Architect

---

## Overview

The database design standard process creates 4 essential standard documents:
1. Database Naming Convention
2. SQL Coding Standard
3. Database Review Standard
4. Data Dictionary Standard

## When to Invoke

Invoke this skill when:
- User needs to create database design standards
- User asks for database naming conventions
- User needs SQL coding guidelines
- User wants to establish database review processes
- User needs data dictionary standards

## Process Flow

```
Input Phase → Create Phase → Review Phase → Sign Phase → Update Phase → Skill Phase
```

## Step-by-Step Instructions

### Step 1: Input Phase

1. **Identify Requirements**
   - Project database design needs
   - Team technology stack (MySQL/PostgreSQL/Oracle)
   - Project scale and complexity

2. **Collect Reference Standards**
   - ISO/IEC 11179 data element standards
   - Industry best practices
   - Team historical experience

3. **Plan Directory Structure**
   ```
   01-database-design-standard/
   ├── 01-database-naming-convention.md
   ├── 02-sql-coding-standard.md
   ├── 03-database-review-standard.md
   └── 04-data-dictionary-standard.md
   ```

### Step 2: Create Phase

Create 4 standard documents:

#### 2.1 Database Naming Convention
- Document location: `01-database-design-standard/01-database-naming-convention.md`
- Document number: SYS-DB-STD-001
- Key content:
  - Database naming: `db_<system>[_<env>]`
  - Table naming: `<prefix>_<module>_<name>` (sys_, biz_, log_)
  - Field naming: lowercase + underscore
  - Index naming: `idx_<table>_<field>`, `uk_<table>_<field>`

#### 2.2 SQL Coding Standard
- Document location: `01-database-design-standard/02-sql-coding-standard.md`
- Document number: SYS-DB-STD-002
- Key content:
  - SQL keywords UPPERCASE, table/field names lowercase
  - 2-space indentation
  - Explicit column selection, avoid SELECT *
  - WHERE clause mandatory for UPDATE/DELETE

#### 2.3 Database Review Standard
- Document location: `01-database-design-standard/03-database-review-standard.md`
- Document number: SYS-DB-STD-003
- Key content:
  - Review process: Prepare → Execute → Track → Baseline
  - Issue levels: P0 Critical / P1 Major / P2 Minor / P3 Suggestion
  - Pass criteria: No P0 issues, P1 issues ≤ 3

#### 2.4 Data Dictionary Standard
- Document location: `01-database-design-standard/04-data-dictionary-standard.md`
- Document number: SYS-DB-STD-004
- Key content:
  - Table-level format: basic info, field definitions, indexes, constraints
  - Field-level format: name, type, required, default, business meaning
  - Common enums: status (0-disable/1-enable), deleted flag (0-normal/1-deleted)

### Step 3: Review Phase

1. **Self-Review Checklist**
   - [ ] Document structure complete
   - [ ] Content accurate
   - [ ] Format standardized
   - [ ] Examples clear
   - [ ] No typos

2. **Technical Director Review**
   - Check if standards fit project reality
   - Check for conflicts with existing standards
   - Check coverage completeness
   - Check executability

3. **Review Result Handling**
   - Pass: Proceed to sign phase
   - Modify: Revise based on feedback and re-review
   - Reject: Redesign standard content

### Step 4: Sign Phase

Add sign-off section to each document:

```markdown
## Review Sign-off

| Role | Signature | Date |
|-----|------|------|
| Author | Database Architect | YYYY-MM-DD |
| Reviewer | Technical Director | YYYY-MM-DD |
| Approver | Technical Director | YYYY-MM-DD |

**Review Comments**: [Review comments]
```

### Step 5: Update Phase

1. **Update Checklist Status**
   - File: `00-database-standard/database-design-checklist.md`
   - Update all 4 standards status to "✅ Completed"

2. **Update Document Status**
   - Update document header:
   ```markdown
   > **Status**: ✅ Published
   > **Review Status**: ✓ Approved
   > **Review Date**: YYYY-MM-DD
   > **Reviewer**: Technical Director
   ```

### Step 6: Skill Phase

1. **Generate Skill File**
   - Create skill directory: `.trae/skills/database-design-standard-process/`
   - Create `SKILL.md` with proper frontmatter and content

2. **Import Skill**
   - Skill is automatically available after creation

3. **Backup to 03-skills**
   - Copy skill file to: `03-skills/database-design-standard-process.skill.md`

## Output Checklist

### Standard Documents

| No. | Document Name | Document No. | Location |
|-----|--------------|-------------|----------|
| 1 | Database Naming Convention | SYS-DB-STD-001 | `01-database-design-standard/01-database-naming-convention.md` |
| 2 | SQL Coding Standard | SYS-DB-STD-002 | `01-database-design-standard/02-sql-coding-standard.md` |
| 3 | Database Review Standard | SYS-DB-STD-003 | `01-database-design-standard/03-database-review-standard.md` |
| 4 | Data Dictionary Standard | SYS-DB-STD-004 | `01-database-design-standard/04-data-dictionary-standard.md` |

### Quality Checklist

- [ ] All 4 standard documents created
- [ ] Document numbers correct
- [ ] Document format unified
- [ ] Content complete
- [ ] Self-review completed
- [ ] Technical director review passed
- [ ] Review comments recorded
- [ ] Author signed
- [ ] Reviewer signed
- [ ] Approver signed
- [ ] Checklist status updated to "✅ Completed"
- [ ] Document status updated
- [ ] Skill file generated
- [ ] Skill imported
- [ ] Skill backed up to 03-skills

## Key Naming Conventions

### Table Prefixes
- `sys_` - System module (users, roles, permissions)
- `biz_` - Business module (orders, products)
- `log_` - Log module (operation logs, login logs)
- `tmp_` - Temporary tables
- `bak_` - Backup tables
- `his_` - Historical tables

### Common Enums
- Status: 0-disable, 1-enable
- Deleted flag: 0-normal, 1-deleted
- Gender: 0-unknown, 1-male, 2-female
- Yes/No: 0-no, 1-yes

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-08 | Database Architect | Initial version |
