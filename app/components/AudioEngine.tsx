"use client"

// Global audio engine: rendered once in the root layout so playback,
// media-session integration, keyboard shortcuts, and persistence work
// on every route and survive navigation.

import { useEffect } from "react";
import { usePlayerStore } from "../store/playerStore";
import { useQueueStore } from "../store/queueStore";
import { useFavoritesStore } from "../store/favoritesStore";
import { useDurationsStore } from "../store/durationsStore";
import { audioRef } from "../lib/audioRef";
import mockSongs from "../data/data";

export default function AudioEngine() {
    const { isplaying, play, pause, currentSong, setDuration, setCurrentTime, volume, muted, playbackRate, setStatus } = usePlayerStore();
    const { next, previous } = useQueueStore();

    // restore persisted settings (volume, shuffle, repeat, last song) after mount
    // skipHydration + manual rehydrate avoids a server/client HTML mismatch
    useEffect(() => {
        usePlayerStore.persist.rehydrate();
        useQueueStore.persist.rehydrate();
        useFavoritesStore.persist.rehydrate();
        useDurationsStore.persist.rehydrate();
        // point currentSong at the restored queue position
        const { currentIndex } = useQueueStore.getState();
        usePlayerStore.getState().setcurrentSong(mockSongs[currentIndex]);
    }, []);

    // audio element event wiring
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
        };

        const setAudioDuration = () => {
            setDuration(audio.duration || 0);
            // cache the real duration for the queue list
            useDurationsStore.getState().setSongDuration(
                usePlayerStore.getState().currentSong.id,
                audio.duration
            );
        };

        const handleEnded = () => {
            const { currentIndex, shuffle, repeat } = useQueueStore.getState();

            if (repeat === "one") {
                // replay the same track
                audio.currentTime = 0;
                audio.play().catch(() => {});
                return;
            }

            if (repeat === "off" && !shuffle && currentIndex === mockSongs.length - 1) {
                // end of queue: stop instead of staying stuck on "Playing"
                pause();
                return;
            }

            next();
        };

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", setAudioDuration);
        audio.addEventListener("ended", handleEnded);

        // loading / buffering / error status
        const onLoadStart = () => setStatus("loading");
        const onWaiting = () => setStatus("loading");
        const onCanPlay = () => setStatus("ready");
        const onError = () => {
            setStatus("error");
            pause(); // don't pretend to be playing a broken stream
        };
        audio.addEventListener("loadstart", onLoadStart);
        audio.addEventListener("waiting", onWaiting);
        audio.addEventListener("canplay", onCanPlay);
        audio.addEventListener("playing", onCanPlay);
        audio.addEventListener("error", onError);

        if (isplaying) {
            audio.play().catch(() => {});
        }

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", setAudioDuration);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("loadstart", onLoadStart);
            audio.removeEventListener("waiting", onWaiting);
            audio.removeEventListener("canplay", onCanPlay);
            audio.removeEventListener("playing", onCanPlay);
            audio.removeEventListener("error", onError);
        };
    }, [currentSong, isplaying, next, pause, setCurrentTime, setDuration, setStatus]);

    // keep the audio element's volume/rate in sync with the store
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = volume;
        audio.muted = muted;
        audio.playbackRate = playbackRate;
    }, [volume, muted, playbackRate, currentSong]);

    // keyboard shortcuts: Space play/pause, arrows seek/volume, M mute, S shuffle, R repeat
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // don't hijack keys while typing in an input
            const target = e.target as HTMLElement;
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

            const audio = audioRef.current;
            const player = usePlayerStore.getState();
            const queue = useQueueStore.getState();

            switch (e.code) {
                case "Space":
                    e.preventDefault(); // stop page scroll
                    if (!audio) return;
                    if (player.isplaying) {
                        audio.pause();
                        player.pause();
                    } else {
                        audio.play().catch(() => {});
                        player.play();
                    }
                    break;
                case "ArrowRight":
                    if (audio) audio.currentTime = Math.min(audio.currentTime + 5, audio.duration || 0);
                    break;
                case "ArrowLeft":
                    if (audio) audio.currentTime = Math.max(audio.currentTime - 5, 0);
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    player.setVolume(player.volume + 0.1);
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    player.setVolume(player.volume - 0.1);
                    break;
                case "KeyM":
                    player.toggleMute();
                    break;
                case "KeyS":
                    queue.toggleShuffle();
                    break;
                case "KeyR":
                    queue.cycleRepeat();
                    break;
                case "KeyN":
                    queue.next();
                    break;
                case "KeyP":
                    queue.previous();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Media Session API: OS media controls (lock screen, media keys, Windows overlay)
    useEffect(() => {
        if (!("mediaSession" in navigator)) return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: currentSong.title,
            artist: currentSong.artist,
            album: currentSong.album,
            artwork: [{ src: currentSong.coverUrl, sizes: "512x512", type: "image/png" }],
        });

        navigator.mediaSession.setActionHandler("play", () => {
            audioRef.current?.play().catch(() => {});
            play();
        });
        navigator.mediaSession.setActionHandler("pause", () => {
            audioRef.current?.pause();
            pause();
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => next());
        navigator.mediaSession.setActionHandler("previoustrack", () => previous());
        navigator.mediaSession.setActionHandler("seekto", (details) => {
            if (audioRef.current && details.seekTime != null) {
                audioRef.current.currentTime = details.seekTime;
            }
        });
    }, [currentSong, play, pause, next, previous]);

    // reflect playing state in the OS media UI
    useEffect(() => {
        if (!("mediaSession" in navigator)) return;
        navigator.mediaSession.playbackState = isplaying ? "playing" : "paused";
    }, [isplaying]);

    return (
        <audio
            src={currentSong.audioUrl}
            ref={(el) => { audioRef.current = el; }}
            crossOrigin="anonymous"
        />
    );
}
