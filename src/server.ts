import express, { Express, Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import path from "path";
import { DeezerService } from "./services/deezer.service";

dotenv.config();

const app: Express = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(express.json());

// Deezer API is public and doesn't require authentication
const deezerService: DeezerService = new DeezerService();

/**
 * Health check endpoint
 */
app.get("/api/health", (req: Request, res: Response): void => {
  res.json({ status: "ok" });
});

/**
 * Get random tracks for the game
 */
app.get("/api/game/tracks", async (req: Request, res: Response): Promise<void> => {
  try {
    const count: number = parseInt(req.query.count as string, 10) || 5;
    console.log(`[API] Request received for ${count} tracks`);
    console.log(`[API] Calling deezerService.getRandomTracks(${count})`);
    
    const tracks = await deezerService.getRandomTracks(count);
    
    console.log(`[API] Service returned ${tracks?.length || 0} tracks`);
    
    if (!tracks || tracks.length === 0) {
      console.error("[API] No tracks returned from service");
      res.status(500).json({ 
        error: "No tracks were returned from the service",
        tracks: []
      });
      return;
    }
    
    console.log(`[API] Successfully returning ${tracks.length} tracks`);
    console.log(`[API] First track sample:`, tracks[0]);
    
    res.setHeader("Content-Type", "application/json");
    res.json({ tracks });
  } catch (error) {
    const errorMessage: string =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[API] Error getting tracks:", errorMessage);
    console.error("[API] Full error:", error);
    
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ 
      error: errorMessage,
      tracks: [],
      details: error instanceof Error ? error.stack : undefined
    });
  }
});

/**
 * Search tracks endpoint
 */
app.get("/api/search", async (req: Request, res: Response): Promise<void> => {
  try {
    const query: string = req.query.q as string;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    if (!query) {
      res.status(400).json({ error: "Query parameter 'q' is required" });
      return;
    }
    const tracks = await deezerService.searchTracks(query, limit);
    res.json({ tracks });
  } catch (error) {
    const errorMessage: string =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error searching tracks:", errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

// Serve static files AFTER API routes
app.use(express.static(path.join(__dirname, "../public")));

// Catch-all handler: send back index.html file for any non-API routes
app.get("*", (req: Request, res: Response): void => {
  // Don't send HTML for API routes
  if (req.path.startsWith("/api/")) {
    res.status(404).json({ error: "API endpoint not found" });
    return;
  }
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, (): void => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

