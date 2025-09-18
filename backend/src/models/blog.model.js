import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },  
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        authorName: { type: String, required: true },
        isPublic:{ type: Boolean, default: true },
    },{timestamps: true } //  createdAt, updatedAt
);

export const Blog = mongoose.model("Blog", blogSchema);