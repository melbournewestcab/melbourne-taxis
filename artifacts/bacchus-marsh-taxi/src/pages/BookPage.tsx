import React, { useEffect } from "react";
import { BookingForm } from "@/components/BookingForm";

export default function BookPage() {
  const initialVehicle = new URLSearchParams(window.location.search).get("vehicle") || "";

  useEffect(() => {
    document.title = "Book Online | Bacchus Marsh Taxi Cab";
  }, []);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="bg-secondary py-16 border-b border-border mb-12">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
            Book <span className="text-primary">Online</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get an instant fare estimate and secure your ride. Fast, transparent, and reliable.
          </p>
        </div>
      </div>
      <div className="container max-w-6xl mx-auto px-4">
        <BookingForm initialVehicle={initialVehicle} />
      </div>
    </div>
  );
}
