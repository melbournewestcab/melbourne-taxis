import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Briefcase, Star, Clock, ShieldCheck, Car } from "lucide-react";

export default function CorporatePage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Corporate Travel & Silver Service Melbourne | Melbourne Taxis";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", "Executive corporate taxi and Silver Service transfers in Melbourne. Suited chauffeurs, luxury Lexus sedans, priority dispatch, invoicing. Call 0435 304 821.");
  }, []);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-20 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <Briefcase className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">
            Corporate Travel &amp; <span className="text-primary">Silver Service</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Executive transport solutions for Melbourne businesses, corporate accounts, VIP guests, and airport meet-and-greet transfers.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <Star className="w-8 h-8 text-primary" />, label: "Silver Service Luxury", desc: "Pristine Lexus and executive vehicles with tinted windows and leather interior." },
            { icon: <ShieldCheck className="w-8 h-8 text-primary" />, label: "Professional Chauffeurs", desc: "Experienced, impeccably dressed drivers committed to complete discretion." },
            { icon: <Clock className="w-8 h-8 text-primary" />, label: "Priority Account Dispatch", desc: "Guaranteed scheduling, monthly invoicing, and Cabcharge integration." },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 text-center shadow-sm">
              <div className="flex justify-center mb-3">{item.icon}</div>
              <p className="font-bold uppercase tracking-wide text-sm mb-1 text-white">{item.label}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
          Melbourne's Trusted Executive Transport Partner
        </h2>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          In business, first impressions and punctuality are everything. Melbourne Taxis provides five-star corporate travel across Melbourne CBD, Docklands, Southbank, St Kilda Road business district, Box Hill, and major industrial and tech hubs across Victoria.
        </p>

        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          From board member transfers to high-stakes client airport pickups at Tullamarine, our Silver Service fleet ensures a smooth, whisper-quiet cabin environment where executives can work or relax in total comfort.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="font-black uppercase tracking-wider text-sm px-8 h-12">
            <Link href="/book?vehicle=silver_service">Book Silver Service Now</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-black uppercase tracking-wider text-sm px-8 h-12 border-primary text-primary hover:bg-primary hover:text-black">
            <a href="tel:0435304821">Call 0435 304 821</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
