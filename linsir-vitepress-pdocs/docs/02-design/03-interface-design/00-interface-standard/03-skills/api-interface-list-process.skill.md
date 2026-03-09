---
name: "api-interface-list-process"
description: "Guides the API interface list compilation process including business module identification, functional point analysis, interface design, documentation creation, and review. Invoke when user needs to create API interface lists, compile system API inventories, or establish interface baselines."
---

# API接口清单编制流程

## Overview

This skill guides the complete process of compiling an API interface list for a system, ensuring all APIs are documented, standardized, and ready for development.

## When to Invoke

- Creating API interface lists for new systems
- Documenting existing system APIs
- Updating interface lists during version upgrades
- Establishing interface baselines
- Preparing interface documentation for development teams

## Process Steps

### Step 1: Requirements Analysis Confirmation

**Prerequisites:**
- Business Requirements Document (BRD) reviewed and approved
- Functional specifications available
- User roles and permissions defined

**Activities:**
1. Review business requirements
2. Confirm functional module boundaries
3. Validate user role definitions

**Deliverable:** Requirements Analysis Confirmation

---

### Step 2: Identify Business Modules

**Module Code Standards:**

| Module Name | Code | Base Path | Description |
|------------|------|-----------|-------------|
| User Management | USER | `/api/v1/users` | User CRUD, status management |
| Role & Permission | ROLE | `/api/v1/roles` | Role and permission management |
| Organization | ORG | `/api/v1/orgs` | Department and position management |
| System Management | SYS | `/api/v1/sys` | Auth, dictionary, logs |

**Activities:**
1. Identify core business modules from system architecture
2. Assign module codes
3. Define module dependencies

**Deliverable:** Business Module List

---

### Step 3: Analyze Functional Points

**Template:**

```markdown
### Module: [Module Name]

| Function Point | Operation Type | Business Rules |
|---------------|----------------|----------------|
| User Management | CRUD | Support batch operations |
| User Status | Update | Enable/Disable |
| Password Management | Update | Reset/Change password |
```

**Activities:**
1. Analyze functional points for each module
2. Identify CRUD operations
3. Identify special business operations

**Deliverable:** Functional Points List

---

### Step 4: Design Interface List

**HTTP Method Standards:**

| Function Type | HTTP Method | Path Example | Description |
|--------------|-------------|--------------|-------------|
| List Query | GET | `/users` | Support pagination, filtering |
| Create Resource | POST | `/users` | Request body contains data |
| Query Detail | GET | `/users/{id}` | Path parameter for ID |
| Update Resource | PUT | `/users/{id}` | Full update |
| Partial Update | PATCH | `/users/{id}` | Partial field update |
| Delete Resource | DELETE | `/users/{id}` | Physical/Logical delete |
| Business Operation | POST | `/users/{id}/enable` | Specific business action |

**Permission Code Standards:**

Format: `{module}:{action}`

| Action | Permission Code | Description |
|--------|----------------|-------------|
| Read | `user:read` | Read permission |
| Create | `user:create` | Create permission |
| Update | `user:update` | Update permission |
| Delete | `user:delete` | Delete permission |
| All | `user:*` | All permissions |

**Activities:**
1. Design API interfaces for each functional point
2. Determine HTTP methods
3. Design interface paths
4. Define permission codes

**Deliverable:** Interface Design Draft

---

### Step 5: Compile Interface List Document

**Document Structure:**

```markdown
# API Interface List

## 1. Overview
- Document purpose
- Interface statistics
- Interface standards

## 2. Interface Inventory
### 2.1 [Module Name]
| No. | Interface Name | Method | Path | Description | Detail Doc |

## 3. Interface Dependencies
## 4. Permission Mapping
## 5. Version Planning
## 6. Related Documents
## 7. Revision History
```

**Activities:**
1. Create interface list document
2. Populate interface inventory table
3. Document dependencies and permissions

**Deliverable:** `01-api-interface-list.md`

---

### Step 6: Internal Review

**Review Checklist:**

| No. | Review Item | Check Content |
|-----|-------------|---------------|
| 1 | Interface Completeness | Cover all functional points |
| 2 | Interface Standardization | Follow RESTful standards |
| 3 | Naming Consistency | Unified URL naming |
| 4 | Permission Design | Standard permission codes |
| 5 | Version Planning | Reasonable version strategy |

**Activities:**
1. Conduct internal review
2. Record review comments
3. Revise if needed

**Deliverable:** Internal Review Record

---

### Step 7: Formal Review

**Review Agenda:**
1. Interface list overview (10 min)
2. Module-by-module review (30 min)
3. Issue discussion (15 min)
4. Review conclusion (5 min)

**Review Conclusions:**
- **Approved**: Establish interface baseline
- **Conditional**: Fix specified issues, then baseline
- **Rejected**: Redesign and re-review

**Activities:**
1. Schedule formal review meeting
2. Present interface design
3. Collect feedback
4. Reach review conclusion

**Deliverable:** Interface Review Report with Signatures

---

### Step 8: Establish Interface Baseline

**Baseline Content:**
1. Baseline version number
2. Baseline date
3. Included interface list
4. Signature confirmation records

**Activities:**
1. Create baseline document
2. Archive in configuration management
3. Communicate to development teams

**Deliverable:** Interface Baseline Document

---

## Quality Standards

### Interface Coverage
- Functional point coverage: 100%
- Business scenario coverage: ≥95%

### Interface Standardization
- RESTful standard compliance: 100%
- Naming standard compliance: 100%
- Permission code standard compliance: 100%

### Documentation Quality
- Documentation completeness: 100%
- Review pass rate: 100%

---

## Role Responsibilities

| Role | Responsibilities |
|------|-----------------|
| System Architect | Lead interface list compilation, design standards, organize reviews |
| Business Analyst | Provide business requirements, assist functional analysis |
| Backend Architect | Review interface feasibility, confirm technical implementation |
| Frontend Lead | Review interface usability, confirm frontend integration |
| Technical Director | Host formal review, approve interface baseline |

---

## Related Processes

- Interface Standard Process
- Interface Detailed Design Process
- Interface Review Process
