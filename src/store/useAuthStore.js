import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isAuth: false,
  user: null,
  login: (data) =>
    set({
      isAuth: true,
      user: data,
    }),

  logout: () =>
    set({
      isAuth: false,
      user: null,
    }),
}));

export default useAuthStore;
