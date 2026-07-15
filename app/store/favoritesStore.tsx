import { create } from "zustand";
import { persist } from "zustand/middleware";

type favoritesState = {
    //state
    likedIds: number[],

    //Action
    toggleLike: (id: number) => void,
    isLiked: (id: number) => boolean,
}

export const useFavoritesStore = create<favoritesState>()(
    persist(
        (set, get) => ({
            likedIds: [],

            toggleLike: (id: number) => set((s) => ({
                likedIds: s.likedIds.includes(id)
                    ? s.likedIds.filter((likedId) => likedId !== id)
                    : [...s.likedIds, id],
            })),

            isLiked: (id: number) => get().likedIds.includes(id),
        }),
        {
            name: "favorites",
            skipHydration: true,
        }
    )
)
