import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const FRONTEND_URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:5173"
    : "https://mern-chat-wine-seven.vercel.app";

const io = new Server(server, {
  cors: {
    origin: [FRONTEND_URL, "http://localhost:4173"],
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

  socket.on("disconnect", () => {
    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
