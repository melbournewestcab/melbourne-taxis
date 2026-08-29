import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin } from "lucide-react";

export default function MeltonPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Taxi Service in Melton | Bacchus Marsh Taxi Cab";
  }, []);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-16 border-b border-border mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-sm font-bold uppercase tracking-wide text-primary mb-6">
            <MapPin className="w-4 h-4" /> VIC 3337
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">
            Taxi Service in Melton
          </h1>
          <p className="text-xl text-muted-foreground">
            Serving the fast-growing suburbs of the City of Melton.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4">
        <div className="prose prose-invert prose-orange max-w-none mb-16">
          <p className="text-lg leading-relaxed mb-6">
            Located just 35km from the Melbourne CBD, Melton is a massive growth corridor. Bacchus Marsh Taxi Cab has expanded its operations to provide comprehensive coverage across the entire Melton area, including Melton South, Melton West, Kurunjang, and the newer estates in Strathtulloh and Weir Views.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            Our service in Melton is designed to bridge the gap between suburban living and the city. We facilitate hundreds of weekly transfers to the Melton Train Station, Woodgrove Shopping Centre, and medical facilities. As the population grows, so does our fleet, ensuring we can meet the high demand for reliable point-to-point transport.
          </p>
          <p className="text-lg leading-relaxed">
            For businesses operating in the Melton industrial areas, we offer corporate accounts and courier parcel delivery services. Whether it's a short trip across town or a luxury transfer to the airport, our Melton drivers deliver exceptional service.
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
              <tr><td className="px-6 py-4 text-muted-foreground">Woodgrove Shopping Centre</td><td className="px-6 py-4 font-mono">~ 3 km</td></tr>
              <tr><td className="px-6 py-4 text-muted-foreground">Melbourne Airport</td><td className="px-6 py-4 font-mono">~ 40 km</td></tr>
              <tr><td className="px-6 py-4 text-muted-foreground">Melbourne CBD</td><td className="px-6 py-4 font-mono">~ 38 km</td></tr>
              <tr><td className="px-6 py-4 text-muted-foreground">Bacchus Marsh</td><td className="px-6 py-4 font-mono">~ 15 km</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-black uppercase tracking-wide mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="mb-16">
          <AccordionItem value="item-1" className="border-border">
            <AccordionTrigger className="text-lg font-bold hover:text-primary">Do you service the new estates in Melton South and Weir Views?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              Yes! Our navigation systems are constantly updated. If your street is brand new, providing intersection cross-streets or landmarks in the booking notes helps our drivers find you quickly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-border">
            <AccordionTrigger className="text-lg font-bold hover:text-primary">Can I get a Maxi Taxi in Melton?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              Yes, our Maxi Taxi fleet actively operates in Melton. They are very popular for weekend group travel to the city or local events, so pre-booking is highly recommended.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="bg-primary/10 border border-primary/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Need a ride in Melton?</h3>
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
