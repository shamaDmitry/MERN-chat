import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

import { useAuthStore } from "./useAuthStore";

const defaultState = {
  isLoadingUsers: true,
  isLoadingMessages: true,
  isMessageSending: false,
  messages: [],
  usersForSidebar: [],
  receiver: null,
};

export const useChat = create((set, get) => ({
  ...defaultState,

  getUsersForSidebar: async () => {
    try {
      const res = await axiosInstance("users/sidebar");

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

  setMessages: (messages) => {
    set({ messages });
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

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket.on("receiveMessage", (newMessage) => {
      const { messages } = get();

      set({ messages: [...messages, newMessage] });
    });
  },

  unSubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket.off("receiveMessage");
  },

  setReceiver: (receiver) => {
    set({ receiver });
  },

  getReceiver: async (receiverId) => {
    try {
      const res = await axiosInstance(`users/${receiverId}`);

      if (res.status === 200) {
        set({ receiver: res.data });
      }
    } catch (error) {
      console.log("getMessage", error);
    } finally {
      set({ isLoadingMessages: false });
    }
  },
}));
