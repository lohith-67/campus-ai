"""Room and resource availability routes."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.schemas.rooms import BookingCreate, RoomResponse
from app.security.auth import get_current_user, require_role
from app.services.rooms import RoomService, BookingService

router = APIRouter()


# ── Routes ───────────────────────────────────────────────────────────

@router.get("/", response_model=list[dict])
def list_rooms(
    building: str | None = Query(None),
    min_capacity: int | None = Query(None, ge=1),
    room_status: str | None = Query(None, alias="status"),
    user: dict = Depends(get_current_user),
):
    """List rooms with optional filters."""
    return RoomService.list_all(building, room_status, min_capacity)


@router.get("/{room_id}")
def get_room(room_id: str, user: dict = Depends(get_current_user)):
    """Get details for a single room."""
    data = RoomService.get_by_id(room_id)
    if not data:
        raise HTTPException(status_code=404, detail="Room not found")
    return data


@router.get("/{room_id}/bookings")
def get_room_bookings(
    room_id: str,
    date: str | None = Query(None, description="YYYY-MM-DD"),
    user: dict = Depends(get_current_user),
):
    """Get bookings for a room, optionally filtered by date."""
    return BookingService.get_room_bookings(room_id, date)


@router.post("/bookings", status_code=status.HTTP_201_CREATED)
def create_booking(
    booking: BookingCreate,
    user: dict = Depends(get_current_user),
):
    """Request a room booking (requires approval for confirmed booking)."""
    room_data = RoomService.get_by_id(booking.room_id)
    if not room_data:
        raise HTTPException(status_code=404, detail="Room not found")

    if booking.expected_attendees > room_data.get("capacity", 0):
        raise HTTPException(
            status_code=400,
            detail=f"Room capacity ({room_data.get('capacity', 0)}) is less than expected attendees ({booking.expected_attendees})",
        )

    now = datetime.now(timezone.utc).isoformat()
    user_name = user.get("name", user.get("email", ""))
    
    doc_id = BookingService.create(booking, room_data.get("name", ""), user.get("id", "demo"), user_name, now)
    
    return {"id": doc_id, "message": "Booking request submitted", "status": "pending_approval"}
