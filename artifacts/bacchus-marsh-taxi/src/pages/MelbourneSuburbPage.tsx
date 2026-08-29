import React from "react";
import { Link, useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin, Phone, Plane, Shield, Clock, Users, ArrowRight, CheckCircle2, ChevronRight, Car } from "lucide-react";
import { getSuburbById, SUBURBS_DATA, SuburbInfo } from "@/data/suburbsData";
import { SEO } from "@/components/SEO";

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface Props {
  suburbSlug?: string;
  params?: { slug?: string };
}

export default function MelbourneSuburbPage({ suburbSlug, params: routeParams }: Props = {}) {
  const hookParams = useParams<{ slug?: string }>();
  const slug = suburbSlug || routeParams?.slug || hookParams?.slug || "melbourne-cbd";
  const [, navigate] = useLocation();

  const suburb: SuburbInfo = getSuburbById(slug) || SUBURBS_DATA[0];

  // Find other suburbs in the same region or nearby
  const nearbySuburbs = SUBURBS_DATA.filter((s) => s.id !== suburb.id).slice(0, 6);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <SEO suburb={suburb} canonicalPath={`/service-areas/${suburb.id}`} />
      {/* ── Breadcrumbs ── */}
      <div className="bg-secondary/60 border-b border-border py-3">
        <div className="container max-w-5xl mx-auto px-4 flex items-center text-xs font-semibold text-muted-foreground gap-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/service-areas" className="hover:text-primary transition-colors">Service Areas</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground">{suburb.name}</span>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <div className="bg-secondary py-16 border-b border-border">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-xs font-bold uppercase tracking-wide text-primary mb-4">
            <MapPin className="w-3.5 h-3.5" /> {suburb.postcode} · {suburb.region}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-4 text-white">
            Taxi Service in <span className="text-primary">{suburb.name}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8">
            {suburb.tagline} 24/7 fixed &amp; metered rates, instant dispatch, airport transfers &amp; Maxi Cabs.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <Button asChild size="lg" className="font-black uppercase tracking-wider text-sm px-6 h-12">
              <Link href={`/book?pickup=${encodeURIComponent(suburb.name + ", " + suburb.postcode)}`}>
                Book Taxi in {suburb.name}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-black uppercase tracking-wider text-sm px-6 h-12 border-2 border-white text-white hover:bg-white hover:text-black">
              <a href="tel:0435304821">
                <Phone className="w-4 h-4 mr-2 text-primary" /> Call 0435 304 821
              </a>
            </Button>
            <a
              href={`https://wa.me/61435304821?text=Hi%2C%20I%20would%20like%20to%20book%20a%20taxi%20in%20${encodeURIComponent(suburb.name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm font-black uppercase tracking-wider rounded-md text-white transition-opacity hover:opacity-90"
              style={{ background: "#25D366" }}
            >
              <WhatsAppIcon /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Fast Trust Pillars ── */}
      <div className="bg-card border-b border-border py-6">
        <div className="container max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wide">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            <span>24/7 Fast Pickups</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wide">
            <Shield className="w-4 h-4 text-primary shrink-0" />
            <span>Safe Transport VIC</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wide">
            <Plane className="w-4 h-4 text-primary shrink-0" />
            <span>Flight Monitored</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>Fixed Airport Rates</span>
          </div>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="container max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left / Center: Rich Text & Routes */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Detailed SEO Narrative */}
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-6">
                Reliable 24/7 Taxi Service in {suburb.name}
              </h2>
              <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
                {suburb.heroSummary.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Popular Routes & Estimates Table */}
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                <Plane className="w-5 h-5 text-primary" /> Popular Travel Routes &amp; Estimates from {suburb.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Estimated drive times and approximate standard fares (excl. specific tolls/peak wait times). Fixed upfront prices available on booking.
              </p>
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-secondary text-xs uppercase font-bold tracking-wider text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-5 py-3.5">Destination</th>
                        <th className="px-5 py-3.5">Distance</th>
                        <th className="px-5 py-3.5">Est. Time</th>
                        <th className="px-5 py-3.5">Est. Fare</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {suburb.popularRoutes.map((route, i) => (
                        <tr key={i} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-5 py-4 font-semibold text-white">{route.to}</td>
                          <td className="px-5 py-4 font-mono text-muted-foreground">{route.dist}</td>
                          <td className="px-5 py-4 text-muted-foreground">{route.time}</td>
                          <td className="px-5 py-4 font-bold text-primary">{route.approxFare}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Key Landmarks / Destination Coverage */}
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4">
                Key Destinations &amp; Landmarks in {suburb.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suburb.keyHighlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-lg bg-card border border-border">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-foreground">{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fleet Options Available for This Suburb */}
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4">
                Vehicle Options in {suburb.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-card border-border p-4">
                  <h4 className="font-bold uppercase text-sm text-primary mb-1">Standard Sedan</h4>
                  <p className="text-xs text-muted-foreground mb-3">1–4 Passengers · 2-3 Suitcases. Perfect for daily commutes &amp; airport runs.</p>
                  <Button asChild size="sm" variant="outline" className="w-full text-xs font-bold uppercase">
                    <Link href={`/book?vehicle=sedan&pickup=${encodeURIComponent(suburb.name)}`}>Book Sedan</Link>
                  </Button>
                </Card>

                <Card className="bg-card border-border p-4">
                  <h4 className="font-bold uppercase text-sm text-primary mb-1">Silver Service</h4>
                  <p className="text-xs text-muted-foreground mb-3">1–4 Passengers · Luxury Lexus/European sedans with professional suited chauffeurs.</p>
                  <Button asChild size="sm" variant="outline" className="w-full text-xs font-bold uppercase">
                    <Link href={`/book?vehicle=silver_service&pickup=${encodeURIComponent(suburb.name)}`}>Book Silver</Link>
                  </Button>
                </Card>

                <Card className="bg-card border-border p-4">
                  <h4 className="font-bold uppercase text-sm text-primary mb-1">Maxi Taxi Cab</h4>
                  <p className="text-xs text-muted-foreground mb-3">Up to 11 Passengers · Groups, events, sports equipment &amp; excess baggage.</p>
                  <Button asChild size="sm" variant="outline" className="w-full text-xs font-bold uppercase">
                    <Link href={`/book?vehicle=maxi_taxi&pickup=${encodeURIComponent(suburb.name)}`}>Book Maxi</Link>
                  </Button>
                </Card>
              </div>
            </div>

            {/* Suburb-Specific FAQs */}
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4">
                Frequently Asked Questions — {suburb.name} Taxi Service
              </h3>
              <Accordion type="single" collapsible className="w-full bg-card border border-border rounded-xl px-4 divide-y divide-border">
                {suburb.faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-none py-2">
                    <AccordionTrigger className="text-base font-bold text-left hover:text-primary">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
                <AccordionItem value="item-std-1" className="border-none py-2">
                  <AccordionTrigger className="text-base font-bold text-left hover:text-primary">
                    What payment methods do Melbourne Taxis accept?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                    All Melbourne Taxis accept Cash, Credit Cards (Visa, Mastercard, AMEX), EFTPOS, Apple Pay, Google Pay, and Cabcharge. Contactless payment terminals are fitted in all vehicles.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-std-2" className="border-none py-2">
                  <AccordionTrigger className="text-base font-bold text-left hover:text-primary">
                    Are Melbourne Taxis accredited with Safe Transport Victoria?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                    Yes. All drivers are fully accredited by Safe Transport Victoria, holding commercial passenger vehicle certifications, police background checks, and annual safety audits.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

          </div>

          {/* Right Sidebar: Sticky Instant Booking Card & Other Suburbs */}
          <div className="space-y-6">
            
            {/* Quick Action Booking Card */}
            <Card className="bg-card border-primary/40 shadow-lg sticky top-24">
              <CardContent className="p-6 space-y-5">
                <div className="text-center pb-3 border-b border-border">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">Instant Online Booking</span>
                  <h3 className="text-xl font-black uppercase text-white">Ride to or from {suburb.name}</h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-secondary rounded-lg text-xs space-y-1">
                    <span className="font-semibold text-muted-foreground block">Coverage Area:</span>
                    <span className="font-bold text-foreground">{suburb.name} ({suburb.postcode}) &amp; Greater Melbourne</span>
                  </div>

                  <div className="p-3 bg-secondary rounded-lg text-xs space-y-1">
                    <span className="font-semibold text-muted-foreground block">Airport Transfer Guarantee:</span>
                    <span className="font-bold text-foreground">Flight tracking + fixed price options</span>
                  </div>
                </div>

                <Button asChild size="lg" className="w-full font-black uppercase tracking-wider text-sm h-12">
                  <Link href={`/book?pickup=${encodeURIComponent(suburb.name)}`}>
                    Calculate Fare &amp; Book Now
                  </Link>
                </Button>

                <div className="text-center pt-2">
                  <span className="text-xs text-muted-foreground block mb-1">Prefer to speak with dispatch?</span>
                  <a href="tel:0435304821" className="text-lg font-black text-primary hover:underline">
                    0435 304 821
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Related Melbourne Suburbs */}
            <div className="bg-secondary/40 border border-border rounded-xl p-5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-3">
                Other Melbourne Suburbs
              </h4>
              <div className="flex flex-col gap-2">
                {nearbySuburbs.map((s) => (
                  <Link
                    key={s.id}
                    href={`/service-areas/${s.id}`}
                    className="flex items-center justify-between py-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border-b border-border/40 last:border-0"
                  >
                    <span>{s.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground/70">{s.postcode}</span>
                  </Link>
                ))}
              </div>
              <Link href="/service-areas" className="inline-flex items-center text-xs font-bold text-primary hover:underline mt-4">
                View All Melbourne Service Areas →
              </Link>
            </div>

            {/* Keyword tag cloud */}
            <div className="p-4 bg-card border border-border rounded-xl">
              <h5 className="text-[11px] font-bold uppercase text-muted-foreground mb-2">Service Keywords</h5>
              <div className="flex flex-wrap gap-1.5">
                {suburb.keywords.map((kw, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 bg-secondary text-muted-foreground rounded">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
