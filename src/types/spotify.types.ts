/**
 * Spotify API response types
 */

export interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  duration_ms: number;
  popularity: number;
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface SearchResult {
  trackId: string;
  title: string;
  artist: string;
  album: string;
  link: string;
  previewUrl?: string;
}

export interface GameTrack {
  id: string;
  trackId: string;
  title: string;
  artist: string;
  previewUrl?: string;
}

