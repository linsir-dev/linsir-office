---
name: "database-design-process"
description: "Guides the database design process including logical data modeling, physical data modeling, index design, partition design, backup strategy, and review. Invoke when user needs to design database, create data models, or plan database architecture."
---

# Database Design Process

This skill guides the complete database design workflow for System platform projects.

## When to Use

Invoke this skill when:
- User needs to design database for a new system
- User asks for database modeling or data architecture
- User needs to create logical/physical data models
- User wants to design database indexes or partitions
- User needs database backup/recovery strategy
- User asks for database design documentation

## Process Overview

The database design process consists of 7 phases:

### Phase 1: Input Preparation
**Prerequisites:**
- Domain model design (SYS-DES-BA-002)
- Business requirements document (BRD)
- Architecture baseline document (SYS-BASELINE-001)

**Actions:**
1. Review input documents
2. Confirm design scope
3. Output: Design input confirmation

### Phase 2: Standards Establishment
**Create 4 standard documents:**

1. **Database Naming Convention** (`01-database-design-standard/01-database-naming-convention.md`)
   - Database naming rules
   - Table naming rules
   - Field naming rules
   - Index naming rules
   - Constraint naming rules

2. **SQL Coding Standard** (`01-database-design-standard/02-sql-coding-standard.md`)
   - SQL statement writing standards
   - Comment standards
   - Indentation and formatting
   - Performance optimization guidelines
   - Security coding requirements

3. **Database Review Standard** (`01-database-design-standard/03-database-review-standard.md`)
   - Review checklist
   - Review process
   - Review criteria
   - Issue classification

4. **Data Dictionary Standard** (`01-database-design-standard/04-data-dictionary-standard.md`)
   - Data dictionary format
   - Field description standards
   - Enum value definition
   - Maintenance process

### Phase 3: Logical Data Modeling
**Output:** `02-database-design/01-logical-data-model.md`

**Steps:**
1. **Entity Identification**
   - Extract core entities from domain model
   - Identify associative entities
   - Define entity names

2. **Attribute Definition**
   - Define entity attributes
   - Determine data types and lengths
   - Mark required/optional fields

3. **Relationship Establishment**
   - Define relationships (1:1, 1:N, M:N)
   - Establish foreign key associations
   - Define cascade rules

4. **ER Diagram Generation**
   - Draw ER diagram using Mermaid
   - Label entity relationships
   - Verify relationship integrity

5. **Document Creation**
   - Write logical data model document
   - Include entity definitions, attributes, relationships
   - Add business rules

### Phase 4: Physical Data Modeling
**Outputs:**
- `02-database-design/02-physical-data-model.md`
- `02-database-design/03-database-index-design.md`
- `02-database-design/04-database-partition-design.md`
- `02-database-design/05-database-backup-strategy.md`

**Steps:**

1. **Table Structure Design**
   - Define table names, field names
   - Determine data types, lengths, precision
   - Set defaults, nullability
   - Add field comments

2. **Constraint Design**
   - Primary Key constraints
   - Foreign Key constraints
   - Unique constraints
   - Check constraints

3. **Index Design**
   - Primary key indexes
   - Foreign key indexes
   - Business query indexes
   - Composite indexes

4. **Partition Design** (Optional)
   - Determine partition strategy (Range/List/Hash)
   - Select partition key
   - Design partition rules

5. **Backup Strategy**
   - Full backup strategy
   - Incremental backup strategy
   - Backup retention period
   - Recovery strategy (RTO/RPO)

### Phase 5: Data Dictionary
**Outputs:**
- `03-data-dictionary/01-system-data-dictionary.md`
- `03-data-dictionary/02-business-data-dictionary.md`

**Steps:**
1. System data dictionary
2. Business data dictionary

### Phase 6: SQL Scripts
**Output directory:** `04-sql-scripts/`

**Create:**
1. DDL scripts (`01-ddl-scripts/`)
2. DML scripts (`02-dml-scripts/`)
3. DCL scripts (`03-dcl-scripts/`)
4. Migration scripts (`04-migration-scripts/`)

### Phase 7: Review and Baseline
**Outputs:**
- `05-database-review/01-database-review-notice.md`
- `05-database-review/02-database-review-agenda.md`
- `05-database-review/03-database-review-report.md`
- `05-database-review/04-database-review-record.md`
- `05-database-review/05-database-baseline.md`

**Steps:**
1. Review preparation
2. Review execution
3. Baseline establishment

## Design Principles

### Logical Design Principles
- All entities must have a primary key
- All entities must have audit fields (create_time, update_time, create_by, update_by)
- Support logical deletion (deleted field)
- Support multi-tenancy (tenant_id field)
- Use 3NF normalization

### Physical Design Principles
- Use InnoDB storage engine
- Use utf8mb4 character set
- Use BIGINT AUTO_INCREMENT for primary keys
- All fields must have comments
- Foreign keys must have indexes
- Maximum 5 indexes per table

### Index Design Principles
- High selectivity fields first
- Leftmost prefix principle for composite indexes
- Covering index for frequent queries
- Avoid redundant indexes

### Partition Design Principles
- Partition only large tables
- Use time-based partitioning for logs
- Monthly partitions for balance
- Pre-create partitions for 3 months ahead

### Backup Strategy Principles
- 3-2-1 backup rule
- RTO ≤ 4 hours
- RPO ≤ 1 hour
- Encrypted storage for sensitive data
- Regular recovery testing

## Output Document Summary

### Design Documents (6)
1. Logical Data Model (SYS-DB-DES-001)
2. Physical Data Model (SYS-DB-DES-002)
3. Database Index Design (SYS-DB-DES-003)
4. Database Partition Design (SYS-DB-DES-004)
5. Database Backup Strategy (SYS-DB-DES-005)
6. Database Design Review Record (SYS-DB-DES-006)

### Dictionary Documents (3)
1. System Data Dictionary (SYS-DB-DICT-001)
2. Business Data Dictionary (SYS-DB-DICT-002)
3. Data Dictionary Review Record (SYS-DB-DICT-003)

### Review Documents (5)
1. Database Review Notice (SYS-DB-REV-001)
2. Review Meeting Agenda (SYS-DB-REV-002)
3. Database Review Report (SYS-DB-REV-003)
4. Review Meeting Record (SYS-DB-REV-004)
5. Database Baseline (SYS-DB-REV-005)

## Checklist

### Logical Design
- [ ] All entities have primary keys
- [ ] All entities have audit fields
- [ ] Naming follows conventions
- [ ] Relationships are clearly defined
- [ ] ER diagram is complete
- [ ] Business rules are documented

### Physical Design
- [ ] All tables have primary keys
- [ ] All fields have comments
- [ ] Foreign key relationships defined
- [ ] Index design is reasonable
- [ ] Partition strategy is appropriate (if needed)
- [ ] Backup strategy is complete

### Data Dictionary
- [ ] All tables have dictionary entries
- [ ] All fields have descriptions
- [ ] Enum values are defined
- [ ] Business rules are explained

### SQL Scripts
- [ ] DDL scripts are executable
- [ ] DML scripts have complete data
- [ ] DCL scripts have correct permissions
- [ ] Migration scripts follow standards

## Roles and Responsibilities

| Role | Responsibility |
|------|----------------|
| Database Architect | Database design, documentation, review presentation |
| Technical Lead | Technical review, approval signature |
| System Architect | Architecture review, design confirmation |
| Backend Lead | Technical feasibility review |
| DevOps Engineer | Operations feasibility review, backup strategy confirmation |
| Project Manager | Process management, baseline establishment |
