import {User} from "../models/user.model.js";
import { Song } from "../models/song.model.js";

export const likeSong = async (req, res) => {
    try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    const {songId} = req.params;

    if (!user) return res.status(404).json({ message: 'User not found' });
    const song = await Song.findById(songId);
	if (!song) {
			return res.status(404).json({ message: "Song not found" });
	}
    // const index = user.likedSongs.indexOf(songId);
    const index = user.likedSongs.findIndex(id => id.toString() === songId);
    if (index > -1) {
      user.likedSongs.splice(index, 1);
      await user.save();
      return res.json({ liked: false });
    } else {
      user.likedSongs.push(song._id);
      await user.save();
      return res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLikedSongs = async (req, res) => {
     try {
    const user = await User.findOne({ clerkId: req.auth.userId }).populate('likedSongs');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user.likedSongs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};