import { useEffect, useState } from "react";
import { useDiaryStore } from "@/stores/useDiaryStore";
import { DiaryEntry } from "@/types";
import toast from "react-hot-toast";

const moods = ["happy 😊", "sad 😔", "excited 😃", "angry 😡", "relaxed ☺️"];

export default function DiaryPage() {
  const { entries, fetchEntries, addEntry, updateEntry, deleteEntry, isLoading, error } = useDiaryStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(moods[0]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [editingMood, setEditingMood] = useState(moods[0]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleAdd = async () => {
    if (!title.trim() || !content.trim()){ 
      toast.error("Please enter both title and content before adding.");
      return};
      await addEntry(title, content, mood);
      toast.success("Diary entry added successfully!");
      setTitle("");
      setContent("");
      setMood(moods[0]);
  };

  const startEdit = (entry: DiaryEntry) => {
    setEditingId(entry._id);
    setEditingTitle(entry.title);
    setEditingContent(entry.content);
    setEditingMood(entry.mood);
  };

  const submitEdit = async () => {
    if (!editingId) return;
    await updateEntry(editingId, {
      title: editingTitle,
      content: editingContent,
      mood: editingMood,
    });
    setEditingId(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#121212] text-gray-200 min-h-[80vh] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">My Diary</h2>

      {/* Add form */}
      <div className="mb-6 p-4 bg-[#181818] rounded">
        <input
          className="w-full bg-transparent border-b border-gray-700 py-2 mb-2 text-white placeholder-gray-400"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full bg-transparent border border-gray-700 rounded p-3 mb-3 text-white placeholder-gray-400"
          placeholder="Write your diary entry..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="p-2 rounded bg- bg-[#282828] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
          >
            {moods.map((m) => (
              <option key={m} className="bg-[#121212] text-white">{m}</option>
            ))}
          </select>
          <button
            className="px-4 py-2 bg-[#1DB954] text-black font-semibold rounded hover:opacity-90 disabled:opacity-50"
            onClick={handleAdd}
            disabled={isLoading}
          >
            Add Entry
          </button>
        </div>
      </div>

      {error && <div className="text-red-400 mb-3">{error}</div>}

      {/* Entries */}
      <ul>
        {entries.map((entry) => (
          <li key={entry._id} className="mb-4 p-4 bg-[#181818] rounded border border-gray-800">
            {editingId === entry._id ? (
              <div>
                <input
                  className="w-full bg-transparent border-b border-gray-700 py-2 mb-2 text-white"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <textarea
                  className="w-full bg-transparent border border-gray-700 rounded p-3 mb-2 text-white"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <select
                  value={editingMood}
                  onChange={(e) => setEditingMood(e.target.value)}
                  className="p-2 rounded bg-transparent border border-gray-700"
                >
                  {moods.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={submitEdit}
                    className="px-3 py-1 bg-[#1DB954] rounded text-black font-semibold"
                  >
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-1 border rounded">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between">
                  <div>
                    <strong>{entry.title}</strong> — <span>{entry.mood}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(entry)}
                      className="px-3 py-1 border border-gray-700 rounded hover:bg-gray-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEntry(entry._id)}
                      className="px-3 py-1 border border-red-600 text-red-400 rounded hover:bg-red-900/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-2 whitespace-pre-wrap">{entry.content}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
      {entries.length === 0 && !isLoading && (
        <div className="text-gray-400">You have no diary entries yet.</div>
      )}
    </div>
  );
}
