import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function RockbankPage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    document.title = "Taxi Service in Rockbank | Bacchus Marsh Taxi Cab";
  }, []);
  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-16 border-b border-border mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-sm font-bold uppercase tracking-wide text-primary mb-6">
            <MapPin className="w-4 h-4" /> VIC 3335
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Taxi Service in Rockbank</h1>
          <p className="text-xl text-muted-foreground">Local and Melbourne taxi transfers for Rockbank — 24 hours, 7 days.</p>
        </div>
      </div>
      <div className="container max-w-4xl mx-auto px-4">
        <div className="prose prose-invert prose-orange max-w-none mb-12">
          <p className="text-lg leading-relaxed mb-6">Rockbank is one of Melbourne's fastest-growing outer-western communities. With Rockbank Train Station providing direct access to Melbourne CBD, many residents rely on taxis for early-morning station connections, late-night returns, and airport transfers to Tullamarine.</p>
          <p className="text-lg leading-relaxed mb-6">Bacchus Marsh Taxi Cab covers all of Rockbank and the neighbouring Thornhill Park and Cobblebank estates. We offer affordable flat-rate and metered services, with no hidden charges. Our vehicles are clean, well-maintained, and equipped for both solo travellers and families.</p>
          <p className="text-lg leading-relaxed">Book a Rockbank taxi online or call us directly on 0435 304 821 for immediate dispatch. We also accept advance bookings for Melbourne Airport runs.</p>
        </div>
        <Button onClick={() => navigate("/book")} size="lg" className="font-bold uppercase tracking-wider">Book a Taxi in Rockbank</Button>
      </div>
    </div>
  );
}
