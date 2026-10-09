import os
from supabase import create_client, Client
from app.config import get_settings

settings = get_settings()

def get_supabase_client() -> Client:
    # Use anon key for general client auth tasks, but backend typically uses service role for bypassing RLS when necessary.
    # However, for validating tokens via get_user, anon key or service role key works.
    url = settings.supabase_url
    key = settings.supabase_service_role_key or "your-supabase-service-role-key"
    
    # We initialize the client if the URL is provided
    if url and url != "https://your-project.supabase.co":
        return create_client(url, key)
    else:
        return None
