"""Incident management routes."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.schemas.incidents import IncidentCreate, IncidentResponse, IncidentUpdate
from app.security.auth import get_current_user, require_role
from app.services.incidents import IncidentService

router = APIRouter()


# ── Routes ───────────────────────────────────────────────────────────

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_incident(
    incident: IncidentCreate,
    user: dict = Depends(get_current_user),
):
    """Create a new incident from a user report."""
    now = datetime.now(timezone.utc).isoformat()
    doc_id = IncidentService.create(incident, user["id"], now)
    return {"id": doc_id, "message": "Incident created", "status": "open"}


@router.get("/", response_model=list[dict])
def list_incidents(
    category: str | None = Query(None),
    priority: str | None = Query(None),
    incident_status: str | None = Query(None, alias="status"),
    limit: int = Query(20, ge=1, le=100),
    user: dict = Depends(get_current_user),
):
    """List incidents with optional filters."""
    return IncidentService.list_all(category, priority, incident_status, limit)


@router.get("/{incident_id}")
def get_incident(incident_id: str, user: dict = Depends(get_current_user)):
    """Get a single incident by ID."""
    data = IncidentService.get_by_id(incident_id)
    if not data:
        raise HTTPException(status_code=404, detail="Incident not found")
    return data


@router.patch("/{incident_id}")
def update_incident(
    incident_id: str,
    update: IncidentUpdate,
    user: dict = Depends(require_role("admin", "staff", "faculty")),
):
    """Update an incident (admin/staff/faculty only)."""
    now = datetime.now(timezone.utc).isoformat()
    changes = {k: v.value if hasattr(v, 'value') else v for k, v in update.model_dump().items() if v is not None}
    
    if not changes:
        raise HTTPException(status_code=400, detail="No fields to update")

    success = IncidentService.update(incident_id, changes, user["id"], now)
    if not success:
        raise HTTPException(status_code=404, detail="Incident not found")

    return {"message": "Incident updated", "id": incident_id}
