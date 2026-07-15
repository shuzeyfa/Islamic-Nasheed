import {create} from "zustand";
import { persist } from "zustand/middleware";
import mockSongs from "../data/data";
import { usePlayerStore } from "./playerStore";

export type RepeatMode = "off" | "all" | "one";

type queueState = {
    //state
    currentIndex: number,
    shuffle: boolean,
    repeat: RepeatMode,

    //Action
    next: () => void,
    previous: () => void,
    toggleShuffle: () => void,
    cycleRepeat: () => void,
    setcurrentIndex: (newindex: number) => void,
}

// keep playerStore's currentSong in sync whenever the queue moves
const syncSong = (index: number) => {
    usePlayerStore.getState().setcurrentSong(mockSongs[index]);
};

export const useQueueStore = create<queueState>()(
    persist(
        (set, get) => ({
    currentIndex: 0,
    shuffle: false,
    repeat: "off",

    next: () => {
        const state = get();
        let newIndex: number;

        if (state.shuffle) {
            do {
                newIndex = Math.floor(Math.random() * mockSongs.length);
            } while (newIndex === state.currentIndex && mockSongs.length > 1);
        } else if (state.currentIndex === mockSongs.length - 1) {
            // last track: wrap to the start when repeating, otherwise stay
            newIndex = state.repeat === "all" ? 0 : state.currentIndex;
        } else {
            newIndex = state.currentIndex + 1;
        }

        set({ currentIndex: newIndex });
        syncSong(newIndex);
    },

    previous: () => {
        const state = get();
        // first track + repeat-all wraps to the end
        const newIndex = state.currentIndex === 0
            ? (state.repeat === "all" ? mockSongs.length - 1 : 0)
            : state.currentIndex - 1;
        set({ currentIndex: newIndex });
        syncSong(newIndex);
    },

    setcurrentIndex: (newindex: number) => {
        const clamped = Math.max(0, Math.min(newindex, mockSongs.length - 1));
        set({ currentIndex: clamped });
        syncSong(clamped);
    },
    toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
    cycleRepeat: () => set((s) => ({
        repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
    })),

        }),
        {
            name: "queue-settings",
            partialize: (s) => ({ currentIndex: s.currentIndex, shuffle: s.shuffle, repeat: s.repeat }),
            skipHydration: true,
        }
    )
)
