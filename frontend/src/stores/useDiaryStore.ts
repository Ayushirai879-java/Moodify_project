import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { DiaryEntry } from "@/types";

interface DiaryStore {
  entries: DiaryEntry[];
  isLoading: boolean;
  error: string | null;
  fetchEntries: (mood?: string) => Promise<void>;
  addEntry: (title: string, content: string, mood: string) => Promise<void>;
  updateEntry: (id: string, payload: Partial<{ title: string; content: string; mood: string }>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

export const useDiaryStore = create<DiaryStore>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  fetchEntries: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get("/diary");
      set({ entries: response.data});
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addEntry: async (title, content, mood) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/diary", { title, content, mood });
      await get().fetchEntries();
    } catch (error: any) {
      set({ error: error.response.data.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateEntry: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put(`/diary/${id}`, payload);
      await get().fetchEntries();
    } catch (error: any) {
      set({ error: error.response.data.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteEntry: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/diary/${id}`);
      set({ entries: get().entries.filter((e) => e._id !== id) });
    } catch (error: any) {
      set({ error: error.response.data.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
