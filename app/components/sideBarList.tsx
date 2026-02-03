import Image from "next/image";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  audioUrl: String;
}


export default function SideBarList({song, current,  onSelect} : {song: Song; current: number, onSelect: (song: Song) => void;}){

    const same = current === song.id;

    return (
        <div onClick={() => onSelect(song)}
            className="flex items-center gap-4 px-4 py-2 hover:bg-[#282828] rounded-xl">
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
            <div className={` ${same ? "text-green-300 " : "text-gray-500"}  `}>
               { song.duration}
            </div>


        </div>
    )
}