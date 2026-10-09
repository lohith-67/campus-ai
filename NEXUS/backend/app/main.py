"""NEXUS – Intelligent Campus Operations Platform.

FastAPI application entry point.
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.api.health import router as health_router
from app.api.auth import router as auth_router
from app.api.incidents import router as incidents_router
from app.api.rooms import router as rooms_router
from app.api.chat import router as chat_router


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    """Initialize services on startup."""
    settings = get_settings()
    
    # Audit for required environment variables (excluding database for demo mode, but Gemini is needed for AI)
    # The requirement says: "Display a clear configuration error if a required environment variable is missing"
    if not settings.gemini_api_key or settings.gemini_api_key == "your-gemini-api-key":
        print("\n[NEXUS ERROR] GEMINI_API_KEY is missing or invalid. Please check your .env file.")
        print("[NEXUS] AI Chat features will be disabled or run in offline mode.\n")
        
    if not settings.supabase_url or settings.supabase_url == "https://your-project.supabase.co":
        print("\n[NEXUS WARNING] Supabase configuration is incomplete. Running in Demo Mode.\n")

    yield


def create_app() -> FastAPI:
    """Application factory."""
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Intelligent Campus Operations Platform",
        lifespan=lifespan,
    )

    # ── CORS ─────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ──────────────────────────────────────────────────────
    app.include_router(health_router, prefix="/api", tags=["Health"])
    app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
    app.include_router(incidents_router, prefix="/api/incidents", tags=["Incidents"])
    app.include_router(rooms_router, prefix="/api/rooms", tags=["Rooms & Resources"])
    app.include_router(chat_router, prefix="/api/chat", tags=["AI Chat"])

    return app


app = create_app()
