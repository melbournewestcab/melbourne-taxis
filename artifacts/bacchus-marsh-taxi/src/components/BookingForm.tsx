import React, { useEffect, useState, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader } from "@googlemaps/js-api-loader";
import { Navigation, Loader2, MapPin, Info, Clock, AlertTriangle, CheckCircle2, ShieldCheck, Car, Route, Sparkles, Plane, X } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import { useCreateBooking, useEstimateFare } from "@workspace/api-client-react";
import { CabchargeIcon } from "@/components/CabchargeIcon";

const GOOGLE_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  "AIzaSyAdFaQS_OS7xD6QkUcvQvCFMIE2UvwG0PQ";

export interface Coordinates {
  lat: number;
  lng: number;
}

export const MELBOURNE_CENTER: Coordinates = {
  lat: -37.8136,
  lng: 144.9631,
};

const formSchema = z.object({
  name: z.string().trim().min(2, "Full name is required"),
  phone: z.string().trim().min(8, "Valid mobile phone number is required"),
  email: z.string().trim().email("Valid email address is required"),
  pickupAddress: z.string().trim().min(5, "Pickup address is required"),
  dropoffAddress: z.string().trim().min(5, "Drop-off address is required"),
  vehicleType: z.enum(["sedan", "suv", "silver_service", "six_seater", "maxi_taxi"], {
    errorMap: () => ({ message: "Please choose a vehicle type" }),
  }),
  passengers: z.coerce.number().min(1, "At least 1 passenger is required").max(13),
  pickupDate: z.string().min(1, "Please select pickup date").refine(v => {
    const today = new Date().toISOString().split("T")[0];
    return v >= today;
  }, { message: "Pickup date must be today or in the future" }),
  pickupTime: z.string().min(1, "Please select pickup time"),
  paymentMethod: z.enum(["cash", "card", "cabcharge"], {
    errorMap: () => ({ message: "Please select a payment option (Cash, Card, or Cabcharge)" }),
  }),
  isReturn: z.boolean(),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
  notes: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.isReturn) {
    if (!data.returnDate || data.returnDate.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["returnDate"],
        message: "Return date is required when return trip is enabled",
      });
    }
    if (!data.returnTime || data.returnTime.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["returnTime"],
        message: "Return time is required when return trip is enabled",
      });
    }
  }
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
    libraries: ["places", "marker", "geometry", "maps"],
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

// Polyline string decoder (standard Google Maps encoding algorithm)
function decodePolyline(encoded: string): Array<{ lat: number; lng: number }> {
  if (!encoded) return [];
  const points: Array<{ lat: number; lng: number }> = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
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

// ── Address autocomplete input (Google Places API New + High-Resilience Fallback) ──
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

interface PlaceSuggestion {
  id: string;
  placeId?: string;
  mainText: string;
  secondaryText: string;
  fullText: string;
  coords?: Coordinates | null;
  toPlace?: () => any;
}

const AddressInput = forwardRef<AddressInputHandle, AddressInputProps>(function AddressInput(
  { id, placeholder, value, onChange, showCurrentLocation, onCurrentLocation, currentLocationLoading },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const [inputValue, setInputValue] = useState(value || "");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Modern Places API (New) session token
  const sessionTokenRef = useRef<any>(null);
  const debounceTimerRef = useRef<any>(null);

  // Sync external value changes
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useImperativeHandle(ref, () => ({
    fill(address: string, coords: Coordinates) {
      setInputValue(address);
      setSuggestions([]);
      setIsOpen(false);
      sessionTokenRef.current = null;
      onChangeRef.current(address, coords);
    },
  }));

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch suggestions using server-side Google Places API (New) proxy with Australia bias & fallback
  const fetchSuggestions = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/routes/places-autocomplete?input=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          const list: PlaceSuggestion[] = data.suggestions.slice(0, 6).map((s: any) => ({
            id: s.id || s.placeId || Math.random().toString(),
            placeId: s.placeId,
            mainText: s.mainText || trimmed,
            secondaryText: s.secondaryText || "",
            fullText: s.fullText || s.mainText || trimmed,
            coords: s.coords || null,
          }));
          setSuggestions(list);
          setIsOpen(true);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // ignore
    }

    setSuggestions([]);
    setIsLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setActiveIndex(-1);
    onChangeRef.current(val, null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 220);
  };

  const handleSelectSuggestion = async (item: PlaceSuggestion) => {
    const fullAddr = item.fullText || item.mainText;
    setInputValue(fullAddr);
    setIsOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);

    let coords: Coordinates | null = item.coords || null;

    // 1. If toPlace is available, resolve location with place.fetchFields
    if (item.toPlace) {
      try {
        const place = item.toPlace();
        await place.fetchFields({
          fields: ["formattedAddress", "displayName", "location"],
        });
        if (place.location) {
          coords = {
            lat: place.location.lat(),
            lng: place.location.lng(),
          };
        }
        const resolvedAddress = place.formattedAddress || place.displayName || fullAddr;
        setInputValue(resolvedAddress);
        // Consume session token
        sessionTokenRef.current = null;
        onChangeRef.current(resolvedAddress, coords);
        return;
      } catch (pErr) {
        console.warn("Places API fetchFields notice:", pErr);
      }
    }

    // 2. If placeId is present, resolve via server endpoint
    if (item.placeId && !coords) {
      try {
        const res = await fetch(`/api/routes/place-details?placeId=${encodeURIComponent(item.placeId)}`);
        if (res.ok) {
          const detail = await res.json();
          if (detail.coords) {
            coords = detail.coords;
          }
          const finalAddr = detail.formattedAddress || fullAddr;
          setInputValue(finalAddr);
          sessionTokenRef.current = null;
          onChangeRef.current(finalAddr, coords);
          return;
        }
      } catch (detErr) {
        console.warn("Place details fallback notice:", detErr);
      }
    }

    if (!coords && fullAddr) {
      try {
        const geoRes = await fetch(`/api/routes/geocode?address=${encodeURIComponent(fullAddr)}`);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.coords) {
            coords = geoData.coords;
          }
        }
      } catch {
        // ignore
      }
    }

    sessionTokenRef.current = null;
    onChangeRef.current(fullAddr, coords);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelectSuggestion(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSuggestions([]);
    setIsOpen(false);
    sessionTokenRef.current = null;
    onChangeRef.current("", null);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className={
            "flex h-10 w-full rounded-md border border-input bg-input/50 px-3 py-2 text-sm " +
            "ring-offset-background placeholder:text-muted-foreground " +
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
            (showCurrentLocation ? "pr-16" : "pr-8")
          }
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />

        {/* Clear & current location action buttons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
          {isLoading && (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
          )}

          {inputValue.length > 0 && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-sm hover:text-foreground hover:bg-accent/40 transition-colors"
              title="Clear address"
              aria-label="Clear address"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {showCurrentLocation && (
            <button
              type="button"
              onClick={onCurrentLocation}
              title="Use current GPS location"
              className="p-1 text-primary hover:text-primary/70 transition-colors cursor-pointer rounded-sm hover:bg-primary/10 ml-0.5"
              aria-label="Use current location"
            >
              {currentLocationLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Classic Google Maps styled dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 overflow-hidden rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 duration-100">
          <ul className="py-1 max-h-64 overflow-y-auto divide-y divide-border/30">
            {suggestions.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <li
                  key={item.id}
                  className={
                    "flex items-start gap-2.5 px-3 py-2.5 cursor-pointer text-left transition-colors " +
                    (isSelected
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/60 text-foreground")
                  }
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectSuggestion(item);
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {item.mainText}
                    </p>
                    {item.secondaryText && (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.secondaryText}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="px-3 py-1.5 bg-muted/30 border-t border-border/50 flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground select-none">
            <span className="text-[10px]">powered by</span>
            <span className="font-semibold text-foreground tracking-tight">Google</span>
          </div>
        </div>
      )}
    </div>
  );
});

// ── Map Display Component (Google Maps Routes with Live Traffic + Leaflet Fallback) ──
interface RouteData {
  km: number;
  tollRoads: string[];
  trafficRatio?: number;
  durationMinutes?: number;
  durationInTrafficMinutes?: number;
  trafficDelayMinutes?: number;
  trafficLevel?: string;
  source?: string;
}

interface MapProps {
  pickupCoords: Coordinates | null;
  dropoffCoords: Coordinates | null;
  pickupDate?: string;
  pickupTime?: string;
  onDistance: (data: RouteData) => void;
  onPickupCoordsChange?: (coords: Coordinates) => void;
  accuracyMeters?: number | null;
}

function GoogleMapDisplay({
  pickupCoords,
  dropoffCoords,
  pickupDate,
  pickupTime,
  onDistance,
  onPickupCoordsChange,
  accuracyMeters,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapType, setMapType] = useState<"google" | "leaflet" | "loading">("loading");

  // Google Map refs
  const gMapRef = useRef<any>(null);
  const gTrafficLayerRef = useRef<any>(null);
  const gPickupMarkerRef = useRef<any>(null);
  const gDropoffMarkerRef = useRef<any>(null);
  const gPolylineRef = useRef<any>(null);
  const gAccuracyCircleRef = useRef<any>(null);

  // Leaflet Map refs
  const lMapRef = useRef<L.Map | null>(null);
  const lPickupMarkerRef = useRef<L.CircleMarker | null>(null);
  const lDropoffMarkerRef = useRef<L.CircleMarker | null>(null);
  const lRouteLayerRef = useRef<L.Polyline | null>(null);
  const lAccuracyCircleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Listen for Google Maps auth failure
    if (typeof window !== "undefined") {
      (window as any).gm_authFailure = () => {
        console.warn("Google Maps auth failure detected, switching to Leaflet map");
        if (isMounted) setMapType("leaflet");
      };
    }

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

  // ── Initialize Google Maps with TrafficLayer ────────────────────────────────
  useEffect(() => {
    if (mapType !== "google" || !mapContainerRef.current || gMapRef.current) return;
    if (!isGoogleMapsAvailable()) {
      setMapType("leaflet");
      return;
    }
    try {
      const g = (window as any).google;
      const map = new g.maps.Map(mapContainerRef.current, {
        center: MELBOURNE_CENTER,
        zoom: 11,
        mapId: "DEMO_MAP_ID",
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      // Mount real-time Google TrafficLayer for live road conditions
      try {
        const trafficLayer = new g.maps.TrafficLayer();
        trafficLayer.setMap(map);
        gTrafficLayerRef.current = trafficLayer;
      } catch (tErr) {
        console.warn("Traffic layer notice:", tErr);
      }

      // Check if Google Maps inserted an error message in DOM
      const errorCheckTimer = setInterval(() => {
        if (!mapContainerRef.current) return;
        const errElem = mapContainerRef.current.querySelector(".gm-err-container, .gm-err-message, [class*='gm-err']");
        if (errElem) {
          console.warn("Google Maps error container found, switching seamlessly to Leaflet map");
          clearInterval(errorCheckTimer);
          setMapType("leaflet");
        }
      }, 400);
      setTimeout(() => clearInterval(errorCheckTimer), 4000);

      // Allow clicking on map to place or fine-tune pickup doorstep pin
      map.addListener("click", (event: any) => {
        const lat = event.latLng ? event.latLng.lat() : null;
        const lng = event.latLng ? event.latLng.lng() : null;
        if (typeof lat === "number" && typeof lng === "number" && onPickupCoordsChange) {
          onPickupCoordsChange({ lat, lng });
        }
      });

      gMapRef.current = map;
    } catch (e) {
      console.warn("Failed initializing Google Maps, switching to Leaflet:", e);
      setMapType("leaflet");
    }
  }, [mapType, onPickupCoordsChange]);

  // Update Google Maps markers + Routes API calculation
  useEffect(() => {
    if (mapType !== "google" || !gMapRef.current || !isGoogleMapsAvailable()) return;
    const g = (window as any).google;
    const map = gMapRef.current;

    // Clear previous markers & circles
    if (gPickupMarkerRef.current) {
      gPickupMarkerRef.current.map = null;
      gPickupMarkerRef.current = null;
    }
    if (gDropoffMarkerRef.current) {
      gDropoffMarkerRef.current.map = null;
      gDropoffMarkerRef.current = null;
    }
    if (gPolylineRef.current) {
      gPolylineRef.current.setMap(null);
      gPolylineRef.current = null;
    }
    if (gAccuracyCircleRef.current) {
      gAccuracyCircleRef.current.setMap(null);
      gAccuracyCircleRef.current = null;
    }

    // Add GPS precision radius circle
    if (pickupCoords && typeof accuracyMeters === "number" && accuracyMeters > 0) {
      try {
        gAccuracyCircleRef.current = new g.maps.Circle({
          map,
          center: pickupCoords,
          radius: Math.min(accuracyMeters, 250),
          fillColor: "#f97316",
          fillOpacity: 0.12,
          strokeColor: "#ea580c",
          strokeOpacity: 0.45,
          strokeWeight: 1.5,
        });
      } catch (cErr) {
        console.warn("Accuracy circle notice:", cErr);
      }
    }

    // Add AdvancedMarkerElement or fallback Pin (with interactive dragging for 100% pinpoint accuracy)
    const markerLib = g.maps.marker;
    if (markerLib?.AdvancedMarkerElement && markerLib?.PinElement) {
      if (pickupCoords) {
        const pin = new markerLib.PinElement({
          background: "#f97316",
          borderColor: "#c2410c",
          glyphColor: "#ffffff",
          scale: 1.15,
        });
        const marker = new markerLib.AdvancedMarkerElement({
          map,
          position: pickupCoords,
          title: "Pickup Location (Drag to adjust doorstep)",
          content: pin.element,
          gmpDraggable: true,
        });
        marker.addListener("dragend", (event: any) => {
          const lat = event.latLng ? event.latLng.lat() : (marker.position as any)?.lat;
          const lng = event.latLng ? event.latLng.lng() : (marker.position as any)?.lng;
          if (typeof lat === "number" && typeof lng === "number" && onPickupCoordsChange) {
            onPickupCoordsChange({ lat, lng });
          }
        });
        gPickupMarkerRef.current = marker;
      }
      if (dropoffCoords) {
        const pin = new markerLib.PinElement({
          background: "#111827",
          borderColor: "#000000",
          glyphColor: "#f97316",
          scale: 1.1,
        });
        gDropoffMarkerRef.current = new markerLib.AdvancedMarkerElement({
          map,
          position: dropoffCoords,
          title: "Drop-off Location",
          content: pin.element,
        });
      }
    } else if (pickupCoords || dropoffCoords) {
      // If AdvancedMarkerElement is not available, switch smoothly to Leaflet
      setMapType("leaflet");
    }

    // Route calculation with Live Traffic
    if (pickupCoords && dropoffCoords) {
      fetch("/api/routes/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: pickupCoords,
          destination: dropoffCoords,
          pickupDate,
          pickupTime,
        }),
      })
        .then((res) => res.json())
        .then((routeResult) => {
          if (!routeResult || routeResult.error) {
            throw new Error(routeResult?.error || "Routing failed");
          }

          const {
            distanceKm,
            durationMinutes,
            staticDurationMinutes,
            trafficDelayMinutes,
            trafficRatio,
            trafficLevel,
            encodedPolyline,
            tollRoads,
            source,
          } = routeResult;

          // Draw Route Polyline
          let points: Array<{ lat: number; lng: number }> = [];
          if (encodedPolyline) {
            points = decodePolyline(encodedPolyline);
          } else {
            points = [pickupCoords, dropoffCoords];
          }

          if (points.length > 0) {
            if (gPolylineRef.current) gPolylineRef.current.setMap(null);
            gPolylineRef.current = new g.maps.Polyline({
              path: points,
              geodesic: true,
              strokeColor: "#f97316",
              strokeOpacity: 0.9,
              strokeWeight: 6,
              map,
            });

            const bounds = new g.maps.LatLngBounds();
            points.forEach((p) => bounds.extend(p));
            map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
          }

          onDistance({
            km: distanceKm,
            tollRoads: tollRoads || [],
            trafficRatio: trafficRatio || 1.0,
            durationMinutes: staticDurationMinutes || durationMinutes,
            durationInTrafficMinutes: durationMinutes,
            trafficDelayMinutes: trafficDelayMinutes || 0,
            trafficLevel: trafficLevel || "Normal Flow",
            source: source || "google_routes_api",
          });
        })
        .catch((err) => {
          console.warn("Live route fetch error, using fallback:", err);
          const km = calculateHaversineKm(pickupCoords, dropoffCoords);
          const durMins = Math.round((km / 50) * 60);
          onDistance({
            km,
            tollRoads: detectTollsFromText(""),
            trafficRatio: 1.0,
            durationMinutes: durMins,
            durationInTrafficMinutes: durMins,
            trafficDelayMinutes: 0,
            trafficLevel: "Normal Flow",
            source: "haversine",
          });
        });
    } else {
      if (pickupCoords) {
        map.setCenter(pickupCoords);
        map.setZoom(17);
      } else if (dropoffCoords) {
        map.setCenter(dropoffCoords);
        map.setZoom(15);
      }
    }
  }, [pickupCoords, dropoffCoords, pickupDate, pickupTime, mapType, onDistance, onPickupCoordsChange]);

  // ── Initialize Leaflet if Google Maps is not available ──────────────────────
  useEffect(() => {
    if (mapType !== "leaflet" || !mapContainerRef.current || lMapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [MELBOURNE_CENTER.lat, MELBOURNE_CENTER.lng],
      zoom: 11,
      zoomControl: false,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      if (onPickupCoordsChange) {
        onPickupCoordsChange({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    });

    lMapRef.current = map;

    return () => {
      map.remove();
      lMapRef.current = null;
    };
  }, [mapType, onPickupCoordsChange]);

  // Update Leaflet markers + route
  useEffect(() => {
    if (mapType !== "leaflet" || !lMapRef.current) return;
    const map = lMapRef.current;

    if (lPickupMarkerRef.current) { lPickupMarkerRef.current.remove(); lPickupMarkerRef.current = null; }
    if (lDropoffMarkerRef.current) { lDropoffMarkerRef.current.remove(); lDropoffMarkerRef.current = null; }
    if (lRouteLayerRef.current) { lRouteLayerRef.current.remove(); lRouteLayerRef.current = null; }
    if (lAccuracyCircleRef.current) { lAccuracyCircleRef.current.remove(); lAccuracyCircleRef.current = null; }

    if (pickupCoords && typeof accuracyMeters === "number" && accuracyMeters > 0) {
      lAccuracyCircleRef.current = L.circle([pickupCoords.lat, pickupCoords.lng], {
        radius: Math.min(accuracyMeters, 250),
        fillColor: "#f97316",
        fillOpacity: 0.12,
        color: "#ea580c",
        weight: 1.5,
      }).addTo(map);
    }

    if (pickupCoords) {
      lPickupMarkerRef.current = L.circleMarker([pickupCoords.lat, pickupCoords.lng], {
        radius: 8,
        fillColor: "#f97316",
        color: "#ffffff",
        weight: 3,
        opacity: 1,
        fillOpacity: 1,
      }).addTo(map).bindPopup("Pickup Location (Drag or tap map to adjust)");
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
              trafficDelayMinutes: 0,
              trafficLevel: "Normal Flow",
              source: "osrm",
            });
          } else {
            throw new Error("No route found");
          }
        })
        .catch(() => {
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
            trafficDelayMinutes: 0,
            trafficLevel: "Normal Flow",
            source: "haversine",
          });
        });
    } else if (pickupCoords) {
      map.setView([pickupCoords.lat, pickupCoords.lng], 17);
    } else if (dropoffCoords) {
      map.setView([dropoffCoords.lat, dropoffCoords.lng], 14);
    }
  }, [pickupCoords, dropoffCoords, mapType, onDistance]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: "100%", width: "100%", minHeight: "380px" }}
      className="rounded-lg z-0 relative"
    />
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────
interface BookingFormProps {
  initialVehicle?: string;
  showMinimumToast?: boolean;
  showMinimumPopup?: boolean;
}

export function BookingForm({ initialVehicle = "", showMinimumToast = true, showMinimumPopup }: BookingFormProps) {
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
  const [pickupAccuracy, setPickupAccuracy] = useState<number | null>(null);
  const [showFareDialog, setShowFareDialog] = useState(false);
  const [showMinimumDialog, setShowMinimumDialog] = useState(false);
  const [showRateCardDialog, setShowRateCardDialog] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    bookingId: string;
    name: string;
    phone: string;
    pickupAddress: string;
    dropoffAddress: string;
    pickupDate: string;
    pickupTime: string;
    vehicleType: string;
    passengers: number;
    fare?: number;
    paymentMethod: string;
  } | null>(null);
  const pickupInputRef = useRef<AddressInputHandle>(null);
  const dropoffInputRef = useRef<AddressInputHandle>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", phone: "", email: "",
      pickupAddress: "", dropoffAddress: "",
      vehicleType: (initialVehicle || "") as any,
      passengers: 1,
      pickupDate: "",
      pickupTime: "",
      paymentMethod: "" as any,
      isReturn: false, returnDate: "", returnTime: "", notes: ""
    }
  });

  const isReturn = form.watch("isReturn");
  const vehicleType = form.watch("vehicleType");
  const passengers = form.watch("passengers");
  const pickupDate = form.watch("pickupDate");
  const pickupTime = form.watch("pickupTime");
  const paymentMethod = form.watch("paymentMethod");

  const [trafficRatio, setTrafficRatio] = useState<number | undefined>(undefined);
  const handleDistance = useCallback((data: RouteData) => {
    setRouteData(data);
    setDistanceKm(data.km);
    setDetectedTollRoads(data.tollRoads);
    setTrafficRatio(data.trafficRatio);
  }, []);

  // Run fare estimate ONLY once payment method, distance and vehicle are selected
  useEffect(() => {
    if (!paymentMethod || !distanceKm || !vehicleType) {
      setFareEstimate(null);
      return;
    }

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
          passengers: passengers || 1,
          durationMinutes: routeData?.durationMinutes,
          durationInTrafficMinutes: routeData?.durationInTrafficMinutes,
        } as any,
      },
      {
        onSuccess: (data: any) => {
          setFareEstimate({
            total: data.totalFare,
            flagFall: data.flagFall ?? 0,
            distanceCharge: data.distanceCharge ?? 0,
            timeCharge: data.timeCharge ?? 0,
            cpvLevy: data.cpvLevy ?? 1.35,
            minimumFare: data.minimumFare ?? 0,
            vehicleSurcharge: data.vehicleSurcharge ?? 0,
            tollCharges: data.tollCharges ?? 0,
            tollRoads: data.tollRoads ?? [],
            rateLabel: data.rateLabel ?? "Day Rate",
            rateType: data.rateType ?? "day",
            durationMinutes: data.durationMinutes ?? routeData?.durationInTrafficMinutes ?? routeData?.durationMinutes,
            trafficDelayMinutes: data.trafficDelayMinutes ?? routeData?.trafficDelayMinutes ?? 0,
            slowMinutes: data.slowMinutes ?? 0,
            trafficLevel: data.trafficLevel ?? routeData?.trafficLevel ?? "Normal Flow",
            ratesSchedule: data.ratesSchedule ?? {
              flagFall: 5.25,
              perKm: 2.037,
              perMin: 0.713,
            },
          });
          setShowFareDialog(true);
        },
      }
    );
  }, [paymentMethod, distanceKm, vehicleType, passengers, pickupDate, pickupTime, detectedTollRoads, trafficRatio, routeData]);

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

  // Interactive pin adjustment from map drag or map click
  const handlePickupCoordsChange = useCallback(async (newCoords: Coordinates) => {
    setPickupCoords(newCoords);
    setPickupAccuracy(5); // Precision lock on doorstep
    try {
      const res = await fetch(`/api/routes/reverse-geocode?lat=${newCoords.lat}&lng=${newCoords.lng}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.address) {
          pickupInputRef.current?.fill(data.address, newCoords);
          form.setValue("pickupAddress", data.address, { shouldValidate: true });
          toast({ title: "Pickup pin adjusted", description: data.address, duration: 3500 });
        }
      }
    } catch {
      // ignore
    }
  }, [form, toast]);

  // High-accuracy live GPS location detection with multi-sample satellite lock
  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({ title: "Not supported", description: "Your browser doesn't support location access.", variant: "destructive" });
      return;
    }
    setLocating(true);
    toast({ title: "Detecting location...", description: "Locating your current address." });

    let bestPos: GeolocationPosition | null = null;
    let bestAccuracy = Infinity;
    let settled = false;

    const processFinalCoords = async (pos: GeolocationPosition) => {
      if (settled) return;
      settled = true;
      setLocating(false);

      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      const accuracyMeters = Math.round(pos.coords.accuracy || 0);
      setPickupAccuracy(accuracyMeters);

      // 1. Primary: Server reverse geocoding with exact house number + street name
      try {
        const res = await fetch(`/api/routes/reverse-geocode?lat=${coords.lat}&lng=${coords.lng}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.address && typeof data.address === "string" && !data.address.includes("NaN")) {
            setPickupCoords(coords);
            pickupInputRef.current?.fill(data.address, coords);
            form.setValue("pickupAddress", data.address, { shouldValidate: true });
            toast({
              title: "Location detected",
              description: data.address,
              duration: 4000,
            });
            return;
          }
        }
      } catch (serverErr) {
        console.warn("Server reverse geocode notice:", serverErr);
      }

      // 2. Fallback: Direct Nominatim with address details
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1`);
        if (res.ok) {
          const data = await res.json();
          const addr = data.address || {};
          const road = addr.road || addr.street || "";
          const houseNo = addr.house_number || "";
          const suburb = addr.suburb || addr.town || addr.city || "";
          const postcode = addr.postcode || "";
          let formatted = "";
          if (road && suburb) {
            formatted = `${houseNo ? houseNo + " " : ""}${road}, ${suburb} VIC ${postcode}`.trim();
          } else if (data.display_name) {
            formatted = data.display_name.split(", ").slice(0, 4).join(", ");
          }
          if (formatted) {
            setPickupCoords(coords);
            pickupInputRef.current?.fill(formatted, coords);
            form.setValue("pickupAddress", formatted, { shouldValidate: true });
            toast({ title: "Location detected", description: formatted, duration: 4000 });
            return;
          }
        }
      } catch {
        // ignore
      }

      // 3. Safe fallback using actual GPS coordinates
      const fallbackAddress = `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)} (Current Location)`;
      setPickupCoords(coords);
      pickupInputRef.current?.fill(fallbackAddress, coords);
      form.setValue("pickupAddress", fallbackAddress, { shouldValidate: true });
      toast({ title: "Location pinned", description: "Coordinates marked on map.", duration: 4000 });
    };

    let watchId: number | null = null;
    let timeoutTimer: any = null;

    try {
      // 1. Instant high-accuracy location request
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          bestPos = pos;
          bestAccuracy = pos.coords.accuracy;
          if (pos.coords.accuracy <= 35) {
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
            if (timeoutTimer) clearTimeout(timeoutTimer);
            processFinalCoords(pos);
          }
        },
        (err) => {
          console.warn("getCurrentPosition notice:", err);
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 8000 }
      );

      // 2. Refinement watch to lock best satellite fix
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const acc = pos.coords.accuracy;
          if (acc < bestAccuracy) {
            bestPos = pos;
            bestAccuracy = acc;
          }
          if (acc <= 25) {
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
            if (timeoutTimer) clearTimeout(timeoutTimer);
            processFinalCoords(pos);
          }
        },
        (err) => {
          if (!settled && !bestPos) {
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
            if (timeoutTimer) clearTimeout(timeoutTimer);
            setLocating(false);
            if (err.code === err.PERMISSION_DENIED) {
              toast({ title: "Location access denied", description: "Please enable location permission in browser.", variant: "destructive" });
            } else {
              toast({ title: "Location unavailable", description: "Please type your pickup address or tap on the map.", variant: "destructive" });
            }
          }
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 8000 }
      );

      // Finish after 1.8 seconds with the best available position
      timeoutTimer = setTimeout(() => {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        if (!settled) {
          if (bestPos) {
            processFinalCoords(bestPos);
          } else {
            navigator.geolocation.getCurrentPosition(
              (pos) => processFinalCoords(pos),
              (err) => {
                setLocating(false);
                toast({ title: "Could not get location", description: "Please enter your pickup address manually.", variant: "destructive" });
              },
              { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );
          }
        }
      }, 1800);
    } catch {
      navigator.geolocation.getCurrentPosition(
        (pos) => processFinalCoords(pos),
        (err) => {
          setLocating(false);
          toast({ title: "Could not get location", description: "Please enter your pickup address manually.", variant: "destructive" });
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 8000 }
      );
    }
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
          setConfirmedBooking({
            bookingId: res.bookingId || `BMT-${Date.now().toString(36).toUpperCase()}`,
            name: data.name,
            phone: data.phone,
            pickupAddress: data.pickupAddress,
            dropoffAddress: data.dropoffAddress,
            pickupDate: data.pickupDate,
            pickupTime: data.pickupTime,
            vehicleType: data.vehicleType,
            passengers: data.passengers,
            fare: fareEstimate?.total,
            paymentMethod: data.paymentMethod,
          });

          toast({
            title: "Booking Confirmed & Dispatched",
            description: `Reference #${res.bookingId || "BMT"}. Our dispatch team will confirm your driver shortly!`,
          });
          form.reset();
          setPickupCoords(null); setDropoffCoords(null);
          setDistanceKm(null); setFareEstimate(null);
          setPickupAccuracy(null);
        },
        onError: () => {
          toast({ title: "Error", description: "There was a problem submitting your booking. Please call us.", variant: "destructive" });
        }
      }
    );
  };

  const sendWhatsApp = () => {
    const d = form.getValues();
    if (!d.name || !d.phone || !d.pickupAddress || !d.dropoffAddress || !d.vehicleType || !d.pickupDate || !d.pickupTime || !d.paymentMethod || (d.isReturn && (!d.returnDate || !d.returnTime))) {
      toast({
        title: "Please complete required fields",
        description: "All fields including payment option are required (only special notes are optional).",
        variant: "destructive",
      });
      form.trigger();
      return;
    }

    const vehicleLabels: Record<string, string> = {
      sedan: "Sedan", suv: "SUV (+$18)", silver_service: "Silver Service (+$11)",
      six_seater: "6 Seater", maxi_taxi: "Maxi Taxi (+$18)"
    };
    const payLabels: Record<string, string> = {
      cash: "Cash (Pay Driver)",
      card: "Credit / Debit Card",
      cabcharge: "Cabcharge (eTicket / FASTCARD)",
    };
    const msg = [
      "🚖 *BOOKING REQUEST — Melbourne Taxis*", "",
      `👤 Name: ${d.name}`,
      `📞 Phone: ${d.phone}`,
      `📧 Email: ${d.email || "Not provided"}`, "",
      `📍 Pickup: ${d.pickupAddress}`,
      `🏁 Dropoff: ${d.dropoffAddress}`, "",
      `🚗 Vehicle: ${vehicleLabels[d.vehicleType] || d.vehicleType}`,
      `👥 Passengers: ${d.passengers}`,
      `📅 Date: ${d.pickupDate} at ${d.pickupTime}`,
      `💳 Payment: ${payLabels[d.paymentMethod] || d.paymentMethod}`,
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
                    <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <span>Full Name</span>
                      <span className="text-destructive font-black">*</span>
                    </FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} className="bg-input/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <span>Mobile Number</span>
                      <span className="text-destructive font-black">*</span>
                    </FormLabel>
                    <FormControl><Input placeholder="0400 000 000" {...field} className="bg-input/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                    <span>Email Address</span>
                    <span className="text-destructive font-black">*</span>
                  </FormLabel>
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
                  <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                    <span>Pickup Address</span>
                    <span className="text-destructive font-black">*</span>
                  </FormLabel>
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
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="dropoffAddress" render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                    <span>Drop-off Address</span>
                    <span className="text-destructive font-black">*</span>
                  </FormLabel>
                  <FormControl>
                    <AddressInput
                      ref={dropoffInputRef}
                      id="dropoff-address"
                      placeholder="Start typing destination address..."
                      value={field.value}
                      onChange={(address, coords) => {
                        field.onChange(address);
                        setDropoffCoords(coords);
                      }}
                    />
                  </FormControl>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground mr-0.5">Quick Select:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const addr = "Terminal 1, 2, 3 Melbourne Airport, Departure Dr, Melbourne Airport VIC 3045";
                        const coords = { lat: -37.6690, lng: 144.8410 };
                        dropoffInputRef.current?.fill(addr, coords);
                        field.onChange(addr);
                        setDropoffCoords(coords);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold border border-primary/30 transition-colors cursor-pointer"
                    >
                      ✈️ Terminal 1, 2, 3 Melbourne Airport
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const addr = "Terminal 4 Melbourne Airport, Departure Dr, Melbourne Airport VIC 3045";
                        const coords = { lat: -37.6740, lng: 144.8430 };
                        dropoffInputRef.current?.fill(addr, coords);
                        field.onChange(addr);
                        setDropoffCoords(coords);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold border border-border transition-colors cursor-pointer"
                    >
                      ✈️ Terminal 4
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const addr = "Southern Cross Station, Spencer St, Melbourne VIC 3000";
                        const coords = { lat: -37.8184, lng: 144.9525 };
                        dropoffInputRef.current?.fill(addr, coords);
                        field.onChange(addr);
                        setDropoffCoords(coords);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold border border-border transition-colors cursor-pointer"
                    >
                      🚆 Southern Cross / CBD
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="pickupDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <span>Select Date</span>
                      <span className="text-destructive font-black">*</span>
                    </FormLabel>
                    <FormControl><Input type="date" {...field} min={new Date().toISOString().split("T")[0]} className="bg-input/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="pickupTime" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <span>Select Time</span>
                      <span className="text-destructive font-black">*</span>
                    </FormLabel>
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
                    <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <span>Vehicle Type</span>
                      <span className="text-destructive font-black">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger className="bg-input/50"><SelectValue placeholder="Choose vehicle" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sedan">Standard Sedan</SelectItem>
                        <SelectItem value="suv">Premium SUV (+$15)</SelectItem>
                        <SelectItem value="silver_service">Silver Service (+$11)</SelectItem>
                        <SelectItem value="six_seater">6 Seater People Mover (+$21.50)</SelectItem>
                        <SelectItem value="maxi_taxi">Maxi Taxi (+$21.50)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="passengers" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <span>Passengers</span>
                      <span className="text-destructive font-black">*</span>
                    </FormLabel>
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
                      <FormLabel className="uppercase text-xs font-bold text-primary tracking-wider flex items-center gap-1">
                        <span>Return Date</span>
                        <span className="text-destructive font-black">*</span>
                      </FormLabel>
                      <FormControl><Input type="date" {...field} className="bg-input/50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="returnTime" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-primary tracking-wider flex items-center gap-1">
                        <span>Return Time</span>
                        <span className="text-destructive font-black">*</span>
                      </FormLabel>
                      <FormControl><TimePicker value={field.value} onChange={field.onChange} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider flex items-center justify-between">
                    <span>Special Notes</span>
                    <span className="text-muted-foreground font-normal lowercase tracking-normal text-[11px]">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Flight number, child seat required, bulky luggage..." className="resize-none bg-input/50 h-24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Payment Option */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="text-xl font-black uppercase tracking-wide flex items-center gap-1.5">
                  <span>Payment Option</span>
                  <span className="text-destructive font-black">*</span>
                </h3>
                <span className="text-xs text-muted-foreground font-semibold">Select to reveal fare estimate</span>
              </div>

              <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Cash */}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange("cash");
                          if (!distanceKm || !vehicleType) {
                            toast({
                              title: "Payment selected: Cash",
                              description: "Please ensure pickup, drop-off address and vehicle are chosen above to calculate fare.",
                            });
                          }
                        }}
                        className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                          field.value === "cash"
                            ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary"
                            : "border-border bg-card/60 hover:bg-secondary/60 hover:border-muted-foreground/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="h-10 flex items-center">
                            <span className="text-2xl">💵</span>
                          </div>
                          {field.value === "cash" ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-muted-foreground/40" />
                          )}
                        </div>
                        <div>
                          <div className="font-black text-sm uppercase tracking-wide text-foreground">Cash</div>
                          <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">Pay driver directly with cash on trip</div>
                        </div>
                      </button>

                      {/* Credit / Debit Card */}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange("card");
                          if (!distanceKm || !vehicleType) {
                            toast({
                              title: "Payment selected: Credit / Debit Card",
                              description: "Please ensure pickup, drop-off address and vehicle are chosen above to calculate fare.",
                            });
                          }
                        }}
                        className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                          field.value === "card"
                            ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary"
                            : "border-border bg-card/60 hover:bg-secondary/60 hover:border-muted-foreground/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="h-10 flex items-center">
                            <span className="text-2xl">💳</span>
                          </div>
                          {field.value === "card" ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-muted-foreground/40" />
                          )}
                        </div>
                        <div>
                          <div className="font-black text-sm uppercase tracking-wide text-foreground">Credit / Debit Card</div>
                          <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">Visa, Mastercard, AMEX, EFTPOS, Apple & Google Pay</div>
                        </div>
                      </button>

                      {/* Cabcharge */}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange("cabcharge");
                          if (!distanceKm || !vehicleType) {
                            toast({
                              title: "Payment selected: Cabcharge",
                              description: "Please ensure pickup, drop-off address and vehicle are chosen above to calculate fare.",
                            });
                          }
                        }}
                        className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                          field.value === "cabcharge"
                            ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary"
                            : "border-border bg-card/60 hover:bg-secondary/60 hover:border-muted-foreground/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="h-10 flex items-center">
                            <CabchargeIcon className="w-16 h-10 drop-shadow-md rounded" />
                          </div>
                          {field.value === "cabcharge" ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-muted-foreground/40" />
                          )}
                        </div>
                        <div>
                          <div className="font-black text-sm uppercase tracking-wide text-foreground flex items-center gap-1.5">
                            <span>Cabcharge</span>
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">eTicket</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">eTicket, FASTCARD, Digital Pass & corporate taxi charge</div>
                        </div>
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-bold text-destructive mt-1.5" />
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
            onPickupCoordsChange={handlePickupCoordsChange}
            accuracyMeters={pickupAccuracy}
          />
          {pickupCoords && (
            <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-sm border border-border rounded-md px-3 py-1.5 text-xs font-semibold z-10 flex items-center gap-2 shadow-sm text-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span>Drag pin or tap map to adjust doorstep</span>
            </div>
          )}
          {distanceKm && (
            <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm border border-border rounded-md px-3 py-1.5 text-xs font-bold z-10">
              📏 {distanceKm.toFixed(1)} km driving distance
            </div>
          )}
        </div>

        {fareEstimate ? (
          <Card className="bg-card border-primary/50 shadow-md">
            <CardContent className="p-5 space-y-2">
              {/* Total Fare Display */}
              <div className="text-center py-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estimated Fare</p>
                <div className="text-4xl sm:text-5xl font-black text-primary my-1">${fareEstimate.total.toFixed(2)}</div>
                <div className="text-xs font-medium text-muted-foreground mt-1">
                  Includes toll charges.
                </div>
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
                <p className="font-bold uppercase tracking-wide text-foreground">
                  {!paymentMethod
                    ? (distanceKm && vehicleType ? "Select Payment Option to View Fare" : "Live Fare Estimator")
                    : (distanceKm && !vehicleType ? "Choose Vehicle to View Fare" : "Live Fare Estimator")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {!paymentMethod
                    ? (distanceKm && vehicleType
                        ? "Select your payment option (Cash, Card, or Cabcharge) below to view your exact regulated fare estimate."
                        : "Enter pickup and drop-off addresses, select your vehicle, and choose a payment method to calculate your live regulated fare.")
                    : (distanceKm && !vehicleType
                        ? `Route calculated (${distanceKm.toFixed(1)} km). Please choose your vehicle above to view your exact live traffic fare.`
                        : "Enter pickup and drop-off addresses to get a real-time fare calculation with live traffic and regulated rates.")}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Fare Estimate Popup Dialog (Exact Screenshot Layout) ── */}
      <Dialog open={showFareDialog} onOpenChange={setShowFareDialog}>
        <DialogContent className="sm:max-w-md p-6 bg-card border-border shadow-2xl">
          <DialogHeader className="text-left space-y-1.5">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              Your Fare Estimate
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-normal">
              Includes toll charges.
            </DialogDescription>
          </DialogHeader>

          <div className="my-5 p-6 rounded-xl bg-secondary/50 border border-border text-center space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              ESTIMATED TOTAL
            </p>
            <div className="text-5xl font-black text-primary tracking-tight">
              ${fareEstimate?.total.toFixed(2)}
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:gap-2 pt-1">
            <Button
              className="w-full h-12 font-bold text-base uppercase tracking-wide bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setShowFareDialog(false);
                const submitBtn = document.querySelector('[data-testid="btn-submit-booking"]');
                if (submitBtn) {
                  submitBtn.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
            >
              Book This Ride
            </Button>
            <Button
              variant="outline"
              className="w-full h-11 font-semibold text-foreground hover:bg-secondary"
              onClick={() => setShowFareDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
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
              Regulated maximum taxi fares for Metropolitan Melbourne, Frankston, Dandenong &amp; Mornington Peninsula. Time or distance tariff structure (crossover speed 21 km/h).
            </p>

            {/* Rate Schedules Table */}
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-secondary/50 border border-border space-y-1">
                <div className="flex justify-between font-bold text-foreground">
                  <span>Day Rate (9:00 AM – 5:00 PM)</span>
                  <span className="text-primary font-black">$5.25 flagfall</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Distance rate (speed &gt; 21 km/h):</span>
                  <span className="font-semibold text-foreground">$2.037 / km</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Time charge (speed &lt; 21 km/h):</span>
                  <span className="font-semibold text-foreground">$0.713 / min ($42.78/hr)</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-secondary/50 border border-border space-y-1">
                <div className="flex justify-between font-bold text-foreground">
                  <span>Overnight Rate (5:00 PM – 9:00 AM)</span>
                  <span className="text-primary font-black">$6.55 flagfall</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Distance rate (speed &gt; 21 km/h):</span>
                  <span className="font-semibold text-foreground">$2.265 / km</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Time charge (speed &lt; 21 km/h):</span>
                  <span className="font-semibold text-foreground">$0.792 / min ($47.52/hr)</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-secondary/50 border border-border space-y-1">
                <div className="flex justify-between font-bold text-foreground">
                  <span>Peak Rate (10:00 PM – 4:00 AM Fri &amp; Sat, plus Holidays)</span>
                  <span className="text-primary font-black">$7.80 flagfall</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Distance rate (speed &gt; 21 km/h):</span>
                  <span className="font-semibold text-foreground">$2.493 / km</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Time charge (speed &lt; 21 km/h):</span>
                  <span className="font-semibold text-foreground">$0.872 / min ($52.32/hr)</span>
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
                <span className="font-bold text-foreground">$21.50</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>CPV Government Levy Recovery Fee</span>
                <span className="font-bold text-foreground">$1.40</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Silver Service / Luxury Premium</span>
                <span className="font-bold text-foreground">$11.00</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Premium SUV Surcharge</span>
                <span className="font-bold text-foreground">$15.00</span>
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

      {/* ── Booking Submission Confirmation Dialog (100% In-App, Zero Third-Party) ── */}
      <Dialog open={!!confirmedBooking} onOpenChange={(open) => { if (!open) setConfirmedBooking(null); }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border shadow-2xl p-6">
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-wide text-foreground">
              Booking Confirmed
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Your ride is registered directly with our Melbourne dispatch team.
            </DialogDescription>
          </DialogHeader>

          {confirmedBooking && (
            <div className="space-y-4 pt-2">
              {/* Reference ID Banner */}
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-widest block">Booking Reference</span>
                <span className="text-2xl font-black text-primary tracking-wider font-mono">{confirmedBooking.bookingId}</span>
              </div>

              {/* Ride Summary Table */}
              <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2.5 text-sm">
                <div className="flex justify-between items-start gap-2 border-b border-border/50 pb-2">
                  <span className="text-muted-foreground text-xs uppercase font-bold">Passenger</span>
                  <span className="font-bold text-foreground text-right">{confirmedBooking.name} ({confirmedBooking.phone})</span>
                </div>
                <div className="flex justify-between items-start gap-2 border-b border-border/50 pb-2">
                  <span className="text-muted-foreground text-xs uppercase font-bold">Pickup</span>
                  <span className="font-medium text-foreground text-right">{confirmedBooking.pickupAddress}</span>
                </div>
                <div className="flex justify-between items-start gap-2 border-b border-border/50 pb-2">
                  <span className="text-muted-foreground text-xs uppercase font-bold">Dropoff</span>
                  <span className="font-medium text-foreground text-right">{confirmedBooking.dropoffAddress}</span>
                </div>
                <div className="flex justify-between items-center gap-2 border-b border-border/50 pb-2">
                  <span className="text-muted-foreground text-xs uppercase font-bold">Schedule</span>
                  <span className="font-bold text-primary text-right">{confirmedBooking.pickupDate} at {confirmedBooking.pickupTime}</span>
                </div>
                <div className="flex justify-between items-center gap-2 border-b border-border/50 pb-2">
                  <span className="text-muted-foreground text-xs uppercase font-bold">Vehicle & Guests</span>
                  <span className="font-medium text-foreground capitalize text-right">{confirmedBooking.vehicleType.replace("_", " ")} · {confirmedBooking.passengers} pass</span>
                </div>
                {confirmedBooking.fare && (
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-muted-foreground text-xs uppercase font-bold">Est. Fare</span>
                    <span className="text-lg font-black text-primary text-right">${confirmedBooking.fare.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Direct Support & Action Buttons */}
              <div className="p-3 rounded-lg bg-secondary/50 border border-border text-center space-y-1">
                <p className="text-xs text-muted-foreground">Need urgent adjustments or immediate pickup?</p>
                <a
                  href="tel:0435304821"
                  className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1.5"
                >
                  📞 Direct 24/7 Melbourne Dispatch: 0435 304 821
                </a>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
                <a
                  href="tel:0435304821"
                  className="w-full sm:w-1/2 inline-flex items-center justify-center h-11 rounded-md font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                >
                  Call Dispatch
                </a>
                <Button
                  variant="outline"
                  className="w-full sm:w-1/2 h-11 font-bold uppercase tracking-wider text-sm"
                  onClick={() => setConfirmedBooking(null)}
                >
                  Done
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}

