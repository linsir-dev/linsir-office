# Service Design Process

**Description:** Guides the service design process including service division design and service interaction design. Invoke when user needs to design service boundaries, define service interfaces, or plan service communication mechanisms.

**Version:** 1.0

---

## Overview

This skill guides the systematic design of microservices architecture, including service division (avoiding services that are too small) and service interaction design (communication patterns, interface specifications, reliability mechanisms).

## When to Invoke

- User needs to design service boundaries and division
- User needs to define service responsibilities and interfaces
- User needs to design service communication mechanisms
- User needs to create service division design documents
- User needs to create service interaction design documents
- User needs to avoid microservices that are too small

## Process Steps

### Step 1: Service Division Design

**Objective**: Design service boundaries based on DDD principles, avoiding microservices that are too small

**Activities**:

1. **Identify Core Domain Services**
   - Analyze domain boundaries and identify core domains
   - Evaluate service granularity (avoid being too small)
   - Consider service aggregation (merging related modules)

2. **Service Aggregation Strategy**
   - Aggregate highly cohesive modules into one service
   - Consider merging modules that frequently interact
   - Merge modules with high data consistency requirements

3. **Define Service Responsibilities**
   - Define the scope of responsibilities for each service
   - Define interfaces provided by the service
   - Define dependencies between services

**Service Division Principles**:

| Principle | Description | Example |
|-----------|-------------|---------|
| Moderate Aggregation | Avoid microservices that are too small | User + Auth + Org merged into System service |
| High Cohesion | Related functions in the same service | User management and authentication in the same service |
| Low Coupling | Reduce dependencies between services | Decoupling through message queues |
| Independent Deployment | Services can be deployed and upgraded independently | Each service has independent CI/CD |

**Deliverables**:
- Service Division Design Document
- Service Architecture Diagram
- Service Responsibility Definition Table

**Acceptance Criteria**:
- [√] Number of services is moderate (recommended 5-10)
- [√] Service responsibilities are clear with no overlap
- [√] Low coupling between services

---

### Step 2: Service Interaction Design

**Objective**: Define communication patterns, interface specifications, and reliability mechanisms between services

**Activities**:

1. **Communication Pattern Selection**
   - Synchronous: REST API, Feign client
   - Asynchronous: Message queue (Redis/RabbitMQ)
   - Selection principle: Prefer asynchronous, minimize synchronous calls

2. **Interface Specification Definition**
   - URL pattern: `/api/{service}/{module}/{resource}/{action}`
   - HTTP methods: RESTful standard (GET/POST/PUT/DELETE)
   - Request headers:
     - Authorization: Bearer {token}
     - X-Tenant-Id: Tenant ID
     - X-Request-Id: Request trace ID
     - X-Idempotency-Key: Idempotency key
   - Response format: Unified Result wrapper

3. **Reliability Design**
   - Circuit breaker: Resilience4j circuit breaker
   - Idempotency: X-Idempotency-Key mechanism
   - Distributed tracing: TraceId propagation
   - Exception handling: Global exception handler

**Deliverables**:
- Service Interaction Design Document
- Interface Specification Document
- Service Call Relationship Diagram

**Acceptance Criteria**:
- [√] Communication patterns are reasonably selected
- [√] Interface specifications are unified
- [√] Reliability mechanisms are complete

---

### Step 3: Service Detailed Design

**Objective**: Detailed design of each service's module division and interface definition

**Activities**:

1. **Module Division**
   - Divide sub-modules by business function
   - Define boundaries between modules
   - Design module interfaces

2. **Interface Design**
   - Define API interfaces (path, method, parameters, response)
   - Design DTO objects
   - Define error codes

3. **Data Design**
   - Database table design
   - Cache strategy design
   - Data consistency solution

**Deliverables**:
- Service Detailed Design Document
- API Interface Document
- Database Design Document

**Acceptance Criteria**:
- [√] Module division is reasonable
- [√] Interface definitions are complete
- [√] Data design follows standards

---

### Step 4: Service Design Review

**Objective**: Review service design results to ensure design quality

**Activities**:

1. **Internal Review**
   - Architecture team review
   - Development team review
   - Operations team review

2. **Review Content**
   - Rationality of service division
   - Interface standardization
   - Reliability design
   - Performance considerations

3. **Issue Resolution**
   - Record review comments
   - Develop modification plan
   - Complete document revision

**Deliverables**:
- Service Design Review Record
- Revised Design Documents

**Acceptance Criteria**:
- [√] Review comments are fully recorded
- [√] All issues are resolved
- [√] Documents are formally approved

---

## Key Templates

### Service Responsibility Definition Table

| Service Name | Service Type | Responsibility | Modules | Dependencies |
|-------------|-------------|----------------|---------|--------------|
| System Service | Core Domain | User, Auth, Org, Permission management | User Management, Auth, Organization, Permission, Config | Gateway |
| Audit Service | Supporting Domain | Operation logs, login logs | Audit Logs | System Service |
| Notification Service | Supporting Domain | Message notifications | In-app, SMS, Email | System Service |
| File Service | Generic Domain | File storage management | File upload, download, management | System Service |

### Interface Specification Template

```yaml
Interface Name: User Login
Path: POST /api/system/auth/login
Headers:
  Content-Type: application/json
  X-Tenant-Id: {tenantId}
Request Body:
  username: string  # Username
  password: string  # Password
  captcha: string   # Captcha
  captchaKey: string # Captcha key
Response Body:
  code: 200
  message: "success"
  data:
    accessToken: string   # Access token
    refreshToken: string  # Refresh token
    expiresIn: number     # Expiration time (seconds)
    tokenType: "Bearer"
```

### Service Call Relationship Diagram

```
┌─────────────┐     REST      ┌─────────────┐
│   Gateway   │──────────────▶│   System    │
└─────────────┘               │   Service   │
       │                      └──────┬──────┘
       │                             │
       │         REST                │ REST
       │                             ▼
       │                      ┌─────────────┐
       │                      │ Other Services│
       │                      │ • Audit Service│
       │                      │ • Notification│
       │                      │ • File Service│
       │                      └─────────────┘
       │
       │         Async Message
       ▼
┌─────────────┐
│Message Queue│
│(Redis/RabbitMQ)
└─────────────┘
```

---

## Output Files

| No. | File Name | File Code | Description |
|-----|-----------|-----------|-------------|
| 1 | Service Division Design | SYS-DES-ARCH-SVC-001 | Service boundaries and responsibilities |
| 2 | Service Interaction Design | SYS-DES-ARCH-SVC-002 | Communication patterns and interface specs |
| 3 | Service Design Review Record | SYS-DES-ARCH-SVC-REV-001 | Review results and signatures |
