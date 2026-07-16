"use client"

// "+ Add to playlist" popover: checkbox list of playlists + inline create.
// Used from library cards and playlist/artist rows.

import { useState } from "react";
import { ListPlus, Plus, Check } from "lucide-react";
import { usePlaylistsStore } from "../store/playlistsStore";

export default function AddToPlaylist({ songId, size = 16 }: { songId: number; size?: number }) {
    const { playlists, toggleSong, createPlaylist, addSong } = usePlaylistsStore();
    const [open, setOpen] = useState(false);
    const [newName, setNewName] = useState("");

    const createAndAdd = () => {
        if (!newName.trim()) return;
        const id = createPlaylist(newName);
        addSong(id, songId);
        setNewName("");
    };

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={() => setOpen(!open)}
                className="text-gray-500 hover:text-white transition"
                title="Add to playlist"
            >
                <ListPlus size={size} />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute bottom-full mb-2 right-0 z-50 bg-[#282828] rounded-xl shadow-xl p-2 flex flex-col gap-1 w-56">
                        <span className="text-xs text-gray-400 px-2 py-1">Add to playlist</span>

                        <div className="max-h-48 overflow-auto flex flex-col gap-0.5">
                            {playlists.length === 0 && (
                                <span className="text-xs text-gray-500 px-2 py-1.5">No playlists yet</span>
                            )}
                            {playlists.map((p) => {
                                const inList = p.songIds.includes(songId);
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => toggleSong(p.id, songId)}
                                        className="flex items-center justify-between gap-2 text-sm text-left px-2 py-1.5 rounded-lg hover:bg-white/10 transition"
                                    >
                                        <span className="truncate">{p.name}</span>
                                        {inList && <Check size={14} className="text-green-400 shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-1 border-t border-white/10 pt-2 mt-1">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") createAndAdd(); }}
                                placeholder="New playlist..."
                                className="bg-white/5 rounded-lg px-2 py-1.5 text-sm outline-none w-full placeholder:text-gray-500"
                            />
                            <button
                                onClick={createAndAdd}
                                disabled={!newName.trim()}
                                className="shrink-0 p-1.5 rounded-lg bg-green-500 text-black disabled:opacity-30 transition"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
