import React, { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { MapPin, ArrowRight, Search, Plane, Building2, Shield, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SUBURBS_DATA, MELBOURNE_REGIONS, SuburbInfo } from "@/data/suburbsData";

export default function ServiceAreasPage() {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  useEffect(() => {
    document.title = "Melbourne Taxi Service Areas | All Melbourne Suburbs & Airport Transfers | Melbourne Taxis";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Explore Melbourne Taxis service areas across all Melbourne suburbs — Melbourne CBD, Northern Suburbs, Eastern Suburbs, Bayside, Western corridor and Melbourne Airport (Tullamarine & Avalon). 24/7 booking.");
    }
  }, []);

  const filteredSuburbs = useMemo(() => {
    return SUBURBS_DATA.filter((suburb) => {
      const matchesSearch =
        suburb.name.toLowerCase().includes(search.toLowerCase()) ||
        suburb.postcode.toLowerCase().includes(search.toLowerCase()) ||
        suburb.tagline.toLowerCase().includes(search.toLowerCase()) ||
        suburb.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));

      const matchesRegion = selectedRegion === "All" || suburb.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [search, selectedRegion]);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      {/* ── Hero Section ── */}
      <div className="bg-secondary py-16 md:py-20 border-b border-border mb-12">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-bold uppercase tracking-wider text-primary mb-4">
            <MapPin className="w-3.5 h-3.5" /> Greater Melbourne &amp; Regional Victoria
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 text-white">
            Melbourne Taxi <span className="text-primary">Service Areas</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-medium">
            24/7 door-to-door taxi service, airport transfers, Maxi Cabs, and Silver Service across every Melbourne suburb and regional Victorian corridor.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search suburb, postcode (e.g. South Yarra, 3000, Tullamarine)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 h-12 bg-background border-border text-foreground rounded-full text-base focus-visible:ring-primary shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* ── Region Filters ── */}
      <div className="container max-w-6xl mx-auto px-4 mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant={selectedRegion === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRegion("All")}
            className="rounded-full text-xs font-bold uppercase tracking-wide"
          >
            All Suburbs ({SUBURBS_DATA.length})
          </Button>
          {MELBOURNE_REGIONS.map((region) => {
            const count = SUBURBS_DATA.filter((s) => s.region === region).length;
            return (
              <Button
                key={region}
                variant={selectedRegion === region ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegion(region)}
                className="rounded-full text-xs font-bold uppercase tracking-wide"
              >
                {region} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      {/* ── Suburb Cards Grid ── */}
      <div className="container max-w-6xl mx-auto px-4">
        {filteredSuburbs.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-xl p-8">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold uppercase mb-2">No Suburbs Found</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              We cover all of Greater Melbourne! Even if your specific street isn't listed here, we dispatch cabs anywhere in Victoria.
            </p>
            <Button asChild>
              <Link href="/book">Book Anywhere in Melbourne</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuburbs.map((area) => (
              <Link key={area.id} href={`/service-areas/${area.id}`}>
                <Card className="h-full bg-card hover:bg-secondary/70 border-border hover:border-primary transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150" />
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="text-primary w-5 h-5 shrink-0" />
                        <div>
                          <h2 className="text-xl font-black uppercase tracking-wide group-hover:text-primary transition-colors">
                            {area.name}
                          </h2>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-primary font-bold">{area.postcode}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">{area.region}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-5 line-clamp-2">
                      {area.tagline}
                    </p>

                    {/* Quick route preview */}
                    <div className="bg-secondary/60 rounded-lg p-3 text-xs mb-4 space-y-1.5 border border-border/40">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Airport (Tullamarine):</span>
                        <span className="font-semibold text-foreground">
                          {area.popularRoutes[0]?.time || "Direct"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Est. Airport Fare:</span>
                        <span className="font-bold text-primary">
                          {area.popularRoutes[0]?.approxFare || "$65+"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-primary font-bold uppercase tracking-wider text-xs group-hover:translate-x-1 transition-transform">
                      View {area.name} Taxi Info
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* ── Airport & Victoria-Wide Transport Banner ── */}
        <div className="mt-16 bg-card border border-primary/30 rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-widest text-primary">Victoria-Wide Taxi Coverage</span>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Need a Taxi Beyond Metropolitan Melbourne?
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed">
              We provide fixed-price long-distance transfers to Geelong, Ballarat, Bendigo, Mornington Peninsula, Yarra Valley, Phillip Island, and regional Victorian destinations 24 hours a day, 7 days a week.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button asChild size="lg" className="font-bold uppercase tracking-wider">
              <Link href="/book">Get Fixed Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-bold uppercase tracking-wider">
              <a href="tel:0435304821">Call 0435 304 821</a>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
