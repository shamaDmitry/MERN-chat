import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const defaultState = {
  isLoadingUsers: true,
  isLoadingMessages: true,
  isMessageSending: false,
  messages: [],
  usersForSidebar: [],
};

export const useChat = create((set, get) => ({
  ...defaultState,

  getUsersForSidebar: async () => {
    try {
      const res = await axiosInstance("message/users");

      if (res.status === 200) {
        set({ usersForSidebar: res.data });
      }
    } catch (error) {
      console.log("useChat error", error);
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  getMessages: async (userId) => {
    try {
      const res = await axiosInstance(`message/${userId}`);

      if (res.status === 200) {
        set({ messages: res.data });
      }
    } catch (error) {
      console.log("getMessage", error);
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (receiverId, messageData) => {
    const { messages } = get();

    set({ isMessageSending: true });

    try {
      const res = await axiosInstance.post(
        `message/send/${receiverId}`,
        messageData
      );

      if (res.status === 201) {
        set({ messages: [...messages, res.data] });
      }
    } catch (error) {
      console.log("sendMessage", error);
    } finally {
      console.log("finally");
      set({ isMessageSending: false });
    }
  },
}));
