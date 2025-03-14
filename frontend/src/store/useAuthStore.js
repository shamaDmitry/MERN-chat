import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const defaultState = {
  user: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
};

export const useAuthStore = create((set, get) => ({
  ...defaultState,

  setUser: (user) => {
    set({ user });
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance("auth/check-auth");

      if (res.status === 200) {
        set({ user: res.data });

        get().connectSocket();
      }
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

        get().connectSocket();
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

        get().connectSocket();
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
        get().disconnectSocket();
      }
    } catch (error) {
      console.log("useAuthStore error", error);

      toast.error(error.response.data.message);
    }
  },

  connectSocket: () => {
    const { user } = get();

    if (!user || get().socket?.connected) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      query: { userId: user._id },
    });

    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));
