---
name: "security-architecture-process"
description: "Guides the security architecture design process including authentication/authorization, data encryption, transmission security, audit logging, and key management. Invoke when user needs to design security architecture, implement JWT/OAuth2, or plan data protection strategies."
---

# Security Architecture Design Process

This skill guides the security architecture design process for System platform and similar projects.

## When to Invoke

- User needs to design security architecture
- User wants to implement JWT/OAuth2 authentication
- User requires data encryption solutions
- User needs to plan audit logging
- User wants to design RBAC permission model
- User needs key management solutions

## Design Process

### Phase 1: Authentication Architecture

1. **JWT Token Design**
   - Access Token: 2-hour expiration, memory storage
   - Refresh Token: 30-day expiration, HttpOnly Cookie
   - Token Payload: userId, username, tenantId, roles, permissions

2. **Token Storage Strategy**
   - Access Token: Pinia/Vuex memory storage
   - Refresh Token: HttpOnly + Secure + SameSite=Strict Cookie
   - Permission info: sessionStorage temporary cache

3. **Frontend Token Security**
   - Axios request interceptor auto-adds Token
   - 401 auto-refresh Token with request queue for concurrency
   - XSS protection (HTML escaping, URL sanitization)
   - Page visibility listener (clear sensitive data after inactivity)

4. **Multi-tenancy Support**
   - X-Tenant-Id header for tenant identification
   - Backend interceptor auto-parses tenant context

**Deliverables**:
- JWT Token design document
- Frontend token management code
- Token refresh flow diagram

### Phase 2: Authorization Architecture

1. **RBAC Model Design**
   - User-Role-Permission three-level model
   - User table, Role table, Permission table, association tables

2. **Permission Granularity**
   - Menu permission: Control page menu display
   - Button permission: Control operation button display
   - API permission: Control API access
   - Data permission: Control data scope (ALL/DEPT/SELF)

3. **Permission Annotations**
   - @RequireLogin: Require authentication
   - @RequireRole: Require role
   - @RequirePermission: Require permission
   - @DataPermission: Data scope permission

4. **Data Permission Implementation**
   - MyBatis Plus interceptor auto-adds data scope filter
   - Supports: ALL, DEPT_ONLY, DEPT_AND_CHILD, SELF_ONLY

**Deliverables**:
- RBAC permission model diagram
- Permission annotation code
- Data permission interceptor

### Phase 3: Transmission Security

1. **TLS 1.3 Configuration**
   - Nginx SSL configuration
   - Force HTTPS redirect
   - HSTS response header

2. **Certificate Management**
   - Let's Encrypt automatic certificates
   - cert-manager auto-renewal
   - Certificate monitoring alerts

3. **Security Response Headers**
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - X-XSS-Protection: 1; mode=block
   - Content-Security-Policy

**Deliverables**:
- Nginx SSL configuration
- Certificate management configuration
- Security response headers configuration

### Phase 4: Data Security

1. **Database Encryption**
   - MySQL TDE transparent data encryption
   - Column-level encryption (AES-256-GCM)
   - @Encrypted annotation for auto encrypt/decrypt

2. **Data Masking**
   - Phone: 138****8888
   - Email: z***@linsir.com
   - ID Card: 110101********1234
   - @Masked annotation for auto masking

3. **Key Management**
   - HashiCorp Vault key storage
   - Key caching (Redis, 1-hour TTL)
   - Key rotation mechanism

4. **Data Classification**
   - Public: No protection needed
   - Internal: Authentication required
   - Sensitive: Authorization + encryption required
   - Confidential: Strict authorization + HSM

**Deliverables**:
- Database encryption solution
- Masking rules configuration
- Key management solution

### Phase 5: Audit Logging

1. **Operation Logs**
   - @OperationLog annotation
   - AOP interceptor records operations
   - Log: module, type, user, IP, params, result

2. **Data Change Logs**
   - MyBatis Plus interceptor
   - Log: table name, change type, old data, new data, diff

3. **Login Logs**
   - Log: user, IP, location, UA, status
   - Login failure alerts

4. **Log Storage**
   - MySQL structured storage
   - ELK full-text search
   - Regular archiving and cleanup

**Deliverables**:
- Audit log table schema
- Log annotation code
- Log query interface

### Phase 6: Architecture Review

1. **Review Preparation**
   - Organize review meeting
   - Distribute review materials
   - Identify reviewers

2. **Review Execution**
   - Authentication/authorization review
   - Data security review
   - Transmission security review
   - Audit logging review

3. **Issue Tracking**
   - Document review issues
   - Create remediation plan
   - Verify fixes

4. **Review Conclusion**
   - Review decision (pass/fail)
   - Sign-off

**Deliverables**:
- Security architecture review record
- Issue tracking sheet
- Review sign-off sheet

## Key Design Checklist

### Authentication
- [ ] JWT dual-token design (Access + Refresh)
- [ ] Token storage strategy (memory + HttpOnly Cookie)
- [ ] Frontend token security code
- [ ] Multi-tenancy support (X-Tenant-Id header)

### Authorization
- [ ] RBAC model design
- [ ] Four-level permission granularity
- [ ] Data permission interceptor
- [ ] SSO single sign-on

### Data Security
- [ ] TLS 1.3 configuration
- [ ] Certificate auto-renewal
- [ ] Column-level encryption
- [ ] Data masking rules
- [ ] Three types of audit logs
- [ ] Key management (Vault)

## Common Pitfalls to Avoid

1. **Token Storage in localStorage**
   - ❌ Vulnerable to XSS attacks
   - ✅ Access Token in memory, Refresh Token in HttpOnly Cookie

2. **Single Token Mechanism**
   - ❌ Token expiration requires re-login
   - ✅ Dual-token mechanism, refresh with Refresh Token

3. **Plaintext Sensitive Data**
   - ❌ Store phone/ID card in plaintext
   - ✅ Column-level AES encryption

4. **No Audit Logs**
   - ❌ Cannot trace data operations
   - ✅ Complete operation/data change/login logs

## Document Templates

### Authentication Architecture Template
```markdown
# Authentication Architecture Design

## 1. Overview
## 2. Architecture Overview
## 3. Authentication Design
## 4. Authorization Design
## 5. SSO Architecture
## 6. Frontend Token Security
## 7. Backend Security
## 8. API Security
```

### Data Security Architecture Template
```markdown
# Data Security Architecture Design

## 1. Overview
## 2. Security Overview
## 3. Transmission Security
## 4. Storage Encryption
## 5. Data Masking
## 6. Audit Logging
## 7. Key Management
## 8. Data Classification
```
