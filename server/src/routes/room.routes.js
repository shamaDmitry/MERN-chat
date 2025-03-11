import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createRoom,
  joinRoom,
  leaveRoom,
  getRooms,
  getRoom,
  sendRoomMessage,
  getRoomMessages,
} from "../controllers/room.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getRooms);
router.get("/:roomId", protectRoute, getRoom);
router.post("/create", protectRoute, createRoom);
router.post("/join/:roomId", protectRoute, joinRoom);
router.post("/leave/:roomId", protectRoute, leaveRoom);
router.post("/message/:roomId", protectRoute, sendRoomMessage);
router.get("/messages/:roomId", protectRoute, getRoomMessages);

export default router;
