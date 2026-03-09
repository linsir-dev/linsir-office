---
name: "technology-selection-process"
description: "Guides the technology selection and architecture style selection process including frontend/backend/database/middleware selection and architecture pattern evaluation. Invoke when user needs to select technology stack, evaluate architecture styles, or create architecture decision records."
---

# Technology Selection Process

This skill guides the technology selection and architecture style selection process, ensuring scientific and consistent decision-making.

## When to Invoke

- User needs to select technology stack for a project
- User wants to evaluate architecture styles (microservices vs monolith)
- User needs to create Architecture Decision Records (ADRs)
- User asks for technology comparison and evaluation
- User needs guidance on frontend/backend/database selection

## Process Overview

The technology selection process consists of 4 main phases:
1. Technology Selection Analysis
2. Architecture Style Selection
3. Decision Documentation
4. Review and Confirmation

## Phase 1: Technology Selection Analysis

### Step 1.1: Frontend Technology Selection

**Input:**
- Project requirements
- UI prototypes
- Performance requirements

**Activities:**
1. **Framework Selection**
   - Identify candidates (Vue/React/Angular)
   - Evaluation dimensions: learning curve, development efficiency, performance, ecosystem, team familiarity
   - Create evaluation matrix with weighted scoring
   - Determine final framework

2. **UI Component Library Selection**
   - Identify candidate libraries
   - Evaluate: component richness, customization, documentation, community
   - Select component library

3. **State Management Selection**
   - Identify candidates (Pinia/Vuex/Redux)
   - Evaluate: ease of use, TypeScript support, performance
   - Determine state management solution

4. **Build Tool Selection**
   - Identify candidates (Vite/Webpack/Rollup)
   - Evaluate: build speed, configuration complexity, ecosystem
   - Select build tool

**Output:**
- Frontend technology stack list
- Technology selection evaluation matrix

### Step 1.2: Backend Technology Selection

**Input:**
- Functional requirements
- Performance requirements
- Security requirements
- Project constraints (project charter)

**Activities:**
1. **Programming Language and Framework Selection**
   - Identify candidates (Java/Spring, Go/Gin, Node.js/NestJS)
   - Evaluation dimensions: ecosystem maturity, team familiarity, enterprise features, performance
   - Create evaluation matrix
   - Determine language and framework

2. **ORM Framework Selection**
   - Identify candidates (MyBatis Plus, JPA, Spring Data JDBC)
   - Evaluate: flexibility, performance, feature richness
   - Select ORM framework

3. **Security Framework Selection**
   - Identify candidates (Spring Security, Shiro, custom)
   - Evaluate: feature completeness, integration, community support
   - Select security framework

4. **API Documentation Tool Selection**
   - Identify candidates (SpringDoc, Swagger, Knife4j)
   - Select API documentation tool

**Output:**
- Backend technology stack list
- Technology selection evaluation matrix

### Step 1.3: Data Storage Selection

**Input:**
- Data models
- Data volume estimates
- Access patterns
- Project constraints

**Activities:**
1. **Relational Database Selection**
   - Identify candidates (MySQL, PostgreSQL, Oracle)
   - Evaluate: performance, cost, ecosystem, team familiarity
   - Select relational database

2. **Cache Database Selection**
   - Identify candidates (Redis, Memcached)
   - Evaluate: feature richness, performance, persistence support
   - Select cache solution

3. **Search Engine Selection**
   - Identify candidates (Elasticsearch, OpenSearch)
   - Evaluate: features, performance, ecosystem
   - Select search engine

**Output:**
- Data storage technology stack list

### Step 1.4: Middleware Selection

**Input:**
- Async processing requirements
- Task scheduling requirements
- Message passing requirements

**Activities:**
1. **Message Queue Selection**
   - Identify candidates (RabbitMQ, Kafka, RocketMQ)
   - Evaluate: reliability, throughput, operational complexity
   - Select message queue

2. **Task Scheduling Selection**
   - Identify candidates (XXL-JOB, Quartz, Elastic-Job)
   - Evaluate: features, ease of use, monitoring capabilities
   - Select task scheduling framework

**Output:**
- Middleware technology stack list

### Step 1.5: DevOps Tool Selection

**Activities:**
1. Version control tools (Git/GitLab)
2. Build tools (Maven/Gradle)
3. Containerization tools (Docker/Kubernetes)
4. Monitoring tools (Prometheus/Grafana)

**Output:**
- Complete technology stack overview
- Technology stack version matrix

## Phase 2: Architecture Style Selection

### Step 2.1: Candidate Identification

**Input:**
- Business requirements analysis
- Non-functional requirements
- Team capability assessment
- Project constraints

**Activities:**
1. **Identify Candidate Architecture Styles**
   - Microservices architecture
   - Modular monolith architecture
   - Layered modular architecture
   - Other architecture styles

2. **Define Decision Drivers**
   - Development efficiency
   - Operational complexity
   - Scalability
   - Technical risk
   - Performance requirements
   - Integration capability

**Output:**
- List of candidate architecture solutions
- Decision factor weight table

### Step 2.2: Solution Evaluation

**Activities:**
1. **Create Evaluation Matrix**
   - Define evaluation dimensions
   - Assign weights
   - Define scoring criteria (1-10 scale)

2. **Score Solutions**
   - Rate each candidate on each dimension
   - Calculate weighted scores

3. **Pros and Cons Analysis**
   - Analyze advantages of each solution
   - Analyze disadvantages of each solution
   - Identify key risks

**Output:**
- Architecture solution evaluation matrix
- Pros and cons analysis report

### Step 2.3: Decision Making

**Activities:**
1. **Comprehensive Evaluation**
   - Compare solution scores
   - Consider project constraints
   - Evaluate long-term impact

2. **Decision Finalization**
   - Select optimal solution
   - Document decision rationale
   - Identify decision impact

**Output:**
- Architecture style decision
- Decision rationale explanation

## Phase 3: Decision Documentation

### Step 3.1: ADR Writing

**Activities:**
1. **Write ADR Document**
   - Background description
   - Decision drivers
   - Candidate solution descriptions
   - Solution evaluation
   - Final decision
   - Implementation strategy

2. **Decision Content**
   - Technology selection decisions
   - Architecture style decisions
   - Version selections

**Output:**
- Architecture Decision Record (ADR)
- Technology selection analysis report

## Phase 4: Review and Confirmation

### Step 4.1: Technical Review

**Activities:**
1. **Organize Review Meeting**
   - Invite technical lead, development lead, operations lead
   - Prepare review materials

2. **Review Content**
   - Technology selection rationality
   - Architecture style applicability
   - Risk assessment
   - Implementation feasibility

**Output:**
- Review comments
- Improvement suggestions

### Step 4.2: Decision Confirmation

**Activities:**
1. **Revise and Improve**
   - Modify based on review comments
   - Improve decision rationale

2. **Sign-off**
   - Stakeholder signatures
   - Archive decision documents

**Output:**
- Reviewed and approved decision documents
- Sign-off confirmation page

## Document Templates

### Technology Selection Analysis Report Structure

```
1. Overview
   1.1 Purpose
   1.2 Selection Scope
   1.3 Selection Principles

2. Frontend Technology Selection
   2.1 Framework Selection
   2.2 UI Component Library Selection
   2.3 State Management Selection
   2.4 Build Tool Selection

3. Backend Technology Selection
   3.1 Programming Language and Framework Selection
   3.2 ORM Framework Selection
   3.3 Security Framework Selection
   3.4 API Documentation Tool Selection

4. Data Storage Selection
   4.1 Relational Database Selection
   4.2 Cache Database Selection
   4.3 Search Engine Selection

5. Middleware Selection
   5.1 Message Queue Selection
   5.2 Task Scheduling Selection

6. DevOps Tool Selection

7. Technology Stack Overview
   7.1 Complete Technology Stack Diagram
   7.2 Technology Stack Version Matrix

8. Technology Selection Risks and Mitigation

9. Summary and Recommendations

10. Appendix
```

### Architecture Decision Record (ADR) Structure

```
1. Background
   1.1 Business Background
   1.2 Technical Background

2. Decision Drivers
   2.1 Key Decision Factors
   2.2 Constraints

3. Candidate Solutions
   3.1 Solution 1 Description
   3.2 Solution 2 Description
   3.3 Solution 3 Description

4. Solution Evaluation
   4.1 Evaluation Matrix
   4.2 Detailed Evaluation

5. Decision
   5.1 Final Decision
   5.2 Decision Rationale
   5.3 Decision Impact

6. Implementation Strategy

7. Risks and Mitigation

8. Related Decisions

9. Appendix
```

## Quality Standards

### Technology Selection Quality Standards

| Check Item | Quality Requirement | Check Method |
|-----------|-------------------|-------------|
| Comprehensive Selection | Cover frontend, backend, data, middleware | Check against checklist |
| Objective Evaluation | Evaluate based on facts and data | Review meeting |
| Constraint Compliance | Comply with project charter constraints | Document review |
| Risk Identification | Identify and plan mitigation measures | Risk assessment |

### Architecture Style Selection Quality Standards

| Check Item | Quality Requirement | Check Method |
|-----------|-------------------|-------------|
| Complete Solutions | At least 3 candidate solutions | Document review |
| Evaluation Dimensions | Cover key decision factors | Check evaluation matrix |
| Rational Decision | Sufficient decision rationale | Expert review |
| Implementable | Clear implementation strategy | Feasibility assessment |

## Best Practices

### Technology Selection

1. **Thorough Research**: Understand pros/cons and applicable scenarios of each technology
2. **Team Involvement**: Let development team participate in selection process
3. **POC Validation**: Conduct proof of concept for key technologies
4. **Reference Cases**: Reference successful cases in same industry
5. **Consider Long-term**: Consider long-term development and maintenance costs

### Architecture Style Selection

1. **Start from Reality**: Based on team capability and project constraints
2. **Balance Efficiency and Quality**: Don't blindly pursue new technologies
3. **Maintain Evolvability**: Leave space for future architecture evolution
4. **Document Decisions**: Record decision rationale and process
5. **Regular Review**: Adjust architecture based on project progress

## Common Pitfalls

| Pitfall | Description | Avoidance Method |
|--------|-------------|-----------------|
| Blindly Chasing New | Choose latest but immature technology | Choose production-proven technology |
| Ignoring Constraints | Not considering project charter constraints | First clarify constraint conditions |
| Over-engineering | Pay for unnecessary scalability | Design based on actual requirements |
| Ignoring Team | Not considering team technology stack | Assess team learning capability |
| Lack of Comparison | Only one candidate solution | Compare at least 3 solutions |

## Reference Documents

- Project Charter
- Architecture Design Checklist
- Current Architecture Assessment Process Standard
