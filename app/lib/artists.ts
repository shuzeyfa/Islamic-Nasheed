import mockSongs from "../data/data";
import type { Song } from "../type/song";

export type Artist = {
    slug: string;
    name: string;
    songs: Song[];
    coverUrl: string; // first song's cover as the artist image
};

export const slugify = (name: string) =>
    encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"));

// group the catalog by artist, preserving catalog order
export function getArtists(): Artist[] {
    const map = new Map<string, Artist>();
    for (const song of mockSongs) {
        const slug = slugify(song.artist);
        const existing = map.get(slug);
        if (existing) {
            existing.songs.push(song);
        } else {
            map.set(slug, { slug, name: song.artist, songs: [song], coverUrl: song.coverUrl });
        }
    }
    // most songs first
    return [...map.values()].sort((a, b) => b.songs.length - a.songs.length);
}

export function getArtist(slug: string): Artist | undefined {
    return getArtists().find((a) => a.slug === slug);
}
