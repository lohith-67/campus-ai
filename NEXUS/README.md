# NEXUS — Intelligent Campus Operations

**NEXUS** is an intelligent operating layer for college campuses that understands student and staff requests, identifies the correct campus operation involved, retrieves relevant information, and executes the required workflow autonomously.

It moves beyond standard CRUDS and generic chatbots by acting as an intelligent system that connects Students, Faculty, Administration, Maintenance, and Campus Resources into one seamless platform powered by **Google Gemini**.

## Problem Statement

Universities face fragmented operational problems:
- Inefficient classroom and lab utilization
- Difficulties finding available campus resources
- Maintenance and infrastructure issues with poor tracking
- Delays in routing problems to the correct department
- Fragmented campus information

Currently, students and faculty must navigate multiple portals, apps, or physical offices just to report an AC failure or find an available lab.

## The Solution: NEXUS

NEXUS provides a single, intelligent interface. The user does not need to know *who* handles their issue. They just tell NEXUS.

**Core Interactions:**
- **Report Problems:** Multi-modal (text, voice, image) reporting with landmark-based location.
- **Find Resources:** Query live utilization data to find available labs and classrooms.
- **Automated Workflow:** The Gemini AI layer automatically classifies, assesses severity, and routes incidents.
- **Actionable AI:** Gemini uses function calling to automatically create incidents or book rooms directly on the backend database.

### Key Features
1. **Intelligent Command Center:** A futuristic UI providing a real-time overview of campus operations, incident trends, and resource utilization.
2. **Gemini Function Calling:** The NEXUS Assistant doesn't just talk; it acts. It can query room availability and submit structured incidents to the database autonomously.
3. **Multi-Modal Requests:** Upload photos of maintenance issues for the AI to analyze, or use natural language to describe the problem.
4. **Role-Based Workflows:** Tailored experiences for Students, Faculty, Staff, and Admins.
5. **Analytics & Insights:** AI-generated operational insights highlighting resource bottlenecks and recurring issues.

## Tech Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Python, FastAPI, Pydantic
- **AI Layer:** Google Gemini API (`gemini-2.0-flash`)
- **Database / Auth:** Supabase PostgreSQL, Supabase Auth
- **Deployment:** Google Cloud Run (Backend), Vercel (Frontend)

## Local Setup

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .\.venv\Scripts\activate
pip install -r requirements.txt

# Create a .env file based on .env.example
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY and SUPABASE keys

# Run the backend
python -m uvicorn app.main:app --reload
```

### 2. Frontend (React/Vite)
```bash
cd frontend
npm install

# Create a .env.local file based on .env.example
cp .env.example .env.local
# Edit .env.local and add your Supabase URL and Anon Key

# Run the frontend (runs on http://localhost:5173)
npm run dev
```

*Note: If Supabase credentials are not provided in the frontend `.env.local` or backend `.env`, NEXUS will gracefully fall back into a full-featured "Demo Mode", utilizing mock data and simulated API responses so the platform can still be fully evaluated without setting up a database.*

## Testing Summary
- **Backend Validation:** Comprehensive Pydantic models for Incidents, Rooms, and Bookings to ensure structured data integrity.
- **API Security:** Role-based access control (RBAC) via Supabase Auth dependencies enforces permissions on sensitive endpoints. Row Level Security (RLS) policies are active at the PostgreSQL database level.
- **AI Safety:** The Gemini agent operates via strict Function Declarations, unable to modify data outside of its permitted tools.

---
*Built for the Smart Campus Solutions Hackathon.*
