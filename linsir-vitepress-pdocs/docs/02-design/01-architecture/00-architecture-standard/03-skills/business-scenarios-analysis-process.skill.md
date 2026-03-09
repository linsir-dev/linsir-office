---
name: "business-scenarios-analysis-process"
description: "Guides the business scenarios analysis process including user scenario identification, integration scenario design, and scenario documentation. Invoke when user needs to analyze business scenarios, create user stories, or design system integration scenarios."
---

# Business Scenarios Analysis Process

This skill guides the complete business scenarios analysis process, including user scenarios and system integration scenarios.

## When to Use

- Analyzing user scenarios and user stories
- Designing system integration scenarios
- Creating scenario documentation
- Planning system integrations
- Defining user experience requirements

## Process Overview

### Phase 1: User Scenarios Analysis

#### Step 1: Identify User Roles (0.5 day)

**Input**: User persona documents, business requirements documents

**Tasks**:
1. Identify all user roles in the system
2. Define role characteristics and responsibilities
3. Determine role permission scopes

**Role Categories**:
- **System Administrator**: System-level management permissions
- **Department Administrator**: Department-level management permissions
- **Normal User**: Basic operation permissions
- **Special Roles**: Auditor, guest, etc.

**Checklist**:
- [ ] All user roles identified?
- [ ] Each role's responsibilities clear?
- [ ] Role permission scopes defined?
- [ ] Relationships between roles clear?

**Output**: User roles list

**Example**:
```markdown
## User Roles List

### System Administrator
- **Description**: Highest privilege system manager
- **Responsibilities**: System configuration, user management, permission assignment
- **Scope**: All data and functions
- **Usage Frequency**: Daily

### Department Administrator
- **Description**: Department manager
- **Responsibilities**: Department personnel management, permission requests
- **Scope**: Department and sub-department data
- **Usage Frequency**: Daily

### Normal User
- **Description**: Regular system user
- **Responsibilities**: Daily work processing, personal information management
- **Scope**: Personal data
- **Usage Frequency**: Daily
```

#### Step 2: Identify User Scenarios (1 day)

**Input**: User roles list, core business process analysis

**Tasks**:
1. Identify user scenarios based on business processes
2. Organize scenarios by role
3. Identify scenario trigger conditions and post-conditions

**Scenario Categories**:
- **First-time Use Scenarios**: Registration, login, initialization
- **Daily Use Scenarios**: Regular operations, data queries
- **Management Scenarios**: Configuration, approval, monitoring
- **Exception Scenarios**: Error handling, fault recovery

**Checklist**:
- [ ] All business processes covered?
- [ ] Each role has corresponding scenarios?
- [ ] Scenario trigger conditions clear?
- [ ] Scenario post-conditions clear?

**Output**: User scenarios list

**Example**:
```markdown
## User Scenarios List

### System Administrator Scenarios
1. System Initialization Configuration
   - Trigger: First system deployment
   - Frequency: One-time
   
2. Daily User Management
   - Trigger: User lifecycle events
   - Frequency: Daily

### Normal User Scenarios
1. First Login
   - Trigger: First login after account creation
   - Frequency: One-time
   
2. Daily Workbench Usage
   - Trigger: Daily system login
   - Frequency: Daily
```

#### Step 3: Write Scenario Descriptions (1 day)

**Input**: User scenarios list

**Tasks**:
1. Write scenario overview
2. Define scenario participants
3. Define pre-conditions
4. Define post-conditions

**Scenario Description Template**:
```markdown
#### Scenario X.X.X: [Scenario Name]

**Description**: [One sentence description]

**Participants**: [Main participants]

**Pre-conditions**:
- [Condition 1]
- [Condition 2]

**Steps**:
[Steps table]

**Post-conditions**:
- [Result 1]
- [Result 2]

**Business Rules**:
- [Rule 1]
- [Rule 2]

**Exception Handling**:
- [Exception 1]: [Handling method]
- [Exception 2]: [Handling method]
```

**Checklist**:
- [ ] Scenario description clear?
- [ ] Participants defined?
- [ ] Pre-conditions complete?
- [ ] Post-conditions complete?

**Output**: Scenario description document (draft)

#### Step 4: Define Scenario Steps (1-2 days)

**Input**: Scenario description document

**Tasks**:
1. Detail scenario operation steps
2. Define operator for each step
3. Define system response for each step
4. Define expected result for each step

**Step Description Format**:

| Step | Operation | System Response | Expected Result |
|------|-----------|-----------------|-----------------|
| 1 | [User action] | [System behavior] | [Verification point] |
| 2 | [User action] | [System behavior] | [Verification point] |

**Extension Scenarios**:
- Identify branch scenarios from main scenario
- Define trigger conditions for extension scenarios
- Write steps for extension scenarios

**Checklist**:
- [ ] Steps complete?
- [ ] Step sequence correct?
- [ ] Each step verifiable?
- [ ] Extension scenarios complete?

**Output**: Complete scenario steps description

**Example**:
```markdown
| Step | Operation | System Response | Expected Result |
|------|-----------|-----------------|-----------------|
| 1 | Login with default account | Display admin console | Login successful |
| 2 | Change default password | Password change success prompt | Password updated |
| 3 | Enter system config module | Display config items list | Config page loaded |
| 4 | Configure system basic info | Save configuration | System info updated |
```

#### Step 5: Define Business Rules (0.5 day)

**Input**: Business rules documentation, scenario steps description

**Tasks**:
1. Identify business rules involved in scenario
2. Reference existing rules or define new ones
3. Explain rule application in scenario

**Checklist**:
- [ ] Correct rules referenced?
- [ ] Rules match scenario?
- [ ] Rule priorities clear?

**Output**: Scenario business rules list

**Example**:
```markdown
**Business Rules**:
- BR-SYS-001: Must change default password on first login
- BR-SYS-002: System name required, 2-50 characters
- BR-SYS-003: Must create at least one department before creating users
```

#### Step 6: Identify Exception Handling (0.5 day)

**Input**: Scenario steps description

**Tasks**:
1. Identify possible exceptions for each step
2. Define exception handling strategies
3. Define user prompt messages

**Exception Categories**:
- **Business Exceptions**: Data validation failure, insufficient permissions
- **System Exceptions**: Network errors, service unavailable
- **User Exceptions**: Operation errors, illegal input

**Checklist**:
- [ ] All exceptions identified?
- [ ] Exception handling strategies clear?
- [ ] User prompts friendly?

**Output**: Exception handling list

**Example**:
```markdown
**Exception Handling**:
- Config save failure: Show error message, preserve current input
- Email test failure: Show error details, provide troubleshooting suggestions
- Department creation failure: Check department code uniqueness
```

#### Step 7: Scenario Review (1 day)

**Input**: User scenarios analysis document

**Tasks**:
1. Organize review meeting
2. Verify scenario completeness
3. Confirm scenario priorities
4. Modify scenario documents

**Review Checklist**:
- [ ] Scenarios cover all functions?
- [ ] Scenario steps clear?
- [ ] Exception handling complete?
- [ ] Business rules correct?
- [ ] User experience good?

**Output**: Review records, updated scenario documents

---

### Phase 2: System Integration Scenarios Analysis

#### Step 1: Identify Integration Systems (0.5 day)

**Input**: Existing system architecture documents, business requirements documents

**Tasks**:
1. Identify internal systems to integrate
2. Identify external services to integrate
3. Determine integration priorities

**Integration System Categories**:
- **Internal Systems**: HR system, ERP system, OA system, CRM system, Finance system
- **External Services**: Email service, SMS service, File storage, Identity authentication

**Checklist**:
- [ ] All integration systems identified?
- [ ] Integration method clear for each system?
- [ ] Integration priorities reasonable?

**Output**: Integration systems list

**Example**:
```markdown
## Integration Systems List

| System Name | Type | Method | Priority |
|-------------|------|--------|----------|
| HR System | Internal | API + Message Queue | P0 |
| ERP System | Internal | API | P1 |
| OA System | Internal | API + SSO | P1 |
| Email Service | External | SMTP/IMAP | P0 |
| SMS Service | External | HTTP API | P1 |
```

#### Step 2: Identify Integration Scenarios (1 day)

**Input**: Integration systems list, core business process analysis

**Tasks**:
1. Identify integration scenarios based on business processes
2. Define scenario trigger conditions
3. Define data flow direction

**Integration Scenario Categories**:
- **Data Sync Scenarios**: Employee sync, department sync, master data sync
- **Authentication Integration Scenarios**: Single sign-on, unified authentication
- **Business Process Integration Scenarios**: Todo sync, approval integration
- **Notification Integration Scenarios**: Email notification, SMS notification

**Checklist**:
- [ ] All business processes covered?
- [ ] Each integration scenario necessary?
- [ ] Scenario trigger conditions clear?
- [ ] Data flow direction clear?

**Output**: Integration scenarios list

**Example**:
```markdown
## Integration Scenarios List

### HR System Integration
1. Employee Entry Sync
   - Trigger: HR entry approval passed
   - Data Flow: HR → System
   
2. Employee Resignation Sync
   - Trigger: HR resignation approval passed
   - Data Flow: HR → System

### OA System Integration
1. Single Sign-On (SSO)
   - Trigger: OA system redirect
   - Data Flow: OA ↔ System
```

#### Step 3: Design Integration Solution (1-2 days)

**Input**: Integration scenarios list

**Tasks**:
1. Select integration technology solution
2. Design interface specifications
3. Define interaction flow

**Integration Technology Options**:
- **Synchronous Calls**: REST API, SOAP
- **Asynchronous Messages**: Message Queue (RabbitMQ, Kafka)
- **File Transfer**: FTP, SFTP
- **Database Sync**: CDC, ETL

**Checklist**:
- [ ] Technology solution appropriate?
- [ ] Interface specifications clear?
- [ ] Interaction flow complete?
- [ ] Performance requirements met?

**Output**: Integration solution design document

**Example**:
```markdown
## Employee Entry Sync Solution

**Integration Method**: Message Queue (Async)

**Data Flow**:
```
HR System → Message Queue → System Platform → User Creation → Notification Send
```

**Scenario Steps**:
| Step | Actor | Action | Data |
|------|-------|--------|------|
| 1 | HR System | Entry approval passed | Employee info |
| 2 | HR System | Send entry event | EmployeeEntryEvent |
| 3 | System Platform | Consume entry event | Parse employee data |
| 4 | System Platform | Create user account | User info |
| 5 | System Platform | Send notification email | Account info |
```

#### Step 4: Define Data Mapping (0.5 day)

**Input**: Integration solution design document

**Tasks**:
1. Define field mapping relationships
2. Define data transformation rules
3. Define data validation rules

**Checklist**:
- [ ] Field mapping complete?
- [ ] Transformation rules clear?
- [ ] Validation rules defined?

**Output**: Data mapping table

**Example**:
```markdown
## Data Mapping Table

| HR Field | System Field | Transformation Rule |
|----------|--------------|---------------------|
| employee_no | employee_no | Direct mapping |
| name | real_name | Direct mapping |
| email | email | Direct mapping |
| department_code | dept_id | Department code mapping |
| entry_date | entry_date | Date format conversion |
```

#### Step 5: Define Exception Handling (0.5 day)

**Input**: Integration solution design document

**Tasks**:
1. Identify integration exception scenarios
2. Define retry strategies
3. Define fallback strategies
4. Define compensation mechanisms

**Exception Categories**:
- **Network Exceptions**: Timeout, disconnection
- **Service Exceptions**: 500 errors, service unavailable
- **Data Exceptions**: Format errors, missing data
- **Business Exceptions**: Duplicate data, state conflicts

**Checklist**:
- [ ] All exceptions identified?
- [ ] Retry strategies reasonable?
- [ ] Fallback strategies feasible?
- [ ] Compensation mechanisms complete?

**Output**: Exception handling strategy document

**Example**:
```markdown
## Exception Handling Strategy

| Exception Scenario | Handling Strategy | Compensation Mechanism |
|-------------------|-------------------|------------------------|
| Message consumption failure | Retry 3 times, 5 min interval | Dead letter queue, manual processing |
| Department mapping failure | Log error, assign default department | Admin manual adjustment |
| Email sending failure | Log only, no retry | Admin manual resend |
```

#### Step 6: Define Security Strategy (0.5 day)

**Input**: Integration solution design document

**Tasks**:
1. Define transport security requirements
2. Define authentication and authorization mechanisms
3. Define data security measures

**Security Requirements**:
- **Transport Security**: HTTPS, TLS
- **Authentication & Authorization**: API Key, OAuth, JWT
- **Data Security**: Encryption, masking, signature

**Checklist**:
- [ ] Transport security adequate?
- [ ] Authentication & authorization complete?
- [ ] Data security sufficient?

**Output**: Security strategy document

**Example**:
```markdown
## Security Strategy

### Transport Security
- All interfaces use HTTPS
- TLS 1.2+

### Authentication & Authorization
- API Key + Secret
- HMAC-SHA256 signature

### Data Security
- Sensitive data AES encryption
- Log data masking
```

#### Step 7: Scenario Review (1 day)

**Input**: System integration scenarios analysis document

**Tasks**:
1. Organize review meeting
2. Verify integration solution feasibility
3. Confirm integration priorities
4. Modify scenario documents

**Review Checklist**:
- [ ] Integration solution feasible?
- [ ] Data mapping correct?
- [ ] Exception handling complete?
- [ ] Security strategy adequate?
- [ ] Performance requirements met?

**Output**: Review records, updated scenario documents

---

## Quality Standards

### User Scenarios Quality Standards

| Check Item | Standard | Check Method |
|-----------|----------|--------------|
| Completeness | Cover all user roles and functions | Checklist |
| Accuracy | Scenario steps consistent with requirements | Requirements comparison |
| Clarity | Scenario descriptions clear and understandable | Peer review |
| Testability | Each scenario testable | Test case review |

### Integration Scenarios Quality Standards

| Check Item | Standard | Check Method |
|-----------|----------|--------------|
| Completeness | Cover all integration requirements | Checklist |
| Feasibility | Technical solution implementable | Technical review |
| Security | Meet security requirements | Security review |
| Reliability | Exception handling complete | Fault drill |

---

## Document Templates

### User Scenarios Analysis Document Template

```markdown
# User Scenarios Analysis

> **Document ID**: SYS-DES-BA-XXX  
> **Version**: 1.0  
> **Created Date**: YYYY-MM-DD  
> **Author**: Architect  
> **Status**: Draft

---

## 1. Overview

### 1.1 Document Purpose
### 1.2 Input Documents
### 1.3 Scenario Categories

## 2. [Role] Scenarios

### 2.1 [Scenario Name]

**Description**:
**Participants**:
**Pre-conditions**:

**Steps**:
| Step | Operation | System Response | Expected Result |
|------|-----------|-----------------|-----------------|

**Post-conditions**:
**Business Rules**:
**Exception Handling**:

## 3. Scenario Priorities

## 4. Scenario to Function Mapping

## 5. Appendix
```

### System Integration Scenarios Analysis Document Template

```markdown
# System Integration Scenarios Analysis

> **Document ID**: SYS-DES-BA-XXX  
> **Version**: 1.0  
> **Created Date**: YYYY-MM-DD  
> **Author**: Architect  
> **Status**: Draft

---

## 1. Overview

### 1.1 Document Purpose
### 1.2 Input Documents
### 1.3 Integration Systems List

## 2. [System] Integration Scenarios

### 2.1 [Scenario Name]

**Description**:
**Integration Method**:
**Trigger Condition**:

**Data Flow**:
**Steps**:
| Step | Actor | Action | Data |
|------|-------|--------|------|

**Data Mapping**:
**Business Rules**:
**Exception Handling**:

## 3. Integration Exception Handling

## 4. Integration Security Requirements

## 5. Appendix
```

---

## Best Practices

### User Scenarios Best Practices

1. **User Perspective**: Describe what users see and do, not system internals
2. **Keep It Simple**: Each scenario focuses on one goal
3. **Use Concrete Data**: Avoid vague descriptions, use specific values
4. **Consider Edge Cases**: Consider both normal and exception flows
5. **Validate Feasibility**: Confirm scenarios are implementable with technical team

### Integration Scenarios Best Practices

1. **Clear Integration Boundaries**: Clearly define system boundaries and responsibilities
2. **Design Idempotent Interfaces**: Ensure repeated calls don't cause issues
3. **Consider Fallback**: How system behaves when integration fails
4. **Monitor Integration**: Establish integration monitoring and alerting
5. **Document Interfaces**: Detailed interface specifications and examples

---

## Common Pitfalls

### User Scenarios Pitfalls

1. **Too Technical**: Describe system implementation rather than user behavior
2. **Missing Exceptions**: Only consider normal flow, ignore error handling
3. **Overly Complex**: One scenario contains too many steps
4. **Lack Verification**: No clear expected results
5. **Ignore UX**: Focus only on functions, not experience

### Integration Scenarios Pitfalls

1. **Underestimate Complexity**: Integration more complex than expected
2. **Ignore Data Quality**: Source system data quality issues
3. **Missing Timeout Handling**: Long waits cause system blocking
4. **Insufficient Security**: Transport and storage security
5. **Lack Monitoring**: Can't及时发现 integration issues

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-08 | Architect | Initial version |

---

**Document Author**: Architect  
**Document Reviewer**: Technical Lead  
**Created Date**: 2026-03-08
