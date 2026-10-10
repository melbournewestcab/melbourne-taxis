import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function DeansidePage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    document.title = "Taxi Service in Deanside | Bacchus Marsh Taxi Cab";
  }, []);
  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-16 border-b border-border mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-sm font-bold uppercase tracking-wide text-primary mb-6">
            <MapPin className="w-4 h-4" /> VIC 3336
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Taxi Service in Deanside</h1>
          <p className="text-xl text-muted-foreground">Fast taxi and transfer service for Deanside — connecting you to Melbourne and beyond.</p>
        </div>
      </div>
      <div className="container max-w-4xl mx-auto px-4">
        <div className="prose prose-invert prose-orange max-w-none mb-12">
          <p className="text-lg leading-relaxed mb-6">Deanside is a modern residential suburb in Melbourne's outer-west, strategically located between Rockbank and Caroline Springs. It offers residents easy access to the Western Ring Road, Watergardens Shopping Town, and Caroline Springs Station. Bacchus Marsh Taxi Cab now provides full taxi coverage for Deanside.</p>
          <p className="text-lg leading-relaxed mb-6">Common Deanside taxi trips include Caroline Springs Station runs for CBD commuters, shopping transfers to Watergardens and Highpoint, and Melbourne Airport departures. We operate around the clock with no booking fees and upfront metered pricing.</p>
          <p className="text-lg leading-relaxed">Book a Deanside taxi online using our instant booking form, or call 0435 304 821 any time of the day or night.</p>
        </div>
        <Button onClick={() => navigate("/book")} size="lg" className="font-bold uppercase tracking-wider">Book a Taxi in Deanside</Button>
      </div>
    </div>
  );
}
