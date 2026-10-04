import { create } from 'zustand';
import type { Profile } from '~/types/api';
import { getMe, logout as apiLogout } from '~/lib/api/endpoints';

import { useCartStore } from './cart';

interface SessionState {
  user: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  fetchSession: () => Promise<Profile | null>;
  setUser: (user: Profile | null) => void;
  logout: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  fetchSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await getMe();
      set({ user: res.user, isLoading: false, isInitialized: true });
      if (res.user) {
        useCartStore.getState().syncFromServer();
      }
      return res.user;
    } catch (err) {
      set({
        user: null,
        isLoading: false,
        isInitialized: true,
        error: err instanceof Error ? err.message : 'Failed to fetch session',
      });
      return null;
    }
  },

  setUser: (user) => {
    set({ user, isInitialized: true });
    if (user) {
      useCartStore.getState().syncFromServer();
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await apiLogout();
    } catch {
      // Continue clearing local session even if backend call fails
    } finally {
      set({ user: null, isLoading: false, isInitialized: true });
    }
  },
}));

export function useAuth() {
  const { user, isLoading, isInitialized, logout, fetchSession } = useSessionStore();
  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    logout,
    fetchSession,
  };
}
