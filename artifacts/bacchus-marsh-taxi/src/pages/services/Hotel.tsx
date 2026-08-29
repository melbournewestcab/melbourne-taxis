import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Building2, Sparkles, Clock, MapPin, Luggage } from "lucide-react";

export default function HotelPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Hotel & Crown Melbourne Taxi Transfers | Melbourne Taxis";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", "Premium hotel and resort taxi transfers in Melbourne. Direct lobby pickups for Crown Melbourne, Grand Hyatt, Langham, Ritz-Carlton and all CBD accommodation. Call 0435 304 821.");
  }, []);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-20 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <Building2 className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">
            Hotel &amp; Crown <span className="text-primary">Transfers Melbourne</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Direct lobby pickups and VIP drop-offs for all luxury hotels, serviced apartments, and Crown Casino entertainment precinct.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <Sparkles className="w-8 h-8 text-primary" />, label: "Direct Lobby Service", desc: "Our drivers assist with luggage and meet you directly at hotel concierge entrances." },
            { icon: <Luggage className="w-8 h-8 text-primary" />, label: "Airport Direct Connection", desc: "Fast, stress-free transfers connecting your hotel stay directly to Tullamarine & Avalon terminals." },
            { icon: <Clock className="w-8 h-8 text-primary" />, label: "Available 24/7", desc: "Late checkouts, early red-eye departures, and round-the-clock city transport." },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 text-center shadow-sm">
              <div className="flex justify-center mb-3">{item.icon}</div>
              <p className="font-bold uppercase tracking-wide text-sm mb-1 text-white">{item.label}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
          Luxury Transfers to Melbourne's Finest Accommodation
        </h2>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          Visiting Melbourne for business, holidays, or a special weekend getaway? Melbourne Taxis provides effortless transfers to all major Melbourne hotels including Crown Towers, Crown Metropol, Crown Promenade, Grand Hyatt Melbourne, The Langham, The Ritz-Carlton, W Melbourne, QT Melbourne, Park Hyatt, Sofitel on Collins, and all serviced apartments throughout Southbank, Docklands, and the CBD.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="font-black uppercase tracking-wider text-sm px-8 h-12">
            <Link href="/book">Book Hotel Transfer</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-black uppercase tracking-wider text-sm px-8 h-12 border-primary text-primary hover:bg-primary hover:text-black">
            <a href="tel:0435304821">Call 0435 304 821</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
