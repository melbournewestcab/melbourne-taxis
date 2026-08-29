import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function DiggersRestPage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    document.title = "Taxi Service in Diggers Rest | Bacchus Marsh Taxi Cab";
  }, []);
  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-16 border-b border-border mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-sm font-bold uppercase tracking-wide text-primary mb-6">
            <MapPin className="w-4 h-4" /> VIC 3427
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Taxi Service in Diggers Rest</h1>
          <p className="text-xl text-muted-foreground">Taxi and train station transfers for Diggers Rest — 24/7, 365 days.</p>
        </div>
      </div>
      <div className="container max-w-4xl mx-auto px-4">
        <div className="prose prose-invert prose-orange max-w-none mb-12">
          <p className="text-lg leading-relaxed mb-6">Diggers Rest is a semi-rural township in the northern reaches of the City of Melton, popular for its relaxed lifestyle and the Diggers Rest Train Station providing direct Sunbury line access to Melbourne CBD. Bacchus Marsh Taxi Cab provides reliable taxi service for Diggers Rest residents and nearby rural properties.</p>
          <p className="text-lg leading-relaxed mb-6">We run frequent transfers between Diggers Rest and the train station, as well as longer trips to Melbourne Airport, Sunbury, and Bacchus Marsh. Our drivers know the local roads and surrounding rural areas, ensuring safe and timely service day or night.</p>
          <p className="text-lg leading-relaxed">Call 0435 304 821 or book online to schedule a taxi in Diggers Rest. Advance bookings recommended for early-morning airport runs.</p>
        </div>
        <Button onClick={() => navigate("/book")} size="lg" className="font-bold uppercase tracking-wider">Book a Taxi in Diggers Rest</Button>
      </div>
    </div>
  );
}
