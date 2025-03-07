import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUser, getUsersForSidebar } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/sidebar", protectRoute, getUsersForSidebar);
router.get("/:userId", protectRoute, getUser);

export default router;
