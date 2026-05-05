import type { ApiResponse, ApiErrorResponse } from '../types/api';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

export type ApiError = Error & { errorCode: string };

export function createApiError(errorCode: string, message: string): ApiError {
  const err = new Error(message) as ApiError;
  err.name = 'ApiError';
  err.errorCode = errorCode;
  return err;
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof Error && err.name === 'ApiError';
}

type FetchClientOptions = RequestInit & {
  auth?: boolean;
};

export async function fetchClient<T>(
  path: string,
  options?: FetchClientOptions,
): Promise<T> {
  const token = localStorage.getItem('token');
  const shouldIncludeAuth = options?.auth !== false;
  const requestOptions: RequestInit = { ...options };
  delete (requestOptions as FetchClientOptions).auth;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(shouldIncludeAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...requestOptions.headers,
    },
  });

  const json: ApiResponse<T> | ApiErrorResponse = await res.json();

  if (!json.success) {
    throw createApiError(json.errorCode, json.message);
  }

  return json.data;
}
