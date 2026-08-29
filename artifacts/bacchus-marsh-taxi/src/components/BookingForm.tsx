import React, { useEffect, useState, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader } from "@googlemaps/js-api-loader";
import { Navigation, Loader2, MapPin, Info, Clock, AlertTriangle, CheckCircle2, ShieldCheck, Car, Route, Sparkles } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { useCreateBooking, useEstimateFare } from "@workspace/api-client-react";

const GOOGLE_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || "";

export interface Coordinates {
  lat: number;
  lng: number;
}

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  pickupAddress: z.string().min(5, "Pickup address is required"),
  dropoffAddress: z.string().min(5, "Drop-off address is required"),
  vehicleType: z.enum(["sedan", "suv", "silver_service", "six_seater", "maxi_taxi"], { message: "Select vehicle type" }),
  passengers: z.coerce.number().min(1).max(10),
  pickupDate: z.string().min(1, "Select pickup date").refine(v => {
    const today = new Date().toISOString().split("T")[0];
    return v >= today;
  }, { message: "Pickup date must be today or in the future" }),
  pickupTime: z.string().min(1, "Select pickup time"),
  isReturn: z.boolean(),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
  notes: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

// ── Custom time picker ────────────────────────────────────────────────────────
function TimePicker({ value, onChange }: { value: string | undefined; onChange: (v: string) => void }) {
  const parts = value ? value.split(":") : ["", ""];
  const hasValue = !!value;
  const hour24 = hasValue ? parseInt(parts[0] || "0", 10) : NaN;
  const minute = hasValue ? (parts[1] || "") : "";
  const ampm = hasValue ? (hour24 >= 12 ? "PM" : "AM") : "AM";
  const hour12 = hasValue ? (hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24) : "";
  const sel = "flex-1 h-10 rounded-md border border-input bg-input/50 px-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer";
  const handleChange = (h12: number, mm: string, ap: string) => {
    let h24 = h12;
    if (ap === "PM" && h12 !== 12) h24 = h12 + 12;
    if (ap === "AM" && h12 === 12) h24 = 0;
    onChange(`${String(h24).padStart(2, "0")}:${mm || "00"}`);
  };
  return (
    <div className="flex items-center gap-1">
      <select value={hour12} onChange={e => handleChange(parseInt(e.target.value, 10), minute, ampm)} className={sel} aria-label="Hour">
        <option value="">Hour</option>
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(h => <option key={h} value={h}>{h}</option>)}
      </select>
      <span className="font-black text-muted-foreground select-none">:</span>
      <select value={minute} onChange={e => handleChange(hour12 ? parseInt(String(hour12), 10) : 12, e.target.value, ampm)} className={sel} aria-label="Minute">
        <option value="">Min</option>
        {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={ampm} onChange={e => handleChange(hour12 ? parseInt(String(hour12), 10) : 12, minute, e.target.value)} className={sel + " text-xs font-bold"} aria-label="AM/PM">
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}

// ── Google Maps safe loader ───────────────────────────────────────────────────
let mapsLoaderPromise: Promise<boolean> | null = null;

function isGoogleMapsAvailable(): boolean {
  return typeof window !== "undefined" && typeof (window as any).google !== "undefined" && !!(window as any).google?.maps;
}

function loadGoogleMaps(): Promise<boolean> {
  if (mapsLoaderPromise) return mapsLoaderPromise;
  if (!GOOGLE_API_KEY) {
    return Promise.resolve(false);
  }
  const loader = new Loader({
    apiKey: GOOGLE_API_KEY,
    version: "weekly",
    libraries: ["places", "marker", "geometry"],
  });
  mapsLoaderPromise = loader
    .load()
    .then(() => isGoogleMapsAvailable())
    .catch((err) => {
      console.warn("Google Maps load warning:", err);
      return false;
    });
  return mapsLoaderPromise;
}

// Haversine distance helper
function calculateHaversineKm(p1: Coordinates, p2: Coordinates): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // Multiply by 1.28 for realistic road curvature
  return Math.max(1, R * c * 1.28);
}

// Toll road text detection helper
function detectTollsFromText(text: string): string[] {
  const found = new Set<string>();
  const allText = text.toLowerCase();

  if (allText.includes("western ring") || allText.includes("m80") || allText.includes("tullamarine") || allText.includes("airport")) {
    found.add("m80");
  }
  if (allText.includes("tullamarine") || allText.includes("airport") || allText.includes("m2")) {
    found.add("m2_tullamarine");
  }
  if (allText.includes("domain tunnel") || allText.includes("burnley") || allText.includes("cbd") || allText.includes("melbourne city")) {
    found.add("domain_tunnel");
  }
  if (allText.includes("eastlink") || allText.includes("m3") || allText.includes("dandenong") || allText.includes("frankston") || allText.includes("ringwood")) {
    found.add("eastlink");
  }
  if (allText.includes("westgate") || allText.includes("west gate")) {
    found.add("westgate_tunnel");
  }
  return Array.from(found);
}

// ── Address autocomplete input ────────────────────────────────────────────────
interface AddressInputProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (address: string, coords: Coordinates | null) => void;
  showCurrentLocation?: boolean;
  onCurrentLocation?: () => void;
  currentLocationLoading?: boolean;
}

export interface AddressInputHandle {
  fill: (address: string, coords: Coordinates) => void;
}

const AddressInput = forwardRef<AddressInputHandle, AddressInputProps>(function AddressInput(
  { id, placeholder, value, onChange, showCurrentLocation, onCurrentLocation, currentLocationLoading },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<Array<{ display: string; lat: number; lng: number }>>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useImperativeHandle(ref, () => ({
    fill(address: string, coords: Coordinates) {
      if (inputRef.current) inputRef.current.value = address;
      setSuggestions([]);
      setShowDropdown(false);
      onChangeRef.current(address, coords);
    },
  }));

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.value = value;
    }
  }, [value]);

  // Try Google Autocomplete if available
  useEffect(() => {
    let acInstance: any = null;
    loadGoogleMaps().then((available) => {
      if (!available || !inputRef.current || !isGoogleMapsAvailable()) return;
      const g = (window as any).google;
      if (g?.maps?.places?.Autocomplete) {
        acInstance = new g.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: "au" },
          fields: ["formatted_address", "geometry"],
          types: ["geocode", "establishment"],
        });
        acInstance.addListener("place_changed", () => {
          const place = acInstance.getPlace();
          if (place.formatted_address && place.geometry?.location) {
            const coords = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
            onChangeRef.current(place.formatted_address, coords);
            if (inputRef.current) inputRef.current.value = place.formatted_address;
            setSuggestions([]);
            setShowDropdown(false);
          }
        });
      }
    });

    return () => {
      if (acInstance && isGoogleMapsAvailable()) {
        try {
          (window as any).google.maps.event.clearInstanceListeners(acInstance);
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Fallback Nominatim / OpenStreetMap autocomplete search
  const debounceTimerRef = useRef<any>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (!query) {
      onChange("", null);
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(async () => {
      if (query.trim().length < 3) return;
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=au&limit=5&q=${encodeURIComponent(
            query + " Victoria Australia"
          )}`
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSuggestions(
              data.map((item: any) => ({
                display: item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
              }))
            );
            setShowDropdown(true);
          }
        }
      } catch (err) {
        console.warn("Address search notice:", err);
      } finally {
        setSearching(false);
      }
    }, 400);
  };

  const handleSelectSuggestion = (s: { display: string; lat: number; lng: number }) => {
    if (inputRef.current) inputRef.current.value = s.display;
    onChange(s.display, { lat: s.lat, lng: s.lng });
    setSuggestions([]);
    setShowDropdown(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(ev.target as Node) && inputRef.current !== ev.target) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type="text"
        defaultValue={value}
        placeholder={placeholder}
        autoComplete="off"
        className={
          "flex h-10 w-full rounded-md border border-input bg-input/50 px-3 py-2 text-sm " +
          "ring-offset-background placeholder:text-muted-foreground " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
          (showCurrentLocation ? "pr-9" : "")
        }
        onChange={handleInputChange}
        onFocus={() => {
          if (suggestions.length > 0) setShowDropdown(true);
        }}
      />
      {showCurrentLocation && (
        <button
          type="button"
          onClick={onCurrentLocation}
          title="Use current location"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary hover:text-primary/70 transition-colors"
          aria-label="Use current location"
        >
          {currentLocationLoading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Navigation className="w-4 h-4" />}
        </button>
      )}

      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-md shadow-xl z-50 overflow-hidden max-h-56 overflow-y-auto"
        >
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSuggestion(s)}
              className="w-full text-left px-3 py-2.5 text-xs text-foreground hover:bg-secondary flex items-start gap-2 border-b border-border/40 last:border-0 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span className="line-clamp-2">{s.display}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

// ── Map Display Component (Supports Google Maps + Leaflet Fallback) ───────────
interface RouteData {
  km: number;
  tollRoads: string[];
  trafficRatio?: number;
  durationMinutes?: number;
  durationInTrafficMinutes?: number;
}

interface MapProps {
  pickupCoords: Coordinates | null;
  dropoffCoords: Coordinates | null;
  pickupDate?: string;
  pickupTime?: string;
  onDistance: (data: RouteData) => void;
}

function GoogleMapDisplay({ pickupCoords, dropoffCoords, pickupDate, pickupTime, onDistance }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapType, setMapType] = useState<"google" | "leaflet" | "loading">("loading");
  
  // Google Map refs
  const gMapRef = useRef<any>(null);
  const gPickupMarkerRef = useRef<any>(null);
  const gDropoffMarkerRef = useRef<any>(null);
  const gDirRendererRef = useRef<any>(null);
  const gDirSvcRef = useRef<any>(null);

  // Leaflet Map refs
  const lMapRef = useRef<L.Map | null>(null);
  const lPickupMarkerRef = useRef<L.CircleMarker | null>(null);
  const lDropoffMarkerRef = useRef<L.CircleMarker | null>(null);
  const lRouteLayerRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    let isMounted = true;
    loadGoogleMaps().then((available) => {
      if (!isMounted) return;
      if (available && isGoogleMapsAvailable()) {
        setMapType("google");
      } else {
        setMapType("leaflet");
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // ── Initialize Google Maps if available ─────────────────────────────────────
  useEffect(() => {
    if (mapType !== "google" || !mapContainerRef.current || gMapRef.current) return;
    if (!isGoogleMapsAvailable()) {
      setMapType("leaflet");
      return;
    }
    try {
      const g = (window as any).google;
      gMapRef.current = new g.maps.Map(mapContainerRef.current, {
        center: { lat: -37.6766, lng: 144.4386 },
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      gDirSvcRef.current = new g.maps.DirectionsService();
      gDirRendererRef.current = new g.maps.DirectionsRenderer({
        map: gMapRef.current,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#f97316",
          strokeWeight: 5,
          strokeOpacity: 0.9,
        },
      });
    } catch (e) {
      console.warn("Failed initializing Google Maps, switching to Leaflet:", e);
      setMapType("leaflet");
    }
  }, [mapType]);

  // Update Google Maps markers + route
  useEffect(() => {
    if (mapType !== "google" || !gMapRef.current || !isGoogleMapsAvailable()) return;
    const g = (window as any).google;
    const map = gMapRef.current;

    if (gPickupMarkerRef.current) { gPickupMarkerRef.current.setMap?.(null); gPickupMarkerRef.current = null; }
    if (gDropoffMarkerRef.current) { gDropoffMarkerRef.current.setMap?.(null); gDropoffMarkerRef.current = null; }

    const makeDot = (color: string) => ({
      path: g.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
      scale: 8,
    });

    if (pickupCoords) {
      gPickupMarkerRef.current = new g.maps.Marker({
        map,
        position: pickupCoords,
        icon: makeDot("#f97316"),
        title: "Pickup",
      });
    }

    if (dropoffCoords) {
      gDropoffMarkerRef.current = new g.maps.Marker({
        map,
        position: dropoffCoords,
        icon: makeDot("#111827"),
        title: "Drop-off",
      });
    }

    if (pickupCoords && dropoffCoords && gDirSvcRef.current && gDirRendererRef.current) {
      const routeOpts: any = {
        origin: pickupCoords,
        destination: dropoffCoords,
        travelMode: g.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
      };

      // Always request traffic model for live traffic calculations
      let departureDate = new Date();
      if (pickupDate && pickupTime) {
        const ts = new Date(`${pickupDate}T${pickupTime}`);
        if (!isNaN(ts.getTime()) && ts.getTime() > Date.now()) {
          departureDate = ts;
        }
      }
      routeOpts.drivingOptions = {
        departureTime: departureDate,
        trafficModel: g.maps.TrafficModel.BEST_GUESS,
      };

      gDirSvcRef.current.route(routeOpts, (result: any, status: any) => {
        if (status !== g.maps.DirectionsStatus.OK || !result) return;
        const leg = result.routes[0]?.legs[0];
        if (!leg) return;

        gDirRendererRef.current.setDirections(result);

        const km = (leg.distance?.value ?? 0) / 1000;
        if (km > 0) {
          const durMins = leg.duration?.value ? Math.round(leg.duration.value / 60) : Math.round((km / 50) * 60);
          const trafficDurMins = leg.duration_in_traffic?.value ? Math.round(leg.duration_in_traffic.value / 60) : durMins;
          let trafficRatio: number = 1.0;
          if (leg.duration_in_traffic && leg.duration && leg.duration.value > 0) {
            trafficRatio = leg.duration_in_traffic.value / leg.duration.value;
          }
          const allText = [result.routes[0]?.summary, ...(leg.steps || []).map((s: any) => s.instructions)].join(" ");
          onDistance({
            km,
            tollRoads: detectTollsFromText(allText),
            trafficRatio,
            durationMinutes: durMins,
            durationInTrafficMinutes: trafficDurMins,
          });
        }

        const bounds = new g.maps.LatLngBounds();
        bounds.extend(pickupCoords);
        bounds.extend(dropoffCoords);
        map.fitBounds(bounds, 60);
      });
    } else {
      gDirRendererRef.current?.setDirections({ routes: [] });
      if (pickupCoords) { map.setCenter(pickupCoords); map.setZoom(14); }
      else if (dropoffCoords) { map.setCenter(dropoffCoords); map.setZoom(14); }
    }
  }, [pickupCoords, dropoffCoords, pickupDate, pickupTime, mapType, onDistance]);

  // ── Initialize Leaflet if Google Maps is not available ──────────────────────
  useEffect(() => {
    if (mapType !== "leaflet" || !mapContainerRef.current || lMapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-37.6766, 144.4386],
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    lMapRef.current = map;

    return () => {
      map.remove();
      lMapRef.current = null;
    };
  }, [mapType]);

  // Update Leaflet markers + route
  useEffect(() => {
    if (mapType !== "leaflet" || !lMapRef.current) return;
    const map = lMapRef.current;

    if (lPickupMarkerRef.current) { lPickupMarkerRef.current.remove(); lPickupMarkerRef.current = null; }
    if (lDropoffMarkerRef.current) { lDropoffMarkerRef.current.remove(); lDropoffMarkerRef.current = null; }
    if (lRouteLayerRef.current) { lRouteLayerRef.current.remove(); lRouteLayerRef.current = null; }

    if (pickupCoords) {
      lPickupMarkerRef.current = L.circleMarker([pickupCoords.lat, pickupCoords.lng], {
        radius: 8,
        fillColor: "#f97316",
        color: "#ffffff",
        weight: 3,
        opacity: 1,
        fillOpacity: 1,
      }).addTo(map).bindPopup("Pickup Location");
    }

    if (dropoffCoords) {
      lDropoffMarkerRef.current = L.circleMarker([dropoffCoords.lat, dropoffCoords.lng], {
        radius: 8,
        fillColor: "#111827",
        color: "#ffffff",
        weight: 3,
        opacity: 1,
        fillOpacity: 1,
      }).addTo(map).bindPopup("Drop-off Location");
    }

    if (pickupCoords && dropoffCoords) {
      // Fetch driving route from OSRM
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pickupCoords.lng},${pickupCoords.lat};${dropoffCoords.lng},${dropoffCoords.lat}?overview=full&geometries=geojson`;

      fetch(osrmUrl)
        .then((res) => res.json())
        .then((data) => {
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const km = route.distance / 1000;
            const durMins = Math.round((route.duration || (km / 45) * 3600) / 60);
            const coords = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);

            if (lRouteLayerRef.current) lRouteLayerRef.current.remove();
            lRouteLayerRef.current = L.polyline(coords, {
              color: "#f97316",
              weight: 5,
              opacity: 0.9,
            }).addTo(map);

            const bounds = L.latLngBounds(coords);
            map.fitBounds(bounds, { padding: [40, 40] });

            const tolls = detectTollsFromText(`Route distance ${km} km`);
            onDistance({
              km,
              tollRoads: tolls,
              trafficRatio: 1.0,
              durationMinutes: durMins,
              durationInTrafficMinutes: durMins,
            });
          } else {
            throw new Error("No route found");
          }
        })
        .catch(() => {
          // Haversine fallback if OSRM fails
          const km = calculateHaversineKm(pickupCoords, dropoffCoords);
          const durMins = Math.round((km / 45) * 60);
          const line = [[pickupCoords.lat, pickupCoords.lng], [dropoffCoords.lat, dropoffCoords.lng]] as [number, number][];
          if (lRouteLayerRef.current) lRouteLayerRef.current.remove();
          lRouteLayerRef.current = L.polyline(line, {
            color: "#f97316",
            dashArray: "6, 8",
            weight: 4,
            opacity: 0.8,
          }).addTo(map);

          const bounds = L.latLngBounds(line);
          map.fitBounds(bounds, { padding: [40, 40] });
          onDistance({
            km,
            tollRoads: detectTollsFromText(""),
            trafficRatio: 1.0,
            durationMinutes: durMins,
            durationInTrafficMinutes: durMins,
          });
        });
    } else if (pickupCoords) {
      map.setView([pickupCoords.lat, pickupCoords.lng], 14);
    } else if (dropoffCoords) {
      map.setView([dropoffCoords.lat, dropoffCoords.lng], 14);
    }
  }, [pickupCoords, dropoffCoords, mapType, onDistance]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: "100%", width: "100%", minHeight: "380px" }}
      className="rounded-lg z-0"
    />
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────
interface BookingFormProps {
  initialVehicle?: string;
  showMinimumToast?: boolean;
  showMinimumPopup?: boolean;
}

export function BookingForm({ initialVehicle = "sedan", showMinimumToast = true, showMinimumPopup }: BookingFormProps) {
  const { toast } = useToast();
  const createBooking = useCreateBooking();
  const estimateFare = useEstimateFare();

  const [pickupCoords, setPickupCoords] = useState<Coordinates | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<Coordinates | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [detectedTollRoads, setDetectedTollRoads] = useState<string[]>([]);
  const [fareEstimate, setFareEstimate] = useState<{
    total: number;
    flagFall: number;
    distanceCharge: number;
    timeCharge: number;
    cpvLevy: number;
    minimumFare: number;
    vehicleSurcharge: number;
    tollCharges: number;
    tollRoads: string[];
    rateLabel: string;
    rateType?: string;
    durationMinutes?: number;
    trafficDelayMinutes?: number;
    slowMinutes?: number;
    trafficLevel?: string;
    ratesSchedule?: {
      flagFall: number;
      perKm: number;
      perMin: number;
    };
  } | null>(null);
  const [locating, setLocating] = useState(false);
  const [showFareDialog, setShowFareDialog] = useState(false);
  const [showMinimumDialog, setShowMinimumDialog] = useState(false);
  const [showRateCardDialog, setShowRateCardDialog] = useState(false);
  const pickupInputRef = useRef<AddressInputHandle>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", phone: "", email: "",
      pickupAddress: "", dropoffAddress: "",
      vehicleType: (initialVehicle || "sedan") as any,
      passengers: 1,
      pickupDate: "",
      pickupTime: "",
      isReturn: false, returnDate: "", returnTime: "", notes: ""
    }
  });

  const isReturn = form.watch("isReturn");
  const vehicleType = form.watch("vehicleType");
  const passengers = form.watch("passengers");
  const pickupDate = form.watch("pickupDate");
  const pickupTime = form.watch("pickupTime");

  const [trafficRatio, setTrafficRatio] = useState<number | undefined>(undefined);
  const handleDistance = useCallback((data: RouteData) => {
    setRouteData(data);
    setDistanceKm(data.km);
    setDetectedTollRoads(data.tollRoads);
    setTrafficRatio(data.trafficRatio);
  }, []);

  // Run fare estimate when distance and vehicle are available
  useEffect(() => {
    if (!distanceKm || !vehicleType) return;

    // Use selected date/time or fallback to current time for live estimate
    const now = new Date();
    const effectiveDate = pickupDate || now.toISOString().split("T")[0];
    const effectiveTime = pickupTime || `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    estimateFare.mutate(
      {
        data: {
          distanceKm,
          vehicleType: vehicleType as any,
          pickupDate: effectiveDate,
          pickupTime: effectiveTime,
          tollRoads: detectedTollRoads,
          trafficRatio: trafficRatio ?? null,
        },
      },
      {
        onSuccess: (data: any) => {
          setFareEstimate({
            total: data.totalFare,
            flagFall: data.flagFall ?? 0,
            distanceCharge: data.distanceCharge ?? 0,
            timeCharge: data.timeCharge ?? 0,
            cpvLevy: data.cpvLevy ?? 1.30,
            minimumFare: data.minimumFare ?? 0,
            vehicleSurcharge: data.vehicleSurcharge ?? 0,
            tollCharges: data.tollCharges ?? 0,
            tollRoads: data.tollRoads ?? [],
            rateLabel: data.rateLabel ?? "Day Rate",
            rateType: data.rateType ?? "day",
            durationMinutes: data.durationMinutes ?? routeData?.durationInTrafficMinutes,
            trafficDelayMinutes: data.trafficDelayMinutes ?? 0,
            slowMinutes: data.slowMinutes ?? 0,
            trafficLevel: data.trafficLevel ?? "Normal Flow",
            ratesSchedule: data.ratesSchedule ?? {
              flagFall: 5.40,
              perKm: 2.10,
              perMin: 0.70,
            },
          });
          if (pickupDate && pickupTime) {
            setShowFareDialog(true);
          }
        },
      }
    );
  }, [distanceKm, vehicleType, passengers, pickupDate, pickupTime, detectedTollRoads, trafficRatio, routeData]);

  // Reset distance/fare when either address is cleared
  useEffect(() => {
    if (!pickupCoords || !dropoffCoords) {
      setDistanceKm(null);
      setRouteData(null);
      setFareEstimate(null);
    }
  }, [pickupCoords, dropoffCoords]);

  useEffect(() => {
    const shouldShow = showMinimumPopup !== undefined ? showMinimumPopup : showMinimumToast;
    if (!shouldShow) return;
    setShowMinimumDialog(true);
  }, [showMinimumToast, showMinimumPopup]);

  // Current location → reverse geocode → fill pickup field
  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({ title: "Not supported", description: "Your browser doesn't support location access.", variant: "destructive" });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        let address = `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;

        if (isGoogleMapsAvailable()) {
          try {
            const g = (window as any).google;
            new g.maps.Geocoder().geocode({ location: coords }, (results: any, status: any) => {
              setLocating(false);
              if (status === "OK" && results?.[0]) {
                address = results[0].formatted_address;
              }
              pickupInputRef.current?.fill(address, coords);
              form.setValue("pickupAddress", address, { shouldValidate: true });
              toast({ title: "Location detected", description: address, duration: 4000 });
            });
            return;
          } catch {
            // fallback to nominatim
          }
        }

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`);
          if (res.ok) {
            const data = await res.json();
            if (data?.display_name) {
              address = data.display_name;
            }
          }
        } catch {
          // use lat,lng string
        }

        setLocating(false);
        pickupInputRef.current?.fill(address, coords);
        form.setValue("pickupAddress", address, { shouldValidate: true });
        toast({ title: "Location detected", description: address, duration: 4000 });
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast({ title: "Location access denied", description: "Please enable location access in your browser settings, or type your address manually.", variant: "destructive" });
        } else {
          toast({ title: "Could not get location", description: "Try again or type your address.", variant: "destructive" });
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [form, toast]);

  const onSubmit = (data: FormData) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    if (data.pickupDate === today) {
      const [h, m] = data.pickupTime.split(":").map(Number);
      const pickupMins = h * 60 + m;
      const nowMins = now.getHours() * 60 + now.getMinutes();
      if (pickupMins < nowMins) {
        form.setError("pickupTime", { message: "Pickup time must be in the future" });
        return;
      }
    }
    createBooking.mutate(
      { data: { ...data, distanceKm: distanceKm || undefined, estimatedFare: fareEstimate?.total || undefined } as any },
      {
        onSuccess: (res: any) => {
          toast({ title: "Booking Submitted", description: "Your booking request has been sent successfully." });
          if (res.whatsappUrl) window.open(res.whatsappUrl, "_blank");
          form.reset();
          setPickupCoords(null); setDropoffCoords(null);
          setDistanceKm(null); setFareEstimate(null);
        },
        onError: () => {
          toast({ title: "Error", description: "There was a problem submitting your booking. Please call us.", variant: "destructive" });
        }
      }
    );
  };

  const sendWhatsApp = () => {
    const d = form.getValues();
    const vehicleLabels: Record<string, string> = {
      sedan: "Sedan", suv: "SUV (+$18)", silver_service: "Silver Service (+$11)",
      six_seater: "6 Seater", maxi_taxi: "Maxi Taxi (+$18)"
    };
    const msg = [
      "🚖 *BOOKING REQUEST — Bacchus Marsh Taxi*", "",
      `👤 Name: ${d.name || "(not filled)"}`,
      `📞 Phone: ${d.phone || "(not filled)"}`,
      `📧 Email: ${d.email || "(not filled)"}`, "",
      `📍 Pickup: ${d.pickupAddress || "(not filled)"}`,
      `🏁 Dropoff: ${d.dropoffAddress || "(not filled)"}`, "",
      `🚗 Vehicle: ${vehicleLabels[d.vehicleType] || d.vehicleType}`,
      `👥 Passengers: ${d.passengers}`,
      `📅 Date: ${d.pickupDate} at ${d.pickupTime}`,
      d.isReturn ? `🔄 Return: ${d.returnDate} at ${d.returnTime}` : "",
      fareEstimate ? `💰 Est. Fare: $${fareEstimate.total.toFixed(2)}` : "",
      distanceKm ? `📏 Distance: ${distanceKm.toFixed(1)} km` : "",
      d.notes ? `📝 Notes: ${d.notes}` : "",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/61435304821?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

      {/* ── Form Column ── */}
      <div className="order-2 lg:order-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Passenger Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-black uppercase tracking-wide border-b border-border pb-2">Passenger Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider">Full Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} className="bg-input/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider">Mobile Number</FormLabel>
                    <FormControl><Input placeholder="0400 000 000" {...field} className="bg-input/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider">Email Address</FormLabel>
                  <FormControl><Input placeholder="john@example.com" type="email" {...field} className="bg-input/50" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Journey Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-black uppercase tracking-wide border-b border-border pb-2">Journey Details</h3>

              <FormField control={form.control} name="pickupAddress" render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider">Pickup Address</FormLabel>
                  <FormControl>
                    <AddressInput
                      ref={pickupInputRef}
                      id="pickup-address"
                      placeholder="Start typing pickup location..."
                      value={field.value}
                      onChange={(address, coords) => {
                        field.onChange(address);
                        setPickupCoords(coords);
                      }}
                      showCurrentLocation
                      onCurrentLocation={handleCurrentLocation}
                      currentLocationLoading={locating}
                    />
                  </FormControl>
                  <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                    <Navigation className="w-3 h-3 inline" /> Tap the arrow to use your current location
                  </p>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="dropoffAddress" render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider">Drop-off Address</FormLabel>
                  <FormControl>
                    <AddressInput
                      id="dropoff-address"
                      placeholder="Start typing destination..."
                      value={field.value}
                      onChange={(address, coords) => {
                        field.onChange(address);
                        setDropoffCoords(coords);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="pickupDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider">Select Date</FormLabel>
                    <FormControl><Input type="date" {...field} min={new Date().toISOString().split("T")[0]} className="bg-input/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="pickupTime" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider">Select Time</FormLabel>
                    <FormControl><TimePicker value={field.value} onChange={field.onChange} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Vehicle & Extras */}
            <div className="space-y-4">
              <h3 className="text-xl font-black uppercase tracking-wide border-b border-border pb-2">Vehicle & Extras</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="vehicleType" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider">Vehicle Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger className="bg-input/50"><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sedan">Standard Sedan</SelectItem>
                        <SelectItem value="suv">Premium SUV (+$18)</SelectItem>
                        <SelectItem value="silver_service">Silver Service (+$11)</SelectItem>
                        <SelectItem value="six_seater">6 Seater People Mover</SelectItem>
                        <SelectItem value="maxi_taxi">Maxi Taxi (+$18)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="passengers" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider">Passengers</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger className="bg-input/50"><SelectValue placeholder="Passengers" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(13)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="isReturn" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-secondary/50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-bold uppercase tracking-wide">Return Trip</FormLabel>
                    <p className="text-sm text-muted-foreground">Do you need a ride back?</p>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />

              {isReturn && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-primary/30 rounded-lg bg-primary/5">
                  <FormField control={form.control} name="returnDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-primary tracking-wider">Return Date</FormLabel>
                      <FormControl><Input type="date" {...field} className="bg-input/50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="returnTime" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-primary tracking-wider">Return Time</FormLabel>
                      <FormControl><TimePicker value={field.value} onChange={field.onChange} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider">Special Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Flight number, child seat required, bulky luggage..." className="resize-none bg-input/50 h-24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Submit */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="submit" size="lg"
                className="w-full h-16 text-sm sm:text-base font-black uppercase tracking-wide leading-tight"
                disabled={createBooking.isPending}
                data-testid="btn-submit-booking"
              >
                {createBooking.isPending ? <Spinner className="mr-2" /> : null}
                Submit Booking
              </Button>
              <button type="button" data-testid="btn-whatsapp-booking" onClick={sendWhatsApp}
                className="w-full h-16 rounded-md flex flex-col items-center justify-center gap-1 transition-opacity hover:opacity-90"
                style={{ background: "#25D366", color: "#fff" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wide leading-none text-center">Instant<br/>Confirmation</span>
              </button>
            </div>

          </form>
        </Form>
      </div>

      {/* ── Map & Estimate Column ── */}
      <div className="order-1 lg:order-2 lg:sticky lg:top-28 h-fit space-y-6">
        <div className="rounded-lg overflow-hidden border border-border h-[420px] bg-secondary relative">
          <GoogleMapDisplay
            pickupCoords={pickupCoords}
            dropoffCoords={dropoffCoords}
            pickupDate={pickupDate}
            pickupTime={pickupTime}
            onDistance={handleDistance}
          />
          {distanceKm && (
            <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm border border-border rounded-md px-3 py-1.5 text-xs font-bold z-10">
              📏 {distanceKm.toFixed(1)} km driving distance
            </div>
          )}
        </div>

        {fareEstimate ? (
          <Card className="bg-card border-primary/50 shadow-md">
            <CardContent className="p-5 space-y-4">
              {/* Traffic status badge */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-secondary/70 border border-border">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    {fareEstimate.trafficDelayMinutes && fareEstimate.trafficDelayMinutes > 7 ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </>
                    ) : fareEstimate.trafficDelayMinutes && fareEstimate.trafficDelayMinutes > 2 ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </>
                    ) : (
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    )}
                  </span>
                  <div className="text-xs">
                    <span className="font-bold text-foreground">
                      {fareEstimate.trafficLevel || "Normal Flow"}
                    </span>
                    {fareEstimate.trafficDelayMinutes && fareEstimate.trafficDelayMinutes > 0 ? (
                      <span className="text-muted-foreground ml-1">
                        (+{fareEstimate.trafficDelayMinutes}m live delay)
                      </span>
                    ) : null}
                  </div>
                </div>

                {fareEstimate.durationMinutes ? (
                  <div className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{fareEstimate.durationMinutes} mins</span>
                  </div>
                ) : null}
              </div>

              {/* Total Fare Display */}
              <div className="text-center py-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estimated Fare</p>
                <div className="text-4xl sm:text-5xl font-black text-primary my-1">${fareEstimate.total.toFixed(2)}</div>
                <div className="text-xs font-medium text-muted-foreground">
                  {fareEstimate.rateLabel} · Safe Transport Victoria Regulated
                </div>
                {fareEstimate.minimumFare > 0 && (
                  <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                    ⚡ $25.00 Minimum Fare Floor Applied
                  </div>
                )}
              </div>

              {/* Itemized Victoria Meter Breakdown */}
              <div className="space-y-1.5 text-xs border-t border-border pt-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Base Flagfall ({fareEstimate.rateType || "Day"} rate)</span>
                  <span className="font-medium text-foreground">${fareEstimate.flagFall.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Distance ({distanceKm?.toFixed(1) || "0"} km @ ${fareEstimate.ratesSchedule?.perKm.toFixed(2) || "2.10"}/km)</span>
                  <span className="font-medium text-foreground">${fareEstimate.distanceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span>Traffic & Waiting ({fareEstimate.slowMinutes || 1} min @ ${fareEstimate.ratesSchedule?.perMin.toFixed(2) || "0.70"}/m)</span>
                  </span>
                  <span className="font-medium text-foreground">${fareEstimate.timeCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>CPV Government Levy</span>
                  <span className="font-medium text-foreground">${fareEstimate.cpvLevy.toFixed(2)}</span>
                </div>
                {fareEstimate.vehicleSurcharge > 0 && (
                  <div className="flex justify-between text-primary font-medium">
                    <span>Vehicle / High Occupancy Surcharge</span>
                    <span>+${fareEstimate.vehicleSurcharge.toFixed(2)}</span>
                  </div>
                )}
                {fareEstimate.tollCharges > 0 && (
                  <div className="flex justify-between text-primary font-medium">
                    <span>Linkt Tolls ({fareEstimate.tollRoads.length} section{fareEstimate.tollRoads.length > 1 ? "s" : ""})</span>
                    <span>+${fareEstimate.tollCharges.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                <button
                  type="button"
                  onClick={() => setShowRateCardDialog(true)}
                  className="inline-flex items-center gap-1 text-primary hover:underline font-semibold cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>View Official Meter Rates</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMinimumDialog(true)}
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>$25 Min Policy</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center text-muted-foreground space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold uppercase tracking-wide text-foreground">Live Fare Estimator</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter pickup and drop-off addresses to get a real-time fare calculation with live traffic and regulated rates.
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setShowRateCardDialog(true)}
                  className="inline-flex items-center gap-1 text-primary hover:underline font-semibold cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Meter Rates Schedule</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMinimumDialog(true)}
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>$25 Minimum</span>
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Fare Estimate Popup Dialog ── */}
      <Dialog open={showFareDialog} onOpenChange={setShowFareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-black uppercase tracking-wide">
              Live Fare Estimate
            </DialogTitle>
          </DialogHeader>
          {fareEstimate && (
            <div className="space-y-4">
              {/* Traffic Alert & Status */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/80 border border-border">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    {fareEstimate.trafficDelayMinutes && fareEstimate.trafficDelayMinutes > 7 ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </>
                    ) : (
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    )}
                  </span>
                  <div className="text-xs">
                    <span className="font-bold text-foreground">
                      Traffic: {fareEstimate.trafficLevel || "Normal Flow"}
                    </span>
                    {fareEstimate.trafficDelayMinutes && fareEstimate.trafficDelayMinutes > 0 ? (
                      <span className="text-muted-foreground ml-1">
                        (+{fareEstimate.trafficDelayMinutes}m delay)
                      </span>
                    ) : null}
                  </div>
                </div>

                {fareEstimate.durationMinutes ? (
                  <div className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded">
                    ~{fareEstimate.durationMinutes} mins
                  </div>
                ) : null}
              </div>

              {/* Total Card */}
              <div className="text-center py-4 px-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Estimated Total</div>
                <div className="text-5xl sm:text-6xl font-black text-primary my-1.5">${fareEstimate.total.toFixed(2)}</div>
                <div className="text-xs font-semibold text-foreground">
                  {fareEstimate.rateLabel}
                </div>
                {fareEstimate.minimumFare > 0 && (
                  <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                    ⚡ Flat Minimum Fare Applied ($25.00)
                  </div>
                )}
                {distanceKm && (
                  <div className="text-xs text-muted-foreground mt-1.5">
                    Route Distance: <span className="font-bold text-foreground">{distanceKm.toFixed(1)} km</span>
                  </div>
                )}
              </div>

              {/* Regulated Meter Breakdown */}
              <div className="rounded-lg border border-border p-3 space-y-2 text-xs bg-card">
                <div className="font-bold uppercase tracking-wider text-muted-foreground text-[10px] pb-1 border-b border-border">
                  Safe Transport Victoria Meter Calculation
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flagfall ({fareEstimate.rateType || "Day"} rate)</span>
                  <span className="font-semibold">${fareEstimate.flagFall.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distance Charge ({distanceKm?.toFixed(1) || "0"} km @ ${fareEstimate.ratesSchedule?.perKm.toFixed(2) || "2.10"}/km)</span>
                  <span className="font-semibold">${fareEstimate.distanceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Live Traffic & Detention ({fareEstimate.slowMinutes || 1} min @ ${fareEstimate.ratesSchedule?.perMin.toFixed(2) || "0.70"}/m)</span>
                  <span className="font-semibold">${fareEstimate.timeCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPV Government Levy</span>
                  <span className="font-semibold">${fareEstimate.cpvLevy.toFixed(2)}</span>
                </div>
                {fareEstimate.vehicleSurcharge > 0 && (
                  <div className="flex justify-between text-primary font-semibold">
                    <span>Vehicle / High Occupancy Fee</span>
                    <span>+${fareEstimate.vehicleSurcharge.toFixed(2)}</span>
                  </div>
                )}
                {fareEstimate.tollCharges > 0 && (
                  <div className="flex justify-between text-primary font-semibold">
                    <span>Tolls ({fareEstimate.tollRoads.join(", ")})</span>
                    <span>+${fareEstimate.tollCharges.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <DialogFooter className="flex-col gap-2 sm:gap-0 pt-2">
                <Button className="w-full h-12 font-bold uppercase tracking-wider" onClick={() => setShowFareDialog(false)}>
                  Continue Booking Ride
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setShowFareDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Regulated Victoria Rate Card Dialog ── */}
      <Dialog open={showRateCardDialog} onOpenChange={setShowRateCardDialog}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-black uppercase tracking-wide">
              Safe Transport Victoria Meter Rates
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-xs">
            <p className="text-muted-foreground text-center leading-relaxed">
              Regulated maximum taxi fares for Metropolitan Melbourne, Frankston, Dandenong & Mornington Peninsula. Time or distance tariff structure (crossover speed 21 km/h).
            </p>

            {/* Rate Schedules Table */}
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-secondary/50 border border-border space-y-1">
                <div className="flex justify-between font-bold text-foreground">
                  <span>Day Rate (9:00 AM – 5:00 PM)</span>
                  <span className="text-primary font-black">$5.40 flagfall</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Distance rate (speed &gt; 21 km/h):</span>
                  <span className="font-semibold text-foreground">$2.10 / km</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Time charge (speed &lt; 21 km/h):</span>
                  <span className="font-semibold text-foreground">$0.70 / min</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-secondary/50 border border-border space-y-1">
                <div className="flex justify-between font-bold text-foreground">
                  <span>Overnight Rate (5:00 PM – 9:00 AM)</span>
                  <span className="text-primary font-black">$6.75 flagfall</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Distance rate (speed &gt; 21 km/h):</span>
                  <span className="font-semibold text-foreground">$2.30 / km</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Time charge (speed &lt; 21 km/h):</span>
                  <span className="font-semibold text-foreground">$0.80 / min</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-secondary/50 border border-border space-y-1">
                <div className="flex justify-between font-bold text-foreground">
                  <span>Peak Rate (10:00 PM – 4:00 AM Fri &amp; Sat, plus Holidays)</span>
                  <span className="text-primary font-black">$8.00 flagfall</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Distance rate (speed &gt; 21 km/h):</span>
                  <span className="font-semibold text-foreground">$2.55 / km</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Time charge (speed &lt; 21 km/h):</span>
                  <span className="font-semibold text-foreground">$0.85 / min</span>
                </div>
              </div>
            </div>

            {/* Extras */}
            <div className="rounded-lg border border-border p-3 space-y-1.5 bg-card">
              <div className="font-bold text-foreground uppercase tracking-wider text-[10px]">
                Regulated Extras &amp; Surcharges
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>High Occupancy Fee (5+ passengers or Maxi Taxi)</span>
                <span className="font-bold text-foreground">$18.35</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>CPV Government Levy Recovery Fee</span>
                <span className="font-bold text-foreground">$1.30</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Silver Service / Luxury Premium</span>
                <span className="font-bold text-foreground">$11.00</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Short-trip Floor / Minimum Fare (trips &lt; 5 km)</span>
                <span className="font-bold text-foreground">$25.00</span>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button className="w-full h-11 font-bold uppercase tracking-wider" onClick={() => setShowRateCardDialog(false)}>
                Understood
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Minimum Fare Popup Window (Estimate Style) ── */}
      <Dialog open={showMinimumDialog} onOpenChange={setShowMinimumDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-black uppercase tracking-wide">
              Minimum Fare
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="text-center py-4 px-3 rounded-lg bg-secondary/50 border border-border">
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Base Minimum Rate</div>
              <div className="text-6xl font-black text-primary mt-2">$25.00</div>
              <div className="text-xs font-semibold text-primary/90 mt-1.5 uppercase tracking-wider">
                Flat Rate · Trips Up To 5 km
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 rounded-md bg-secondary/30 border border-border/70">
                <span className="text-primary font-bold text-sm leading-none mt-0.5">•</span>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Trips under 5 km</strong> are charged a flat <strong className="text-primary font-bold">$25 minimum</strong>.
                </p>
              </div>
            </div>

            <DialogFooter className="flex-col gap-2 sm:gap-0 pt-1">
              <Button
                className="w-full h-12 font-bold uppercase tracking-wider"
                onClick={() => setShowMinimumDialog(false)}
                data-testid="btn-close-min-fare-dialog"
              >
                Got It — Continue
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowMinimumDialog(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

