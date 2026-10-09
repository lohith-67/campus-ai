"""Room and resource models and schemas."""

from __future__ import annotations

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class RoomStatus(str, Enum):
    """Status of a room."""
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    MAINTENANCE = "maintenance"
    RESERVED = "reserved"


class RoomBase(BaseModel):
    """Shared properties for a room."""
    name: str = Field(..., description="E.g., 101, Lecture Hall A")
    building: str = Field(..., description="E.g., Main Building")
    capacity: int = Field(..., gt=0)
    resources: List[str] = Field(default_factory=list, description="E.g., ['Projector', 'Whiteboard']")
    status: RoomStatus = RoomStatus.AVAILABLE
    current_event: Optional[str] = None


class RoomCreate(RoomBase):
    """Payload to create a new room."""
    pass


class RoomUpdate(BaseModel):
    """Payload to update a room's status or details."""
    status: Optional[RoomStatus] = None
    current_event: Optional[str] = None
    capacity: Optional[int] = None
    resources: Optional[List[str]] = None


class RoomResponse(RoomBase):
    """Public room data."""
    id: str


class BookingCreate(BaseModel):
    """Request to book a room."""
    room_id: str
    date: str = Field(..., description="YYYY-MM-DD")
    start_time: str = Field(..., description="HH:MM (24h)")
    end_time: str = Field(..., description="HH:MM (24h)")
    purpose: str = Field(..., min_length=3, max_length=500)
    expected_attendees: int = Field(..., ge=1)

