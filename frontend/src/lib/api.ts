import { ApiRoutes } from '@server/http/server';
import { hc } from 'hono/client';

const client = hc<ApiRoutes>('/')

export const api = client.api

export async function getCurrentUser() {
  const res = await api.auth.me.$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}