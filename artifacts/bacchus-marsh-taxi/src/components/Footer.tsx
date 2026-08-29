import React from "react";
import { Link } from "wouter";
import { Phone, MapPin, ShieldCheck, Clock, Plane } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <BrandLogo size="md" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Melbourne's trusted 24/7 taxi and airport transfer network. Servicing Melbourne CBD, Tullamarine &amp; Avalon Airports, all metropolitan suburbs, and regional Victorian corridors with guaranteed on-time arrivals, fixed pricing, and premium fleet vehicles.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <a href="tel:0435304821" className="text-2xl font-black text-primary hover:text-white transition-colors flex items-center gap-2">
                <Phone className="w-5 h-5" /> 0435 304 821
              </a>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" /> Available 24 Hours · 7 Days a Week
              </span>
            </div>
          </div>

          {/* Quick Links & Services */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">All Services</Link></li>
              <li><Link href="/services/airport" className="text-muted-foreground hover:text-primary transition-colors">Airport Transfers (MEL/AVV)</Link></li>
              <li><Link href="/services/corporate" className="text-muted-foreground hover:text-primary transition-colors">Silver Service &amp; Corporate</Link></li>
              <li><Link href="/services/hotel" className="text-muted-foreground hover:text-primary transition-colors">Hotel &amp; Crown Transfers</Link></li>
              <li><Link href="/fleet" className="text-muted-foreground hover:text-primary transition-colors">Our Taxi Fleet</Link></li>
              <li><Link href="/book" className="text-muted-foreground hover:text-primary transition-colors">Book Online Now</Link></li>
            </ul>
          </div>

          {/* Inner & Northern Suburbs */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">CBD, Inner &amp; North</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/service-areas/melbourne-cbd" className="text-muted-foreground hover:text-primary transition-colors">Melbourne CBD Taxi</Link></li>
              <li><Link href="/service-areas/southbank" className="text-muted-foreground hover:text-primary transition-colors">Southbank &amp; Crown Taxi</Link></li>
              <li><Link href="/service-areas/docklands" className="text-muted-foreground hover:text-primary transition-colors">Docklands &amp; Marvel Taxi</Link></li>
              <li><Link href="/service-areas/tullamarine" className="text-muted-foreground hover:text-primary transition-colors">Tullamarine Airport Taxi</Link></li>
              <li><Link href="/service-areas/carlton" className="text-muted-foreground hover:text-primary transition-colors">Carlton &amp; Parkville Taxi</Link></li>
              <li><Link href="/service-areas/brunswick" className="text-muted-foreground hover:text-primary transition-colors">Brunswick &amp; Coburg Taxi</Link></li>
              <li><Link href="/service-areas/preston-reservoir" className="text-muted-foreground hover:text-primary transition-colors">Preston &amp; Reservoir Taxi</Link></li>
              <li><Link href="/service-areas/essendon" className="text-muted-foreground hover:text-primary transition-colors">Essendon &amp; Moonee Ponds Taxi</Link></li>
            </ul>
          </div>

          {/* East, Bayside & West */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">East, Bayside &amp; West</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/service-areas/st-kilda" className="text-muted-foreground hover:text-primary transition-colors">St Kilda Taxi</Link></li>
              <li><Link href="/service-areas/south-yarra" className="text-muted-foreground hover:text-primary transition-colors">South Yarra &amp; Prahran Taxi</Link></li>
              <li><Link href="/service-areas/richmond" className="text-muted-foreground hover:text-primary transition-colors">Richmond &amp; MCG Taxi</Link></li>
              <li><Link href="/service-areas/brighton" className="text-muted-foreground hover:text-primary transition-colors">Brighton &amp; Bayside Taxi</Link></li>
              <li><Link href="/service-areas/box-hill" className="text-muted-foreground hover:text-primary transition-colors">Box Hill Taxi</Link></li>
              <li><Link href="/service-areas/werribee-point-cook" className="text-muted-foreground hover:text-primary transition-colors">Werribee &amp; Point Cook Taxi</Link></li>
              <li><Link href="/service-areas/footscray-yarraville" className="text-muted-foreground hover:text-primary transition-colors">Footscray &amp; Sunshine Taxi</Link></li>
              <li><Link href="/service-areas/bacchus-marsh" className="text-muted-foreground hover:text-primary transition-colors">Bacchus Marsh &amp; Melton Taxi</Link></li>
              <li><Link href="/service-areas" className="text-primary font-bold hover:underline">All 40+ Suburbs →</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Melbourne Taxis. All Rights Reserved. Safe Transport Victoria Accredited.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <span>Fixed &amp; Metered Fares</span>
            <span>·</span>
            <span>No Surge Pricing</span>
            <span>·</span>
            <span>Cash, Card, Apple Pay, Cabcharge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
