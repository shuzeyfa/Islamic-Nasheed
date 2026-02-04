import { create } from "zustand";
import { Song } from "../type/song";
import mockSongs from "../data/data";

type playerState = {
    //state
    currentSong: Song,
    isplaying: boolean,
    currentTime: number,
    duration: number

    // Action
    setcurrentSong: (song: Song) => void,
    play: () => void,
    pause: () => void,
    setCurrentTime: (time: number) => void,
    setDuration: (duration: number) => void,
    

}


export const usePlayerStore = create<playerState>((set) => ({
    currentSong: mockSongs[0],
    isplaying: false,
    currentTime: 0,
    duration: 0,
    play: () => set({isplaying: true}),
    pause: () => set({ isplaying: false}),
    setcurrentSong: (value: Song) => set({currentSong: value}),
    setCurrentTime: (time: number) => set({ currentTime: time }),
    setDuration: (duration) => set({duration: duration})

}))