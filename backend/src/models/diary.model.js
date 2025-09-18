// /backend/src/models/diary.model.js
import mongoose from "mongoose";

const diarySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    mood: { type: String, required: true },
  },
  { timestamps: true }
);

export const DiaryEntry = mongoose.model("DiaryEntry", diarySchema);
