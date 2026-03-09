---
name: "technical-architecture-process"
description: "Guides the technical architecture design process including frontend/backend/data architecture, technology selection, and project structure design. Invoke when user needs to design technical architecture, select technology stack, or create technical architecture documentation."
---

# Technical Architecture Design Process

This skill guides the complete technical architecture design process for System platform projects.

## When to Invoke

Invoke this skill when:
- User needs to design technical architecture
- User asks to create frontend/backend/data architecture documents
- User needs technology stack selection guidance
- User asks for project structure design
- User needs to review technical architecture

## Design Process Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Technical Architecture Design Process     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Technology Selection ──▶ 2. Frontend Architecture       │
│       │                         │                          │
│       ▼                         ▼                          │
│  ┌─────────┐               ┌─────────┐                     │
│  │Frontend │               │Project  │                     │
│  │Backend  │               │Structure│                     │
│  │Data     │               │Tech Stack                      │
│  │Decision │               │State Mgmt                      │
│  └────┬────┘               │Routing  │                     │
│       │                    └────┬────┘                     │
│       │                         │                          │
│       └──────────┬──────────────┘                          │
│                  ▼                                          │
│  3. Backend Architecture ──▶ 4. Data Architecture          │
│       │                         │                          │
│       ▼                         ▼                          │
│  ┌─────────┐               ┌─────────┐                     │
│  │Service  │               │Storage  │                     │
│  │Division │               │Architecture                    │
│  │Module   │               │Database │                     │
│  │Design   │               │Cache    │                     │
│  │API Design               │ES (logs only)                  │
│  └────┬────┘               └────┬────┘                     │
│       │                         │                          │
│       └──────────┬──────────────┘                          │
│                  ▼                                          │
│  5. Architecture Review ──▶ 6. Document Delivery           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Phase 1: Technology Selection

### Frontend Technology Stack

**Framework Selection:**
- Vue 3.x (Composition API)
- TypeScript (strict mode)
- Build tool: Vite

**UI Component Library:**
- Element Plus (primary)
- Icon library: @element-plus/icons-vue

**State Management:**
- Pinia (official recommendation)
- Persist plugin: pinia-plugin-persistedstate

**HTTP Client:**
- Axios with custom interceptors

**Code Quality:**
- ESLint + Prettier
- Husky + lint-staged

### Backend Technology Stack

**Framework:**
- Spring Boot 3.2.x
- Spring Security 6.2.x
- JDK 17+

**Data Access:**
- MyBatis Plus 3.5.x
- Druid connection pool

**Cache:**
- Redis 7.x
- Redisson for distributed lock

**Search Engine:**
- Elasticsearch 8.x (logs only)

**Message Queue:**
- Kafka (optional)

**Service Governance:**
- Spring Cloud Gateway
- Nacos (config & discovery)

### Data Storage Selection

| Component | Version | Purpose | Selection Reason |
|-----------|---------|---------|------------------|
| MySQL | 8.0 | Primary data storage | Transaction support, replication |
| Redis | 7.x | Cache/Session | High performance, rich data structures |
| Elasticsearch | 8.x | Log search only | Full-text search, near real-time |
| MinIO | Latest | File storage | S3 compatible, distributed |

## Phase 2: Frontend Architecture Design

### Project Structure

```
linsir-ui/
├── apps/
│   └── linsir-web-system/        # Main application
│       ├── src/
│       │   ├── api/              # API modules
│       │   ├── assets/           # Static resources
│       │   ├── components/       # Business components
│       │   ├── composables/      # Composition functions
│       │   ├── directives/       # Custom directives
│       │   ├── layouts/          # Layout components
│       │   ├── router/           # Route configuration
│       │   ├── stores/           # Pinia stores
│       │   ├── styles/           # Global styles
│       │   ├── utils/            # Utility functions
│       │   └── views/            # Page views
│       ├── package.json
│       └── vite.config.ts
│
├── packages/
│   ├── @linsir/components/       # Component library
│   ├── @linsir/utils/            # Utility library
│   └── @linsir/api/              # API client
│
├── package.json                  # Workspace root
├── pnpm-workspace.yaml
└── turbo.json
```

### Key Design Points

1. **Monorepo Structure**: Use pnpm workspace + turbo
2. **Component Library**: Extract common components to @linsir/components
3. **API Client**: Centralized API management in @linsir/api
4. **State Management**: Pinia with persistence plugin
5. **Route Design**: Dynamic routes based on permissions

## Phase 3: Backend Architecture Design

### Project Structure

```
linsir-cloud-system/
├── linsir-server/                 # Server implementation
│   ├── linsir-server-common/      # Common modules
│   │   ├── linsir-common-core/    # Core utilities
│   │   ├── linsir-common-mybatis/ # MyBatis wrapper
│   │   ├── linsir-common-security/# Security module
│   │   ├── linsir-common-redis/   # Redis wrapper
│   │   └── linsir-common-log/     # Log module
│   │
│   ├── linsir-server-gateway/     # Gateway service
│   └── linsir-server-system/      # System service (single service)
│       ├── module/                # Business modules
│       │   ├── auth/              # Auth module
│       │   ├── user/              # User module
│       │   ├── role/              # Role/permission module
│       │   ├── dept/              # Organization module
│       │   └── config/            # Config module
│       │       ├── controller/
│       │       ├── service/
│       │       │   └── impl/
│       │       ├── mapper/
│       │       ├── entity/
│       │       └── dto/
│       ├── common/                # Module common
│       └── SystemApplication.java
│
├── linsir-api/                    # API definitions
│   └── linsir-api-system/         # System service API
│       ├── dto/
│       ├── feign/
│       ├── constants/
│       └── enums/
│
└── pom.xml
```

### Service Division Principles

**CRITICAL: Single Service Design**
- Only ONE business service: System Service
- Gateway is separate for routing/limiting
- Avoid microservice over-splitting

**Module Division Within Service:**
- auth: Authentication (login/logout/token refresh)
- user: User management
- role: Role and permission management
- dept: Organization structure
- config: System configuration

### API Module Design

**Purpose:**
- DTO/Feign interfaces for inter-service calls
- Independent versioning
- Client dependency only on API module

**Structure:**
```
linsir-api-system/
├── dto/
│   ├── auth/
│   ├── user/
│   ├── role/
│   └── dept/
├── feign/
│   └── SystemFeignClient.java
├── constants/
└── enums/
```

## Phase 4: Data Architecture Design

### Storage Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer Architecture                 │
├─────────────────────────────────────────────────────────────┤
│  Application Layer                                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   System    │ │   Config    │ │   Audit     │           │
│  │   Service   │ │   Service   │ │   Service   │           │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘           │
├─────────┼───────────────┼───────────────┼──────────────────┤
│  Cache   │               │               │                  │
│  ┌──────┴───────────────┴───────────────┴──────────────┐   │
│  │                    Redis Cluster                     │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Primary Data Layer                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  MySQL 8.0 Cluster                   │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Search Layer (Logs Only)                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Elasticsearch 8.x Cluster               │   │
│  │         ┌─────────┐ ┌─────────┐                     │   │
│  │         │Oper Logs│ │Audit Logs                     │   │
│  │         └─────────┘ └─────────┘                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Principles

**1. ES Usage - LOGS ONLY:**
- ❌ NO user search in ES
- ❌ NO business data in ES
- ✅ ONLY operation logs
- ✅ ONLY audit logs
- Business queries use MySQL + Redis

**2. Cache Key Design - SIMPLIFIED:**
- Technical architecture: Key prefix only
- Detailed key design in separate cache design document

**3. NO Table Structure:**
- Technical architecture: Design specifications only
- Detailed table structure in database design document

### Data Flow

```
MySQL ──▶ Canal ──▶ Kafka ──▶ ES/Redis

Scenarios:
1. MySQL ──▶ ES: Log retrieval only (oper logs, audit logs)
2. MySQL ──▶ Redis: Cache warm-up, data sync
3. Business ──▶ MinIO: File upload
```

## Phase 5: Architecture Review

### Review Checklist

**Frontend Architecture:**
- [ ] Technology stack selection completed
- [ ] Project structure designed
- [ ] State management designed
- [ ] Routing designed
- [ ] HTTP client wrapped
- [ ] Engineering config completed

**Backend Architecture:**
- [ ] Technology stack selected
- [ ] Project structure designed
- [ ] Service division reasonable (avoid over-splitting)
- [ ] Module division completed
- [ ] API design completed
- [ ] Common modules designed

**Data Architecture:**
- [ ] Storage architecture designed
- [ ] Database architecture designed
- [ ] Cache architecture designed
- [ ] ES usage clear (logs only)
- [ ] Data security plan completed
- [ ] Data backup plan completed
- [ ] NO table structure design

### Review Process

1. **Review Preparation**
   - Organize review meeting
   - Distribute review materials
   - Confirm reviewers

2. **Review Execution**
   - Technology stack review
   - Project structure review
   - Service division review
   - Data architecture review
   - Security review

3. **Issue Tracking**
   - Record review issues
   - Create fix plan
   - Verify fixes

4. **Review Conclusion**
   - Review decision (pass/fail)
   - Sign-off confirmation

## Phase 6: Document Delivery

### Document List

1. **Frontend Architecture Document**
   - Path: `02-technical-architecture/01-frontend-architecture.md`

2. **Backend Architecture Document**
   - Path: `02-technical-architecture/02-backend-architecture.md`

3. **Data Architecture Document**
   - Path: `02-technical-architecture/03-data-architecture.md`

4. **Review Record**
   - Path: `02-technical-architecture/04-technical-architecture-review-record.md`

### Delivery Checklist

- [ ] All architecture documents completed
- [ ] Review record signed
- [ ] Documents archived
- [ ] Checklist updated

## Key Principles Summary

### Backend Service Division

| Principle | Description | Example |
|-----------|-------------|---------|
| Single Service First | Avoid microservice over-splitting | System service includes user/auth/org |
| Module Cohesion | Divide by business module within service | auth/user/role/dept/config modules |
| API Independent | Interface definitions maintained separately | linsir-api module |
| Clear Dependencies | Clear module dependency relationships | Service → API → Common |

### Data Architecture

| Principle | Description | Example |
|-----------|-------------|---------|
| ES Logs Only | Business queries use MySQL+Redis | User search not in ES |
| Cache Simplified | Key specs simplified in tech architecture | Detailed in cache design doc |
| Data Separation | Tech architecture separate from DB design | No table structure in tech arch |
| Security First | Complete data security plan | Encryption, masking, audit |

## Common Mistakes to Avoid

1. **❌ Microservice Over-Splitting**
   - Wrong: Separate services for user/auth/org
   - Right: Single System service with modules

2. **❌ ES for Business Search**
   - Wrong: User search in ES
   - Right: ES only for logs, business in MySQL+Redis

3. **❌ Table Structure in Tech Architecture**
   - Wrong: Detailed CREATE TABLE in data architecture
   - Right: Design specifications only, tables in DB design

4. **❌ Detailed Cache Keys in Tech Architecture**
   - Wrong: All Redis key patterns in tech architecture
   - Right: Prefix overview only, details in cache design

## Example Usage

When user asks to "design backend architecture":

1. **Confirm Requirements**
   - Technology stack preferences
   - Service division approach
   - Module boundaries

2. **Follow This Process**
   - Technology selection
   - Project structure design
   - Service division (single service)
   - Module division (auth/user/role/dept/config)
   - API design
   - Common module design

3. **Create Documents**
   - Backend architecture document
   - Review record
   - Update checklist

4. **Ensure Compliance**
   - Single service design
   - Module internal structure
   - API independence
   - Clear dependencies
