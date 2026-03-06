---
name: "architecture-research-process"
description: "Guides the architecture research process to determine system architecture direction, including architecture pattern selection, layered design, communication scheme, data flow, security architecture, and deployment architecture. Invoke when user needs to conduct architecture research, create architecture design documents, or determine system architecture direction."
---

# Architecture Research Process

This skill guides users through the complete architecture research process, from requirement analysis to final architecture documentation.

## When to Use

Invoke this skill when:
- User needs to conduct architecture research for a project
- User asks to create architecture design documents
- User needs to determine system architecture direction
- User wants to compare architecture patterns (monolithic vs microservices)
- User needs to design layered architecture
- User asks about communication schemes or data flow design

## Process Overview

The architecture research process consists of 9 steps:

```
1. Analyze Requirements Constraints
2. Determine Architecture Pattern
3. Design Layered Architecture
4. Design Communication Scheme
5. Design Data Flow
6. Design Security Architecture
7. Design Deployment Architecture
8. Write Research Report
9. Review and Confirm
```

## Detailed Steps

### Step 1: Analyze Requirements Constraints

**Input:** Requirements research report
**Output:** Architecture constraints checklist

**Check items:**
- Business scale (users, data volume)
- Performance requirements (concurrency, response time)
- Security requirements (compliance, data protection)
- Availability requirements (SLA, RTO/RPO)
- Integration requirements with existing systems

### Step 2: Determine Architecture Pattern

**Candidate Patterns:**

1. **Monolithic Architecture**
   - Suitable for: Small-medium systems, small teams, rapid delivery
   - Pros: Simple, easy to maintain, low cost
   - Cons: Limited scalability, technical debt accumulation

2. **Microservices Architecture**
   - Suitable for: Large systems, multiple teams, high concurrency
   - Pros: Independent deployment, technology heterogeneity, elastic scaling
   - Cons: High complexity, high operational cost

3. **Modular Monolith**
   - Suitable for: Medium systems, potential future evolution
   - Pros: Balance of simplicity and flexibility, evolvable
   - Cons: Requires good modular design

**Evaluation Dimensions:**
| Dimension | Weight | Description |
|-----------|--------|-------------|
| Business Scale Match | 25% | Whether architecture fits current business scale |
| Team Capability Match | 20% | Whether team has corresponding technical capabilities |
| Operational Cost | 20% | Operational complexity and cost |
| Scalability | 15% | Ability to scale for future business growth |
| Development Efficiency | 10% | Development efficiency and time-to-market |
| Evolution Flexibility | 10% | Possibility for future architecture evolution |

### Step 3: Design Layered Architecture

**Standard Layers:**
```
Presentation Layer    ← User Interface (Vue/React)
Access Layer          ← Gateway/Load Balancer (Nginx/Gateway)
Application Layer     ← Business Logic (Spring Boot)
Data Layer            ← Data Storage (MySQL/Redis)
```

**Design Principles:**
- Upper layers depend on lower layers, not vice versa
- Communication between layers through interfaces
- Each layer can evolve and be replaced independently

### Step 4: Design Communication Scheme

**Protocol Selection:**
| Scenario | Recommended Protocol | Description |
|----------|---------------------|-------------|
| Frontend-Backend | RESTful API + HTTPS | Standard, simple, easy to debug |
| Service Sync | RESTful/gRPC | Choose based on performance requirements |
| Service Async | Message Queue | Decoupling, peak shaving |

**Interface Standards:**
- URL pattern: `/api/{version}/{module}/{resource}/{action}`
- HTTP methods: GET/POST/PUT/DELETE
- Response format: Unified JSON format
- Authentication: JWT Token

### Step 5: Design Data Flow

**Data Layers:**
```
Data Access Layer     ← API/Import/Sync
Business Logic Layer  ← Data Processing/Validation
Data Storage Layer    ← MySQL/Redis/External Systems
```

**Caching Strategy:**
- **Cache-Aside Pattern**: Read cache first, read database on miss
- Applicable scenarios: Read-heavy, write-light
- Consistency handling: Write database first, then delete cache

### Step 6: Design Security Architecture

**Security Layers:**
```
Application Security  ← XSS/CSRF/SQL Injection Protection
Authentication        ← JWT/RBAC/Permission Control
Transport Security    ← HTTPS/TLS
Network Security      ← Firewall/VPN/Isolation
Data Security         ← Encryption/Masking/Backup
```

**Authentication Options:**
- Basic Auth: Username/Password + BCrypt encryption
- Token Auth: JWT (Access Token + Refresh Token)
- SSO: OAuth 2.0 + OIDC

**Authorization:**
- RBAC Model: User-Role-Permission
- Permission Types: Menu, Button, Data, API permissions

### Step 7: Design Deployment Architecture

**Deployment Modes:**
1. Traditional Deployment: Direct server deployment
2. Containerized Deployment: Docker + Docker Compose
3. Container Orchestration: Kubernetes (large scale)

**Environment Planning:**
| Environment | Purpose | Configuration |
|-------------|---------|---------------|
| Development | Development & Integration | Single machine |
| Testing | Functional Testing | Dual machine |
| Staging | Pre-production Validation | Same as production |
| Production | Production | Cluster |

**High Availability:**
- Application Layer: Multi-instance + Load Balancer
- Database: Master-Slave architecture
- Cache: Redis Cluster

### Step 8: Write Research Report

**Report Structure:**
1. Report Overview
2. Architecture Decision Summary
3. Overall Architecture Design
4. Architecture Design Principles
5. Key Technical Decisions
6. Architecture Risks and Mitigation
7. Next Actions
8. Related Documents

### Step 9: Review and Confirm

**Review Checklist:**
- [ ] Architecture pattern suitable for business requirements
- [ ] Layered architecture is reasonable
- [ ] Communication scheme follows standards
- [ ] Data flow is clear
- [ ] Security scheme is comprehensive
- [ ] Deployment scheme is feasible
- [ ] Risks identified with mitigation measures

## Document Templates

### Architecture Pattern Selection Document

Create document following this structure:

```markdown
# XXX Architecture Selection

**Document ID:** SYS-TR-AR-XXX
**Version:** 1.0
**Date:** YYYY-MM-DD
**Author:** System Architect
**Review:** Pending

---

## 1. Background

## 2. Candidate Solutions

### Solution 1: XXX
**Description:**
**Pros:**
**Cons:**
**Applicable Scenarios:**

## 3. Evaluation Comparison

| Dimension | Solution 1 | Solution 2 | Solution 3 | Weight |
|-----------|------------|------------|------------|--------|
| Dimension 1 | High/Med/Low | High/Med/Low | High/Med/Low | XX% |

## 4. Selection Conclusion

## 5. Detailed Design

## 6. Risks and Mitigation

## 7. Next Actions
```

## Best Practices

### Design Principles
1. **Simplicity First**: Choose the simplest solution that meets requirements
2. **Evolutionary Design**: Reserve space for architecture evolution, avoid over-design
3. **Separation of Concerns**: Clear responsibilities at each layer, avoid coupling
4. **Observability**: Consider monitoring, logging, tracing during design

### Common Pitfalls
1. **Over-engineering**: Complex design for non-existent requirements
2. **Technology-driven**: Using new technology regardless of business needs
3. **Ignoring Operations**: Only considering development, not deployment and operations
4. **Neglecting Security**: Security design lagging, high remediation cost later

## Output Checklist

- [ ] Architecture pattern selection report
- [ ] Frontend-backend separation scheme
- [ ] Data flow architecture document
- [ ] Security architecture principles
- [ ] Deployment architecture scheme
- [ ] Architecture research summary report
