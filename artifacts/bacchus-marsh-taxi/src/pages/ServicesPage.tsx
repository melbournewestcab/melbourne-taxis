import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plane, Building2, Briefcase, Calendar, Package, MapPin, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    href: "/services/airport",
    icon: <Plane className="w-10 h-10 text-primary" />,
    title: "Melbourne Airport Transfers (MEL & AVV)",
    desc: "Fixed-price transfers to Melbourne Airport (Tullamarine) and Avalon Airport from all Melbourne suburbs. Live flight tracking included.",
  },
  {
    href: "/services/a-to-b",
    icon: <MapPin className="w-10 h-10 text-primary" />,
    title: "A to B & Point-to-Point Melbourne Cabs",
    desc: "24/7 on-demand and pre-booked taxi rides across Melbourne CBD, inner city, northern, eastern, bayside, and western corridors.",
  },
  {
    href: "/services/corporate",
    icon: <Briefcase className="w-10 h-10 text-primary" />,
    title: "Corporate Travel & Silver Service",
    desc: "Executive chauffeur-grade Lexus and luxury sedans driven by professional suited drivers for corporate meetings, summits, and VIP guests.",
  },
  {
    href: "/services/hotel",
    icon: <Building2 className="w-10 h-10 text-primary" />,
    title: "Hotel & Crown Melbourne Transfers",
    desc: "Door-to-door luxury transfers directly to the lobbies of Crown Melbourne, Grand Hyatt, The Langham, Ritz-Carlton, and all CBD hotels.",
  },
  {
    href: "/services/event",
    icon: <Calendar className="w-10 h-10 text-primary" />,
    title: "Event, Sports & Winery Transfers",
    desc: "Group Maxi Taxi transport for AFL matches at the MCG and Marvel Stadium, Australian Open tennis, Flemington races, and Yarra Valley tours.",
  },
  {
    href: "/services/parcel",
    icon: <Package className="w-10 h-10 text-primary" />,
    title: "Same-Day Courier & Urgent Parcel Delivery",
    desc: "Rapid point-to-point document and package delivery across Greater Melbourne, dispatching immediately with direct driver tracking.",
  },
];

export default function ServicesPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Taxi Services Melbourne | Airport Transfers, Maxi Cabs & Corporate | Melbourne Taxis";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", "Explore Melbourne Taxis services — Melbourne airport transfers (Tullamarine & Avalon), point-to-point cabs, luxury Silver Service, 11-seat Maxi Cabs, hotel transfers and same-day courier. Call 0435 304 821.");
  }, []);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      {/* ── Header ── */}
      <div className="bg-secondary py-20 border-b border-border">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-primary block mb-3">Safe Transport Victoria Accredited</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 text-white">
            Melbourne <span className="text-primary">Taxi Services</span>
          </h1>
          <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Professional 24/7 taxi transport across Greater Melbourne with fixed rates, flight tracking, and pristine modern vehicles.
          </p>
        </div>
      </div>

      {/* ── Services Grid ── */}
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, i) => (
            <Card key={i} className="bg-card border-border hover:border-primary/60 transition-all flex flex-col justify-between group">
              <CardContent className="p-8">
                <div className="mb-5">{service.icon}</div>
                <h2 className="text-xl font-bold uppercase tracking-wide mb-3 text-white group-hover:text-primary transition-colors">
                  {service.title}
                </h2>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {service.desc}
                </p>
                <Link href={service.href} className="text-primary font-bold uppercase text-xs tracking-wider inline-flex items-center gap-1.5 group-hover:underline">
                  View Service Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Service Highlights ── */}
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-6 text-center">
            Why Choose Melbourne Taxis?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <Clock className="w-8 h-8 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-bold uppercase text-sm text-white mb-1">Guaranteed Punctuality</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Early morning airport runs or late night CBD pickups — our drivers arrive ahead of time.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-bold uppercase text-sm text-white mb-1">Zero Surge Pricing</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Unlike rideshare apps that double or triple prices during rain or peak hours, our fares remain regulated and honest.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-bold uppercase text-sm text-white mb-1">All Payment Methods</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Pay conveniently via Cash, Visa, Mastercard, AMEX, Apple Pay, Google Pay, or Cabcharge.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Booking Banner ── */}
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="font-black uppercase tracking-wider text-sm h-12 px-8 shadow-lg">
            <Link href="/book">Calculate Fare &amp; Book Online</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
