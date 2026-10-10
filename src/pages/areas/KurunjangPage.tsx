import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function KurunjangPage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    document.title = "Taxi Service in Kurunjang | Bacchus Marsh Taxi Cab";
  }, []);
  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-16 border-b border-border mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-sm font-bold uppercase tracking-wide text-primary mb-6">
            <MapPin className="w-4 h-4" /> VIC 3337
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Taxi Service in Kurunjang</h1>
          <p className="text-xl text-muted-foreground">Dependable taxi service for Kurunjang — school runs, medical trips, and airport transfers.</p>
        </div>
      </div>
      <div className="container max-w-4xl mx-auto px-4">
        <div className="prose prose-invert prose-orange max-w-none mb-12">
          <p className="text-lg leading-relaxed mb-6">Kurunjang is an established Melton suburb known for its family-friendly streets and proximity to Melton Town Centre. Bacchus Marsh Taxi Cab provides reliable daily taxi services for Kurunjang residents including school runs to Kurunjang Secondary College, shopping trips to Woodgrove, and work transfers across the western corridor.</p>
          <p className="text-lg leading-relaxed mb-6">Our Kurunjang drivers are local and know every street. We specialise in early-morning Melbourne Airport transfers, ensuring you reach Tullamarine on time regardless of your departure hour. Advance booking available online.</p>
          <p className="text-lg leading-relaxed">Call 0435 304 821 for immediate pickup or use our online booking system for scheduled trips. We accept cash and card payments.</p>
        </div>
        <Button onClick={() => navigate("/book")} size="lg" className="font-bold uppercase tracking-wider">Book a Taxi in Kurunjang</Button>
      </div>
    </div>
  );
}
