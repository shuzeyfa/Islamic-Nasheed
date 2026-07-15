"use client"

import { useEffect, useRef, useState } from "react";
import { Moon } from "lucide-react";
import { usePlayerStore } from "../store/playerStore";

const OPTIONS = [5, 15, 30, 60]; // minutes

// Sleep timer: fades out and pauses playback when the countdown ends.
export default function SleepTimer({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement | null> }) {
    const [endsAt, setEndsAt] = useState<number | null>(null);
    const [remaining, setRemaining] = useState<number>(0); // seconds
    const [open, setOpen] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (endsAt === null) return;

        intervalRef.current = setInterval(() => {
            const left = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
            setRemaining(left);

            // fade the last 5 seconds instead of cutting off abruptly
            const audio = audioRef.current;
            if (audio && left <= 5 && left > 0) {
                audio.volume = Math.max(0, audio.volume * 0.6);
            }

            if (left <= 0) {
                audio?.pause();
                usePlayerStore.getState().pause();
                // restore the user's volume for next time
                if (audio) audio.volume = usePlayerStore.getState().volume;
                setEndsAt(null);
            }
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [endsAt, audioRef]);

    const format = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full transition
                    ${endsAt !== null ? "bg-white/15 text-white" : "text-gray-400 hover:text-white"}`}
                title="Sleep timer"
            >
                <Moon size={16} />
                {endsAt !== null && <span>{format(remaining)}</span>}
            </button>

            {open && (
                <>
                    {/* click-away backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute bottom-full mb-2 right-0 z-50 bg-[#282828] rounded-xl shadow-xl p-2 flex flex-col gap-1 min-w-32">
                        <span className="text-xs text-gray-400 px-2 py-1">Stop playing in…</span>
                        {OPTIONS.map((min) => (
                            <button
                                key={min}
                                onClick={() => {
                                    setEndsAt(Date.now() + min * 60_000);
                                    setRemaining(min * 60);
                                    setOpen(false);
                                }}
                                className="text-sm text-left px-2 py-1.5 rounded-lg hover:bg-white/10 transition"
                            >
                                {min} minutes
                            </button>
                        ))}
                        {endsAt !== null && (
                            <button
                                onClick={() => { setEndsAt(null); setOpen(false); }}
                                className="text-sm text-left px-2 py-1.5 rounded-lg text-red-400 hover:bg-white/10 transition"
                            >
                                Cancel timer
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
