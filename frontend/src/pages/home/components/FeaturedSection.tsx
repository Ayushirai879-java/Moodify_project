import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import PlayButton from "./PlayButton";
import LikedButton from "./LikedButton";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

const FeaturedSection = () => {
    const { isLoading, featuredSongs, error, fetchFeaturedSongs, setShowAllFeatured } = useMusicStore();
    const { currentSong } = usePlayerStore();
    const handleShowAll = () => {
		fetchFeaturedSongs(true);
		setShowAllFeatured(true);
	};
    if (isLoading) return <FeaturedGridSkeleton />;
    if (error) return <p className='text-red-500 mb-4 text-lg'>{error}</p>;

    return (
        <div className="mb-8">
			<div className="flex items-center justify-between mb-4">
                <h2 className='text-xl sm:text-2xl font-bold'>Featured Songs</h2>
				<Button onClick={handleShowAll} variant="link" className="text-sm text-zinc-400 hover:text-white">
					Show all
				</Button>
		</div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
            {featuredSongs.map((song) => { 
                const isCurrentSong = currentSong?._id === song._id;
                return (
                    <div
                        key={song._id}
                        className="group flex items-center justify-between gap-4 bg-zinc-800/50 
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
export default FeaturedSection;