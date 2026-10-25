import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
});

function cleanMessage(error) {
  const payload = error.response?.data;
  const msg = payload && typeof payload === 'object' ? payload.message : null;
  if (typeof msg === 'string' && msg.trim()) {
    return msg;
  }
  if (!error.response) {
    return 'Unable to reach the server. Check your connection.';
  }
  const status = error.response.status;
  if (status === 401) return 'Please sign in to continue.';
  if (status === 404) return 'The requested item was not found.';
  if (status === 409) return 'That email is already registered.';
  if (status === 400) return 'Please check the form and try again.';
  return 'Something went wrong. Please try again.';
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    console.error('[MediVault API]', error.response?.status || 'network', url, error.message);
    const message = cleanMessage(error);
    const isPublicCall = url.includes('/api/auth/') || url.includes('/api/share/');
    if (!isPublicCall) {
      window.dispatchEvent(new CustomEvent('medivault:error', { detail: message }));
    }
    if (error.response?.status === 401 && !isPublicCall) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    const wrapped = new Error(message);
    wrapped.cause = error;
    return Promise.reject(wrapped);
  }
);

export default api;
