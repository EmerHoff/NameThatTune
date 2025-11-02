import axios, { AxiosInstance } from "axios";
import {
  DeezerSearchResponse,
  DeezerTrack,
  SearchResult,
  GameTrack,
} from "../types/deezer.types";

/**
 * Service for interacting with Deezer API
 * Note: Deezer API is public and doesn't require authentication for basic searches
 */
export class DeezerService {
  private readonly apiUrl: string = "https://api.deezer.com";
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
    });
  }

  /**
   * Searches for tracks on Deezer
   * @param query - Search query (song name or artist)
   * @param limit - Maximum number of results
   * @returns Promise<SearchResult[]>
   */
  async searchTracks(
    query: string,
    limit: number = 20
  ): Promise<SearchResult[]> {
    try {
      const response = await this.axiosInstance.get<DeezerSearchResponse>(
        "/search/track",
        {
          params: {
            q: query,
            limit: limit,
          },
        }
      );
      if (!response.data) {
        console.error("No data in response for query:", query);
        return [];
      }
      const tracks = response.data.data || [];
      if (tracks.length === 0) {
        console.warn(`No tracks found for query: ${query}`);
        return [];
      }
      return tracks.map((track: DeezerTrack) => {
        const artistName: string = track.artist?.name || "Unknown Artist";
        const albumName: string = track.album?.title || "Unknown Album";
        const trackLink: string = track.link || "";
        const previewUrl: string | undefined = track.preview || undefined;
        const coverImage: string | undefined =
          track.album?.cover_medium ||
          track.album?.cover_big ||
          track.album?.cover ||
          undefined;

        // Log if preview is missing for debugging
        if (!previewUrl) {
          console.log(
            `⚠️ No preview URL found for track: ${track.title} - ${artistName}`
          );
        }

        return {
          trackId: track.id,
          title: track.title,
          artist: artistName,
          album: albumName,
          link: trackLink,
          previewUrl: previewUrl,
          coverImage: coverImage,
        };
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status: number | undefined = error.response?.status;
        const statusText: string | undefined = error.response?.statusText;
        const errorData: unknown = error.response?.data;
        console.error(`Deezer search failed for "${query}":`, {
          status,
          statusText,
          errorData,
        });
        throw new Error(
          `Deezer search failed: ${status} - ${statusText || "Unknown error"}`
        );
      }
      console.error("Deezer search error (non-axios):", error);
      throw new Error("Deezer search failed: Unknown error");
    }
  }

  /**
   * Gets random popular tracks for the game
   * Ensures each track is from a different artist
   * @param count - Number of tracks to get
   * @returns Promise<GameTrack[]>
   */
  async getRandomTracks(count: number = 5): Promise<GameTrack[]> {
    const popularQueries: string[] = [
      "Billie Eilish",
      "The Weeknd",
      "Dua Lipa",
      "Ed Sheeran",
      "Taylor Swift",
      "Post Malone",
      "Ariana Grande",
      "Drake",
      "Bruno Mars",
      "Justin Bieber",
      "Adele",
      "Coldplay",
      "Imagine Dragons",
      "Maroon 5",
      "Queen",
      "The Beatles",
      "Michael Jackson",
      "Eminem",
      "Kendrick Lamar",
      "Travis Scott",
      "Bad Bunny",
      "Rihanna",
      "The Weeknd",
      "Doja Cat",
      "SZA",
      "Harry Styles",
      "Olivia Rodrigo",
      "Lana Del Rey",
      "Arctic Monkeys",
      "Red Hot Chili Peppers",
    ];
    const shuffledQueries: string[] = [...popularQueries].sort(
      () => Math.random() - 0.5
    );
    const selectedTracks: SearchResult[] = [];
    const usedArtists: Set<string> = new Set();
    let attempts: number = 0;
    const maxAttempts: number = shuffledQueries.length;

    for (const query of shuffledQueries) {
      if (selectedTracks.length >= count) {
        break;
      }
      if (attempts >= maxAttempts) {
        break;
      }
      attempts++;

      try {
        console.log(`Searching Deezer tracks for: ${query}`);
        const tracks: SearchResult[] = await this.searchTracks(query, 15);

        if (tracks && tracks.length > 0) {
          const shuffledTracks: SearchResult[] = [...tracks].sort(
            () => Math.random() - 0.5
          );

          for (const track of shuffledTracks) {
            if (selectedTracks.length >= count) {
              break;
            }
            const artistLower: string = track.artist.toLowerCase().trim();
            if (!usedArtists.has(artistLower)) {
              selectedTracks.push(track);
              usedArtists.add(artistLower);
              console.log(`Selected track: ${track.title} - ${track.artist}`);
            }
          }
        }
      } catch (error) {
        const errorMessage: string =
          error instanceof Error ? error.message : "Unknown error";
        console.error(`Error searching for ${query}:`, errorMessage);
      }
    }

    if (selectedTracks.length === 0) {
      throw new Error(
        "Failed to retrieve any tracks. Please check your connection."
      );
    }

    if (selectedTracks.length < count) {
      console.warn(
        `Warning: Only found ${selectedTracks.length} tracks from different artists, requested ${count}`
      );
    }

    const finalTracks: SearchResult[] = selectedTracks
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    const gameTracks: GameTrack[] = finalTracks.map((track) => ({
      id: `track-${track.trackId}`,
      trackId: track.trackId,
      title: track.title,
      artist: track.artist,
      previewUrl: track.previewUrl,
      coverImage: track.coverImage,
    }));

    if (gameTracks.length === 0) {
      throw new Error("Failed to process tracks for the game");
    }

    console.log(
      `Successfully prepared ${gameTracks.length} tracks from ${usedArtists.size} different artists`
    );
    console.log(`Artists: ${Array.from(usedArtists).join(", ")}`);

    return gameTracks;
  }
}
