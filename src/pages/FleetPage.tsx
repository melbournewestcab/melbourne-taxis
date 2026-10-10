import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, Shield, Check, Star, Car } from "lucide-react";

export default function FleetPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Our Taxi Fleet Melbourne | Sedans, SUVs, Silver Service & Maxi Cabs | Melbourne Taxis";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", "Explore Melbourne Taxis vehicle fleet: Modern Toyota Camry hybrids, spacious SUVs, luxury Silver Service Lexus sedans, and 11-seater Maxi Cabs with wheelchair access.");
  }, []);

  const fleet = [
    {
      name: "Standard Sedan",
      img: "fleet-sedan.png",
      pax: "1–4 Passengers",
      bags: "2–3 Large Suitcases",
      id: "sedan",
      desc: "Our late-model Toyota Camry Hybrid sedans offer smooth, quiet rides with exceptional fuel economy. Ideal for daily commuting, city point-to-point trips, and airport transfers.",
      features: ["Hybrid eco-efficiency", "Dual-zone climate control", "Phone charging ports", "Contactless EFTPOS & Cabcharge terminal"]
    },
    {
      name: "Premium SUV",
      img: "fleet-suv.png",
      pax: "1–5 Passengers",
      bags: "4–5 Large Suitcases",
      id: "suv",
      desc: "Elevated seating position, generous legroom, and expanded trunk capacity. The perfect choice for small families with luggage, business travellers, and country road comfort.",
      features: ["Spacious elevated cabin", "Huge cargo trunk", "Leather-trimmed seating", "All-weather AWD stability"]
    },
    {
      name: "Silver Service Luxury",
      img: "fleet-silver-service.png",
      pax: "1–4 Passengers",
      bags: "2–3 Suitcases",
      id: "silver_service",
      desc: "Premium executive European and Lexus sedans for corporate accounts, weddings, VIP airport meet-and-greets, and special events. Driven by suited senior drivers.",
      features: ["Premium Lexus / European sedans", "Suited professional chauffeur", "Pristine detailing & privacy tint", "Priority dispatch & meet-and-greet"]
    },
    {
      name: "6 Seater People Mover",
      img: "fleet-six-seater.png",
      pax: "5–6 Passengers",
      bags: "4 Suitcases",
      id: "six_seater",
      desc: "Modern Kia Carnival people movers designed for medium-sized family groups, tour parties, and travelers carrying additional gear.",
      features: ["Captains chairs configuration", "Individual passenger AC vents", "Flexible sliding seat rows", "USB charging in every row"]
    },
    {
      name: "Maxi Taxi (11 Seater)",
      img: "fleet-maxi-taxi.png",
      pax: "Up to 11 Passengers",
      bags: "8–12 Suitcases",
      id: "maxi_taxi",
      desc: "High-capacity Toyota HiAce commuter vans built for large groups, sports teams, race days, concert events, and wheelchair accessible transport.",
      features: ["Seats up to 11 passengers", "Huge luggage bay", "Wheelchair ramp accessibility available", "Split-fare friendly for big groups"]
    }
  ];

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      {/* ── Hero ── */}
      <div className="bg-secondary py-20 border-b border-border">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-primary block mb-3">Safe Transport Victoria Inspected</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 text-white">
            Our Melbourne <span className="text-primary">Taxi Fleet</span>
          </h1>
          <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Clean, modern, and air-conditioned vehicles suited for every journey — from quick city commutes to 11-seat group airport transfers.
          </p>
        </div>
      </div>

      {/* ── Fleet List ── */}
      <div className="container max-w-5xl mx-auto px-4 py-16 space-y-16">
        {fleet.map((vehicle, index) => (
          <div
            key={index}
            className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-12 items-center bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm`}
          >
            {/* Image */}
            <div className="w-full lg:w-1/2 aspect-[16/10] rounded-xl overflow-hidden bg-secondary border border-border relative">
              <img
                src={`/images/${vehicle.img}`}
                alt={vehicle.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-black/80 px-3 py-1 rounded-full text-xs font-bold text-primary border border-primary/30 uppercase tracking-wide">
                {vehicle.pax}
              </div>
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2 space-y-4">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                {vehicle.name}
              </h2>
              
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-md border border-border">
                  <Users className="w-3.5 h-3.5 text-primary" /> {vehicle.pax}
                </span>
                <span className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-md border border-border">
                  <Briefcase className="w-3.5 h-3.5 text-primary" /> {vehicle.bags}
                </span>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {vehicle.desc}
              </p>

              <div className="space-y-2 pt-1">
                {vehicle.features.map((feat, fi) => (
                  <div key={fi} className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex gap-3">
                <Button asChild size="default" className="font-bold uppercase tracking-wider text-xs">
                  <Link href={`/book?vehicle=${vehicle.id}`}>Book This Vehicle</Link>
                </Button>
                <Button asChild size="default" variant="outline" className="font-bold uppercase tracking-wider text-xs">
                  <a href="tel:0435304821">Call Dispatch</a>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
