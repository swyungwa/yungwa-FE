import { fetchClient } from '../lib/api';
import type { SignupRequest, LoginRequest, AuthData } from '../types/auth';

export async function signup(data: SignupRequest): Promise<AuthData> {
  return fetchClient<AuthData>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginRequest): Promise<AuthData> {
  return fetchClient<AuthData>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function saveSession(data: AuthData): void {
  localStorage.setItem('userId', String(data.userId));
  localStorage.setItem('instagramId', data.instagramId);
}

export function clearSession(): void {
  localStorage.removeItem('userId');
  localStorage.removeItem('instagramId');
}

export function getSession(): AuthData | null {
  const userId = localStorage.getItem('userId');
  const instagramId = localStorage.getItem('instagramId');
  if (!userId || !instagramId) return null;
  return { userId: Number(userId), instagramId };
}
