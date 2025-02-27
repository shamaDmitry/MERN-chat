import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const defaultState = {
  user: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
};

export const useAuthStore = create((set) => ({
  ...defaultState,

  checkAuth: async () => {
    try {
      const res = await axiosInstance("auth/check-auth");

      set({ user: res.data });
    } catch (error) {
      console.log("useAuthStore error", error);

      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    console.log("formData", formData);
  },

  login: async (formData) => {
    console.log("formData", formData);
  },
}));
