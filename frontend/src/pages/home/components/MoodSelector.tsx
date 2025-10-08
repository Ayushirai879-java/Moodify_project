import { useState } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

const moods = [
	{ name: "Happy", emoji: "😍" },
	{ name: "Sad", emoji: "😢" },
	{ name: "Chill", emoji: "😎" },
	{ name: "Energetic", emoji: "🔥" },
	{ name: "Romantic", emoji: "❤️" },
	{ name: "Devotional", emoji: "🙏" },
];

interface MoodSelectorProps {
	onSelectMood: (mood: string | null) => void;
}

const MoodSelector = ({ onSelectMood }: MoodSelectorProps) => {
	const [activeMood, setActiveMood] = useState<string | null>(null);

	const handleMoodClick = (moodName: string) => {
		const newActiveMood = activeMood === moodName ? null : moodName;
		setActiveMood(newActiveMood);
		onSelectMood(newActiveMood);
	};

    const handleClearClick = () => {
		setActiveMood(null);
		onSelectMood(null);
	};

	return (
		<div className="flex items-center justify-center gap-4 mb-6">
			{moods.map((mood) => (
				<button
					key={mood.name}
					onClick={() => handleMoodClick(mood.name)}
					className={clsx(
						"flex items-center justify-center w-12 h-12 rounded-full text-2xl transition-all duration-300",
						{
							"bg-green-500 scale-110": activeMood === mood.name,
							"bg-zinc-700/50 hover:bg-zinc-600/50": activeMood !== mood.name,
						}
					)}
					title={mood.name}
				>
					{mood.emoji}
				</button>
			))}

            {activeMood && (
				<button
					onClick={handleClearClick}
					className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-all"
					title="Clear filter"
				>
					<X size={24} />
				</button>
			)}
		</div>
	);
};

export default MoodSelector;