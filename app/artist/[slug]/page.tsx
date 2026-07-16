"use client"

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Pause, ArrowLeft, Heart, Shuffle } from "lucide-react";
import mockSongs from "../../data/data";
import { usePlayerStore } from "../../store/playerStore";
import { useQueueStore } from "../../store/queueStore";
import { useFavoritesStore } from "../../store/favoritesStore";
import { useDurationsStore, formatDuration } from "../../store/durationsStore";
import { getArtist } from "../../lib/artists";
import { playAudio, pauseAudio } from "../../lib/audioRef";
import { useDominantColor } from "../../lib/useDominantColor";
import AddToPlaylist from "../../components/AddToPlaylist";

export default function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const artist = getArtist(slug);

    const { currentSong, isplaying, play, pause } = usePlayerStore();
    const { likedIds, toggleLike } = useFavoritesStore();
    const durations = useDurationsStore((s) => s.durations);
    const themeColor = useDominantColor(artist?.coverUrl ?? "");

    if (!artist) notFound();

    const playSong = (id: number) => {
        const index = mockSongs.findIndex((s) => s.id === id);
        if (index === -1) return;
        useQueueStore.getState().setcurrentIndex(index);
        play();
        playAudio();
    };

    const playAll = () => playSong(artist.songs[0].id);

    const shufflePlay = () => {
        // enable shuffle, start from the artist's first track, then let the
        // queue store (which owns randomization) jump to a random song
        if (!useQueueStore.getState().shuffle) {
            useQueueStore.getState().toggleShuffle();
        }
        playSong(artist.songs[0].id);
        useQueueStore.getState().next();
    };

    const artistIsPlaying = isplaying && artist.songs.some((s) => s.id === currentSong.id);

    return (
        <div className="h-full overflow-auto bg-linear-to-b from-gray-950 to-black">
            {/* hero header tinted by the artist's cover */}
            <div
                className="relative px-4 sm:px-8 pt-6 pb-8"
                style={{
                    background: `linear-gradient(to bottom, rgba(${themeColor}, 0.35), transparent)`,
                }}
            >
                <div className="max-w-6xl mx-auto flex flex-col gap-6">
                    <Link
                        href="/library"
                        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition w-fit"
                    >
                        <ArrowLeft size={16} /> Library
                    </Link>

                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                        <img
                            src={artist.coverUrl}
                            alt={artist.name}
                            className="w-40 h-40 sm:w-52 sm:h-52 rounded-full object-cover shadow-2xl border border-white/10"
                        />
                        <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
                            <span className="text-xs uppercase tracking-wider text-gray-300">Artist</span>
                            <h1 className="text-4xl sm:text-6xl font-bold">{artist.name}</h1>
                            <span className="text-gray-300">{artist.songs.length} nasheeds</span>
                            <div className="flex items-center gap-3 mt-3">
                                <button
                                    onClick={artistIsPlaying ? () => { pauseAudio(); pause(); } : playAll}
                                    className="flex items-center gap-2 bg-green-500 text-black font-semibold px-6 py-2.5 rounded-full
                                        hover:scale-105 active:scale-95 transition shadow-xl"
                                >
                                    {artistIsPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-px" />}
                                    {artistIsPlaying ? "Pause" : "Play"}
                                </button>
                                <button
                                    onClick={shufflePlay}
                                    className="flex items-center gap-2 border border-white/30 px-5 py-2.5 rounded-full
                                        hover:bg-white/10 transition text-sm font-medium"
                                >
                                    <Shuffle size={16} /> Shuffle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* track list */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-10">
                <div className="flex flex-col">
                    {artist.songs.map((song, i) => {
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
                                    <span className="text-xs text-gray-400 truncate">{song.album}</span>
                                </div>
                                <div className={`transition ${liked ? "" : "opacity-0 group-hover:opacity-100"}`}>
                                    <AddToPlaylist songId={song.id} />
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }}
                                    className={`transition ${liked ? "" : "opacity-0 group-hover:opacity-100"}`}
                                >
                                    <Heart size={16} className={liked ? "text-green-400 fill-green-400" : "text-gray-500 hover:text-white"} />
                                </button>
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
