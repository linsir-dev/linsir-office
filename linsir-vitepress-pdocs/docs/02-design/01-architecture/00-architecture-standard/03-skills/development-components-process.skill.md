# Development Components Process

**Description:** Guides the development components design process including frontend components (UI components, business components) and backend components (response wrapper, exception handling, validation, logging). Invoke when user needs to design reusable components, create component specifications, or plan component architecture.

**Version:** 1.0

---

## Overview

This skill guides the systematic design of development components, including frontend component design (based on Element Plus) and backend component design (based on Spring Boot), ensuring component consistency, reusability, and maintainability.

## When to Invoke

- User needs to design frontend UI components
- User needs to design frontend business components
- User needs to design backend common components
- User needs to create component design documents
- User needs to select and evaluate component libraries
- User needs to define component design standards

## Process Steps

### Step 1: Component Library Selection

**Objective**: Determine which open-source/commercial components to use for encapsulation and extension

**Activities**:

1. **Frontend Component Selection**
   - UI component library selection (Element Plus, Ant Design Vue, etc.)
   - Utility library selection (VueUse, Lodash, etc.)
   - Icon library selection
   - Date processing library selection

2. **Backend Component Selection**
   - Web framework selection (Spring Boot)
   - ORM framework selection (MyBatis Plus)
   - Security framework selection (Spring Security)
   - Connection pool selection (Druid)
   - API documentation tool selection (Knife4j)

3. **Encapsulation Strategy**
   - Frontend: inheritance extension, composition encapsulation, theme customization
   - Backend: Starter encapsulation, auto-configuration, annotation-driven

**Deliverables**:
- Component Selection List
- Encapsulation Strategy Document

**Acceptance Criteria**:
- [√] Component selection meets project requirements
- [√] Open-source components have active communities
- [√] Encapsulation strategy is clear and feasible

---

### Step 2: Frontend Component Design

**Objective**: Design frontend base UI components and business components

**Activities**:

1. **Base UI Component Design**
   - SysButton: Permission button with permission control and confirmation dialog
   - SysTable: Data table with pagination, sorting, filtering, permission control
   - SysForm: Dynamic form supporting multiple component types
   - SysSelect: Dropdown selection supporting dictionary and remote search
   - SysDialog: Dialog supporting fullscreen, drag, and responsive

2. **Business Component Design**
   - SysDeptTree: Department tree with lazy loading and multi-selection
   - SysUserSelect: User selector with remote search and department filtering
   - SysRoleSelect: Role selector
   - SysMenuTree: Menu tree for permission assignment
   - SysDictSelect: Dictionary selection with auto-loading
   - SysUpload: File upload supporting multiple files and image preview
   - SysIconSelect: Icon selector
   - SysPermissionMatrix: Permission matrix for role permission assignment

3. **Component Specification**
   - Naming: PascalCase
   - Styling: SCSS + BEM
   - Documentation: Props/Events/Slots

**Deliverables**:
- Frontend Component Design Document
- Component API Documentation
- Component Usage Examples

**Acceptance Criteria**:
- [√] Components have complete functionality
- [√] API design is reasonable
- [√] Documentation is clear and complete

---

### Step 3: Backend Component Design

**Objective**: Design backend common components and utilities

**Activities**:

1. **Unified Response Wrapper**
   - Result response object: unified response format
   - ResultCode status codes: business status code definitions
   - PageResult pagination: pagination data wrapper

2. **Global Exception Handling**
   - Exception hierarchy: BusinessException, ValidationException, etc.
   - Global exception handler: unified exception handling
   - Exception logging: different log levels

3. **Data Validation Components**
   - Custom validation annotations: @Phone, @IdCard, @EnumValue
   - Validation utility: ValidationUtils

4. **Logging Components**
   - @OperationLog annotation: operation logging
   - Operation log aspect: AOP implementation
   - Async log saving: performance optimization

5. **Utility Components**
   - SecurityUtils: security utilities
   - IpUtils: IP address utilities

**Deliverables**:
- Backend Component Design Document
- Component Source Code
- Component Usage Documentation

**Acceptance Criteria**:
- [√] Components have complete functionality
- [√] Code quality is high
- [√] Documentation is clear and complete

---

### Step 4: Component Review

**Objective**: Review component design results to ensure design quality

**Activities**:

1. **Frontend Component Review**
   - Base UI component review
   - Business component review
   - Component specification review

2. **Backend Component Review**
   - Unified response review
   - Exception handling review
   - Validation component review
   - Logging component review
   - Utility component review
   - Code specification review

3. **Issue Resolution**
   - Record review comments
   - Develop modification plan
   - Complete document revision

**Deliverables**:
- Development Components Review Record
- Revised Design Documents

**Acceptance Criteria**:
- [√] Review comments are fully recorded
- [√] All issues are resolved
- [√] Documents are formally approved

---

## Key Templates

### Component Selection Template

| Component Type | Open Source | Version | Purpose |
|---------------|-------------|---------|---------|
| UI Library | Element Plus | 2.5.x | Base UI components |
| ORM Framework | MyBatis Plus | 3.5.x | Data access layer |
| Connection Pool | Druid | 1.2.x | Database connection pool |
| API Docs | Knife4j | 4.4.x | API documentation |

### Frontend Component Template

```vue
<template>
  <el-button :type="type" @click="handleClick">
    <slot />
  </el-button>
</template>

<script setup>
const props = defineProps({
  type: { type: String, default: 'default' },
  permission: { type: String, default: '' }
})
const emit = defineEmits(['click'])
</script>
```

### Backend Component Template

```java
@Data
@Builder
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    
    public static <T> Result<T> success(T data) {
        return Result.<T>builder()
                .code(200)
                .message("success")
                .data(data)
                .build();
    }
}
```

---

## Output Files

| No. | File Name | File Code | Description |
|-----|-----------|-----------|-------------|
| 1 | Frontend Components Design | SYS-DES-ARCH-COMP-001 | Frontend component specs |
| 2 | Backend Components Design | SYS-DES-ARCH-COMP-002 | Backend component specs |
| 3 | Components Review Record | SYS-DES-ARCH-COMP-REV-001 | Review results |
