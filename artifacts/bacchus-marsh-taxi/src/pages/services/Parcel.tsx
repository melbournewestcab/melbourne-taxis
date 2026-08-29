import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Package, Clock, ShieldCheck, Zap } from "lucide-react";

export default function ParcelPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Urgent Same-Day Parcel Delivery Melbourne | Melbourne Taxis";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", "Same-day urgent courier and parcel delivery across Melbourne. Immediate pickup, direct door-to-door delivery, live driver tracking. Call 0435 304 821.");
  }, []);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-20 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <Package className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">
            Same-Day Urgent <span className="text-primary">Parcel &amp; Courier Delivery</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Fast, secure point-to-point courier service across Greater Melbourne. Immediate dispatch with no intermediary sorting hubs.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <Zap className="w-8 h-8 text-primary" />, label: "Immediate Pickup", desc: "Our driver arrives within 15–30 minutes to collect your urgent parcel or document." },
            { icon: <ShieldCheck className="w-8 h-8 text-primary" />, label: "Direct Delivery", desc: "No sorting warehouses — your items travel directly from sender to recipient." },
            { icon: <Clock className="w-8 h-8 text-primary" />, label: "Available 24/7", desc: "Late night medical deliveries, legal contracts, and weekend critical freight." },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 text-center shadow-sm">
              <div className="flex justify-center mb-3">{item.icon}</div>
              <p className="font-bold uppercase tracking-wide text-sm mb-1 text-white">{item.label}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
          Direct Courier Solution for Melbourne Businesses &amp; Residents
        </h2>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          When regular post or standard couriers are too slow, Melbourne Taxis provides an express direct-drive delivery service across Greater Melbourne. We transport urgent legal contracts, architectural blueprints, medical pathology samples, spare automotive parts, keys, passports, and retail packages safely and swiftly.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="font-black uppercase tracking-wider text-sm px-8 h-12">
            <Link href="/book?service=parcel">Book Urgent Delivery</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-black uppercase tracking-wider text-sm px-8 h-12 border-primary text-primary hover:bg-primary hover:text-black">
            <a href="tel:0435304821">Call 0435 304 821</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
