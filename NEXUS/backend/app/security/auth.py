"""Supabase Authentication dependency for FastAPI."""

from __future__ import annotations

import asyncio
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.services.supabase import get_supabase_client

_bearer = HTTPBearer()

async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(_bearer),
) -> dict:
    """Verify the Supabase access token and return the user object.

    Raises 401 if the token is invalid or expired.
    """
    supabase = get_supabase_client()
    if not supabase:
        # Fallback for demo mode if Supabase is not configured
        return {"id": "demo-user", "role": "student"}
        
    try:
        # get_user makes a network call to Supabase Auth API
        # We run it in a threadpool to avoid blocking the async event loop
        response = await asyncio.to_thread(supabase.auth.get_user, creds.credentials)
        user = response.user
        if not user:
            raise ValueError("No user returned")
            
        # Convert user object to a dict matching the old format where 'uid' was used
        return {
            "uid": user.id,
            "id": user.id,
            "email": user.email,
            "user_metadata": user.user_metadata
        }
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


async def get_user_role(user: dict = Depends(get_current_user)) -> str:
    """Look up the user's role from Supabase profiles."""
    if user.get("id") == "demo-user":
        return "student"
        
    supabase = get_supabase_client()
    if not supabase:
        return "student"
        
    try:
        # Run synchronous db query in a thread
        response = await asyncio.to_thread(
            lambda: supabase.table("profiles").select("role").eq("id", user["id"]).execute()
        )
        data = response.data
        if data and len(data) > 0:
            return data[0].get("role", "student")
    except Exception as e:
        print(f"Error fetching role: {e}")
        
    return "student"


def require_role(*allowed_roles: str):
    """Return a dependency that enforces role-based access control."""

    async def _check(
        user: dict = Depends(get_current_user),
    ) -> dict:
        if user.get("id") == "demo-user":
            role = "student"
        else:
            supabase = get_supabase_client()
            role = "student"
            if supabase:
                try:
                    response = await asyncio.to_thread(
                        lambda: supabase.table("profiles").select("role").eq("id", user["id"]).execute()
                    )
                    data = response.data
                    if data and len(data) > 0:
                        role = data[0].get("role", "student")
                except Exception as e:
                    print(f"Error fetching role: {e}")

        if role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{role}' is not authorized. Required: {', '.join(allowed_roles)}",
            )
        user["role"] = role
        return user

    return _check
