import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Song } from "../type/song";
import mockSongs from "../data/data";

type playerState = {
    //state
    currentSong: Song,
    isplaying: boolean,
    currentTime: number,
    duration: number,
    volume: number,      // 0 to 1
    muted: boolean,

    // Action
    setcurrentSong: (song: Song) => void,
    play: () => void,
    pause: () => void,
    setCurrentTime: (time: number) => void,
    setDuration: (duration: number) => void,
    setVolume: (volume: number) => void,
    toggleMute: () => void,

}


export const usePlayerStore = create<playerState>()(
    persist(
        (set) => ({
            currentSong: mockSongs[0],
            isplaying: false,
            currentTime: 0,
            duration: 0,
            volume: 1,
            muted: false,
            play: () => set({isplaying: true}),
            pause: () => set({ isplaying: false}),
            setcurrentSong: (value: Song) => set({currentSong: value}),
            setCurrentTime: (time: number) => set({ currentTime: time }),
            setDuration: (duration) => set({duration: duration}),
            setVolume: (volume: number) => set({
                volume: Math.max(0, Math.min(1, volume)),
                muted: false, // moving the slider always unmutes
            }),
            toggleMute: () => set((s) => ({ muted: !s.muted })),
        }),
        {
            name: "player-settings",
            // only persist user preferences, not transient playback state
            partialize: (s) => ({ volume: s.volume, muted: s.muted }),
            // rehydrate manually after mount to avoid SSR hydration mismatch
            skipHydration: true,
        }
    )
)
