import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete api.defaults.headers.common.Authorization
}

export async function loginUser(payload) {
  const response = await api.post('/api/auth/login', payload)
  return response.data
}

export async function signupUser(payload) {
  const response = await api.post('/api/auth/signup', payload)
  return response.data
}

export async function getTodos() {
  const response = await api.get('/api/todos')
  return response.data
}

export async function createTodo(payload) {
  const response = await api.post('/api/todos', payload)
  return response.data
}

export async function updateTodo(id, payload) {
  const response = await api.put(`/api/todos/${id}`, payload)
  return response.data
}

export async function toggleTodoDone(id) {
  const response = await api.patch(`/api/todos/${id}/done`)
  return response.data
}

export async function deleteTodo(id) {
  const response = await api.delete(`/api/todos/${id}`)
  return response.data
}
