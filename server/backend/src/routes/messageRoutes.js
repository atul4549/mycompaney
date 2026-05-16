import express from "express";
import {
  getMessages,
  sendMessage,
  markAsRead,
  getConversations,
} from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/conversations", getConversations);
router.get("/:userId", getMessages);
router.post("/:userId", sendMessage);
router.put("/:messageId/read", markAsRead);

export default router;
