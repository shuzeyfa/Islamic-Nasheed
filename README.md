# 🎧 Islamic Nasheed Player

A modern, Spotify-inspired Islamic nasheed player built with **Next.js, React, TypeScript, Zustand, and the Web Audio API**.

Streams a curated collection of nasheeds (Maher Zain, Sami Yusuf, Harris J, Malak Fathi, and more) with real-time audio visualization, dynamic per-song theming, OS-level media integration, and a fully responsive UI.

## ✨ Features

### Playback
- ▶️ Play / pause, next / previous track
- 🔀 Shuffle with **play history** — "previous" retraces the songs you actually heard
- 🔁 Three repeat modes: off / repeat-all (queue wraps) / repeat-one
- ⏮️ Smart previous: >3s into a track restarts it, press again to go back
- ⏱️ **Draggable seek bar** with scrub preview and hover handle (pointer-capture, touch-friendly)
- 🔊 Volume slider + mute with adaptive icon
- 🚦 Buffering spinner and graceful error state for failed streams

### Visual
- 🌈 **Real-time audio visualizer** — 48 frequency bars driven by a Web Audio `AnalyserNode`, rendered on canvas at 60fps
- 💫 **Circular visualizer ring** — 96 radial bars orbiting the album art, mirrored spectrum, DPI-aware rendering
- 🎨 **Dynamic color theme** — the dominant color of each cover is extracted on a canvas and tints the ambient glow, visualizers, and accents, transitioning smoothly per song
- 📱 Fully responsive: desktop queue sidebar, mobile slide-up drawer

### Integration & UX
- 🖥️ **Media Session API** — control playback from keyboard media keys, lock screen, and the OS media overlay, with cover art metadata
- ⌨️ **Keyboard shortcuts** — `Space` play/pause · `←/→` seek ±5s · `↑/↓` volume · `M` mute · `S` shuffle · `R` repeat · `N/P` next/previous
- 💾 **Persistence** — volume, mute, shuffle, repeat, queue position, and favorites survive reloads (Zustand `persist` with SSR-safe manual rehydration)
- ❤️ **Favorites** — like songs from the hero or queue rows, filter the queue to liked-only
- 🔍 **Search** — live filter by title or artist
- 🕐 Real track durations learned from audio metadata and cached

## 🛠️ Tech Stack

| | |
|---|---|
| Framework | Next.js (App Router) + React 19 |
| Language | TypeScript |
| State | Zustand (4 stores: player, queue, favorites, durations) |
| Styling | Tailwind CSS v4 |
| Audio | HTML5 Audio + Web Audio API (`AnalyserNode`) |
| Icons | Lucide React |

## 📐 Architecture Notes

- **Single source of truth**: the queue store owns navigation (`next`/`previous`/`setcurrentIndex`) and syncs the player store's `currentSong` itself — no drift between index and song, no duplicated sync logic in the UI.
- **Shared audio graph** (`app/lib/audioGraph.ts`): `createMediaElementSource` can only be called once per element, so one `AudioContext` + `AnalyserNode` is created lazily and shared by both visualizers.
- **SSR-safe persistence**: stores use `skipHydration` and rehydrate manually after mount, avoiding Next.js hydration mismatches.
- **Dominant color extraction** (`app/lib/useDominantColor.ts`): covers are downsampled to 24×24 on a canvas; pixels scored by saturation + lightness so vibrant hues win over grays; dark picks are brightened for visibility on the dark UI.

## 📂 Project Structure

```
app/
 ├─ components/
 │   ├─ sideBarList.tsx      # queue row (cover, like, duration)
 │   ├─ Visualizer.tsx       # linear frequency bars
 │   └─ VisualizerRing.tsx   # radial bars around the cover
 ├─ lib/
 │   ├─ audioGraph.ts        # shared AudioContext + AnalyserNode
 │   └─ useDominantColor.ts  # cover → theme color
 ├─ store/
 │   ├─ playerStore.tsx      # song, playback, volume, status
 │   ├─ queueStore.tsx       # index, shuffle, repeat, history
 │   ├─ favoritesStore.tsx   # liked song ids
 │   └─ durationsStore.tsx   # real durations cache
 ├─ data/data.tsx            # nasheed collection
 ├─ type/song.tsx            # Song interface
 └─ page.tsx                 # player UI
```

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/islamic-nasheed-player.git
cd islamic-nasheed-player
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and press play.

> Audio streams from archive.org; covers are served locally.
