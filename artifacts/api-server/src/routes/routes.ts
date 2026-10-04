import { Router, type Request, type Response } from "express";

const router = Router();

const GOOGLE_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY ||
  process.env.VITE_GOOGLE_MAPS_API_KEY ||
  "AIzaSyAdFaQS_OS7xD6QkUcvQvCFMIE2UvwG0PQ";

interface LatLng {
  lat: number;
  lng: number;
}

interface ComputeRouteRequestBody {
  origin: LatLng | string;
  destination: LatLng | string;
  pickupDate?: string;
  pickupTime?: string;
}

// Toll section rates and labels in Victoria
const TOLL_SECTIONS: Record<string, { car: number; heavy: number; label: string }> = {
  m80: { car: 3.73, heavy: 5.60, label: "CityLink (Western Ring Rd)" },
  m2_tullamarine: { car: 3.73, heavy: 5.60, label: "CityLink (Tullamarine Fwy)" },
  domain_tunnel: { car: 2.74, heavy: 4.11, label: "CityLink (Domain Tunnel)" },
  burnley_tunnel: { car: 2.74, heavy: 4.11, label: "CityLink (Burnley Tunnel)" },
  monash_cl: { car: 3.69, heavy: 5.54, label: "CityLink (Monash Fwy)" },
  eastlink: { car: 5.04, heavy: 7.56, label: "EastLink (M3)" },
  westgate_tunnel: { car: 6.13, heavy: 9.20, label: "Westgate Tunnel" },
};

function parseDurationSeconds(durationStr?: string): number {
  if (!durationStr) return 0;
  // Format is typically "1234s"
  const match = durationStr.match(/^(\d+(?:\.\d+)?)s$/);
  if (match) {
    return Math.round(parseFloat(match[1]));
  }
  return 0;
}

function detectTollsFromText(text: string): string[] {
  const found = new Set<string>();
  const allText = text.toLowerCase();
  if (allText.includes("western ring") || allText.includes("m80")) found.add("m80");
  if (allText.includes("tullamarine") || allText.includes("airport") || allText.includes("m2")) found.add("m2_tullamarine");
  if (allText.includes("domain tunnel") || allText.includes("burnley") || allText.includes("citylink") || allText.includes("cbd")) {
    found.add("domain_tunnel");
  }
  if (allText.includes("eastlink") || allText.includes("m3") || allText.includes("dandenong")) found.add("eastlink");
  if (allText.includes("westgate") || allText.includes("west gate")) found.add("westgate_tunnel");
  return Array.from(found);
}

// Compute live traffic routes via Google Maps Platform Routes API
router.post("/compute", async (req: Request, res: Response) => {
  const body = req.body as ComputeRouteRequestBody;
  const { origin, destination, pickupDate, pickupTime } = body;

  if (!origin || !destination) {
    res.status(400).json({ error: "origin and destination are required" });
    return;
  }

  const apiKey = GOOGLE_API_KEY;

  if (apiKey) {
    try {
      let departureTimeIso: string | undefined = undefined;
      if (pickupDate && pickupTime) {
        const plannedTime = new Date(`${pickupDate}T${pickupTime}`);
        if (!isNaN(plannedTime.getTime()) && plannedTime.getTime() > Date.now() + 60000) {
          departureTimeIso = plannedTime.toISOString();
        }
      }

      const originObj =
        typeof origin === "string"
          ? { address: origin }
          : { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } };

      const destObj =
        typeof destination === "string"
          ? { address: destination }
          : { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } };

      const gmpRequest: Record<string, any> = {
        origin: originObj,
        destination: destObj,
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE_OPTIMAL",
        extraComputations: ["TOLLS"],
      };

      if (departureTimeIso) {
        gmpRequest.departureTime = departureTimeIso;
      }

      const gmpResponse = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "routes.duration,routes.staticDuration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.viewport,routes.travelAdvisory.tollInfo,routes.legs",
        },
        body: JSON.stringify(gmpRequest),
      });

      if (gmpResponse.ok) {
        const gmpData = await gmpResponse.json();
        const route = gmpData.routes?.[0];

        if (route) {
          const distanceMeters = route.distanceMeters ?? 0;
          const distanceKm = Math.round((distanceMeters / 1000) * 10) / 10;

          const durationSeconds = parseDurationSeconds(route.duration);
          const staticDurationSeconds = parseDurationSeconds(route.staticDuration) || durationSeconds;

          const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));
          const staticDurationMinutes = Math.max(1, Math.round(staticDurationSeconds / 60));

          const trafficDelayMinutes = Math.max(0, durationMinutes - staticDurationMinutes);
          const trafficRatio = staticDurationMinutes > 0 ? durationMinutes / staticDurationMinutes : 1.0;

          const trafficLevel =
            trafficDelayMinutes > 8
              ? "Heavy Congestion"
              : trafficDelayMinutes > 2
              ? "Moderate Traffic"
              : "Normal Flow";

          // Toll analysis
          const detectedTolls = new Set<string>();
          if (route.travelAdvisory?.tollInfo?.estimatedPrice?.length) {
            detectedTolls.add("m80");
          }
          // Also inspect leg description
          const legsSummary = (route.legs || [])
            .map((leg: any) => (leg.steps || []).map((s: any) => s.navigationInstruction?.maneuver || "").join(" "))
            .join(" ");
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
            tollRoads: Array.from(detectedTolls),
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

  // Graceful fallback if Google API request fails or coords only
  if (typeof origin !== "string" && typeof destination !== "string") {
    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=polyline`;
      const osrmRes = await fetch(osrmUrl);
      if (osrmRes.ok) {
        const osrmData = await osrmRes.json();
        if (osrmData.routes?.[0]) {
          const r = osrmData.routes[0];
          const distanceKm = Math.round((r.distance / 1000) * 10) / 10;
          const durMins = Math.max(1, Math.round(r.duration / 60));
          res.json({
            source: "fallback_routing",
            distanceKm,
            distanceMeters: r.distance,
            durationMinutes: durMins,
            staticDurationMinutes: durMins,
            trafficDelayMinutes: 0,
            trafficRatio: 1.0,
            trafficLevel: "Normal Flow",
            encodedPolyline: r.geometry || "",
            tollRoads: detectTollsFromText(""),
          });
          return;
        }
      }
    } catch {
      // ignore
    }

    // Mathematical Haversine estimate
    const dLat = ((destination.lat - origin.lat) * Math.PI) / 180;
    const dLng = ((destination.lng - origin.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((origin.lat * Math.PI) / 180) *
        Math.cos((destination.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(6371 * c * 1.28 * 10) / 10;
    const durationMinutes = Math.max(1, Math.round((distanceKm / 50) * 60));

    res.json({
      source: "haversine_estimate",
      distanceKm,
      distanceMeters: distanceKm * 1000,
      durationMinutes,
      staticDurationMinutes: durationMinutes,
      trafficDelayMinutes: 0,
      trafficRatio: 1.0,
      trafficLevel: "Normal Flow",
      encodedPolyline: "",
      tollRoads: [],
    });
    return;
  }

  // Fallback default response for Melbourne metro area
  res.json({
    source: "default_metro_estimate",
    distanceKm: 25.0,
    distanceMeters: 25000,
    durationMinutes: 30,
    staticDurationMinutes: 30,
    trafficDelayMinutes: 0,
    trafficRatio: 1.0,
    trafficLevel: "Normal Flow",
    encodedPolyline: "",
    tollRoads: [],
  });
});

// Forward geocoding endpoint: converts address text to coordinates
router.get("/geocode", async (req: Request, res: Response) => {
  const address = ((req.query.address as string) || "").trim();
  if (!address) {
    res.status(400).json({ error: "address is required" });
    return;
  }

  // 1. Photon geocoding
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

  // 2. Nominatim fallback
  try {
    const nRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ", Victoria, Australia")}&format=json&limit=1`, {
      headers: { "User-Agent": "BacchusMarshTaxi/1.0" },
    });
    if (nRes.ok) {
      const nData = await nRes.json();
      if (Array.isArray(nData) && nData[0]) {
        res.json({
          success: true,
          coords: { lat: parseFloat(nData[0].lat), lng: parseFloat(nData[0].lon) },
        });
        return;
      }
    }
  } catch (err) {
    console.warn("[Nominatim geocode notice]:", err);
  }

  res.status(404).json({ error: "Location not found" });
});

// Places Autocomplete endpoint (Google Places API New REST with Australia bias & Photon fallback)
router.get("/places-autocomplete", async (req: Request, res: Response) => {
  const input = ((req.query.input as string) || "").trim();
  if (!input || input.length < 2) {
    res.json({ suggestions: [] });
    return;
  }

  // 1. Try Google Places API (New) REST autocomplete if API key is present
  const apiKey = GOOGLE_API_KEY;
  if (apiKey) {
    try {
      const gRes = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
        },
        body: JSON.stringify({
          input,
          includedRegionCodes: ["au"],
          locationBias: {
            circle: {
              center: { latitude: -37.8136, longitude: 144.9631 },
              radius: 50000.0,
            },
          },
        }),
      });

      if (gRes.ok) {
        const gData = await gRes.json();
        if (Array.isArray(gData.suggestions) && gData.suggestions.length > 0) {
          const suggestions = gData.suggestions.map((s: any) => {
            const pred = s.placePrediction || {};
            const sf = pred.structuredFormat || {};
            return {
              id: pred.placeId || pred.place || Math.random().toString(),
              placeId: pred.placeId,
              mainText: sf.mainText?.text || pred.text?.text || input,
              secondaryText: sf.secondaryText?.text || "",
              fullText: pred.text?.text || sf.mainText?.text || input,
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

  // 2. High-speed Australia geocoding / autocomplete fallback via Photon
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&lat=-37.8136&lon=144.9631&limit=6`;
    const pRes = await fetch(photonUrl);
    if (pRes.ok) {
      const pData = await pRes.json();
      if (Array.isArray(pData.features) && pData.features.length > 0) {
        const suggestions = pData.features
          .filter((f: any) => {
            const country = (f.properties?.country || "").toLowerCase();
            return !country || country.includes("aust") || country === "au";
          })
          .map((f: any, idx: number) => {
            const p = f.properties || {};
            const name = p.name || p.street || "";
            const street = p.street ? (p.housenumber ? `${p.housenumber} ${p.street}` : p.street) : "";
            const mainText = name || street || input;
            const suburb = p.district || p.suburb || p.city || p.town || "";
            const state = p.state === "Victoria" ? "VIC" : (p.state || "VIC");
            const postcode = p.postcode ? ` ${p.postcode}` : "";
            const secParts = [suburb, state + postcode, "Australia"].filter(Boolean);
            const secondaryText = secParts.join(", ");
            const fullText = `${mainText}, ${secondaryText}`;
            const coords = Array.isArray(f.geometry?.coordinates)
              ? { lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] }
              : null;
            return {
              id: `photon-${idx}-${p.osm_id || Math.random()}`,
              mainText,
              secondaryText,
              fullText,
              coords,
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

// Place details resolver endpoint (Places API New)
router.get("/place-details", async (req: Request, res: Response) => {
  const placeId = req.query.placeId as string;
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
          "X-Goog-FieldMask": "id,displayName,formattedAddress,location",
        },
      });
      if (gRes.ok) {
        const data = await gRes.json();
        res.json({
          success: true,
          formattedAddress: data.formattedAddress || data.displayName?.text || "",
          displayName: data.displayName?.text || "",
          coords: data.location ? { lat: data.location.latitude, lng: data.location.longitude } : null,
        });
        return;
      }
    } catch (err) {
      console.warn("[Place details error]:", err);
    }
  }
  res.status(404).json({ error: "Place not found" });
});

// Reverse geocode endpoint: converts latitude & longitude to a clean street address
router.get("/reverse-geocode", async (req: Request, res: Response) => {
  const latStr = req.query.lat as string;
  const lngStr = req.query.lng as string;
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    res.status(400).json({ error: "Valid lat and lng query parameters are required" });
    return;
  }

  // 1. High-accuracy Photon pinpoint reverse-geocoder (resolves exact house number + street name)
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
        const state = feature.state === "Victoria" ? "VIC" : (feature.state || "VIC");
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
            street: street,
            suburb: suburb || null,
          });
          return;
        }
      }
    }
  } catch (pErr) {
    console.warn("[Photon reverse geocode notice]:", pErr);
  }

  // 2. OpenStreetMap Nominatim with proper Australian address parsing (pinpoints exact house numbers)
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`;
    const osmRes = await fetch(osmUrl, {
      headers: {
        "User-Agent": "BacchusMarshTaxiApp/1.0 (info@bacchusmarshtaxi.com.au)",
        "Accept": "application/json",
      },
    });
    if (osmRes.ok) {
      const osmData = await osmRes.json();
      const addr = osmData.address || {};
      const houseNumber = addr.house_number || "";
      const road = addr.road || addr.street || addr.footway || addr.path || addr.pedestrian || addr.highway || "";
      const suburb = addr.suburb || addr.neighbourhood || addr.quarter || addr.town || addr.city || addr.village || addr.hamlet || "";
      const state = addr.state === "Victoria" ? "VIC" : (addr.state || "VIC");
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
          source: "nominatim",
        });
        return;
      }
    }
  } catch (err) {
    console.warn("[Nominatim reverse geocode notice]:", err);
  }

  // 3. Try Google Geocoding API if key is present
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
            source: "google_geocoding",
          });
          return;
        }
      }
    } catch (err) {
      console.warn("[Google Geocoding API notice, falling back]:", err);
    }
  }

  // 3. Fallback to BigDataCloud reverse geocode client API
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const bdcRes = await fetch(bdcUrl);
    if (bdcRes.ok) {
      const bdcData = await bdcRes.json();
      const suburb = bdcData.locality || bdcData.city || "";
      const state = bdcData.principalSubdivision === "Victoria" ? "VIC" : (bdcData.principalSubdivision || "VIC");
      const postcode = bdcData.postcode || "";
      const formatted = `${suburb ? suburb + ", " : ""}${state}${postcode ? " " + postcode : ""}`.trim();
      if (formatted) {
        res.json({
          success: true,
          address: formatted,
          lat,
          lng,
          source: "bigdatacloud",
        });
        return;
      }
    }
  } catch (err) {
    console.warn("[BigDataCloud reverse geocode notice]:", err);
  }

  // 4. Fallback to general regional address rather than raw coordinates
  res.json({
    success: true,
    address: "Bacchus Marsh VIC 3340",
    lat,
    lng,
    source: "default_fallback",
  });
});

export default router;
