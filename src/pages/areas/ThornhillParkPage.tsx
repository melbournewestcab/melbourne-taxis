import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function ThornhillParkPage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    document.title = "Taxi Service in Thornhill Park | Bacchus Marsh Taxi Cab";
  }, []);
  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-16 border-b border-border mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-sm font-bold uppercase tracking-wide text-primary mb-6">
            <MapPin className="w-4 h-4" /> VIC 3335
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Taxi Service in Thornhill Park</h1>
          <p className="text-xl text-muted-foreground">Professional taxi and transfer service for Thornhill Park — call anytime.</p>
        </div>
      </div>
      <div className="container max-w-4xl mx-auto px-4">
        <div className="prose prose-invert prose-orange max-w-none mb-12">
          <p className="text-lg leading-relaxed mb-6">Thornhill Park is a master-planned community adjacent to Rockbank, designed with parks, wetlands, and modern amenities. As this suburb continues to grow, Bacchus Marsh Taxi Cab ensures residents have access to reliable, professional taxi transport around the clock.</p>
          <p className="text-lg leading-relaxed mb-6">We specialise in Rockbank Station transfers for Thornhill Park commuters heading to Melbourne — a short drive that saves time and avoids parking. We also service Melbourne Airport departures with guaranteed on-time pickup, regardless of your flight time.</p>
          <p className="text-lg leading-relaxed">Book a Thornhill Park taxi online or call 0435 304 821. We offer sedan, SUV, 6-seater, and Maxi Taxi options to suit all group sizes.</p>
        </div>
        <Button onClick={() => navigate("/book")} size="lg" className="font-bold uppercase tracking-wider">Book a Taxi in Thornhill Park</Button>
      </div>
    </div>
  );
}
