import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import PlayButton from "./PlayButton";
import LikedButton from "./LikedButton";
import clsx from "clsx";

const FeaturedSection = () => {
    const { isLoading, featuredSongs, error } = useMusicStore();
    const { currentSong } = usePlayerStore();
    if (isLoading) return <FeaturedGridSkeleton />;

    if (error) return <p className='text-red-500 mb-4 text-lg'>{error}</p>;

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
            {featuredSongs.map((song) => { // <-- Use curly brace here
                // Now you can safely declare constants here
                const isCurrentSong = currentSong?._id === song._id;

                // And then explicitly return your JSX
                return (
                    <div
                        key={song._id}
                        className='flex items-center bg-zinc-800/50 rounded-md overflow-hidden
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
                          <div
                            className={clsx(
                                // Your static classes for layout and overrides are preserved
                                "flex items-center gap-3 pr-4 transition-opacity duration-300 [&>*]:!static [&>*]:!opacity-100 [&>*]:!translate-y-0 [&>button]:w-10 [&>button]:h-10 [&>button]:p-0 [&>button]:flex [&>button]:items-center [&>button]:justify-center",
                                // Conditional classes for visibility
                                {
                                    "opacity-100": isCurrentSong, // Always visible if it's the current song
                                    "opacity-0 group-hover:opacity-100": !isCurrentSong, // Otherwise, only visible on hover
                                }
                            )}
                        >
                            <LikedButton song={song} />
                            <PlayButton song={song} />
                        </div>
                    </div>
                );
            })} {/* <-- And a closing curly brace here */}
        </div>
    );
};
export default FeaturedSection;