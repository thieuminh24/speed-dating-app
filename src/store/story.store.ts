// store/story.store.ts
import { create } from "zustand";
import type { Story, StoryGroup } from "@/services/story/story.types";
import { getMyStories, getStoryFeed } from "@/services/story/story.api";

interface StoryState {
  myStories: Story[];
  feed: StoryGroup[];
  isLoading: boolean;
  error: string | null;

  fetchMyStories: () => Promise<void>;
  fetchFeed: () => Promise<void>;
  clearError: () => void;
}

export const useStory = create<StoryState>((set) => ({
  myStories: [],
  feed: [],
  isLoading: false,
  error: null,

  fetchMyStories: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getMyStories();
      set({ myStories: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchFeed: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getStoryFeed();
      set({ feed: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
