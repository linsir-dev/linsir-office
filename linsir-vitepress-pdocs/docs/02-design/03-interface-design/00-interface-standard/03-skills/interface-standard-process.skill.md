---
name: "interface-standard-process"
description: "Guides the interface standard specification process including RESTful API design, security standards, and version management. Invoke when user needs to create interface standards, API design specifications, or interface security/version management documents."
---

# Interface Standard Process

This skill guides the complete process of creating and establishing interface standard specifications for System platform.

## Overview

The interface standard process includes:
1. RESTful API Design Standard
2. Interface Security Standard
3. Interface Version Management Standard

## When to Invoke

Invoke this skill when:
- User needs to create interface standard specifications
- User asks for RESTful API design guidelines
- User needs interface security standards
- User needs version management standards
- User asks to establish API design standards

## Process Steps

### Step 1: Requirements Analysis

**Input**: Business requirements, architecture design, industry best practices
**Output**: Interface standard requirements list

**Tasks**:
- Analyze business interface requirements
- Research industry RESTful API standards
- Identify security requirements
- Determine version management strategy
- Form standard requirements list

### Step 2: Create RESTful API Design Standard

**Document**: `01-restful-api-standard.md`

**Content Structure**:
1. Overview
2. URL Design Standards
   - Base path format: `/api/v{version}/{resource}`
   - Resource naming: plural nouns, lowercase, hyphen-separated
3. HTTP Method Standards
   - GET: Query resources
   - POST: Create resources
   - PUT: Full update
   - PATCH: Partial update
   - DELETE: Delete resources
4. Request Standards
   - Headers: Content-Type, Authorization
   - Parameters: path, query, body
5. Response Standards
   - Unified format: `{code, message, data, timestamp}`
   - Success/error examples
6. Status Code Standards
   - HTTP status codes
   - Business status codes
7. Pagination Standards
8. Sorting Standards
9. Batch Operation Standards
10. File Upload Standards

### Step 3: Create Interface Security Standard

**Document**: `02-interface-security-standard.md`

**Content Structure**:
1. Overview
2. Authentication Mechanism
   - JWT Token structure
   - Token validity: Access Token (2h), Refresh Token (7d)
   - Token refresh mechanism
3. Request Signature
   - HMAC-SHA256 algorithm
   - Signature parameters: appId, timestamp, nonce, signature
4. Replay Attack Prevention
   - Timestamp validation (5 min tolerance)
   - Nonce mechanism
5. Rate Limiting
   - Dimensions: global, API, user, IP
   - Algorithm: Token Bucket
6. Data Encryption
   - HTTPS/TLS for transmission
   - AES-256 for sensitive data
7. Security Headers
   - HSTS, CORS, XSS protection
8. Input Validation
   - Parameter validation rules
   - SQL injection prevention
   - XSS prevention
9. Log Audit
10. Security Testing

### Step 4: Create Interface Version Management Standard

**Document**: `03-interface-version-management-standard.md`

**Content Structure**:
1. Overview
2. Version Number Standards
   - Semantic versioning: MAJOR.MINOR.PATCH
   - API version format: v{MAJOR}
3. Version Control Strategies
   - URL path version (recommended): `/api/v1/users`
   - Header version (alternative)
4. Version Evolution Strategy
   - Backward compatible changes
   - Incompatible changes
   - Deprecation process
5. Version Compatibility
   - Compatibility matrix
   - Multi-version support
6. Version Documentation
   - Change logs
   - Migration guides
7. Version Implementation
   - Backend: Spring Boot multi-version controllers
   - Frontend: Version adapter layer
8. Version Monitoring

### Step 5: Integration and Review

**Tasks**:
- Unify document format and style
- Check cross-document references
- Ensure terminology consistency
- Internal review by architects
- Security review by security engineer
- Formal review meeting

### Step 6: Sign-off and Baseline

**Sign-off Roles**:
- Technical Director
- System Architect
- Backend Architect
- Frontend Lead
- Security Engineer

**Deliverables**:
- Signed standard documents
- Baseline established
- Published to documentation center

## Document Templates

### RESTful API Design Standard Template

```markdown
# RESTful API Design Standard

> **Doc ID**: SYS-INT-STD-001
> **Version**: 1.0
> **Status**: In Progress

## 1. Overview
...

## 2. URL Design Standards
...

## 3. HTTP Method Standards
...

## 4. Request Standards
...

## 5. Response Standards
...

## 6. Status Code Standards
...

## 7. Revision History
...
```

### Interface Security Standard Template

```markdown
# Interface Security Standard

> **Doc ID**: SYS-INT-STD-002
> **Version**: 1.0
> **Status**: In Progress

## 1. Overview
...

## 2. Authentication Mechanism
...

## 3. Request Signature
...

## 4. Rate Limiting
...

## 5. Data Encryption
...

## 6. Revision History
...
```

### Interface Version Management Standard Template

```markdown
# Interface Version Management Standard

> **Doc ID**: SYS-INT-STD-003
> **Version**: 1.0
> **Status**: In Progress

## 1. Overview
...

## 2. Version Number Standards
...

## 3. Version Control Strategies
...

## 4. Version Evolution Strategy
...

## 5. Version Compatibility
...

## 6. Revision History
...
```

## Checklist

### RESTful API Design Checklist
- [ ] URL design follows RESTful standards
- [ ] HTTP methods used correctly
- [ ] Request/response format unified
- [ ] Status codes defined completely
- [ ] Pagination and sorting specified
- [ ] Examples provided

### Interface Security Checklist
- [ ] JWT authentication mechanism complete
- [ ] Request signature algorithm standard
- [ ] Replay prevention effective
- [ ] Rate limiting reasonable
- [ ] Encryption scheme secure
- [ ] Security headers complete

### Version Management Checklist
- [ ] Version number standard clear
- [ ] Version control strategy feasible
- [ ] Compatibility strategy defined
- [ ] Deprecation process complete
- [ ] Migration guide detailed
- [ ] Implementation feasible

## Related Documents

- Interface Design Checklist
- API Interface List
- Security Architecture Design
- System Architecture Design
