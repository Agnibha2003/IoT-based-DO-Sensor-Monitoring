const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) ? import.meta.env.VITE_API_BASE : 'http://192.168.137.1:5000';

let accessToken: string | null = localStorage.getItem('do_sensor_token');

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('do_sensor_token', token);
  } else {
    localStorage.removeItem('do_sensor_token');
  }
};

const request = async <T = any>(path: string, options: any = {}): Promise<T> => {
  const { query, body, headers, raw, ...rest } = options;
  const url = new URL(path, API_BASE);
  if (query) {
    Object.entries(query).forEach(([key, value]: any) => {
      if (value === undefined || value === null || value === '') return;
      url.searchParams.set(key, String(value));
    });
  }
  
  const init: RequestInit = {
    method: rest.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...headers },
  };
  
  if (accessToken) {
    (init.headers as any)['Authorization'] = `Bearer ${accessToken}`;
  }
  
  if (body) {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  
  const response = await fetch(url.toString(), init);
  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.error || `Request failed (${response.status})`);
  }
  
  if (raw) return response as T;
  return response.json();
};

export async function login(email: string, password: string) {
  const result = await request<{ token: string; user: any }>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  setAccessToken(result.token);
  return result;
}

export async function register(email: string, password: string, name: string) {
  const result = await request<{ token: string; user: any }>('/api/auth/register', {
    method: 'POST',
    body: { email, password, name },
  });
  setAccessToken(result.token);
  return result;
}

export async function forgotPassword(email: string) {
  return request<{ message: string; reset_token?: string }>('/api/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
}

export async function resetPassword(email: string, token: string, newPassword: string) {
  return request<{ message: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: { email, token, newPassword },
  });
}

export async function fetchCurrentUser() {
  return request<{ user: any }>('/api/auth/me');
}

export async function updatePreferences(payload: Record<string, any>) {
  return request<{ user: any }>('/api/auth/preferences', {
    method: 'PATCH',
    body: payload,
  });
}

export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';

export interface ExportOptions {
  format?: ExportFormat;
  metrics?: string[];
  start?: string;
  end?: string;
  includeAnalytics?: boolean;
  includeCharts?: boolean;
  includeRaw?: boolean;
  compression?: boolean;
  sensorId?: string;
}

export async function exportReadings(options: ExportOptions = {}): Promise<Blob> {
  const response = await request<Response>('/api/export/readings', {
    raw: true,
    query: {
      format: options.format || 'csv',
      metrics: options.metrics?.join(',') || undefined,
      start: options.start,
      end: options.end,
      includeAnalytics: options.includeAnalytics ? 'true' : undefined,
      includeCharts: options.includeCharts ? 'true' : undefined,
      includeRaw: options.includeRaw === false ? 'false' : undefined,
      compression: options.compression ? 'true' : undefined,
      sensor_id: options.sensorId,
    },
  });
  return await (response as any).blob();
}

export async function exportReadingsCSV(): Promise<Blob> {
  return exportReadings({ format: 'csv' });
}

export async function exportStatsCSV(): Promise<Blob> {
  const response = await request<Response>('/api/export/stats', { raw: true });
  return await (response as any).blob();
}

export async function getLatestReading() {
  const resp = await request(`/api/readings/latest`);
  return resp;
}

export async function getStats() {
  const resp = await request(`/api/readings/stats`);
  return resp;
}

export async function getHistory(limit = 500) {
  const resp = await request(`/api/readings/history`, { query: { limit } });
  return (resp as any).points || [];
}

export async function postCalibrate(mode: 'zero' | 'span') {
  const resp = await request(`/api/calibrate`, {
    method: 'POST',
    body: { mode }
  });
  return resp;
}

export async function postDAC(corrected_do: number | null) {
  const resp = await request(`/api/dac`, {
    method: 'POST',
    body: { corrected_do }
  });
  return resp;
}

export default {
  getAccessToken,
  setAccessToken,
  login,
  register,
  forgotPassword,
  resetPassword,
  fetchCurrentUser,
  updatePreferences,
  exportReadings,
  exportReadingsCSV,
  exportStatsCSV,
  getLatestReading,
  getStats,
  getHistory,
  postCalibrate,
  postDAC
};
