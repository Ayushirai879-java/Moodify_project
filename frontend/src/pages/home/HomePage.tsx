import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useState,useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useUser } from "@clerk/clerk-react";
import MoodSelector from "./components/MoodSelector";
import PlaylistGrid from "./components/PlaylistGrid";
import { Button } from "@/components/ui/button";

const HomePage = () => {
	const { user } = useUser();
	const [selectedMood, setSelectedMood] = useState<string | null>(null);

  	const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  	};
	const {
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchTrendingSongs,
		isLoading,
		madeForYouSongs,
		featuredSongs,
		trendingSongs,
		fetchSongs,
		songs,
		showAllFeatured,
		setShowAllFeatured,
	} = useMusicStore();

	const { initializeQueue } = usePlayerStore();

	useEffect(() => {
		if (!showAllFeatured && !selectedMood) {
			fetchFeaturedSongs();
			fetchMadeForYouSongs();
			fetchTrendingSongs();
		}
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs,showAllFeatured, selectedMood]);

	useEffect(() => {
		if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
			const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
			initializeQueue(allSongs);
		}
	}, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

	const handleSelectMood = (mood: string | null) => {
		setSelectedMood(mood);
		if (mood) {
			fetchSongs(mood|| undefined); 
		}
	};
	const handleBackToHome = () => {
		setShowAllFeatured(false);
	};

	return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-4 sm:p-6'>
					{showAllFeatured ? (
						<div>
							<Button onClick={handleBackToHome} variant="ghost" className="mb-4">
								&larr; Back to Home
							</Button>
							<PlaylistGrid title="All Featured Songs" songs={songs} />
						</div>
					) : (
						<>
					<MoodSelector onSelectMood={handleSelectMood} />
					<h1 className='text-2xl sm:text-3xl font-bold mb-6'>{getGreeting()}{user?.firstName ? `, ${user.firstName}` : "!"}</h1>

					{selectedMood ? (
						<PlaylistGrid title={`${selectedMood} Vibes`} songs={songs} />
					) : (
						<>
					<FeaturedSection />
				
					<div className='space-y-8'>
						<SectionGrid title='Made For You(Recommended Songs)' songs={madeForYouSongs} isLoading={isLoading} />
						<SectionGrid title='Trending' songs={trendingSongs} isLoading={isLoading} />
					</div>
					</>
					)}
				</>
			)}
			</div>
			</ScrollArea>
		</main>
	);
};
export default HomePage;
