import { Router } from "express";
import nodemailer from "nodemailer";
import { CreateBookingBody, EstimateFareBody } from "@workspace/api-zod";

const router = Router();

const PHONE = "0435304821";
const WHATSAPP_NUMBER = "61435304821";
const OWNER_EMAIL = process.env.OWNER_EMAIL || "info@bacchusmarsxtaxi.com.au";

// ── Safe Transport Victoria regulated taxi meter rates (2025/2026) ────────────
// Source: Safe Transport Victoria "UNBOOKED SERVICE FARES" schedule for Metropolitan Melbourne,
// Frankston, Dandenong & Mornington Peninsula.
// Time or distance tariff structure (crossover speed: 21 km/h):
// - Distance charges apply while vehicle speed > 21 km/h
// - Time/detention charges apply while vehicle speed < 21 km/h

const CPV_LEVY = 1.30; // CPV government levy recovery fee (with GST)

const RATES = {
  // Day rate: 9am to 5pm
  day: {
    flagFall: 5.40,
    perKm: 2.10,
    perMin: 0.70,
    label: "Day Rate (9am - 5pm)",
  },
  // Overnight rate: 5pm to 9am (excluding peak)
  overnight: {
    flagFall: 6.75,
    perKm: 2.30,
    perMin: 0.80,
    label: "Overnight Rate (5pm - 9am)",
  },
  // Peak rate: 10pm to 4am Friday & Saturday night, plus Victorian public holidays
  peak: {
    flagFall: 8.00,
    perKm: 2.55,
    perMin: 0.85,
    label: "Peak / Weekend Night Rate (10pm - 4am)",
  },
};

// Extras & Surcharges (Safe Transport Victoria regulated schedule)
// High occupancy fee ($18.35): taxis carrying 5+ passengers or where larger vehicle is required (Maxi / 6-seater)
const HIGH_OCCUPANCY_FEE = 18.35;

const SURCHARGES: Record<string, number> = {
  sedan: 0,
  suv: 18.00,
  silver_service: 11.00,
  six_seater: HIGH_OCCUPANCY_FEE,
  maxi_taxi: HIGH_OCCUPANCY_FEE,
};

const VEHICLE_LABELS: Record<string, string> = {
  sedan: "Sedan",
  suv: "SUV",
  silver_service: "Silver Service",
  six_seater: "6 Seater People Mover",
  maxi_taxi: "Maxi Taxi",
};

// Minimum fare: $25 flat, applies when calculated total is under $25 or trips under 5 km
const MINIMUM_FARE = 25.00;
const MINIMUM_FARE_DISTANCE_KM = 5.0;

// ── Toll section rates (Linkt / ConnectEast 2025/2026) ─────────────────────────
const TOLL_SECTIONS: Record<string, { car: number; heavy: number; label: string }> = {
  m80:             { car: 3.73, heavy: 5.60, label: "CityLink (Western Ring Rd)" },
  m2_tullamarine:  { car: 3.73, heavy: 5.60, label: "CityLink (Tullamarine Fwy)" },
  domain_tunnel:   { car: 2.74, heavy: 4.11, label: "CityLink (Domain Tunnel)" },
  burnley_tunnel:  { car: 2.74, heavy: 4.11, label: "CityLink (Burnley Tunnel)" },
  monash_cl:       { car: 3.69, heavy: 5.54, label: "CityLink (Monash Fwy)" },
  eastlink:        { car: 5.04, heavy: 7.56, label: "EastLink (M3)" },
  westgate_tunnel: { car: 6.13, heavy: 9.20, label: "Westgate Tunnel" },
};

function isHoliday(dateStr?: string | null): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const m = d.getMonth() + 1; // 1-12
  const day = d.getDate();
  // Christmas Day (Dec 25), Boxing Day (Dec 26), New Year's Day (Jan 1)
  if ((m === 12 && (day === 25 || day === 26 || day === 31)) || (m === 1 && day === 1)) {
    return true;
  }
  return false;
}

function determineRate(pickupDate?: string | null, pickupTime?: string | null) {
  if (!pickupTime) return RATES.day;

  const [hourStr, minStr] = pickupTime.split(":");
  const hour = parseInt(hourStr, 10);
  const min = parseInt(minStr || "0", 10);
  const totalMins = hour * 60 + min;

  let dayOfWeek = -1;
  if (pickupDate) {
    const d = new Date(pickupDate + "T" + pickupTime);
    if (!isNaN(d.getTime())) {
      dayOfWeek = d.getDay(); // 0=Sun, 5=Fri, 6=Sat
    }
  }

  // Check holiday peak rate (e.g. Christmas, Boxing Day, NYE 6pm+)
  if (isHoliday(pickupDate)) {
    if (pickupDate?.endsWith("-12-31")) {
      if (totalMins >= 18 * 60) return RATES.peak;
    } else {
      return RATES.peak;
    }
  }

  // Peak rates apply:
  // - 10pm Friday to 4am Saturday
  // - 10pm Saturday to 4am Sunday
  const isFriNightPeak = dayOfWeek === 5 && totalMins >= 22 * 60;
  const isSatEarlyPeak = dayOfWeek === 6 && totalMins < 4 * 60;
  const isSatNightPeak = dayOfWeek === 6 && totalMins >= 22 * 60;
  const isSunEarlyPeak = dayOfWeek === 0 && totalMins < 4 * 60;

  if (isFriNightPeak || isSatEarlyPeak || isSatNightPeak || isSunEarlyPeak) {
    return RATES.peak;
  }

  // Day rate: 9am to 5pm (9:00 to 17:00)
  if (totalMins >= 9 * 60 && totalMins < 17 * 60) {
    return RATES.day;
  }

  // Overnight rate: 5pm to 9am (excluding peak hours above)
  return RATES.overnight;
}

function calcTollCharges(
  vehicleType: string,
  tollRoads: string[],
): { total: number; used: string[] } {
  const isHeavy = vehicleType === "maxi_taxi";
  let total = 0;
  const used: string[] = [];
  const seen = new Set<string>();
  for (const section of tollRoads) {
    const key = section.toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z_]/g, "");
    if (seen.has(key)) continue;
    seen.add(key);
    const rate = TOLL_SECTIONS[key];
    if (rate) {
      total += isHeavy ? rate.heavy : rate.car;
      used.push(rate.label);
    }
  }
  return { total: Math.round(total * 100) / 100, used };
}

export function calcFare(
  distanceKm: number,
  vehicleType: string,
  passengers?: number | null,
  pickupDate?: string | null,
  pickupTime?: string | null,
  tollRoads?: string[] | null,
  trafficRatio?: number | null,
  durationMinutes?: number | null,
  durationInTrafficMinutes?: number | null,
) {
  const rate = determineRate(pickupDate, pickupTime);
  const numPassengers = passengers || (vehicleType === "maxi_taxi" ? 6 : 1);

  // High occupancy fee applies for 5+ passengers or maxi/6-seater
  let vehicleSurcharge = SURCHARGES[vehicleType] ?? 0;
  if (numPassengers >= 5 && vehicleSurcharge < HIGH_OCCUPANCY_FEE) {
    vehicleSurcharge = HIGH_OCCUPANCY_FEE;
  }

  const { total: tollCharges, used: usedTolls } = calcTollCharges(vehicleType, tollRoads ?? []);

  // Time vs Distance live traffic calculation:
  // Estimate time spent in traffic / stop-and-go (< 21 km/h) vs cruising (> 21 km/h)
  const baseDurationMins = durationMinutes || (distanceKm / 50) * 60; // default ~50 km/h average
  const trafficDurationMins = durationInTrafficMinutes || (trafficRatio ? baseDurationMins * trafficRatio : baseDurationMins);
  
  // Live traffic delay beyond normal driving duration
  const trafficDelayMins = Math.max(0, trafficDurationMins - baseDurationMins);
  
  // Baseline urban stop-and-go time (traffic lights, intersections where speed < 21 km/h)
  // Typically 12-18% of urban travel time in Melbourne
  const baselineSlowMins = Math.max(1, baseDurationMins * 0.15);
  
  // Total detention / slow speed time (< 21 km/h) charged at time rate
  const totalSlowMins = baselineSlowMins + trafficDelayMins;

  // Cruising distance charged at distance rate
  const cruisingDistanceKm = Math.max(0.5, distanceKm);

  // Meter components
  const flagFall = rate.flagFall;
  const distanceCharge = cruisingDistanceKm * rate.perKm;
  const timeCharge = totalSlowMins * rate.perMin;
  const cpvLevy = CPV_LEVY;

  const standardMeter = flagFall + distanceCharge + timeCharge + cpvLevy;
  const isShortTrip = distanceKm < MINIMUM_FARE_DISTANCE_KM;

  let totalFare: number;
  let minimumFareCharge = 0;

  if (isShortTrip || (standardMeter + vehicleSurcharge + tollCharges) < MINIMUM_FARE) {
    minimumFareCharge = MINIMUM_FARE;
    totalFare = MINIMUM_FARE + vehicleSurcharge + tollCharges;
  } else {
    totalFare = standardMeter + vehicleSurcharge + tollCharges;
  }

  const trafficLevel = trafficDelayMins > 8 ? "Heavy Traffic" : trafficDelayMins > 3 ? "Moderate Traffic" : "Normal Flow";

  return {
    flagFall: Math.round(flagFall * 100) / 100,
    distanceCharge: Math.round(distanceCharge * 100) / 100,
    timeCharge: Math.round(timeCharge * 100) / 100,
    cpvLevy: Math.round(cpvLevy * 100) / 100,
    minimumFare: minimumFareCharge > 0 ? MINIMUM_FARE : 0,
    vehicleSurcharge: Math.round(vehicleSurcharge * 100) / 100,
    tollCharges: Math.round(tollCharges * 100) / 100,
    totalFare: Math.round(totalFare * 100) / 100,
    tollRoads: usedTolls,
    rateLabel: rate.label,
    rateType: rate === RATES.peak ? "peak" : rate === RATES.overnight ? "overnight" : "day",
    durationMinutes: Math.round(trafficDurationMins),
    trafficDelayMinutes: Math.round(trafficDelayMins),
    slowMinutes: Math.round(totalSlowMins),
    trafficLevel,
    ratesSchedule: {
      flagFall: rate.flagFall,
      perKm: rate.perKm,
      perMin: rate.perMin,
    },
  };
}

function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
}

function buildEmailHtml(data: any, bookingId: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#111;color:#fff;padding:20px">
<div style="max-width:600px;margin:0 auto;background:#1a1a1a;border:2px solid #f97316;border-radius:8px;padding:24px">
  <h1 style="color:#f97316;margin:0 0 16px">🚖 New Booking — Bacchus Marsh Taxi</h1>
  <p style="color:#aaa;margin:0 0 20px">Booking ID: <strong style="color:#fff">${bookingId}</strong></p>
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:8px 0;color:#f97316;width:40%"><strong>Customer</strong></td><td style="padding:8px 0">${data.name}</td></tr>
    <tr style="background:#222"><td style="padding:8px;color:#f97316"><strong>Phone</strong></td><td style="padding:8px"><a href="tel:${data.phone}" style="color:#fff">${data.phone}</a></td></tr>
    <tr><td style="padding:8px 0;color:#f97316"><strong>Email</strong></td><td style="padding:8px 0">${data.email}</td></tr>
    <tr style="background:#222"><td style="padding:8px;color:#f97316"><strong>Pickup</strong></td><td style="padding:8px">${data.pickupAddress}</td></tr>
    <tr><td style="padding:8px 0;color:#f97316"><strong>Dropoff</strong></td><td style="padding:8px 0">${data.dropoffAddress}</td></tr>
    <tr style="background:#222"><td style="padding:8px;color:#f97316"><strong>Vehicle</strong></td><td style="padding:8px">${VEHICLE_LABELS[data.vehicleType] || data.vehicleType}</td></tr>
    <tr><td style="padding:8px 0;color:#f97316"><strong>Passengers</strong></td><td style="padding:8px 0">${data.passengers}</td></tr>
    <tr style="background:#222"><td style="padding:8px;color:#f97316"><strong>Date & Time</strong></td><td style="padding:8px">${data.pickupDate} at ${data.pickupTime}</td></tr>
    ${data.isReturn ? `<tr><td style="padding:8px 0;color:#f97316"><strong>Return</strong></td><td style="padding:8px 0">${data.returnDate} at ${data.returnTime}</td></tr>` : ""}
    ${data.distanceKm ? `<tr style="background:#222"><td style="padding:8px;color:#f97316"><strong>Distance</strong></td><td style="padding:8px">${data.distanceKm.toFixed(1)} km</td></tr>` : ""}
    ${data.estimatedFare ? `<tr><td style="padding:8px 0;color:#f97316"><strong>Est. Fare</strong></td><td style="padding:8px 0"><strong style="color:#f97316;font-size:18px">$${data.estimatedFare.toFixed(2)}</strong></td></tr>` : ""}
    ${data.notes ? `<tr style="background:#222"><td style="padding:8px;color:#f97316"><strong>Notes</strong></td><td style="padding:8px">${data.notes}</td></tr>` : ""}
  </table>
  <div style="margin-top:20px;padding:12px;background:#f97316;border-radius:4px;text-align:center">
    <a href="tel:${data.phone}" style="color:#000;font-weight:bold;font-size:16px;text-decoration:none">📞 Call ${data.phone}</a>
  </div>
</div>
</body>
</html>`;
}

function buildWhatsAppMessage(data: any, bookingId: string) {
  const vehicle = VEHICLE_LABELS[data.vehicleType] || data.vehicleType;
  let msg = `🚖 *NEW BOOKING — Bacchus Marsh Taxi*\n\n`;
  msg += `📋 Booking ID: ${bookingId}\n`;
  msg += `👤 Name: ${data.name}\n`;
  msg += `📞 Phone: ${data.phone}\n`;
  msg += `📧 Email: ${data.email}\n\n`;
  msg += `📍 Pickup: ${data.pickupAddress}\n`;
  msg += `🏁 Dropoff: ${data.dropoffAddress}\n\n`;
  msg += `🚗 Vehicle: ${vehicle}\n`;
  msg += `👥 Passengers: ${data.passengers}\n`;
  msg += `📅 Date: ${data.pickupDate}\n`;
  msg += `🕐 Time: ${data.pickupTime}\n`;
  if (data.isReturn) {
    msg += `🔄 Return: ${data.returnDate} at ${data.returnTime}\n`;
  }
  if (data.distanceKm) msg += `📏 Distance: ${data.distanceKm.toFixed(1)} km\n`;
  if (data.estimatedFare) msg += `💰 Est. Fare: $${data.estimatedFare.toFixed(2)}\n`;
  return msg;
}

router.post("/", async (req, res) => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid booking data: " + parsed.error.message });
    return;
  }

  const data = parsed.data;
  const bookingId = `BMT-${Date.now().toString(36).toUpperCase()}`;

  req.log.info({ bookingId, name: data.name, vehicleType: data.vehicleType }, "New booking received");

  const whatsappMsg = buildWhatsAppMessage(data, bookingId);
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`;

  const transporter = createTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: OWNER_EMAIL,
        subject: `🚖 New Booking ${bookingId} — ${data.name} — ${data.pickupDate}`,
        html: buildEmailHtml(data, bookingId),
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: data.email,
        subject: `Your Bacchus Marsh Taxi booking is confirmed — ${bookingId}`,
        html: buildEmailHtml(data, bookingId).replace(
          "🚖 New Booking — Bacchus Marsh Taxi",
          "✅ Booking Confirmed — Bacchus Marsh Taxi"
        ),
      });
      req.log.info({ bookingId }, "Booking emails sent");
    } catch (err) {
      req.log.error({ err, bookingId }, "Failed to send booking email");
    }
  } else {
    req.log.warn({ bookingId }, "Email not configured — set EMAIL_USER and EMAIL_PASS env vars");
  }

  res.json({
    success: true,
    message: `Booking ${bookingId} received! We will contact you shortly. For immediate service call ${PHONE}.`,
    bookingId,
    whatsappUrl: waUrl,
  });
});

router.post("/estimate", (req, res) => {
  const parsed = EstimateFareBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { distanceKm, vehicleType, pickupDate, pickupTime, tollRoads, trafficRatio } = parsed.data;
  const rawBody = req.body || {};
  const passengers = typeof rawBody.passengers === "number" ? rawBody.passengers : undefined;
  const durationMinutes = typeof rawBody.durationMinutes === "number" ? rawBody.durationMinutes : undefined;
  const durationInTrafficMinutes = typeof rawBody.durationInTrafficMinutes === "number" ? rawBody.durationInTrafficMinutes : undefined;

  const fareResult = calcFare(
    distanceKm,
    vehicleType,
    passengers,
    pickupDate,
    pickupTime,
    tollRoads,
    trafficRatio,
    durationMinutes,
    durationInTrafficMinutes
  );

  res.json({
    ...fareResult,
    vehicleType,
    distanceKm,
  });
});

export default router;
