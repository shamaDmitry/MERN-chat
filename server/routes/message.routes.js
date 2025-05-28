import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  sendMessage,
  getUnreadCount,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:userId", protectRoute, getMessages);

router.post("/send/:userId", protectRoute, sendMessage);

router.get("/unread/count", protectRoute, getUnreadCount);

export default router;
