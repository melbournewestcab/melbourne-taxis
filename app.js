var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server.ts
import express from "express";
import cors from "cors";
import compression from "compression";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// artifacts/api-server/src/routes/index.ts
import { Router as Router5 } from "express";

// artifacts/api-server/src/routes/health.ts
import { Router } from "express";

// lib/api-zod/src/generated/api.ts
import * as zod from "zod";
var HealthCheckResponse = zod.object({
  status: zod.string()
});
var createBookingBodyPassengersMax = 13;
var CreateBookingBody = zod.object({
  name: zod.string(),
  phone: zod.string(),
  email: zod.string(),
  pickupAddress: zod.string(),
  dropoffAddress: zod.string(),
  vehicleType: zod.enum([
    "sedan",
    "suv",
    "silver_service",
    "six_seater",
    "maxi_taxi"
  ]),
  passengers: zod.number().min(1).max(createBookingBodyPassengersMax),
  pickupDate: zod.string(),
  pickupTime: zod.string(),
  isReturn: zod.boolean(),
  returnDate: zod.string().nullish(),
  returnTime: zod.string().nullish(),
  estimatedFare: zod.number().nullish(),
  notes: zod.string().nullish(),
  distanceKm: zod.number().nullish(),
  paymentMethod: zod.enum(["cash", "card", "cabcharge"]).nullish()
});
var CreateBookingResponse = zod.object({
  success: zod.boolean(),
  message: zod.string(),
  bookingId: zod.string()
});
var SendOtpBody = zod.object({
  phone: zod.string()
});
var SendOtpResponse = zod.object({
  success: zod.boolean(),
  message: zod.string(),
  otp: zod.string().optional().describe("Returned in demo mode; integrate SMS gateway for production")
});
var VerifyOtpBody = zod.object({
  phone: zod.string(),
  otp: zod.string()
});
var VerifyOtpResponse = zod.object({
  success: zod.boolean(),
  message: zod.string()
});
var EstimateFareBody = zod.object({
  distanceKm: zod.number(),
  vehicleType: zod.enum([
    "sedan",
    "suv",
    "silver_service",
    "six_seater",
    "maxi_taxi"
  ]),
  pickupDate: zod.string().nullish(),
  pickupTime: zod.string().nullish(),
  tollRoads: zod.array(zod.string()).nullish().describe(
    'Toll roads detected on the route (e.g. "CityLink", "EastLink", "Westgate Tunnel")'
  ),
  trafficRatio: zod.number().nullish().describe(
    "Optional live traffic multiplier from Google Maps (e.g. 1.25 means traffic is 25% slower than baseline)"
  )
});
var EstimateFareResponse = zod.object({
  baseFare: zod.number(),
  surcharge: zod.number(),
  tollCharges: zod.number(),
  totalFare: zod.number(),
  trafficMultiplier: zod.number(),
  vehicleType: zod.string(),
  distanceKm: zod.number(),
  tollRoads: zod.array(zod.string())
});

// artifacts/api-server/src/routes/health.ts
var router = Router();
router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});
var health_default = router;

// artifacts/api-server/src/routes/bookings.ts
import { Router as Router2 } from "express";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
var router2 = Router2();
var SETTINGS_FILE = path.join(process.cwd(), "dispatch-settings.json");
function loadDispatchSettings() {
  const fallbackEmails = process.env.OWNER_EMAIL || "p2839582@gmail.com";
  const defaultSettings = {
    ownerEmails: fallbackEmails,
    dispatchPhone: process.env.DISPATCH_PHONE || "0435304821",
    whatsappNumber: process.env.WHATSAPP_NUMBER || "61435304821",
    emailUser: process.env.EMAIL_USER || "p2839582@gmail.com",
    emailPass: process.env.EMAIL_PASS || "",
    smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
    smtpPort: Number(process.env.SMTP_PORT) || 465
  };
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
      return { ...defaultSettings, ...parsed };
    }
  } catch (err) {
    console.warn("Could not read dispatch-settings.json:", err);
  }
  return defaultSettings;
}
function saveDispatchSettings(settings) {
  const current = loadDispatchSettings();
  const merged = {
    ...current,
    ...settings,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not save dispatch-settings.json:", err);
  }
  return merged;
}
var PHONE = "0435304821";
var WHATSAPP_NUMBER = "61435304821";
var TARGET_BOOKING_EMAIL = "p2839582@gmail.com";
var OWNER_EMAIL = process.env.OWNER_EMAIL || TARGET_BOOKING_EMAIL;
var CPV_LEVY = 1.4;
var RATES = {
  // Day rate: 9am to 5pm (Safe Transport Victoria regulated schedule)
  day: {
    flagFall: 5.25,
    perKm: 2.037,
    perMin: 0.713,
    label: "Day Rate (9am - 5pm)"
  },
  // Overnight rate: 5pm to 9am (excluding peak)
  overnight: {
    flagFall: 6.55,
    perKm: 2.265,
    perMin: 0.792,
    label: "Overnight Rate (5pm - 9am)"
  },
  // Peak rate: 10pm to 4am Friday & Saturday night, plus Victorian public holidays
  peak: {
    flagFall: 7.8,
    perKm: 2.493,
    perMin: 0.872,
    label: "Peak / Weekend Night Rate (10pm - 4am)"
  }
};
var HIGH_OCCUPANCY_FEE = 21.5;
var SURCHARGES = {
  sedan: 0,
  suv: 15,
  silver_service: 11,
  six_seater: HIGH_OCCUPANCY_FEE,
  maxi_taxi: HIGH_OCCUPANCY_FEE
};
var VEHICLE_LABELS = {
  sedan: "Sedan",
  suv: "SUV",
  silver_service: "Silver Service",
  six_seater: "6 Seater People Mover",
  maxi_taxi: "Maxi Taxi"
};
var MINIMUM_FARE = 25;
var MINIMUM_FARE_DISTANCE_KM = 5;
var TOLL_SECTIONS = {
  m80: { car: 3.73, heavy: 5.6, label: "CityLink (Western Ring Rd)" },
  m2_tullamarine: { car: 3.73, heavy: 5.6, label: "CityLink (Tullamarine Fwy)" },
  domain_tunnel: { car: 2.74, heavy: 4.11, label: "CityLink (Domain Tunnel)" },
  burnley_tunnel: { car: 2.74, heavy: 4.11, label: "CityLink (Burnley Tunnel)" },
  monash_cl: { car: 3.69, heavy: 5.54, label: "CityLink (Monash Fwy)" },
  eastlink: { car: 5.04, heavy: 7.56, label: "EastLink (M3)" },
  westgate_tunnel: { car: 6.13, heavy: 9.2, label: "Westgate Tunnel" }
};
function isHoliday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if (m === 12 && (day === 25 || day === 26 || day === 31) || m === 1 && day === 1) {
    return true;
  }
  return false;
}
function determineRate(pickupDate, pickupTime) {
  if (!pickupTime) return RATES.day;
  const [hourStr, minStr] = pickupTime.split(":");
  const hour = parseInt(hourStr, 10);
  const min = parseInt(minStr || "0", 10);
  const totalMins = hour * 60 + min;
  let dayOfWeek = -1;
  if (pickupDate) {
    const parts = pickupDate.split("-").map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      dayOfWeek = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0).getDay();
    }
  }
  if (dayOfWeek === -1) {
    dayOfWeek = (/* @__PURE__ */ new Date()).getDay();
  }
  if (isHoliday(pickupDate)) {
    if (pickupDate?.endsWith("-12-31")) {
      if (totalMins >= 18 * 60) return RATES.peak;
    } else {
      return RATES.peak;
    }
  }
  const isFriNightPeak = dayOfWeek === 5 && totalMins >= 22 * 60;
  const isSatEarlyPeak = dayOfWeek === 6 && totalMins < 4 * 60;
  const isSatNightPeak = dayOfWeek === 6 && totalMins >= 22 * 60;
  const isSunEarlyPeak = dayOfWeek === 0 && totalMins < 4 * 60;
  if (isFriNightPeak || isSatEarlyPeak || isSatNightPeak || isSunEarlyPeak) {
    return RATES.peak;
  }
  if (totalMins >= 9 * 60 && totalMins < 17 * 60) {
    return RATES.day;
  }
  return RATES.overnight;
}
function calcTollCharges(vehicleType, tollRoads) {
  const isHeavy = vehicleType === "maxi_taxi";
  let total = 0;
  const used = [];
  const seen = /* @__PURE__ */ new Set();
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
function calcFare(distanceKm, vehicleType, passengers, pickupDate, pickupTime, tollRoads, trafficRatio, durationMinutes, durationInTrafficMinutes) {
  const rate = determineRate(pickupDate, pickupTime);
  const numPassengers = passengers || (vehicleType === "maxi_taxi" ? 6 : 1);
  let vehicleSurcharge = SURCHARGES[vehicleType] ?? 0;
  if (numPassengers >= 5 && vehicleSurcharge < HIGH_OCCUPANCY_FEE) {
    vehicleSurcharge = HIGH_OCCUPANCY_FEE;
  }
  const { total: tollCharges, used: usedTolls } = calcTollCharges(vehicleType, tollRoads ?? []);
  const baseDurationMins = durationMinutes || distanceKm / 50 * 60;
  const trafficDurationMins = durationInTrafficMinutes || (trafficRatio ? baseDurationMins * trafficRatio : baseDurationMins);
  const trafficDelayMins = Math.max(0, trafficDurationMins - baseDurationMins);
  const estimatedStopGoMins = Math.max(1, Math.min(baseDurationMins * 0.12, 10));
  const totalSlowMins = Math.round((estimatedStopGoMins + trafficDelayMins) * 10) / 10;
  const cruisingDistanceKm = Math.max(0.5, distanceKm);
  const flagFall = rate.flagFall;
  const distanceCharge = cruisingDistanceKm * rate.perKm;
  const timeCharge = totalSlowMins * rate.perMin;
  const cpvLevy = CPV_LEVY;
  const standardMeter = flagFall + distanceCharge + timeCharge + cpvLevy;
  const isShortTrip = distanceKm < MINIMUM_FARE_DISTANCE_KM;
  let totalFare;
  let minimumFareCharge = 0;
  if (isShortTrip || standardMeter < MINIMUM_FARE) {
    minimumFareCharge = MINIMUM_FARE;
    const baseTripFare = Math.max(standardMeter, MINIMUM_FARE);
    totalFare = baseTripFare + vehicleSurcharge + tollCharges;
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
      perMin: rate.perMin
    }
  };
}
var BOOKINGS_FILE = path.join(process.cwd(), "bookings-store.json");
function loadBookings() {
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const content = fs.readFileSync(BOOKINGS_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("Could not load bookings-store.json:", err);
  }
  return [];
}
function persistBookings(records) {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(records, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write bookings-store.json:", err);
  }
}
var internalBookingsStore = loadBookings();
function createTransporter(settings) {
  const cfg = settings || loadDispatchSettings();
  const user = cfg.emailUser || process.env.EMAIL_USER;
  const rawPass = cfg.emailPass || process.env.EMAIL_PASS;
  if (!user || !rawPass) return null;
  const pass = rawPass.replace(/\s+/g, "");
  const host = cfg.smtpHost || process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(cfg.smtpPort) || Number(process.env.SMTP_PORT) || 465;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}
function buildEmailHtml(data, bookingId, targetEmailDisplay) {
  const payLabel = data.paymentMethod === "cabcharge" ? "Cabcharge (eTicket / FASTCARD)" : data.paymentMethod === "card" ? "Credit / Debit Card (Contactless)" : "Cash (Pay Driver)";
  const vehicleLabel = VEHICLE_LABELS[data.vehicleType] || data.vehicleType;
  const targetEmail = targetEmailDisplay || TARGET_BOOKING_EMAIL;
  const cleanPhone = (data.phone || "").replace(/[^0-9+]/g, "");
  const whatsappClean = cleanPhone.startsWith("0") ? `61${cleanPhone.slice(1)}` : cleanPhone.replace(/^\+/, "");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Booking ${bookingId}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #0b0f17; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="margin:0;padding:16px 8px;background-color:#0b0f17;color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <center style="width:100%;background-color:#0b0f17;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:580px;margin:0 auto;background-color:#151c28;border:1px solid #334155;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.5);">
      
      <!-- Header Banner -->
      <tr>
        <td style="padding:24px 20px 18px;background-color:#1e293b;border-bottom:2px solid #f59e0b;text-align:center;">
          <div style="font-size:24px;line-height:30px;font-weight:800;color:#f59e0b;letter-spacing:1px;text-transform:uppercase;margin:0;">
            \u{1F696} MELBOURNE TAXIS
          </div>
          <div style="font-size:12px;line-height:16px;font-weight:700;color:#94a3b8;letter-spacing:1.5px;text-transform:uppercase;margin-top:4px;">
            NEW ONLINE BOOKING DISPATCH
          </div>
          <div style="margin-top:12px;display:inline-block;background-color:#0b0f17;border:1px solid #f59e0b;border-radius:8px;padding:8px 18px;">
            <span style="font-size:10px;line-height:14px;font-weight:600;color:#94a3b8;text-transform:uppercase;display:block;letter-spacing:1px;">Booking Reference</span>
            <span style="font-size:20px;line-height:26px;font-weight:800;color:#f59e0b;letter-spacing:1.5px;font-family:monospace;">${bookingId}</span>
          </div>
        </td>
      </tr>

      <!-- Body Padding Wrapper -->
      <tr>
        <td style="padding:20px 16px;">

          <!-- SECTION 1: PICKUP & DROPOFF ROUTE (Stacked Full Width to Prevent Data Overlap) -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:16px;background-color:#0f172a;border:1px solid #334155;border-radius:10px;overflow:hidden;">
            <tr>
              <td style="padding:14px 16px;border-bottom:1px solid #1e293b;vertical-align:top;">
                <div style="font-size:11px;line-height:16px;font-weight:700;color:#22c55e;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">
                  \u{1F7E2} PICKUP LOCATION
                </div>
                <div style="font-size:15px;line-height:22px;font-weight:700;color:#ffffff;word-break:break-word;overflow-wrap:break-word;">
                  ${data.pickupAddress}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 16px;vertical-align:top;">
                <div style="font-size:11px;line-height:16px;font-weight:700;color:#f59e0b;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">
                  \u{1F3C1} DROP-OFF DESTINATION
                </div>
                <div style="font-size:15px;line-height:22px;font-weight:700;color:#ffffff;word-break:break-word;overflow-wrap:break-word;">
                  ${data.dropoffAddress}
                </div>
              </td>
            </tr>
          </table>

          <!-- SECTION 2: SCHEDULED TIME -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:16px;background-color:#1e293b;border-left:4px solid #f59e0b;border-radius:6px;">
            <tr>
              <td style="padding:12px 16px;vertical-align:top;">
                <div style="font-size:11px;line-height:16px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">
                  \u{1F4C5} SCHEDULED PICKUP TIME
                </div>
                <div style="font-size:18px;line-height:24px;font-weight:800;color:#f59e0b;margin-top:4px;">
                  ${data.pickupDate} &nbsp;\u2022&nbsp; ${data.pickupTime}
                </div>
                ${data.isReturn ? `
                <div style="margin-top:8px;padding-top:8px;border-top:1px dashed #334155;">
                  <span style="font-size:11px;line-height:16px;font-weight:700;color:#38bdf8;text-transform:uppercase;">\u{1F504} RETURN JOURNEY:</span>
                  <span style="font-size:14px;line-height:20px;font-weight:700;color:#ffffff;margin-left:6px;">${data.returnDate} at ${data.returnTime}</span>
                </div>` : ""}
              </td>
            </tr>
          </table>

          <!-- SECTION 3: PASSENGER CONTACT INFO -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:16px;background-color:#0f172a;border:1px solid #334155;border-radius:10px;">
            <tr>
              <td style="padding:14px 16px;">
                <div style="font-size:11px;line-height:16px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">
                  \u{1F464} PASSENGER INFORMATION
                </div>
                
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding:6px 0;font-size:13px;line-height:20px;color:#94a3b8;width:115px;vertical-align:top;font-weight:600;">
                      Passenger:
                    </td>
                    <td style="padding:6px 0;font-size:15px;line-height:22px;color:#ffffff;font-weight:700;vertical-align:top;word-break:break-word;">
                      ${data.name}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;line-height:20px;color:#94a3b8;vertical-align:top;font-weight:600;">
                      Phone Number:
                    </td>
                    <td style="padding:6px 0;font-size:16px;line-height:22px;color:#38bdf8;font-weight:800;vertical-align:top;word-break:break-word;">
                      <a href="tel:${cleanPhone}" style="color:#38bdf8;text-decoration:underline;">${data.phone}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;line-height:20px;color:#94a3b8;vertical-align:top;font-weight:600;">
                      Email Address:
                    </td>
                    <td style="padding:6px 0;font-size:14px;line-height:20px;color:#e2e8f0;vertical-align:top;word-break:break-word;">
                      ${data.email ? `<a href="mailto:${data.email}" style="color:#e2e8f0;text-decoration:none;">${data.email}</a>` : '<span style="color:#64748b">Not provided</span>'}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- SECTION 4: VEHICLE & FARE BREAKDOWN -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;background-color:#0f172a;border:1px solid #334155;border-radius:10px;">
            <tr>
              <td style="padding:14px 16px;">
                <div style="font-size:11px;line-height:16px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">
                  \u{1F695} VEHICLE & FARE DETAILS
                </div>

                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding:6px 0;font-size:13px;line-height:20px;color:#94a3b8;width:115px;vertical-align:top;font-weight:600;">
                      Vehicle Type:
                    </td>
                    <td style="padding:6px 0;font-size:14px;line-height:20px;color:#ffffff;font-weight:700;vertical-align:top;">
                      ${vehicleLabel}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;line-height:20px;color:#94a3b8;vertical-align:top;font-weight:600;">
                      Passengers:
                    </td>
                    <td style="padding:6px 0;font-size:14px;line-height:20px;color:#ffffff;font-weight:700;vertical-align:top;">
                      ${data.passengers} Passenger${Number(data.passengers) > 1 ? "s" : ""}
                    </td>
                  </tr>
                  ${data.distanceKm ? `
                  <tr>
                    <td style="padding:6px 0;font-size:13px;line-height:20px;color:#94a3b8;vertical-align:top;font-weight:600;">
                      Est. Distance:
                    </td>
                    <td style="padding:6px 0;font-size:14px;line-height:20px;color:#ffffff;font-weight:700;vertical-align:top;">
                      ${Number(data.distanceKm).toFixed(1)} km
                    </td>
                  </tr>` : ""}
                  ${data.estimatedFare ? `
                  <tr>
                    <td style="padding:8px 0;font-size:13px;line-height:20px;color:#22c55e;vertical-align:middle;font-weight:700;">
                      Est. Total Fare:
                    </td>
                    <td style="padding:8px 0;font-size:20px;line-height:24px;color:#22c55e;font-weight:800;vertical-align:middle;">
                      $${Number(data.estimatedFare).toFixed(2)} AUD
                    </td>
                  </tr>` : ""}
                  <tr>
                    <td style="padding:6px 0;font-size:13px;line-height:20px;color:#94a3b8;vertical-align:top;font-weight:600;">
                      Payment Choice:
                    </td>
                    <td style="padding:6px 0;font-size:14px;line-height:20px;color:#ffffff;font-weight:700;vertical-align:top;">
                      ${payLabel}
                    </td>
                  </tr>
                  ${data.notes ? `
                  <tr>
                    <td style="padding:8px 0 0;font-size:13px;line-height:20px;color:#f59e0b;vertical-align:top;font-weight:600;">
                      Special Notes:
                    </td>
                    <td style="padding:8px 0 0;font-size:14px;line-height:22px;color:#fde68a;font-weight:600;vertical-align:top;word-break:break-word;">
                      ${data.notes}
                    </td>
                  </tr>` : ""}
                </table>
              </td>
            </tr>
          </table>

          <!-- SECTION 5: ONE-TOUCH ACTION BUTTONS (Email client safe table buttons - NO FLEXBOX) -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding-bottom:10px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="border-radius:8px;background-color:#f59e0b;padding:12px 24px;">
                      <a href="tel:${cleanPhone}" style="font-size:15px;font-weight:800;color:#000000;text-decoration:none;display:inline-block;letter-spacing:0.5px;">
                        \u{1F4DE} &nbsp; CALL PASSENGER (${data.phone})
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            ${whatsappClean ? `
            <tr>
              <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="border-radius:8px;background-color:#22c55e;padding:10px 20px;">
                      <a href="https://wa.me/${whatsappClean}" style="font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;display:inline-block;">
                        \u{1F4AC} &nbsp; WhatsApp Passenger
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>` : ""}
          </table>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:16px 20px;background-color:#0b0f17;border-top:1px solid #1e293b;text-align:center;">
          <div style="font-size:12px;line-height:18px;color:#64748b;">
            Direct First-Party Dispatch \u2022 Melbourne Taxis 24/7
          </div>
          <div style="font-size:11px;line-height:16px;color:#475569;margin-top:4px;">
            Target Dispatch: ${targetEmail}
          </div>
        </td>
      </tr>

    </table>
  </center>
</body>
</html>`;
}
function buildEmailText(data, bookingId) {
  const vehicle = VEHICLE_LABELS[data.vehicleType] || data.vehicleType;
  const payLabel = data.paymentMethod === "cabcharge" ? "Cabcharge (eTicket / FASTCARD)" : data.paymentMethod === "card" ? "Credit / Debit Card" : "Cash (Pay Driver)";
  let text2 = `========================================
`;
  text2 += `  \u{1F696} MELBOURNE TAXIS \u2014 NEW BOOKING
`;
  text2 += `========================================

`;
  text2 += `Booking Reference: ${bookingId}
`;
  text2 += `Pickup Date & Time: ${data.pickupDate} at ${data.pickupTime}
`;
  if (data.isReturn) {
    text2 += `Return Journey:     ${data.returnDate} at ${data.returnTime}
`;
  }
  text2 += `
--- ROUTE ---
`;
  text2 += `Pickup:   ${data.pickupAddress}
`;
  text2 += `Dropoff:  ${data.dropoffAddress}
`;
  text2 += `
--- PASSENGER ---
`;
  text2 += `Name:     ${data.name}
`;
  text2 += `Phone:    ${data.phone}
`;
  text2 += `Email:    ${data.email || "Not provided"}
`;
  text2 += `
--- VEHICLE & FARE ---
`;
  text2 += `Vehicle:      ${vehicle}
`;
  text2 += `Passengers:   ${data.passengers}
`;
  if (data.distanceKm) text2 += `Est Distance: ${Number(data.distanceKm).toFixed(1)} km
`;
  if (data.estimatedFare) text2 += `Est Fare:     $${Number(data.estimatedFare).toFixed(2)} AUD
`;
  text2 += `Payment:      ${payLabel}
`;
  if (data.notes) text2 += `Notes:        ${data.notes}
`;
  text2 += `
Direct Call: tel:${data.phone}
`;
  text2 += `========================================
`;
  return text2;
}
function buildWhatsAppMessage(data, bookingId) {
  const vehicle = VEHICLE_LABELS[data.vehicleType] || data.vehicleType;
  let msg = `\u{1F696} *NEW BOOKING \u2014 Melbourne Taxis*

`;
  msg += `\u{1F4CB} Booking ID: ${bookingId}
`;
  msg += `\u{1F464} Passenger: ${data.name}
`;
  msg += `\u{1F4DE} Phone: ${data.phone}
`;
  msg += `\u{1F4E7} Email: ${data.email || "N/A"}

`;
  msg += `\u{1F4CD} Pickup: ${data.pickupAddress}
`;
  msg += `\u{1F3C1} Dropoff: ${data.dropoffAddress}

`;
  msg += `\u{1F697} Vehicle: ${vehicle}
`;
  msg += `\u{1F465} Passengers: ${data.passengers}
`;
  msg += `\u{1F4C5} Date: ${data.pickupDate}
`;
  msg += `\u{1F550} Time: ${data.pickupTime}
`;
  if (data.isReturn) {
    msg += `\u{1F504} Return: ${data.returnDate} at ${data.returnTime}
`;
  }
  if (data.distanceKm) msg += `\u{1F4CF} Distance: ${Number(data.distanceKm).toFixed(1)} km
`;
  if (data.estimatedFare) msg += `\u{1F4B0} Est. Fare: $${Number(data.estimatedFare).toFixed(2)}
`;
  const payLabel = data.paymentMethod === "cabcharge" ? "Cabcharge (eTicket / FASTCARD)" : data.paymentMethod === "card" ? "Credit / Debit Card" : "Cash (Pay Driver)";
  msg += `\u{1F4B3} Payment: ${payLabel}
`;
  if (data.notes) msg += `\u{1F4DD} Notes: ${data.notes}
`;
  return msg;
}
async function dispatchBookingEmail(data, bookingId, logger) {
  const settings = loadDispatchSettings();
  const recipientList = settings.ownerEmails.split(",").map((e) => e.trim()).filter(Boolean);
  let sentViaSmtp = false;
  const transporter = createTransporter(settings);
  if (transporter && recipientList.length > 0) {
    try {
      const emailHtml = buildEmailHtml(data, bookingId, settings.ownerEmails);
      const emailText = buildEmailText(data, bookingId);
      for (const recipient of recipientList) {
        await transporter.sendMail({
          from: settings.emailUser ? `Melbourne Taxis <${settings.emailUser}>` : `Melbourne Taxis <${recipient}>`,
          to: recipient,
          subject: `\u{1F696} New Booking ${bookingId} \u2014 ${data.name} \u2014 ${data.pickupDate} ${data.pickupTime}`,
          text: emailText,
          html: emailHtml
        });
        logger.info({ bookingId, recipient }, "Booking email sent directly via first-party SMTP to " + recipient);
      }
      sentViaSmtp = true;
      if (data.email) {
        await transporter.sendMail({
          from: settings.emailUser ? `Melbourne Taxis <${settings.emailUser}>` : `Melbourne Taxis <${recipientList[0]}>`,
          to: data.email,
          subject: `Your Melbourne Taxi booking is received \u2014 ${bookingId}`,
          text: emailText.replace("NEW BOOKING DISPATCH", "BOOKING CONFIRMATION"),
          html: emailHtml.replace(
            "NEW ONLINE BOOKING DISPATCH",
            "BOOKING CONFIRMATION & DETAILS"
          )
        }).catch((e) => logger.warn({ e: e.message }, "Customer confirmation email error"));
      }
    } catch (smtpErr) {
      logger.error({ err: smtpErr.message, bookingId }, "First-party SMTP delivery failed");
    }
  } else {
    logger.info({ bookingId, recipients: recipientList }, "Booking saved directly in server store and visible in live owner dashboard.");
  }
  return { sentViaSmtp, recipients: recipientList };
}
router2.get("/", (_req, res) => {
  res.json({
    success: true,
    count: internalBookingsStore.length,
    bookings: internalBookingsStore
  });
});
router2.post("/", async (req, res) => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid booking data: " + parsed.error.message });
    return;
  }
  const data = parsed.data;
  const bookingId = `BMT-${Date.now().toString(36).toUpperCase()}`;
  const bookingRecord = {
    bookingId,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    name: data.name,
    phone: data.phone,
    email: data.email,
    pickupAddress: data.pickupAddress,
    dropoffAddress: data.dropoffAddress,
    pickupDate: data.pickupDate,
    pickupTime: data.pickupTime,
    isReturn: data.isReturn,
    returnDate: data.returnDate,
    returnTime: data.returnTime,
    vehicleType: data.vehicleType,
    passengers: data.passengers,
    distanceKm: data.distanceKm,
    estimatedFare: data.estimatedFare,
    paymentMethod: data.paymentMethod,
    notes: data.notes,
    status: "dispatched"
  };
  internalBookingsStore.unshift(bookingRecord);
  persistBookings(internalBookingsStore);
  req.log.info({ bookingId, name: data.name, vehicleType: data.vehicleType }, "New booking received and stored internally");
  const settings = loadDispatchSettings();
  const phone = settings.dispatchPhone || PHONE;
  const waNum = settings.whatsappNumber || WHATSAPP_NUMBER;
  const whatsappMsg = buildWhatsAppMessage(data, bookingId);
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(whatsappMsg)}`;
  const emailResult = await dispatchBookingEmail(data, bookingId, req.log);
  res.json({
    success: true,
    message: `Booking ${bookingId} received directly by our dispatch system. We will contact you shortly. For immediate service call ${phone}.`,
    bookingId,
    targetEmail: settings.ownerEmails,
    whatsappUrl: waUrl,
    storedInternally: true,
    emailDispatched: emailResult.sentViaSmtp
  });
});
router2.get("/settings", (_req, res) => {
  const settings = loadDispatchSettings();
  res.json({
    success: true,
    settings: {
      ownerEmails: settings.ownerEmails,
      dispatchPhone: settings.dispatchPhone,
      whatsappNumber: settings.whatsappNumber,
      emailUser: settings.emailUser,
      hasEmailPass: Boolean(settings.emailPass),
      smtpHost: settings.smtpHost,
      smtpPort: settings.smtpPort,
      updatedAt: settings.updatedAt
    }
  });
});
router2.post("/settings", (req, res) => {
  const { ownerEmails, dispatchPhone, whatsappNumber, emailUser, emailPass, smtpHost, smtpPort } = req.body || {};
  const updated = saveDispatchSettings({
    ...ownerEmails ? { ownerEmails: String(ownerEmails).trim() } : {},
    ...dispatchPhone ? { dispatchPhone: String(dispatchPhone).trim() } : {},
    ...whatsappNumber ? { whatsappNumber: String(whatsappNumber).trim() } : {},
    ...emailUser ? { emailUser: String(emailUser).trim() } : {},
    ...emailPass !== void 0 ? { emailPass: String(emailPass).trim() } : {},
    ...smtpHost ? { smtpHost: String(smtpHost).trim() } : {},
    ...smtpPort ? { smtpPort: Number(smtpPort) } : {}
  });
  res.json({
    success: true,
    message: "Dispatch settings saved to file successfully",
    settings: {
      ownerEmails: updated.ownerEmails,
      dispatchPhone: updated.dispatchPhone,
      whatsappNumber: updated.whatsappNumber,
      emailUser: updated.emailUser,
      hasEmailPass: Boolean(updated.emailPass),
      smtpHost: updated.smtpHost,
      smtpPort: updated.smtpPort,
      updatedAt: updated.updatedAt
    }
  });
});
router2.post("/test-email", async (req, res) => {
  const settings = loadDispatchSettings();
  const transporter = createTransporter(settings);
  if (!transporter) {
    return res.status(400).json({
      success: false,
      error: "SMTP credentials not configured. Please supply emailUser and emailPass."
    });
  }
  const recipientList = settings.ownerEmails.split(",").map((e) => e.trim()).filter(Boolean);
  try {
    await transporter.verify();
    const fromAddress = settings.emailUser ? `Melbourne Taxis <${settings.emailUser}>` : recipientList[0];
    const targetEmail = recipientList[0] || "p2839582@gmail.com";
    await transporter.sendMail({
      from: fromAddress,
      to: targetEmail,
      subject: "\u{1F696} Melbourne Taxis \u2014 Dispatch SMTP Connected Successfully!",
      html: `
        <div style="font-family:Arial,sans-serif;background:#111;color:#fff;padding:24px;border-radius:10px;border:2px solid #f97316;max-width:550px">
          <h2 style="color:#f97316;margin-top:0">\u{1F696} Dispatch System Online</h2>
          <p>This confirms that your Google App Password for <strong>${settings.emailUser}</strong> is verified and working!</p>
          <p>Every time a customer submits a booking online, full details will be dispatched immediately to:</p>
          <p style="background:#222;padding:10px;border-radius:6px;font-family:monospace;color:#f97316">${settings.ownerEmails}</p>
          <p style="color:#888;font-size:12px">Sent via direct first-party TLS SMTP (${settings.smtpHost}:${settings.smtpPort})</p>
        </div>
      `
    });
    req.log?.info({ target: targetEmail }, "Test dispatch email sent successfully via SMTP");
    res.json({
      success: true,
      message: `Test email sent successfully to ${targetEmail}! Check your inbox.`
    });
  } catch (err) {
    req.log?.error({ err: err.message }, "SMTP Verification failed");
    res.status(500).json({
      success: false,
      error: `SMTP Error: ${err.message}`
    });
  }
});
router2.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const valid = ["dispatched", "confirmed", "completed", "cancelled"];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const booking = internalBookingsStore.find((b) => b.bookingId === id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  booking.status = status;
  persistBookings(internalBookingsStore);
  res.json({ success: true, booking });
});
router2.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = internalBookingsStore.findIndex((b) => b.bookingId === id);
  if (index === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }
  const [removed] = internalBookingsStore.splice(index, 1);
  persistBookings(internalBookingsStore);
  res.json({ success: true, removed });
});
router2.post("/estimate", (req, res) => {
  const parsed = EstimateFareBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { distanceKm, vehicleType, pickupDate, pickupTime, tollRoads, trafficRatio } = parsed.data;
  const rawBody = req.body || {};
  const passengers = typeof rawBody.passengers === "number" ? rawBody.passengers : void 0;
  const durationMinutes = typeof rawBody.durationMinutes === "number" ? rawBody.durationMinutes : void 0;
  const durationInTrafficMinutes = typeof rawBody.durationInTrafficMinutes === "number" ? rawBody.durationInTrafficMinutes : void 0;
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
    distanceKm
  });
});
var bookings_default = router2;

// artifacts/api-server/src/routes/visitors.ts
import { Router as Router3 } from "express";

// lib/db/src/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// lib/db/src/schema/index.ts
var schema_exports = {};
__export(schema_exports, {
  visitorLogsTable: () => visitorLogsTable
});

// lib/db/src/schema/visitors.ts
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
var visitorLogsTable = pgTable("visitor_logs", {
  id: serial("id").primaryKey(),
  ip: text("ip").notNull(),
  page: text("page").notNull().default("/"),
  referrer: text("referrer").notNull().default(""),
  userAgent: text("user_agent").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

// lib/db/src/index.ts
var { Pool } = pg;
var pool = null;
var db = null;
if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool, { schema: schema_exports });
  } catch (e) {
    console.warn("[Database] Connection failed, using in-memory mock fallback:", e);
  }
} else {
  console.info("[Database] DATABASE_URL not set \u2014 using in-memory fallback for logs");
}
var inMemoryLogs = [];
var logIdCounter = 1;
if (!db) {
  db = {
    insert: (_table) => ({
      values: async (data) => {
        inMemoryLogs.unshift({
          id: logIdCounter++,
          ip: data.ip || "unknown",
          page: data.page || "/",
          referrer: data.referrer || "",
          userAgent: data.userAgent || "",
          createdAt: /* @__PURE__ */ new Date()
        });
        return [{ id: logIdCounter - 1 }];
      }
    }),
    select: (fields) => {
      const queryObj = {
        from: (_table) => {
          const chain = {
            orderBy: () => chain,
            limit: (n) => {
              chain._limit = n;
              return chain;
            },
            offset: (o) => {
              chain._offset = o;
              return chain;
            },
            groupBy: () => chain,
            then: (resolve) => {
              if (fields && fields.total !== void 0) {
                return Promise.resolve([{ total: inMemoryLogs.length }]).then(resolve);
              }
              if (fields && fields.uniqueIps !== void 0) {
                const unique = new Set(inMemoryLogs.map((l) => l.ip)).size;
                return Promise.resolve([{ uniqueIps: unique }]).then(resolve);
              }
              if (fields && fields.visits !== void 0) {
                const counts = {};
                for (const log of inMemoryLogs) {
                  counts[log.page] = (counts[log.page] || 0) + 1;
                }
                const top = Object.entries(counts).map(([page, visits]) => ({ page, visits })).sort((a, b) => b.visits - a.visits).slice(0, 10);
                return Promise.resolve(top).then(resolve);
              }
              const offset = chain._offset || 0;
              const limit = chain._limit || 50;
              const slice = inMemoryLogs.slice(offset, offset + limit);
              return Promise.resolve(slice).then(resolve);
            }
          };
          return chain;
        }
      };
      return queryObj;
    }
  };
}

// artifacts/api-server/src/routes/visitors.ts
import { desc, count, sql } from "drizzle-orm";
var router3 = Router3();
var ADMIN_SECRET = process.env.VISITOR_SECRET || "bmt-admin-2024";
function getClientIp(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
}
router3.post("/track", async (req, res) => {
  const ip = getClientIp(req);
  const { page = "/", referrer = "", userAgent = "" } = req.body || {};
  try {
    await db.insert(visitorLogsTable).values({
      ip,
      page: String(page).substring(0, 500),
      referrer: String(referrer).substring(0, 500),
      userAgent: String(userAgent).substring(0, 500)
    });
    req.log.info({ ip, page }, "Visitor tracked");
  } catch (err) {
    req.log.error({ err }, "Failed to save visitor log");
  }
  res.json({ success: true });
});
router3.get("/", async (req, res) => {
  const secret = req.query.secret;
  if (secret !== ADMIN_SECRET) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(200, parseInt(req.query.limit) || 50);
  const offset = (page - 1) * limit;
  try {
    const [rows, [{ total }]] = await Promise.all([
      db.select().from(visitorLogsTable).orderBy(desc(visitorLogsTable.createdAt)).limit(limit).offset(offset),
      db.select({ total: count() }).from(visitorLogsTable)
    ]);
    const [{ uniqueIps }] = await db.select({ uniqueIps: sql`count(distinct ip)` }).from(visitorLogsTable);
    const topPages = await db.select({ page: visitorLogsTable.page, visits: count() }).from(visitorLogsTable).groupBy(visitorLogsTable.page).orderBy(desc(count())).limit(10);
    res.json({
      total,
      uniqueIps,
      page,
      limit,
      topPages,
      visitors: rows.map((r) => ({
        id: r.id,
        ip: r.ip,
        page: r.page,
        referrer: r.referrer,
        userAgent: r.userAgent,
        timestamp: r.createdAt
      }))
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch visitor logs");
    res.status(500).json({ error: "Database error" });
  }
});
var visitors_default = router3;

// artifacts/api-server/src/routes/routes.ts
import { Router as Router4 } from "express";
var router4 = Router4();
var GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyAdFaQS_OS7xD6QkUcvQvCFMIE2UvwG0PQ";
function parseDurationSeconds(durationStr) {
  if (!durationStr) return 0;
  const match = durationStr.match(/^(\d+(?:\.\d+)?)s$/);
  if (match) {
    return Math.round(parseFloat(match[1]));
  }
  return 0;
}
function detectTollsFromText(text2) {
  const found = /* @__PURE__ */ new Set();
  const allText = text2.toLowerCase();
  if (allText.includes("western ring") || allText.includes("m80")) found.add("m80");
  if (allText.includes("tullamarine") || allText.includes("airport") || allText.includes("m2")) found.add("m2_tullamarine");
  if (allText.includes("domain tunnel") || allText.includes("burnley") || allText.includes("citylink") || allText.includes("cbd")) {
    found.add("domain_tunnel");
  }
  if (allText.includes("eastlink") || allText.includes("m3") || allText.includes("dandenong")) found.add("eastlink");
  if (allText.includes("westgate") || allText.includes("west gate")) found.add("westgate_tunnel");
  return Array.from(found);
}
router4.post("/compute", async (req, res) => {
  const body = req.body;
  const { origin, destination, pickupDate, pickupTime } = body;
  if (!origin || !destination) {
    res.status(400).json({ error: "origin and destination are required" });
    return;
  }
  const apiKey = GOOGLE_API_KEY;
  if (apiKey) {
    try {
      let departureTimeIso = void 0;
      if (pickupDate && pickupTime) {
        const plannedTime = /* @__PURE__ */ new Date(`${pickupDate}T${pickupTime}`);
        if (!isNaN(plannedTime.getTime()) && plannedTime.getTime() > Date.now() + 6e4) {
          departureTimeIso = plannedTime.toISOString();
        }
      }
      const originObj = typeof origin === "string" ? { address: origin } : { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } };
      const destObj = typeof destination === "string" ? { address: destination } : { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } };
      const gmpRequest = {
        origin: originObj,
        destination: destObj,
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE_OPTIMAL",
        extraComputations: ["TOLLS"]
      };
      if (departureTimeIso) {
        gmpRequest.departureTime = departureTimeIso;
      }
      const gmpResponse = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "routes.duration,routes.staticDuration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.viewport,routes.travelAdvisory.tollInfo,routes.legs"
        },
        body: JSON.stringify(gmpRequest)
      });
      if (gmpResponse.ok) {
        const gmpData = await gmpResponse.json();
        const route = gmpData.routes?.[0];
        if (route) {
          const distanceMeters = route.distanceMeters ?? 0;
          const distanceKm = Math.round(distanceMeters / 1e3 * 10) / 10;
          const durationSeconds = parseDurationSeconds(route.duration);
          const staticDurationSeconds = parseDurationSeconds(route.staticDuration) || durationSeconds;
          const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));
          const staticDurationMinutes = Math.max(1, Math.round(staticDurationSeconds / 60));
          const trafficDelayMinutes = Math.max(0, durationMinutes - staticDurationMinutes);
          const trafficRatio = staticDurationMinutes > 0 ? durationMinutes / staticDurationMinutes : 1;
          const trafficLevel = trafficDelayMinutes > 8 ? "Heavy Congestion" : trafficDelayMinutes > 2 ? "Moderate Traffic" : "Normal Flow";
          const detectedTolls = /* @__PURE__ */ new Set();
          if (route.travelAdvisory?.tollInfo?.estimatedPrice?.length) {
            detectedTolls.add("m80");
          }
          const legsSummary = (route.legs || []).map((leg) => (leg.steps || []).map((s) => s.navigationInstruction?.maneuver || "").join(" ")).join(" ");
          detectTollsFromText(legsSummary).forEach((t) => detectedTolls.add(t));
          res.json({
            source: "google_routes_api",
            distanceKm,
            distanceMeters,
            durationMinutes,
            staticDurationMinutes,
            trafficDelayMinutes,
            trafficRatio: Math.round(trafficRatio * 100) / 100,
            trafficLevel,
            encodedPolyline: route.polyline?.encodedPolyline || "",
            viewport: route.viewport || null,
            tollRoads: Array.from(detectedTolls)
          });
          return;
        }
      } else {
        const errText = await gmpResponse.text();
        console.warn("[Google Routes API returned non-200]:", gmpResponse.status, errText);
      }
    } catch (err) {
      console.error("[Google Routes API error, falling back]:", err);
    }
  }
  if (typeof origin !== "string" && typeof destination !== "string") {
    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=polyline`;
      const osrmRes = await fetch(osrmUrl);
      if (osrmRes.ok) {
        const osrmData = await osrmRes.json();
        if (osrmData.routes?.[0]) {
          const r = osrmData.routes[0];
          const distanceKm2 = Math.round(r.distance / 1e3 * 10) / 10;
          const durMins = Math.max(1, Math.round(r.duration / 60));
          res.json({
            source: "fallback_routing",
            distanceKm: distanceKm2,
            distanceMeters: r.distance,
            durationMinutes: durMins,
            staticDurationMinutes: durMins,
            trafficDelayMinutes: 0,
            trafficRatio: 1,
            trafficLevel: "Normal Flow",
            encodedPolyline: r.geometry || "",
            tollRoads: detectTollsFromText("")
          });
          return;
        }
      }
    } catch {
    }
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLng = (destination.lng - origin.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(6371 * c * 1.28 * 10) / 10;
    const durationMinutes = Math.max(1, Math.round(distanceKm / 50 * 60));
    res.json({
      source: "haversine_estimate",
      distanceKm,
      distanceMeters: distanceKm * 1e3,
      durationMinutes,
      staticDurationMinutes: durationMinutes,
      trafficDelayMinutes: 0,
      trafficRatio: 1,
      trafficLevel: "Normal Flow",
      encodedPolyline: "",
      tollRoads: []
    });
    return;
  }
  res.json({
    source: "default_metro_estimate",
    distanceKm: 25,
    distanceMeters: 25e3,
    durationMinutes: 30,
    staticDurationMinutes: 30,
    trafficDelayMinutes: 0,
    trafficRatio: 1,
    trafficLevel: "Normal Flow",
    encodedPolyline: "",
    tollRoads: []
  });
});
router4.get("/geocode", async (req, res) => {
  const address = (req.query.address || "").trim();
  if (!address) {
    res.status(400).json({ error: "address is required" });
    return;
  }
  try {
    const pRes = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&lat=-37.8136&lon=144.9631&limit=1`);
    if (pRes.ok) {
      const pData = await pRes.json();
      const coords = pData.features?.[0]?.geometry?.coordinates;
      if (Array.isArray(coords)) {
        res.json({ success: true, coords: { lat: coords[1], lng: coords[0] } });
        return;
      }
    }
  } catch (err) {
    console.warn("[Photon geocode notice]:", err);
  }
  try {
    const nRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ", Victoria, Australia")}&format=json&limit=1`, {
      headers: { "User-Agent": "BacchusMarshTaxi/1.0" }
    });
    if (nRes.ok) {
      const nData = await nRes.json();
      if (Array.isArray(nData) && nData[0]) {
        res.json({
          success: true,
          coords: { lat: parseFloat(nData[0].lat), lng: parseFloat(nData[0].lon) }
        });
        return;
      }
    }
  } catch (err) {
    console.warn("[Nominatim geocode notice]:", err);
  }
  res.status(404).json({ error: "Location not found" });
});
router4.get("/places-autocomplete", async (req, res) => {
  const input = (req.query.input || "").trim();
  if (!input || input.length < 2) {
    res.json({ suggestions: [] });
    return;
  }
  const apiKey = GOOGLE_API_KEY;
  if (apiKey) {
    try {
      const gRes = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey
        },
        body: JSON.stringify({
          input,
          includedRegionCodes: ["au"],
          locationBias: {
            circle: {
              center: { latitude: -37.8136, longitude: 144.9631 },
              radius: 5e4
            }
          }
        })
      });
      if (gRes.ok) {
        const gData = await gRes.json();
        if (Array.isArray(gData.suggestions) && gData.suggestions.length > 0) {
          const suggestions = gData.suggestions.map((s) => {
            const pred = s.placePrediction || {};
            const sf = pred.structuredFormat || {};
            return {
              id: pred.placeId || pred.place || Math.random().toString(),
              placeId: pred.placeId,
              mainText: sf.mainText?.text || pred.text?.text || input,
              secondaryText: sf.secondaryText?.text || "",
              fullText: pred.text?.text || sf.mainText?.text || input
            };
          });
          res.json({ suggestions, source: "google_places_new" });
          return;
        }
      }
    } catch (gErr) {
      console.warn("[Places autocomplete notice, falling back to Photon]:", gErr);
    }
  }
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&lat=-37.8136&lon=144.9631&limit=6`;
    const pRes = await fetch(photonUrl);
    if (pRes.ok) {
      const pData = await pRes.json();
      if (Array.isArray(pData.features) && pData.features.length > 0) {
        const suggestions = pData.features.filter((f) => {
          const country = (f.properties?.country || "").toLowerCase();
          return !country || country.includes("aust") || country === "au";
        }).map((f, idx) => {
          const p = f.properties || {};
          const name = p.name || p.street || "";
          const street = p.street ? p.housenumber ? `${p.housenumber} ${p.street}` : p.street : "";
          const mainText = name || street || input;
          const suburb = p.district || p.suburb || p.city || p.town || "";
          const state = p.state === "Victoria" ? "VIC" : p.state || "VIC";
          const postcode = p.postcode ? ` ${p.postcode}` : "";
          const secParts = [suburb, state + postcode, "Australia"].filter(Boolean);
          const secondaryText = secParts.join(", ");
          const fullText = `${mainText}, ${secondaryText}`;
          const coords = Array.isArray(f.geometry?.coordinates) ? { lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] } : null;
          return {
            id: `photon-${idx}-${p.osm_id || Math.random()}`,
            mainText,
            secondaryText,
            fullText,
            coords
          };
        });
        if (suggestions.length > 0) {
          res.json({ suggestions, source: "photon" });
          return;
        }
      }
    }
  } catch (pErr) {
    console.warn("[Photon autocomplete notice]:", pErr);
  }
  res.json({ suggestions: [] });
});
router4.get("/place-details", async (req, res) => {
  const placeId = req.query.placeId;
  if (!placeId) {
    res.status(400).json({ error: "placeId is required" });
    return;
  }
  const apiKey = GOOGLE_API_KEY;
  if (apiKey) {
    try {
      const gRes = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "id,displayName,formattedAddress,location"
        }
      });
      if (gRes.ok) {
        const data = await gRes.json();
        res.json({
          success: true,
          formattedAddress: data.formattedAddress || data.displayName?.text || "",
          displayName: data.displayName?.text || "",
          coords: data.location ? { lat: data.location.latitude, lng: data.location.longitude } : null
        });
        return;
      }
    } catch (err) {
      console.warn("[Place details error]:", err);
    }
  }
  res.status(404).json({ error: "Place not found" });
});
router4.get("/reverse-geocode", async (req, res) => {
  const latStr = req.query.lat;
  const lngStr = req.query.lng;
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  if (isNaN(lat) || isNaN(lng)) {
    res.status(400).json({ error: "Valid lat and lng query parameters are required" });
    return;
  }
  try {
    const photonUrl = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`;
    const pRes = await fetch(photonUrl);
    if (pRes.ok) {
      const pData = await pRes.json();
      const feature = pData?.features?.[0]?.properties;
      if (feature) {
        const houseNo = feature.housenumber || "";
        const street = feature.street || "";
        const name = feature.name && feature.name !== street ? feature.name : "";
        const suburb = feature.district || feature.suburb || feature.city || feature.town || "";
        const state = feature.state === "Victoria" ? "VIC" : feature.state || "VIC";
        const postcode = feature.postcode || "";
        let formatted = "";
        if (name && street && street !== name) {
          formatted = `${name}, ${houseNo ? houseNo + " " : ""}${street}, ${suburb} ${state}${postcode ? " " + postcode : ""}`.trim();
        } else if (street && suburb) {
          formatted = `${houseNo ? houseNo + " " : ""}${street}, ${suburb} ${state}${postcode ? " " + postcode : ""}`.trim();
        } else if (street) {
          formatted = `${houseNo ? houseNo + " " : ""}${street}, ${state}${postcode ? " " + postcode : ""}`.trim();
        } else if (name && suburb) {
          formatted = `${name}, ${suburb} ${state}${postcode ? " " + postcode : ""}`.trim();
        }
        if (formatted && houseNo && street) {
          res.json({
            success: true,
            address: formatted,
            lat,
            lng,
            source: "photon_pinpoint",
            houseNumber: houseNo,
            street,
            suburb: suburb || null
          });
          return;
        }
      }
    }
  } catch (pErr) {
    console.warn("[Photon reverse geocode notice]:", pErr);
  }
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`;
    const osmRes = await fetch(osmUrl, {
      headers: {
        "User-Agent": "BacchusMarshTaxiApp/1.0 (info@bacchusmarshtaxi.com.au)",
        "Accept": "application/json"
      }
    });
    if (osmRes.ok) {
      const osmData = await osmRes.json();
      const addr = osmData.address || {};
      const houseNumber = addr.house_number || "";
      const road = addr.road || addr.street || addr.footway || addr.path || addr.pedestrian || addr.highway || "";
      const suburb = addr.suburb || addr.neighbourhood || addr.quarter || addr.town || addr.city || addr.village || addr.hamlet || "";
      const state = addr.state === "Victoria" ? "VIC" : addr.state || "VIC";
      const postcode = addr.postcode || "";
      let formatted = "";
      if (road && suburb) {
        formatted = `${houseNumber ? houseNumber + " " : ""}${road}, ${suburb} ${state}${postcode ? " " + postcode : ""}`.trim();
      } else if (road) {
        formatted = `${houseNumber ? houseNumber + " " : ""}${road}, ${state}${postcode ? " " + postcode : ""}`.trim();
      } else if (suburb) {
        formatted = `${suburb} ${state}${postcode ? " " + postcode : ""}`.trim();
      } else if (osmData.display_name) {
        const parts = osmData.display_name.split(", ");
        formatted = parts.slice(0, 4).join(", ");
      }
      if (formatted && (houseNumber || road)) {
        res.json({
          success: true,
          address: formatted,
          displayName: osmData.display_name,
          lat,
          lng,
          source: "nominatim"
        });
        return;
      }
    }
  } catch (err) {
    console.warn("[Nominatim reverse geocode notice]:", err);
  }
  const apiKey = GOOGLE_API_KEY;
  if (apiKey) {
    try {
      const gUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
      const gRes = await fetch(gUrl);
      if (gRes.ok) {
        const gData = await gRes.json();
        if (gData.status === "OK" && gData.results?.[0]?.formatted_address) {
          res.json({
            success: true,
            address: gData.results[0].formatted_address,
            lat,
            lng,
            source: "google_geocoding"
          });
          return;
        }
      }
    } catch (err) {
      console.warn("[Google Geocoding API notice, falling back]:", err);
    }
  }
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const bdcRes = await fetch(bdcUrl);
    if (bdcRes.ok) {
      const bdcData = await bdcRes.json();
      const suburb = bdcData.locality || bdcData.city || "";
      const state = bdcData.principalSubdivision === "Victoria" ? "VIC" : bdcData.principalSubdivision || "VIC";
      const postcode = bdcData.postcode || "";
      const formatted = `${suburb ? suburb + ", " : ""}${state}${postcode ? " " + postcode : ""}`.trim();
      if (formatted) {
        res.json({
          success: true,
          address: formatted,
          lat,
          lng,
          source: "bigdatacloud"
        });
        return;
      }
    }
  } catch (err) {
    console.warn("[BigDataCloud reverse geocode notice]:", err);
  }
  res.json({
    success: true,
    address: "Bacchus Marsh VIC 3340",
    lat,
    lng,
    source: "default_fallback"
  });
});
var routes_default = router4;

// artifacts/api-server/src/routes/index.ts
var router5 = Router5();
router5.use(health_default);
router5.use("/bookings", bookings_default);
router5.use("/visitors", visitors_default);
router5.use("/routes", routes_default);
var routes_default2 = router5;

// server.ts
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
var isProduction = process.env.NODE_ENV === "production" || !process.argv[1]?.endsWith("server.ts");
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _res, next) => {
  req.log = {
    info: (...args) => console.log("[INFO]", ...args),
    warn: (...args) => console.warn("[WARN]", ...args),
    error: (...args) => console.error("[ERROR]", ...args)
  };
  next();
});
app.get(["/api/health", "/healthz", "/_health"], (_req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/api", routes_default2);
async function start() {
  if (!isProduction) {
    const vite = await createViteServer({
      configFile: path2.resolve(process.cwd(), "vite.config.ts"),
      server: { middlewareMode: true, host: "0.0.0.0", port: PORT },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path2.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use((_req, res) => {
      res.sendFile(path2.join(distPath, "index.html"));
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
