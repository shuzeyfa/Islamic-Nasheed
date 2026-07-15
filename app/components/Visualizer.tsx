"use client"

import { useEffect, useRef } from "react";

// Web Audio graph is created once per <audio> element and reused —
// createMediaElementSource throws if called twice on the same element.
let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let connectedElement: HTMLAudioElement | null = null;

function getAnalyser(audio: HTMLAudioElement): AnalyserNode | null {
    try {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
        if (connectedElement !== audio) {
            const source = audioCtx.createMediaElementSource(audio);
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256; // 128 frequency bins
            analyser.smoothingTimeConstant = 0.8;
            source.connect(analyser);
            analyser.connect(audioCtx.destination); // keep audio audible
            connectedElement = audio;
        }
        return analyser;
    } catch {
        return null;
    }
}

export default function Visualizer({
    audioRef,
    isplaying,
}: {
    audioRef: React.RefObject<HTMLAudioElement | null>;
    isplaying: boolean;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const audio = audioRef.current;
        const canvas = canvasRef.current;
        if (!audio || !canvas || !isplaying) return;

        const node = getAnalyser(audio);
        if (!node) return;
        // browsers suspend AudioContext until a user gesture — resume on play
        audioCtx?.resume().catch(() => {});

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const bufferLength = node.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const BARS = 48;
        // sample the lower ~70% of the spectrum — music lives there
        const usable = Math.floor(bufferLength * 0.7);
        const step = Math.floor(usable / BARS);

        const draw = () => {
            rafRef.current = requestAnimationFrame(draw);
            node.getByteFrequencyData(dataArray);

            // resize canvas to its CSS size (handles responsive layout)
            const { width, height } = canvas.getBoundingClientRect();
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }

            ctx.clearRect(0, 0, width, height);

            const barWidth = width / BARS;
            for (let i = 0; i < BARS; i++) {
                // average a few bins per bar for smoother motion
                let sum = 0;
                for (let j = 0; j < step; j++) sum += dataArray[i * step + j];
                const value = sum / step / 255;

                const barHeight = Math.max(2, value * height);
                const x = i * barWidth;

                const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
                gradient.addColorStop(0, "rgba(34, 197, 94, 0.9)");   // green-500
                gradient.addColorStop(1, "rgba(134, 239, 172, 0.6)"); // green-300
                ctx.fillStyle = gradient;

                // rounded-top bars, mirrored around the center line
                ctx.beginPath();
                ctx.roundRect(x + barWidth * 0.15, height - barHeight, barWidth * 0.7, barHeight, 2);
                ctx.fill();
            }
        };

        draw();

        return () => cancelAnimationFrame(rafRef.current);
    }, [audioRef, isplaying]);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-16 sm:h-20 transition-opacity duration-700 ${isplaying ? "opacity-100" : "opacity-0"}`}
            aria-hidden="true"
        />
    );
}
