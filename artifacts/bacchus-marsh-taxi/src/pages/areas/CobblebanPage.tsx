import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function CoblebankPage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    document.title = "Taxi Service in Cobblebank | Bacchus Marsh Taxi Cab";
  }, []);
  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-16 border-b border-border mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-sm font-bold uppercase tracking-wide text-primary mb-6">
            <MapPin className="w-4 h-4" /> VIC 3338
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Taxi Service in Cobblebank</h1>
          <p className="text-xl text-muted-foreground">Modern taxi service for Cobblebank's growing community — on time, every time.</p>
        </div>
      </div>
      <div className="container max-w-4xl mx-auto px-4">
        <div className="prose prose-invert prose-orange max-w-none mb-12">
          <p className="text-lg leading-relaxed mb-6">Cobblebank is one of Melton's newest and most rapidly expanding suburbs, attracting young families and professionals seeking space within reach of Melbourne. Bacchus Marsh Taxi Cab has extended its coverage to serve all of Cobblebank with prompt, professional taxi transport.</p>
          <p className="text-lg leading-relaxed mb-6">Common trips from Cobblebank include commuter connections to Melton Station, airport transfers to Melbourne Tullamarine, and evening returns from Melbourne's CBD entertainment precinct. We also operate parcel and courier deliveries for local businesses.</p>
          <p className="text-lg leading-relaxed">Book a Cobblebank taxi online 24/7 or call 0435 304 821 for immediate dispatch. All vehicles are metered and fully licensed.</p>
        </div>
        <Button onClick={() => navigate("/book")} size="lg" className="font-bold uppercase tracking-wider">Book a Taxi in Cobblebank</Button>
      </div>
    </div>
  );
}
