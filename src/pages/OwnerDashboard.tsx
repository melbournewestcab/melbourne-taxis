import React, { useState, useEffect, useCallback } from "react";
import {
  Car,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  ExternalLink,
  Shield,
  Trash2,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  LogOut,
  Bell,
  Volume2,
  VolumeX,
  Settings,
  Mail,
  Save,
  FileText,
  Key,
} from "lucide-react";

const ADMIN_SECRET_KEY = "bmt_owner_secret";

export interface BookingRecord {
  bookingId: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDate: string;
  pickupTime: string;
  isReturn?: boolean;
  returnDate?: string;
  returnTime?: string;
  vehicleType: string;
  passengers: number;
  distanceKm?: number;
  estimatedFare?: number;
  paymentMethod: string;
  notes?: string;
  status: "dispatched" | "confirmed" | "completed" | "cancelled";
}

export interface DispatchSettings {
  ownerEmails: string;
  dispatchPhone: string;
  whatsappNumber: string;
  emailUser?: string;
  emailPass?: string;
  hasEmailPass?: boolean;
  smtpHost?: string;
  smtpPort?: number;
  updatedAt?: string;
}

interface VisitorRow {
  id: number;
  ip: string;
  page: string;
  referrer: string;
  userAgent: string;
  timestamp: string;
}

interface PageStat {
  page: string;
  visits: number;
}

interface AdminData {
  total: number;
  uniqueIps: number;
  topPages: PageStat[];
  visitors: VisitorRow[];
}

function parseDevice(ua: string): string {
  if (!ua) return "Unknown";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Android/.test(ua)) return "Android";
  if (/Windows/.test(ua)) return "Windows";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Other";
}

function parseBrowser(ua: string): string {
  if (!ua) return "Unknown";
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return "Safari";
  return "Other";
}

function formatMelbourneTime(ts: string): string {
  try {
    return new Date(ts).toLocaleString("en-AU", {
      timeZone: "Australia/Melbourne",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return ts;
  }
}

export default function OwnerDashboard() {
  const [secret, setSecret] = useState(() => sessionStorage.getItem(ADMIN_SECRET_KEY) || "");
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"bookings" | "visitors" | "settings">("bookings");

  // Dispatch & Email Settings state (zero third-party, file-persisted)
  const [settings, setSettings] = useState<DispatchSettings>({
    ownerEmails: "p2839582@gmail.com",
    dispatchPhone: "0435304821",
    whatsappNumber: "61435304821",
    emailUser: "p2839582@gmail.com",
    emailPass: "",
    hasEmailPass: false,
    smtpHost: "smtp.gmail.com",
    smtpPort: 465,
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState("");

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings/settings");
      if (res.ok) {
        const json = await res.json();
        if (json.settings) {
          setSettings(prev => ({ ...prev, ...json.settings }));
        }
      }
    } catch (e) {
      console.error("Failed to load dispatch settings", e);
    }
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsSavedMessage("");
    try {
      const res = await fetch("/api/bookings/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const json = await res.json();
        setSettingsSavedMessage("✅ Dispatch settings saved to dispatch-settings.json successfully!");
        if (json.settings) {
          setSettings(prev => ({ ...prev, ...json.settings }));
        }
        setTimeout(() => setSettingsSavedMessage(""), 5000);
      } else {
        setSettingsSavedMessage("❌ Failed to save settings");
      }
    } catch (e) {
      console.error("Failed to save settings", e);
      setSettingsSavedMessage("❌ Server connection error");
    } finally {
      setSettingsLoading(false);
    }
  };

  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailMessage, setTestEmailMessage] = useState("");

  const handleSendTestEmail = async () => {
    setTestEmailLoading(true);
    setTestEmailMessage("");
    try {
      const res = await fetch("/api/bookings/test-email", { method: "POST" });
      const json = await res.json();
      if (res.ok && json.success) {
        setTestEmailMessage(`✅ ${json.message}`);
      } else {
        setTestEmailMessage(`❌ ${json.error || "Failed to send test email"}`);
      }
    } catch (e: any) {
      setTestEmailMessage(`❌ Connection error: ${e.message}`);
    } finally {
      setTestEmailLoading(false);
    }
  };

  // Bookings state
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingSearch, setBookingSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastBookingCount, setLastBookingCount] = useState<number | null>(null);

  // Visitors state
  const [visitorData, setVisitorData] = useState<AdminData | null>(null);
  const [visitorError, setVisitorError] = useState("");
  const [visitorLoading, setVisitorLoading] = useState(false);
  const [visitorPage, setVisitorPage] = useState(1);
  const [visitorSearch, setVisitorSearch] = useState("");
  const visitorLimit = 50;

  // Sound chime on new booking
  const playChime = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (_) {}
  }, []);

  // Fetch Bookings
  const fetchBookings = useCallback(async () => {
    setBookingsLoading(true);
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const json = await res.json();
        const list: BookingRecord[] = json.bookings || [];
        setBookings(list);
        if (lastBookingCount !== null && list.length > lastBookingCount && soundEnabled) {
          playChime();
        }
        setLastBookingCount(list.length);
      }
    } catch (e) {
      console.error("Failed to load bookings", e);
    } finally {
      setBookingsLoading(false);
    }
  }, [lastBookingCount, soundEnabled, playChime]);

  // Fetch Visitors
  const fetchVisitors = useCallback(async (sec: string, pg: number) => {
    setVisitorLoading(true);
    setVisitorError("");
    try {
      const res = await fetch(`/api/visitors/?secret=${encodeURIComponent(sec)}&page=${pg}&limit=${visitorLimit}`);
      if (res.status === 401) {
        setVisitorError("Invalid password.");
        setSecret("");
        sessionStorage.removeItem(ADMIN_SECRET_KEY);
        setVisitorLoading(false);
        return;
      }
      const json = await res.json();
      setVisitorData(json);
    } catch {
      setVisitorError("Failed to load visitor data.");
    } finally {
      setVisitorLoading(false);
    }
  }, [visitorLimit]);

  useEffect(() => {
    if (secret) {
      fetchBookings();
      fetchSettings();
      fetchVisitors(secret, visitorPage);
    }
  }, [secret, visitorPage, fetchBookings, fetchSettings, fetchVisitors]);

  // Polling for live bookings
  useEffect(() => {
    if (!secret || !autoRefresh) return;
    const interval = setInterval(() => {
      fetchBookings();
    }, 10000);
    return () => clearInterval(interval);
  }, [secret, autoRefresh, fetchBookings]);

  const updateBookingStatus = async (id: string, status: BookingRecord["status"]) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.bookingId === id ? { ...b, status } : b));
      }
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm(`Delete booking #${id}?`)) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBookings(prev => prev.filter(b => b.bookingId !== id));
      }
    } catch (e) {
      console.error("Failed to delete booking", e);
    }
  };

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem(ADMIN_SECRET_KEY, input);
    setSecret(input);
    setInput("");
  }

  if (!secret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-4 font-sans">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-[#161616] border-2 border-primary rounded-xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold">
              🚖
            </div>
            <h2 className="text-2xl font-black text-foreground uppercase tracking-wide">Owner Dispatch Portal</h2>
            <p className="text-xs text-muted-foreground">Bacchus Marsh Taxi & Melbourne Airport Transfers</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider block">Access Password</label>
            <input
              type="password"
              placeholder="Enter owner secret"
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
              className="w-full px-4 py-3 rounded-lg border border-border bg-[#101010] text-foreground text-sm focus:outline-none focus:border-primary"
            />
          </div>
          {visitorError && <div className="text-red-400 text-xs font-semibold">{visitorError}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-wider text-sm transition-all"
          >
            Access Dispatch & Stats
          </button>
        </form>
      </div>
    );
  }

  // Filter Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const q = bookingSearch.toLowerCase();
    const matchesSearch =
      !q ||
      b.bookingId.toLowerCase().includes(q) ||
      b.name.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q) ||
      b.pickupAddress.toLowerCase().includes(q) ||
      b.dropoffAddress.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Booking metrics
  const activeBookingsCount = bookings.filter(b => b.status === "dispatched" || b.status === "confirmed").length;
  const completedCount = bookings.filter(b => b.status === "completed").length;
  const totalRevenueEst = bookings.reduce((sum, b) => sum + (Number(b.estimatedFare) || 0), 0);

  // Visitors filter
  const filteredVisitors = (visitorData?.visitors ?? []).filter(v =>
    !visitorSearch ||
    v.ip.includes(visitorSearch) ||
    v.page.includes(visitorSearch) ||
    v.referrer.includes(visitorSearch)
  );
  const totalVisitorPages = visitorData ? Math.ceil(visitorData.total / visitorLimit) : 1;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground font-sans antialiased p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚖</span>
              <h1 className="text-2xl font-black uppercase tracking-wider text-foreground">
                Melbourne Taxis <span className="text-primary font-normal text-lg">· Dispatch & Admin</span>
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Direct dispatch center for live online bookings, flight pickups, and website visitor tracking.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                fetchBookings();
                if (secret) fetchVisitors(secret, visitorPage);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border text-xs font-bold hover:bg-muted transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${bookingsLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>

            <button
              onClick={() => {
                sessionStorage.removeItem(ADMIN_SECRET_KEY);
                setSecret("");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/40 border border-red-900/50 text-red-300 text-xs font-bold hover:bg-red-900/60 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-5 py-3 text-sm font-black uppercase tracking-wider transition-all border-b-2 inline-flex items-center gap-2 ${
              activeTab === "bookings"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Car className="w-4 h-4" />
            Bookings & Dispatch
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("visitors")}
            className={`px-5 py-3 text-sm font-black uppercase tracking-wider transition-all border-b-2 inline-flex items-center gap-2 ${
              activeTab === "visitors"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="w-4 h-4" />
            Visitor Analytics
            {visitorData && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-muted text-foreground">
                {visitorData.total}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-5 py-3 text-sm font-black uppercase tracking-wider transition-all border-b-2 inline-flex items-center gap-2 ${
              activeTab === "settings"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="w-4 h-4" />
            Dispatch &amp; Email Settings
          </button>
        </div>

        {/* ── TAB 1: BOOKINGS & DISPATCH ── */}
        {activeTab === "bookings" && (
          <div className="space-y-6">

            {/* Arrival Destination Banner */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">📬</span>
                <div>
                  <span className="font-bold text-foreground">Booking Arrival Destinations:</span>{" "}
                  <span className="text-muted-foreground">
                    1. Live on this screen (with chime) · 2. Saved in <code className="text-primary font-mono">bookings-store.json</code> · 3. Dispatched to <strong className="text-primary font-mono">{settings.ownerEmails}</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("settings")}
                className="inline-flex items-center gap-1 font-bold text-primary hover:underline uppercase text-[11px] whitespace-nowrap self-start sm:self-auto"
              >
                <Settings className="w-3.5 h-3.5" />
                Configure Details →
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-xl p-4 space-y-1">
                <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                  Total Bookings
                  <Car className="w-4 h-4 text-primary" />
                </div>
                <div className="text-3xl font-black text-foreground font-mono">{bookings.length}</div>
                <p className="text-[11px] text-muted-foreground">Stored directly on server</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 space-y-1">
                <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                  Active / Pending
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-black text-amber-400 font-mono">{activeBookingsCount}</div>
                <p className="text-[11px] text-muted-foreground">Requiring driver or active</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 space-y-1">
                <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                  Completed
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-3xl font-black text-emerald-400 font-mono">{completedCount}</div>
                <p className="text-[11px] text-muted-foreground">Successfully fulfilled</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 space-y-1">
                <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                  Est. Revenue
                  <DollarSign className="w-4 h-4 text-primary" />
                </div>
                <div className="text-3xl font-black text-primary font-mono">${totalRevenueEst.toFixed(0)}</div>
                <p className="text-[11px] text-muted-foreground">Combined fare value</p>
              </div>
            </div>

            {/* Notification & Auto-refresh banner */}
            <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-foreground">
                  Live Dispatch Stream Active · Bookings arrive here in real time.
                </span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    soundEnabled
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                  title={soundEnabled ? "Audio chimes on new booking" : "Muted"}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  {soundEnabled ? "Chime On" : "Chime Off"}
                </button>

                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    autoRefresh
                      ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? "animate-spin" : ""}`} />
                  {autoRefresh ? "Auto-Refresh (10s)" : "Paused"}
                </button>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search passenger, phone, reference, address..."
                  value={bookingSearch}
                  onChange={e => setBookingSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {["all", "dispatched", "confirmed", "completed", "cancelled"].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                      statusFilter === st
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-12 text-center space-y-3">
                <Car className="w-12 h-12 mx-auto text-muted-foreground/50" />
                <h3 className="text-lg font-bold text-foreground">No bookings found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {bookingSearch || statusFilter !== "all"
                    ? "Try adjusting your search query or status filter."
                    : "Submitted customer bookings will appear here immediately upon completion of the booking form."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map(b => {
                  const statusColors: Record<string, string> = {
                    dispatched: "bg-amber-500/20 text-amber-300 border-amber-500/40",
                    confirmed: "bg-blue-500/20 text-blue-300 border-blue-500/40",
                    completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
                    cancelled: "bg-red-500/20 text-red-300 border-red-500/40",
                  };

                  const cleanPhone = b.phone.replace(/[^0-9+]/g, "");
                  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                    b.pickupAddress
                  )}&destination=${encodeURIComponent(b.dropoffAddress)}`;

                  const whatsappText = encodeURIComponent(
                    `Hello ${b.name}, this is Melbourne Taxis dispatch confirming your booking #${b.bookingId} for ${b.pickupDate} at ${b.pickupTime}.`
                  );

                  return (
                    <div
                      key={b.bookingId}
                      className="bg-card border border-border rounded-xl p-5 shadow-lg space-y-4 transition-all hover:border-border/80"
                    >
                      {/* Top Header of Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-base font-black text-primary tracking-wide">
                            #{b.bookingId}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                              statusColors[b.status] || "bg-muted text-foreground"
                            }`}
                          >
                            {b.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Booked: {formatMelbourneTime(b.createdAt)}
                          </span>
                        </div>

                        {/* Status Change Selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground uppercase">Status:</span>
                          <select
                            value={b.status}
                            onChange={e => updateBookingStatus(b.bookingId, e.target.value as any)}
                            className="bg-[#121212] border border-border text-foreground text-xs rounded-lg px-2.5 py-1 font-bold focus:outline-none focus:border-primary"
                          >
                            <option value="dispatched">Dispatched</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() => deleteBooking(b.bookingId)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-950/40 transition-colors"
                            title="Delete booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Main Booking Content */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Col 1: Passenger */}
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                            Passenger Details
                          </div>
                          <div className="text-base font-black text-foreground">{b.name}</div>
                          <div className="text-sm font-mono text-primary font-bold">{b.phone}</div>
                          {b.email && (
                            <div className="text-xs text-muted-foreground truncate">{b.email}</div>
                          )}

                          <div className="flex items-center gap-2 pt-2">
                            <a
                              href={`tel:${cleanPhone}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-wider"
                            >
                              <Phone className="w-3 h-3" />
                              Call
                            </a>
                            <a
                              href={`https://wa.me/${cleanPhone.replace(/^\+/, "")}?text=${whatsappText}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider"
                            >
                              <MessageSquare className="w-3 h-3" />
                              WhatsApp
                            </a>
                          </div>
                        </div>

                        {/* Col 2: Route & Addresses */}
                        <div className="space-y-2 md:col-span-1">
                          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                            Pickup & Destination
                          </div>
                          <div className="text-xs space-y-1.5">
                            <div className="flex items-start gap-1.5">
                              <span className="text-primary font-bold">📍</span>
                              <span className="text-foreground font-medium">{b.pickupAddress}</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <span className="text-red-400 font-bold">🏁</span>
                              <span className="text-foreground font-medium">{b.dropoffAddress}</span>
                            </div>
                          </div>

                          <div className="pt-1">
                            <a
                              href={mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Open Route in Google Maps
                            </a>
                          </div>
                        </div>

                        {/* Col 3: Timing, Vehicle & Fare */}
                        <div className="space-y-2 bg-[#121212] border border-border/60 rounded-lg p-3">
                          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                            Schedule & Fare
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Pickup Time:</span>
                            <span className="font-bold text-primary font-mono">{b.pickupDate} at {b.pickupTime}</span>
                          </div>
                          {b.isReturn && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground">Return Trip:</span>
                              <span className="font-bold text-foreground font-mono">{b.returnDate} at {b.returnTime}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Vehicle:</span>
                            <span className="font-bold text-foreground capitalize">{b.vehicleType.replace("_", " ")} ({b.passengers} pax)</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Payment:</span>
                            <span className="font-bold text-foreground capitalize">{b.paymentMethod}</span>
                          </div>
                          {b.estimatedFare && (
                            <div className="flex justify-between items-center text-xs pt-1 border-t border-border/50">
                              <span className="font-bold text-foreground">Estimated Fare:</span>
                              <span className="text-base font-black text-primary font-mono">${Number(b.estimatedFare).toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Special Notes if any */}
                      {b.notes && (
                        <div className="p-2.5 rounded-lg bg-secondary/30 border border-border/60 text-xs">
                          <span className="font-bold text-primary uppercase text-[10px] tracking-wider block mb-0.5">
                            Customer Notes:
                          </span>
                          <p className="text-foreground italic">{b.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: VISITOR ANALYTICS ── */}
        {activeTab === "visitors" && (
          <div className="space-y-6">
            {visitorLoading && !visitorData && (
              <div className="text-center py-12 text-muted-foreground text-sm">Loading visitor analytics...</div>
            )}

            {visitorData && (
              <>
                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-card border border-border rounded-xl p-5 space-y-1">
                    <div className="text-2xl mb-1">👁</div>
                    <div className="text-3xl font-black text-primary font-mono">{visitorData.total.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Page Views</div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-5 space-y-1">
                    <div className="text-2xl mb-1">🌐</div>
                    <div className="text-3xl font-black text-primary font-mono">{visitorData.uniqueIps?.toLocaleString() ?? "—"}</div>
                    <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Unique IP Addresses</div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-5 space-y-1">
                    <div className="text-2xl mb-1">📄</div>
                    <div className="text-3xl font-black text-primary font-mono">{visitorData.topPages?.length ?? "—"}</div>
                    <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Distinct Pages Tracked</div>
                  </div>
                </div>

                {/* Top pages */}
                {visitorData.topPages?.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                    <div className="text-sm font-bold text-foreground uppercase tracking-wider">Top Pages Visited</div>
                    <div className="flex flex-wrap gap-2">
                      {visitorData.topPages.map(p => (
                        <div
                          key={p.page}
                          className="bg-[#121212] border border-border rounded-full px-3.5 py-1 text-xs flex items-center gap-2"
                        >
                          <span className="text-muted-foreground">{p.page || "/"}</span>
                          <span className="bg-primary text-primary-foreground font-black px-2 py-0.2 rounded-full text-[10px]">
                            {p.visits}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visitor Search */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search by IP, page, referrer..."
                      value={visitorSearch}
                      onChange={e => setVisitorSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-[#141414] text-muted-foreground uppercase tracking-wider font-bold">
                          <th className="py-3 px-4">#</th>
                          <th className="py-3 px-4">IP Address</th>
                          <th className="py-3 px-4">Page</th>
                          <th className="py-3 px-4">Referrer</th>
                          <th className="py-3 px-4">Device</th>
                          <th className="py-3 px-4">Browser</th>
                          <th className="py-3 px-4">Time (Melbourne)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {filteredVisitors.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-muted-foreground">
                              No visitors logged yet.
                            </td>
                          </tr>
                        ) : (
                          filteredVisitors.map((v, i) => (
                            <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-3 px-4 text-muted-foreground">{(visitorPage - 1) * visitorLimit + i + 1}</td>
                              <td className="py-3 px-4 font-mono font-bold text-primary">{v.ip}</td>
                              <td className="py-3 px-4 text-foreground max-w-[180px] truncate">{v.page}</td>
                              <td className="py-3 px-4 text-muted-foreground max-w-[160px] truncate">
                                {v.referrer ? (
                                  <a href={v.referrer} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                    {v.referrer.replace(/^https?:\/\//, "").substring(0, 35)}
                                  </a>
                                ) : (
                                  <span>Direct</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">{parseDevice(v.userAgent)}</td>
                              <td className="py-3 px-4 text-muted-foreground">{parseBrowser(v.userAgent)}</td>
                              <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{formatMelbourneTime(v.timestamp)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalVisitorPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-border bg-[#121212]">
                      <button
                        onClick={() => setVisitorPage(p => Math.max(1, p - 1))}
                        disabled={visitorPage === 1}
                        className="px-3 py-1.5 rounded-lg border border-border text-xs font-bold disabled:opacity-40"
                      >
                        ← Prev
                      </button>
                      <span className="text-xs text-muted-foreground">
                        Page {visitorPage} of {totalVisitorPages}
                      </span>
                      <button
                        onClick={() => setVisitorPage(p => Math.min(totalVisitorPages, p + 1))}
                        disabled={visitorPage === totalVisitorPages}
                        className="px-3 py-1.5 rounded-lg border border-border text-xs font-bold disabled:opacity-40"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── TAB 3: DISPATCH & EMAIL SETTINGS (100% FIRST-PARTY) ── */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-4xl">
            {/* Header info */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-wider text-foreground">
                    Dispatch &amp; Notification Settings
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Manage where submitted bookings arrive and configure direct email dispatch without third-party services.
                  </p>
                </div>
              </div>

              {/* Status pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#121212] border border-border rounded-lg p-3">
                  <div className="text-[11px] uppercase font-bold text-muted-foreground">Active Storage File</div>
                  <div className="text-sm font-bold font-mono text-primary mt-0.5">bookings-store.json</div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Permanent on server
                  </div>
                </div>

                <div className="bg-[#121212] border border-border rounded-lg p-3">
                  <div className="text-[11px] uppercase font-bold text-muted-foreground">Settings Config File</div>
                  <div className="text-sm font-bold font-mono text-primary mt-0.5">dispatch-settings.json</div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Auto-sync with server
                  </div>
                </div>

                <div className="bg-[#121212] border border-border rounded-lg p-3">
                  <div className="text-[11px] uppercase font-bold text-muted-foreground">Direct Gmail SMTP</div>
                  <div className="text-sm font-bold font-mono text-foreground mt-0.5">
                    {settings.hasEmailPass ? "Ready & Authenticated" : "Awaiting App Password"}
                  </div>
                  <div className={`text-[11px] mt-1 flex items-center gap-1 ${settings.hasEmailPass ? "text-emerald-400" : "text-amber-400"}`}>
                    {settings.hasEmailPass ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {settings.hasEmailPass ? "TLS encrypted via smtp.gmail.com" : "Optional for email alerts"}
                  </div>
                </div>
              </div>
            </div>

            {/* Arrival Destinations Summary Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Where Do Submitted Bookings Arrive?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-[#141414] border border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <span>🚖</span> 1. Live Owner Dispatch Panel
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Arrives instantly in this dashboard (<code className="text-primary font-mono">/bmt-owner-panel</code>) with audio chime alert and complete passenger &amp; route details.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#141414] border border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <span>💾</span> 2. Server Disk Storage
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Permanently archived in <code className="text-primary font-mono">bookings-store.json</code> on your Node.js backend. Zero third-party relay needed.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#141414] border border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <span>📧</span> 3. Direct Email Inboxes
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Sent directly to: <strong className="text-foreground">{settings.ownerEmails}</strong> using first-party SMTP to Google's official servers.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#141414] border border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <span>💬</span> 4. Instant WhatsApp &amp; Direct Call
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    One-touch button to call the passenger directly or open pre-formatted WhatsApp dispatch to <strong className="text-foreground">+{settings.whatsappNumber}</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Settings Form */}
            <form onSubmit={handleSaveSettings} className="bg-card border border-border rounded-xl p-6 shadow-lg space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Edit &amp; Save Details in File
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Updates will be written to <code className="text-primary font-mono">dispatch-settings.json</code> and applied immediately.
                  </p>
                </div>
                {settingsSavedMessage && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg animate-fade-in">
                    {settingsSavedMessage}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Notification Emails */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    Target Dispatch Emails (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={settings.ownerEmails}
                    onChange={e => setSettings({ ...settings, ownerEmails: e.target.value })}
                    placeholder="p2839582@gmail.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#121212] border border-border text-foreground font-mono focus:outline-none focus:border-primary"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Every new online booking dispatch is delivered to each email in this list.
                  </p>
                </div>

                {/* Dispatch Phone */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    Dispatch Phone Number
                  </label>
                  <input
                    type="text"
                    value={settings.dispatchPhone}
                    onChange={e => setSettings({ ...settings, dispatchPhone: e.target.value })}
                    placeholder="0435304821"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#121212] border border-border text-foreground font-mono focus:outline-none focus:border-primary"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Shown to passengers on confirmation screens and receipts.
                  </p>
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    WhatsApp Number (International format)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    placeholder="61435304821"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#121212] border border-border text-foreground font-mono focus:outline-none focus:border-primary"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Used for one-click WhatsApp dispatch links (e.g. 61435304821).
                  </p>
                </div>

                {/* Gmail User */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    SMTP Sending Account (Gmail)
                  </label>
                  <input
                    type="email"
                    value={settings.emailUser || ""}
                    onChange={e => setSettings({ ...settings, emailUser: e.target.value })}
                    placeholder="p2839582@gmail.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#121212] border border-border text-foreground font-mono focus:outline-none focus:border-primary"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Your Google account email address.
                  </p>
                </div>

                {/* Gmail App Password */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-primary" />
                    Google 16-Character App Password
                  </label>
                  <input
                    type="password"
                    value={settings.emailPass || ""}
                    onChange={e => setSettings({ ...settings, emailPass: e.target.value })}
                    placeholder={settings.hasEmailPass ? "•••••••••••••••• (Password configured)" : "16-character Google App Password"}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#121212] border border-border text-foreground font-mono focus:outline-none focus:border-primary"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Leave blank to keep existing password, or enter new 16-character code.
                  </p>
                </div>
              </div>

              {/* Instructions on Google App Password */}
              <div className="p-4 rounded-lg bg-[#111] border border-border/80 space-y-2 text-xs">
                <div className="font-bold text-primary flex items-center gap-1.5">
                  <span>💡</span> How to generate your 16-character Google App Password (2 minutes):
                </div>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground leading-relaxed">
                  <li>Go to your Google Account (<strong className="text-foreground">myaccount.google.com</strong>) with <code className="text-primary font-mono">{settings.emailUser || "p2839582@gmail.com"}</code></li>
                  <li>Click <strong className="text-foreground">Security</strong> in the left sidebar</li>
                  <li>Under "How you sign in to Google", turn on <strong className="text-foreground">2-Step Verification</strong> (if not already enabled)</li>
                  <li>In the search box at the top, type <strong className="text-foreground">App passwords</strong> and press Enter</li>
                  <li>Enter app name <strong className="text-foreground">Melbourne Taxis</strong> and click <strong className="text-foreground">Create</strong></li>
                  <li>Copy the yellow 16-character password, paste it in the box above, and click <strong className="text-foreground">Save Details to File</strong>!</li>
                </ol>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 pt-2">
                {testEmailMessage && (
                  <div className={`p-3 rounded-lg text-xs font-semibold border ${
                    testEmailMessage.startsWith("✅")
                      ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                      : "bg-red-950/40 border-red-800 text-red-300"
                  }`}>
                    {testEmailMessage}
                  </div>
                )}

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="text-[11px] text-muted-foreground">
                    {settings.updatedAt && (
                      <span>Last saved in file: {new Date(settings.updatedAt).toLocaleString()}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSendTestEmail}
                      disabled={testEmailLoading}
                      className="inline-flex items-center gap-1.5 px-4 py-3 rounded-lg border border-border bg-[#181818] hover:bg-[#222] text-foreground font-bold uppercase tracking-wider text-xs transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-primary" />
                      {testEmailLoading ? "Verifying & Sending..." : "Send Test Email"}
                    </button>

                    <button
                      type="submit"
                      disabled={settingsLoading}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-wider text-xs shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      {settingsLoading ? "Saving to File..." : "Save Details to File"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
