import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function PlumptonPage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    document.title = "Taxi Service in Plumpton | Bacchus Marsh Taxi Cab";
  }, []);
  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-16 border-b border-border mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-sm font-bold uppercase tracking-wide text-primary mb-6">
            <MapPin className="w-4 h-4" /> VIC 3335
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Taxi Service in Plumpton</h1>
          <p className="text-xl text-muted-foreground">Affordable, reliable taxi service for Plumpton — 24 hours a day, 7 days a week.</p>
        </div>
      </div>
      <div className="container max-w-4xl mx-auto px-4">
        <div className="prose prose-invert prose-orange max-w-none mb-12">
          <p className="text-lg leading-relaxed mb-6">Plumpton is a growing suburb in Melbourne's west, known for the Plumpton Marketplace shopping centre and its family-friendly residential streets. Bacchus Marsh Taxi Cab serves all of Plumpton with prompt, courteous taxi service for both everyday and long-distance travel.</p>
          <p className="text-lg leading-relaxed mb-6">Popular Plumpton routes include shopping trips to Plumpton Marketplace, transfers to Melton and Caroline Springs stations, and Melbourne Airport runs departing at any hour. Our vehicles are clean, air-conditioned, and operated by friendly local drivers.</p>
          <p className="text-lg leading-relaxed">Ready to book? Call 0435 304 821 for an immediate taxi in Plumpton or use our online booking form to schedule in advance.</p>
        </div>
        <Button onClick={() => navigate("/book")} size="lg" className="font-bold uppercase tracking-wider">Book a Taxi in Plumpton</Button>
      </div>
    </div>
  );
}
