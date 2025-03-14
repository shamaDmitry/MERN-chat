import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import roomRoutes from "./routes/room.routes.js";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import User from "./models/user.model.js";
import bcrypt from "bcryptjs";
import path from "path";

dotenv.config({
  debug: true,
});

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(
  cors({
    origin: `${
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : "https://mern-chat-front-iota.vercel.app"
    }`,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/room", roomRoutes);

// app.use("/", (req, res) => {
//   return res.status(200).json({
//     message: "Hello World!",
//     front: process.env.FRONTEND_URL,
//     mode: process.env.NODE_ENV,
//   });
// });

app.use("/seed", async (req, res) => {
  try {
    await User.collection.drop();

    const response = await fetch("https://randomuser.me/api/?results=10");
    const data = await response.json();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    const users = data.results.map((user) => {
      return {
        email: user.email,
        fullName: `${user.name.first} ${user.name.last}`,
        password: hashedPassword,
        profilePic: user.picture.large,
      };
    });

    await User.insertMany(users);

    return res
      .status(200)
      .json({ message: "Database seeded successfully", users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}. Ready to accept requests!`);
  connectDB();
});
