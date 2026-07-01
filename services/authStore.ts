import { create } from "zustand";
import { StudentUser } from "../types";
import { api } from "./api";

interface AuthState {
  currentUser: StudentUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<StudentUser>;
  logout: () => void;
  checkAuth: () => Promise<StudentUser | null>;
  setCurrentUser: (user: StudentUser | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isLoggedIn: false,
  isLoading: false,

  setCurrentUser: (user) => {
    set({ currentUser: user, isLoggedIn: !!user });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const user = await api.auth.login(email, password);
      set({ currentUser: user, isLoggedIn: true, isLoading: false });
      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    api.auth.logout();
    set({ currentUser: null, isLoggedIn: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await api.auth.getMe();
      if (user) {
        set({ currentUser: user, isLoggedIn: true, isLoading: false });
        return user;
      }
      set({ currentUser: null, isLoggedIn: false, isLoading: false });
      return null;
    } catch (error) {
      set({ currentUser: null, isLoggedIn: false, isLoading: false });
      return null;
    }
  },
}));
