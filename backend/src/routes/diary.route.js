import express from "express";
import { protectRoute} from "../middleware/auth.middleware.js";
import {
  createDiaryEntry,
  getDiaryEntries,
  updateDiaryEntry,
  deleteDiaryEntry,
} from "../controller/diary.controller.js";

const router = express.Router();

// All routes require a logged-in user (not admin only)
router.post("/",protectRoute, createDiaryEntry);
router.get("/", protectRoute, getDiaryEntries);
router.put("/:id", protectRoute, updateDiaryEntry);
router.delete("/:id", protectRoute, deleteDiaryEntry);

export default router;
