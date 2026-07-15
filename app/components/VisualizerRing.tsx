"use client"

import { useEffect, useRef } from "react";
import { getAnalyser } from "../lib/audioGraph";

// Radial frequency bars around the album art. Rendered on a square canvas
// that sits behind the cover; bars grow outward from just beyond the art's edge.
export default function VisualizerRing({
    audioRef,
    isplaying,
    color = "34, 197, 94", // rgb triplet, green-500 by default
}: {
    audioRef: React.RefObject<HTMLAudioElement | null>;
    isplaying: boolean;
    color?: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number>(0);
    // keep latest color in a ref so the draw loop picks it up without restarting
    const colorRef = useRef(color);
    useEffect(() => {
        colorRef.current = color;
    }, [color]);

    useEffect(() => {
        const audio = audioRef.current;
        const canvas = canvasRef.current;
        if (!audio || !canvas || !isplaying) return;

        const node = getAnalyser(audio);
        if (!node) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const bufferLength = node.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const BARS = 96;
        const usable = Math.floor(bufferLength * 0.7);

        const draw = () => {
            rafRef.current = requestAnimationFrame(draw);
            node.getByteFrequencyData(dataArray);

            const { width, height } = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
                canvas.width = width * dpr;
                canvas.height = height * dpr;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;
            // the cover occupies the middle ~72% of the canvas; bars start at its edge
            const innerRadius = (width * 0.72) / 2 + 6;
            const maxBar = width / 2 - innerRadius - 2;

            for (let i = 0; i < BARS; i++) {
                // mirror the spectrum so the ring is symmetric left/right
                const half = i < BARS / 2 ? i : BARS - 1 - i;
                const bin = Math.floor((half / (BARS / 2)) * usable);
                const value = dataArray[bin] / 255;

                const barLen = Math.max(2, value * maxBar);
                const angle = (i / BARS) * Math.PI * 2 - Math.PI / 2;

                const x1 = cx + Math.cos(angle) * innerRadius;
                const y1 = cy + Math.sin(angle) * innerRadius;
                const x2 = cx + Math.cos(angle) * (innerRadius + barLen);
                const y2 = cy + Math.sin(angle) * (innerRadius + barLen);

                ctx.strokeStyle = `rgba(${colorRef.current}, ${0.35 + value * 0.65})`;
                ctx.lineWidth = 3;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        };

        draw();

        return () => cancelAnimationFrame(rafRef.current);
    }, [audioRef, isplaying]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute pointer-events-none transition-opacity duration-700 ${isplaying ? "opacity-100" : "opacity-0"}`}
            style={{
                // canvas is ~38% bigger than the cover so bars have room to grow
                width: "139%",
                height: "139%",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
            }}
            aria-hidden="true"
        />
    );
}
