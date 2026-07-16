"use client"

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, Heart, Trash2, Pencil, X, Music } from "lucide-react";
import mockSongs from "../../data/data";
import { usePlayerStore } from "../../store/playerStore";
import { useQueueStore } from "../../store/queueStore";
import { useFavoritesStore } from "../../store/favoritesStore";
import { useDurationsStore, formatDuration } from "../../store/durationsStore";
import { usePlaylistsStore } from "../../store/playlistsStore";
import { playAudio, pauseAudio } from "../../lib/audioRef";
import { useRouter } from "next/navigation";

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const { currentSong, isplaying, play, pause } = usePlayerStore();
    const { likedIds, toggleLike } = useFavoritesStore();
    const durations = useDurationsStore((s) => s.durations);
    const { playlists, renamePlaylist, deletePlaylist, removeSong } = usePlaylistsStore();

    const [editing, setEditing] = useState(false);
    const [nameDraft, setNameDraft] = useState("");

    const isLikedPage = id === "liked";
    const playlist = isLikedPage ? null : playlists.find((p) => p.id === id);

    const songIds = isLikedPage ? likedIds : (playlist?.songIds ?? []);
    const songs = songIds
        .map((sid) => mockSongs.find((s) => s.id === sid))
        .filter((s): s is NonNullable<typeof s> => Boolean(s));

    const title = isLikedPage ? "Liked Songs" : (playlist?.name ?? "");

    const playSong = (songId: number) => {
        const index = mockSongs.findIndex((s) => s.id === songId);
        if (index === -1) return;
        useQueueStore.getState().setcurrentIndex(index);
        play();
        playAudio();
    };

    const listIsPlaying = isplaying && songs.some((s) => s.id === currentSong.id);

    // not-found playlist (deleted, bad url) — friendly fallback instead of crash
    if (!isLikedPage && !playlist) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-gray-400">
                <Music size={48} />
                <p>This playlist doesn&apos;t exist (anymore).</p>
                <Link href="/playlists" className="text-green-400 hover:underline">Back to playlists</Link>
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto bg-linear-to-b from-gray-950 to-black">
            {/* header */}
            <div className={`relative px-4 sm:px-8 pt-6 pb-8 bg-linear-to-b ${isLikedPage ? "from-green-900/50" : "from-white/10"} to-transparent`}>
                <div className="max-w-6xl mx-auto flex flex-col gap-6">
                    <Link
                        href="/playlists"
                        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition w-fit"
                    >
                        <ArrowLeft size={16} /> Playlists
                    </Link>

                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                        {isLikedPage ? (
                            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-linear-to-br from-green-500 to-green-800 flex items-center justify-center shadow-2xl">
                                <Heart size={64} className="text-white fill-white" />
                            </div>
                        ) : songs.length > 0 ? (
                            <img src={songs[0].coverUrl} alt="" className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover shadow-2xl" />
                        ) : (
                            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-white/5 flex items-center justify-center">
                                <Music size={48} className="text-gray-600" />
                            </div>
                        )}

                        <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left flex-1 min-w-0">
                            <span className="text-xs uppercase tracking-wider text-gray-300">Playlist</span>

                            {editing && playlist ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={nameDraft}
                                        onChange={(e) => setNameDraft(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") { renamePlaylist(playlist.id, nameDraft); setEditing(false); }
                                            if (e.key === "Escape") setEditing(false);
                                        }}
                                        className="bg-white/10 rounded-xl px-3 py-1 text-3xl sm:text-5xl font-bold outline-none w-full"
                                    />
                                    <button onClick={() => { renamePlaylist(playlist.id, nameDraft); setEditing(false); }}
                                        className="text-green-400 text-sm font-semibold shrink-0">Save</button>
                                    <button onClick={() => setEditing(false)} className="text-gray-400 shrink-0"><X size={18} /></button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 min-w-0">
                                    <h1 className="text-3xl sm:text-5xl font-bold truncate">{title}</h1>
                                    {playlist && (
                                        <button
                                            onClick={() => { setNameDraft(playlist.name); setEditing(true); }}
                                            className="text-gray-400 hover:text-white transition shrink-0"
                                            title="Rename"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    )}
                                </div>
                            )}

                            <span className="text-gray-300">{songs.length} nasheeds</span>

                            <div className="flex items-center gap-3 mt-3">
                                {songs.length > 0 && (
                                    <button
                                        onClick={listIsPlaying ? () => { pauseAudio(); pause(); } : () => playSong(songs[0].id)}
                                        className="flex items-center gap-2 bg-green-500 text-black font-semibold px-6 py-2.5 rounded-full
                                            hover:scale-105 active:scale-95 transition shadow-xl"
                                    >
                                        {listIsPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-px" />}
                                        {listIsPlaying ? "Pause" : "Play"}
                                    </button>
                                )}
                                {playlist && (
                                    <button
                                        onClick={() => {
                                            deletePlaylist(playlist.id);
                                            router.push("/playlists");
                                        }}
                                        className="flex items-center gap-2 border border-red-400/40 text-red-400 px-5 py-2.5 rounded-full
                                            hover:bg-red-400/10 transition text-sm font-medium"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* track list */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-10">
                {songs.length === 0 && (
                    <p className="text-gray-500 text-sm px-3">
                        {isLikedPage
                            ? "No liked songs yet — tap the heart on any nasheed."
                            : "Empty playlist — add songs from the Library with the add-to-playlist icon."}
                    </p>
                )}
                <div className="flex flex-col">
                    {songs.map((song, i) => {
                        const isCurrent = currentSong.id === song.id;
                        const liked = likedIds.includes(song.id);
                        return (
                            <div
                                key={song.id}
                                onClick={() => playSong(song.id)}
                                className={`group grid grid-cols-[2rem_3rem_1fr_auto_auto_auto] items-center gap-4 px-3 py-2 rounded-xl cursor-pointer transition
                                    ${isCurrent ? "bg-white/10" : "hover:bg-white/5"}`}
                            >
                                <span className={`text-sm text-right ${isCurrent ? "text-green-400" : "text-gray-500"}`}>
                                    {isCurrent && isplaying ? (
                                        <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    ) : (
                                        i + 1
                                    )}
                                </span>
                                <img src={song.coverUrl} alt="" className="w-11 h-11 rounded-lg object-cover" />
                                <div className="flex flex-col min-w-0">
                                    <span className={`text-sm font-medium truncate ${isCurrent ? "text-green-400" : ""}`}>
                                        {song.title}
                                    </span>
                                    <span className="text-xs text-gray-400 truncate">{song.artist}</span>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }}
                                    className={`transition ${liked ? "" : "opacity-0 group-hover:opacity-100"}`}
                                >
                                    <Heart size={16} className={liked ? "text-green-400 fill-green-400" : "text-gray-500 hover:text-white"} />
                                </button>
                                {playlist ? (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeSong(playlist.id, song.id); }}
                                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition"
                                        title="Remove from playlist"
                                    >
                                        <X size={16} />
                                    </button>
                                ) : <span />}
                                <span className="text-sm text-gray-500 tabular-nums">
                                    {durations[song.id] ? formatDuration(durations[song.id]) : song.duration}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
