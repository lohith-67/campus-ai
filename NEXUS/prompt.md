# MASTER BUILD PROMPT — NEXUS
## Intelligent Campus Operations Platform

You are the lead product engineer, UI/UX designer, AI engineer, security engineer, and QA engineer responsible for building a complete hackathon-ready application called:

# NEXUS
### Intelligent Campus Operations

Build NEXUS as a polished, production-style prototype for the **Smart Campus Solutions** problem statement.

The goal is NOT to create a generic chatbot or a simple complaint-management CRUD application.

NEXUS should act as an **intelligent operating layer for a college campus** that understands student and staff requests, identifies the correct campus operation involved, retrieves relevant information, and when appropriate performs or initiates the required workflow.

The final product must feel like a realistic next-generation university platform and must be impressive during a live hackathon demonstration.

---

# 1. CORE PROBLEM

Universities face multiple operational problems:

- inefficient classroom and lab utilization
- difficulty finding available campus resources
- maintenance and infrastructure issues
- delays in routing campus problems to the correct department
- fragmented campus information
- academic/faculty-related service requests
- accessibility and safety issues
- poor visibility into the status of submitted requests
- inefficient communication between students, faculty and administration
- difficulty identifying patterns in recurring campus problems

NEXUS should provide a single intelligent interface through which students and staff can:

- report problems
- ask campus-related questions
- request resources
- find available classrooms/labs
- submit academic or administrative requests
- report safety/accessibility concerns
- upload images when useful
- interact through natural language
- track requests
- receive notifications
- obtain actionable campus information

The user should NOT need to know which department handles their issue.

NEXUS must determine the appropriate category and workflow automatically.

---

# 2. PRODUCT VISION

NEXUS should feel like:

> "The intelligence layer of the campus."

The platform connects:

Student
Faculty
Administration
Maintenance
Classrooms
Labs
Campus Resources
Campus Information
Safety
Accessibility
Operational Data

through one intelligent system.

The fundamental interaction should be:

USER INPUT
→ AI UNDERSTANDING
→ INTENT DETECTION
→ DATA RETRIEVAL / TOOL SELECTION
→ AUTOMATED ACTION OR RESPONSE
→ HUMAN OVERSIGHT WHEN REQUIRED
→ STATUS TRACKING
→ NOTIFICATION

NEXUS must demonstrate genuine AI-assisted workflows rather than simply generating text.

---

# 3. PRIMARY USER EXPERIENCE

Users should be able to interact naturally.

Examples:

### Example 1 — Maintenance

User:

"The AC in Room 304 isn't working and there are around 70 students in the class."

NEXUS should identify:

Category: Maintenance
Issue: AC Failure
Location: Room 304
Severity: High
Affected People: Approximately 70
Responsible Department: Facilities / Maintenance

Then create a structured incident and route it appropriately.

---

### Example 2 — Infrastructure

User uploads a photo and says:

"There is water leaking near B Block, second floor."

NEXUS should:

- analyze the image
- understand the description
- identify the issue
- determine severity
- associate the provided campus location
- create an incident
- assign the correct department
- notify the responsible staff
- allow the student to track progress

---

### Example 3 — Classroom utilization

User:

"We need a room for 40 students tomorrow from 2 PM to 4 PM."

NEXUS should:

- understand the request
- check classroom/resource data
- consider capacity
- consider availability
- recommend suitable rooms
- show the reason for the recommendation
- optionally initiate a booking/approval workflow

---

### Example 4 — Campus information

User:

"Which lab is currently available?"

NEXUS should retrieve current campus data and answer from the database.

Do NOT hallucinate campus information.

---

### Example 5 — Academic/service request

User:

"Our classroom has been changed but nobody knows the new room."

NEXUS should determine the relevant academic/classroom workflow and retrieve the correct information.

---

### Example 6 — Safety/accessibility

User:

"The accessible entrance near the library is blocked."

NEXUS should classify this as an accessibility/safety issue and escalate it appropriately.

---

# 4. CORE MODULES

Build the following modules.

## A. Student Portal

Students should be able to:

- sign in
- view personal dashboard
- submit requests/issues
- upload an image
- enter text
- optionally use voice input
- provide a nearby location/landmark
- track request status
- view notifications
- ask the AI campus assistant
- view available resources
- view relevant campus information

---

## B. Faculty Portal

Faculty should be able to:

- report operational issues
- request classrooms/resources
- view relevant academic/resource information
- track requests
- view classroom/resource availability
- interact with NEXUS AI
- escalate or approve selected requests where appropriate

---

## C. Admin / Operations Dashboard

Admins should have a command center showing:

- active incidents
- high-priority issues
- pending requests
- classroom utilization
- resource availability
- department workload
- response/resolution statistics
- recurring issue patterns
- recent activity
- AI-generated operational insights

Provide filters such as:

- category
- department
- severity
- status
- date
- location
- requester type

---

# 5. REQUEST / ISSUE CATEGORIES

NEXUS should support at minimum:

1. Maintenance & Infrastructure
2. Classroom / Lab / Resource Utilization
3. Academic / Faculty / Administrative Services
4. Campus Information
5. Safety & Accessibility
6. Energy / Resource Efficiency

Do not create six completely separate applications.

Create ONE unified interaction system with category-aware workflows.

---

# 6. AI ARCHITECTURE

Use **Google Gemini API** as the primary AI layer.

Use Gemini for:

- intent detection
- natural-language understanding
- image understanding
- issue classification
- severity assessment
- request summarization
- campus question answering
- structured extraction
- operational recommendations
- agentic tool selection
- response generation

Use **Gemini Function Calling / Tool Calling** for actions.

The model must not directly modify the database.

Instead:

USER
→ GEMINI
→ TOOL DECISION
→ BACKEND VALIDATION
→ TOOL EXECUTION
→ DATABASE
→ RESULT
→ GEMINI / UI

Example tools:

- create_incident()
- update_incident()
- classify_request()
- find_available_room()
- check_resource_availability()
- create_booking_request()
- assign_department()
- notify_staff()
- get_request_status()
- get_campus_information()
- get_utilization_data()
- generate_admin_summary()

All tools must have backend-side authorization and validation.

Never blindly trust AI-generated parameters.

---

# 7. HUMAN OVERSIGHT

NEXUS must not silently perform high-impact actions.

For actions such as:

- final room booking
- sensitive faculty-related actions
- high-priority escalations
- administrative changes
- destructive actions

use appropriate human approval.

The UI should clearly communicate:

AI suggestion
→ requires approval
→ approved
→ action executed

This demonstrates responsible AI.

---

# 8. LOCATION MODEL

Do NOT make Google Maps or GPS mandatory.

The campus is small and may be undergoing construction.

Use a **landmark-based campus location model**.

Allow the user to specify:

- building
- block
- floor
- room
- nearby landmark
- free-text description

Examples:

"B Block, 2nd floor, near Room 208"

"Near library entrance"

"Behind the canteen"

"Main building, first floor"

Support optional image upload.

Design the architecture so precise geolocation can be added later without requiring it now.

---

# 9. FRONTEND — VERY HIGH PRIORITY

The frontend must be one of the strongest parts of the project.

Do NOT create a generic dashboard made of plain cards and tables.

The interface should feel like a **futuristic intelligent university command center**.

Visual direction:

- premium
- futuristic
- academic
- intelligent
- clean
- interactive
- cinematic but usable
- subtle sci-fi aesthetic
- modern glass / depth effects
- strong typography
- smooth transitions
- responsive
- accessible

Avoid excessive cyberpunk styling.

The design should feel like:

"the future of a university"

not:

"a gaming dashboard".

---

# 10. FRONTEND TECHNOLOGY

Use:

- React
- Vite
- TypeScript
- Tailwind CSS
- Lucide React
- modern CSS animations
- Framer Motion if useful
- Three.js / React Three Fiber only where it meaningfully improves the experience

Do NOT add a heavy 3D framework everywhere.

Performance matters.

3D should be progressive and graceful.

If 3D is unavailable or too expensive on a device, provide a beautiful 2D fallback.

---

# 11. HERO / LANDING PAGE

Create a visually impressive landing page.

Possible concept:

A stylized interactive digital representation of a university campus.

The campus can contain:

- animated buildings
- activity indicators
- floating operational nodes
- subtle ambient motion
- glowing pathways
- interactive hotspots

Central message:

# NEXUS
### Intelligent Campus Operations

Supporting message:

> Connect. Understand. Act.

Primary CTA:

> Enter NEXUS

Secondary CTA:

> Explore Campus Intelligence

Do not overload the landing page with text.

The first impression should be visual.

---

# 12. MAIN DASHBOARD

Create a command-center style dashboard.

Possible structure:

TOP:
NEXUS branding + user profile + notification center

CENTER:
Interactive campus visualization / operational visualization

SIDE / FLOATING PANELS:

- Open Issues
- High Priority
- Available Rooms
- Active Requests
- Campus Activity

BOTTOM / PRIMARY INTERACTION:

A prominent AI interaction bar:

> "How can NEXUS help you today?"

with:

- text input
- microphone
- image upload
- suggested actions

Suggested prompts:

"Find an available lab"
"Report a maintenance issue"
"Check my requests"
"Show today's room availability"

---

# 13. VISUAL CAMPUS REPRESENTATION

Create an interactive campus visualization.

It does NOT have to be a geographically accurate map.

It can be a stylized digital campus model.

Represent:

- buildings
- rooms/resources
- incidents
- activity
- availability
- operational alerts

Interactions:

click a building
→ show details

click an incident
→ show incident panel

hover a resource
→ show status

Use animation carefully.

The visual should support the product rather than distract from it.

---

# 14. REQUEST CREATION EXPERIENCE

Create a polished multi-modal request flow.

User can:

- type issue
- upload image
- optionally use microphone
- provide location
- choose or let AI infer category

Before submission show an AI-generated preview:

"Here's what I understood"

Example:

Issue:
Air conditioning failure

Location:
B Block, Room 304

Priority:
High

Reason:
Large number of students affected.

Then:

[Submit Request]

This gives the user confidence and demonstrates explainable AI.

---

# 15. IMAGE ANALYSIS

Allow users to upload images for relevant problems.

Examples:

- broken projector
- damaged furniture
- water leakage
- blocked accessibility route
- unsafe infrastructure
- waste accumulation
- classroom equipment issue

Validate:

- file type
- file size
- upload permissions

Never expose raw storage URLs unnecessarily.

Show AI analysis clearly.

---

# 16. VOICE INTERACTION

Support voice input when feasible.

Example:

User says:

"There is a problem with the projector in room 204."

Convert speech to text.

Then process through the normal NEXUS workflow.

Provide a visible text fallback.

Voice must never be the only way to perform a task.

---

# 17. AI CAMPUS ASSISTANT

Create a dedicated NEXUS AI assistant.

It should answer questions using real application data.

Examples:

- "Which labs are free?"
- "What requests have I submitted?"
- "What are the open high-priority issues?"
- "Who handles this type of request?"
- "How many classrooms are underutilized?"

Use retrieval from the application's real database.

Never invent campus facts.

When data is unavailable, clearly say that the system does not have the required information.

---

# 18. RESOURCE UTILIZATION MODULE

Create a realistic prototype for:

- classrooms
- labs
- seminar halls
- meeting rooms
- selected campus resources

Store:

- capacity
- schedule
- availability
- current status
- department/owner

Provide visual analytics.

Examples:

Room utilization percentage
Capacity vs actual usage
Peak usage periods
Underutilized rooms

Create simple but impressive charts.

---

# 19. INCIDENT MANAGEMENT

Every issue becomes a structured entity.

Example:

INC-1042

Fields:

- ID
- title
- description
- category
- location
- severity
- requester
- assigned department
- assigned person
- created time
- updated time
- status
- evidence/image
- AI analysis
- audit trail

Status flow:

Reported
→ AI Analyzed
→ Assigned
→ In Progress
→ Resolved
→ Closed

Provide a timeline visualization.

---

# 20. ADMIN ANALYTICS

Create an analytics dashboard with meaningful metrics.

Examples:

- total requests
- open requests
- resolution rate
- average response time
- average resolution time
- requests by category
- requests by building
- high-priority incidents
- resource utilization
- recurring problems

Provide AI-generated insights such as:

> "Block B has the highest number of maintenance requests this month."

or:

> "Room A101 is consistently underutilized during afternoon hours."

Only generate insights from actual available data.

---

# 21. DATABASE

Use **Firebase Firestore**.

Suggested collections:

users
incidents
requests
resources
rooms
bookings
departments
notifications
campus_information
audit_logs

Design the data model properly.

Avoid unnecessary duplication.

Add timestamps.

Use structured status fields.

---

# 22. AUTHENTICATION AND ROLES

Use Firebase Authentication.

Roles:

student
faculty
staff
admin

Implement role-based permissions.

Examples:

Student:
- create requests
- view own requests
- view permitted campus information

Faculty:
- create requests
- view relevant resources
- manage permitted bookings/requests

Staff:
- view assigned operational tasks
- update permitted task states

Admin:
- manage operations
- view analytics
- assign tasks
- access administrative information

Do not rely only on frontend role checks.

Enforce authorization on the backend and database rules.

---

# 23. SECURITY

Security is a judging criterion.

Implement:

- Firebase Authentication
- role-based access control
- secure Firestore rules
- server-side validation
- Pydantic validation
- environment-based secrets
- no hard-coded API keys
- secure file upload validation
- file size limits
- request rate limiting
- input sanitization
- audit logs
- basic prompt-injection defenses
- authorization before tool execution
- AI tool parameter validation
- safe error messages
- avoid exposing internal stack traces

Never place secrets into GitHub.

Use `.env` locally and environment variables in deployment.

---

# 24. PROMPT INJECTION DEFENSE

The AI should treat user-supplied content and uploaded documents/images as untrusted input.

Do not allow user text to override:

- system policies
- authorization
- tool permissions
- security controls

Before executing sensitive tools:

1. validate authenticated user
2. validate requested action
3. validate tool parameters
4. validate user permissions
5. execute
6. record audit event

---

# 25. ACCESSIBILITY

Accessibility is part of the evaluation.

Implement:

- semantic HTML
- keyboard navigation
- visible focus states
- appropriate ARIA labels
- sufficient contrast
- text alternatives
- responsive layouts
- accessible forms
- readable typography
- reduced-motion support
- captions/transcripts for voice features
- status communication that does not rely only on color

Provide an accessible fallback to all major interactive features.

---

# 26. PERFORMANCE / EFFICIENCY

The product must remain lightweight.

Avoid:

- unnecessary API calls
- unnecessary AI calls
- huge frontend bundles
- repeated database reads
- unnecessary 3D rendering
- storing large files in the repository

Use:

- lazy loading
- caching where appropriate
- pagination
- debouncing
- structured AI responses
- lightweight animations
- optimized images

Do not call Gemini when a deterministic rule/database query can answer the request.

Example:

"Is Room A101 available?"

This should primarily query the database.

Do not send every simple availability check to Gemini.

---

# 27. TESTING

Implement actual automated tests.

Use:

### Backend
Pytest

### End-to-end
Playwright

Test at minimum:

- authentication
- role permissions
- incident creation
- invalid input
- image validation
- resource availability
- request status tracking
- AI tool flow
- unauthorized tool access
- malformed requests
- duplicate submissions
- edge cases

Create a visible test summary in the README.

---

# 28. API / BACKEND

Use:

Python
FastAPI
Pydantic

Structure the backend cleanly.

Suggested architecture:

backend/
  app/
    api/
    services/
    models/
    schemas/
    agents/
    security/
    utils/
    tests/

Keep business logic out of route handlers.

Create reusable services.

Use strong typing.

Return consistent API responses.

Handle errors gracefully.

---

# 29. DEPLOYMENT

Use Docker where useful.

Deploy the backend using Google Cloud Run.

The frontend should be deployed using an appropriate lightweight production hosting approach.

The final system must have a production-style deployment path.

Do not make the architecture unnecessarily complicated.

---

# 30. GOOGLE TECHNOLOGIES

Use Google technology meaningfully.

Primary integrations:

### Google Gemini
AI reasoning, image analysis, structured outputs, function calling

### Firebase
Authentication
Firestore
Storage
Notifications
App Check where appropriate

### Google Cloud Run
Backend deployment

Do NOT force Google Maps into the project.

The campus should use landmark-based location input instead of requiring precise geographic mapping.

---

# 31. UI DESIGN SYSTEM

Create a cohesive visual system.

Suggested direction:

Background:
deep neutral / dark campus-tech aesthetic

Primary accent:
electric blue / cyan family

Secondary:
subtle violet or teal

Use gradients sparingly.

Use glass effects carefully.

Use consistent:

- corner radius
- shadows
- spacing
- typography
- iconography
- transitions

Animations should communicate state, hierarchy, or interaction.

Never animate everything.

---

# 32. RESPONSIVE DESIGN

Support:

desktop
laptop
tablet
mobile

The main dashboard must remain usable on smaller screens.

The 3D/visual campus representation must degrade gracefully on mobile.

---

# 33. COLLEGE CUSTOMIZATION

Keep college-specific information configurable.

Do not hard-code everything into components.

Create a configuration layer for:

- college name
- logo
- campus name
- blocks
- rooms
- landmarks
- departments
- branding colors
- campus information

I may provide a real college photograph later.

When the image is provided, use it where appropriate for the visual identity or campus representation.

Do not invent architectural details that are not visible or confirmed.

---

# 34. DEMO DATA

Create realistic seeded demo data.

Include:

- several buildings
- classrooms
- labs
- resources
- users
- maintenance incidents
- academic requests
- room availability
- notifications
- analytics data

The demo must look alive immediately after startup.

Do not use empty dashboards.

Use realistic but clearly synthetic data.

---

# 35. DEMO SCENARIO

The final application should support a strong live demonstration.

Demo flow:

1. Login as a student.
2. Student reports a campus problem.
3. Upload image.
4. Enter natural-language description.
5. Enter nearby location.
6. NEXUS analyzes the request.
7. Show "Here's what I understood".
8. Submit.
9. Incident is created.
10. Admin dashboard updates.
11. Admin sees AI classification and severity.
12. Incident is assigned.
13. Staff updates status.
14. Student receives notification.
15. Show final resolution timeline.
16. Demonstrate a classroom/resource availability query.
17. Demonstrate an AI campus-information query.
18. Demonstrate analytics/operational insights.

The entire demo should be understandable without explaining the code.

---

# 36. JUDGING CRITERIA OPTIMIZATION

Explicitly optimize NEXUS for:

## Code Quality
- modular architecture
- typed code
- clean naming
- reusable components
- separation of concerns
- meaningful comments only where necessary

## Security
- authentication
- authorization
- validation
- secure tools
- secret management
- audit logs
- safe AI interactions

## Testing
- unit tests
- API tests
- end-to-end tests
- security tests

## Efficiency
- minimize AI calls
- optimize queries
- optimize images
- lazy-load heavy UI
- control 3D rendering
- cache appropriately

## Accessibility
- keyboard navigation
- screen readers
- contrast
- responsive UI
- reduced motion
- non-color-only status communication

## Google Services
Meaningful use of:
- Gemini
- Firebase
- Cloud Run

## Problem Statement Alignment
The product must clearly solve:
- classroom/resource utilization
- maintenance
- campus information access
- operational requests
- accessibility/safety

## Real-World Interaction
Demonstrate:
- real requests
- uploaded images
- natural-language input
- automated workflow
- status updates
- notifications
- actual persistent data

---

# 37. REPOSITORY CONSTRAINTS

This project will be evaluated under strict repository requirements.

The GitHub repository must:

- be PUBLIC
- contain ONLY ONE BRANCH
- remain under 10 MB
- ideally target less than 5 MB
- contain no secrets
- contain no unnecessary generated files

Repository should NOT include:

node_modules
venv
.env
large datasets
large model files
large videos
large archives
build artifacts
unnecessary binaries

Create a proper `.gitignore`.

Keep the repository clean.

---

# 38. README

Create a polished README that includes:

1. NEXUS introduction
2. Problem statement
3. Solution
4. Key features
5. Architecture
6. AI workflow
7. Technology stack
8. Google services
9. Security
10. Accessibility
11. Testing
12. Setup instructions
13. Environment variables
14. Deployment
15. Demo flow
16. Screenshots
17. Future scope

Use diagrams where useful.

The README should make the project understandable within a few minutes.

---

# 39. CODE QUALITY RULES

Do not create fake implementations.

Do not create buttons that do nothing.

Do not use placeholder text in important workflows.

Do not hard-code fake AI responses when the feature claims to be AI-powered.

Do not expose API keys.

Do not duplicate large blocks of code.

Do not build unnecessary features merely to increase feature count.

Prioritize working end-to-end flows.

Where a complex production feature cannot reasonably be completed, build a clean, honest prototype implementation rather than a fake simulation.

---

# 40. DEVELOPMENT STRATEGY

Build in this order:

PHASE 1
Project setup + architecture

PHASE 2
Authentication + roles

PHASE 3
Core database models

PHASE 4
Student reporting/request workflow

PHASE 5
Gemini integration

PHASE 6
Tool calling / autonomous workflow

PHASE 7
Admin dashboard

PHASE 8
Resource/classroom utilization

PHASE 9
Notifications

PHASE 10
Accessibility + security hardening

PHASE 11
Testing

PHASE 12
Visual polish + animations + 3D experience

PHASE 13
Performance optimization

PHASE 14
README + deployment preparation

PHASE 15
Final evaluation checklist

Do not prematurely optimize visual effects before the core workflow works.

---

# 41. AGENT BEHAVIOR

Act as a senior autonomous engineer.

Do not repeatedly ask me for trivial decisions.

When a reasonable decision is possible, make it yourself.

Prefer simple, robust implementations.

Do not introduce unnecessary libraries.

Do not change the core architecture without a strong reason.

Before implementing a new dependency, ask whether an existing dependency can solve the problem.

Prioritize:

1. working product
2. reliability
3. security
4. evaluation criteria
5. visual polish
6. advanced features

---

# 42. FINAL QUALITY GATE

Before considering the project complete, verify:

[ ] Application starts successfully
[ ] Authentication works
[ ] Roles work
[ ] Student workflow works
[ ] Faculty workflow works
[ ] Admin workflow works
[ ] Image upload works
[ ] AI analysis works
[ ] Tool calling works
[ ] Database persistence works
[ ] Notifications work
[ ] Resource availability works
[ ] Analytics work
[ ] Security protections work
[ ] Accessibility checks pass
[ ] Automated tests pass
[ ] Production build succeeds
[ ] No secrets committed
[ ] Repository is lightweight
[ ] Repository has only one branch
[ ] README is complete
[ ] Demo scenario works end-to-end

---

# 43. MOST IMPORTANT PRODUCT PRINCIPLE

Do not build NEXUS as:

"Chatbot + dashboard."

Build it as:

# "AI + campus data + tools + actions + human oversight."

The user should feel:

> "I tell NEXUS what I need, and it figures out what should happen next."

The evaluator should feel:

> "This is a real campus operating system prototype, not just an AI wrapper."

Build NEXUS with that standard.