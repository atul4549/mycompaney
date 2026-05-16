import express from "express";
import {
  getAllUsers,
  getUserById,
  searchUsers,
  addFriend,
  removeFriend,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllUsers);
router.get("/search", searchUsers);
router.get("/:id", getUserById);
router.post("/:id/friend", addFriend);
router.delete("/:id/friend", removeFriend);

export default router;
