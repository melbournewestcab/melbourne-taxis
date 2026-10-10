import React, { useEffect, useState, useRef, useMemo } from "react";
import { BookingForm } from "@/components/BookingForm";
import { Phone, Shield, Clock, MapPin, Star, CheckCircle2, ChevronDown, ChevronUp, Plane, Car, Users, Briefcase, Sparkles, Package } from "lucide-react";

const PHONE = "0435 304 821";
const PHONE_RAW = "0435304821";
const WHATSAPP = "61435304821";

function trackGoogleAds(action: "page_view" | "lead" | "click_to_call") {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "conversion", { send_to: (window as any).GOOGLE_ADS_CONVERSION_ID });
  }
}

function trackMetaPixel(event: string) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", event);
  }
}

// ── Dynamic content variants keyed by ?service= param ─────────────────────
type ServiceKey = "airport" | "maxi" | "corporate" | "silver" | "wedding" | "parcel" | "hotel" | "local" | "melton" | "ballan" | "darley" | "default";

interface PageContent {
  badge: string;
  h1: [string, string];
  sub: string;
  title: string;
  metaDesc: string;
  cta: string;
  faqs: Array<{ q: string; a: string }>;
  trustBar: Array<{ text: string; sub: string }>;
}

const VARIANTS: Record<ServiceKey, PageContent> = {
  airport: {
    badge: "✈️  Melbourne Airport Transfers — 24/7",
    h1: ["Airport Taxi", "Bacchus Marsh"],
    sub: "Fixed fares to Tullamarine & Avalon. Flight tracking included. No surge pricing — ever.",
    title: "Airport Taxi Bacchus Marsh | Tullamarine & Avalon Transfers | 0435 304 821",
    metaDesc: "Book an airport taxi from Bacchus Marsh to Melbourne Tullamarine or Avalon Airport. Fixed fares, flight tracking, 24/7. Call 0435 304 821.",
    cta: "Book Airport Transfer",
    faqs: [
      { q: "Do you track flight arrivals?", a: "Yes — we monitor your flight in real time and adjust pickup if it's early or delayed. No extra charge." },
      { q: "How early should I book?", a: "At least 2 hours before your flight. For early morning flights we recommend booking the night before." },
      { q: "Is the fare fixed to the airport?", a: "Yes. We quote a fixed price upfront — no meter, no surprises." },
      { q: "Do you cover Avalon Airport?", a: "Absolutely. We service both Melbourne Tullamarine and Avalon Airport from Bacchus Marsh." },
      { q: "Can I fit luggage?", a: "All our vehicles carry standard luggage. Maxi Taxi available for large groups or excess bags." },
    ],
    trustBar: [
      { text: "Flight Tracking", sub: "We wait if you're delayed" },
      { text: "Fixed Fares", sub: "No surge pricing" },
      { text: "All Airports", sub: "Tullamarine & Avalon" },
      { text: "24/7 Service", sub: "Early flights covered" },
    ],
  },
  maxi: {
    badge: "👨‍👩‍👧‍👦  Maxi Taxi — Up to 11 Passengers",
    h1: ["Maxi Taxi", "Bacchus Marsh"],
    sub: "Groups, events, airport runs. Fits up to 11 people plus luggage. Book your maxi cab now.",
    title: "Maxi Taxi Bacchus Marsh | Group Taxi Up to 11 Seats | 0435 304 821",
    metaDesc: "Maxi taxi in Bacchus Marsh for groups up to 11 passengers. Ideal for airport runs, events, and group travel. Call 0435 304 821.",
    cta: "Book Maxi Taxi",
    faqs: [
      { q: "How many passengers does a Maxi Taxi hold?", a: "Up to 11 passengers plus luggage. Perfect for large families, sporting groups, or events." },
      { q: "Can I book a Maxi for airport transfers?", a: "Yes — Maxi Taxi is our most popular vehicle for group airport runs to Tullamarine and Avalon." },
      { q: "Is the Maxi Taxi wheelchair accessible?", a: "Please call us to confirm availability of our wheelchair-accessible vehicles." },
      { q: "Do you charge per person or per vehicle?", a: "We charge per vehicle — so the larger your group, the more cost-effective a Maxi becomes." },
      { q: "How far in advance should I book?", a: "We recommend 24 hours for large group bookings, especially for airport runs." },
    ],
    trustBar: [
      { text: "Up to 11 Seats", sub: "Groups welcome" },
      { text: "Luggage Space", sub: "Plenty of room" },
      { text: "Airport Runs", sub: "Best value for groups" },
      { text: "24/7 Available", sub: "Book anytime" },
    ],
  },
  corporate: {
    badge: "💼  Corporate & Executive Travel",
    h1: ["Corporate Taxi", "Bacchus Marsh"],
    sub: "Account invoicing, regular pickups, dedicated fleet. Reliable executive travel for businesses in Bacchus Marsh and Melton.",
    title: "Corporate Taxi Bacchus Marsh | Business & Executive Travel | 0435 304 821",
    metaDesc: "Corporate taxi and executive travel in Bacchus Marsh. Account invoicing, regular contracts, professional drivers. Call 0435 304 821.",
    cta: "Book Corporate Ride",
    faqs: [
      { q: "Do you offer account invoicing for businesses?", a: "Yes — we set up corporate accounts with monthly invoicing for regular business clients." },
      { q: "Can I schedule recurring pickups?", a: "Absolutely. We handle daily commutes, regular airport runs, and standing bookings." },
      { q: "Are drivers presentable for executive clients?", a: "All corporate drivers are professionally dressed and trained for executive service." },
      { q: "What areas do you cover for corporate travel?", a: "Bacchus Marsh, Melton, CBD Melbourne, all airports and regional Victoria." },
      { q: "Is there a minimum contract?", a: "No minimum commitment. Call to discuss your business needs and we'll tailor a solution." },
    ],
    trustBar: [
      { text: "Account Invoicing", sub: "Monthly billing available" },
      { text: "Dedicated Fleet", sub: "Always available" },
      { text: "Professional Drivers", sub: "Executive ready" },
      { text: "All Melbourne", sub: "CBD & airports" },
    ],
  },
  silver: {
    badge: "✨  Silver Service — Premium Taxi",
    h1: ["Silver Service", "Taxi Bacchus Marsh"],
    sub: "Premium vehicles, professional uniformed drivers. Ideal for special occasions, VIP clients, and executive travel.",
    title: "Silver Service Taxi Bacchus Marsh | Premium & VIP Travel | 0435 304 821",
    metaDesc: "Silver Service premium taxi in Bacchus Marsh. Luxury vehicles, uniformed drivers, ideal for VIP, events, and corporate. Call 0435 304 821.",
    cta: "Book Silver Service",
    faqs: [
      { q: "What is Silver Service?", a: "Silver Service is a premium tier with luxury vehicles, uniformed professional drivers, and enhanced comfort for VIP or special occasions." },
      { q: "Is Silver Service good for weddings?", a: "Yes — Silver Service is popular for wedding parties, anniversaries, and formal events." },
      { q: "How much more does Silver Service cost?", a: "There is an $11 booking surcharge on top of standard meter rates. Upfront fares available." },
      { q: "Can I request a specific vehicle?", a: "We'll do our best to accommodate requests. Call to discuss your requirements." },
      { q: "Is Silver Service available 24/7?", a: "Yes, available around the clock. Advance booking recommended for peak times." },
    ],
    trustBar: [
      { text: "Premium Vehicles", sub: "Luxury fleet" },
      { text: "Uniformed Drivers", sub: "Professional service" },
      { text: "VIP Ready", sub: "Events & occasions" },
      { text: "Upfront Pricing", sub: "No surprises" },
    ],
  },
  wedding: {
    badge: "💍  Wedding & Event Taxi Service",
    h1: ["Wedding Taxi", "Bacchus Marsh"],
    sub: "Multi-vehicle coordination, timed pickups, styled service for your special day. Book early — weekends fill fast.",
    title: "Wedding Taxi Bacchus Marsh | Event Transfer Service | 0435 304 821",
    metaDesc: "Wedding and event taxi service in Bacchus Marsh. Multi-vehicle coordination, timed arrivals, styled service. Call 0435 304 821.",
    cta: "Book for Your Event",
    faqs: [
      { q: "Can you coordinate multiple vehicles for a wedding?", a: "Yes — we specialise in multi-vehicle wedding fleets with timed, coordinated pickups for the full bridal party." },
      { q: "How far in advance should I book for a wedding?", a: "At least 2–4 weeks for weddings, especially on Saturdays. Early booking secures your vehicles." },
      { q: "Do you decorate the vehicles?", a: "We can arrange ribbon and decoration for the wedding vehicles. Ask when booking." },
      { q: "What's included in a wedding package?", a: "Professional drivers, timed pickups, styled presentation, and full reliability guarantee for your special day." },
      { q: "Do you also cover the after-party or reception transfers?", a: "Yes — we can arrange pick-up and drop-off for guests at the end of the night." },
    ],
    trustBar: [
      { text: "Multi-Vehicle", sub: "Full bridal coordination" },
      { text: "Timed Pickups", sub: "Never late" },
      { text: "Styled Service", sub: "Decorated on request" },
      { text: "All Events", sub: "Weddings & formals" },
    ],
  },
  parcel: {
    badge: "📦  Same-Day Parcel & Courier Delivery",
    h1: ["Same-Day Delivery", "Bacchus Marsh"],
    sub: "Fast, secure parcel delivery across Bacchus Marsh, Melton, and Melbourne. No depot delays — direct to the door.",
    title: "Same-Day Courier Bacchus Marsh | Parcel Delivery Service | 0435 304 821",
    metaDesc: "Same-day parcel and courier delivery in Bacchus Marsh and Melton. Direct door-to-door, no depot delays. Call 0435 304 821.",
    cta: "Send a Parcel Now",
    faqs: [
      { q: "How fast is same-day delivery?", a: "Most deliveries within Bacchus Marsh and Melton are completed within 1–3 hours of pickup." },
      { q: "What size parcels do you carry?", a: "Standard courier-sized parcels and packages. Call for oversized or fragile items." },
      { q: "Do you deliver to Melbourne CBD?", a: "Yes — we deliver to Melbourne, all suburbs, and regional Victoria." },
      { q: "Is the parcel tracked?", a: "You'll receive updates via phone or WhatsApp when the parcel is picked up and delivered." },
      { q: "How do I book a delivery?", a: "Call 0435 304 821 or book online with pickup/drop-off address and parcel details." },
    ],
    trustBar: [
      { text: "Same-Day", sub: "No depot delays" },
      { text: "Tracked", sub: "Updates via SMS" },
      { text: "All Melbourne", sub: "Any suburb" },
      { text: "Secure", sub: "Handled with care" },
    ],
  },
  hotel: {
    badge: "🏨  Hotel & CBD Transfers",
    h1: ["Hotel Transfers", "Bacchus Marsh & Melbourne"],
    sub: "Door-to-door hotel pickups across Melbourne CBD and surrounds. Professional, punctual, and presentable.",
    title: "Hotel Taxi Bacchus Marsh | Melbourne CBD Transfers | 0435 304 821",
    metaDesc: "Hotel and CBD taxi transfers from Bacchus Marsh to Melbourne. Door-to-door, professional service. Call 0435 304 821.",
    cta: "Book Hotel Transfer",
    faqs: [
      { q: "Do you pick up from Melbourne CBD hotels?", a: "Yes — we service all major hotels in Melbourne CBD, South Yarra, St Kilda, and surrounds." },
      { q: "Can I book a hotel pickup in advance?", a: "Yes — advance bookings preferred. We confirm with the hotel concierge if needed." },
      { q: "Do you offer early morning pickups?", a: "Absolutely — 24/7 service including early morning and late night hotel runs." },
      { q: "Is there a meet-and-greet service?", a: "Yes — our drivers can wait in the hotel lobby with a name card on request." },
      { q: "What vehicles are available for hotel transfers?", a: "Sedan, SUV, Silver Service, and Maxi Taxi depending on your group size and requirements." },
    ],
    trustBar: [
      { text: "All CBD Hotels", sub: "Melbourne covered" },
      { text: "Meet & Greet", sub: "Lobby pickup" },
      { text: "24/7 Service", sub: "Any hour" },
      { text: "Professional", sub: "Presentable drivers" },
    ],
  },
  local: {
    badge: "🚕  Local Taxi — Bacchus Marsh & Melton",
    h1: ["Local Taxi", "Bacchus Marsh"],
    sub: "Fast, affordable local rides anywhere in Bacchus Marsh, Melton, Darley, Ballan and all surrounding suburbs.",
    title: "Local Taxi Bacchus Marsh | Fast & Affordable | 0435 304 821",
    metaDesc: "Local taxi in Bacchus Marsh and Melton. Fast pickup, affordable fares, professional drivers. Call 0435 304 821.",
    cta: "Book a Local Ride",
    faqs: [
      { q: "How quickly can you pick me up locally?", a: "We aim for 10–15 minutes anywhere in Bacchus Marsh and Melton areas." },
      { q: "What is the minimum fare?", a: "$25 flat for any trip under 5 km. Longer trips use Safe Transport Victoria meter rates." },
      { q: "Can I pay by card?", a: "Yes — cash, EFTPOS, and all major credit cards accepted." },
      { q: "Do you service late night pickups?", a: "Yes — 24/7 local service including late nights and early mornings." },
      { q: "Can I book in advance?", a: "Yes. Book online or call anytime to schedule your ride in advance." },
    ],
    trustBar: [
      { text: "10–15 Min", sub: "Fast local pickup" },
      { text: "$25 Minimum", sub: "Short trips covered" },
      { text: "All Suburbs", sub: "Bacchus Marsh area" },
      { text: "24/7 Available", sub: "Any time" },
    ],
  },
  melton: {
    badge: "📍  Taxi Service — Melton",
    h1: ["Taxi in Melton", "Fast & Reliable"],
    sub: "Your local taxi service covering all of Melton, Melton South, Melton West, and surrounding areas. Book now.",
    title: "Taxi Melton | Reliable Local Cab Service | 0435 304 821",
    metaDesc: "Taxi service in Melton covering Melton South, Melton West, and all nearby suburbs. Fast pickup, 24/7. Call 0435 304 821.",
    cta: "Book in Melton",
    faqs: [
      { q: "Do you cover all of Melton?", a: "Yes — Melton, Melton South, Melton West, Cobblebank, Fraser Rise, Kurunjang, Deanside, and more." },
      { q: "Can you take me from Melton to Melbourne?", a: "Absolutely — CBD, airport, and anywhere in greater Melbourne." },
      { q: "How fast is pickup in Melton?", a: "We aim for 10–20 minutes across the Melton area." },
      { q: "Do you have taxis available late night?", a: "Yes — 24/7 service in Melton including late night and early morning." },
      { q: "Is there a Melton to airport taxi?", a: "Yes — fixed fares to Tullamarine from Melton. Book online for an instant estimate." },
    ],
    trustBar: [
      { text: "All Melton", sub: "Every suburb covered" },
      { text: "Airport Runs", sub: "Fixed fares" },
      { text: "24/7 Service", sub: "Always available" },
      { text: "Fast Pickup", sub: "10–20 minutes" },
    ],
  },
  ballan: {
    badge: "📍  Taxi Service — Ballan & Surrounds",
    h1: ["Taxi in Ballan", "Bacchus Marsh & Beyond"],
    sub: "Serving Ballan, Bacchus Marsh, Maddingley, and all surrounding areas. Fast, professional, affordable.",
    title: "Taxi Ballan | Local Cab Service | 0435 304 821",
    metaDesc: "Taxi service in Ballan and surrounding areas. Local and long distance, airport transfers, 24/7 availability. Call 0435 304 821.",
    cta: "Book in Ballan",
    faqs: [
      { q: "Do you service Ballan?", a: "Yes — Ballan is one of our key service areas. We cover the town and surrounding rural properties." },
      { q: "Can I get a taxi from Ballan to Melbourne?", a: "Yes — we regularly do Ballan to Melbourne CBD and airport runs." },
      { q: "How far is Ballan to Melbourne Airport?", a: "Approximately 70–75 km. We offer fixed pricing — book online for an instant quote." },
      { q: "Do you pick up from rural properties near Ballan?", a: "Yes — just provide the full address and we'll come to you." },
      { q: "Are you available 24/7 in Ballan?", a: "Yes — call anytime day or night for a Ballan taxi." },
    ],
    trustBar: [
      { text: "Ballan Covered", sub: "Town & rural" },
      { text: "Long Distance", sub: "Melbourne & airports" },
      { text: "Fixed Fares", sub: "Airport quotes" },
      { text: "24/7 Available", sub: "Any time" },
    ],
  },
  darley: {
    badge: "📍  Taxi Service — Darley",
    h1: ["Taxi in Darley", "Bacchus Marsh Cab"],
    sub: "Fast local taxi in Darley. Serving Darley, Bacchus Marsh, Maddingley and surrounding areas 24/7.",
    title: "Taxi Darley | Bacchus Marsh Taxi Cab | 0435 304 821",
    metaDesc: "Local taxi in Darley, Bacchus Marsh. Fast pickup, professional drivers, airport transfers. Call 0435 304 821.",
    cta: "Book in Darley",
    faqs: [
      { q: "Do you service Darley?", a: "Yes — Darley is one of our most requested local areas. Fast pickup, usually 10–15 minutes." },
      { q: "Can I get from Darley to Melbourne Airport?", a: "Yes — fixed fares to Tullamarine. Book online for an instant estimate." },
      { q: "Do you pick up late at night in Darley?", a: "Absolutely — 24/7 service including nights and early mornings." },
      { q: "What is the fare from Darley to Bacchus Marsh town?", a: "Short trips under 5 km are $25 flat. Book online for longer distances." },
      { q: "Can I pre-book a Darley taxi?", a: "Yes — book online or call ahead. We confirm your booking immediately." },
    ],
    trustBar: [
      { text: "Darley Covered", sub: "Fast local pickup" },
      { text: "Airport Transfers", sub: "Fixed pricing" },
      { text: "24/7 Service", sub: "Nights included" },
      { text: "Instant Booking", sub: "Online or phone" },
    ],
  },
  default: {
    badge: "🚕  Available 24/7 Across All Melbourne Suburbs",
    h1: ["Melbourne Taxis", "& Airport Transfers"],
    sub: "Fixed fares to Tullamarine & Avalon, city point-to-point, corporate travel & 11-seat Maxi Cabs. Get an instant fare estimate and book in seconds.",
    title: "Melbourne Taxis | 24/7 Cab Booking & Airport Transfers | 0435 304 821",
    metaDesc: "Fast, reliable taxi service across all Melbourne suburbs. 24/7 airport transfers to Tullamarine & Avalon, fixed prices, zero surge, Maxi Taxis & Silver Service. Call 0435 304 821.",
    cta: "Book Online Now",
    faqs: [
      { q: "How fast can you pick me up in Melbourne?", a: "We aim for 5–15 minutes across Melbourne CBD, inner suburbs, and metropolitan areas. Pre-bookings guaranteed on time." },
      { q: "Do you take card payments and Cabcharge?", a: "Yes — cash, EFTPOS, Apple Pay, Google Pay, all major credit cards and Cabcharge accepted in every vehicle." },
      { q: "Are your drivers accredited?", a: "All drivers hold full Safe Transport Victoria commercial taxi accreditation and background checks." },
      { q: "Can I book a return airport transfer?", a: "Yes. Select the return-trip option in the booking form and we'll schedule both legs with live flight tracking." },
      { q: "What are your Melbourne Airport transfer rates?", a: "We offer fixed upfront quotes with zero surge pricing, covering all terminals at Tullamarine (MEL) and Avalon (AVV)." },
    ],
    trustBar: [
      { text: "24/7 Availability", sub: "All Melbourne suburbs" },
      { text: "Safe Transport VIC", sub: "Accredited & Insured" },
      { text: "Airport Fixed Fares", sub: "Tullamarine & Avalon" },
      { text: "Zero Surge Pricing", sub: "Regulated transparent rates" },
    ],
  },
};

// ── Resolve which variant to show from URL params ──────────────────────────
function resolveContent(): PageContent & { keyword?: string; from?: string; to?: string } {
  const params = new URLSearchParams(window.location.search);

  // Google Ads auto-populates utm_term with the search keyword
  const rawKeyword = params.get("utm_term") || params.get("q") || params.get("keyword") || "";
  const service = (params.get("service") || "").toLowerCase() as ServiceKey;
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  // Direct service param takes priority
  let variant: ServiceKey = "default";
  if (service && VARIANTS[service]) {
    variant = service;
  } else if (rawKeyword) {
    // Infer from keyword
    const kw = rawKeyword.toLowerCase();
    if (kw.includes("airport") || kw.includes("tullamarine") || kw.includes("avalon")) variant = "airport";
    else if (kw.includes("maxi") || kw.includes("group")) variant = "maxi";
    else if (kw.includes("corporate") || kw.includes("executive") || kw.includes("business")) variant = "corporate";
    else if (kw.includes("silver") || kw.includes("premium") || kw.includes("vip")) variant = "silver";
    else if (kw.includes("wedding") || kw.includes("event") || kw.includes("formal")) variant = "wedding";
    else if (kw.includes("parcel") || kw.includes("delivery") || kw.includes("courier")) variant = "parcel";
    else if (kw.includes("hotel") || kw.includes("cbd")) variant = "hotel";
    else if (kw.includes("melton")) variant = "melton";
    else if (kw.includes("ballan")) variant = "ballan";
    else if (kw.includes("darley")) variant = "darley";
    else variant = "local";
  }

  return { ...VARIANTS[variant], keyword: rawKeyword, from, to };
}

const SERVICE_ICONS: Record<string, React.ElementType> = {
  "Airport Transfers": Plane,
  "Local Rides": Car,
  "Maxi Taxi": Users,
  "Silver Service": Sparkles,
  "Corporate": Briefcase,
  "Event & Wedding": Star,
};

export default function LandingPage() {
  const [sticky, setSticky] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const content = useMemo(() => resolveContent(), []);

  // Update document title + meta on mount
  useEffect(() => {
    document.title = content.title;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      (metaDesc as HTMLMetaElement).name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", content.metaDesc);

    // OG tags for social sharing
    const setOg = (prop: string, val: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) { el = document.createElement("meta"); (el as HTMLMetaElement).setAttribute("property", prop); document.head.appendChild(el); }
      el.setAttribute("content", val);
    };
    setOg("og:title", content.title);
    setOg("og:description", content.metaDesc);

    trackGoogleAds("page_view");
  }, [content]);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    trackGoogleAds("lead");
    trackMetaPixel("Lead");
  };

  const onCall = () => {
    trackGoogleAds("click_to_call");
    trackMetaPixel("Contact");
  };

  // Build dynamic hero subtitle when from/to are present
  const heroSub = content.from && content.to
    ? `Taxi from ${content.from} to ${content.to}. Fast, professional, and fully licensed.`
    : content.to
    ? `Need a taxi to ${content.to}? Get an instant fare estimate and book in seconds.`
    : content.sub;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ── Sticky mobile CTA ── */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 md:hidden ${sticky ? "translate-y-0" : "translate-y-full"}`}>
        <div className="bg-[#f97316] p-3 flex items-center justify-between gap-3">
          <a href={`tel:${PHONE_RAW}`} onClick={onCall} className="flex-1 bg-white text-[#f97316] font-black text-center py-3 rounded-lg text-sm uppercase tracking-wide">
            Call Now
          </a>
          <button onClick={scrollToForm} className="flex-1 bg-[#111] text-white font-black py-3 rounded-lg text-sm uppercase tracking-wide">
            {content.cta}
          </button>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#1a0a00] to-[#0a0a0a]" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 70% 30%, #f97316 0%, transparent 60%)",
        }} />
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          {/* Dynamic badge — reflects search intent */}
          <div className="inline-flex items-center gap-2 bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Clock className="w-4 h-4 shrink-0" />
            <span>{content.badge}</span>
          </div>

          {/* Dynamic H1 — two-part like the reference brand */}
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-[1.1] mb-6">
            {content.h1[0].split(" ").map((word, i) => (
              <span key={i}>{word} </span>
            ))}
            <br className="hidden md:block" />
            <span className="text-[#f97316]">{content.h1[1]}</span>
          </h1>

          {/* Dynamic subheading */}
          <p className="text-lg md:text-xl text-[#aaa] max-w-xl mx-auto mb-8">
            {heroSub}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <a href={`tel:${PHONE_RAW}`} onClick={onCall}
               className="inline-flex items-center gap-3 bg-[#f97316] hover:bg-[#ea580c] text-white font-black px-8 py-4 rounded-xl text-lg uppercase tracking-wide transition-colors shadow-lg shadow-[#f97316]/20">
              <Phone className="w-5 h-5" /> {PHONE}
            </a>
            <button onClick={scrollToForm}
               className="inline-flex items-center gap-3 bg-white hover:bg-gray-100 text-[#111] font-black px-8 py-4 rounded-xl text-lg uppercase tracking-wide transition-colors">
              <CheckCircle2 className="w-5 h-5" /> {content.cta}
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-[#888]">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-[#f97316]" /> Licensed & Insured</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-[#f97316]" /> 5-Star Rated</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#f97316]" /> Serving All Melbourne</span>
          </div>
        </div>
      </section>

      {/* ── Dynamic trust bar ── */}
      <section className="border-y border-[#222] bg-[#111]">
        <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          {content.trustBar.map(({ text, sub }) => (
            <div key={text} className="flex flex-col items-center gap-1">
              <CheckCircle2 className="w-5 h-5 text-[#f97316] mb-1" />
              <div className="font-bold text-white">{text}</div>
              <div className="text-[#666] text-xs">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Booking form ── */}
      <section ref={formRef} className="max-w-4xl mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-3">
            Get Your <span className="text-[#f97316]">Instant</span> Fare
          </h2>
          <p className="text-[#888]">Enter your pickup, drop-off, and vehicle. We'll show the exact fare before you book.</p>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-2xl p-4 md:p-8">
          <BookingForm showMinimumToast={false} />
        </div>
      </section>

      {/* ── Services ── */}
      <section className="max-w-4xl mx-auto px-4 py-16 border-t border-[#222]">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-center mb-10">
          What We <span className="text-[#f97316]">Offer</span>
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[
            { title: "Airport Transfers", desc: "Tullamarine, Avalon, Essendon. Fixed fares, flight tracking." },
            { title: "Local Rides", desc: "Bacchus Marsh, Melton, Ballan, Darley & all surrounding areas." },
            { title: "Maxi Taxi", desc: "Up to 11 passengers. Perfect for groups, events, and airport runs." },
            { title: "Silver Service", desc: "Premium vehicles, professional drivers. Corporate & VIP ready." },
            { title: "Corporate", desc: "Account invoicing, regular pickups, dedicated fleet allocation." },
            { title: "Event & Wedding", desc: "Multi-vehicle coordination, timed pickups, styled service." },
          ].map(s => {
            const Icon = SERVICE_ICONS[s.title] || Car;
            return (
              <div key={s.title} className="bg-[#111] border border-[#222] rounded-xl p-5 hover:border-[#f97316]/40 transition-colors">
                <Icon className="w-5 h-5 text-[#f97316] mb-2" />
                <h3 className="font-bold text-white mb-1.5">{s.title}</h3>
                <p className="text-sm text-[#888] leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Coverage area ── */}
      <section className="max-w-4xl mx-auto px-4 py-16 border-t border-[#222]">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-center mb-8">
          We Cover <span className="text-[#f97316]">All</span> Areas
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {["Bacchus Marsh", "Melton", "Darley", "Maddingley", "Ballan", "Rockbank", "Kurunjang", "Diggers Rest", "Cobblebank", "Fraser Rise", "Thornhill Park", "Plumpton", "Deanside", "Eyensbury", "Melton South", "Melton West", "All Melbourne"].map(a => (
            <span key={a} className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#aaa] text-sm px-3 py-1.5 rounded-full">
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* ── Dynamic FAQ ── */}
      <section className="max-w-4xl mx-auto px-4 py-16 border-t border-[#222]">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-center mb-10">
          Common <span className="text-[#f97316]">Questions</span>
        </h2>
        <div className="space-y-3">
          {content.faqs.map((f, i) => (
            <div key={i} className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#161616] transition-colors"
              >
                <span className="font-semibold text-sm md:text-base pr-4">{f.q}</span>
                {openFaq === i ? <ChevronUp className="w-5 h-5 text-[#f97316] shrink-0" /> : <ChevronDown className="w-5 h-5 text-[#666] shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-[#aaa] leading-relaxed border-t border-[#1a1a1a]">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-4xl mx-auto px-4 py-16 border-t border-[#222] text-center">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
          Ready to <span className="text-[#f97316]">Ride</span>?
        </h2>
        <p className="text-[#888] mb-8 max-w-md mx-auto">
          Call now or book online. No queues, no waiting. Just a clean car and a professional driver at your door.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href={`tel:${PHONE_RAW}`} onClick={onCall}
             className="inline-flex items-center gap-3 bg-[#f97316] hover:bg-[#ea580c] text-white font-black px-8 py-4 rounded-xl text-lg uppercase tracking-wide transition-colors shadow-lg shadow-[#f97316]/20">
            <Phone className="w-5 h-5" /> {PHONE}
          </a>
          <button onClick={scrollToForm}
             className="inline-flex items-center gap-3 bg-white hover:bg-gray-100 text-[#111] font-black px-8 py-4 rounded-xl text-lg uppercase tracking-wide transition-colors">
            <CheckCircle2 className="w-5 h-5" /> {content.cta}
          </button>
        </div>
        <div className="mt-8 text-sm text-[#555]">
          Or WhatsApp us:{" "}
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="text-[#f97316] hover:underline">
            {PHONE}
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#222] py-6 text-center text-xs text-[#444]">
        <div>
          &copy; {new Date().getFullYear()} Bacchus Marsh Taxi Cab. ABN: 00 000 000 000.
        </div>
        <div className="mt-1">
          Licensed by Safe Transport Victoria. Fully insured commercial passenger vehicles.
        </div>
      </footer>
    </div>
  );
}
