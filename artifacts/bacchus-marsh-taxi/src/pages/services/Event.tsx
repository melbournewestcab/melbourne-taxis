import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trophy, Wine, Clock } from "lucide-react";

export default function EventPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Event, Sports & Winery Taxi Melbourne | Melbourne Taxis";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", "Group Maxi Taxi & transfer service for Melbourne events: MCG AFL matches, Marvel Stadium, Australian Open, Flemington races & Yarra Valley winery tours. Call 0435 304 821.");
  }, []);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-20 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <Calendar className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">
            Event, Sports &amp; <span className="text-primary">Winery Tour Transfers</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Reliable group transport and Maxi Cabs for Melbourne's premier sporting events, concerts, weddings, and winery tours.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <Trophy className="w-8 h-8 text-primary" />, label: "MCG & Marvel Stadium", desc: "Beat the train queues and parking nightmare on AFL match days and major concert nights." },
            { icon: <Users className="w-8 h-8 text-primary" />, label: "11-Seater Maxi Taxis", desc: "Keep your whole group together with ample space for bags, banners, and gear." },
            { icon: <Wine className="w-8 h-8 text-primary" />, label: "Yarra Valley & Peninsula", desc: "Private charter day trips to Victoria's world-class wineries, breweries, and distilleries." },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 text-center shadow-sm">
              <div className="flex justify-center mb-3">{item.icon}</div>
              <p className="font-bold uppercase tracking-wide text-sm mb-1 text-white">{item.label}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
          Effortless Group Transport for Melbourne's Major Events
        </h2>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          Melbourne is the sporting and cultural capital of Australia. From blockbuster AFL clashes and cricket test matches at the Melbourne Cricket Ground (MCG), to concerts at Marvel Stadium, Rod Laver Arena, and race days at Flemington and Caulfield, Melbourne Taxis ensures your group arrives together on time and returns home safely.
        </p>

        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          Planning a weekend getaway or wine tour? Book a private full-day or half-day charter to the Yarra Valley, Mornington Peninsula, or Bellarine Peninsula. Enjoy tastings without worrying about designated drivers.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="font-black uppercase tracking-wider text-sm px-8 h-12">
            <Link href="/book?vehicle=maxi_taxi">Book Maxi Taxi for Events</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-black uppercase tracking-wider text-sm px-8 h-12 border-primary text-primary hover:bg-primary hover:text-black">
            <a href="tel:0435304821">Call 0435 304 821</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
