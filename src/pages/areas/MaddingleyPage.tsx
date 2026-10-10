import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin } from "lucide-react";

export default function MaddingleyPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Taxi Service in Maddingley | Bacchus Marsh Taxi Cab";
  }, []);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-16 border-b border-border mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-sm font-bold uppercase tracking-wide text-primary mb-6">
            <MapPin className="w-4 h-4" /> VIC 3340
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">
            Taxi Service in Maddingley
          </h1>
          <p className="text-xl text-muted-foreground">
            Reliable local transport for Maddingley estates and industry.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4">
        <div className="prose prose-invert prose-orange max-w-none mb-16">
          <p className="text-lg leading-relaxed mb-6">
            Situated south of the Werribee River, Maddingley is one of the most rapidly expanding suburbs in the Bacchus Marsh area. Bacchus Marsh Taxi Cab provides dedicated, 24/7 service to all Maddingley residents and businesses. Whether you are living in one of the new residential estates or working in the industrial sector, our fleet is stationed nearby to ensure rapid response times.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            We regularly service key local hubs including the Bacchus Marsh Train Station (which borders Maddingley), the Bacchus Marsh College, and the industrial precincts along Grant Street. Our service ensures that commuters can easily reach early morning train connections to Melbourne, and local workers have dependable transport options.
          </p>
          <p className="text-lg leading-relaxed">
            Our modern fleet includes standard sedans, spacious SUVs for larger families, and Maxi Taxis for group outings. Booking online allows you to schedule your ride in advance, guaranteeing that your transport is waiting for you precisely when you need it.
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
              <tr><td className="px-6 py-4 text-muted-foreground">Bacchus Marsh CBD</td><td className="px-6 py-4 font-mono">~ 3 km</td></tr>
              <tr><td className="px-6 py-4 text-muted-foreground">Melbourne Airport</td><td className="px-6 py-4 font-mono">~ 58 km</td></tr>
              <tr><td className="px-6 py-4 text-muted-foreground">Melton Station</td><td className="px-6 py-4 font-mono">~ 18 km</td></tr>
              <tr><td className="px-6 py-4 text-muted-foreground">Darley Plaza</td><td className="px-6 py-4 font-mono">~ 5 km</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-black uppercase tracking-wide mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="mb-16">
          <AccordionItem value="item-1" className="border-border">
            <AccordionTrigger className="text-lg font-bold hover:text-primary">Can I pre-book an early morning taxi to the train station?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              Yes, absolutely. We highly encourage Maddingley residents to pre-book station transfers using our online booking system to ensure you never miss a connection.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-border">
            <AccordionTrigger className="text-lg font-bold hover:text-primary">Do your drivers know the new housing estates?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              Yes, our dispatch systems and GPS are continuously updated to include all newly constructed roads and estates within the Maddingley development zones.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="bg-primary/10 border border-primary/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Need a ride in Maddingley?</h3>
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
