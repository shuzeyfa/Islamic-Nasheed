"use client"

import SideBarList from "./components/sideBarList";
import Visualizer from "./components/Visualizer";
import VisualizerRing from "./components/VisualizerRing";
import { useDominantColor } from "./lib/useDominantColor";
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle, User, ChevronDown, List, Volume2, Volume1, VolumeX, Search, X, Loader2, AlertCircle, Heart } from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import mockSongs from "./data/data";
import type { Song } from "@/app/type/song";
import { usePlayerStore } from "./store/playerStore";
import { useQueueStore } from "./store/queueStore";
import { useFavoritesStore } from "./store/favoritesStore";
import { useDurationsStore } from "./store/durationsStore";



export default function Home() {

  const {isplaying, play, pause, currentSong, currentTime, duration, setDuration, setCurrentTime, volume, muted, setVolume, toggleMute, status, setStatus} = usePlayerStore();
  const { toggleShuffle, next, previous, shuffle, repeat, cycleRepeat } = useQueueStore();
  const { likedIds, toggleLike } = useFavoritesStore();

  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mobileList, setmobileList] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [likedOnly, setLikedOnly] = useState<boolean>(false);
  // while scrubbing: preview position in seconds, null when not dragging
  const [dragTime, setDragTime] = useState<number | null>(null);

  // dominant color of the current cover, as an "r, g, b" triplet
  const themeColor = useDominantColor(currentSong.coverUrl);

  const query = search.trim().toLowerCase();
  const filteredSongs = mockSongs.filter((s) => {
    if (likedOnly && !likedIds.includes(s.id)) return false;
    if (!query) return true;
    return (
      s.title.toLowerCase().includes(query) ||
      s.artist.toLowerCase().includes(query)
    );
  });
  
  

  const getCurrentTime = (timeInsecond: number) => {
    if (!timeInsecond || isNaN(timeInsecond)) return "0:00";

    const minute = Math.floor(timeInsecond / 60);
    const second = Math.floor(timeInsecond % 60);
    return `${minute}:${second.toString().padStart(2, "0")}`;
  }


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

  // keep the audio element's volume in sync with the store
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

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
    <div className=" flex w-screen ">
      <audio src={currentSong.audioUrl} ref={audioRef} crossOrigin="anonymous" />
      <div className=" h-screen w-[23%] bg-[#181818] lg:flex flex-col md:p-2 gap-y-3 pt-4 overflow-auto hidden   ">
        <div className="flex flex-col px-4 py-3 gap-3">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Queue</h1>
              <button
                onClick={() => setLikedOnly(!likedOnly)}
                className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded-full transition
                  ${likedOnly ? "bg-green-500/20 text-green-400" : "text-gray-400 hover:text-white"}`}
                title="Show favorites only"
              >
                <Heart size={14} className={likedOnly ? "fill-green-400" : ""} />
                {likedIds.length}
              </button>
            </div>
            <span className="text-sm text-gray-400">
              {filteredSongs.length} {query || likedOnly ? `of ${mockSongs.length}` : ""} tracks
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[#282828] rounded-full px-3 py-2">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or artist..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-500"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-white shrink-0">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className=" gap-y-4 flex flex-col ">
          {filteredSongs.length === 0 && (
            <span className="text-sm text-gray-500 px-4">
              {likedOnly && !query ? "No favorites yet — tap the heart on a song" : `No tracks match "${search}"`}
            </span>
          )}
          {filteredSongs.map((song) => (
            <div key={song.id} className=" hover:bg-gray-900 rounded-2xl ">
              <SideBarList 
                song={song}
                current={currentSong.id}
                onSelect={(selectedSong) => {
                  const newIndex = mockSongs.findIndex(s => s.id === selectedSong.id);
                  if (newIndex === -1) return;

                  useQueueStore.getState().setcurrentIndex(newIndex);
                  play();
                }}
                />
            </div>
            
          ))}
        </div>
        
      </div>

      <div className=" flex flex-col w-full lg:w-[77%] h-screen ">
        
        <div className="h-[83%] flex items-center justify-center px-5 sm:px-8 bg-linear-to-b from-gray-950 to-black relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={currentSong.coverUrl}
              alt=""
              className="w-full h-full object-cover blur-xl scale-125 opacity-35"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/60 to-transparent" />
            {/* ambient tint from the cover's dominant color */}
            <div
              className="absolute inset-0 transition-[background] duration-1000"
              style={{
                background: `radial-gradient(ellipse at 35% 40%, rgba(${themeColor}, ${isplaying ? 0.22 : 0.10}), transparent 65%)`,
              }}
            />
          </div>

          <div className="
            relative w-full max-w-5xl mx-auto
            flex flex-col lg:flex-row items-center lg:items-start
            gap-10 lg:gap-16
            py-6 lg:py-0
          ">
            <div className="relative shrink-0 w-64 sm:w-80 lg:w-95 aspect-square">
              <div
                className={`
                  absolute inset-0 rounded-3xl blur-2xl transition-all duration-1000
                  ${isplaying ? 'opacity-80' : 'opacity-0'}
                `}
                style={{ backgroundColor: `rgba(${themeColor}, 0.25)` }}
              />

              <VisualizerRing audioRef={audioRef} isplaying={isplaying} color={themeColor} />

              <img
                className={`
                  relative w-full h-full rounded-2xl sm:rounded-3xl object-cover
                  shadow-2xl shadow-black/70 border border-white/5
                  transition-all duration-700 ease-out
                  ${isplaying 
                    ? 'scale-[1.03] brightness-110 ring-1 ring-white/20' 
                    : 'hover:scale-[1.02] hover:brightness-105'
                  }
                `}
                src={currentSong.coverUrl}
                alt={currentSong.title}
              />

              {isplaying && (
                <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-green-500 rounded-full shadow-lg flex items-center justify-center animate-pulse">
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                </div>
              )}
            </div>

            <div className="flex flex-col items-center lg:items-start gap-4 lg:gap-6 text-center lg:text-left max-w-xl">
              <span
                className="text-sm sm:text-base uppercase tracking-wider font-medium transition-colors duration-1000"
                style={{ color: `rgba(${themeColor}, 0.85)` }}
              >
                Now Playing
              </span>

              <div className="flex items-center gap-4">
                <h1 className="
                  text-4xl sm:text-5xl lg:text-6xl
                  font-bold leading-tight tracking-tight
                  text-white line-clamp-2
                ">
                  {currentSong.title}
                </h1>
                <button
                  onClick={() => toggleLike(currentSong.id)}
                  className="shrink-0 transition-transform hover:scale-110 active:scale-95"
                  title={likedIds.includes(currentSong.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart
                    size={32}
                    className={likedIds.includes(currentSong.id)
                      ? "text-green-500 fill-green-500"
                      : "text-gray-400 hover:text-white"}
                  />
                </button>
              </div>

              <div className="flex items-center gap-3 text-green-100/90 text-xl sm:text-2xl">
                <User size={26} className="transition-colors duration-1000" style={{ color: `rgba(${themeColor}, 0.8)` }} />
                <span className="font-medium">{currentSong.artist}</span>
              </div>

              <span className="text-lg sm:text-xl text-gray-300/80 italic">
                {currentSong.album}
              </span>

              <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                {status === "error" ? (
                  <>
                    <AlertCircle size={16} className="text-red-400" />
                    <span className="text-red-400">Couldn&apos;t load this track — try another or skip</span>
                  </>
                ) : status === "loading" && isplaying ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-green-400" />
                    <span>Buffering…</span>
                  </>
                ) : (
                  <>
                    <div className={`w-2.5 h-2.5 rounded-full ${isplaying ? 'animate-ping' : ''}`}
                      style={{ backgroundColor: isplaying ? `rgb(${themeColor})` : '#4b5563' }} />
                    <span>{isplaying ? 'Playing' : 'Paused'}</span>
                  </>
                )}
              </div>

              <div className="w-full max-w-md">
                <Visualizer audioRef={audioRef} isplaying={isplaying} color={themeColor} />
              </div>
            </div>
          </div>
        </div>

        <div className=" bg-[#181818] h-[17%] flex flex-col items-center justify-center px-4 lg:px-12 gap-4">
          <div className=" flex justify-center gap-3 items-center w-full ">
            <span className=" text-white/90 text-left ">
              {getCurrentTime(dragTime ?? currentTime)}
            </span>
            <div className="flex-1 h-2 bg-gray-700 rounded-full relative cursor-pointer group touch-none"
              onPointerDown={(e) => {
                if (!duration) return;
                // capture so we keep getting move events outside the bar
                e.currentTarget.setPointerCapture(e.pointerId);
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                setDragTime(pct * duration);
              }}
              onPointerMove={(e) => {
                if (dragTime === null || !duration) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                setDragTime(pct * duration);
              }}
              onPointerUp={() => {
                if (dragTime === null) return;
                if (audioRef.current) {
                  audioRef.current.currentTime = dragTime;
                  setCurrentTime(dragTime);
                }
                setDragTime(null);
              }}
              onPointerCancel={() => setDragTime(null)}
              >
              <div className={` h-full bg-white/90 rounded-full ${dragTime === null ? "transition-all duration-150 ease-out" : ""} `}
                style={{ width: duration > 0 ? `${((dragTime ?? currentTime) / duration) * 100}%` : "0%" }}
                />
              {/* scrub handle: visible on hover or while dragging */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow
                  ${dragTime !== null ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
                style={{ left: duration > 0 ? `${((dragTime ?? currentTime) / duration) * 100}%` : "0%" }}
              />
            </div>
            <span className="text-white/90 text-sm font-medium text-right">
              {getCurrentTime(duration)}
            </span>

          </div>

          <div className=" grid grid-cols-3 items-center w-full  ">
            <div  className=" justify-self-start flex items-center gap-2 ">
              <button
                onClick={toggleShuffle}
                className={`justify-self-start ${shuffle ? "text-white" : "text-gray-400"}`}
              >
                <Shuffle />
              </button>  
              <button
                className={`lg:hidden transition ${repeat !== "off" ? "text-green-400" : "text-gray-400 hover:text-white"}`}
                onClick={cycleRepeat}
                title={`Repeat: ${repeat}`}
              >
                {repeat === "one" ? <Repeat1 size={20} /> : <Repeat size={20} />}
              </button>
            </div>
            
            <div className="flex justify-center items-center gap-3">
              <button
                className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition"
                onClick={() => {
                  // standard player behavior: >3s in restarts the track, otherwise go back
                  if (audioRef.current && audioRef.current.currentTime > 3) {
                    audioRef.current.currentTime = 0;
                    return;
                  }
                  previous();
                }}
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (!audioRef.current) return;
                  if (isplaying) {
                    audioRef.current.pause();
                    pause();           // use pause from store
                  } else {
                    audioRef.current.play().catch(() => {});
                    play();            // use play from store
                  }
                }}
                className="w-9 h-9 flex items-center justify-center border border-white/30 rounded-full hover:bg-white/10 transition"
              >
                {status === "loading" && isplaying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isplaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 translate-x-px" />
                )}
              </button>

              <button
                className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition"
                onClick={() => {
                  next();
                }}
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            
            <div className=" justify-self-end flex items-center gap-3 ">
              <div className="hidden lg:flex items-center gap-2 group">
                <button
                  onClick={toggleMute}
                  className="text-gray-400 hover:text-white transition"
                >
                  {muted || volume === 0 ? (
                    <VolumeX size={20} />
                  ) : volume < 0.5 ? (
                    <Volume1 size={20} />
                  ) : (
                    <Volume2 size={20} />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-24 h-1 accent-white cursor-pointer"
                  aria-label="Volume"
                />
              </div>
              <button
                className={`justify-self-end hidden lg:block transition ${repeat !== "off" ? "text-green-400" : "text-gray-400 hover:text-white"}`}
                onClick={cycleRepeat}
                title={`Repeat: ${repeat}`}
              >
                {repeat === "one" ? <Repeat1 size={20} /> : <Repeat size={20} />}
              </button>
              <button 
                onClick={() => setmobileList(!mobileList)}
                className=" lg:hidden "> <List /> </button>

            </div>
          </div>

        </div>

        
      </div>
      
      {mobileList &&

        <>
        <div
          className=" fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setmobileList(false)}
        />

        <div
            className=" h-[70vh] max-h-[85vh] fixed inset-x-0 bg-[#181818] animate-slide-up backdrop-blur-2xl bottom-0 z-50 rounded-t-3xl overflow-auto shadow-2xl flex flex-col ">
          <div className=" flex justify-between items-center w-full p-3 bg-[#282828]  ">
            <span>Queue</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLikedOnly(!likedOnly)}
                className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded-full transition
                  ${likedOnly ? "bg-green-500/20 text-green-400" : "text-gray-400"}`}
              >
                <Heart size={14} className={likedOnly ? "fill-green-400" : ""} />
                {likedIds.length}
              </button>
              <div className=" text-[#b3b3b3] " onClick={() => setmobileList(!mobileList)} > <ChevronDown /> </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#282828] rounded-full px-3 py-2 mx-3 mt-3">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or artist..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-500"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-white shrink-0">
                <X size={16} />
              </button>
            )}
          </div>

          {filteredSongs.length === 0 && (
            <span className="text-sm text-gray-500 px-4 py-3">
              {likedOnly && !query ? "No favorites yet — tap the heart on a song" : `No tracks match "${search}"`}
            </span>
          )}
          {filteredSongs.map((song: Song) => (
            <div key={song.id} >
              <SideBarList song={song} current = {currentSong.id} 
              onSelect={(selectedSong) => {
                const newIndex = mockSongs.findIndex(s => s.id === selectedSong.id);
                if (newIndex === -1) return;

                useQueueStore.getState().setcurrentIndex(newIndex);
                play();

                setmobileList(false);

              }}
              />
            </div>
          ))}
        </div>
        </>

      }
      
    </div>
  );
}
