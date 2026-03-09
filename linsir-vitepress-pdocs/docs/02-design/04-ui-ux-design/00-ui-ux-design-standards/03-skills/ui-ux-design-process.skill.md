---
name: "ui-ux-design-process"
description: "Guides the complete UI/UX design process including user research, information architecture, interaction design, visual design, prototyping, and module design. Invoke when user needs to conduct UI/UX design work or create design documentation."
---

# UI/UX Design Process Skill

This skill guides you through the complete UI/UX design process for enterprise system projects.

## Overview

The UI/UX design process consists of 6 main phases:
1. **User Research** (4-01) - Understanding target users
2. **Information Architecture** (4-02) - Structuring system navigation
3. **Interaction Design** (4-03) - Designing user interactions
4. **Visual Design** (4-04) - Creating visual style and interfaces
5. **Prototype Design** (4-05) - Building interactive prototypes
6. **Module Design** (4-06) - Detailed module interface design

## Phase 1: User Research (4-01)

### Goal
Deeply understand target users to inform design decisions.

### Input
- Business requirements document
- User personas from requirements analysis
- User journey maps
- Pain points and expectations analysis

### Output
7 research documents:
1. `01-user-personas-design.md` - Design-oriented user personas
2. `02-user-behavior-patterns.md` - User behavior pattern analysis
3. `03-interaction-habits-research.md` - Interaction habits research
4. `04-visual-preference-research.md` - Visual preference research
5. `05-design-scenarios.md` - Refined design scenarios
6. `06-design-opportunities.md` - Design opportunities list
7. `07-user-research-review-record.md` - Research review record

### Key Activities
- Extract user characteristics from business requirements
- Analyze user workflows and habits
- Research interaction preferences
- Collect visual preferences
- Define core usage scenarios
- Identify design opportunities
- Compile research report

### Duration
5-7 working days

## Phase 2: Information Architecture (4-02)

### Goal
Build clear system structure and navigation system.

### Input
- User research results
- Business requirements document

### Output
4 architecture documents:
1. `01-site-map.md` - Site map
2. `02-navigation-structure.md` - Navigation structure design
3. `03-content-classification.md` - Content classification system
4. `04-information-architecture-review-record.md` - Architecture review record

### Key Activities
- Identify all functional modules
- Define module hierarchy
- Plan page structure
- Design URL structure
- Plan main navigation
- Design side menu
- Define breadcrumb rules
- Establish content classification

### Duration
3-5 working days

## Phase 3: Interaction Design (4-03)

### Goal
Design how users interact with the system.

### Input
- Information architecture
- User research results

### Output
4 interaction documents:
1. `01-task-flow-design.md` - Task flow design
2. `02-wireframe-design.md` - Wireframe design
3. `03-interaction-specification.md` - Interaction specification
4. `04-interaction-design-review-record.md` - Interaction design review

### Key Activities
- Define user tasks
- Design task steps
- Plan branch flows
- Handle exception flows
- Draw page layouts
- Define element positions
- Annotate interactive elements
- Design responsive layouts
- Describe interaction rules
- Define state changes
- Specify animation effects
- Document feedback mechanisms

### Duration
5-7 working days

## Phase 4: Visual Design (4-04)

### Goal
Design the visual style and interfaces of the system.

### Input
- Interaction design
- User visual preferences

### Output
4 documents + 14 PNGs:
1. `01-design-system.md` + 4 PNGs (color, typography, components, spacing)
2. `02-visual-design.md` + 5 PNGs (login, dashboard, user list, user create, department)
3. `03-mockups-design.md` + 5 PNGs (high-fidelity pages)
4. `04-visual-design-review-record.md` - Visual design review

### Key Activities
- Define color system
- Establish typography
- Design component library
- Define spacing standards
- Design login page
- Design dashboard
- Design list pages
- Design form pages
- Create high-fidelity mockups
- Optimize details
- Design multiple states

### Duration
7-10 working days

## Phase 5: Prototype Design (4-05)

### Goal
Create interactive prototypes to validate design solutions.

### Input
- Visual design
- Interaction design

### Output
3 prototype documents:
1. `01-prototype-specification.md` - Prototype specification
2. `02-interactive-prototype.md` - Interactive prototype documentation
3. `03-prototype-review-record.md` - Prototype review record

### Key Activities
- Define prototype scope
- Determine interaction depth
- Set production standards
- Plan page flows
- Build prototype framework
- Add page transitions
- Implement interaction effects
- Design transition animations
- Document prototype functions
- Explain interaction logic
- Record design decisions

### Duration
5-7 working days

## Phase 6: Module Design (4-06)

### Goal
Detailed design of each functional module's interface and interaction.

### Input
- Prototype design
- Requirements document

### Output
5 module design documents:
1. `01-user-management-module.md` - User management module
2. `02-organization-module.md` - Organization module
3. `03-permission-module.md` - Permission management module
4. `04-system-config-module.md` - System configuration module
5. `05-module-design-review-record.md` - Module design review

### Key Activities
- Design user list pages
- Design user create/edit
- Design user details
- Design batch operations
- Design personal center
- Design department tree
- Design organization chart
- Design role management
- Design permission tree
- Design system configuration
- Design operation logs

### Duration
7-10 working days

## Review Process

Each phase requires a review before proceeding to the next:

1. **Submit for Review** - Prepare review materials
2. **Organize Review Meeting** - Schedule with stakeholders
3. **Review Content** - Check against standards
4. **Decision**:
   - Pass → Proceed to next phase
   - Fail → Record issues → Revise → Resubmit

### Review Participants
- UI/UX Designer (lead)
- Product Manager
- Frontend Lead
- Backend Lead
- User Representative (optional)

## Directory Structure

```
04-ui-ux-design/
├── 00-ui-ux-design-standards/
│   ├── 01-process-diagrams/       # Process flow diagrams
│   ├── 02-process-standards/      # Process standards
│   └── 03-skills/                 # Skill backups
├── 01-user-research/              # Phase 1: User Research
├── 02-information-architecture/   # Phase 2: Information Architecture
├── 03-interaction-design/         # Phase 3: Interaction Design
├── 04-visual-design-manuscript/   # Phase 4: Visual Design
├── 05-prototypes/                 # Phase 5: Prototype Design
└── 06-module-design/              # Phase 6: Module Design
```

## Best Practices

1. **User-Centered** - Always start with user needs
2. **Iterative Design** - Review and refine at each phase
3. **Documentation** - Document all design decisions
4. **Consistency** - Maintain consistency across all modules
5. **Collaboration** - Involve cross-functional teams early
6. **Validation** - Validate designs with real users when possible

## Tools Recommendation

| Purpose | Tools |
|---------|-------|
| User Research | Xtensio, Miro, Questionnaires |
| Information Architecture | XMind, Lucidchart |
| Wireframing | Balsamiq, Axure |
| Visual Design | Figma, Sketch |
| Prototyping | Figma, Principle |
| Documentation | Notion, Confluence |

## Checklist

Use `ui-ux-design-checklist.md` to track progress:
- Document completion status
- Review status
- Deliverable tracking
- Quality checks

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-09 | UI/UX Designer | Initial version |
