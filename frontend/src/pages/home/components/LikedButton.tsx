import { Song } from "@/types";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react";

const LikedButton = ({ song }: { song: Song }) => {
	const [liked, setLiked] = useState(false);
	const { getToken, isSignedIn } = useAuth();

	// Effect to check if this specific song is liked
	useEffect(() => {
		if (!isSignedIn || !song?._id) return;

		const checkLikedStatus = async () => {
			const token = await getToken();
			if (!token) return;

			axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			try {
				const res = await axiosInstance.get("/likes");
				setLiked(res.data.some((s: Song) => s._id === song._id));
			} catch (error) {
				console.error("Failed to check liked status", error);
			}
		};

		checkLikedStatus();
	}, [song, getToken, isSignedIn]);

	const handleLike = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!isSignedIn) return;

		const token = await getToken();
		if (!token) return;

		axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		try {
			const res = await axiosInstance.post(`/likes/${song._id}`);
			setLiked(res.data.liked);
		} catch (err) {
			console.error("Error liking song:", err);
		}
	};

	if (!isSignedIn) return null; 

	return (
		 <button
      onClick={handleLike}
      aria-label={liked ? "Unlike" : "Like"}
      className="p-1 hover:scale-110 transition-transform"
    >
      <Heart
        size={22}
        className="transition-colors"
        color={liked ? "#e0245e" : "#fff"} 
        fill={liked ? "#e0245e" : "none"}
        strokeWidth={2}
      />
    </button>
	);
};

export default LikedButton;