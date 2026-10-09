"""Authentication and user management routes."""

from __future__ import annotations
import asyncio
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.security.auth import get_current_user, require_role
from app.services.supabase import get_supabase_client

router = APIRouter()


# ── Schemas ──────────────────────────────────────────────────────────

class UserProfile(BaseModel):
    """Public user profile."""
    id: str
    email: str
    name: str = ""
    role: str = "student"


class UserProfileUpdate(BaseModel):
    """Fields the user can update on their profile."""
    name: str | None = None


# ── Routes ───────────────────────────────────────────────────────────

@router.get("/me", response_model=UserProfile)
def get_my_profile(user: dict = Depends(get_current_user)):
    """Return the authenticated user's profile."""
    supabase = get_supabase_client()
    if not supabase or user.get("id") == "demo-user":
        return UserProfile(id="demo-user", email="student@nexus.demo", name="Demo User", role="student")
        
    response = supabase.table("profiles").select("*").eq("id", user["id"]).execute()
    data = response.data
    if not data or len(data) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")
        
    return UserProfile(
        id=data[0]["id"],
        email=data[0]["email"],
        name=data[0]["name"],
        role=data[0]["role"]
    )


@router.put("/me", response_model=UserProfile)
def update_my_profile(
    update: UserProfileUpdate,
    user: dict = Depends(get_current_user),
):
    """Update the authenticated user's profile."""
    supabase = get_supabase_client()
    if not supabase or user.get("id") == "demo-user":
        return UserProfile(id="demo-user", email="student@nexus.demo", name="Demo User", role="student")
        
    data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
        
    response = supabase.table("profiles").update(data).eq("id", user["id"]).execute()
    result = response.data
    if not result or len(result) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")
        
    return UserProfile(
        id=result[0]["id"],
        email=result[0]["email"],
        name=result[0]["name"],
        role=result[0]["role"]
    )


@router.post("/register")
def register_user(user: dict = Depends(get_current_user)):
    """Create a profile for a newly authenticated user."""
    # Supabase uses a Postgres Trigger (handle_new_user) to do this automatically upon signup in auth.users.
    # However, if we need to manually trigger it or sync it, we can do it here.
    supabase = get_supabase_client()
    if not supabase or user.get("id") == "demo-user":
        return {"message": "User registered (demo)", "uid": "demo-user"}

    # Just check if exists
    response = supabase.table("profiles").select("*").eq("id", user["id"]).execute()
    if response.data and len(response.data) > 0:
        return {"message": "User already registered"}
        
    profile = {
        "id": user["id"],
        "email": user.get("email", ""),
        "name": user.get("user_metadata", {}).get("name", user.get("email", "")),
        "role": "student",  # default role; admin can upgrade
    }
    supabase.table("profiles").insert(profile).execute()
    return {"message": "User registered", "uid": user["id"]}
