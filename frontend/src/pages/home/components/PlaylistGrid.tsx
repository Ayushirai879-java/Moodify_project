import { Song } from "@/types";
import PlayButton from "./PlayButton";
import LikedButton from "./LikedButton"; 
import { usePlayerStore } from "@/stores/usePlayerStore";
import clsx from "clsx";

interface PlaylistGridProps {
	title: string;
	songs: Song[];
}

const PlaylistGrid = ({ songs, title }: PlaylistGridProps) => {
	const { currentSong } = usePlayerStore(); 

	if (songs.length === 0) {
        return (
            <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">{title}</h2>
                <p className="text-zinc-400">No songs to display in this playlist yet.</p>
            </div>
        );
    }

	return (
		<div className="mb-8">
			<h2 className="text-xl sm:text-2xl font-bold mb-4">{title}</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{songs.map((song) => {
					const isCurrentSong = currentSong?._id === song._id;
					return (
						<div
							key={song._id}
							className="group flex items-center justify-between p-2 bg-zinc-800/50 
                                       rounded-md overflow-hidden hover:bg-zinc-700/50 
                                       transition-colors cursor-pointer"
						>
							<div className="flex items-center gap-4 min-w-0">
								<div className="flex-shrink-0">
									<img
										src={song.imageUrl}
										alt={song.title}
										className="w-16 h-16 object-cover rounded-md"
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p className="font-medium truncate">{song.title}</p>
									<p className="text-sm text-zinc-400 truncate">{song.artist}</p>
								</div>
							</div>

							<div
                            className={clsx(
                                "flex items-center gap-3 pr-4 transition-opacity duration-300 [&>*]:!static [&>*]:!opacity-100 [&>*]:!translate-y-0 [&>button]:w-10 [&>button]:h-10 [&>button]:p-0 [&>button]:flex [&>button]:items-center [&>button]:justify-center",
                                {
                                    "opacity-100": isCurrentSong, 
                                    "opacity-0 group-hover:opacity-100": !isCurrentSong, 
                                }
                            )}
                        >
                            <LikedButton song={song} />
                            <PlayButton song={song} />
                        </div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default PlaylistGrid;