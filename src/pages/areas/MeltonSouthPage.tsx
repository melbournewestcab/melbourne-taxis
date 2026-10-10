import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function MeltonSouthPage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    document.title = "Taxi Service in Melton South | Bacchus Marsh Taxi Cab";
  }, []);
  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-16 border-b border-border mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-sm font-bold uppercase tracking-wide text-primary mb-6">
            <MapPin className="w-4 h-4" /> VIC 3338
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Taxi Service in Melton South</h1>
          <p className="text-xl text-muted-foreground">Reliable, on-time taxi service for Melton South residents — 24 hours a day.</p>
        </div>
      </div>
      <div className="container max-w-4xl mx-auto px-4">
        <div className="prose prose-invert prose-orange max-w-none mb-12">
          <p className="text-lg leading-relaxed mb-6">Melton South is one of the busiest residential areas in the City of Melton, home to Woodgrove Shopping Centre, Melton South Primary School, and a wide range of medical and allied health services. Bacchus Marsh Taxi Cab provides comprehensive taxi and transfer services across all Melton South streets.</p>
          <p className="text-lg leading-relaxed mb-6">We regularly transport Melton South residents to Melton Train Station for Melbourne commutes, Melbourne Airport for early-morning flights, and Sunshine, Footscray and Melbourne CBD for hospital appointments and work travel.</p>
          <p className="text-lg leading-relaxed">Our Melton South service covers every street including Coburns Road, Ferris Road, and the surrounding estates. Call 0435 304 821 for same-day bookings or use our online form for advance scheduling.</p>
        </div>
        <Button onClick={() => navigate("/book")} size="lg" className="font-bold uppercase tracking-wider">Book a Taxi in Melton South</Button>
      </div>
    </div>
  );
}
