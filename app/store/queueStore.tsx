import {create} from "zustand";
import mockSongs from "../data/data";
import { usePlayerStore } from "./playerStore";

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

// keep playerStore's currentSong in sync whenever the queue moves
const syncSong = (index: number) => {
    usePlayerStore.getState().setcurrentSong(mockSongs[index]);
};

export const useQueueStore = create<queueState>((set, get) => ({
    currentIndex: 0,
    shuffle: false,

    next: () => {
        const state = get();
        let newIndex: number;

        if (state.shuffle) {
            do {
                newIndex = Math.floor(Math.random() * mockSongs.length);
            } while (newIndex === state.currentIndex && mockSongs.length > 1);
        } else {
            newIndex = Math.min(state.currentIndex + 1, mockSongs.length - 1);
        }

        set({ currentIndex: newIndex });
        syncSong(newIndex);
    },

    previous: () => {
        const newIndex = Math.max(get().currentIndex - 1, 0);
        set({ currentIndex: newIndex });
        syncSong(newIndex);
    },

    setcurrentIndex: (newindex: number) => {
        const clamped = Math.max(0, Math.min(newindex, mockSongs.length - 1));
        set({ currentIndex: clamped });
        syncSong(clamped);
    },
    toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),

}))
