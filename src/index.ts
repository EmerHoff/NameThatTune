import * as dotenv from 'dotenv';
import { TidalService } from './services/tidal.service';
import { ReadlineUtil } from './utils/readline.util';

dotenv.config();

/**
 * Main application entry point
 */
async function main(): Promise<void> {
  const clientId: string = process.env.TIDAL_CLIENT_ID || '';
  const clientSecret: string = process.env.TIDAL_CLIENT_SECRET || '';
  if (!clientId || !clientSecret) {
    console.error('Error: TIDAL_CLIENT_ID and TIDAL_CLIENT_SECRET must be set in .env file');
    process.exit(1);
  }
  const tidalService: TidalService = new TidalService(clientId, clientSecret);
  const readlineUtil: ReadlineUtil = new ReadlineUtil();
  console.log('=== Tidal Music Searcher ===\n');
  try {
    while (true) {
      const songName: string = await readlineUtil.question('Digite o nome da música (ou "sair" para encerrar): ');
      if (songName.toLowerCase() === 'sair' || songName.toLowerCase() === 'exit') {
        console.log('Encerrando...');
        break;
      }
      if (!songName) {
        console.log('Por favor, digite um nome de música válido.\n');
        continue;
      }
      console.log(`\nBuscando "${songName}"...`);
      try {
        const result = await tidalService.searchTrack(songName);
        if (result) {
          console.log('\n✓ Música encontrada!');
          console.log(`  Título: ${result.title}`);
          console.log(`  Artista: ${result.artist}`);
          console.log(`  Álbum: ${result.album}`);
          console.log(`  Link: ${result.link}\n`);
        } else {
          console.log(`\n✗ Nenhuma música encontrada para "${songName}"\n`);
        }
      } catch (error) {
        const errorMessage: string = error instanceof Error ? error.message : 'Unknown error';
        console.error(`\n✗ Erro ao buscar música: ${errorMessage}\n`);
      }
    }
  } catch (error) {
    const errorMessage: string = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Erro fatal: ${errorMessage}`);
    process.exit(1);
  } finally {
    readlineUtil.close();
  }
}

main().catch((error: Error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

