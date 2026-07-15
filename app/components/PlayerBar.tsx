"use client"

// Persistent player bar, rendered in the root layout — stays visible and
// keeps playing across every route (like Spotify's bottom bar).

import { useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle, ChevronDown, List, Volume2, Volume1, VolumeX, Loader2, Heart } from 'lucide-react';
import { usePlayerStore } from "../store/playerStore";
import { useQueueStore } from "../store/queueStore";
import { useFavoritesStore } from "../store/favoritesStore";
import { audioRef, playAudio, pauseAudio, seekTo } from "../lib/audioRef";
import mockSongs from "../data/data";
import SideBarList from "./sideBarList";
import SleepTimer from "./SleepTimer";
import type { Song } from "../type/song";

export default function PlayerBar() {
    const { isplaying, play, pause, currentSong, currentTime, duration, setCurrentTime, volume, muted, setVolume, toggleMute, status, playbackRate, cyclePlaybackRate } = usePlayerStore();
    const { toggleShuffle, next, previous, shuffle, repeat, cycleRepeat } = useQueueStore();
    const { likedIds, toggleLike } = useFavoritesStore();

    const [mobileList, setmobileList] = useState<boolean>(false);
    // while scrubbing: preview position in seconds, null when not dragging
    const [dragTime, setDragTime] = useState<number | null>(null);

    // A-B loop: repeat a section (e.g. to memorize a verse). null = unset
    const [loopA, setLoopA] = useState<number | null>(null);
    const [loopB, setLoopB] = useState<number | null>(null);

    const handleLoopButton = () => {
        if (loopA === null) {
            setLoopA(currentTime);            // 1st press: mark A
        } else if (loopB === null) {
            if (currentTime > loopA + 1) {
                setLoopB(currentTime);          // 2nd press: mark B, loop active
            }
        } else {
            setLoopA(null);                   // 3rd press: clear
            setLoopB(null);
        }
    };

    // enforce the loop while playing
    useEffect(() => {
        if (loopA === null || loopB === null) return;
        if (currentTime >= loopB) {
            seekTo(loopA);
        }
    }, [currentTime, loopA, loopB]);

    // reset the loop when the song changes (adjust-state-during-render pattern)
    const [loopSongId, setLoopSongId] = useState(currentSong.id);
    if (loopSongId !== currentSong.id) {
        setLoopSongId(currentSong.id);
        setLoopA(null);
        setLoopB(null);
    }

    const getCurrentTime = (timeInsecond: number) => {
        if (!timeInsecond || isNaN(timeInsecond)) return "0:00";

        const minute = Math.floor(timeInsecond / 60);
        const second = Math.floor(timeInsecond % 60);
        return `${minute}:${second.toString().padStart(2, "0")}`;
    }

    return (
        <>
        <div className=" bg-[#181818] border-t border-white/5 flex flex-col items-center justify-center px-4 lg:px-12 gap-3 py-3">
          {/* mini now-playing row */}
          <div className="flex items-center gap-3 w-full lg:hidden">
            <img src={currentSong.coverUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium truncate">{currentSong.title}</span>
              <span className="text-xs text-gray-400 truncate">{currentSong.artist}</span>
            </div>
            <button onClick={() => toggleLike(currentSong.id)}>
              <Heart size={18} className={likedIds.includes(currentSong.id) ? "text-green-500 fill-green-500" : "text-gray-400"} />
            </button>
          </div>

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
                seekTo(dragTime);
                setCurrentTime(dragTime);
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
              {/* A-B loop markers */}
              {loopA !== null && duration > 0 && (
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-3.5 rounded-full bg-yellow-400"
                  style={{ left: `${(loopA / duration) * 100}%` }} />
              )}
              {loopB !== null && duration > 0 && (
                <>
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-3.5 rounded-full bg-yellow-400"
                    style={{ left: `${(loopB / duration) * 100}%` }} />
                  {/* highlighted looped region */}
                  <div className="absolute top-0 h-full bg-yellow-400/20 pointer-events-none"
                    style={{
                      left: `${((loopA ?? 0) / duration) * 100}%`,
                      width: `${((loopB - (loopA ?? 0)) / duration) * 100}%`,
                    }} />
                </>
              )}
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
                onClick={cyclePlaybackRate}
                className={`text-xs font-semibold w-10 text-center py-1 rounded-full transition
                  ${playbackRate !== 1 ? "bg-white/15 text-white" : "text-gray-400 hover:text-white"}`}
                title="Playback speed"
              >
                {playbackRate}x
              </button>
              <button
                onClick={handleLoopButton}
                className={`text-xs font-semibold px-2 py-1 rounded-full transition
                  ${loopB !== null ? "bg-white/15 text-white" : loopA !== null ? "text-white" : "text-gray-400 hover:text-white"}`}
                title={loopA === null ? "Set loop start (A)" : loopB === null ? "Set loop end (B)" : "Clear A-B loop"}
              >
                {loopA === null ? "A-B" : loopB === null ? "A-?" : "A-B ✓"}
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
                  if (isplaying) {
                    pauseAudio();
                    pause();
                  } else {
                    playAudio();
                    play();
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
              <SleepTimer audioRef={audioRef} />
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
                className={`lg:hidden transition ${repeat !== "off" ? "text-green-400" : "text-gray-400 hover:text-white"}`}
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
            <div className=" text-[#b3b3b3] " onClick={() => setmobileList(!mobileList)} > <ChevronDown /> </div>
          </div>

          {mockSongs.map((song: Song) => (
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
      </>
    );
}
