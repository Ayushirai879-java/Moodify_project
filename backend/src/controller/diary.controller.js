// /backend/src/controller/diary.controller.js
import { DiaryEntry } from "../models/diary.model.js";

// Create diary entry
export const createDiaryEntry = async (req, res) => {
  try {
    const { title, content, mood } = req.body;
    // Using Clerk: user id attached on req.auth.userId by your auth middleware
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const entry = await DiaryEntry.create({ userId, title, content, mood });
    return res.status(201).json(entry);
  } catch (error) {
    console.error("createDiaryEntry error:", error);
    return res.status(400).json({ message: error.message || "Failed to create entry" });
  }
};

// Get user's diary entries (optionally filter by mood)
export const getDiaryEntries = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { mood } = req.query;
    const filter = { userId };
    if (mood) filter.mood = mood;

    const entries = await DiaryEntry.find(filter).sort({ createdAt: -1 });
    return res.json(entries);
  } catch (error) {
    console.error("getDiaryEntries error:", error);
    return res.status(400).json({ message: error.message || "Failed to fetch entries" });
  }
};

// Update diary entry - only owner can update
export const updateDiaryEntry = async (req, res) => {
  try {
    const entryId = req.params.id;
    const userId = req.auth.userId ;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, content, mood } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (content !== undefined) update.content = content;
    if (mood !== undefined) update.mood = mood;

    const entry = await DiaryEntry.findOneAndUpdate(
      { _id: entryId, userId },
      update,
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ message: "Entry not found or not permitted to edit" });
    }
    return res.json(entry);
  } catch (error) {
    console.error("updateDiaryEntry error:", error);
    return res.status(400).json({ message: error.message || "Failed to update entry" });
  }
};

// Delete diary entry - only owner
export const deleteDiaryEntry = async (req, res) => {
  try {
    const entryId = req.params.id;
    const userId = req.auth?.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await DiaryEntry.deleteOne({ _id: entryId, userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Entry not found or not permitted to delete" });
    }
    return res.json({ success: true });
  } catch (error) {
    console.error("deleteDiaryEntry error:", error);
    return res.status(400).json({ message: error.message || "Failed to delete entry" });
  }
};
