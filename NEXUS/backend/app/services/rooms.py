"""Room and booking data service."""

from __future__ import annotations
from typing import List, Dict, Any

from app.schemas.rooms import BookingCreate
from app.services.supabase import get_supabase_client

ROOMS_TABLE = "rooms"
BOOKINGS_TABLE = "bookings"


class RoomService:
    @staticmethod
    def list_all(building: str | None, status: str | None, min_capacity: int | None) -> List[Dict[str, Any]]:
        supabase = get_supabase_client()
        if not supabase:
            return []
            
        query = supabase.table(ROOMS_TABLE).select("*")

        if building:
            query = query.eq("building", building)
        if status:
            query = query.eq("status", status)
        if min_capacity:
            query = query.gte("capacity", min_capacity)

        response = query.execute()
        return response.data

    @staticmethod
    def get_by_id(room_id: str) -> Dict[str, Any] | None:
        supabase = get_supabase_client()
        if not supabase:
            return None
            
        response = supabase.table(ROOMS_TABLE).select("*").eq("id", room_id).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None


class BookingService:
    @staticmethod
    def get_room_bookings(room_id: str, date: str | None) -> List[Dict[str, Any]]:
        supabase = get_supabase_client()
        if not supabase:
            return []
            
        query = supabase.table(BOOKINGS_TABLE).select("*").eq("room_id", room_id)
        if date:
            query = query.eq("date", date)

        response = query.execute()
        return response.data

    @staticmethod
    def create(booking: BookingCreate, room_name: str, user_uid: str, user_name: str, now: str) -> str:
        supabase = get_supabase_client()
        if not supabase or user_uid == "demo-user":
            return "demo-booking-id"
            
        doc_data = {
            "room_id": booking.room_id,
            "requester_id": user_uid,
            "date": booking.date,
            "start_time": booking.start_time,
            "end_time": booking.end_time,
            "purpose": booking.purpose,
            "expected_attendees": booking.expected_attendees,
            "status": "pending_approval",
        }

        response = supabase.table(BOOKINGS_TABLE).insert(doc_data).execute()
        if response.data:
            booking_id = response.data[0]["id"]
            supabase.table("audit_logs").insert({
                "entity_type": "booking",
                "entity_id": booking_id,
                "action": "created",
                "actor_id": user_uid,
                "details": f"Booking requested for {room_name}"
            }).execute()
            return booking_id
        return ""
