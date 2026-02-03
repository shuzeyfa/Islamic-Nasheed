  "use client"

  import Image from "next/image";
  import SideBarList from "./components/sideBarList";
  import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, MoreHorizontal, ChevronDown, List } from 'lucide-react';
  import { useEffect, useRef, useState } from "react";
  import mockSongs from "./data/data";


  interface Song {
    id: number;
    title: string;
    artist: string;
    album: string;
    duration: string;
    coverUrl: string;
    audioUrl: String;
  }

  // X Global player (Context/Zustand)
  // ✅ Play / pause / next / previous
  // ✅ Progress bar + seek
  // X Volume control
  // ✅ Queue + shuffle
  // X Media Session API
  // X LocalStorage persistence

  export default function Home() {

    const [play, setplay] = useState<true | false>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [mobileList, setmobileList] = useState<Boolean>(false);
    const [currentTime, setcurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentIndex, setcurrentindex] = useState(0);
    const [shuffle, setshuffle] = useState(false);
    
    const [special, setspecial] = useState<Song>(
      {
        id: 1,
        title: "Ramadan",
        artist: "Maher Zain",
        album: "Ramadan",
        duration: "5:07",
        coverUrl: "/images/Remedan_maher.png",
        audioUrl: "https://archive.org/download/maher-zain-ramadan-english-official-music-video-48k/Maher_Zain_-_Ramadan__English____Official_Music_Video%2848k%29.mp3",

      }
    );

    const getCurrentTime = (timeInsecond: number) => {
      if (!timeInsecond || isNaN(timeInsecond)) return "0:00";

      const minute = Math.floor(timeInsecond / 60);
      const second = Math.floor(timeInsecond % 60);
      return `${minute}:${second.toString().padStart(2, "0")}`;
    }

    const gotonext = () => {
      if (!shuffle){
        if (currentIndex === 0){
          alert("Sorry, You Are At The Last Track");
        }else{
          const newindex = currentIndex - 1
          setcurrentindex(newindex);
          setspecial(mockSongs[newindex]);
        }

      }else{
        const newindex = (currentIndex + 9) % mockSongs.length;
        setcurrentindex(newindex);
        setspecial(mockSongs[newindex]);

      }
      
    }

    const gotoprevious = () => {
      if (!shuffle){
        if (currentIndex === mockSongs.length - 1){
          alert("Sorry, You Are At The First Track")
        }else{
          const newindex = currentIndex - 1;
          setcurrentindex(newindex);
          setspecial(mockSongs[newindex]);
        }
      }else{
        const temp = currentIndex - 9;
        if (temp < 0){
          var newindex = temp +  (Math.abs(temp))
        }else{
          var newindex = temp;
        }
        setcurrentindex(newindex);
        setspecial(mockSongs[newindex]);

      }
      
    }

    useEffect(() => {

      const audio = audioRef.current;
      if (!audio) return;

      const updateTime = () => {
        setcurrentTime(audio.currentTime);
      };

      const setAudioDuration = () => {
        setDuration(audio.duration || 0);
      };

      const handlePlayPause = () => {
        setplay(!audio.paused);
      };

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", setAudioDuration);
      audio.addEventListener("play", handlePlayPause);
      audio.addEventListener("pause", handlePlayPause);
      audio.addEventListener("ended", () => setplay(false));

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", setAudioDuration);
        audio.removeEventListener("play", handlePlayPause);
        audio.removeEventListener("pause", handlePlayPause);
        audio.removeEventListener("ended", () => {});
      }

    }, [special.audioUrl])

    return (
      <div className=" flex w-screen ">
        <audio src={special.audioUrl as string} ref={audioRef}  />
        <div className=" h-screen w-[23%] bg-[#181818] lg:flex flex-col md:p-2 gap-y-3 pt-4 overflow-auto hidden   ">
          <div className="flex flex-col px-4 py-3">
            <h1 className="text-xl font-semibold">Queue</h1>
            <span className="text-sm text-gray-400">
              {mockSongs.length} tracks
            </span>
          </div>

          <div className=" gap-y-4 flex flex-col ">
            {mockSongs.map((song) => (
              <div key={song.id} className=" hover:bg-gray-900 rounded-2xl ">
                <SideBarList 
                  song={song}
                  current={special.id}
                  onSelect={(song) => {
                    setspecial(song);
                    setplay(true);
                    
                    // we can replace it with useEffect
                    setTimeout(() => {
                      audioRef.current?.play();
                    }, 0);

                  }}
                  />
              </div>
              
            ))}
          </div>
          
        </div>

        <div className=" flex flex-col w-full lg:w-[77%] h-screen ">
          
          <div className=" h-[83%] flex lg:items-center ">
            <div className="  w-[80%] max-w-6xl h-[60%] mt-24 md:mt-12 mx-auto lg:my-auto rounded-2xl flex flex-col lg:flex-row gap-12 "
            >
              <img className={` w:full lg:w-1/2 h-full rounded-2xl overflow-hidden object-cover ${play ? "animate-bounce" : ""} `}
              src={special.coverUrl} alt={special.title} />
              <div className=" flex flex-col flex-1 justify-center min-w-0 gap-2 lg:gap-6 ">
                <span className=" text-gray-400 text-center lg:text-start ">Now Playing</span>
                <span className=" text-6xl truncate font-medium text-center lg:text-start "> {special.title} </span>
                <span className=" text-gray-400 text-center lg:text-start ">{special.artist}</span>
                <span className=" text-gray-400 text-center lg:text-start "> {special.album} </span>
              </div>

            </div>
            
          </div>

          <div className=" bg-[#181818] h-[17%] flex flex-col items-center justify-center px-4 lg:px-12 gap-4">
            <div className=" flex justify-center gap-3 items-center w-full ">
              <span className=" text-white/90 text-left ">
                {getCurrentTime(currentTime)}
              </span>
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden relative cursor-pointer group"
                onClick={(e) => {
                  if (!audioRef.current || !duration) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickPosition = e.clientX - rect.left;
                  const percentage = clickPosition / rect.width;
                  audioRef.current.currentTime = percentage * duration;
                }}
                >
                <div className={` h-full bg-white/90 transition-all duration-150 ease-out `}
                  style={{ width:  duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}
                  />
              </div>
              <span className="text-white/90 text-sm font-medium text-right">
                {getCurrentTime(duration)}
              </span>

            </div>

            <div className=" grid grid-cols-3 items-center w-full  ">
              <div  className=" justify-self-start flex items-center gap-2 ">
                <button
                  onClick={() => {
                    const val = shuffle;
                    setshuffle(!shuffle);
                    alert(`You Turn The Shuffle ${val ? "OFF" : "ON"}`)
                  }

                  }
                className={` justify-self-start ${shuffle ? "text-white" : "text-gray-400"} `} > <Shuffle/> </button>  
                <button className=" lg:hidden "
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    if (!play) audioRef.current.play();
                    setplay(true);
                  }
                }}
                >
                  <Repeat /> 
                  </button>
              </div>
              
              <div className="flex justify-center items-center gap-3">
                <button
                  className="w-8 h-8 flex items-center justify-center
                    text-white/70 hover:text-white
                    transition"
                >
                  <SkipBack className="w-4 h-4" onClick={gotoprevious} />
                </button>

                <button
                  onClick={() => {
                    if (!audioRef.current) return;
                    play ? audioRef.current.pause() : audioRef.current.play();
                    setplay(!play);
                  }}
                  className="w-9 h-9 flex items-center justify-center
                    border border-white/30 rounded-full
                    hover:bg-white/10 transition"
                >
                  {play ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 translate-x-px" />
                  )}
                </button>

                <button
                  className="w-8 h-8 flex items-center justify-center
                    text-white/70 hover:text-white
                    transition"
                >
                  <SkipForward className="w-4 h-4" onClick={gotonext} />
                </button>
              </div>

              
              <div className=" justify-self-end ">
                <button className="justify-self-end hidden lg:block "
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    if (!play) audioRef.current.play();
                    setplay(true);
                  }
                }}
                > <Repeat /> </button>
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
            <div className=" flex justify-between w-full p-3 bg-[#282828]  ">
              <span>Queue</span>
              <div className=" text-[#b3b3b3] " onClick={() => setmobileList(!mobileList)} > <ChevronDown /> </div>
            </div>

            {mockSongs.map((song: Song) => (
              <div key={song.id} >
                <SideBarList song={song} current = {special.id} onSelect={(song) => {
                  setspecial(song);
                  setplay(true);
                  setmobileList(false);

                  setTimeout(() => {
                    audioRef.current?.play();
                  }, 0);

                }} />
              </div>
            ))}
          </div>
          </>

        }
        
      </div>
    );
  }
