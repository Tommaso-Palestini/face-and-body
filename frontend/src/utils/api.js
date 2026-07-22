import { API_BASE } from '../config';

export async function apiFetch(path, token, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errore = await res.json().catch(() => null);
    throw new Error(errore?.message || `Errore ${res.status}`);
  }

  // 204 No Content non ha body da parsare
  if (res.status === 204) return null;
  return res.json();
}