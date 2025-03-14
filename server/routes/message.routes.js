import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:userId", protectRoute, getMessages);

router.post("/send/:userId", protectRoute, sendMessage);

export default router;
