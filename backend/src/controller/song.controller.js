import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { ListeningHistory } from "../models/listeningHistory.model.js";

export const getAllSongs = async (req, res, next) => {
	try {
		// -1 = Descending => newest -> oldest
		// 1 = Ascending => oldest -> newest
		//const songs = await Song.find().sort({ createdAt: -1 });
		const { mood } = req.query; 

		const filter = {}; 
		if (mood) {
			filter.mood = mood.charAt(0).toUpperCase() + mood.slice(1);
		}
		const songs = await Song.find(filter).sort({ createdAt: -1 });
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getFeaturedSongs = async (req, res, next) => {
	try {
		const { showAll } = req.query;
		if (showAll === 'true') {
			const allSongs = await Song.find().sort({ createdAt: -1 });
			return res.json(allSongs);
		} 
		// fetch 6 random songs using mongodb's aggregation pipeline
		const songs = await Song.aggregate([
			{
				$sample: { size: 6},
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		next(error);
	}
};

// export const getMadeForYouSongs = async (req, res, next) => {
// 	try {
// 		const songs = await Song.aggregate([
// 			{
// 				$sample: { size: 4 },
// 			},
// 			{
// 				$project: {
// 					_id: 1,
// 					title: 1,
// 					artist: 1,
// 					imageUrl: 1,
// 					audioUrl: 1,
// 				},
// 			},
// 		]);

// 		res.json(songs);
// 	} catch (error) {
// 		next(error);
// 	}
// };

export const getMadeForYouSongs = async (req, res, next) => {
	try {
		const user = await User.findOne({ clerkId: req.auth.userId });
		if (!user) return res.json([]);

		const topArtists = await ListeningHistory.aggregate([
			{ $match: { userId: user._id } },
			{ $group: { _id: "$artist", playCount: { $sum: 1 } } },
			{ $sort: { playCount: -1 } },
			{ $limit: 4 },
		]);

		if (topArtists.length === 0) return res.json([]);
		const topArtist = topArtists[0]._id;

		const recommendations = await Song.find({
			artist: topArtist,
			_id: { $nin: user.likedSongs },
		}).limit(6);

		res.json(recommendations);
	} catch (error) {
		next(error);
	}
};


export const getTrendingSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const logSongPlay = async (req, res, next) => {
	try {
		const { songId } = req.params;
		const user = await User.findOne({ clerkId: req.auth.userId }, "_id");
		if (!user) return res.status(404).json({ message: "User not found" });

		const song = await Song.findById(songId);
		if (!song) return res.status(404).json({ message: "Song not found" });

		const historyEntry = new ListeningHistory({
			userId: user._id,
			songId: song._id,
			artist: song.artist,
		});
		await historyEntry.save();

		res.status(201).json({ message: "Play logged" });
	} catch (error) {
		next(error);
	}
};