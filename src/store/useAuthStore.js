import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('access') || null,
  user: null,

  setToken: (token) => {
    localStorage.setItem('access', token);
    set({ token });
  },

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.clear();
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
