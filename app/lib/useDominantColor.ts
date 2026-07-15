"use client"

import { useEffect, useState } from "react";

// Extracts a vibrant dominant color from an image by drawing it tiny on a
// canvas and scoring pixels by saturation — grays and near-blacks lose.
// Returns an "r, g, b" triplet string for easy use in rgba().
export function useDominantColor(imageUrl: string, fallback = "34, 197, 94") {
    const [color, setColor] = useState(fallback);

    useEffect(() => {
        let cancelled = false;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;

        img.onload = () => {
            if (cancelled) return;
            try {
                const SIZE = 24; // tiny sample is enough and fast
                const canvas = document.createElement("canvas");
                canvas.width = SIZE;
                canvas.height = SIZE;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;
                ctx.drawImage(img, 0, 0, SIZE, SIZE);
                const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

                let bestScore = -1;
                let best: [number, number, number] | null = null;
                // accumulate an average as fallback for low-saturation covers
                let ar = 0, ag = 0, ab = 0, count = 0;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2];
                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    const lightness = (max + min) / 2;

                    // skip almost-black / almost-white pixels
                    if (lightness < 30 || lightness > 230) continue;

                    ar += r; ag += g; ab += b; count++;

                    const saturation = max === 0 ? 0 : (max - min) / max;
                    // favor saturated, reasonably bright pixels
                    const score = saturation * 2 + lightness / 255;
                    if (score > bestScore) {
                        bestScore = score;
                        best = [r, g, b];
                    }
                }

                let [r, g, b] = best ?? (count > 0
                    ? [ar / count, ag / count, ab / count]
                    : [34, 197, 94]);

                // brighten dark picks so glows stay visible on the black UI
                const maxc = Math.max(r, g, b);
                if (maxc < 120 && maxc > 0) {
                    const boost = 150 / maxc;
                    r *= boost; g *= boost; b *= boost;
                }

                setColor(`${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`);
            } catch {
                // canvas tainted (no CORS) or decode issue — keep previous color
            }
        };

        return () => { cancelled = true; };
    }, [imageUrl]);

    return color;
}
