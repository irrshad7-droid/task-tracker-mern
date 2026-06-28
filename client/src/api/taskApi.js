import axios from 'axios';

/**
 * taskApi.js — The single source of truth for all backend communication.
 *
 * We create ONE Axios instance (`api`) configured with the base URL.
 * Every exported function uses this instance — so if the base URL changes,
 * it changes in exactly one place.
 *
 * The response interceptor normalises every successful response to just
 * `response.data`, so callers receive `{ success, message, data }` directly
 * without needing to write `.data` everywhere.
 *
 * Errors are normalised to plain Error objects with a human-readable `.message`.
 * This means error handling in components is always just `err.message`.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // fail fast after 10s rather than hanging forever
});

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  // Success: unwrap the axios wrapper — callers get response.data directly
  (response) => response.data,

  // Error: extract the message from the server's JSON or fall back to axios's message
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// ─── API Functions ────────────────────────────────────────────────────────────
//
// Each function maps 1:1 to a REST endpoint.
// Parameters match the query/body shape expected by the server (Milestone 3).

/**
 * GET /api/tasks
 * @param {Object} params - Optional: { search, status, priority, sort }
 */
export const getTasks = (params = {}) => api.get('/tasks', { params });

/**
 * GET /api/tasks/:id
 * @param {string} id - MongoDB ObjectId
 */
export const getTask = (id) => api.get(`/tasks/${id}`);

/**
 * POST /api/tasks
 * @param {Object} data - { title, description, status, priority, dueDate }
 */
export const createTask = (data) => api.post('/tasks', data);

/**
 * PUT /api/tasks/:id
 * @param {string} id   - MongoDB ObjectId
 * @param {Object} data - Partial: only include fields that changed
 */
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);

/**
 * DELETE /api/tasks/:id
 * @param {string} id - MongoDB ObjectId
 */
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
