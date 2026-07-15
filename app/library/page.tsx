"use client"

import { useState } from "react";
import Link from "next/link";
import { Play, Pause, Search, X, Heart } from "lucide-react";
import mockSongs from "../data/data";
import { usePlayerStore } from "../store/playerStore";
import { useQueueStore } from "../store/queueStore";
import { useFavoritesStore } from "../store/favoritesStore";
import { useDurationsStore, formatDuration } from "../store/durationsStore";
import { getArtists } from "../lib/artists";
import { playAudio, pauseAudio } from "../lib/audioRef";

export default function LibraryPage() {
    const { currentSong, isplaying, play, pause } = usePlayerStore();
    const { likedIds, toggleLike } = useFavoritesStore();
    const durations = useDurationsStore((s) => s.durations);

    const [search, setSearch] = useState("");
    const query = search.trim().toLowerCase();

    const artists = getArtists();
    const filteredSongs = mockSongs.filter(
        (s) =>
            !query ||
            s.title.toLowerCase().includes(query) ||
            s.artist.toLowerCase().includes(query)
    );

    const playSong = (id: number) => {
        const index = mockSongs.findIndex((s) => s.id === id);
        if (index === -1) return;
        useQueueStore.getState().setcurrentIndex(index);
        play();
        playAudio();
    };

    return (
        <div className="h-full overflow-auto bg-linear-to-b from-gray-950 to-black">
            <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-10">

                {/* header + search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold">Library</h1>
                        <span className="text-sm text-gray-400">{mockSongs.length} nasheeds · {artists.length} artists</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#282828] rounded-full px-4 py-2.5 sm:w-80">
                        <Search size={16} className="text-gray-400 shrink-0" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search the library..."
                            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-500"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-white shrink-0">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* artists row */}
                {!query && (
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Artists</h2>
                        <div className="flex gap-5 overflow-x-auto pb-2">
                            {artists.map((artist) => (
                                <Link
                                    key={artist.slug}
                                    href={`/artist/${artist.slug}`}
                                    className="flex flex-col items-center gap-2 shrink-0 group"
                                >
                                    <img
                                        src={artist.coverUrl}
                                        alt={artist.name}
                                        className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border border-white/10
                                            group-hover:scale-105 group-hover:brightness-110 transition duration-300 shadow-lg"
                                    />
                                    <span className="text-sm font-medium text-center max-w-36 truncate group-hover:text-green-400 transition">
                                        {artist.name}
                                    </span>
                                    <span className="text-xs text-gray-500">{artist.songs.length} nasheeds</span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* all songs grid */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">{query ? `Results for "${search}"` : "All Nasheeds"}</h2>
                    {filteredSongs.length === 0 && (
                        <p className="text-gray-500">Nothing matches &quot;{search}&quot;</p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredSongs.map((song) => {
                            const isCurrent = currentSong.id === song.id;
                            const liked = likedIds.includes(song.id);
                            return (
                                <div
                                    key={song.id}
                                    className={`group relative flex flex-col gap-2 p-3 rounded-2xl transition cursor-pointer
                                        ${isCurrent ? "bg-white/10" : "bg-white/[0.03] hover:bg-white/[0.08]"}`}
                                    onClick={() => playSong(song.id)}
                                >
                                    <div className="relative">
                                        <img
                                            src={song.coverUrl}
                                            alt={song.title}
                                            className="w-full aspect-square object-cover rounded-xl shadow-lg"
                                        />
                                        {/* hover play overlay */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (isCurrent && isplaying) {
                                                    pauseAudio();
                                                    pause();
                                                } else {
                                                    playSong(song.id);
                                                }
                                            }}
                                            className={`absolute bottom-2 right-2 w-10 h-10 rounded-full bg-green-500 text-black
                                                flex items-center justify-center shadow-xl transition-all duration-200
                                                ${isCurrent && isplaying
                                                    ? "opacity-100"
                                                    : "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"}`}
                                        >
                                            {isCurrent && isplaying ? <Pause size={18} /> : <Play size={18} className="translate-x-px" />}
                                        </button>
                                    </div>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex flex-col min-w-0">
                                            <span className={`text-sm font-medium truncate ${isCurrent ? "text-green-400" : ""}`}>
                                                {song.title}
                                            </span>
                                            <span className="text-xs text-gray-400 truncate">{song.artist}</span>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }}
                                            className={`shrink-0 pt-0.5 transition ${liked ? "" : "opacity-0 group-hover:opacity-100"}`}
                                        >
                                            <Heart size={15} className={liked ? "text-green-400 fill-green-400" : "text-gray-500 hover:text-white"} />
                                        </button>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {durations[song.id] ? formatDuration(durations[song.id]) : song.duration}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}
