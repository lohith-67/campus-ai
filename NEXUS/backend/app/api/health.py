"""Health check endpoint."""

from __future__ import annotations

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """Simple health check returning application status."""
    return {
        "status": "healthy",
        "service": "nexus-backend",
        "version": "1.0.0",
    }
