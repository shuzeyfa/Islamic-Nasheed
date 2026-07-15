// Shared Web Audio graph — created once per <audio> element and reused,
// because createMediaElementSource throws if called twice on the same element.
// Both the bar visualizer and the ring visualizer read from this analyser.

let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let connectedElement: HTMLAudioElement | null = null;

export function getAnalyser(audio: HTMLAudioElement): AnalyserNode | null {
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
        // browsers suspend AudioContext until a user gesture — resume on use
        audioCtx.resume().catch(() => {});
        return analyser;
    } catch {
        return null;
    }
}
