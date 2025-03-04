import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const defaultState = {
  user: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
};

export const useAuthStore = create((set) => ({
  ...defaultState,

  setUser: (user) => {
    set({ user });
  },

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
    try {
      set({ isSigningUp: true });

      const res = await axiosInstance.post("/auth/signup", formData);

      if (res.status === 201) {
        toast.success("Account created successfully");

        set({ user: res.data });
      }
    } catch (error) {
      console.log("useAuthStore error", error);

      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    try {
      set({ isLoggingIng: true });

      const res = await axiosInstance.post("/auth/login", formData);

      if (res.status === 200) {
        toast.success("Login successfully");

        set({ user: res.data });
      }
    } catch (error) {
      console.log("useAuthStore error", error);

      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIng: false });
    }
  },

  updateProfile: async (formData) => {
    try {
      set({ isUpdatingProfile: true });

      const res = await axiosInstance.put("/auth/update-profile", formData);

      if (res.status === 200) {
        toast.success("Updated successfully");

        return res.data;
      }
    } catch (error) {
      console.log("useAuthStore error", error);

      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");

      if (res.status === 200) {
        toast.success(res.data.message);

        set({ user: null });
      }
    } catch (error) {
      console.log("useAuthStore error", error);

      toast.error(error.response.data.message);
    }
  },
}));
