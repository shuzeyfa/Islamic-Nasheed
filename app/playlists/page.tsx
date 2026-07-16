"use client"

import { useState } from "react";
import Link from "next/link";
import { Plus, Heart, Music } from "lucide-react";
import mockSongs from "../data/data";
import { usePlaylistsStore } from "../store/playlistsStore";
import { useFavoritesStore } from "../store/favoritesStore";

// 2x2 cover mosaic like Spotify folder art
function Mosaic({ songIds }: { songIds: number[] }) {
    const covers = songIds
        .map((id) => mockSongs.find((s) => s.id === id)?.coverUrl)
        .filter(Boolean)
        .slice(0, 4) as string[];

    if (covers.length === 0) {
        return (
            <div className="w-full aspect-square rounded-xl bg-white/5 flex items-center justify-center">
                <Music size={40} className="text-gray-600" />
            </div>
        );
    }
    if (covers.length < 4) {
        return <img src={covers[0]} alt="" className="w-full aspect-square object-cover rounded-xl" />;
    }
    return (
        <div className="w-full aspect-square rounded-xl overflow-hidden grid grid-cols-2 grid-rows-2">
            {covers.map((c, i) => (
                <img key={i} src={c} alt="" className="w-full h-full object-cover" />
            ))}
        </div>
    );
}

export default function PlaylistsPage() {
    const { playlists, createPlaylist } = usePlaylistsStore();
    const { likedIds } = useFavoritesStore();
    const [newName, setNewName] = useState("");
    const [creating, setCreating] = useState(false);

    const create = () => {
        if (!newName.trim()) return;
        createPlaylist(newName);
        setNewName("");
        setCreating(false);
    };

    return (
        <div className="h-full overflow-auto bg-linear-to-b from-gray-950 to-black">
            <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold">Playlists</h1>
                        <span className="text-sm text-gray-400">{playlists.length} playlists</span>
                    </div>
                    <button
                        onClick={() => setCreating(true)}
                        className="flex items-center gap-2 bg-green-500 text-black font-semibold px-5 py-2.5 rounded-full
                            hover:scale-105 active:scale-95 transition shadow-xl"
                    >
                        <Plus size={18} /> New playlist
                    </button>
                </div>

                {creating && (
                    <div className="flex items-center gap-2 bg-[#282828] rounded-2xl p-3 w-full sm:w-96">
                        <input
                            autoFocus
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") create();
                                if (e.key === "Escape") setCreating(false);
                            }}
                            placeholder="Playlist name..."
                            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-500 px-2"
                        />
                        <button
                            onClick={create}
                            disabled={!newName.trim()}
                            className="shrink-0 px-4 py-1.5 rounded-full bg-green-500 text-black text-sm font-semibold disabled:opacity-30"
                        >
                            Create
                        </button>
                        <button onClick={() => setCreating(false)} className="text-sm text-gray-400 px-2">Cancel</button>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {/* Liked Songs — built-in playlist */}
                    <Link
                        href="/playlist/liked"
                        className="group flex flex-col gap-3 p-3 rounded-2xl bg-linear-to-br from-green-900/60 to-white/[0.03] hover:from-green-800/60 transition"
                    >
                        <div className="w-full aspect-square rounded-xl bg-linear-to-br from-green-500 to-green-800 flex items-center justify-center">
                            <Heart size={48} className="text-white fill-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium group-hover:text-green-400 transition">Liked Songs</span>
                            <span className="text-xs text-gray-400">{likedIds.length} nasheeds</span>
                        </div>
                    </Link>

                    {playlists.map((p) => (
                        <Link
                            key={p.id}
                            href={`/playlist/${p.id}`}
                            className="group flex flex-col gap-3 p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] transition"
                        >
                            <Mosaic songIds={p.songIds} />
                            <div className="flex flex-col">
                                <span className="font-medium truncate group-hover:text-green-400 transition">{p.name}</span>
                                <span className="text-xs text-gray-400">{p.songIds.length} nasheeds</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {playlists.length === 0 && !creating && (
                    <p className="text-gray-500 text-sm">
                        No playlists yet — create one, or use the <span className="inline-flex align-middle mx-1"><Plus size={14} /></span>
                        icon on any song in the Library.
                    </p>
                )}
            </div>
        </div>
    );
}
