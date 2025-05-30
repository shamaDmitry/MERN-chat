import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://mern-chat-wine-seven.vercel.app",
      "http://localhost:4173",
    ],
  },
});

const userSocketMap = {};
const roomUsers = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  socket.on("joinRoom", ({ roomId, userId }) => {
    socket.join(roomId);

    if (!roomUsers[roomId]) {
      roomUsers[roomId] = new Set();
    }

    roomUsers[roomId].add(userId);

    io.to(roomId).emit("roomUsers", {
      room: roomId,
      users: Array.from(roomUsers[roomId]),
    });
  });

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("userIsTyping", ({ receiverId }) => {
    socket.to(getReceiverSocketId(receiverId)).emit("userIsTyping", {
      isTyping: true,
    });
  });

  socket.on("userIsStopTyping", ({ isTyping, receiverId }) => {
    socket.to(getReceiverSocketId(receiverId)).emit("userIsStopTyping", {
      isTyping,
    });
  });

  // Handle marking messages as read
  socket.on("markMessagesAsRead", ({ senderId }) => {
    const receiverId = userId;
    if (receiverId) {
      // Emit to the sender that their messages have been read
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesRead", { receiverId });
      }
    }
  });

  socket.on("disconnect", () => {
    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
