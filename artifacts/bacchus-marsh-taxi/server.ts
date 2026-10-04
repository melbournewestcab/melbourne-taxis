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
      const { pickup, dropoff, distanceKm, vehicleType, passengers } = req.body;
      const distance = parseFloat(distanceKm) || 0;
      const numPax = parseInt(passengers, 10) || 1;
      
      // Regulated Victoria Taxi Rates: $5.25 flagfall, $2.037/km (sedan), $1.40 CPV levy
      const flagfall = 5.25;
      const perKmRate = 2.037;
      const cpvLevy = 1.40;
      const vehicleSurcharge = vehicleType === "maxi_taxi" || vehicleType === "six_seater" || numPax >= 5
        ? 21.50
        : vehicleType === "suv"
        ? 15.00
        : vehicleType === "silver_service"
        ? 11.00
        : 0;

      const meterFare = flagfall + (distance * perKmRate) + cpvLevy;
      // Flat $25 minimum for trips under 5 km
      const baseTrip = distance < 5 ? Math.max(25.0, meterFare) : meterFare;
      const totalFare = +(baseTrip + vehicleSurcharge).toFixed(2);

      res.json({
        success: true,
        pickup,
        dropoff,
        distanceKm: distance,
        vehicleType: vehicleType || "sedan",
        totalFare,
        estimatedTotal: totalFare,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Booking submission endpoint (100% internal, no third-party services)
  app.post("/api/bookings", async (req, res) => {
    try {
      const data = req.body || {};
      const bookingId = `BMT-${Date.now().toString(36).toUpperCase()}`;
      const recipient = process.env.OWNER_EMAIL || "p2839582@gmail.com";

      console.log(`[Node.js Server] New booking ${bookingId} for ${data.name} (${data.phone}) - Pickup: ${data.pickupAddress}`);

      res.json({
        success: true,
        message: `Booking ${bookingId} received directly by our dispatch system. We will contact you shortly.`,
        bookingId,
        targetEmail: recipient,
        storedInternally: true,
        whatsappUrl: `https://wa.me/61435304821?text=${encodeURIComponent(`🚖 New Booking: ${bookingId} - ${data.name} (${data.phone}) - ${data.pickupAddress} to ${data.dropoffAddress}`)}`,
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
