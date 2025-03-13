import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const defaultState = {
  isRoomsLoading: true,
  rooms: [],
};

export const useRoomsStore = create((set) => ({
  ...defaultState,

  getRooms: async () => {
    try {
      const res = await axiosInstance("room/all");

      if (res.status === 200) {
        set({ rooms: res.data });
      }
    } catch (error) {
      console.log("useChat error", error);
    } finally {
      set({ isRoomsLoading: false });
    }
  },

  getRoom: async (roomId) => {
    try {
      const res = await axiosInstance(`room/${roomId}`);

      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.log("useChat error", error);
    }
  },
}));
