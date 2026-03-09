---
name: "business-domain-analysis-process"
description: "Guides the business domain analysis process including domain boundary definition, domain model design, DDD practices, and MyBatis Plus integration. Invoke when user needs to conduct domain-driven design, create domain analysis documentation, or define bounded contexts."
---

# Business Domain Analysis Process

This skill guides the complete business domain analysis process following Domain-Driven Design (DDD) principles, specifically tailored for System基础平台 architecture design.

## When to Invoke

Invoke this skill when:
- User needs to conduct business domain analysis
- User wants to create domain boundary documentation
- User needs to design domain models with DDD
- User asks about bounded context definition
- User needs to create entity/value object designs
- User wants to define domain events
- User asks about MyBatis Plus integration with domain models

## Process Overview

The business domain analysis consists of two main phases:
1. **Domain Boundary Definition** - Identify and classify domains, define bounded contexts
2. **Domain Model Design** - Design entities, value objects, aggregates, and domain services

## Phase 1: Domain Boundary Definition

### Step 1: Identify Business Domains

**Input**: Business Requirements Document (BRD), User Personas, Project Charter

**Tasks**:
1. Extract main business concepts from BRD
2. Analyze business functional modules
3. Identify all business domains

**Output**:
- Business domain list
- Business domain relationship diagram

**Checklist**:
- [ ] All business functions covered
- [ ] No missing business concepts
- [ ] Domain division is reasonable

### Step 2: Domain Classification

Classify domains into three types:

| Type | Definition | Strategic Importance | Design Strategy |
|------|-----------|---------------------|-----------------|
| Core Domain | System's core competitiveness | High | Best resources, deep DDD |
| Supporting Domain | Supports core, not differentiating | Medium | Meet requirements, no over-design |
| Generic Domain | Generic business capabilities | Low | Use mature solutions |

**System Platform Example**:
- **Core**: User Management, Permission Management, Authentication
- **Supporting**: Organization Management
- **Generic**: System Configuration, Audit Log

### Step 3: Define Bounded Contexts

For each domain, define:

1. **Context Name**: Domain name + "Context" suffix
2. **Context Responsibility**: Core responsibilities description
3. **Aggregates**:
   - Aggregate root entity
   - Value objects
   - Domain events
4. **Domain Services**: Services within the context

**Context Mapping Relationships**:
- Customer-Supplier: One context depends on another's data
- Partnership: Mutual dependency, needs coordination
- Shared Kernel: Share common model subset
- Conformist: Downstream adopts upstream model completely
- Anticorruption Layer: Downstream isolates from upstream

### Step 4: Context Mapping

Create context relationship diagram showing:
- All bounded contexts
- Relationships between contexts
- Integration patterns

## Phase 2: Domain Model Design

### Step 1: Identify Entities

**Entity Characteristics**:
- Has unique identity (ID)
- Has lifecycle
- State changes over time
- Needs history tracking

**Naming Convention**:
- Use business terminology (English)
- Singular noun form
- Examples: User, Role, Department

### Step 2: Design Value Objects

**Value Object Characteristics**:
- No unique identity
- Immutable
- Equality by attribute values
- Shareable and reusable

**Common Value Objects**:
- Identity: UserId, RoleId, DeptId
- Name: Username, RoleName, DeptName
- Contact: Email, Phone, Address
- Financial: Money, Price
- Time: DateRange, TimeSlot

**Naming Convention**:
- Noun or noun phrase
- Suffix indicates type: Id, Name, Code

### Step 3: Define Aggregates

**Aggregate Design Principles**:

1. **Aggregate Root**:
   - One root per aggregate
   - Global unique identity
   - External objects reference only the root

2. **Transaction Boundary**:
   - One transaction modifies one aggregate
   - Strong consistency within aggregate
   - Eventual consistency between aggregates

3. **Size Guidelines**:
   - Not too large (performance issues)
   - Not too small (loses meaning)
   - Typically 1-3 entities

**Aggregate Template** (MyBatis Plus):

```java
@Entity
@Table(name = "table_name")
public class XXX extends BaseAggregateRoot<XXXId> {
    
    // Identity
    private XXXId xxxId;
    
    // Basic attributes
    private XXXName xxxName;
    private XXXCode xxxCode;
    
    // Associations (IDs of other aggregates)
    private YYYId yyyId;
    
    // Status
    private XXXStatus status;
    
    // Audit
    private LocalDateTime createdAt;
    private UserId createdBy;
    private LocalDateTime updatedAt;
    private UserId updatedBy;
    
    // Domain methods
    public void domainMethod() {
        // Business logic
        registerEvent(new XXXEvent(this.xxxId));
    }
}
```

### Step 4: Design Domain Services

**When to Use**:
- Cross-aggregate business logic
- Logic not suitable for entities/value objects
- Domain calculations or transformations

**Naming Convention**:
- Verb + Noun format
- Reflects business intent
- Examples: UserDomainService, PermissionCheckService

**Implementation Standard** (MyBatis Plus):

```java
@Service
public class XXXDomainService {
    
    @Autowired
    private XXXMapper xxxMapper;  // MyBatis Plus Mapper
    
    @Autowired
    private YYYMapper yyyMapper;
    
    public Result businessMethod(Command command) {
        // 1. Query data
        XXX xxx = xxxMapper.selectById(command.getId());
        if (xxx == null) {
            throw new NotFoundException("XXX not found");
        }
        
        // 2. Business logic
        xxx.doSomething();
        
        // 3. Update data
        xxxMapper.updateById(xxx);
        
        return new Result(xxx);
    }
}
```

**Important**: Use MyBatis Plus Mapper instead of Repository pattern (as per project technology selection).

### Step 5: Identify Domain Events

**Event Characteristics**:
- Represents important business occurrence
- Past tense naming
- Includes state at time of occurrence

**Common Events**:
- Creation: XXXCreated, XXXAdded
- Update: XXXUpdated, XXXChanged
- Deletion: XXXDeleted, XXXRemoved
- Status change: XXXEnabled, XXXDisabled

**Naming Convention**:
- Past tense
- Format: {EntityName}{Action}Event
- Examples: UserCreatedEvent, PasswordChangedEvent

**Event Structure**:

```java
public class XXXEvent extends DomainEvent {
    private XXXId xxxId;          // Entity ID
    private String attribute;     // Changed attribute
    private LocalDateTime occurredAt;  // Occurrence time
    private UserId operator;      // Operator
}
```

### Step 6: Design Domain Event Handling

**Event Publishing**:
- Register events in aggregate root
- Publish after transaction commit
- Use Spring event mechanism

**Event Subscribing**:
- Use @EventListener annotation
- Handle cross-aggregate business
- Implement eventual consistency

**Event Handler Template**:

```java
@Component
public class XXXEventHandler {
    
    @Autowired
    private YYYMapper yyyMapper;
    
    @EventListener
    public void onXXXEvent(XXXEvent event) {
        // 1. Query related data
        YYY yyy = yyyMapper.selectByXXXId(event.getXxxId());
        
        // 2. Execute business logic
        yyy.handleXXXEvent(event);
        
        // 3. Update data
        yyyMapper.updateById(yyy);
    }
}
```

## Document Templates

### Domain Boundary Document Structure

```markdown
# Domain Boundary Definition

## 1. Overview
### 1.1 Purpose
### 1.2 Input Documents
### 1.3 Design Method

## 2. Business Domain Identification
### 2.1 Domain Overview
### 2.2 Domain Details

## 3. Domain Classification
### 3.1 Classification Matrix
### 3.2 Core Domains
### 3.3 Supporting Domains
### 3.4 Generic Domains

## 4. Bounded Context Definition
### 4.1 Context Overview
### 4.2 Context Details

## 5. Context Mapping
### 5.1 Context Relationship Diagram
### 5.2 Integration Details

## 6. Appendix
### 6.1 Domain Glossary
### 6.2 Revision History
```

### Domain Model Document Structure

```markdown
# Domain Model Design

## 1. Overview
### 1.1 Purpose
### 1.2 Input Documents
### 1.3 Design Principles

## 2. Domain Model Overview
### 2.1 Domain Model Panorama

## 3. {Context Name} Domain Model
### 3.1 {Aggregate} Aggregate
#### 3.1.1 Aggregate Root
#### 3.1.2 Value Objects
#### 3.1.3 Domain Events

### 3.2 Domain Services

## 4. Domain Event Handling

## 5. Appendix
### 5.1 ER Diagram
### 5.2 Revision History
```

## Review Standards

### Review Checklist

#### Domain Boundary Review

| Check Item | Content | Pass Criteria |
|-----------|---------|---------------|
| Domain Identification | Cover all business functions | No missing domains |
| Domain Classification | Core/Supporting/Generic reasonable | Align with strategy |
| Bounded Context | Aggregates follow DDD | Follow design principles |
| Context Mapping | Relationship types reasonable | No circular dependencies |
| Glossary | Domain terms unified | Clear definitions |

#### Domain Model Review

| Check Item | Content | Pass Criteria |
|-----------|---------|---------------|
| Entity Design | Has unique identity | Matches entity characteristics |
| Value Object Design | Immutable | Matches value object characteristics |
| Aggregate Design | Clear aggregate root | Clear transaction boundary |
| Domain Service | Cross-aggregate | Uses MyBatis Plus Mapper |
| Domain Event | Naming standard | Covers key scenarios |
| Event Handling | Idempotent | Eventual consistency |

## Quality Standards

### Document Quality

| Dimension | Standard |
|-----------|----------|
| Completeness | Cover all business domains |
| Accuracy | Domain concepts accurate |
| Consistency | Unified terminology |
| Traceability | Mappable to requirements |
| Reviewability | Clear structure |

### Design Quality

| Dimension | Standard |
|-----------|----------|
| High Cohesion | High cohesion within aggregates |
| Low Coupling | Low coupling between aggregates |
| Extensibility | Support future extensions |
| Testability | Easy unit testing |
| Maintainability | Clear code, easy maintenance |

## MyBatis Plus Integration

### Mapper Usage Standards

**DO**:
- Use `xxxMapper.selectById()` instead of `repository.findById()`
- Use `xxxMapper.insert()` instead of `repository.save()` for create
- Use `xxxMapper.updateById()` instead of `repository.save()` for update
- Use `xxxMapper.selectCount()` for existence check
- Use `xxxMapper.selectList()` for query multiple records

**DON'T**:
- Don't use Repository pattern
- Don't use JPA annotations if using MyBatis Plus
- Don't mix JPA and MyBatis Plus in same project

### Example Mapping

| Repository Method | MyBatis Plus Mapper Method |
|------------------|---------------------------|
| `save(entity)` | `insert(entity)` / `updateById(entity)` |
| `findById(id)` | `selectById(id)` |
| `findAll()` | `selectList(null)` |
| `existsByXxx(value)` | `selectCount(wrapper) > 0` |
| `findByXxx(value)` | `selectOne(wrapper)` |
| `saveAll(entities)` | Loop `insert()` or `updateById()` |

## References

- Domain-Driven Design by Eric Evans
- Implementing Domain-Driven Design by Vaughn Vernon
- Project Business Requirements Document (BRD)
- Project Technology Selection Document
