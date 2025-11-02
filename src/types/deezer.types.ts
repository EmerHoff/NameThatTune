/**
 * Deezer API response types
 */

export interface DeezerArtist {
  id: number;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  tracklist: string;
  type: string;
}

export interface DeezerAlbum {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  tracklist: string;
  type: string;
}

export interface DeezerTrack {
  id: number;
  title: string;
  title_short: string;
  title_version: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  position: number;
  artist: DeezerArtist;
  album: DeezerAlbum;
  type: string;
}

export interface DeezerSearchResponse {
  data: DeezerTrack[];
  total: number;
  next?: string;
}

export interface SearchResult {
  trackId: number;
  title: string;
  artist: string;
  album: string;
  link: string;
  previewUrl?: string;
  coverImage?: string;
}

export interface GameTrack {
  id: string;
  trackId: number;
  title: string;
  artist: string;
  previewUrl?: string;
  coverImage?: string;
}

