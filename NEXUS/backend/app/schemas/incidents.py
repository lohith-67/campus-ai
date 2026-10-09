"""Incident models and schemas."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class IncidentCategory(str, Enum):
    """Categories of incidents."""
    MAINTENANCE = "maintenance"
    IT = "it"
    CLEANING = "cleaning"
    SECURITY = "security"
    OTHER = "other"


class IncidentStatus(str, Enum):
    """Status lifecycle of an incident."""
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class IncidentPriority(str, Enum):
    """Priority levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class IncidentCreate(BaseModel):
    """Payload to create a new incident."""
    title: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=10)
    location: str
    category: IncidentCategory
    priority: IncidentPriority = IncidentPriority.MEDIUM
    image_url: Optional[str] = None


class IncidentUpdate(BaseModel):
    """Payload to update an incident."""
    status: Optional[IncidentStatus] = None
    priority: Optional[IncidentPriority] = None
    assignee_id: Optional[str] = None
    resolution_notes: Optional[str] = None


class IncidentResponse(BaseModel):
    """Public incident data."""
    id: str
    title: str
    description: str
    location: str
    category: IncidentCategory
    status: IncidentStatus
    priority: IncidentPriority
    reporter_id: str
    assignee_id: Optional[str] = None
    image_url: Optional[str] = None
    resolution_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
