import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const API = axios.create({
  baseURL: 'https://org-ave-jimmy-learners.trycloudflare.com/api/v1',
});

API.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refresh = localStorage.getItem('refresh');
      if (!refresh) return Promise.reject(error);

      try {
        const { data } = await axios.post(
          'https://org-ave-jimmy-learners.trycloudflare.com/api/v1/auth/login/refresh/',
          { refresh }
        );

        useAuthStore.getState().setToken(data.access);

        original.headers.Authorization = `Bearer ${data.access}`;

        return API(original);
      } catch {
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

export default API;
