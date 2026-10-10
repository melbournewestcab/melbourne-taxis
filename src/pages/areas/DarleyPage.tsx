import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin } from "lucide-react";

export default function DarleyPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Taxi Service in Darley | Bacchus Marsh Taxi Cab";
  }, []);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-16 border-b border-border mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-sm font-bold uppercase tracking-wide text-primary mb-6">
            <MapPin className="w-4 h-4" /> VIC 3340
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">
            Taxi Service in Darley
          </h1>
          <p className="text-xl text-muted-foreground">
            Fast dispatch for Darley's residential neighborhoods and parks.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4">
        <div className="prose prose-invert prose-orange max-w-none mb-16">
          <p className="text-lg leading-relaxed mb-6">
            Located just north of the Bacchus Marsh town center, Darley is a major residential suburb characterized by beautiful views and proximity to the Lerderderg River. Bacchus Marsh Taxi Cab provides rapid, reliable service to all Darley residents.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            Because Darley is deeply integrated with Bacchus Marsh, our drivers are constantly in the area. We can provide extremely fast response times for local trips to the Darley Plaza, Bacchus Marsh Hospital, or the local sporting reserves. We are the trusted transport provider for local school runs and community events.
          </p>
          <p className="text-lg leading-relaxed">
            Heading further out? We offer fixed-price airport transfers from Darley direct to Tullamarine, ensuring you start your holiday or business trip in comfort without worrying about parking fees.
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
              <tr><td className="px-6 py-4 text-muted-foreground">Bacchus Marsh Main St</td><td className="px-6 py-4 font-mono">~ 4 km</td></tr>
              <tr><td className="px-6 py-4 text-muted-foreground">Bacchus Marsh Station</td><td className="px-6 py-4 font-mono">~ 5 km</td></tr>
              <tr><td className="px-6 py-4 text-muted-foreground">Melbourne Airport</td><td className="px-6 py-4 font-mono">~ 53 km</td></tr>
              <tr><td className="px-6 py-4 text-muted-foreground">Lerderderg State Park</td><td className="px-6 py-4 font-mono">~ 6 km</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-black uppercase tracking-wide mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="mb-16">
          <AccordionItem value="item-1" className="border-border">
            <AccordionTrigger className="text-lg font-bold hover:text-primary">What is the average wait time in Darley?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              Because Darley is essentially part of the central Bacchus Marsh hub, average dispatch times are very low—typically under 15 minutes during standard hours.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-border">
            <AccordionTrigger className="text-lg font-bold hover:text-primary">Do you provide child seats?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              We can provide vehicles equipped with appropriate child restraints upon request. Please specify this requirement in the 'Special Notes' section when booking online.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="bg-primary/10 border border-primary/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Need a ride in Darley?</h3>
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
