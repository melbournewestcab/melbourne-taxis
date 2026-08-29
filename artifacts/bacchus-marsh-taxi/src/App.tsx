import React, { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import HomePage from "@/pages/HomePage";

const NotFound = lazy(() => import("@/pages/not-found"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const FleetPage = lazy(() => import("@/pages/FleetPage"));
const ServiceAreasPage = lazy(() => import("@/pages/ServiceAreasPage"));
const MelbourneSuburbPage = lazy(() => import("@/pages/MelbourneSuburbPage"));
const BookPage = lazy(() => import("@/pages/BookPage"));

const BacchusMarshPage = lazy(() => import("@/pages/areas/BacchusMarshPage"));
const MaddingleyPage = lazy(() => import("@/pages/areas/MaddingleyPage"));
const EyensburyPage = lazy(() => import("@/pages/areas/EyensburyPage"));
const BallanPage = lazy(() => import("@/pages/areas/BallanPage"));
const DarleyPage = lazy(() => import("@/pages/areas/DarleyPage"));
const MeltonPage = lazy(() => import("@/pages/areas/MeltonPage"));
const MeltonSouthPage = lazy(() => import("@/pages/areas/MeltonSouthPage"));
const MeltonWestPage = lazy(() => import("@/pages/areas/MeltonWestPage"));
const RockbankPage = lazy(() => import("@/pages/areas/RockbankPage"));
const KurunjangPage = lazy(() => import("@/pages/areas/KurunjangPage"));
const CoblebankPage = lazy(() => import("@/pages/areas/CobblebanPage"));
const FraserRisePage = lazy(() => import("@/pages/areas/FraserRisePage"));
const ThornhillParkPage = lazy(() => import("@/pages/areas/ThornhillParkPage"));
const PlumptonPage = lazy(() => import("@/pages/areas/PlumptonPage"));
const DiggersRestPage = lazy(() => import("@/pages/areas/DiggersRestPage"));
const DeansidePage = lazy(() => import("@/pages/areas/DeansidePage"));

const AtoBPage = lazy(() => import("@/pages/services/AtoB"));
const AirportPage = lazy(() => import("@/pages/services/Airport"));
const HotelPage = lazy(() => import("@/pages/services/Hotel"));
const ParcelPage = lazy(() => import("@/pages/services/Parcel"));
const EventPage = lazy(() => import("@/pages/services/Event"));
const CorporatePage = lazy(() => import("@/pages/services/Corporate"));
const OwnerDashboard = lazy(() => import("@/pages/OwnerDashboard"));
const LandingPage = lazy(() => import("@/pages/LandingPage"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, gcTime: 300_000 } },
});

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/services" component={ServicesPage} />
        <Route path="/services/a-to-b" component={AtoBPage} />
        <Route path="/services/airport" component={AirportPage} />
        <Route path="/services/hotel" component={HotelPage} />
        <Route path="/services/parcel" component={ParcelPage} />
        <Route path="/services/event" component={EventPage} />
        <Route path="/services/corporate" component={CorporatePage} />
        <Route path="/fleet" component={FleetPage} />
        <Route path="/service-areas" component={ServiceAreasPage} />
        <Route path="/service-areas/bacchus-marsh" component={BacchusMarshPage} />
        <Route path="/service-areas/maddingley" component={MaddingleyPage} />
        <Route path="/service-areas/eyensbury" component={EyensburyPage} />
        <Route path="/service-areas/ballan" component={BallanPage} />
        <Route path="/service-areas/darley" component={DarleyPage} />
        <Route path="/service-areas/melton" component={MeltonPage} />
        <Route path="/service-areas/melton-south" component={MeltonSouthPage} />
        <Route path="/service-areas/melton-west" component={MeltonWestPage} />
        <Route path="/service-areas/rockbank" component={RockbankPage} />
        <Route path="/service-areas/kurunjang" component={KurunjangPage} />
        <Route path="/service-areas/cobblebank" component={CoblebankPage} />
        <Route path="/service-areas/fraser-rise" component={FraserRisePage} />
        <Route path="/service-areas/thornhill-park" component={ThornhillParkPage} />
        <Route path="/service-areas/plumpton" component={PlumptonPage} />
        <Route path="/service-areas/diggers-rest" component={DiggersRestPage} />
        <Route path="/service-areas/deanside" component={DeansidePage} />
        <Route path="/service-areas/:slug" component={MelbourneSuburbPage} />
        <Route path="/book" component={BookPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function VisitorTracker() {
  const [location] = useLocation();
  useEffect(() => {
    fetch("/api/visitors/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {});
  }, [location]);
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={(import.meta.env.BASE_URL || "").replace(/\/$/, "")}>
          <ScrollToTop />
          <VisitorTracker />
          <Suspense fallback={null}>
            <Switch>
              {/* Hidden owner-only dashboard — not linked anywhere on the site */}
              <Route path="/bmt-owner-panel" component={OwnerDashboard} />
              {/* High-conversion Google Ads landing page — standalone, no nav/footer */}
              {/* /ads is the clean URL used in Google Ads final URLs */}
              <Route path="/ads" component={LandingPage} />
              <Route path="/landing" component={LandingPage} />
              {/* All public routes wrapped in site chrome */}
              <Route>
                <div className="min-h-[100dvh] flex flex-col bg-background text-foreground pt-[68px]">
                  <Navbar />
                  <main className="flex-1">
                    <Router />
                  </main>
                  <Footer />
                  <FloatingContact />
                </div>
              </Route>
            </Switch>
          </Suspense>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
