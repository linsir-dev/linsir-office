---
name: "requirements-research-report-process"
description: "Guides the requirements research report creation process to summarize all research findings, user interviews, current situation analysis, and produce comprehensive research reports. Invoke when user needs to create requirements research reports or summarize research phase deliverables."
---

# Requirements Research Report Process Skill

## Overview

This skill guides you through creating a comprehensive requirements research report that summarizes all findings from the requirements analysis phase, including user interviews, current situation analysis, competitor analysis, stakeholder analysis, requirement refinement, user personas, business processes, and priority assessments.

## When to Use

- Summarizing requirements analysis phase findings
- Creating comprehensive requirements research reports
- Documenting research methodology and results
- Producing final deliverables for the research phase
- Transitioning from analysis to design phase

## Report Creation Process

### Step 1: Executive Summary

**Objective:** Provide a high-level overview of the research findings.

**Actions:**
1. Summarize research scope and timeline
2. List key stakeholders interviewed
3. Highlight major pain points discovered
4. State critical requirements identified
5. Present recommended solution approach

**Key Elements:**
- Project overview
- Research timeline
- Key findings (3-5 bullet points)
- Recommended approach
- Expected outcomes

---

### Step 2: Research Background and Objectives

**Objective:** Document why the research was conducted and what it aimed to achieve.

**Actions:**
1. Describe current business context
2. List existing problems and challenges
3. Define research objectives
4. State success criteria

**Content Structure:**
```markdown
## Research Background
- Current state description
- Business challenges
- Pain points summary

## Research Objectives
- Primary objectives
- Secondary objectives
- Success criteria
```

---

### Step 3: Research Methodology

**Objective:** Document the methods used to gather requirements.

**Actions:**
1. List all research methods employed
2. Describe participant selection criteria
3. Document data collection process
4. Explain analysis approach

**Methods to Document:**
- User interviews (who, how many, duration)
- Current situation analysis (systems reviewed)
- Competitor analysis (products evaluated)
- Document analysis (artifacts reviewed)
- Observation (if applicable)

---

### Step 4: User Interview Summary

**Objective:** Synthesize findings from all user interviews.

**Actions:**
1. Summarize interview participants by role
2. Extract common themes across interviews
3. Document role-specific needs
4. List conflicting requirements (if any)
5. Prioritize findings by frequency/impact

**Structure:**
- Participant overview table
- Common themes section
- Role-specific findings
- Key quotes (anonymized)
- Requirements extracted

---

### Step 5: Current Situation Analysis

**Objective:** Document the current state of systems and processes.

**Actions:**
1. List all existing systems
2. Document system capabilities and limitations
3. Map current business processes
4. Identify pain points and bottlenecks
5. Assess integration requirements

**Content:**
- System inventory table
- Process flow diagrams
- Pain point analysis
- Gap assessment
- Technical debt identification

---

### Step 6: Competitor Analysis Summary

**Objective:** Summarize competitive landscape and best practices.

**Actions:**
1. List competitors analyzed
2. Compare feature sets
3. Identify competitive advantages
4. Document lessons learned
5. Recommend differentiation strategy

**Structure:**
- Competitor overview
- Feature comparison matrix
- SWOT analysis
- Best practices identified
- Recommendations

---

### Step 7: Stakeholder Analysis Summary

**Objective:** Document key stakeholders and their interests.

**Actions:**
1. List all identified stakeholders
2. Document influence and interest levels
3. Summarize key concerns per stakeholder
4. Document communication strategies
5. Identify potential conflicts

**Content:**
- Stakeholder register summary
- Influence-interest matrix
- Key concerns table
- Management strategies

---

### Step 8: Requirements Summary

**Objective:** Consolidate all functional and non-functional requirements.

**Actions:**
1. Summarize functional requirements by module
2. List user stories by persona
3. Document non-functional requirements
4. Identify constraints and assumptions
5. Map requirements to business objectives

**Structure:**
- Functional requirements summary
- User story statistics
- Non-functional requirements
- Constraints and assumptions
- Traceability matrix (optional)

---

### Step 9: User Personas Summary

**Objective:** Present the key user personas identified.

**Actions:**
1. List all personas created
2. Summarize each persona's profile
3. Document key pain points per persona
4. List persona-specific requirements
5. Prioritize personas by impact

**Content:**
- Persona overview table
- Detailed persona profiles (2-3 key ones)
- Journey map highlights
- Pain point summary

---

### Step 10: Business Process Summary

**Objective:** Document key business processes.

**Actions:**
1. List core business processes
2. Summarize process flows
3. Document business rules
4. Identify exception scenarios
5. Define process metrics

**Structure:**
- Process inventory
- Process flow summaries
- Business rules table
- Exception handling
- KPIs and metrics

---

### Step 11: Priority Assessment Summary

**Objective:** Present the prioritization results.

**Actions:**
1. Summarize MoSCoW classification results
2. Present value-cost analysis
3. List P0/P1/P2 requirements
4. Document iteration plan
5. Identify risks and dependencies

**Content:**
- MoSCoW distribution
- Priority matrix summary
- Iteration plan overview
- Risk assessment
- Recommendation rationale

---

### Step 12: Conclusions and Recommendations

**Objective:** Provide actionable recommendations based on research.

**Actions:**
1. Summarize key conclusions (3-5 points)
2. Provide phased implementation recommendations
3. Identify risks and mitigation strategies
4. Define next steps
5. List open questions (if any)

**Structure:**
- Key conclusions
- Implementation recommendations
- Risk mitigation
- Next steps
- Open questions

---

## Document Naming Convention

| Document | Code |
|---------|------|
| 需求调研报告 | SYS-RA-RR-001 |

---

## Report Structure Template

```markdown
# 需求调研报告

## 一、执行摘要
## 二、调研背景与目标
## 三、调研方法
## 四、用户访谈总结
## 五、现状分析
## 六、竞品分析
## 七、干系人分析
## 八、需求细化
## 九、用户画像
## 十、业务流程
## 十一、需求优先级
## 十二、结论与建议
## 附录
```

---

## Quality Checklist

- [ ] Executive summary is concise and comprehensive
- [ ] Research methodology is clearly documented
- [ ] All major findings are included
- [ ] Requirements are traceable to sources
- [ ] Priorities are justified
- [ ] Recommendations are actionable
- [ ] Risks are identified
- [ ] Next steps are defined
- [ ] All referenced documents are listed
- [ ] Report has been reviewed by stakeholders

---

## Best Practices

1. **Keep it concise** - Focus on key findings, not raw data
2. **Use visuals** - Tables, charts, and diagrams help understanding
3. **Be objective** - Present facts, not opinions
4. **Link to sources** - Reference detailed documents for deep dives
5. **Prioritize findings** - Highlight the most important discoveries
6. **Make it actionable** - Provide clear recommendations
7. **Get feedback** - Have stakeholders review before finalizing

---

## Common Pitfalls

- **Too much detail** - The report should summarize, not replace detailed docs
- **Missing context** - Ensure readers understand the background
- **Unsubstantiated claims** - Back up findings with evidence
- **Ignoring conflicts** - Document conflicting requirements explicitly
- **No clear recommendations** - Always provide actionable next steps
- **Forgetting risks** - Identify potential issues early
