import mongoose from "mongoose";

const listeningHistorySchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true, 
		},
		songId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Song",
			required: true,
		},
		artist: {
			type: String,
			required: true,
			index: true, 
		},
	},
	{ timestamps: { createdAt: "playedAt", updatedAt: false } } 
);

export const ListeningHistory = mongoose.model("ListeningHistory", listeningHistorySchema);