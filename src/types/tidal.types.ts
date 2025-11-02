/**
 * Tidal API response types
 */

export interface TidalAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface TidalArtist {
  id: number;
  name: string;
}

export interface TidalAlbum {
  id: number;
  title: string;
}

export interface TidalTrack {
  id: number;
  title: string;
  duration: number;
  replayGain: number;
  peak: number;
  artists: TidalArtist[];
  album: TidalAlbum;
  url?: string;
}

export interface TidalSearchResponse {
  tracks: {
    items: TidalTrack[];
    limit: number;
    offset: number;
    totalNumberOfItems: number;
  };
}

export interface SearchResult {
  trackId: number;
  title: string;
  artist: string;
  album: string;
  link: string;
}

export interface TrackWithPreview extends SearchResult {
  previewUrl?: string;
}

export interface GameTrack {
  id: string;
  trackId: number;
  title: string;
  artist: string;
  previewUrl?: string;
}

