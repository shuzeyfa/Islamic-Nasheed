import { Heart } from "lucide-react";
import type { Song } from "../type/song";
import { useFavoritesStore } from "../store/favoritesStore";
import { useDurationsStore, formatDuration } from "../store/durationsStore";


export default function SideBarList({song, current,  onSelect} : {song: Song; current: number, onSelect: (song: Song) => void;}){

    const same = current === song.id;
    const { likedIds, toggleLike } = useFavoritesStore();
    const liked = likedIds.includes(song.id);
    // prefer the real duration once we've heard the track's metadata
    const realDuration = useDurationsStore((s) => s.durations[song.id]);
    const displayDuration = realDuration ? formatDuration(realDuration) : song.duration;

    return (
        <div onClick={() => onSelect(song)}
            className="flex items-center gap-4 px-4 py-2 hover:bg-[#282828] rounded-xl group/row">
            <div className={` ${same ? "text-green-300 " : "text-gray-500"}  `}>
                {song.id}
            </div>
            <div className=" w-24 overflow-hidden ">
                <img
                className=" overflow-hidden rounded-2xl w-full h-fit "
                 src={song.coverUrl} alt={song.title} />
            </div>
            <div className="flex flex-col flex-1 min-w-0">

                <div className={` ${same ? "text-green-300" : "text-gray-500" } truncate font-medium `}>
                   { song.title}
                </div>
                <div className={` ${same ? "text-green-300 " : "text-gray-500"}  `}>
                   { song.artist}
                </div>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation(); // like without starting playback
                    toggleLike(song.id);
                }}
                className={`shrink-0 transition ${liked ? "" : "opacity-0 group-hover/row:opacity-100"}`}
            >
                <Heart
                    size={16}
                    className={liked ? "text-green-400 fill-green-400" : "text-gray-500 hover:text-white"}
                />
            </button>
            <div className={` ${same ? "text-green-300 " : "text-gray-500"}  `}>
               { displayDuration}
            </div>


        </div>
    )
}
