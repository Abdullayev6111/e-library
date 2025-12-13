import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('access') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuth: !!localStorage.getItem('access'),

  setToken: (token) => {
    localStorage.setItem('access', token);
    set({ token, isAuth: true });
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.clear();
    set({ token: null, user: null, isAuth: false });
  },
}));

export default useAuthStore;
