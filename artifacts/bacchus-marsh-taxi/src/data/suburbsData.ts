export interface SuburbRoute {
  to: string;
  dist: string;
  time: string;
  approxFare: string;
}

export interface SuburbFaq {
  q: string;
  a: string;
}

export interface SuburbInfo {
  id: string; // url slug
  name: string;
  region: "Melbourne CBD & Inner" | "Northern Suburbs" | "Eastern Suburbs" | "South Eastern & Bayside" | "Western Suburbs & Regional";
  postcode: string;
  metaTitle: string;
  metaDesc: string;
  tagline: string;
  heroSummary: string[];
  keyHighlights: string[];
  popularRoutes: SuburbRoute[];
  faqs: SuburbFaq[];
  keywords: string[];
}

export const MELBOURNE_REGIONS = [
  "Melbourne CBD & Inner",
  "Northern Suburbs",
  "Eastern Suburbs",
  "South Eastern & Bayside",
  "Western Suburbs & Regional"
] as const;

export const SUBURBS_DATA: SuburbInfo[] = [
  // ═══════════════════════════════════════════════════════════════
  // ── 1. Melbourne CBD & Inner Suburbs ──
  // ═══════════════════════════════════════════════════════════════
  {
    id: "melbourne-cbd",
    name: "Melbourne CBD",
    region: "Melbourne CBD & Inner",
    postcode: "VIC 3000",
    metaTitle: "Taxi in Melbourne CBD | 24/7 City Cabs & Airport Transfers | Melbourne Taxis",
    metaDesc: "Book a taxi in Melbourne CBD VIC 3000. 24/7 fast dispatch across Flinders St, Collins St, Southern Cross Station & Melbourne Airport transfers. Call 0435 304 821.",
    tagline: "Instant dispatch across Melbourne's city centre, corporate precincts, and transit hubs.",
    heroSummary: [
      "Melbourne CBD is Victoria's commercial, cultural, and entertainment heartbeat. Whether you need an early morning corporate transfer from Collins Street, a rapid connection from Southern Cross or Flinders Street Station, or a late-night ride home from Melbourne's bustling dining and theater precincts, Melbourne Taxis provides swift, guaranteed door-to-door cab service 24 hours a day.",
      "Our drivers know every city laneway, hotel drop-off zone, and traffic artery like the back of their hand. From luxury Silver Service sedans for executive meetings to spacious Maxi Taxis for group transfers to Melbourne Airport (Tullamarine) or Avalon, we ensure you travel smoothly without delays or surge pricing.",
      "We service all major city landmarks including Federation Square, Crown Melbourne, Marvel Stadium, Regent Theatre, Melbourne Convention and Exhibition Centre (MCEC), and all central business headquarters."
    ],
    keyHighlights: [
      "Southern Cross & Flinders Street Railway Stations",
      "Melbourne Convention and Exhibition Centre (MCEC)",
      "Collins St & Bourke St Financial Hubs",
      "Marvel Stadium & Festival Hall",
      "Crown Entertainment Complex & Southbank",
      "Regent, Princess & Her Majesty's Theatres"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "23 km", time: "25–35 min", approxFare: "$65 – $80" },
      { to: "Avalon Airport", dist: "56 km", time: "45–55 min", approxFare: "$130 – $155" },
      { to: "St Kilda Beach", dist: "7 km", time: "15–20 min", approxFare: "$25 – $35" },
      { to: "Chadstone Shopping Centre", dist: "16 km", time: "20–30 min", approxFare: "$45 – $60" },
      { to: "Box Hill Central", dist: "18 km", time: "25–35 min", approxFare: "$50 – $65" },
      { to: "Werribee Town Centre", dist: "32 km", time: "30–40 min", approxFare: "$75 – $95" }
    ],
    faqs: [
      { q: "How fast can a taxi arrive in Melbourne CBD?", a: "With cabs stationed around the city grid, average pickup times in Melbourne CBD are under 5 to 10 minutes." },
      { q: "Do you offer fixed price airport transfers from Melbourne CBD?", a: "Yes, we provide transparent fixed rate airport transfers to both Melbourne Tullamarine (MEL) and Avalon (AVV) with zero surge pricing." },
      { q: "Can I book a Maxi Taxi for group transport in the city?", a: "Yes, our 6-seater and 11-seater Maxi Taxis are available 24/7 for event transfers, night outings, and corporate team movements." }
    ],
    keywords: ["taxi in Melbourne CBD", "Melbourne CBD taxi", "taxi to Melbourne airport from city", "cabs in Melbourne CBD", "maxi taxi Melbourne CBD", "silver service taxi Melbourne city", "book taxi in Melbourne CBD", "cheap taxi Melbourne CBD"]
  },
  {
    id: "southbank",
    name: "Southbank",
    region: "Melbourne CBD & Inner",
    postcode: "VIC 3006",
    metaTitle: "Taxi in Southbank | Crown Casino & MCEC Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Southbank VIC 3006. 24/7 pickups at Crown Melbourne, MCEC, Eureka Tower & Southbank Promenade. Airport transfers & Maxi Cabs. Call 0435 304 821.",
    tagline: "Prompt taxi service for Crown Melbourne, Southbank promenade, and luxury high-rise towers.",
    heroSummary: [
      "Southbank is Melbourne's premier riverside dining, hotel, and arts destination, home to Crown Melbourne, the National Gallery of Victoria (NGV), and the Melbourne Arts Centre. Melbourne Taxis provides round-the-clock taxi and chauffeur services tailored for hotel guests, conference attendees, and nightlife lovers.",
      "Whether you're departing the Crown Towers lobby, catching a flight from your Southbank apartment tower, or attending a summit at the Melbourne Convention and Exhibition Centre (MCEC), our drivers guarantee punctual pickup and seamless luggage handling.",
      "Choose from our executive Silver Service fleet for high-end luxury transport, or book our Maxi Taxis for dining groups and family holiday transfers directly to Tullamarine Airport."
    ],
    keyHighlights: [
      "Crown Melbourne & Crown Towers",
      "Melbourne Convention and Exhibition Centre (MCEC)",
      "Eureka Tower & Melbourne Skydeck",
      "Arts Centre Melbourne & NGV International",
      "Southbank Promenade Waterfront Dining"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "24 km", time: "25–35 min", approxFare: "$65 – $85" },
      { to: "Avalon Airport", dist: "54 km", time: "45–55 min", approxFare: "$125 – $150" },
      { to: "Melbourne Cricket Ground (MCG)", dist: "4 km", time: "10–15 min", approxFare: "$25 – $30" },
      { to: "St Kilda Beach & Acland St", dist: "6 km", time: "12–18 min", approxFare: "$25 – $35" }
    ],
    faqs: [
      { q: "Can I get a taxi from Crown Casino lobby at 3 AM?", a: "Yes, our drivers operate 24/7 with immediate dispatch to Crown Towers, Crown Metropol, and Crown Promenade lobbies." },
      { q: "How much is a cab from Southbank to Melbourne Airport?", a: "Fares typically range from $65 to $85 depending on traffic, tolls, and vehicle type, with upfront fixed pricing available." }
    ],
    keywords: ["taxi in Southbank", "Southbank taxi", "Crown Casino cab", "taxi Southbank to Melbourne airport", "MCEC taxi service", "maxi cab Southbank", "cabs in Southbank", "book taxi Southbank"]
  },
  {
    id: "docklands",
    name: "Docklands",
    region: "Melbourne CBD & Inner",
    postcode: "VIC 3008",
    metaTitle: "Taxi in Docklands | Marvel Stadium & Waterfront Cabs | Melbourne Taxis",
    metaDesc: "Need a taxi in Docklands VIC 3008? 24/7 fast dispatch for Marvel Stadium, Waterfront City, Victoria Harbour & Melbourne Airport. Call 0435 304 821.",
    tagline: "Dedicated waterfront transport for Marvel Stadium crowds, business headquarters, and harbor living.",
    heroSummary: [
      "Docklands seamlessly blends modern residential high-rises, major corporate headquarters (ANZ, NAB, Medibank), and high-energy entertainment at Marvel Stadium and The District Docklands. Melbourne Taxis ensures rapid transport whenever you need it.",
      "Heading to a concert or AFL match at Marvel Stadium? Avoid public transport queues with our pre-booked event drop-offs and express pickups. We also specialize in stress-free Melbourne Airport transfers with flight monitoring for corporate executives and local residents.",
      "Our full vehicle fleet — standard sedans, spacious SUVs, and 11-seat Maxi Taxis — is stationed near Bolte Bridge and CityLink for the quickest possible transit across Melbourne."
    ],
    keyHighlights: [
      "Marvel Stadium (Etihad Stadium)",
      "The District Docklands Shopping & Dining",
      "Victoria Harbour & NewQuay Promenades",
      "ANZ & NAB Corporate Precincts",
      "Melbourne Star Observation Wheel District"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "21 km", time: "20–30 min", approxFare: "$60 – $75" },
      { to: "Flinders Street Station", dist: "3 km", time: "10–12 min", approxFare: "$25 – $30" },
      { to: "Flemington Racecourse", dist: "6 km", time: "12–18 min", approxFare: "$25 – $35" }
    ],
    faqs: [
      { q: "Where can I get picked up near Marvel Stadium?", a: "We arrange pickups at convenient designated spots along Harbour Esplanade, La Trobe St, or Bourke St to bypass post-match congestion." },
      { q: "Can I pre-book an early morning airport ride from Docklands?", a: "Yes, pre-booking online guarantees a clean vehicle and driver at your lobby on time." }
    ],
    keywords: ["taxi in Docklands", "Docklands taxi", "Marvel Stadium taxi", "Victoria Harbour cab", "Docklands to Tullamarine airport taxi", "maxi taxi Docklands", "cabs in Docklands"]
  },
  {
    id: "east-melbourne",
    name: "East Melbourne",
    region: "Melbourne CBD & Inner",
    postcode: "VIC 3002",
    metaTitle: "Taxi in East Melbourne | MCG & Hospital Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in East Melbourne VIC 3002. 24/7 service for MCG, Fitzroy Gardens, Epworth Freemasons Hospital & Melbourne Airport. Call 0435 304 821.",
    tagline: "MCG sporting gateway and premier medical specialist precinct transport.",
    heroSummary: [
      "East Melbourne is one of Melbourne's most prestigious inner enclaves, nestled between the MCG, Melbourne Park tennis center, Fitzroy Gardens, Parliament House, and Epworth Freemasons Hospital.",
      "Melbourne Taxis provides reliable transport for sports lovers heading to AFL games and the Australian Open, as well as patient and specialist doctor transfers to East Melbourne's world-class medical suites."
    ],
    keyHighlights: [
      "Melbourne Cricket Ground (MCG)",
      "Melbourne Park & Rod Laver Arena",
      "Epworth Freemasons Hospital & Eye and Ear Hospital",
      "Fitzroy Gardens & Cook's Cottage",
      "Parliament House & Treasury Gardens"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "25 km", time: "25–35 min", approxFare: "$68 – $85" },
      { to: "Melbourne CBD", dist: "2 km", time: "5–10 min", approxFare: "$25 – $30" },
      { to: "St Kilda Beach", dist: "6 km", time: "12–18 min", approxFare: "$25 – $35" }
    ],
    faqs: [
      { q: "How do I get picked up after an MCG game in East Melbourne?", a: "We arrange convenient pickup spots on Wellington Parade or Clarendon Street for smooth post-match departures." }
    ],
    keywords: ["taxi in East Melbourne", "East Melbourne taxi", "MCG taxi", "Freemasons hospital cab", "Wellington Parade taxi", "East Melbourne to airport taxi", "cabs in East Melbourne"]
  },
  {
    id: "carlton",
    name: "Carlton & Parkville",
    region: "Melbourne CBD & Inner",
    postcode: "VIC 3053",
    metaTitle: "Taxi in Carlton & Parkville | Lygon St & Uni Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Carlton & Parkville VIC 3053. 24/7 rides on Lygon St, Uni of Melbourne, Royal Melbourne Hospital & Melbourne Airport. Call 0435 304 821.",
    tagline: "Premier Italian dining district, university campus, and hospital precinct cab service.",
    heroSummary: [
      "Carlton is famous for the bustling Italian cafés and restaurants of Lygon Street, the historic Royal Exhibition Building in Carlton Gardens, and its close proximity to the University of Melbourne and Parkville Medical Precinct (Royal Melbourne Hospital, Royal Children's Hospital, Peter MacCallum Cancer Centre).",
      "Melbourne Taxis provides prompt, sensitive, and dependable transport for hospital patients, university faculty and students, and evening diners enjoying Carlton's famous culinary strip.",
      "With direct access to the Tullamarine Freeway via Flemington Road, Carlton is one of the fastest inner-city suburbs for Melbourne Airport transfers."
    ],
    keyHighlights: [
      "Lygon Street Dining Precinct",
      "University of Melbourne Main Campus",
      "Royal Melbourne Hospital & Royal Children's Hospital",
      "Royal Exhibition Building & Carlton Gardens",
      "Peter MacCallum Cancer Centre"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "19 km", time: "20–25 min", approxFare: "$55 – $70" },
      { to: "Melbourne CBD / Flinders St", dist: "3 km", time: "8–12 min", approxFare: "$25 – $30" },
      { to: "Richmond Swan St", dist: "6 km", time: "15–20 min", approxFare: "$25 – $35" }
    ],
    faqs: [
      { q: "Do you provide hospital patient and medical transfer taxis in Parkville?", a: "Yes, our drivers are courteous and patient, offering door-to-door assistance for hospital appointments and discharges." },
      { q: "How long does a taxi take from Carlton to Melbourne Airport?", a: "Typically just 20 to 25 minutes via the Tullamarine Freeway (M2)." }
    ],
    keywords: ["taxi in Carlton", "Carlton taxi", "taxi in Parkville", "Lygon street cab", "Parkville hospital taxi", "Melbourne uni taxi", "Carlton to airport taxi", "cabs in Carlton"]
  },
  {
    id: "south-yarra",
    name: "South Yarra & Prahran",
    region: "Melbourne CBD & Inner",
    postcode: "VIC 3141",
    metaTitle: "Taxi in South Yarra & Prahran | Chapel St & Toorak Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in South Yarra & Prahran VIC 3141. 24/7 service on Chapel Street, Toorak Road, Prahran Market & Melbourne Airport transfers. Call 0435 304 821.",
    tagline: "Fashion, dining, and luxury residential transfers across Chapel St and Toorak Road.",
    heroSummary: [
      "South Yarra and Prahran represent Melbourne's trendiest boutique shopping, gourmet dining, and lively nightlife districts. Centered around Chapel Street, Toorak Road, Prahran Market, and the Royal Botanic Gardens, demand for reliable, stylish cab service is constant.",
      "Melbourne Taxis caters to South Yarra's discerning residents and visitors with pristine Silver Service executive cars, dependable everyday sedans, and high-capacity Maxi Taxis for weekend group outings.",
      "Skip parking hassles and enjoy smooth, direct airport transfers via CityLink directly to Tullamarine or Avalon."
    ],
    keyHighlights: [
      "Chapel Street Shopping & Nightlife",
      "Toorak Road Boutiques & High-End Dining",
      "South Yarra Railway Station",
      "Prahran Market & Greville Street",
      "Fawkner Park & Royal Botanic Gardens"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "28 km", time: "30–40 min", approxFare: "$75 – $95" },
      { to: "Melbourne CBD", dist: "5 km", time: "12–18 min", approxFare: "$25 – $35" },
      { to: "St Kilda Beach", dist: "4 km", time: "10–12 min", approxFare: "$25 – $30" },
      { to: "Chadstone Shopping Centre", dist: "11 km", time: "15–20 min", approxFare: "$35 – $45" }
    ],
    faqs: [
      { q: "Can I get a Silver Service taxi in South Yarra?", a: "Yes, our luxury Lexus and premium European fleet is available for executive bookings and VIP arrivals." },
      { q: "Are cabs available late night on Chapel Street?", a: "Yes, we have active vehicles operating around Chapel Street and Commercial Road all through Friday and Saturday nights." }
    ],
    keywords: ["taxi in South Yarra", "South Yarra taxi", "taxi in Prahran", "Chapel Street taxi", "Prahran cab", "South Yarra to Melbourne airport", "silver service South Yarra", "cabs in South Yarra"]
  },
  {
    id: "richmond",
    name: "Richmond & Cremorne",
    region: "Melbourne CBD & Inner",
    postcode: "VIC 3121",
    metaTitle: "Taxi in Richmond & Cremorne | MCG & Swan St Cabs | Melbourne Taxis",
    metaDesc: "Need a taxi in Richmond VIC 3121? 24/7 transfers for MCG footy, Bridge Rd, Swan St, Epworth Hospital & Melbourne Airport. Call 0435 304 821.",
    tagline: "The fastest cabs for MCG events, live music venues, and medical precinct transfers.",
    heroSummary: [
      "Richmond is an iconic inner-city suburb packed with character, world-class sporting heritage (MCG, Olympic Park), Vietnamese cuisine on Victoria Street, and bustling pub culture on Swan Street and Bridge Road.",
      "Melbourne Taxis provides high-availability transport on match days, ensuring you arrive at the Melbourne Cricket Ground (MCG) or Melbourne Park without the gridlock. We also provide dedicated patient and visitor transfers to the Epworth Richmond Hospital campus.",
      "For business travelers and residents, our direct airport transfer service takes you straight to Tullamarine via the Eastern Freeway and CityLink with zero delays."
    ],
    keyHighlights: [
      "Melbourne Cricket Ground (MCG)",
      "Swan Street & Bridge Road Pubs & Cafés",
      "Victoria Street Vietnamese Food Precinct",
      "Epworth Hospital Richmond",
      "Richmond Railway Station Junction"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "26 km", time: "28–38 min", approxFare: "$70 – $90" },
      { to: "Melbourne CBD", dist: "4 km", time: "10–15 min", approxFare: "$25 – $30" },
      { to: "Box Hill", dist: "14 km", time: "20–25 min", approxFare: "$40 – $55" }
    ],
    faqs: [
      { q: "How do I get a taxi after a footy game at the MCG?", a: "You can pre-book with Melbourne Taxis to meet your driver at designated pickup locations near Punt Road or Wellington Parade." },
      { q: "Do you service Epworth Hospital patients?", a: "Yes, we provide comfortable, punctual rides for patient admissions, check-ups, and discharges." }
    ],
    keywords: ["taxi in Richmond", "Richmond taxi", "taxi in Cremorne", "MCG taxi", "Swan Street cab", "Epworth hospital Richmond taxi", "Richmond to airport taxi", "cabs in Richmond"]
  },
  {
    id: "st-kilda",
    name: "St Kilda & Elwood",
    region: "Melbourne CBD & Inner",
    postcode: "VIC 3182",
    metaTitle: "Taxi in St Kilda & Elwood | Beach & Acland St Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in St Kilda & Elwood VIC 3182. 24/7 service for St Kilda Beach, Luna Park, Acland St, Fitzroy St & Melbourne Airport. Call 0435 304 821.",
    tagline: "Iconic bayside transport for beachgoers, music festivals, and international travelers.",
    heroSummary: [
      "St Kilda is Melbourne's famed coastal playground, celebrated for St Kilda Beach, Luna Park, the St Kilda Pier penguins, live music at the Palais Theatre and Prince Bandroom, and European bakeries on Acland Street.",
      "Melbourne Taxis offers reliable 24/7 service for tourists, beach visitors, concertgoers, and local residents. Need an early morning ride to Melbourne Airport with surfboards or heavy luggage? Our spacious SUVs and Maxi Cabs are ready on demand.",
      "Enjoy transparent metered rates or pre-arranged fixed fares with no surprise surcharges."
    ],
    keyHighlights: [
      "St Kilda Beach & Esplanade Boardwalk",
      "Luna Park Melbourne & Palais Theatre",
      "Acland Street & Fitzroy Street Dining",
      "St Kilda Sea Baths & Catani Gardens",
      "Albert Park Lake & Grand Prix Circuit"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "29 km", time: "30–42 min", approxFare: "$75 – $95" },
      { to: "Melbourne CBD", dist: "7 km", time: "15–20 min", approxFare: "$25 – $35" },
      { to: "Brighton Bathing Boxes", dist: "7 km", time: "12–15 min", approxFare: "$25 – $35" }
    ],
    faqs: [
      { q: "Are taxis easy to catch from Palais Theatre after concerts?", a: "Yes, we regularly service Palais Theatre and Prince of Wales events. We recommend pre-booking for immediate post-show pickup." },
      { q: "Can I bring luggage and beach gear in the taxi?", a: "Yes, our SUVs and station wagons easily accommodate suitcases, prams, and sports equipment." }
    ],
    keywords: ["taxi in St Kilda", "St Kilda taxi", "taxi in Elwood", "Acland Street cab", "Luna Park taxi", "St Kilda to Melbourne airport cab", "maxi taxi St Kilda", "cabs in St Kilda"]
  },
  {
    id: "fitzroy-collingwood",
    name: "Fitzroy & Collingwood",
    region: "Melbourne CBD & Inner",
    postcode: "VIC 3065",
    metaTitle: "Taxi in Fitzroy & Collingwood | Brunswick & Smith St Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Fitzroy & Collingwood VIC 3065. 24/7 cabs on Brunswick St, Smith St, Gertrude St & Tullamarine Airport transfers. Call 0435 304 821.",
    tagline: "Eclectic bar, café, and art district cab service available around the clock.",
    heroSummary: [
      "Fitzroy and Collingwood form the bohemian heart of Melbourne's inner north, boasting world-class coffee on Gertrude Street, live music venues, art galleries, and vibrant dining along Brunswick Street and Smith Street.",
      "Melbourne Taxis provides reliable transport for locals and visitors heading out for evening drinks, weekend brunches, or early flights out of Tullamarine.",
      "Our prompt dispatch gets you to your destination safely, offering a welcome alternative to crowded night trams and unpredictable rideshare wait times."
    ],
    keyHighlights: [
      "Brunswick Street & Smith Street Hubs",
      "Gertrude Street Boutique Dining",
      "Edinburgh Gardens",
      "St Vincent's Hospital Melbourne",
      "Centre for Contemporary Photography"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "22 km", time: "22–30 min", approxFare: "$60 – $75" },
      { to: "Melbourne CBD", dist: "3 km", time: "8–12 min", approxFare: "$25 – $30" },
      { to: "Brunswick Sydney Road", dist: "4 km", time: "10–14 min", approxFare: "$25 – $30" }
    ],
    faqs: [
      { q: "How quickly can a taxi arrive on Smith Street or Brunswick Street?", a: "Usually within 5 to 10 minutes throughout the day and night." }
    ],
    keywords: ["taxi in Fitzroy", "Fitzroy taxi", "taxi in Collingwood", "Collingwood cab", "Brunswick Street taxi", "Smith Street taxi", "Fitzroy to airport cab", "cabs in Fitzroy"]
  },
  {
    id: "port-melbourne",
    name: "Port Melbourne & South Melbourne",
    region: "Melbourne CBD & Inner",
    postcode: "VIC 3207",
    metaTitle: "Taxi in Port Melbourne & South Melbourne | Station Pier Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Port Melbourne VIC 3207. 24/7 service for Station Pier Cruise Terminal, South Melbourne Market, Bay St & Airport. Call 0435 304 821.",
    tagline: "Cruise terminal pickups, South Melbourne Market runs, and coastal boulevard cabs.",
    heroSummary: [
      "Port Melbourne and South Melbourne connect Melbourne's historic shipping port and cruise terminal at Station Pier with the celebrated culinary haven of South Melbourne Market and Clarendon Street retail.",
      "Melbourne Taxis provides specialized luggage-friendly transport for cruise ship passengers arriving at Station Pier (Spirit of Tasmania and international cruise liners), corporate transfers, and express trips to Tullamarine Airport via the West Gate Freeway and CityLink."
    ],
    keyHighlights: [
      "Station Pier Cruise Ship Terminal",
      "South Melbourne Market & Clarendon Street",
      "Bay Street Port Melbourne Dining Strip",
      "Princess Pier Historic Waterfront",
      "West Gate Freeway Access"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "25 km", time: "24–32 min", approxFare: "$65 – $85" },
      { to: "Melbourne CBD", dist: "4 km", time: "8–12 min", approxFare: "$25 – $30" },
      { to: "St Kilda Beach", dist: "5 km", time: "10–14 min", approxFare: "$25 – $32" }
    ],
    faqs: [
      { q: "Can I book a Maxi Taxi for cruise transfers at Station Pier?", a: "Yes, we provide high-capacity Maxi Cabs with ample space for large suitcases and cruise luggage right at Station Pier." }
    ],
    keywords: ["taxi in Port Melbourne", "Port Melbourne taxi", "taxi in South Melbourne", "Station Pier cab", "South Melbourne market taxi", "Port Melbourne to airport taxi", "cruise ship transfer Melbourne taxi", "cabs in Port Melbourne"]
  },
  {
    id: "albert-park",
    name: "Albert Park & Middle Park",
    region: "Melbourne CBD & Inner",
    postcode: "VIC 3206",
    metaTitle: "Taxi in Albert Park & Middle Park | Grand Prix & MSAC Cabs | Melbourne Taxis",
    metaDesc: "Need a taxi in Albert Park VIC 3206? 24/7 cabs for Australian Grand Prix, MSAC, Bridport St & Melbourne Airport transfers. Call 0435 304 821.",
    tagline: "Grand Prix circuit, Melbourne Sports Centres (MSAC), and tranquil Victorian village cabs.",
    heroSummary: [
      "Albert Park and Middle Park are renowned for the picturesque Albert Park Lake, Melbourne Sports Centres (MSAC), the annual Australian Formula 1 Grand Prix, and charming tree-lined streets with boutique dining along Bridport Street and Armstrong Street.",
      "Melbourne Taxis provides executive Silver Service travel, event transfers during the Grand Prix, and direct airport journeys."
    ],
    keyHighlights: [
      "Albert Park Lake & Grand Prix Circuit",
      "Melbourne Sports Centres (MSAC)",
      "Bridport Street Village Dining",
      "Middle Park Beach Waterfront",
      "Lakeside Stadium & Athletics Track"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "27 km", time: "28–38 min", approxFare: "$70 – $90" },
      { to: "Melbourne CBD", dist: "5 km", time: "12–16 min", approxFare: "$25 – $32" },
      { to: "St Kilda Esplanade", dist: "3 km", time: "6–10 min", approxFare: "$25 – $28" }
    ],
    faqs: [
      { q: "Do you provide transfers during the Australian Grand Prix?", a: "Yes, we provide scheduled drop-offs and pre-booked departures around Albert Park during race weekend." }
    ],
    keywords: ["taxi in Albert Park", "Albert Park taxi", "taxi in Middle Park", "Grand Prix taxi Melbourne", "MSAC taxi", "Middle Park cab", "Albert Park to airport taxi", "cabs in Albert Park"]
  },
  {
    id: "kensington-flemington",
    name: "Kensington & Flemington",
    region: "Melbourne CBD & Inner",
    postcode: "VIC 3031",
    metaTitle: "Taxi in Kensington & Flemington | Melbourne Cup Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Kensington & Flemington VIC 3031. 24/7 service for Flemington Racecourse (Melbourne Cup), Bellair St & Airport. Call 0435 304 821.",
    tagline: "Flemington Racecourse racing carnival, Melbourne Showgrounds, and village transport.",
    heroSummary: [
      "Kensington and Flemington boast rich heritage, the world-famous Flemington Racecourse (home of the Melbourne Cup), Melbourne Showgrounds, and vibrant café culture along Bellair Street and Macaulay Road.",
      "Melbourne Taxis offers high-availability fleet dispatch during spring racing carnivals, agricultural shows, and effortless 15-minute hops to Melbourne Airport via CityLink."
    ],
    keyHighlights: [
      "Flemington Racecourse (Melbourne Cup Carnival)",
      "Melbourne Showgrounds & Events Centre",
      "Bellair Street & Macaulay Road Village",
      "Kensington & Newmarket Railway Stations",
      "Maribyrnong River Parkland"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "16 km", time: "15–20 min", approxFare: "$45 – $60" },
      { to: "Melbourne CBD", dist: "5 km", time: "10–15 min", approxFare: "$25 – $30" },
      { to: "Docklands", dist: "4 km", time: "8–12 min", approxFare: "$25 – $30" }
    ],
    faqs: [
      { q: "Can I book a Maxi Taxi for Melbourne Cup Day at Flemington?", a: "Yes, pre-booking your Maxi Taxi for the Spring Racing Carnival guarantees dedicated transport to and from the racecourse." }
    ],
    keywords: ["taxi in Kensington", "taxi in Flemington", "Flemington taxi", "Kensington cab", "Melbourne Cup taxi", "Flemington racecourse cab", "Kensington to airport taxi", "cabs in Flemington"]
  },

  // ═══════════════════════════════════════════════════════════════
  // ── 2. Northern Suburbs ──
  // ═══════════════════════════════════════════════════════════════
  {
    id: "tullamarine",
    name: "Tullamarine (Melbourne Airport)",
    region: "Northern Suburbs",
    postcode: "VIC 3043",
    metaTitle: "Taxi in Tullamarine | Melbourne Airport Terminal Transfers | Melbourne Taxis",
    metaDesc: "Book a taxi in Tullamarine & Melbourne Airport VIC 3043. 24/7 terminal pickups (T1-T4) to CBD, all suburbs & regional Victoria. Call 0435 304 821.",
    tagline: "Immediate airport terminal pickups, flight tracking, and business park connections.",
    heroSummary: [
      "Tullamarine is the primary gateway to Victoria, housing Melbourne Airport (MEL) across Terminals 1, 2, 3, and 4, as well as major logistics, aviation, and corporate business parks.",
      "Melbourne Taxis is Victoria's trusted airport transfer specialist. We track incoming flights in real time, greet passengers right outside their arrival terminal, and deliver seamless connections to every Melbourne suburb, regional town, and coastal destination.",
      "Whether you're an international executive requiring Silver Service luxury, a family with excess baggage needing a 7-seater SUV, or a tour group booking an 11-seat Maxi Taxi, we guarantee prompt, professional service."
    ],
    keyHighlights: [
      "Melbourne Airport (T1, T2, T3 & T4 Terminals)",
      "URBNSURF Melbourne Wave Park",
      "Tullamarine Logistics & Freight Hubs",
      "Essendon Fields Business Precinct",
      "M2 Tullamarine Freeway & Western Ring Road Junction"
    ],
    popularRoutes: [
      { to: "Melbourne CBD", dist: "23 km", time: "25–35 min", approxFare: "$65 – $80" },
      { to: "St Kilda Beach", dist: "29 km", time: "30–40 min", approxFare: "$75 – $95" },
      { to: "Box Hill Central", dist: "38 km", time: "35–45 min", approxFare: "$95 – $120" },
      { to: "Dandenong", dist: "55 km", time: "45–60 min", approxFare: "$135 – $165" },
      { to: "Geelong Waterfront", dist: "85 km", time: "65–80 min", approxFare: "$185 – $220" },
      { to: "Bacchus Marsh", dist: "55 km", time: "45–55 min", approxFare: "$120 – $145" }
    ],
    faqs: [
      { q: "Where does the taxi meet me at Melbourne Airport?", a: "We pick up directly from official terminal pickup zones, or arrange dedicated meet-and-greet in the arrivals hall." },
      { q: "What happens if my flight is delayed?", a: "We track your flight number in real time. Your driver adjusts arrival time automatically at no extra fee." }
    ],
    keywords: ["taxi in Tullamarine", "Tullamarine taxi", "Melbourne airport cab", "taxi from Melbourne airport to city", "maxi taxi Tullamarine", "airport transfer Melbourne", "cabs in Tullamarine", "book taxi Tullamarine"]
  },
  {
    id: "essendon",
    name: "Essendon & Moonee Ponds",
    region: "Northern Suburbs",
    postcode: "VIC 3040",
    metaTitle: "Taxi in Essendon & Moonee Ponds | Airport Corridor Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Essendon & Moonee Ponds VIC 3040. 24/7 rides for Puckle St, Moonee Valley Racecourse, Essendon Fields & Airport. Call 0435 304 821.",
    tagline: "Rapid northern transit connecting Moonee Valley racing, dining, and airport corridors.",
    heroSummary: [
      "Essendon and Moonee Ponds are premier inner-north suburbs famed for tree-lined streets, historic estates, Moonee Valley Racecourse, Essendon Fields Airport, and bustling shopping strips on Puckle Street and Keilor Road.",
      "Melbourne Taxis provides rapid response for local commutes, school runs, dining outings, and super-fast airport transfers directly up the Tullamarine Freeway.",
      "Book with confidence for early morning departures to Tullamarine Airport — located just 10-15 minutes away."
    ],
    keyHighlights: [
      "Moonee Valley Racecourse (Cox Plate)",
      "Puckle Street & Keilor Road Retail",
      "Essendon Fields & DFO Essendon",
      "Essendon Railway Station",
      "Queens Park & Maribyrnong River Trail"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "13 km", time: "12–18 min", approxFare: "$40 – $55" },
      { to: "Melbourne CBD", dist: "10 km", time: "15–22 min", approxFare: "$30 – $40" },
      { to: "Flemington Racecourse", dist: "4 km", time: "8–12 min", approxFare: "$25 – $30" }
    ],
    faqs: [
      { q: "How fast is a taxi from Essendon to Melbourne Airport?", a: "Essendon sits directly on the airport corridor; trips generally take only 12 to 18 minutes." }
    ],
    keywords: ["taxi in Essendon", "Essendon taxi", "taxi in Moonee Ponds", "Moonee Ponds cab", "Moonee Valley racecourse taxi", "Essendon to airport taxi", "Essendon Fields cab", "cabs in Essendon"]
  },
  {
    id: "brunswick",
    name: "Brunswick & Coburg",
    region: "Northern Suburbs",
    postcode: "VIC 3056",
    metaTitle: "Taxi in Brunswick & Coburg | Sydney Rd Cabs | Melbourne Taxis",
    metaDesc: "Need a taxi in Brunswick & Coburg VIC 3056? 24/7 service on Sydney Rd, Lygon St North, Pentridge Coburg & Melbourne Airport runs. Call 0435 304 821.",
    tagline: "Sydney Road's favorite cab service for live music, shopping, and effortless airport travel.",
    heroSummary: [
      "Brunswick and Coburg are vibrant northern hubs characterized by the eclectic retail and multicultural dining of Sydney Road, the transformed Pentridge precinct in Coburg, and a flourishing arts and live music scene.",
      "Melbourne Taxis delivers 24/7 cab service across Sydney Road, Lygon Street, Bell Street, and Moreland Road. Our drivers ensure quick, comfortable rides whether you're traveling locally or catching an international flight."
    ],
    keyHighlights: [
      "Sydney Road Shopping & Dining Strip",
      "Pentridge Coburg Cinema & Retail Precinct",
      "Brunswick Baths & Anstey Station",
      "Coburg Drive-In Cinema",
      "Barkly Square Shopping Centre"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "15 km", time: "18–25 min", approxFare: "$45 – $60" },
      { to: "Melbourne CBD", dist: "6 km", time: "15–20 min", approxFare: "$25 – $35" },
      { to: "Preston Market", dist: "5 km", time: "10–15 min", approxFare: "$25 – $30" }
    ],
    faqs: [
      { q: "Can I book a Maxi Taxi for a night out in Brunswick?", a: "Yes, our 6-seater and 11-seater Maxi Cabs are available for groups touring Sydney Road bars and venues." }
    ],
    keywords: ["taxi in Brunswick", "Brunswick taxi", "taxi in Coburg", "Coburg cab", "Sydney Road taxi", "Brunswick to Melbourne airport", "Coburg taxi service", "cabs in Brunswick"]
  },
  {
    id: "preston-reservoir",
    name: "Preston & Reservoir",
    region: "Northern Suburbs",
    postcode: "VIC 3072",
    metaTitle: "Taxi in Preston & Reservoir | Preston Market Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Preston & Reservoir VIC 3072. 24/7 fast dispatch for Preston Market, High Street, Edwardes Lake & Airport transfers. Call 0435 304 821.",
    tagline: "Dependable transport across Darebin's market, dining, and residential centers.",
    heroSummary: [
      "Preston and Reservoir are bustling northern suburbs famous for the iconic Preston Market, High Street's international food scene, and peaceful green spaces like Edwardes Lake Park.",
      "Melbourne Taxis provides steady, reliable transport across Bell Street, Plenty Road, and St Georges Road, connecting residents smoothly with Melbourne CBD, local train stations, and Melbourne Airport via the Western Ring Road (M80)."
    ],
    keyHighlights: [
      "Preston Market & Fresh Food Precinct",
      "High Street & Plenty Road Dining",
      "Edwardes Lake Park",
      "Northland Shopping Centre (nearby)",
      "Preston & Reservoir Railway Stations"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "18 km", time: "20–28 min", approxFare: "$50 – $68" },
      { to: "Melbourne CBD", dist: "10 km", time: "22–30 min", approxFare: "$35 – $48" },
      { to: "Austin Hospital Heidelberg", dist: "6 km", time: "12–16 min", approxFare: "$25 – $32" }
    ],
    faqs: [
      { q: "How much is a taxi from Preston to Tullamarine Airport?", a: "Fares typically range from $50 to $68 via the M80 Ring Road." }
    ],
    keywords: ["taxi in Preston", "Preston taxi", "taxi in Reservoir", "Reservoir cab", "Preston Market taxi", "Preston to Tullamarine airport", "High Street Preston cab", "cabs in Preston"]
  },
  {
    id: "craigieburn-epping",
    name: "Craigieburn, Epping & Wollert",
    region: "Northern Suburbs",
    postcode: "VIC 3064",
    metaTitle: "Taxi in Craigieburn & Epping | Pacific Epping Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Craigieburn, Epping & Wollert VIC 3064. 24/7 cabs for Craigieburn Central, Pacific Epping, Northern Hospital & Airport. Call 0435 304 821.",
    tagline: "Rapid dispatch across Melbourne's booming northern communities and hospital precinct.",
    heroSummary: [
      "Craigieburn, Epping, and Wollert represent Melbourne's rapidly growing northern growth corridor. With major destinations like Pacific Epping, Craigieburn Central, The Northern Hospital, and Melbourne Wholesale Market, dependable 24/7 taxi transport is essential.",
      "Melbourne Taxis operates an active fleet across Hume Highway and the M80, giving northern residents instant access to punctual Melbourne Airport transfers and city connections."
    ],
    keyHighlights: [
      "Pacific Epping & Costco Epping",
      "Craigieburn Central Shopping Mall",
      "The Northern Hospital Epping",
      "Melbourne Market Wholesale Hub",
      "Hume Highway & Craigieburn Station"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "18 km", time: "18–25 min", approxFare: "$50 – $65" },
      { to: "Melbourne CBD", dist: "28 km", time: "35–48 min", approxFare: "$75 – $95" },
      { to: "The Northern Hospital", dist: "Local", time: "5–10 min", approxFare: "$25 – $30" }
    ],
    faqs: [
      { q: "Do you provide urgent medical taxi transport to The Northern Hospital?", a: "Yes, our drivers are available 24/7 for fast, compassionate hospital transfers." }
    ],
    keywords: ["taxi in Craigieburn", "Craigieburn taxi", "taxi in Epping", "Epping cab", "Pacific Epping taxi", "Northern Hospital taxi", "Craigieburn to airport taxi", "cabs in Craigieburn"]
  },
  {
    id: "heidelberg-ivanhoe",
    name: "Heidelberg & Ivanhoe",
    region: "Northern Suburbs",
    postcode: "VIC 3084",
    metaTitle: "Taxi in Heidelberg & Ivanhoe | Austin Hospital Cabs | Melbourne Taxis",
    metaDesc: "Need a taxi in Heidelberg & Ivanhoe VIC 3084? 24/7 service for Austin Hospital, Mercy Hospital for Women, Burgundy St & Airport runs. Call 0435 304 821.",
    tagline: "Austin Health medical hub, Yarra parklands, and Ivanhoe heritage transport.",
    heroSummary: [
      "Heidelberg and Ivanhoe are prestigious north-eastern suburbs famous for the Austin Health medical precinct (Austin Hospital, Mercy Hospital for Women, Olivia Newton-John Cancer Wellness & Research Centre), Burgundy Street shopping, and scenic Yarra River parklands.",
      "Melbourne Taxis provides reliable medical patient transport, corporate travel, and airport connections via the M80 Western Ring Road."
    ],
    keyHighlights: [
      "Austin Hospital & Olivia Newton-John Cancer Centre",
      "Mercy Hospital for Women & Heidelberg Repatriation",
      "Burgundy Street Shopping & Dining",
      "Ivanhoe Upper Heidelberg Road Village",
      "Heidelberg Railway Station"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "24 km", time: "22–30 min", approxFare: "$60 – $78" },
      { to: "Melbourne CBD", dist: "12 km", time: "20–28 min", approxFare: "$35 – $48" },
      { to: "Doncaster Westfield", dist: "7 km", time: "12–16 min", approxFare: "$25 – $32" }
    ],
    faqs: [
      { q: "Do you pick up from Austin Hospital main entrance?", a: "Yes, we pick up directly at the Austin Tower, Mercy Hospital, and Olivia Newton-John entrances." }
    ],
    keywords: ["taxi in Heidelberg", "Heidelberg taxi", "taxi in Ivanhoe", "Austin Hospital taxi", "Ivanhoe cab", "Burgundy Street taxi", "Heidelberg to Melbourne airport", "cabs in Heidelberg"]
  },
  {
    id: "bundoora-greensborough",
    name: "Bundoora & Greensborough",
    region: "Northern Suburbs",
    postcode: "VIC 3083",
    metaTitle: "Taxi in Bundoora & Greensborough | La Trobe Uni Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Bundoora & Greensborough VIC 3083. 24/7 pickups for La Trobe University, RMIT Bundoora, Greensborough Plaza & Airport. Call 0435 304 821.",
    tagline: "University campuses, Greensborough Plaza, and North East Link corridor cabs.",
    heroSummary: [
      "Bundoora and Greensborough form a major education and retail nexus in Melbourne's north-east, housing La Trobe University Main Campus, RMIT University Bundoora, Uni Hill Factory Outlets, and Greensborough Plaza.",
      "Melbourne Taxis offers 24/7 student transfers, local shopping trips, and rapid airport transfers via the M80 Ring Road."
    ],
    keyHighlights: [
      "La Trobe University Bundoora Campus",
      "RMIT University Bundoora East & West",
      "Greensborough Plaza & Main Street",
      "Uni Hill Town Centre & DFO Outlets",
      "M80 Ring Road & Plenty Road Corridor"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "24 km", time: "22–30 min", approxFare: "$60 – $78" },
      { to: "Melbourne CBD", dist: "16 km", time: "25–35 min", approxFare: "$45 – $60" },
      { to: "Preston Market", dist: "8 km", time: "14–18 min", approxFare: "$25 – $35" }
    ],
    faqs: [
      { q: "Can I book a taxi from La Trobe University campus?", a: "Yes, we pick up directly from all student halls of residence, libraries, and campus sports centres." }
    ],
    keywords: ["taxi in Bundoora", "Bundoora taxi", "taxi in Greensborough", "La Trobe University cab", "Greensborough taxi", "Uni Hill cab", "Bundoora to airport taxi", "cabs in Bundoora"]
  },
  {
    id: "sunbury",
    name: "Sunbury & Diggers Rest",
    region: "Northern Suburbs",
    postcode: "VIC 3429",
    metaTitle: "Taxi in Sunbury & Diggers Rest | 24/7 Airport Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Sunbury & Diggers Rest VIC 3429. 24/7 fast dispatch for Sunbury Square, Calder Fwy & 15-min Melbourne Airport transfers. Call 0435 304 821.",
    tagline: "Historic township transport, Calder Freeway express, and 15-minute airport runs.",
    heroSummary: [
      "Sunbury is a thriving historic township famous as the birthplace of 'The Ashes' cricket urn at Rupertswood Mansion, picturesque wineries, and vibrant community living along the Calder Freeway corridor.",
      "Melbourne Taxis provides immediate dispatch for Sunbury and Diggers Rest residents, offering one of the fastest direct routes to Melbourne Airport (approx 15-18 mins)."
    ],
    keyHighlights: [
      "Sunbury Square Shopping Centre",
      "Historic Rupertswood Estate & Sunbury Wineries",
      "Sunbury & Diggers Rest Railway Stations",
      "Calder Freeway (M79) & Sunbury Road",
      "Goonawarra Golf Course"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "20 km", time: "16–22 min", approxFare: "$48 – $62" },
      { to: "Melbourne CBD", dist: "38 km", time: "35–48 min", approxFare: "$90 – $115" },
      { to: "Melton", dist: "22 km", time: "18–24 min", approxFare: "$50 – $65" },
      { to: "Gisborne", dist: "18 km", time: "15–20 min", approxFare: "$45 – $58" }
    ],
    faqs: [
      { q: "How long is the taxi ride from Sunbury to Melbourne Airport?", a: "Only 16 to 22 minutes via Sunbury Road (C743)." }
    ],
    keywords: ["taxi in Sunbury", "Sunbury taxi", "taxi in Diggers Rest", "Diggers Rest cab", "Sunbury Square taxi", "Sunbury to Melbourne airport", "Calder Freeway taxi", "cabs in Sunbury"]
  },
  {
    id: "pascoe-vale-glenroy",
    name: "Pascoe Vale, Glenroy & Broadmeadows",
    region: "Northern Suburbs",
    postcode: "VIC 3044",
    metaTitle: "Taxi in Pascoe Vale, Glenroy & Broadmeadows | Airport Cabs | Melbourne Taxis",
    metaDesc: "Need a taxi in Pascoe Vale & Glenroy VIC 3044? 24/7 service for Broadmeadows Central, train stations & Tullamarine Airport runs. Call 0435 304 821.",
    tagline: "Inner-north transport corridor with 10-minute connections to Tullamarine.",
    heroSummary: [
      "Pascoe Vale, Glenroy, and Broadmeadows form a vital transit corridor in Melbourne's north, bordered by the Tullamarine Freeway, Western Ring Road, and Hume Highway. Broadmeadows Central and local train interchanges make this a busy residential hub.",
      "Melbourne Taxis provides rapid response times and fixed-fare airport transfers for families and business commuters."
    ],
    keyHighlights: [
      "Broadmeadows Central Shopping Mall",
      "Glenroy & Pascoe Vale Railway Stations",
      "Hume Global Learning Centre",
      "Northern Golf Club Glenroy",
      "Western Ring Road & Tullamarine Freeway Links"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "10 km", time: "10–15 min", approxFare: "$35 – $48" },
      { to: "Melbourne CBD", dist: "14 km", time: "20–28 min", approxFare: "$40 – $55" }
    ],
    faqs: [
      { q: "Can I get a taxi to Melbourne Airport from Glenroy at 4 AM?", a: "Yes, our drivers operate 24 hours a day with guaranteed on-time pickups." }
    ],
    keywords: ["taxi in Pascoe Vale", "taxi in Glenroy", "Pascoe Vale taxi", "Glenroy cab", "Broadmeadows taxi", "Glenroy to airport taxi", "Pascoe Vale cab", "cabs in Glenroy"]
  },

  // ═══════════════════════════════════════════════════════════════
  // ── 3. Eastern Suburbs ──
  // ═══════════════════════════════════════════════════════════════
  {
    id: "box-hill",
    name: "Box Hill & Mont Albert",
    region: "Eastern Suburbs",
    postcode: "VIC 3128",
    metaTitle: "Taxi in Box Hill & Mont Albert | Box Hill Central Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Box Hill VIC 3128. 24/7 fast dispatch for Box Hill Central, Box Hill Hospital, Whitehorse Rd & Melbourne Airport transfers. Call 0435 304 821.",
    tagline: "The premier transport link for Melbourne's eastern metropolitan activity centre.",
    heroSummary: [
      "Box Hill is the thriving business, healthcare, and Asian dining capital of Melbourne's east. With Box Hill Central shopping center, Box Hill Hospital, Box Hill Institute, and a busy train and tram interchange, seamless transport is always in high demand.",
      "Melbourne Taxis provides reliable executive travel, student rides, medical transfers, and direct airport services via the Eastern Freeway (M3) and M80 Ring Road straight to Melbourne Tullamarine."
    ],
    keyHighlights: [
      "Box Hill Central & Rooftop Dining",
      "Box Hill Hospital & Epworth Eastern",
      "Box Hill TAFE Institute",
      "Box Hill Railway Station & Bus Interchange",
      "Whitehorse Road Commercial Strip"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "38 km", time: "35–45 min", approxFare: "$95 – $120" },
      { to: "Melbourne CBD", dist: "18 km", time: "25–35 min", approxFare: "$50 – $65" },
      { to: "Doncaster Westfield", dist: "5 km", time: "10–12 min", approxFare: "$25 – $30" },
      { to: "Chadstone Shopping Centre", dist: "12 km", time: "18–24 min", approxFare: "$35 – $48" }
    ],
    faqs: [
      { q: "How long does a cab take from Box Hill to Melbourne Airport?", a: "Typically 35 to 45 minutes via the M3 Eastern Freeway and M80 Western Ring Road." },
      { q: "Can I book a Maxi Taxi for family airport transfers with 6 bags?", a: "Yes, our Maxi Cabs easily fit up to 10 passengers plus all luggage." }
    ],
    keywords: ["taxi in Box Hill", "Box Hill taxi", "taxi in Mont Albert", "Box Hill hospital cab", "Box Hill Central taxi", "Box Hill to Melbourne airport taxi", "maxi taxi Box Hill", "cabs in Box Hill"]
  },
  {
    id: "ringwood",
    name: "Ringwood & Croydon",
    region: "Eastern Suburbs",
    postcode: "VIC 3134",
    metaTitle: "Taxi in Ringwood & Croydon | Eastland Shopping Cabs | Melbourne Taxis",
    metaDesc: "Need a taxi in Ringwood & Croydon VIC 3134? 24/7 service for Eastland Shopping Centre, Maroondah Hospital, Ringwood Station & Airport. Call 0435 304 821.",
    tagline: "EastLink gateway transport for Maroondah residents and Yarra Valley day-trippers.",
    heroSummary: [
      "Ringwood is the vibrant eastern hub anchored by the stunning Eastland Shopping Centre, Ringwood Station transport interchange, and Maroondah Hospital. It serves as the gateway to the outer east, Dandenong Ranges, and Yarra Valley wine country.",
      "Melbourne Taxis offers 24/7 service connecting Ringwood and Croydon with EastLink (M3), Melbourne CBD, and Melbourne Airport."
    ],
    keyHighlights: [
      "Eastland Shopping Centre & Town Square",
      "Ringwood Railway Station Interchange",
      "Maroondah Hospital & Ringwood Private",
      "Realm Library & Cultural Centre",
      "EastLink (M3) Gateway"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "48 km", time: "40–50 min", approxFare: "$120 – $145" },
      { to: "Melbourne CBD", dist: "28 km", time: "30–42 min", approxFare: "$75 – $95" },
      { to: "Yarra Valley Wineries", dist: "25 km", time: "25–35 min", approxFare: "$65 – $85" }
    ],
    faqs: [
      { q: "Do you offer wine tour transfers from Ringwood to Yarra Valley?", a: "Yes, we provide flexible Maxi Taxi day hires and round-trip transfers for winery tours." }
    ],
    keywords: ["taxi in Ringwood", "Ringwood taxi", "taxi in Croydon", "Croydon cab", "Eastland taxi", "Maroondah hospital taxi", "Ringwood to airport taxi", "cabs in Ringwood"]
  },
  {
    id: "doncaster",
    name: "Doncaster & Templestowe",
    region: "Eastern Suburbs",
    postcode: "VIC 3108",
    metaTitle: "Taxi in Doncaster & Templestowe | Westfield Doncaster Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Doncaster & Templestowe VIC 3108. 24/7 fast service for Westfield Doncaster, Eastern Freeway & Melbourne Airport. Call 0435 304 821.",
    tagline: "Elevated eastern suburb taxi and chauffeur transfers for shoppers and families.",
    heroSummary: [
      "Doncaster and Templestowe are renowned for Westfield Doncaster (one of Victoria's top retail fashion destinations), spacious homes, scenic parklands along the Yarra River, and direct access to the Eastern Freeway.",
      "Melbourne Taxis provides executive and everyday cabs for shopping trips, city commutes, and prompt Melbourne Airport transfers."
    ],
    keyHighlights: [
      "Westfield Doncaster Shopping Mall",
      "Manningham Civic Centre",
      "Westerfolds Park Templestowe",
      "Eastern Freeway M3 Access",
      "Doncaster Hill Residential Precinct"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "34 km", time: "30–40 min", approxFare: "$85 – $110" },
      { to: "Melbourne CBD", dist: "15 km", time: "20–28 min", approxFare: "$45 – $60" },
      { to: "Box Hill Central", dist: "5 km", time: "10–12 min", approxFare: "$25 – $30" }
    ],
    faqs: [
      { q: "Where can I catch a taxi at Westfield Doncaster?", a: "We pick up at all major mall entry portals, including the valet drop-off and bus interchange." }
    ],
    keywords: ["taxi in Doncaster", "Doncaster taxi", "taxi in Templestowe", "Westfield Doncaster cab", "Templestowe taxi", "Doncaster to airport taxi", "Manningham cab", "cabs in Doncaster"]
  },
  {
    id: "glen-waverley",
    name: "Glen Waverley & Mount Waverley",
    region: "Eastern Suburbs",
    postcode: "VIC 3150",
    metaTitle: "Taxi in Glen Waverley & Mount Waverley | The Glen Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Glen Waverley VIC 3150. 24/7 service for Kingsway dining, The Glen Shopping Centre, Monash Uni & Melbourne Airport. Call 0435 304 821.",
    tagline: "Kingsway dining, shopping, and education hub taxi service available 24/7.",
    heroSummary: [
      "Glen Waverley and Mount Waverley represent one of Melbourne's most sought-after eastern districts, featuring the renowned dining and entertainment strip on Kingsway, The Glen shopping centre, top schools, and close proximity to Monash University.",
      "Melbourne Taxis provides comfortable sedans, luxury executive cars, and Maxi Cabs for dinner parties, business commuters, and international airport transfers."
    ],
    keyHighlights: [
      "Kingsway Dining & Entertainment Strip",
      "The Glen Shopping Centre",
      "Glen Waverley Railway Station",
      "Novotel Glen Waverley",
      "Monash Aquatic and Recreation Centre"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "46 km", time: "40–52 min", approxFare: "$115 – $140" },
      { to: "Melbourne CBD", dist: "22 km", time: "28–38 min", approxFare: "$60 – $80" },
      { to: "Chadstone Shopping Centre", dist: "9 km", time: "14–18 min", approxFare: "$30 – $40" },
      { to: "Monash University Clayton", dist: "6 km", time: "10–14 min", approxFare: "$25 – $32" }
    ],
    faqs: [
      { q: "Are taxis available late night on Kingsway?", a: "Yes, we operate 24/7 with swift dispatch to all Kingsway restaurants, bars, and Century City Walk." }
    ],
    keywords: ["taxi in Glen Waverley", "Glen Waverley taxi", "taxi in Mount Waverley", "Kingsway cab", "The Glen taxi", "Glen Waverley to Melbourne airport", "Mount Waverley taxi", "cabs in Glen Waverley"]
  },
  {
    id: "hawthorn-camberwell",
    name: "Hawthorn, Camberwell & Kew",
    region: "Eastern Suburbs",
    postcode: "VIC 3122",
    metaTitle: "Taxi in Hawthorn, Camberwell & Kew | Glenferrie Rd Cabs | Melbourne Taxis",
    metaDesc: "Need a taxi in Hawthorn & Camberwell VIC 3122? 24/7 service for Glenferrie Rd, Swinburne Uni, Camberwell Junction & Airport. Call 0435 304 821.",
    tagline: "Historic elegance and university precinct transport in Melbourne's inner east.",
    heroSummary: [
      "Hawthorn, Camberwell, and Kew are prestigious inner-east suburbs famous for heritage architecture, Glenferrie Road shopping, Swinburne University of Technology, Camberwell Junction Sunday Market, and top private schools.",
      "Melbourne Taxis provides executive Silver Service travel, everyday commuter rides, and hassle-free airport transfers."
    ],
    keyHighlights: [
      "Glenferrie Road Shopping & Dining",
      "Swinburne University Hawthorn Campus",
      "Camberwell Junction & Rivoli Cinema",
      "Burke Road Shopping Precinct",
      "Hawthorn & Camberwell Train Stations"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "28 km", time: "30–40 min", approxFare: "$75 – $95" },
      { to: "Melbourne CBD", dist: "7 km", time: "14–20 min", approxFare: "$25 – $35" },
      { to: "Chadstone", dist: "8 km", time: "14–18 min", approxFare: "$28 – $38" }
    ],
    faqs: [
      { q: "Can I book a corporate account taxi in Hawthorn?", a: "Yes, we offer corporate bookings, tax invoices, and Silver Service for businesses throughout Boroondara." }
    ],
    keywords: ["taxi in Hawthorn", "Hawthorn taxi", "taxi in Camberwell", "Camberwell cab", "Glenferrie road taxi", "Swinburne taxi", "Hawthorn to airport taxi", "cabs in Hawthorn"]
  },
  {
    id: "burwood-blackburn",
    name: "Burwood, Blackburn & Vermont",
    region: "Eastern Suburbs",
    postcode: "VIC 3125",
    metaTitle: "Taxi in Burwood, Blackburn & Vermont | Deakin Uni Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Burwood & Blackburn VIC 3125. 24/7 rides for Deakin University Burwood, Burwood Brickworks & Melbourne Airport. Call 0435 304 821.",
    tagline: "Deakin University campus connections, Blackburn Lake tranquility, and eastern transport.",
    heroSummary: [
      "Burwood and Blackburn are thriving eastern residential suburbs, home to the massive Deakin University Melbourne Burwood Campus, Burwood Brickworks shopping centre (with rooftop urban farm), and the scenic Blackburn Lake Sanctuary.",
      "Melbourne Taxis provides students, faculty, and local residents with dependable 24/7 cabs, Silver Service executive sedans, and direct airport transfers."
    ],
    keyHighlights: [
      "Deakin University Burwood Campus",
      "Burwood Brickworks Shopping Centre",
      "Blackburn Lake Sanctuary & Parkland",
      "Blackburn Railway Station Junction",
      "Burwood Highway & Middleborough Road"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "40 km", time: "36–48 min", approxFare: "$100 – $125" },
      { to: "Melbourne CBD", dist: "16 km", time: "24–34 min", approxFare: "$45 – $60" },
      { to: "Chadstone", dist: "7 km", time: "12–16 min", approxFare: "$25 – $32" }
    ],
    faqs: [
      { q: "Can I get picked up directly inside Deakin University Burwood?", a: "Yes, we pick up at all campus entrances, student accommodation, and the Deakin bus loop." }
    ],
    keywords: ["taxi in Burwood", "Burwood taxi", "taxi in Blackburn", "Deakin University taxi", "Blackburn cab", "Burwood Brickworks cab", "Burwood to Melbourne airport", "cabs in Burwood"]
  },
  {
    id: "wantirna-knox",
    name: "Wantirna, Knox & Rowville",
    region: "Eastern Suburbs",
    postcode: "VIC 3152",
    metaTitle: "Taxi in Wantirna, Knox & Rowville | Westfield Knox Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Wantirna & Knox VIC 3152. 24/7 fast dispatch for Westfield Knox, Knox Private Hospital, EastLink & Airport. Call 0435 304 821.",
    tagline: "Westfield Knox shopping, Knox Private Hospital, and EastLink fast transit.",
    heroSummary: [
      "Wantirna, Knoxfield, and Rowville are thriving family and commercial hubs in Melbourne's outer east, home to the newly redeveloped Westfield Knox, Knox Private Hospital, and the Caribbean Park business precinct.",
      "Melbourne Taxis provides direct access via EastLink (M3) to both Melbourne Tullamarine Airport and Melbourne CBD."
    ],
    keyHighlights: [
      "Westfield Knox Shopping Centre & Ozone",
      "Knox Private Hospital Wantirna",
      "Caribbean Park Commercial Precinct",
      "EastLink M3 Interchange",
      "Stud Park Shopping Centre Rowville"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "52 km", time: "42–55 min", approxFare: "$130 – $155" },
      { to: "Melbourne CBD", dist: "30 km", time: "30–42 min", approxFare: "$80 – $100" }
    ],
    faqs: [
      { q: "Do you offer patient transfers to Knox Private Hospital?", a: "Yes, we provide comfortable, punctual patient and family rides to Knox Private and Wantirna Health." }
    ],
    keywords: ["taxi in Knox", "Knox taxi", "taxi in Wantirna", "Wantirna cab", "Westfield Knox taxi", "Knox Private Hospital taxi", "Rowville cab", "cabs in Knox"]
  },
  {
    id: "lilydale-yarra-valley",
    name: "Lilydale & Yarra Valley Gateway",
    region: "Eastern Suburbs",
    postcode: "VIC 3140",
    metaTitle: "Taxi in Lilydale & Yarra Valley | Winery Tours & Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Lilydale & Yarra Valley VIC 3140. 24/7 service for Yarra Valley winery tours, weddings, Lilydale Station & Airport. Call 0435 304 821.",
    tagline: "World-class winery transfers, wedding venue transport, and regional rail connections.",
    heroSummary: [
      "Lilydale serves as the gateway to the world-renowned Yarra Valley wine region (Healesville, Yarra Glen, Coldstream) and the scenic Dandenong Ranges. It is a bustling regional hub with Lilydale Marketplace and the terminus of the Lilydale rail line.",
      "Melbourne Taxis provides dedicated winery tour Maxi Taxis, wedding group transfers, and direct airport travel."
    ],
    keyHighlights: [
      "Yarra Valley Wineries & Cellar Doors",
      "Lilydale Marketplace & Main Street",
      "Lilydale Railway Station & Rail Trail",
      "Rochford Wines & Coombe Yarra Valley",
      "Maroondah Highway Gateway"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "58 km", time: "50–65 min", approxFare: "$140 – $170" },
      { to: "Melbourne CBD", dist: "40 km", time: "45–60 min", approxFare: "$105 – $135" },
      { to: "Healesville Sanctuary", dist: "22 km", time: "20–25 min", approxFare: "$55 – $70" }
    ],
    faqs: [
      { q: "Can we hire a Maxi Taxi for a private Yarra Valley winery day tour?", a: "Yes! We offer flexible hourly and full-day Maxi Taxi charters for up to 11 passengers visiting Yarra Valley wineries." }
    ],
    keywords: ["taxi in Lilydale", "Lilydale taxi", "taxi in Yarra Valley", "Yarra Valley wine tour taxi", "Lilydale to Melbourne airport", "wedding taxi Yarra Valley", "Healesville cab", "cabs in Lilydale"]
  },

  // ═══════════════════════════════════════════════════════════════
  // ── 4. South Eastern & Bayside Suburbs ──
  // ═══════════════════════════════════════════════════════════════
  {
    id: "brighton",
    name: "Brighton & Bayside",
    region: "South Eastern & Bayside",
    postcode: "VIC 3186",
    metaTitle: "Taxi in Brighton & Bayside | Church St & Beach Cabs | Melbourne Taxis",
    metaDesc: "Book a premium taxi in Brighton VIC 3186. 24/7 service for Church St, Bay St, Dendy Beach Bathing Boxes & Melbourne Airport. Call 0435 304 821.",
    tagline: "Exclusive Bayside chauffeur and taxi transport for luxury coastal living.",
    heroSummary: [
      "Brighton is Melbourne's elite Bayside jewel, famous for the colorful Dendy Street Beach bathing boxes, upscale shopping and dining on Church Street and Bay Street, and stunning waterfront residences along Beach Road.",
      "Melbourne Taxis delivers five-star Silver Service sedans and spacious SUVs for Brighton residents traveling to corporate offices in the CBD, social engagements, or Melbourne Airport."
    ],
    keyHighlights: [
      "Brighton Beach & Bathing Boxes",
      "Church Street & Bay Street Boutiques",
      "Royal Brighton Yacht Club",
      "Middle Brighton & Brighton Beach Stations",
      "Bayside Coastal Trail"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "36 km", time: "38–50 min", approxFare: "$95 – $120" },
      { to: "Melbourne CBD", dist: "13 km", time: "22–30 min", approxFare: "$40 – $55" },
      { to: "St Kilda Beach", dist: "7 km", time: "12–16 min", approxFare: "$25 – $35" },
      { to: "Chadstone Shopping Centre", dist: "10 km", time: "16–22 min", approxFare: "$32 – $42" }
    ],
    faqs: [
      { q: "Do you offer luxury Silver Service cars in Brighton?", a: "Yes, our luxury fleet is popular with Brighton executives and families wanting premium comfort." }
    ],
    keywords: ["taxi in Brighton", "Brighton taxi", "taxi in Bayside", "Bayside cab", "Church Street Brighton taxi", "Brighton to Melbourne airport", "luxury taxi Brighton", "cabs in Brighton"]
  },
  {
    id: "clayton-monash",
    name: "Clayton, Notting Hill & Monash",
    region: "South Eastern & Bayside",
    postcode: "VIC 3168",
    metaTitle: "Taxi in Clayton & Monash | Monash Uni & Hospital Cabs | Melbourne Taxis",
    metaDesc: "Need a taxi in Clayton VIC 3168? 24/7 service for Monash Medical Centre, Monash Uni, Victorian Heart Hospital & Airport. Call 0435 304 821.",
    tagline: "University and medical innovation precinct taxi service available 24/7.",
    heroSummary: [
      "Clayton is a major scientific, medical, and educational hub centered on Monash University Clayton Campus, Monash Medical Centre, the Victorian Heart Hospital, and the Australian Synchrotron.",
      "Melbourne Taxis provides dependable patient transport, student transfers, researcher travel, and direct Melbourne Airport services via the Monash Freeway (M1) and CityLink."
    ],
    keyHighlights: [
      "Monash University Clayton Campus",
      "Monash Medical Centre & Children's Hospital",
      "Victorian Heart Hospital",
      "Clayton Railway Station & Shopping Strip",
      "Australian Synchrotron & Technology Park"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "45 km", time: "40–55 min", approxFare: "$115 – $145" },
      { to: "Melbourne CBD", dist: "20 km", time: "25–38 min", approxFare: "$55 – $75" },
      { to: "Chadstone Shopping Centre", dist: "6 km", time: "10–14 min", approxFare: "$25 – $32" }
    ],
    faqs: [
      { q: "Do you offer accessible and patient transport to Monash Medical Centre?", a: "Yes, we prioritize hospital rides with courteous, attentive drivers." }
    ],
    keywords: ["taxi in Clayton", "Clayton taxi", "taxi in Monash", "Monash university cab", "Monash medical centre taxi", "Clayton to airport taxi", "Victorian Heart Hospital cab", "cabs in Clayton"]
  },
  {
    id: "chadstone-oakleigh",
    name: "Chadstone & Oakleigh",
    region: "South Eastern & Bayside",
    postcode: "VIC 3148",
    metaTitle: "Taxi in Chadstone & Oakleigh | Fashion Capital Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Chadstone & Oakleigh VIC 3148. 24/7 fast pickups at Chadstone Shopping Centre, Eaton Mall & Melbourne Airport. Call 0435 304 821.",
    tagline: "Direct transport for the Fashion Capital and Oakleigh's famous Greek dining hub.",
    heroSummary: [
      "Chadstone is globally celebrated as the 'Fashion Capital' — the largest shopping mall in the Southern Hemisphere. Neighboring Oakleigh boasts the lively open-air Greek dining hub of Eaton Mall.",
      "Melbourne Taxis offers round-the-clock service for shoppers loaded with bags, hotel guests at Hotel Chadstone MGallery, diners, and tourists traveling directly to Melbourne Airport."
    ],
    keyHighlights: [
      "Chadstone – The Fashion Capital",
      "Hotel Chadstone Melbourne MGallery",
      "Eaton Mall Oakleigh Greek Dining",
      "Oakleigh Railway Station",
      "Monash Freeway M1 Access"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "36 km", time: "35–48 min", approxFare: "$95 – $120" },
      { to: "Melbourne CBD", dist: "15 km", time: "20–30 min", approxFare: "$45 – $60" },
      { to: "St Kilda", dist: "11 km", time: "16–22 min", approxFare: "$35 – $45" }
    ],
    faqs: [
      { q: "Where can a taxi pick me up at Chadstone Shopping Centre?", a: "We pick up outside all major mall portals including the Luxury Precinct, David Jones entrance, and Hotel Chadstone lobby." }
    ],
    keywords: ["taxi in Chadstone", "Chadstone taxi", "taxi in Oakleigh", "Fashion Capital cab", "Oakleigh taxi", "Eaton Mall cab", "Chadstone to Melbourne airport", "cabs in Chadstone"]
  },
  {
    id: "dandenong",
    name: "Dandenong & Greater Dandenong",
    region: "South Eastern & Bayside",
    postcode: "VIC 3175",
    metaTitle: "Taxi in Dandenong & Greater Dandenong | Market & Plaza Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Dandenong VIC 3175. 24/7 service for Dandenong Market, Dandenong Hospital, Dandenong Plaza & Melbourne Airport. Call 0435 304 821.",
    tagline: "Industrial power and multicultural heart of Melbourne's south east.",
    heroSummary: [
      "Dandenong is Victoria's second major metropolis, featuring Dandenong Market, Dandenong Plaza, Drum Theatre, Dandenong Hospital, and extensive industrial manufacturing estates.",
      "Melbourne Taxis provides reliable transport across Princes Highway, Monash Freeway (M1), and EastLink, connecting local businesses and residents with all Melbourne destinations and both airports."
    ],
    keyHighlights: [
      "Dandenong Market & Afghan Bazaar Precinct",
      "Dandenong Hospital & Healthcare Hub",
      "Dandenong Plaza & Drum Theatre",
      "Dandenong South Industrial Precinct",
      "Dandenong Railway Station & Bus Interchange"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "55 km", time: "45–60 min", approxFare: "$135 – $165" },
      { to: "Melbourne CBD", dist: "32 km", time: "35–50 min", approxFare: "$85 – $110" },
      { to: "Frankston Beach", dist: "18 km", time: "20–25 min", approxFare: "$48 – $62" }
    ],
    faqs: [
      { q: "How much is a taxi from Dandenong to Tullamarine Airport?", a: "Typically $135 to $165 via EastLink and the M80 Ring Road." }
    ],
    keywords: ["taxi in Dandenong", "Dandenong taxi", "taxi in Greater Dandenong", "Dandenong market cab", "Dandenong hospital taxi", "Dandenong to airport taxi", "Dandenong South cab", "cabs in Dandenong"]
  },
  {
    id: "frankston-mornington",
    name: "Frankston & Mornington Peninsula",
    region: "South Eastern & Bayside",
    postcode: "VIC 3199",
    metaTitle: "Taxi in Frankston & Mornington Peninsula | 24/7 Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Frankston & Mornington Peninsula VIC 3199. 24/7 service for Frankston Waterfront, Hot Springs & Melbourne Airport. Call 0435 304 821.",
    tagline: "The gateway to the Mornington Peninsula with reliable airport and coastal transport.",
    heroSummary: [
      "Frankston is the vibrant coastal city and gateway to the Mornington Peninsula, home to Frankston Waterfront, Bayside Shopping Centre, Frankston Hospital, and connections to winery tours and the Peninsula Hot Springs.",
      "Melbourne Taxis offers dependable long-distance travel, airport transfers via Peninsula Link (M11), and group Maxi Taxi winery tours."
    ],
    keyHighlights: [
      "Frankston Waterfront & Pier",
      "Bayside Shopping Centre",
      "Frankston Hospital & Monash University Campus",
      "Peninsula Link (M11) Expressway",
      "Mornington Main Street & Hot Springs Gateway"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "68 km", time: "55–70 min", approxFare: "$165 – $205" },
      { to: "Melbourne CBD", dist: "45 km", time: "45–60 min", approxFare: "$115 – $145" },
      { to: "Peninsula Hot Springs Fingal", dist: "35 km", time: "30–40 min", approxFare: "$85 – $110" }
    ],
    faqs: [
      { q: "Do you offer group winery tours to Mornington Peninsula?", a: "Yes, our 11-seat Maxi Taxis are perfect for private wine tours, weddings, and weekend hot springs getaways." }
    ],
    keywords: ["taxi in Frankston", "Frankston taxi", "taxi in Mornington", "Mornington cab", "Frankston hospital taxi", "Frankston to Melbourne airport", "Peninsula hot springs taxi", "cabs in Frankston"]
  },
  {
    id: "cheltenham-mentone",
    name: "Cheltenham, Mentone & Moorabbin",
    region: "South Eastern & Bayside",
    postcode: "VIC 3192",
    metaTitle: "Taxi in Cheltenham & Mentone | Westfield Southland Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Cheltenham & Mentone VIC 3192. 24/7 pickups for Westfield Southland, Moorabbin Airport DFO & Melbourne Airport. Call 0435 304 821.",
    tagline: "Westfield Southland retail, Moorabbin Airport DFO, and bayside transport.",
    heroSummary: [
      "Cheltenham, Mentone, and Moorabbin combine world-class retail at Westfield Southland with Moorabbin Airport (general aviation & DFO), prestigious sandbelt golf courses, and beautiful Port Phillip Bay beaches.",
      "Melbourne Taxis provides reliable transfers along Nepean Highway and Beach Road directly to the CBD and Tullamarine Airport."
    ],
    keyHighlights: [
      "Westfield Southland Shopping Centre",
      "DFO Moorabbin & Moorabbin Airport",
      "Mentone Beach & Life Saving Club",
      "Kingston Heath & Victoria Golf Clubs",
      "Cheltenham & Mentone Train Stations"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "42 km", time: "42–55 min", approxFare: "$110 – $135" },
      { to: "Melbourne CBD", dist: "20 km", time: "28–38 min", approxFare: "$55 – $72" }
    ],
    faqs: [
      { q: "Where can I meet my taxi at Westfield Southland?", a: "We pick up outside the cinema entrance, food court, and Nepean Highway valet portal." }
    ],
    keywords: ["taxi in Cheltenham", "Cheltenham taxi", "taxi in Mentone", "Southland shopping centre cab", "Mentone taxi", "Moorabbin airport cab", "Cheltenham to Melbourne airport", "cabs in Cheltenham"]
  },
  {
    id: "berwick-narre-warren",
    name: "Berwick, Narre Warren & Cranbourne",
    region: "South Eastern & Bayside",
    postcode: "VIC 3806",
    metaTitle: "Taxi in Berwick & Narre Warren | Fountain Gate Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Berwick & Narre Warren VIC 3806. 24/7 service for Westfield Fountain Gate, Casey Hospital & Melbourne Airport. Call 0435 304 821.",
    tagline: "Casey and Cardinia growth corridor, Westfield Fountain Gate, and Casey Hospital.",
    heroSummary: [
      "Berwick, Narre Warren, and Cranbourne form Melbourne's massive south-eastern growth corridor, featuring Westfield Fountain Gate (Australia's second-largest shopping centre), Casey Hospital, Federation University, and Royal Botanic Gardens Cranbourne.",
      "Melbourne Taxis offers 24/7 airport connections via the Monash Freeway (M1) and EastLink."
    ],
    keyHighlights: [
      "Westfield Fountain Gate Shopping Centre",
      "Casey Hospital & St John of God Berwick",
      "Old Berwick Village Historic Strip",
      "Royal Botanic Gardens Cranbourne",
      "Narre Warren & Berwick Train Stations"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "62 km", time: "50–65 min", approxFare: "$150 – $185" },
      { to: "Melbourne CBD", dist: "42 km", time: "40–55 min", approxFare: "$105 – $135" }
    ],
    faqs: [
      { q: "Can I book a fixed-rate taxi from Berwick to Melbourne Airport?", a: "Yes, we provide guaranteed upfront pricing for all airport transfers across the City of Casey." }
    ],
    keywords: ["taxi in Berwick", "Berwick taxi", "taxi in Narre Warren", "Narre Warren cab", "Fountain Gate taxi", "Casey Hospital taxi", "Cranbourne cab", "cabs in Berwick"]
  },
  {
    id: "caulfield-bentleigh",
    name: "Caulfield, Carnegie & Bentleigh",
    region: "South Eastern & Bayside",
    postcode: "VIC 3162",
    metaTitle: "Taxi in Caulfield, Carnegie & Bentleigh | Racecourse Cabs | Melbourne Taxis",
    metaDesc: "Need a taxi in Caulfield & Bentleigh VIC 3162? 24/7 cabs for Caulfield Racecourse, Monash Caulfield & Melbourne Airport runs. Call 0435 304 821.",
    tagline: "Caulfield Cup racing, Monash University Caulfield, and vibrant Koornang Road dining.",
    heroSummary: [
      "Caulfield, Carnegie, and Bentleigh are established, high-amenity inner-south-east suburbs home to Caulfield Racecourse (Caulfield Cup), Monash University Caulfield Campus, and the popular international food strip on Koornang Road.",
      "Melbourne Taxis provides prompt race day transfers, student commutes, and express airport services."
    ],
    keyHighlights: [
      "Caulfield Racecourse (Caulfield Cup)",
      "Monash University Caulfield Campus",
      "Koornang Road Carnegie Food Strip",
      "Centre Road Bentleigh Shopping Strip",
      "Caulfield Railway Interchange"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "32 km", time: "32–42 min", approxFare: "$85 – $105" },
      { to: "Melbourne CBD", dist: "11 km", time: "18–26 min", approxFare: "$35 – $48" }
    ],
    faqs: [
      { q: "Can I book a taxi for race days at Caulfield Racecourse?", a: "Yes, we offer guaranteed pre-bookings and post-race pickups for all major race days." }
    ],
    keywords: ["taxi in Caulfield", "Caulfield taxi", "taxi in Bentleigh", "Caulfield Racecourse cab", "Carnegie taxi", "Bentleigh cab", "Caulfield to airport taxi", "cabs in Caulfield"]
  },

  // ═══════════════════════════════════════════════════════════════
  // ── 5. Western Suburbs & Regional Victoria ──
  // ═══════════════════════════════════════════════════════════════
  {
    id: "werribee-point-cook",
    name: "Werribee & Point Cook",
    region: "Western Suburbs & Regional",
    postcode: "VIC 3030",
    metaTitle: "Taxi in Werribee & Point Cook | 24/7 Airport Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Werribee & Point Cook VIC 3030. 24/7 cabs for Werribee Open Range Zoo, Pacific Werribee, Tullamarine & Avalon Airport. Call 0435 304 821.",
    tagline: "Rapid transport across Wyndham's premier residential, shopping, and tourism hubs.",
    heroSummary: [
      "Werribee and Point Cook form the heart of Wyndham City, one of Australia's fastest-growing regions. Key attractions include Werribee Open Range Zoo, Werribee Mansion and Park, Pacific Werribee shopping centre, and the Sanctuary Lakes golf estate.",
      "Melbourne Taxis provides reliable 24/7 cab services connecting Wyndham residents directly with Melbourne CBD, Tullamarine Airport, and Avalon Airport."
    ],
    keyHighlights: [
      "Werribee Open Range Zoo & Werribee Mansion",
      "Pacific Werribee Shopping Centre",
      "Sanctuary Lakes Shopping Centre & Golf Club",
      "Werribee Mercy Hospital",
      "Werribee & Hoppers Crossing Train Stations"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "42 km", time: "35–45 min", approxFare: "$100 – $125" },
      { to: "Avalon Airport", dist: "30 km", time: "25–35 min", approxFare: "$75 – $95" },
      { to: "Melbourne CBD", dist: "32 km", time: "30–45 min", approxFare: "$75 – $95" },
      { to: "Geelong City", dist: "45 km", time: "35–45 min", approxFare: "$105 – $130" }
    ],
    faqs: [
      { q: "How long does a taxi take from Werribee to Avalon Airport?", a: "Typically only 25 to 35 minutes down the Princes Freeway (M1)." },
      { q: "Do you service Werribee Zoo visitors?", a: "Yes, we provide direct drop-off and pickup right at the Werribee Zoo ticket entrance." }
    ],
    keywords: ["taxi in Werribee", "Werribee taxi", "taxi in Point Cook", "Point Cook cab", "Werribee zoo taxi", "Werribee to Avalon airport", "Point Cook to Melbourne airport taxi", "cabs in Werribee"]
  },
  {
    id: "footscray-yarraville",
    name: "Footscray & Yarraville",
    region: "Western Suburbs & Regional",
    postcode: "VIC 3011",
    metaTitle: "Taxi in Footscray & Yarraville | Inner West Cabs | Melbourne Taxis",
    metaDesc: "Need a taxi in Footscray & Yarraville VIC 3011? 24/7 fast dispatch for Footscray Market, Sun Theatre, Victoria Uni & Airport. Call 0435 304 821.",
    tagline: "Vibrant inner-west transport connecting cultural markets, dining, and city avenues.",
    heroSummary: [
      "Footscray, Yarraville, and Seddon form Melbourne's buzzing inner west, famed for the diverse food markets of Footscray, the historic Sun Theatre in Yarraville Village, Victoria University, and Western Health hospital.",
      "Melbourne Taxis provides lightning-fast response times for local trips into the CBD, Docklands, or direct transit to Melbourne Airport via the Western Ring Road or CityLink."
    ],
    keyHighlights: [
      "Footscray Market & Barkly Street Food Strip",
      "Yarraville Village & Art Deco Sun Theatre",
      "Footscray Hospital & Victoria University",
      "Footscray Railway Station (major junction)",
      "West Gate Bridge & Dynon Road City Access"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "18 km", time: "20–28 min", approxFare: "$50 – $65" },
      { to: "Melbourne CBD", dist: "6 km", time: "12–18 min", approxFare: "$25 – $35" },
      { to: "Williamstown Beach", dist: "8 km", time: "14–18 min", approxFare: "$28 – $36" }
    ],
    faqs: [
      { q: "How quick is a taxi from Footscray to Melbourne CBD?", a: "Under normal traffic conditions, it takes just 12 to 18 minutes." }
    ],
    keywords: ["taxi in Footscray", "Footscray taxi", "taxi in Yarraville", "Yarraville cab", "Footscray market taxi", "Footscray to airport cab", "inner west taxi Melbourne", "cabs in Footscray"]
  },
  {
    id: "sunshine",
    name: "Sunshine, Sunshine West & St Albans",
    region: "Western Suburbs & Regional",
    postcode: "VIC 3020",
    metaTitle: "Taxi in Sunshine, Sunshine West & St Albans | Hospital Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Sunshine VIC 3020. 24/7 service for Sunshine Hospital, Joan Kirner, Sunshine Plaza & 15-min Melbourne Airport runs. Call 0435 304 821.",
    tagline: "Western Melbourne's central transit nexus for hospitals, rail, and airport links.",
    heroSummary: [
      "Sunshine is the bustling commercial and transport anchor of Melbourne's west, home to Sunshine Plaza, Sunshine Hospital (Western Health), Joan Kirner Women's and Children's Hospital, and the major Sunshine Railway Interchange.",
      "Melbourne Taxis offers round-the-clock service for hospital appointments, shift workers, local retail runs, and quick 15-20 minute runs to Melbourne Airport."
    ],
    keyHighlights: [
      "Sunshine Hospital & Joan Kirner Women's & Children's",
      "Sunshine Plaza & Marketown Shopping",
      "Sunshine Railway Station",
      "Hampshire Road Multicultural Food Strip",
      "Western Ring Road (M80) Junction"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "16 km", time: "16–22 min", approxFare: "$45 – $60" },
      { to: "Melbourne CBD", dist: "13 km", time: "20–30 min", approxFare: "$35 – $48" },
      { to: "Sunshine Hospital", dist: "Local", time: "5–8 min", approxFare: "$25 – $30" }
    ],
    faqs: [
      { q: "How fast is a taxi from Sunshine to Tullamarine Airport?", a: "Via the Western Ring Road (M80), travel time is usually just 16 to 22 minutes." }
    ],
    keywords: ["taxi in Sunshine", "Sunshine taxi", "taxi in St Albans", "Sunshine hospital cab", "Sunshine Plaza taxi", "Sunshine to Melbourne airport", "Western Health taxi", "cabs in Sunshine"]
  },
  {
    id: "tarneit-truganina",
    name: "Tarneit, Truganina & Williams Landing",
    region: "Western Suburbs & Regional",
    postcode: "VIC 3029",
    metaTitle: "Taxi in Tarneit, Truganina & Williams Landing | 24/7 Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Tarneit & Truganina VIC 3029. 24/7 service for Tarneit Central, logistics estates, stations & Melbourne Airport. Call 0435 304 821.",
    tagline: "High-growth western family suburbs and industrial distribution logistics cabs.",
    heroSummary: [
      "Tarneit and Truganina represent vibrant new master-planned communities combined with Australia's premier logistics and distribution estates. With Tarneit Central shopping centre and Tarneit Train Station, demand for clean, punctual taxi transport is high.",
      "Melbourne Taxis provides reliable family transport, early commuter connections, and stress-free airport trips to Tullamarine and Avalon."
    ],
    keyHighlights: [
      "Tarneit Central Shopping Centre",
      "Tarneit Railway Station",
      "Truganina Logistics & Freight Industrial Parks",
      "Wyndham Village Shopping Centre",
      "Derrimut Road Commercial Corridor"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "32 km", time: "30–40 min", approxFare: "$78 – $100" },
      { to: "Avalon Airport", dist: "38 km", time: "32–42 min", approxFare: "$90 – $115" },
      { to: "Melbourne CBD", dist: "28 km", time: "32–45 min", approxFare: "$70 – $90" }
    ],
    faqs: [
      { q: "Can I book an early morning airport taxi in Tarneit?", a: "Yes, pre-booking online guarantees a driver at your door on time with flight monitoring." }
    ],
    keywords: ["taxi in Tarneit", "Tarneit taxi", "taxi in Truganina", "Truganina cab", "Tarneit Central taxi", "Tarneit to airport taxi", "Truganina logistics taxi", "cabs in Tarneit"]
  },
  {
    id: "caroline-springs",
    name: "Caroline Springs, Burnside & Taylors Hill",
    region: "Western Suburbs & Regional",
    postcode: "VIC 3023",
    metaTitle: "Taxi in Caroline Springs & Burnside | Lake Caroline Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Caroline Springs VIC 3023. 24/7 fast dispatch for Lake Caroline, CS Square & 20-min Melbourne Airport transfers. Call 0435 304 821.",
    tagline: "Lakeside dining, shopping, and Western Highway express airport transfers.",
    heroSummary: [
      "Caroline Springs is a prestigious western suburb built around scenic Lake Caroline, featuring CS Square shopping centre, Lakeview hotel dining, quality schools, and quick connections to the Western Freeway.",
      "Melbourne Taxis provides local shopping rides, city entertainment transfers, and super-convenient 20-25 minute trips to Melbourne Airport."
    ],
    keyHighlights: [
      "Lake Caroline & Lakeview Hotel",
      "CS Square Shopping Centre",
      "Caroline Springs Railway Station",
      "Western Freeway (M8) Access",
      "Burnside Shopping Hub"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "22 km", time: "20–28 min", approxFare: "$55 – $72" },
      { to: "Melbourne CBD", dist: "24 km", time: "28–38 min", approxFare: "$60 – $80" },
      { to: "Watergardens Town Centre", dist: "8 km", time: "10–14 min", approxFare: "$25 – $35" }
    ],
    faqs: [
      { q: "How long is the trip from Caroline Springs to Melbourne Airport?", a: "Only 20 to 28 minutes via the Western Ring Road or Robinsons Rd." }
    ],
    keywords: ["taxi in Caroline Springs", "Caroline Springs taxi", "CS Square cab", "Lake Caroline taxi", "Caroline Springs to airport taxi", "Burnside cab", "cabs in Caroline Springs"]
  },
  {
    id: "melton",
    name: "Melton, Melton South & Kurunjang",
    region: "Western Suburbs & Regional",
    postcode: "VIC 3337",
    metaTitle: "Taxi in Melton, Melton South & Kurunjang | Woodgrove Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Melton VIC 3337. 24/7 service covering Melton South, Melton West, Kurunjang, Woodgrove Shopping & Airport. Call 0435 304 821.",
    tagline: "Comprehensive western corridor transport for Melton's growing estates.",
    heroSummary: [
      "Melton is a vibrant city in Melbourne's outer west, encompassing Melton South, Melton West, Kurunjang, and Cobblebank. Key hubs include Woodgrove Shopping Centre, Melton Town Centre, Tabcorp Park, and Melton Railway Station.",
      "Melbourne Taxis delivers reliable local runs, medical appointments, night returns from Melbourne CBD, and fast fixed-rate airport transfers to Tullamarine."
    ],
    keyHighlights: [
      "Woodgrove Shopping Centre",
      "Tabcorp Park Harness Racing & Hotel",
      "Melton Railway Station Junction",
      "Melton Waves Leisure Centre",
      "Melton Valley Golf Club"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "42 km", time: "35–45 min", approxFare: "$95 – $120" },
      { to: "Melbourne CBD", dist: "44 km", time: "40–55 min", approxFare: "$100 – $130" },
      { to: "Bacchus Marsh", dist: "15 km", time: "14–18 min", approxFare: "$35 – $48" },
      { to: "Rockbank Station", dist: "10 km", time: "10–14 min", approxFare: "$25 – $35" }
    ],
    faqs: [
      { q: "Do you service all Melton suburbs including Melton South and Melton West?", a: "Yes, our fleet covers every street and estate across the entire City of Melton 24/7." }
    ],
    keywords: ["taxi in Melton", "Melton taxi", "taxi in Melton South", "taxi in Melton West", "Woodgrove shopping centre cab", "Melton South taxi", "Melton West taxi", "Melton to Melbourne airport", "cabs in Melton"]
  },
  {
    id: "rockbank-aintree",
    name: "Rockbank, Aintree & Thornhill Park",
    region: "Western Suburbs & Regional",
    postcode: "VIC 3335",
    metaTitle: "Taxi in Rockbank, Aintree & Thornhill Park | Woodlea Cabs | Melbourne Taxis",
    metaDesc: "Need a taxi in Rockbank & Aintree VIC 3335? 24/7 service for Woodlea Town Centre, Rockbank Station, Western Hwy & Airport. Call 0435 304 821.",
    tagline: "Woodlea master-planned estate, Western Freeway express, and fast airport transfers.",
    heroSummary: [
      "Rockbank, Aintree, and Thornhill Park represent the premier master-planned growth communities of Melbourne's west, anchored by Woodlea Town Centre, modern sports precincts, and upgraded V/Line rail connectivity.",
      "Melbourne Taxis provides reliable doorstep pickups for daily city commuters, school runs, and direct Tullamarine Airport journeys."
    ],
    keyHighlights: [
      "Woodlea Town Centre & Dining Hub",
      "Rockbank Railway Station",
      "Thornhill Park Residential Estate",
      "Western Freeway (M8) Corridor",
      "Aintree Walk & Bacchus Marsh Grammar Woodlea"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "32 km", time: "28–36 min", approxFare: "$75 – $95" },
      { to: "Melbourne CBD", dist: "35 km", time: "35–48 min", approxFare: "$85 – $110" },
      { to: "Melton Town Centre", dist: "10 km", time: "10–14 min", approxFare: "$25 – $35" }
    ],
    faqs: [
      { q: "Can I book a taxi for early morning airport departure in Aintree/Woodlea?", a: "Yes, we specialize in 4 AM to 6 AM airport runs with guaranteed driver punctuality." }
    ],
    keywords: ["taxi in Rockbank", "Rockbank taxi", "taxi in Aintree", "Aintree cab", "Woodlea taxi", "Thornhill Park cab", "Rockbank to Melbourne airport", "cabs in Rockbank"]
  },
  {
    id: "fraser-rise-plumpton",
    name: "Fraser Rise, Plumpton & Deanside",
    region: "Western Suburbs & Regional",
    postcode: "VIC 3336",
    metaTitle: "Taxi in Fraser Rise, Plumpton & Deanside | 24/7 Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Fraser Rise & Plumpton VIC 3336. 24/7 service for Taylors Rd, Watergardens corridor & Melbourne Airport. Call 0435 304 821.",
    tagline: "Rapid transit across Melton's newest estates, Watergardens corridor, and airport.",
    heroSummary: [
      "Fraser Rise, Plumpton, and Deanside are high-growth suburban corridors situated between Caroline Springs and Melton, offering rapid access to Watergardens Town Centre, Taylors Road, and the Western Freeway.",
      "Melbourne Taxis provides dependable local transport, station shuttles, and quick 22-minute trips to Tullamarine Airport."
    ],
    keyHighlights: [
      "Taylors Road Shopping & Commercial Strip",
      "Watergardens Town Centre (nearby)",
      "Fraser Rise Community Centre & Sports Grounds",
      "Deanside Residential Estates",
      "Melton Highway & Western Freeway Access"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "24 km", time: "22–30 min", approxFare: "$58 – $75" },
      { to: "Melbourne CBD", dist: "28 km", time: "30–42 min", approxFare: "$70 – $90" }
    ],
    faqs: [
      { q: "How quickly can a taxi reach Fraser Rise?", a: "We have active cabs operating across Caroline Springs and Fraser Rise with typical arrival times of 10 to 15 minutes." }
    ],
    keywords: ["taxi in Fraser Rise", "Fraser Rise taxi", "taxi in Plumpton", "Plumpton cab", "taxi in Deanside", "Deanside taxi", "Fraser Rise to airport taxi", "Taylors Road cab", "cabs in Fraser Rise"]
  },
  {
    id: "bacchus-marsh",
    name: "Bacchus Marsh, Darley & Maddingley",
    region: "Western Suburbs & Regional",
    postcode: "VIC 3340",
    metaTitle: "Taxi in Bacchus Marsh, Darley & Maddingley | 24/7 Cabs | Melbourne Taxis",
    metaDesc: "Book a taxi in Bacchus Marsh VIC 3340. 24/7 service covering Darley, Maddingley, Eynesbury, Ballan & Melbourne Airport transfers. Call 0435 304 821.",
    tagline: "Historic township transport, Avenue of Honour, and Western Highway express cabs.",
    heroSummary: [
      "Bacchus Marsh is a picturesque township nestled between Melbourne and Ballarat, famous for its Avenue of Honour, fresh fruit orchards, Lerderderg Gorge, and thriving communities in Darley, Maddingley, and Eynesbury.",
      "Melbourne Taxis provides dependable local and long-distance taxi services, school runs, train station links, and guaranteed on-time Melbourne Airport transfers."
    ],
    keyHighlights: [
      "Avenue of Honour & Fruit Orchards",
      "Bacchus Marsh Village & Main Street",
      "Bacchus Marsh Railway Station",
      "Lerderderg Gorge & Werribee Gorge State Parks",
      "Darley & Maddingley Estates"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "55 km", time: "45–55 min", approxFare: "$120 – $145" },
      { to: "Melbourne CBD", dist: "55 km", time: "50–65 min", approxFare: "$125 – $155" },
      { to: "Melton", dist: "15 km", time: "14–18 min", approxFare: "$35 – $48" },
      { to: "Ballan", dist: "18 km", time: "15–20 min", approxFare: "$42 – $55" },
      { to: "Ballarat Central", dist: "58 km", time: "45–55 min", approxFare: "$130 – $160" }
    ],
    faqs: [
      { q: "Can I book an airport taxi from Bacchus Marsh for early morning departures?", a: "Yes, we specialize in 3 AM to 6 AM departures with guaranteed on-time arrival and flight tracking." }
    ],
    keywords: ["taxi in Bacchus Marsh", "Bacchus Marsh taxi", "taxi in Darley", "Darley cab", "taxi in Maddingley", "Maddingley taxi", "Eynesbury taxi", "Bacchus Marsh to Melbourne airport", "cabs in Bacchus Marsh"]
  },
  {
    id: "geelong-avalon",
    name: "Geelong & Avalon Airport",
    region: "Western Suburbs & Regional",
    postcode: "VIC 3220",
    metaTitle: "Taxi in Geelong & Avalon Airport | Direct Transfers | Melbourne Taxis",
    metaDesc: "Book a taxi in Geelong & Avalon Airport VIC 3220. 24/7 direct transfers to Melbourne CBD, Tullamarine Airport & regional Victoria. Call 0435 304 821.",
    tagline: "Direct airport transfers connecting Victoria's second city with Greater Melbourne.",
    heroSummary: [
      "Geelong is Victoria's booming waterfront city, home to GMHBA Stadium (Kardinia Park), Deakin University, and Avalon Airport (AVV) — Melbourne's second international aviation gateway.",
      "Melbourne Taxis provides direct, reliable transfers between Geelong, Avalon Airport, Melbourne CBD, and Melbourne Airport (Tullamarine) without train delays or bus hassles."
    ],
    keyHighlights: [
      "Avalon Airport (AVV) Passenger Terminal",
      "Geelong Waterfront & Eastern Beach",
      "GMHBA Stadium (Kardinia Park)",
      "Deakin University Waurn Ponds & Waterfront",
      "Princes Freeway (M1) Express Route"
    ],
    popularRoutes: [
      { to: "Avalon Airport (from Geelong)", dist: "22 km", time: "20–25 min", approxFare: "$55 – $70" },
      { to: "Melbourne CBD", dist: "75 km", time: "60–75 min", approxFare: "$165 – $200" },
      { to: "Melbourne Airport (Tullamarine)", dist: "85 km", time: "65–80 min", approxFare: "$185 – $225" },
      { to: "Torquay & Great Ocean Road", dist: "22 km", time: "20–28 min", approxFare: "$55 – $75" }
    ],
    faqs: [
      { q: "Do you offer direct transfers from Melbourne to Avalon Airport?", a: "Yes, we provide fixed price transfers from anywhere in Melbourne directly to Avalon Airport." }
    ],
    keywords: ["taxi in Geelong", "Geelong taxi", "taxi in Avalon Airport", "Avalon airport cab", "taxi Melbourne to Avalon airport", "Geelong to Tullamarine airport", "Kardinia Park taxi", "cabs in Geelong"]
  },
  {
    id: "williamstown-altona",
    name: "Williamstown, Newport & Altona",
    region: "Western Suburbs & Regional",
    postcode: "VIC 3016",
    metaTitle: "Taxi in Williamstown, Newport & Altona | Bayside Cabs | Melbourne Taxis",
    metaDesc: "Need a taxi in Williamstown & Altona VIC 3016? 24/7 service for Nelson Place dining, Williamstown Beach, Altona Pier & Airport. Call 0435 304 821.",
    tagline: "Historic maritime charm, Williamstown Beach, and West Gate Freeway city connections.",
    heroSummary: [
      "Williamstown, Newport, and Altona offer a premier maritime lifestyle along Hobsons Bay, featuring historic Nelson Place restaurants, gem beaches, Altona Pier, and rapid West Gate Freeway access into the CBD.",
      "Melbourne Taxis delivers 24/7 taxi transport, Silver Service chauffeur rides, and direct airport transfers to Tullamarine."
    ],
    keyHighlights: [
      "Nelson Place Historic Maritime Dining",
      "Williamstown Beach & Lifesaving Club",
      "Altona Pier & Esplanade Waterfront",
      "Newport Railway Workshops & Station",
      "West Gate Freeway City Gateway"
    ],
    popularRoutes: [
      { to: "Melbourne Airport (Tullamarine)", dist: "26 km", time: "25–35 min", approxFare: "$65 – $85" },
      { to: "Melbourne CBD", dist: "14 km", time: "18–26 min", approxFare: "$38 – $50" },
      { to: "Avalon Airport", dist: "45 km", time: "35–45 min", approxFare: "$105 – $130" }
    ],
    faqs: [
      { q: "How long does a taxi take from Williamstown to Melbourne Airport?", a: "Typically 25 to 35 minutes via the West Gate Freeway and CityLink." }
    ],
    keywords: ["taxi in Williamstown", "Williamstown taxi", "taxi in Altona", "Altona cab", "Newport taxi", "Nelson Place cab", "Williamstown to airport taxi", "cabs in Williamstown"]
  }
];

export function getSuburbById(id: string): SuburbInfo | undefined {
  return SUBURBS_DATA.find((s) => s.id === id);
}
