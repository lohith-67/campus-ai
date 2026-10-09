/**
 * API client with automatic Supabase Auth token injection.
 * Falls back gracefully when Supabase is not configured.
 */

import { supabase, isConfigured } from '@/lib/supabase';
import { getMockData } from './mockData';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  if (!isConfigured) return {};
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  // Demo Mode Interceptor
  if (!isConfigured) {
    console.log(`[Demo Mode] Intercepted API request to: ${endpoint}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return getMockData(endpoint, options) as T;
  }

  const authHeaders = await getAuthHeaders();
  const { body, headers, ...rest } = options;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail ?? `API Error: ${res.status}`);
  }

  return res.json();
}

// Convenience methods
export const api = {
  get: <T = unknown>(url: string) => apiRequest<T>(url),
  post: <T = unknown>(url: string, body: unknown) =>
    apiRequest<T>(url, { method: 'POST', body }),
  put: <T = unknown>(url: string, body: unknown) =>
    apiRequest<T>(url, { method: 'PUT', body }),
  patch: <T = unknown>(url: string, body: unknown) =>
    apiRequest<T>(url, { method: 'PATCH', body }),
  delete: <T = unknown>(url: string) =>
    apiRequest<T>(url, { method: 'DELETE' }),
};
