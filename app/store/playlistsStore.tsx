import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Playlist = {
    id: string;
    name: string;
    songIds: number[];
    createdAt: number;
};

type playlistsState = {
    //state
    playlists: Playlist[],

    //Action
    createPlaylist: (name: string) => string, // returns new id
    renamePlaylist: (id: string, name: string) => void,
    deletePlaylist: (id: string) => void,
    addSong: (playlistId: string, songId: number) => void,
    removeSong: (playlistId: string, songId: number) => void,
    toggleSong: (playlistId: string, songId: number) => void,
}

// deterministic-enough id without uuid dependency
const newId = () => `pl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export const usePlaylistsStore = create<playlistsState>()(
    persist(
        (set, get) => ({
            playlists: [],

            createPlaylist: (name: string) => {
                const id = newId();
                set((s) => ({
                    playlists: [...s.playlists, {
                        id,
                        name: name.trim() || "New Playlist",
                        songIds: [],
                        createdAt: Date.now(),
                    }],
                }));
                return id;
            },

            renamePlaylist: (id, name) => set((s) => ({
                playlists: s.playlists.map((p) =>
                    p.id === id ? { ...p, name: name.trim() || p.name } : p
                ),
            })),

            deletePlaylist: (id) => set((s) => ({
                playlists: s.playlists.filter((p) => p.id !== id),
            })),

            addSong: (playlistId, songId) => set((s) => ({
                playlists: s.playlists.map((p) =>
                    p.id === playlistId && !p.songIds.includes(songId)
                        ? { ...p, songIds: [...p.songIds, songId] }
                        : p
                ),
            })),

            removeSong: (playlistId, songId) => set((s) => ({
                playlists: s.playlists.map((p) =>
                    p.id === playlistId
                        ? { ...p, songIds: p.songIds.filter((id) => id !== songId) }
                        : p
                ),
            })),

            toggleSong: (playlistId, songId) => {
                const playlist = get().playlists.find((p) => p.id === playlistId);
                if (!playlist) return;
                if (playlist.songIds.includes(songId)) {
                    get().removeSong(playlistId, songId);
                } else {
                    get().addSong(playlistId, songId);
                }
            },
        }),
        {
            name: "playlists",
            skipHydration: true,
        }
    )
)
