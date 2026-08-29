import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AtoBPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "A to B Point-to-Point Taxi Melbourne | Melbourne Taxis";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", "Point-to-point taxi transfers across all Melbourne suburbs. Fixed or metered fares, instant dispatch, 24/7. Book online or call 0435 304 821.");
  }, []);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-20 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <MapPin className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">
            A to B <span className="text-primary">Melbourne Point-to-Point Cabs</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Direct, reliable point-to-point transfers across Melbourne CBD and all surrounding suburbs. Available 24 hours a day, 7 days a week.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <Clock className="w-8 h-8 text-primary" />, label: "Fast Local Dispatch", desc: "Average pickup times under 5–15 minutes across Greater Melbourne." },
            { icon: <CheckCircle2 className="w-8 h-8 text-primary" />, label: "No Surge Pricing", desc: "Regulated meter rates and upfront fixed price options without unexpected spikes." },
            { icon: <ShieldCheck className="w-8 h-8 text-primary" />, label: "Safe Transport Accredited", desc: "Experienced, fully accredited professional drivers and clean vehicles." },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 text-center shadow-sm">
              <div className="flex justify-center mb-3">{item.icon}</div>
              <p className="font-bold uppercase tracking-wide text-sm mb-1 text-white">{item.label}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
          Everyday Transport Across All Melbourne Suburbs
        </h2>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          Whether you need a quick ride down to the local shopping center, a safe lift home after a night out in the city, transport to a medical appointment, or an inter-suburban transfer from Box Hill to Werribee, Melbourne Taxis has you covered.
        </p>

        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          Our extensive fleet of modern sedans, premium SUVs, and Maxi Taxis operates around the clock. We cater to everyday commuters, students, families, and seniors with courteous, professional assistance every step of the way.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="font-black uppercase tracking-wider text-sm px-8 h-12">
            <Link href="/book">Book Point-to-Point Taxi</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-black uppercase tracking-wider text-sm px-8 h-12 border-primary text-primary hover:bg-primary hover:text-black">
            <a href="tel:0435304821">Call 0435 304 821</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
