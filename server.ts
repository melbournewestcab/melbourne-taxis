import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import path from "path";
import { createServer as createViteServer } from "vite";
import apiRouter from "./api/routes";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production" || !process.argv[1]?.endsWith("server.ts");

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple logger middleware to populate req.log
app.use((req: any, _res: Response, next: NextFunction) => {
  req.log = {
    info: (...args: any[]) => console.log("[INFO]", ...args),
    warn: (...args: any[]) => console.warn("[WARN]", ...args),
    error: (...args: any[]) => console.error("[ERROR]", ...args),
  };
  next();
});

// Health check endpoints for Cloud Run and monitoring
app.get(["/api/health", "/healthz", "/_health"], (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// Mount API routes
app.use("/api", apiRouter);

async function start() {
  if (!isProduction) {
    const vite = await createViteServer({
      configFile: path.resolve(process.cwd(), "vite.config.ts"),
      server: { middlewareMode: true, host: "0.0.0.0", port: PORT },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use((_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (mode: ${isProduction ? "production" : "development"})`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
