import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function FraserRisePage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    document.title = "Taxi Service in Fraser Rise | Bacchus Marsh Taxi Cab";
  }, []);
  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-16 border-b border-border mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-sm font-bold uppercase tracking-wide text-primary mb-6">
            <MapPin className="w-4 h-4" /> VIC 3336
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Taxi Service in Fraser Rise</h1>
          <p className="text-xl text-muted-foreground">Taxi and airport transfer service for Fraser Rise — 24/7 availability.</p>
        </div>
      </div>
      <div className="container max-w-4xl mx-auto px-4">
        <div className="prose prose-invert prose-orange max-w-none mb-12">
          <p className="text-lg leading-relaxed mb-6">Fraser Rise is a thriving new suburb in the City of Melton, popular with families for its modern infrastructure, quality schools, and community facilities. Bacchus Marsh Taxi Cab now provides full taxi coverage for all Fraser Rise streets, estates, and surrounding areas.</p>
          <p className="text-lg leading-relaxed mb-6">We handle daily transfers from Fraser Rise to Caroline Springs Station, Watergardens, and Melton for local needs. For longer journeys, our fleet of sedans, SUVs, and Maxi Taxis covers Melbourne Airport, Melbourne CBD, and all western suburbs destinations.</p>
          <p className="text-lg leading-relaxed">For a fast, reliable taxi in Fraser Rise, call 0435 304 821 or book online. Same-day and advance bookings are welcome.</p>
        </div>
        <Button onClick={() => navigate("/book")} size="lg" className="font-bold uppercase tracking-wider">Book a Taxi in Fraser Rise</Button>
      </div>
    </div>
  );
}
