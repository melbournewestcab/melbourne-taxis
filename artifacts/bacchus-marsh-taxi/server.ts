import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Standard middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Health & Status route
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      nodeVersion: process.version,
      platform: "Node.js Express + TypeScript",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // Booking inquiry / message endpoint
  app.post("/api/bookings/estimate", (req, res) => {
    try {
      const { pickup, dropoff, distanceKm, vehicleType } = req.body;
      const baseRate = 25.0; // $25 base minimum
      const perKmRate = vehicleType === "maxi" ? 2.65 : 1.95;
      const distance = parseFloat(distanceKm) || 0;
      const estimatedTotal = Math.max(baseRate, +(baseRate + distance * perKmRate).toFixed(2));

      res.json({
        success: true,
        pickup,
        dropoff,
        distanceKm: distance,
        vehicleType: vehicleType || "sedan",
        estimatedTotal,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Contact / feedback endpoint
  app.post("/api/contact", (req, res) => {
    const { name, phone, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "Name and phone number are required." });
    }
    console.log(`[Node.js Server] New inquiry received from ${name} (${phone}): ${message}`);
    res.json({ success: true, message: "Inquiry received. A dispatcher will contact you shortly." });
  });

  // Vite middleware in development vs static file serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Check possible production build output directories
    const primaryDist = path.join(process.cwd(), "dist", "public");
    const fallbackDist = path.join(process.cwd(), "dist");
    const distPath = fs.existsSync(primaryDist) ? primaryDist : fallbackDist;

    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Node.js Server] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
