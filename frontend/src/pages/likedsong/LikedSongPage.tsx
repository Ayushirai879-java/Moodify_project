import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react";
import { Song } from "@/types"; 
import Topbar from "@/components/Topbar";
import PlayButton from "../home/components/PlayButton";

export default function LikedSongsPage() {
	const [songs, setSongs] = useState<Song[]>([]);
	const { getToken, isSignedIn } = useAuth();

	useEffect(() => {
		if (!isSignedIn) return;

		const fetchLikedSongs = async () => {
			const token = await getToken();
			if (!token) return;

			axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			try {
				const res = await axiosInstance.get("/likes");
				setSongs(res.data);
			} catch (err) {
				console.error("Error fetching liked songs:", err);
			}
		};

		fetchLikedSongs();
	}, [getToken, isSignedIn]);

	return (
        <main className='h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden'>
			<Topbar />
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Liked Songs</h2>
			{songs.length === 0 ? (
				<p>You haven't liked any songs yet.</p>
			) : (<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
					{songs.map((song) => (
						<div key={song._id} className='flex items-center bg-zinc-700/50 rounded-md overflow-hidden
         hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'
				>
					<img
						src={song.imageUrl}
						alt={song.title}
						className='w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0'
					/>
					<div className='flex-1 p-4'>
						<p className='font-medium truncate'>{song.title}</p>
						<p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
					</div>
					<PlayButton song={song} />
				</div>

					))}
				 </div>
			)}
		</div>
        </main>
	);
}