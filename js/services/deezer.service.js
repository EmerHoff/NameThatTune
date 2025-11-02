/**
 * Deezer API Service
 * Handles all interactions with Deezer API
 * Uses CORS proxy to work without local server
 */

const DEEZER_API_URL = "https://api.deezer.com";

// CORS proxy options - try multiple proxies for reliability
const CORS_PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
  "https://api.codetabs.com/v1/proxy?quest=",
];

let currentProxyIndex = 0;

/**
 * Gets a working CORS proxy URL
 */
function getProxyUrl(targetUrl) {
  return CORS_PROXIES[currentProxyIndex] + encodeURIComponent(targetUrl);
}

/**
 * Switches to next proxy if current one fails
 */
function switchProxy() {
  currentProxyIndex = (currentProxyIndex + 1) % CORS_PROXIES.length;
  console.log(`[DeezerService] Switched to proxy ${currentProxyIndex + 1}/${CORS_PROXIES.length}`);
}

class DeezerService {
  /**
   * Searches for tracks on Deezer
   * @param {string} query - Search query (song name or artist)
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>} Array of search results
   */
  async searchTracks(query, limit = 20, retryCount = 0) {
    const maxRetries = CORS_PROXIES.length;
    
    try {
      const apiUrl = `${DEEZER_API_URL}/search/track?q=${encodeURIComponent(query)}&limit=${limit}`;
      const proxyUrl = getProxyUrl(apiUrl);
      
      console.log(`[DeezerService] Fetching via proxy: ${proxyUrl.substring(0, 100)}...`);
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log(`[DeezerService] Response status: ${response.status}, ok: ${response.ok}`);

      if (!response.ok) {
        // Try next proxy if available
        if (retryCount < maxRetries - 1) {
          console.warn(`[DeezerService] Proxy ${currentProxyIndex + 1} failed, trying next...`);
          switchProxy();
          return this.searchTracks(query, limit, retryCount + 1);
        }
        
        const errorText = await response.text();
        console.error(`[DeezerService] Error response:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data = await response.json();
      
      // Handle different proxy response formats
      // allorigins.win wraps response in {contents: "..."}
      if (data.contents) {
        try {
          data = JSON.parse(data.contents);
        } catch (e) {
          console.error('[DeezerService] Failed to parse proxy response:', e);
          throw new Error('Invalid response format from proxy');
        }
      }
      
      console.log(`[DeezerService] Received ${data?.data?.length || 0} tracks for query: ${query}`);

      if (!data || !data.data || data.data.length === 0) {
        console.warn(`No tracks found for query: ${query}`);
        return [];
      }

      return data.data.map((track) => {
        const artistName = track.artist?.name || "Unknown Artist";
        const albumName = track.album?.title || "Unknown Album";
        const trackLink = track.link || "";
        const previewUrl = track.preview || undefined;
        const coverImage =
          track.album?.cover_medium ||
          track.album?.cover_big ||
          track.album?.cover ||
          undefined;

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
      console.error(`[DeezerService] Search failed for "${query}":`, error);
      
      // Try next proxy if available
      if (retryCount < maxRetries - 1 && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
        console.warn(`[DeezerService] Error with proxy ${currentProxyIndex + 1}, trying next...`);
        switchProxy();
        return this.searchTracks(query, limit, retryCount + 1);
      }
      
      throw new Error(`Deezer search failed: ${error.message}`);
    }
  }

  /**
   * Gets tracks from Deezer charts (popular tracks)
   * @param {number} limit - Number of tracks to get
   * @returns {Promise<Array>} Array of tracks
   */
  async getChartTracks(limit = 50, retryCount = 0) {
    const maxRetries = CORS_PROXIES.length;
    
    try {
      const apiUrl = `${DEEZER_API_URL}/chart/0/tracks?limit=${limit}`;
      const proxyUrl = getProxyUrl(apiUrl);
      
      console.log(`[DeezerService] Fetching chart tracks via proxy...`);
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (retryCount < maxRetries - 1) {
          console.warn(`[DeezerService] Proxy ${currentProxyIndex + 1} failed, trying next...`);
          switchProxy();
          return this.getChartTracks(limit, retryCount + 1);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data = await response.json();
      
      if (data.contents) {
        try {
          data = JSON.parse(data.contents);
        } catch (e) {
          console.error('[DeezerService] Failed to parse proxy response:', e);
          throw new Error('Invalid response format from proxy');
        }
      }

      if (!data || !data.data || data.data.length === 0) {
        return [];
      }

      return data.data.map((track) => {
        const artistName = track.artist?.name || "Unknown Artist";
        const albumName = track.album?.title || "Unknown Album";
        const trackLink = track.link || "";
        const previewUrl = track.preview || undefined;
        const coverImage =
          track.album?.cover_medium ||
          track.album?.cover_big ||
          track.album?.cover ||
          undefined;

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
      console.error(`[DeezerService] Chart fetch failed:`, error);
      
      if (retryCount < maxRetries - 1 && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
        console.warn(`[DeezerService] Error with proxy ${currentProxyIndex + 1}, trying next...`);
        switchProxy();
        return this.getChartTracks(limit, retryCount + 1);
      }
      
      throw error;
    }
  }

  /**
   * Gets random tracks from charts for the game
   * Ensures each track is from a different artist
   * @param {number} count - Number of tracks to get
   * @returns {Promise<Array>} Array of game tracks
   */
  async getRandomTracks(count = 5) {
    try {
      // Get popular tracks from charts
      const chartTracks = await this.getChartTracks(100);
      
      if (chartTracks.length === 0) {
        throw new Error("Failed to retrieve chart tracks");
      }

      // Filter tracks with preview and ensure unique artists
      const tracksWithPreview = chartTracks.filter(t => t.previewUrl);
      const selectedTracks = [];
      const usedArtists = new Set();
      
      // Shuffle tracks
      const shuffledTracks = [...tracksWithPreview].sort(() => Math.random() - 0.5);
      
      for (const track of shuffledTracks) {
        if (selectedTracks.length >= count) {
          break;
        }
        
        const artistLower = track.artist.toLowerCase().trim();
        if (!usedArtists.has(artistLower)) {
          selectedTracks.push(track);
          usedArtists.add(artistLower);
          console.log(`Selected track: ${track.title} - ${track.artist}`);
        }
      }

      if (selectedTracks.length === 0) {
        throw new Error("Failed to find tracks with previews");
      }

      if (selectedTracks.length < count) {
        console.warn(
          `Warning: Only found ${selectedTracks.length} tracks from different artists, requested ${count}`
        );
      }

      const gameTracks = selectedTracks.map((track) => ({
        id: `track-${track.trackId}`,
        trackId: track.trackId,
        title: track.title,
        artist: track.artist,
        previewUrl: track.previewUrl,
        coverImage: track.coverImage,
      }));

      console.log(
        `Successfully prepared ${gameTracks.length} random tracks from ${usedArtists.size} different artists`
      );

      return gameTracks;
    } catch (error) {
      console.error(`[DeezerService] Failed to get random tracks:`, error);
      throw new Error(`Failed to retrieve tracks: ${error.message}`);
    }
  }

  /**
   * Gets random tracks for answer options (different from game tracks)
   * @param {number} count - Number of tracks to get
   * @param {Array} excludeTracks - Track IDs to exclude
   * @returns {Promise<Array>} Array of tracks for options
   */
  async getRandomOptions(count = 3, excludeTracks = []) {
    try {
      // Get popular tracks from charts
      const chartTracks = await this.getChartTracks(100);
      
      if (chartTracks.length === 0) {
        // Fallback: use search with random terms
        const randomTerms = ['pop', 'rock', 'hip hop', 'electronic', 'jazz', 'country', 'r&b', 'indie'];
        const randomTerm = randomTerms[Math.floor(Math.random() * randomTerms.length)];
        const fallbackTracks = await this.searchTracks(randomTerm, count * 2);
        return fallbackTracks.map((track) => ({
          id: `track-${track.trackId}`,
          trackId: track.trackId,
          title: track.title,
          artist: track.artist,
          previewUrl: track.previewUrl,
          coverImage: track.coverImage,
        })).slice(0, count);
      }

      // Filter out excluded tracks and tracks without preview
      const excludeIds = new Set();
      excludeTracks.forEach(t => {
        if (t.trackId) excludeIds.add(t.trackId);
        if (t.id && t.id.startsWith('track-')) {
          // Extract trackId from id like "track-123456"
          const idNum = t.id.replace('track-', '');
          excludeIds.add(parseInt(idNum));
        }
      });
      
      const availableTracks = chartTracks.filter(
        t => t.previewUrl && !excludeIds.has(t.trackId)
      );

      // Shuffle and take random tracks
      const shuffled = [...availableTracks].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, count);

      return selected.map((track) => ({
        id: `track-${track.trackId}`,
        trackId: track.trackId,
        title: track.title,
        artist: track.artist,
        previewUrl: track.previewUrl,
        coverImage: track.coverImage,
      }));
    } catch (error) {
      console.error(`[DeezerService] Failed to get random options:`, error);
      return [];
    }
  }
}

export default DeezerService;

