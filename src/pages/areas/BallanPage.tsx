import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin } from "lucide-react";

export default function BallanPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Taxi Service in Ballan | Bacchus Marsh Taxi Cab";
  }, []);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-16 border-b border-border mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-sm font-bold uppercase tracking-wide text-primary mb-6">
            <MapPin className="w-4 h-4" /> VIC 3342
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">
            Taxi Service in Ballan
          </h1>
          <p className="text-xl text-muted-foreground">
            Connecting the historic Ballan township along the western corridor.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4">
        <div className="prose prose-invert prose-orange max-w-none mb-16">
          <p className="text-lg leading-relaxed mb-6">
            Ballan is a picturesque historic township located approximately 80 kilometers west of Melbourne, sitting squarely on the corridor between Bacchus Marsh and Ballarat. Bacchus Marsh Taxi Cab provides essential transport links for Ballan residents, ensuring you are never isolated from major hubs or transport networks.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            We frequently service the Ballan Train Station on the V/Line network, providing seamless transfers for commuters heading into Melbourne or Ballarat. Our drivers are familiar with the local area, including rural properties in Greendale, Gordon, and Mt Wallace.
          </p>
          <p className="text-lg leading-relaxed">
            Whether you need a quick trip into town for groceries, a medical transport to Bacchus Marsh Hospital, or a comfortable airport transfer, our fleet delivers a safe, fixed-price service you can rely on.
          </p>
        </div>

        <h2 className="text-2xl font-black uppercase tracking-wide mb-6">Key Routes & Estimates</h2>
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-16">
          <table className="w-full text-left">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold uppercase text-sm tracking-wide">Destination</th>
                <th className="px-6 py-4 font-bold uppercase text-sm tracking-wide">Est. Distance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-6 py-4 text-muted-foreground">Bacchus Marsh</td><td className="px-6 py-4 font-mono">~ 30 km</td></tr>
              <tr><td className="px-6 py-4 text-muted-foreground">Ballarat</td><td className="px-6 py-4 font-mono">~ 35 km</td></tr>
              <tr><td className="px-6 py-4 text-muted-foreground">Melbourne Airport</td><td className="px-6 py-4 font-mono">~ 75 km</td></tr>
              <tr><td className="px-6 py-4 text-muted-foreground">Daylesford</td><td className="px-6 py-4 font-mono">~ 40 km</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-black uppercase tracking-wide mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="mb-16">
          <AccordionItem value="item-1" className="border-border">
            <AccordionTrigger className="text-lg font-bold hover:text-primary">Do you do trips from Ballan to Ballarat?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              Yes, we frequently operate trips up the Western Freeway to Ballarat for medical appointments, shopping, and social events.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-border">
            <AccordionTrigger className="text-lg font-bold hover:text-primary">Are you available late at night in Ballan?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              Our service operates 24/7. However, for late-night pickups in the Ballan area, we strongly advise booking online in advance to guarantee a driver is dispatched to your location.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="bg-primary/10 border border-primary/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Need a ride from Ballan?</h3>
          <p className="text-muted-foreground mb-8">Book online instantly or speak with our dispatch team.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/book")}
              size="lg"
              className="font-bold uppercase tracking-wider"
            >
              Book Online Now
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black font-bold uppercase tracking-wider">
              <a href="tel:0435304821">Call 0435 304 821</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
