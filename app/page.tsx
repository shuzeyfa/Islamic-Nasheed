"use client"

import SideBarList from "./components/sideBarList";
import Visualizer from "./components/Visualizer";
import VisualizerRing from "./components/VisualizerRing";
import { useDominantColor } from "./lib/useDominantColor";
import { User, Search, X, Loader2, AlertCircle, Heart } from 'lucide-react';
import { useState } from "react";
import mockSongs from "./data/data";
import { usePlayerStore } from "./store/playerStore";
import { useQueueStore } from "./store/queueStore";
import { useFavoritesStore } from "./store/favoritesStore";
import { audioRef } from "./lib/audioRef";



export default function Home() {

  const { isplaying, play, currentSong, status } = usePlayerStore();
  const { likedIds, toggleLike } = useFavoritesStore();

  const [search, setSearch] = useState<string>("");
  const [likedOnly, setLikedOnly] = useState<boolean>(false);

  const query = search.trim().toLowerCase();
  const filteredSongs = mockSongs.filter((s) => {
    if (likedOnly && !likedIds.includes(s.id)) return false;
    if (!query) return true;
    return (
      s.title.toLowerCase().includes(query) ||
      s.artist.toLowerCase().includes(query)
    );
  });

  // dominant color of the current cover, as an "r, g, b" triplet
  const themeColor = useDominantColor(currentSong.coverUrl);

  return (
    <div className=" flex w-full h-full ">
      <div className=" h-full w-[23%] bg-[#181818] lg:flex flex-col md:p-2 gap-y-3 pt-4 overflow-auto hidden   ">
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

      <div className=" flex flex-col w-full lg:w-[77%] h-full ">

        <div className="h-full flex items-center justify-center px-5 sm:px-8 bg-linear-to-b from-gray-950 to-black relative overflow-hidden">
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

      </div>

    </div>
  );
}
