import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function MeltonWestPage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    document.title = "Taxi Service in Melton West | Bacchus Marsh Taxi Cab";
  }, []);
  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-16 border-b border-border mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-sm font-bold uppercase tracking-wide text-primary mb-6">
            <MapPin className="w-4 h-4" /> VIC 3337
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Taxi Service in Melton West</h1>
          <p className="text-xl text-muted-foreground">Fast and affordable taxi service for Melton West — available 24/7.</p>
        </div>
      </div>
      <div className="container max-w-4xl mx-auto px-4">
        <div className="prose prose-invert prose-orange max-w-none mb-12">
          <p className="text-lg leading-relaxed mb-6">Melton West is a well-established suburb with strong community ties, excellent schools, and convenient access to Melton Town Centre. Bacchus Marsh Taxi Cab services all of Melton West for local trips, shopping runs, medical appointments, and long-distance Melbourne transfers.</p>
          <p className="text-lg leading-relaxed mb-6">We provide frequent transfers to Melton Station, Melbourne Airport (Tullamarine), and hospitals including Western Health campuses in Footscray and Sunshine. Large-group transport via our Maxi Taxi and 6-seater vehicles is also available for Melton West residents.</p>
          <p className="text-lg leading-relaxed">Whether you need an early-morning airport run or a late-night return trip from Melbourne, our Melton West drivers are ready around the clock. Call 0435 304 821 or book online today.</p>
        </div>
        <Button onClick={() => navigate("/book")} size="lg" className="font-bold uppercase tracking-wider">Book a Taxi in Melton West</Button>
      </div>
    </div>
  );
}
