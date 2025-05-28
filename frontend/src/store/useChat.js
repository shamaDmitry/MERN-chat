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
  unreadCounts: {},
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

    // Listen for unread count updates
    socket.on("unreadCountUpdate", ({ unreadCounts }) => {
      set({ unreadCounts });
    });

    // Listen for messages being read
    socket.on("messagesRead", ({ receiverId }) => {
      // Update messages in the current chat if the receiver is the current user
      const { receiver } = get();
      if (receiver && receiver._id === receiverId) {
        const { messages } = get();
        const updatedMessages = messages.map((msg) => ({
          ...msg,
          read: true,
        }));
        set({ messages: updatedMessages });
      }
    });
  },

  unSubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("receiveMessage");
    socket.off("unreadCountUpdate");
    socket.off("messagesRead");
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

  getUnreadCount: async () => {
    try {
      const res = await axiosInstance("message/unread/count");
      if (res.status === 200) {
        set({ unreadCounts: res.data.unreadCounts });
      }
    } catch (error) {
      console.log("getUnreadCount error", error);
    }
  },
}));
