import axios from 'axios'
import { useAuthStore } from './store'

export const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── API helpers ────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  refresh: (refresh_token: string) =>
    api.post('/auth/refresh', { refresh_token }),
}

export const mattersApi = {
  list: (params?: { status?: string; domain?: string }) =>
    api.get('/matters', { params }),
  get: (id: string) => api.get(`/matters/${id}`),
  create: (data: { title: string; domain: string; jurisdiction?: string; description?: string }) =>
    api.post('/matters', data),
  update: (id: string, data: object) => api.patch(`/matters/${id}`, data),
}

export const approvalsApi = {
  list: (params?: { status?: string; risk?: string }) =>
    api.get('/approvals', { params }),
  decide: (id: string, decision: string, note?: string) =>
    api.post(`/approvals/${id}/decide`, { decision, note }),
}

export const clientsApi = {
  list: () => api.get('/clients'),
  get: (id: string) => api.get(`/clients/${id}`),
}

export const researchApi = {
  submit: (data: object) => api.post('/research', data),
}

export const auditApi = {
  list: (params?: { matter_id?: string; agent_id?: string; limit?: number; offset?: number }) =>
    api.get('/audit', { params }),
}
