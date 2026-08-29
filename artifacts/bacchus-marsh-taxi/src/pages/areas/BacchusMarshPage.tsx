import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin } from "lucide-react";

export default function BacchusMarshPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Taxi Service in Bacchus Marsh | Bacchus Marsh Taxi Cab";
  }, []);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-16 border-b border-border mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-sm font-bold uppercase tracking-wide text-primary mb-6">
            <MapPin className="w-4 h-4" /> VIC 3340
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">
            Taxi Service in Bacchus Marsh
          </h1>
          <p className="text-xl text-muted-foreground">
            Fast, reliable, and premium local transport.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4">
        <div className="prose prose-invert prose-orange max-w-none mb-16">
          <p className="text-lg leading-relaxed mb-6">
            Welcome to Bacchus Marsh Taxi Cab, the premier transport provider for the historic town of Bacchus Marsh. Located approximately 55 kilometers west of the Melbourne CBD, Bacchus Marsh is a vibrant community that demands reliable, 24/7 transport solutions. Whether you're a local resident, a commuter heading to the station, or a visitor exploring the famous Avenue of Honour, our fleet is ready to serve you.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            Our deep roots in the community mean our drivers possess unmatched local knowledge. We navigate the busy Main Street during the Strawberry and Cherry Festival with ease, and we know the fastest routes to the surrounding rural properties. From standard sedans for your everyday errands to Maxi Taxis for group outings to the local wineries, we have a vehicle for every occasion.
          </p>
          <p className="text-lg leading-relaxed">
            We are fully licensed, insured, and committed to passenger safety. Our vehicles are rigorously maintained and cleaned daily. When you book with Bacchus Marsh Taxi Cab, you're not just getting a ride; you're getting a professional service that guarantees punctuality, transparent pricing, and a comfortable journey across the Moorabool Shire.
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
              <tr><td className="px-6 py-4 text-muted-foreground">Bacchus Marsh Train Station</td><td className="px-6 py-4 font-mono">~ 2.5 km</td></tr>
              <tr><td className="px-6 py-4 text-muted-foreground">Melbourne Airport (Tullamarine)</td><td className="px-6 py-4 font-mono">~ 55 km</td></tr>
              <tr><td className="px-6 py-4 text-muted-foreground">Melbourne CBD</td><td className="px-6 py-4 font-mono">~ 55 km</td></tr>
              <tr><td className="px-6 py-4 text-muted-foreground">Melton</td><td className="px-6 py-4 font-mono">~ 15 km</td></tr>
              <tr><td className="px-6 py-4 text-muted-foreground">Werribee Gorge State Park</td><td className="px-6 py-4 font-mono">~ 8 km</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-black uppercase tracking-wide mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="mb-16">
          <AccordionItem value="item-1" className="border-border">
            <AccordionTrigger className="text-lg font-bold hover:text-primary">How fast can I get a taxi in Bacchus Marsh?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              For immediate bookings in the central Bacchus Marsh area, our standard dispatch time is typically between 10-15 minutes. During peak hours or extreme weather, this may vary. We highly recommend booking online in advance for critical trips.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-border">
            <AccordionTrigger className="text-lg font-bold hover:text-primary">Do you service the rural areas around town?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              Yes, we provide service to the surrounding rural and semi-rural properties in the Moorabool Shire. For remote pickups, we advise booking at least 30 minutes in advance.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-border">
            <AccordionTrigger className="text-lg font-bold hover:text-primary">Are your prices fixed?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              We operate on standard Victorian taxi meter rates. However, you can generate a highly accurate fare estimate using our online booking system before you commit to the ride.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="bg-primary/10 border border-primary/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Need a ride in Bacchus Marsh?</h3>
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
