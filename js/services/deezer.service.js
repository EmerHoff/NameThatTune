const DEEZER_API = "https://api.deezer.com";

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
  console.log(
    `[DeezerService] Switched to proxy ${currentProxyIndex + 1}/${
      CORS_PROXIES.length
    }`
  );
}

const genres = [
  {
    id: 0,
    name: "Todos",
    picture: "https://api.deezer.com/genre/0/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc//56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc//250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc//500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc//1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 132,
    name: "Pop",
    picture: "https://api.deezer.com/genre/132/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/db7a604d9e7634a67d45cfc86b48370a/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/db7a604d9e7634a67d45cfc86b48370a/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/db7a604d9e7634a67d45cfc86b48370a/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/db7a604d9e7634a67d45cfc86b48370a/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 80,
    name: "Sertanejo",
    picture: "https://api.deezer.com/genre/80/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/54e4e821c4be54bbe937ccc0ab398a56/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/54e4e821c4be54bbe937ccc0ab398a56/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/54e4e821c4be54bbe937ccc0ab398a56/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/54e4e821c4be54bbe937ccc0ab398a56/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 78,
    name: "MPB",
    picture: "https://api.deezer.com/genre/78/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/8efc8564261302bbbe19f2aedb290c59/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/8efc8564261302bbbe19f2aedb290c59/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/8efc8564261302bbbe19f2aedb290c59/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/8efc8564261302bbbe19f2aedb290c59/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 472,
    name: "Rap/Funk Brasileiro",
    picture: "https://api.deezer.com/genre/472/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/cc690e9bab058987b22179e4d17cf937/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/cc690e9bab058987b22179e4d17cf937/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/cc690e9bab058987b22179e4d17cf937/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/cc690e9bab058987b22179e4d17cf937/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 116,
    name: "Rap/Hip Hop",
    picture: "https://api.deezer.com/genre/116/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/5c27115d3b797954afff59199dad98d1/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/5c27115d3b797954afff59199dad98d1/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/5c27115d3b797954afff59199dad98d1/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/5c27115d3b797954afff59199dad98d1/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 122,
    name: "Reggaeton",
    picture: "https://api.deezer.com/genre/122/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/44dfebf3cf943dd82759d9bd9063767a/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/44dfebf3cf943dd82759d9bd9063767a/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/44dfebf3cf943dd82759d9bd9063767a/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/44dfebf3cf943dd82759d9bd9063767a/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 152,
    name: "Rock",
    picture: "https://api.deezer.com/genre/152/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/b36ca681666d617edd0dcb5ab389a6ac/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/b36ca681666d617edd0dcb5ab389a6ac/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/b36ca681666d617edd0dcb5ab389a6ac/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/b36ca681666d617edd0dcb5ab389a6ac/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 113,
    name: "Dance",
    picture: "https://api.deezer.com/genre/113/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/bd5fdfa1a23e02e2697818e09e008e69/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/bd5fdfa1a23e02e2697818e09e008e69/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/bd5fdfa1a23e02e2697818e09e008e69/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/bd5fdfa1a23e02e2697818e09e008e69/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 165,
    name: "R&B",
    picture: "https://api.deezer.com/genre/165/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/68a43aec844708e693cb99f47814153b/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/68a43aec844708e693cb99f47814153b/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/68a43aec844708e693cb99f47814153b/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/68a43aec844708e693cb99f47814153b/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 85,
    name: "Alternativo",
    picture: "https://api.deezer.com/genre/85/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/fd252ab727d9a3b0b3c29014873f8f57/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/fd252ab727d9a3b0b3c29014873f8f57/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/fd252ab727d9a3b0b3c29014873f8f57/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/fd252ab727d9a3b0b3c29014873f8f57/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 79,
    name: "Samba/Pagode",
    picture: "https://api.deezer.com/genre/79/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/32401b85d1f77eed7d6818b762ebe8d9/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/32401b85d1f77eed7d6818b762ebe8d9/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/32401b85d1f77eed7d6818b762ebe8d9/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/32401b85d1f77eed7d6818b762ebe8d9/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 106,
    name: "Electro",
    picture: "https://api.deezer.com/genre/106/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/15df4502c1c58137dae5bdd1cc6f0251/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/15df4502c1c58137dae5bdd1cc6f0251/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/15df4502c1c58137dae5bdd1cc6f0251/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/15df4502c1c58137dae5bdd1cc6f0251/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 466,
    name: "Folk",
    picture: "https://api.deezer.com/genre/466/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/f9e070848998df8870ba65cd0d22b2b3/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/f9e070848998df8870ba65cd0d22b2b3/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/f9e070848998df8870ba65cd0d22b2b3/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/f9e070848998df8870ba65cd0d22b2b3/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 144,
    name: "Reggae",
    picture: "https://api.deezer.com/genre/144/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/7b901a98628cf879e1465f1dfd697e00/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/7b901a98628cf879e1465f1dfd697e00/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/7b901a98628cf879e1465f1dfd697e00/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/7b901a98628cf879e1465f1dfd697e00/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 129,
    name: "Jazz",
    picture: "https://api.deezer.com/genre/129/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/91468ecc5dfdd19c42a43d2cbdf27059/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/91468ecc5dfdd19c42a43d2cbdf27059/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/91468ecc5dfdd19c42a43d2cbdf27059/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/91468ecc5dfdd19c42a43d2cbdf27059/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 98,
    name: "Cl\u00e1ssica",
    picture: "https://api.deezer.com/genre/98/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/609f69b669b242252aa8ee09b5597655/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/609f69b669b242252aa8ee09b5597655/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/609f69b669b242252aa8ee09b5597655/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/609f69b669b242252aa8ee09b5597655/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 173,
    name: "Filmes/Games",
    picture: "https://api.deezer.com/genre/173/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/236d8057751d9c557728400dfe71483a/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/236d8057751d9c557728400dfe71483a/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/236d8057751d9c557728400dfe71483a/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/236d8057751d9c557728400dfe71483a/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 464,
    name: "Metal",
    picture: "https://api.deezer.com/genre/464/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/f14f9fde9feb38ca6d61960f00681860/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/f14f9fde9feb38ca6d61960f00681860/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/f14f9fde9feb38ca6d61960f00681860/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/f14f9fde9feb38ca6d61960f00681860/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 169,
    name: "Soul & Funk",
    picture: "https://api.deezer.com/genre/169/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/3d5e8aab99b95bfa7ac7e9e466e7781e/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/3d5e8aab99b95bfa7ac7e9e466e7781e/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/3d5e8aab99b95bfa7ac7e9e466e7781e/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/3d5e8aab99b95bfa7ac7e9e466e7781e/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
  {
    id: 153,
    name: "Blues",
    picture: "https://api.deezer.com/genre/153/image",
    picture_small:
      "https://cdn-images.dzcdn.net/images/misc/1abb6810098d4015bdc860c91bcfd2b6/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdn-images.dzcdn.net/images/misc/1abb6810098d4015bdc860c91bcfd2b6/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdn-images.dzcdn.net/images/misc/1abb6810098d4015bdc860c91bcfd2b6/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdn-images.dzcdn.net/images/misc/1abb6810098d4015bdc860c91bcfd2b6/1000x1000-000000-80-0-0.jpg",
    type: "genre",
  },
];

/**
 * Busca até 100 músicas do chart de um gênero específico.
 * @param {number} genreId - ID do gênero Deezer (ex: 132 = Pop)
 */
async function getSongsByGenre(genreId, retryCount = 0) {
  const maxRetries = CORS_PROXIES.length;

  try {
    console.log(`🎧 Buscando músicas do gênero ID: ${genreId}...`);

    let apiUrl = `${DEEZER_API}/chart/${genreId}/tracks?limit=100`;

    const proxyUrl = getProxyUrl(apiUrl);
    console.log(`🌐 URL: ${proxyUrl.substring(0, 100)}...`);

    const response = await fetch(proxyUrl);

    if (!response.ok) {
      // Try next proxy if available
      if (retryCount < maxRetries - 1) {
        console.warn(
          `[DeezerService] Proxy ${
            currentProxyIndex + 1
          } failed, trying next...`
        );
        switchProxy();
        return getSongsByGenre(genreId, retryCount + 1);
      }

      const errorText = await response.text();
      console.error(`❌ Erro HTTP ${response.status}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    let data = await response.json();

    // Handle different proxy response formats
    // allorigins.win wraps response in {contents: "..."}
    if (data.contents) {
      try {
        data = JSON.parse(data.contents);
      } catch (e) {
        console.error("[DeezerService] Failed to parse proxy response:", e);
        throw new Error("Invalid response format from proxy");
      }
    }

    console.log(`📦 Dados recebidos:`, data);

    // Chart endpoint retorna tracks em data.tracks.data
    // Radio endpoint também retorna em data.data
    const tracksData = data.tracks?.data || data.data || [];
    console.log(`🎵 Tracks encontrados: ${tracksData.length}`);

    if (tracksData.length === 0) {
      console.warn(
        `⚠️ Nenhum track encontrado na resposta. Estrutura:`,
        Object.keys(data)
      );
    }

    const songs = tracksData
      .filter((track) => !!track.preview) // apenas músicas com preview de 30s
      .map((track) => ({
        id: `track-${track.id}`, // Formato esperado pelo jogo
        trackId: track.id, // ID original do Deezer
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        coverImage: track.album.cover_medium, // Nome esperado pelo Player
        previewUrl: track.preview, // Nome esperado pelo Player
        // Mantém também os nomes antigos para compatibilidade
        cover: track.album.cover_medium,
        preview: track.preview,
      }));

    console.log(`✅ Encontradas ${songs.length} músicas válidas.`);

    if (songs.length === 0 && retryCount < maxRetries - 1) {
      console.warn(`[DeezerService] No songs found, trying next proxy...`);
      switchProxy();
      return getSongsByGenre(genreId, retryCount + 1);
    }

    return songs;
  } catch (err) {
    console.error("❌ Erro ao buscar músicas:", err.message);

    // Try next proxy if available
    if (
      retryCount < maxRetries - 1 &&
      (err.message.includes("Failed to fetch") ||
        err.message.includes("NetworkError") ||
        err.message.includes("CORS"))
    ) {
      console.warn(
        `[DeezerService] Error with proxy ${
          currentProxyIndex + 1
        }, trying next...`
      );
      switchProxy();
      return getSongsByGenre(genreId, retryCount + 1);
    }

    return [];
  }
}

/**
 * Embaralha um array (Fisher–Yates)
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Busca músicas aleatórias de vários gêneros
 * @param {number} totalGenres - Quantos gêneros sortear
 * @param {number} perGenre - Quantas músicas por gênero
 */
async function getRandomSongs(totalGenres = 3, perGenre = 10) {
  // Filtra gêneros válidos (exclui "Todos" com id 0)
  const validGenres = genres.filter((g) => g.id !== 0);

  // Sorteia alguns gêneros
  const randomGenres = shuffle([...validGenres]).slice(0, totalGenres);
  console.log(
    `🎵 Gêneros sorteados: ${randomGenres.map((g) => g.name).join(", ")}`
  );

  // Busca músicas de cada gênero
  const allSongs = [];
  for (const genre of randomGenres) {
    const songs = await getSongsByGenre(genre.id);
    // Adiciona o genreId a cada música para poder buscar opções do mesmo gênero depois
    const songsWithGenre = songs.slice(0, perGenre).map((song) => ({
      ...song,
      genreId: genre.id,
    }));
    allSongs.push(...songsWithGenre);
  }

  // Embaralha tudo e retorna
  return shuffle(allSongs);
}

/**
 * Busca músicas para o Jogo Diário
 * Retorna músicas de diferentes gêneros, cada uma com seu genreId
 * @param {number} count - Quantidade de músicas para o jogo
 */
async function getDailyGameTracks(count = 5) {
  // Para ter diversidade, busca de múltiplos gêneros
  const totalGenres = Math.max(3, Math.ceil(count / 3));
  const perGenre = Math.ceil(count / totalGenres);

  const songs = await getRandomSongs(totalGenres, perGenre);

  // Seleciona 'count' músicas garantindo artistas únicos
  const selectedSongs = [];
  const usedArtists = new Set();

  for (const song of songs) {
    if (selectedSongs.length >= count) break;
    const artistLower = song.artist.toLowerCase().trim();
    if (!usedArtists.has(artistLower)) {
      selectedSongs.push(song);
      usedArtists.add(artistLower);
    }
  }

  return selectedSongs.slice(0, count);
}

/**
 * Busca músicas para o Jogo Normal (por gênero)
 * @param {number} genreId - ID do gênero
 * @param {number} count - Quantidade de músicas para o jogo
 */
async function getNormalGameTracks(genreId, count = 5) {
  const songs = await getSongsByGenre(genreId);

  // Seleciona 'count' músicas garantindo artistas únicos
  const selectedSongs = [];
  const usedArtists = new Set();

  // Embaralha antes de selecionar
  const shuffledSongs = shuffle([...songs]);

  for (const song of shuffledSongs) {
    if (selectedSongs.length >= count) break;
    const artistLower = song.artist.toLowerCase().trim();
    if (!usedArtists.has(artistLower)) {
      selectedSongs.push({
        ...song,
        genreId: genreId, // Garante que o genreId está presente
      });
      usedArtists.add(artistLower);
    }
  }

  return selectedSongs.slice(0, count);
}

/**
 * Busca opções de resposta para uma música
 * @param {number} genreId - ID do gênero da música
 * @param {Array} excludeTracks - Músicas a excluir (incluindo a música atual)
 * @param {number} count - Quantidade de opções (sem contar a música correta)
 */
async function getRandomOptions(genreId, excludeTracks = [], count = 3) {
  const songs = await getSongsByGenre(genreId);

  // Cria um Set com IDs a excluir
  const excludeIds = new Set();
  excludeTracks.forEach((track) => {
    if (track.id) excludeIds.add(track.id);
    if (track.trackId) excludeIds.add(track.trackId);
  });

  // Filtra músicas válidas (com preview e não excluídas)
  const availableSongs = songs.filter(
    (song) => song.preview && !excludeIds.has(song.id)
  );

  // Embaralha e seleciona
  const shuffled = shuffle([...availableSongs]);
  return shuffled.slice(0, count);
}

export default {
  getDailyGameTracks,
  getNormalGameTracks,
  getRandomOptions,
  genres,
};
