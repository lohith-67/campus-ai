"""Incident data service."""

from __future__ import annotations
from typing import List, Dict, Any

from app.schemas.incidents import IncidentCreate
from app.services.supabase import get_supabase_client

TABLE = "incidents"


class IncidentService:
    @staticmethod
    def create(incident: IncidentCreate, user_uid: str, now: str) -> str:
        supabase = get_supabase_client()
        doc_data = {
            "title": incident.title,
            "description": incident.description,
            "location": incident.location,
            "category": incident.category.value if hasattr(incident.category, 'value') else incident.category,
            "priority": incident.priority.value if hasattr(incident.priority, 'value') else incident.priority,
            "status": "open",
            "reporter_id": user_uid if user_uid != "demo-user" else None,
            "image_url": incident.image_url or "",
            "resolution_notes": "",
        }
        
        # If demo mode, just mock it
        if not supabase or user_uid == "demo-user":
            return "demo-incident-id"

        response = supabase.table(TABLE).insert(doc_data).execute()
        
        # Handle audit trail separately
        if response.data:
            incident_id = response.data[0]["id"]
            supabase.table("audit_logs").insert({
                "entity_type": "incident",
                "entity_id": incident_id,
                "action": "created",
                "actor_id": user_uid,
                "details": "Incident reported"
            }).execute()
            return incident_id
        return ""

    @staticmethod
    def list_all(category: str | None, priority: str | None, status: str | None, limit: int) -> List[Dict[str, Any]]:
        supabase = get_supabase_client()
        if not supabase:
            return []
            
        query = supabase.table(TABLE).select("*")
        
        if category:
            query = query.eq("category", category)
        if priority:
            query = query.eq("priority", priority)
        if status:
            query = query.eq("status", status)

        query = query.order("created_at", desc=True).limit(limit)
        response = query.execute()
        return response.data

    @staticmethod
    def get_by_id(incident_id: str) -> Dict[str, Any] | None:
        supabase = get_supabase_client()
        if not supabase:
            return None
            
        response = supabase.table(TABLE).select("*").eq("id", incident_id).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None

    @staticmethod
    def update(incident_id: str, update_data: Dict[str, Any], user_uid: str, now: str) -> bool:
        supabase = get_supabase_client()
        if not supabase:
            return False
            
        if "audit_trail" in update_data:
            del update_data["audit_trail"]
            
        response = supabase.table(TABLE).update(update_data).eq("id", incident_id).execute()
        if response.data and len(response.data) > 0:
            supabase.table("audit_logs").insert({
                "entity_type": "incident",
                "entity_id": incident_id,
                "action": "updated",
                "actor_id": user_uid,
                "details": f"Updated fields: {', '.join(update_data.keys())}"
            }).execute()
            return True
        return False
