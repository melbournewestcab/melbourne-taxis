import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plane, Clock, CheckCircle2, Luggage, Shield, MapPin } from "lucide-react";

export default function AirportPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Melbourne Airport Transfers | Tullamarine & Avalon Taxi | Melbourne Taxis";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", "Reliable 24/7 Melbourne Airport taxi transfers to/from Tullamarine (MEL) & Avalon (AVV). Fixed fares, flight tracking, Maxi Cabs. Book online or call 0435 304 821.");
  }, []);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-20 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <Plane className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">
            Melbourne Airport <span className="text-primary">Transfers (MEL &amp; AVV)</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Direct, door-to-door transfers to Melbourne Airport (Tullamarine) and Avalon Airport from all Melbourne suburbs. Guaranteed on-time, 24/7.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <Clock className="w-8 h-8 text-primary" />, label: "Flight Tracking", desc: "We track your inbound flight in real time and automatically adjust pickup times for delays." },
            { icon: <CheckCircle2 className="w-8 h-8 text-primary" />, label: "Fixed Airport Rates", desc: "Transparent upfront fixed fares with zero surge pricing or unexpected extra charges." },
            { icon: <Plane className="w-8 h-8 text-primary" />, label: "All Terminals Covered", desc: "Direct drop-offs and express pickups at T1, T2, T3 & T4 at Tullamarine and Avalon." },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 text-center shadow-sm">
              <div className="flex justify-center mb-3">{item.icon}</div>
              <p className="font-bold uppercase tracking-wide text-sm mb-1 text-white">{item.label}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
          Stress-Free Airport Taxi Service Across Greater Melbourne
        </h2>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          Start and end your journey in comfort with Melbourne Taxis. We specialize in seamless, professional transfers connecting every Melbourne suburb — from Melbourne CBD, Southbank, Docklands, St Kilda, and Brighton, to Box Hill, Doncaster, Preston, Essendon, Werribee, and Melton — straight to your departure terminal.
        </p>

        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          For arriving passengers, our drivers monitor live radar flight feeds. If your flight lands early or is delayed by hours, your driver will be waiting at the designated airport passenger pickup zone when you walk out with your luggage. Simply provide your flight number when reserving your ride.
        </p>

        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          Traveling with family or heavy luggage? Our spacious SUVs, 6-seater people movers, and 11-seat Maxi Taxis offer ample cargo room for oversized suitcases, golf bags, prams, and sports gear.
        </p>

        <h2 className="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-4">
          Melbourne Airport Transfer Distances &amp; Travel Times
        </h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-secondary text-xs uppercase font-bold text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-3.5 px-5">Departure Suburb</th>
                  <th className="py-3.5 px-5">To Melbourne Airport (Tullamarine)</th>
                  <th className="py-3.5 px-5">Approx Drive Time</th>
                  <th className="py-3.5 px-5">Est. Fare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {[
                  ["Melbourne CBD / City", "23 km", "25–35 min", "$65 – $80"],
                  ["Southbank & Docklands", "24 km", "25–35 min", "$65 – $85"],
                  ["St Kilda & South Yarra", "28 km", "30–42 min", "$75 – $95"],
                  ["Essendon & Moonee Ponds", "13 km", "12–18 min", "$40 – $55"],
                  ["Brunswick & Coburg", "15 km", "18–25 min", "$45 – $60"],
                  ["Preston & Reservoir", "18 km", "20–28 min", "$50 – $68"],
                  ["Box Hill & Doncaster", "36 km", "35–45 min", "$90 – $115"],
                  ["Glen Waverley & Chadstone", "42 km", "38–50 min", "$105 – $130"],
                  ["Brighton & Bayside", "36 km", "38–50 min", "$95 – $120"],
                  ["Footscray & Sunshine", "17 km", "18–25 min", "$45 – $60"],
                  ["Werribee & Point Cook", "42 km", "35–45 min", "$100 – $125"],
                  ["Melton & Bacchus Marsh", "48 km", "40–55 min", "$105 – $135"],
                  ["Geelong Waterfront", "85 km", "65–80 min", "$185 – $220"],
                ].map(([from, dist, time, fare], i) => (
                  <tr key={i} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-white">{from}</td>
                    <td className="py-3.5 px-5 text-primary font-bold">{dist}</td>
                    <td className="py-3.5 px-5 text-muted-foreground">{time}</td>
                    <td className="py-3.5 px-5 font-mono text-muted-foreground">{fare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="font-black uppercase tracking-wider text-sm px-8 h-12">
            <Link href="/book?service=airport">Book Airport Taxi Now</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-black uppercase tracking-wider text-sm px-8 h-12 border-primary text-primary hover:bg-primary hover:text-black">
            <a href="tel:0435304821">Call 0435 304 821</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
