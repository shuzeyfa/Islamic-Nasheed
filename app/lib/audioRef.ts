// The single global <audio> element, owned by <AudioEngine> in the root layout.
// Any component (player bar, visualizers, pages) reaches the same element through
// this ref, so playback survives route navigation.

export const audioRef: { current: HTMLAudioElement | null } = { current: null };

export function playAudio() {
    audioRef.current?.play().catch(() => {});
}

export function pauseAudio() {
    audioRef.current?.pause();
}

export function seekTo(seconds: number) {
    if (audioRef.current) {
        audioRef.current.currentTime = seconds;
    }
}
