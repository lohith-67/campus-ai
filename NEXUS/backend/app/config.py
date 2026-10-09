"""Application configuration loaded from environment variables."""

from __future__ import annotations

import os
from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Central configuration for the NEXUS backend.

    Values are loaded from environment variables or a `.env` file located
    in the backend directory.
    """

    # ── Application ──────────────────────────────────────────────────
    app_name: str = "NEXUS"
    app_version: str = "1.0.0"
    debug: bool = False
    environment: str = Field(default="development", description="development | staging | production")

    # ── CORS ─────────────────────────────────────────────────────────
    cors_origins: list[str] = Field(
        default=["http://localhost:5173", "http://localhost:3000"],
        description="Allowed CORS origins",
    )

    # ── Supabase ─────────────────────────────────────────────────────
    supabase_url: str = ""
    supabase_service_role_key: str = ""

    # ── Google Gemini ────────────────────────────────────────────────
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"

    # ── Rate Limiting ────────────────────────────────────────────────
    rate_limit_requests: int = 60
    rate_limit_window_seconds: int = 60

    # ── File Upload ──────────────────────────────────────────────────
    max_upload_size_mb: int = 10
    allowed_image_types: list[str] = Field(
        default=["image/jpeg", "image/png", "image/webp"],
    )

    model_config = {
        "env_file": os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
    }


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance."""
    return Settings()
