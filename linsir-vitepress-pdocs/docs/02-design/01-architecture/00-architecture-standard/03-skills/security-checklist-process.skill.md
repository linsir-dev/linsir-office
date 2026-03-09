# Security Checklist Process

**Description:** Guides the security checklist compilation process including authentication security, authorization security, data security, and level 3 compliance checklist. Invoke when user needs to create security checklists, evaluate security requirements, or ensure compliance with security standards.

**Version:** 1.0

---

## Overview

This skill guides the systematic compilation of security checklists, ensuring authentication security, authorization security, data security, and level 3 compliance requirements are met, providing unified guidance documents for project security construction.

## When to Invoke

- User needs to create security checklists
- User wants to evaluate security requirements
- User needs to ensure compliance with security standards
- User requires authentication/authorization/data security documentation
- User needs to prepare for level 3 compliance assessment

## Process Steps

### Step 1: Authentication Security Checklist Compilation

**Objective**: Compile authentication security checklist to ensure user identity authentication security

**Activities**:

1. **Password Policy Definition**
   - Define password complexity requirements (8-20 characters, uppercase+lowercase+digits+special)
   - Define password expiration policy (90 days mandatory change)
   - Define password history policy (cannot match last 5 passwords)
   - Determine password storage method (bcrypt, work factor 10-12)

2. **Login Security Mechanism Design**
   - Design login failure lockout mechanism (5 failures lock for 30 minutes)
   - Design session management mechanism (30-minute timeout, session fixation protection)
   - Design login logging (time, IP, result, device info)

3. **Multi-Factor Authentication (MFA) Design**
   - Determine MFA trigger scenarios (admin login, sensitive operations, new device)
   - Select MFA methods (SMS verification, email verification, TOTP)
   - Design backup code mechanism

4. **Token Security Design**
   - Select JWT signing algorithm (HS256 or RS256)
   - Define token expiration (access token 2 hours, refresh token 7 days)
   - Design token revocation mechanism (blacklist)

5. **CAPTCHA Security Design**
   - Design graphic CAPTCHA (4-6 digits, 5 minutes valid)
   - Define CAPTCHA usage scenarios (login, registration, password recovery)

**Deliverables**:
- Authentication Security Checklist Document

**Acceptance Criteria**:
- [√] Password policy meets level 3 compliance requirements
- [√] Login security mechanism is complete
- [√] MFA supports multiple methods
- [√] Token security configuration is reasonable
- [√] CAPTCHA mechanism is effective

---

### Step 2: Authorization Security Checklist Compilation

**Objective**: Compile authorization security checklist to ensure access control security

**Activities**:

1. **RBAC Model Design**
   - Define core entities (User, Role, Permission, Resource)
   - Design entity relationships (User-Role-Permission-Resource)
   - Determine permission types (Menu, Button, API, Data)

2. **Permission Control Implementation Design**
   - Design frontend permission control (menu rendering, button display, route guards)
   - Design backend permission control (method-level authorization, URL-level authorization)
   - Design data permission control (data scope interception)

3. **Data Permission Scope Definition**
   - Define data permission levels (All, Department and sub-departments, Department only, Self only, Custom)
   - Design data permission implementation (MyBatis Plus interceptor)

4. **Sensitive Operation Control Design**
   - Define sensitive operation types (Delete, Modify admin, Modify permissions, Export)
   - Design secondary confirmation mechanism (dialog confirmation, password verification)
   - Design operation audit mechanism

5. **Least Privilege Principle Implementation**
   - Design default deny policy
   - Design permission review mechanism

**Deliverables**:
- Authorization Security Checklist Document

**Acceptance Criteria**:
- [√] RBAC model design is complete
- [√] Permission control granularity is reasonable
- [√] Data permission scope is clear
- [√] Sensitive operations have secondary confirmation
- [√] Least privilege principle is satisfied

---

### Step 3: Data Security Checklist Compilation

**Objective**: Compile data security checklist to ensure data security during transmission, storage, and processing

**Activities**:

1. **Transmission Security Design**
   - Configure TLS 1.2+ encrypted transmission
   - Enable HSTS (HTTP Strict Transport Security)
   - Configure certificate management (valid certificates, trusted CA)

2. **Storage Security Design**
   - Design password storage solution (bcrypt hashing)
   - Design sensitive field encryption solution (AES-256-GCM)
   - Configure database SSL connection
   - Implement database account least privilege

3. **Data Masking Design**
   - Define masking rules (mobile, ID card, bank card, email, name, address)
   - Design masking scenarios (list display, detail view, data export, log recording)
   - Implement masking annotations

4. **Data Backup Strategy Design**
   - Formulate backup strategy (full weekly, incremental daily, log real-time)
   - Design backup encryption solution
   - Design offsite backup solution
   - Formulate recovery test plan

5. **Key Management Design**
   - Design key lifecycle (generation, storage, usage, rotation, destruction)
   - Select key management system (KMS, HashiCorp Vault)
   - Define key classification (database encryption key, JWT signing key, API signing key, backup encryption key)

6. **Data Destruction Design**
   - Design data destruction strategy (logical deletion + physical deletion)
   - Define destruction timing (30 days after user logout, temporary data expiration)

**Deliverables**:
- Data Security Checklist Document

**Acceptance Criteria**:
- [√] Transmission encryption configuration is complete
- [√] Storage encryption strategy is reasonable
- [√] Data masking rules are comprehensive
- [√] Backup strategy is recoverable
- [√] Key management is secure

---

### Step 4: Level 3 Compliance Checklist Compilation

**Objective**: Compile level 3 compliance checklist to ensure level 3 compliance requirements are met

**Activities**:

1. **Secure Computing Environment Compliance Analysis**
   - Analyze identity authentication requirements (S3A1)
   - Analyze access control requirements (S3A2)
   - Analyze security audit requirements (S3A3)
   - Analyze intrusion prevention requirements (S3A4)
   - Analyze data integrity requirements (S3A5)
   - Analyze data confidentiality requirements (S3A6)
   - Analyze data backup recovery requirements (S3A7)
   - Analyze residual information protection requirements (S3A8)
   - Analyze personal information protection requirements (S3A9)

2. **Secure Area Boundary Compliance Analysis**
   - Analyze boundary protection requirements (S3B1)
   - Analyze boundary access control requirements (S3B2)
   - Analyze boundary intrusion prevention requirements (S3B3)
   - Analyze malicious code prevention requirements (S3B4)
   - Analyze boundary security audit requirements (S3B5)

3. **Secure Communication Network Compliance Analysis**
   - Analyze communication transmission requirements (S3C1)
   - Analyze trusted verification requirements (S3C2)

4. **Security Management Center Compliance Analysis**
   - Analyze system management requirements (S3D1) - Three-role management
   - Analyze audit management requirements (S3D2)
   - Analyze security management requirements (S3D3)
   - Analyze centralized control requirements (S3D4)

5. **Management Requirements Compliance Analysis**
   - Analyze security management system requirements
   - Analyze security management organization requirements
   - Analyze security management personnel requirements
   - Analyze security construction management requirements
   - Analyze security operation management requirements

6. **Assessment Preparation**
   - Prepare assessment material list (classification report, filing certificate, security plan, etc.)
   - Prepare technical assessment (identity authentication, access control, security audit, etc.)

**Deliverables**:
- Level 3 Compliance Checklist Document

**Acceptance Criteria**:
- [√] Cover all technical requirements (S3A, S3B, S3C, S3D)
- [√] Cover all management requirements
- [√] Each control point has specific implementation plan
- [√] Assessment materials are fully prepared

---

### Step 5: Security Checklist Review

**Objective**: Review security checklists to ensure security requirements are met

**Activities**:

1. **Review Preparation**
   - Organize review meeting
   - Invite security experts, level 3 assessors, technical leads
   - Prepare review materials

2. **Review Execution**
   - Authentication security checklist review
   - Authorization security checklist review
   - Data security checklist review
   - Level 3 compliance checklist review

3. **Issue Recording and Resolution**
   - Record review comments
   - Develop modification plan
   - Complete document revision

**Deliverables**:
- Security Checklist Review Record

**Acceptance Criteria**:
- [√] Review comments are fully recorded
- [√] All issues are resolved
- [√] Document is formally approved

---

## Key Templates

### Security Checklist Template

```markdown
# XX Security Checklist

> **Document Code**: SYS-SEC-XXX-001  
> **Version**: 1.0  
> **Created Date**: YYYY-MM-DD  
> **Author**: Security Architect  
> **Status**: ⏳ Pending Review

---

## 1. Overview

### 1.1 Purpose

### 1.2 Scope

### 1.3 Reference Standards

---

## 2. Security Requirements

### 2.1 XX Requirements

| Check Item | Requirement | Implementation | Priority |
|-----------|-------------|----------------|----------|
| XXX | XXX | XXX | Required/Recommended/Optional |

---

## 3. Security Checklist

### 3.1 Development Phase Checks

- [ ] XXX

### 3.2 Testing Phase Checks

- [ ] XXX

### 3.3 Deployment Phase Checks

- [ ] XXX

---

## 4. Compliance Requirements

### 4.1 Level 3 Compliance Requirements

| Control Point | Requirement | Implementation |
|--------------|-------------|----------------|
| S3X1-XXX | XXX | XXX |

---

## 5. Review Record

### 5.1 Review Comments

| No. | Review Item | Review Comment | Review Result |
|-----|-------------|----------------|---------------|
| 1 | XXX | XXX | Pending Review |

### 5.2 Review Conclusion

**Review Result**: ⏳ Pending Review

**Review Date**: 

**Reviewers**:
- Security Expert: _________________ (Signature)
- Technical Lead: _________________ (Signature)

---

## 6. Revision History

| Version | Date | Author | Change Content |
|---------|------|--------|----------------|
| 1.0 | YYYY-MM-DD | Security Architect | Initial version |
```

---

## Output Files

| No. | File Name | File Code | Description |
|-----|-----------|-----------|-------------|
| 1 | Authentication Security Checklist | SYS-SEC-AUTH-001 | Identity authentication security |
| 2 | Authorization Security Checklist | SYS-SEC-AUTHZ-001 | Access control security |
| 3 | Data Security Checklist | SYS-SEC-DATA-001 | Data protection security |
| 4 | Level 3 Compliance Checklist | SYS-SEC-COMP-001 | Level 3 compliance requirements |
| 5 | Security Checklist Review Record | SYS-SEC-REV-001 | Review results |
