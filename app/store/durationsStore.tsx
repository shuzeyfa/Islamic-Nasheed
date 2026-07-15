import { create } from "zustand";
import { persist } from "zustand/middleware";

// Real track durations, learned progressively: whenever a song's metadata
// loads we cache its true length here, replacing the hardcoded guess in data.
type durationsState = {
    //state
    durations: Record<number, number>, // song id -> seconds

    //Action
    setSongDuration: (id: number, seconds: number) => void,
}

export const useDurationsStore = create<durationsState>()(
    persist(
        (set) => ({
            durations: {},

            setSongDuration: (id: number, seconds: number) => set((s) => (
                // ignore junk values (NaN, Infinity from live streams)
                Number.isFinite(seconds) && seconds > 0
                    ? { durations: { ...s.durations, [id]: seconds } }
                    : s
            )),
        }),
        {
            name: "durations",
            skipHydration: true,
        }
    )
)

export const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
};
