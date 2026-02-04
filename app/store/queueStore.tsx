import { Shuffle } from "lucide-react";
import {create} from "zustand";
import mockSongs from "../data/data";

type queueState = {
    //state
    currentIndex: number,
    shuffle: boolean,

    //Action
    next: () => void,
    previous: () => void,
    toggleShuffle: () => void,
    setcurrentIndex: (newindex: number) => void,
}

export const useQueueStore = create<queueState>((set, get) => ({
    currentIndex: 0,
    shuffle: false,
    
    next: () => {
    set((state) => {
        let newIndex: number;

        if (state.shuffle) {
            do {
                newIndex = Math.floor(Math.random() * mockSongs.length);
            } while (newIndex === state.currentIndex && mockSongs.length > 1);
            } else {
            newIndex = Math.min(state.currentIndex + 1, mockSongs.length - 1);
            }

            return { currentIndex: newIndex };
        });
    },

    previous: () => {
        set((state) => {
            const newIndex = Math.max(state.currentIndex - 1, 0);
            return { currentIndex: newIndex };
        });
    },

    setcurrentIndex: (newindex: number) => 
    set({ currentIndex: Math.max(0, Math.min(newindex, mockSongs.length - 1)) }),
    toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),

}))