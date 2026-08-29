import React, { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, MapPin, ShieldCheck, Plane, Car, Users, Star, ArrowRight, Shield } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { SUBURBS_DATA } from "@/data/suburbsData";

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function HomePage() {
  useEffect(() => {
    document.title = "Melbourne Taxis | 24/7 Cab Booking & Airport Transfers Melbourne | 0435 304 821";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Book Melbourne Taxis 24/7 across all Melbourne suburbs. Fast pickups, fixed fares to Melbourne Airport (Tullamarine & Avalon), Maxi Cabs, Silver Service & corporate travel. Call 0435 304 821 or book online."
      );
    }
  }, []);

  return (
    <div className="flex flex-col w-full">

      {/* ── Hero ── */}
      <section className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-background py-16 md:py-24">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-taxi.png"
            alt="Melbourne Taxis cab driving through Melbourne"
            className="w-full h-full object-cover opacity-35"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background" />
        </div>

        <div className="relative z-10 container max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/40 text-xs md:text-sm font-black uppercase tracking-wider text-primary mb-6 shadow-sm">
            <ShieldCheck className="w-4 h-4" /> 24/7 Melbourne Suburbs &amp; Airport Taxi Service
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight mb-6 leading-none">
            Melbourne <span className="text-primary">Taxis &amp; Cabs</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
            Fast, reliable door-to-door taxi booking across all Melbourne suburbs, Tullamarine &amp; Avalon Airports. Guaranteed on-time pickups with zero surge pricing.
          </p>

          {/* Symmetrical Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-base md:text-lg font-black uppercase tracking-wider shadow-lg">
              <Link href="/book" data-testid="btn-hero-book">Book Taxi Online</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base md:text-lg font-black uppercase tracking-wider bg-transparent border-2 border-white text-white hover:bg-white hover:text-black">
              <a href="tel:0435304821" data-testid="btn-hero-call">Call 0435 304 821</a>
            </Button>
            <a
              href="https://wa.me/61435304821?text=Hi%2C%20I%20would%20like%20to%20book%20a%20taxi%20with%20Melbourne%20Taxis."
              target="_blank"
              rel="noopener noreferrer"
              data-testid="btn-hero-whatsapp"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-14 px-8 text-base md:text-lg font-black uppercase tracking-wider rounded-md transition-opacity hover:opacity-90 shadow-lg"
              style={{ background: "#25D366", color: "#fff" }}
            >
              <WhatsAppIcon />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="py-10 bg-secondary border-y border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Clock className="w-8 h-8 text-primary" />
              <span className="font-bold uppercase tracking-wide text-sm">24/7 Melbourne Dispatch</span>
              <span className="text-xs text-muted-foreground">Always on call</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <span className="font-bold uppercase tracking-wide text-sm">Safe Transport VIC</span>
              <span className="text-xs text-muted-foreground">Accredited &amp; Insured</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Plane className="w-8 h-8 text-primary" />
              <span className="font-bold uppercase tracking-wide text-sm">Flight Tracking</span>
              <span className="text-xs text-muted-foreground">Tullamarine &amp; Avalon</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-primary" />
              <span className="font-bold uppercase tracking-wide text-sm">Fixed &amp; Metered</span>
              <span className="text-xs text-muted-foreground">No Surge Pricing</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Instant Fare Calculator & Booking Form ── */}
      <section className="py-20 bg-background border-b border-border" id="book">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Accurate &amp; Transparent</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
              Book Your <span className="text-primary">Melbourne Ride</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              Enter your pickup and drop-off addresses anywhere in Melbourne for an instant regulated fare estimate, then confirm online or via WhatsApp.
            </p>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mt-6" />
          </div>
          <BookingForm />
        </div>
      </section>

      {/* ── Core Services Overview ── */}
      <section className="py-24 bg-card border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Full Suite of Services</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
              Our Melbourne Taxi Services
            </h2>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Airport Transfers (MEL & AVV)",
                desc: "Direct, stress-free transfers to Melbourne Airport (Tullamarine) & Avalon Airport with live flight tracking.",
                href: "/services/airport",
                icon: <Plane className="w-7 h-7 text-primary mb-3" />
              },
              {
                title: "Melbourne CBD & Point-to-Point",
                desc: "Fast pickups across Melbourne CBD, Southbank, Docklands, and all metropolitan inner and outer suburbs.",
                href: "/services/a-to-b",
                icon: <MapPin className="w-7 h-7 text-primary mb-3" />
              },
              {
                title: "Corporate & Silver Service",
                desc: "Executive chauffeur-grade Lexus and luxury sedans for business travel, board meetings, and VIP clients.",
                href: "/services/corporate",
                icon: <Car className="w-7 h-7 text-primary mb-3" />
              },
              {
                title: "Hotel & Crown Transfers",
                desc: "Lobby-side pickups for Crown Melbourne, Grand Hyatt, Ritz-Carlton, and all Melbourne luxury accommodation.",
                href: "/services/hotel",
                icon: <CheckCircle2 className="w-7 h-7 text-primary mb-3" />
              },
              {
                title: "Events, Sports & Wineries",
                desc: "Group transport for the MCG, Marvel Stadium, Flemington races, Australian Open, and Yarra Valley winery tours.",
                href: "/services/event",
                icon: <Users className="w-7 h-7 text-primary mb-3" />
              },
              {
                title: "Urgent Parcel Delivery",
                desc: "Same-day courier and urgent document delivery across Greater Melbourne, dispatching within minutes.",
                href: "/services/parcel",
                icon: <Clock className="w-7 h-7 text-primary mb-3" />
              }
            ].map((service, i) => (
              <Card key={i} className="bg-background border-border hover:border-primary/60 transition-all group flex flex-col justify-between">
                <CardContent className="p-8">
                  {service.icon}
                  <h3 className="text-xl font-bold uppercase tracking-wide mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {service.desc}
                  </p>
                  <Link href={service.href} className="text-primary font-bold uppercase text-xs tracking-wider inline-flex items-center gap-1.5 group-hover:underline">
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fleet Showcase ── */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-12 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Modern &amp; Well-Maintained</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Our Melbourne Fleet</h2>
            <div className="w-24 h-1.5 bg-primary rounded-full mx-auto md:mx-0" />
          </div>

          {(() => {
            const vehicles = [
              { type: "Standard Sedan",       img: "fleet-sedan.png",          pax: "1–4",      id: "sedan", desc: "Toyota Camry hybrid sedans for everyday city commutes & airport transfers." },
              { type: "Premium SUV",           img: "fleet-suv.png",            pax: "1–5",      id: "suv", desc: "Elevated comfort with abundant luggage room for family airport departures." },
              { type: "Silver Service",        img: "fleet-silver-service.png", pax: "1–4",      id: "silver_service", desc: "Luxury executive Lexus sedans driven by experienced suited chauffeurs." },
              { type: "6 Seater People Mover", img: "fleet-six-seater.png",     pax: "5–6",      id: "six_seater", desc: "Spacious Kia Carnival people movers for mid-sized family groups." },
              { type: "Maxi Taxi (11 Seater)", img: "fleet-maxi-taxi.png",      pax: "Up to 11", id: "maxi_taxi", desc: "High-capacity Toyota HiAce vans for sports events, tours, and large luggage." },
            ];
            const FleetCard = ({ v, i }: { v: typeof vehicles[0]; i: number }) => (
              <Link key={i} href={`/book?vehicle=${v.id}`} className="group cursor-pointer block">
                <div className="rounded-xl overflow-hidden border border-border bg-card shadow-md aspect-[16/9] mb-3 relative">
                  <img
                    src={`/images/${v.img}`}
                    alt={v.type}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[11px] font-bold text-white uppercase tracking-wider">
                    {v.pax} pax
                  </div>
                </div>
                <div className="px-1">
                  <h3 className="text-base font-black uppercase tracking-wide group-hover:text-primary transition-colors">{v.type}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{v.desc}</p>
                </div>
              </Link>
            );
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {vehicles.slice(0, 3).map((v, i) => <FleetCard key={i} v={v} i={i} />)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:max-w-[66%] sm:mx-auto">
                  {vehicles.slice(3).map((v, i) => <FleetCard key={i + 3} v={v} i={i + 3} />)}
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* ── Melbourne Suburbs We Serve ── */}
      <section className="py-24 bg-secondary/50 border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Comprehensive Coverage</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">
            All Melbourne Suburbs Covered
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-base">
            From the heart of Melbourne CBD to the outer eastern, northern, bayside, and western corridors — click any suburb to view unique local details, route estimates, and instant booking options.
          </p>

          <div className="flex flex-wrap justify-center gap-2.5 max-w-5xl mx-auto mb-8">
            {SUBURBS_DATA.map((area) => (
              <Link
                key={area.id}
                href={`/service-areas/${area.id}`}
                className="px-4 py-2 rounded-full bg-card border border-border hover:border-primary hover:text-primary font-bold uppercase tracking-wider text-xs transition-colors shadow-sm"
              >
                {area.name}
              </Link>
            ))}
          </div>

          <Button asChild size="lg" variant="outline" className="font-black uppercase tracking-wider text-xs border-primary text-primary hover:bg-primary hover:text-black">
            <Link href="/service-areas">Explore Full Melbourne Suburb Directory →</Link>
          </Button>
        </div>
      </section>

      {/* ── Bottom Call To Action ── */}
      <section className="py-20 bg-primary text-black text-center">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4">
            Need a Ride in Melbourne?
          </h2>
          <p className="text-lg sm:text-xl font-medium mb-8 max-w-2xl mx-auto">
            Book online in seconds for an instant fixed fare, or call our 24/7 Melbourne taxi dispatch center directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-black uppercase tracking-wider bg-black text-white hover:bg-gray-900 shadow-xl">
              <Link href="/book" data-testid="btn-bottom-book">Book Online Now</Link>
            </Button>
            <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-black uppercase tracking-wider bg-transparent border-2 border-black text-black hover:bg-black hover:text-white transition-colors">
              <a href="tel:0435304821" data-testid="btn-bottom-call">Call 0435 304 821</a>
            </Button>
            <a
              href="https://wa.me/61435304821?text=Hi%2C%20I%20would%20like%20to%20book%20a%20taxi%20with%20Melbourne%20Taxis."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 text-lg font-black uppercase tracking-wider rounded-md transition-opacity hover:opacity-90 shadow-xl"
              style={{ background: "#25D366", color: "#fff" }}
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
