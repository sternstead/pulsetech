/* ============================================================
   PULSETECH — CENTRAL CONTENT DATA
   Single source of truth for the build step AND the runtime.
   Nothing factual should be typed into a template or a page.

   CONFIRMED  = supplied by the client, safe to publish.
   PENDING    = not supplied. Never rendered. Never in schema.
   ============================================================ */

const SITE = {
  // ---- LAUNCH BLOCKER -------------------------------------
  // Replace with the real production domain, then rebuild.
  // Everything (canonical, sitemap, robots, OG, JSON-LD) reads
  // from this one value.
  origin: "https://example.com",
  domainConfirmed: false,
};

const BUSINESS = {
  name: "PulseTech Installation & Repairs",
  shortName: "PulseTech",
  owner: "Kennedy Nyabando Ochanda",
  tagline: "Appliance and electronics repair, Mlolongo to Nairobi",
  description:
    "PulseTech Installation & Repairs fixes fridges, freezers, cookers, ovens, microwaves, washing machines, TVs and air conditioners. Home visits across Nairobi and the surrounding counties, or drop your appliance at our Mlolongo service centre.",

  phone: "+254711702233",
  phoneDisplay: "0711 702 233",
  whatsapp: "254711702233",
  email: "opticahone@gmail.com",

  // GEOGRAPHY — Mlolongo sits in Machakos County, NOT Nairobi County.
  // The old build said "Nairobi Metropolitan Area", which is not a region.
  locality: "Mlolongo",
  region: "Machakos County",
  country: "KE",
  addressDisplay: "Mlolongo, Machakos County",

  hoursOpen: "08:00",
  hoursClose: "17:00",
  hoursDisplay: "8:00 AM – 5:00 PM",
  hoursDaysConfirmed: false, // PENDING: Mon–Sat? Every day? Ask client.

  yearsExperience: 10,
  checkingFee: "KSh 1,000",
  serviceModel: "Home visits and service-centre drop-off",

  // PENDING — do not render, do not put in schema.
  pending: {
    operatingDays: "Which days of the week are you open?",
    warranty: "Do you guarantee repairs, and for how long?",
    responseTime: "How soon can a technician usually reach a customer?",
    brands: "Which appliance brands do you work on?",
    serviceCentreAddress: "Exact street address / building of the Mlolongo service centre",
    instagramHandle: "Your Instagram @handle (only individual post links were supplied)",
    googleBusinessProfile: "Google Business Profile link, once claimed",
    reviews: "Any customer reviews we're permitted to publish, with names",
    logo: "A logo file, if one exists",
    photos: "Photos and videos of your actual repair work",
  },

  social: {
    instagram: "", // PENDING — profile handle not supplied
    facebook: "",
    tiktok: "",
    googleBusinessProfile: "",
  },
};

/* ------------------------------------------------------------
   THERMAL CLASSES
   Used as a real information device, not decoration: the site
   colour-codes a service by what it does with heat. Cold-side
   work (sealed systems, gas, compressors) reads teal; heat-side
   work (elements, thermostats, ignition) reads orange;
   electronics read neutral steel.
   ------------------------------------------------------------ */

const SERVICES = [
  {
    slug: "fridge-repair",
    metaDescription: "Fridge not cooling, leaking or freezing over? PulseTech repairs refrigerators across Nairobi and Mlolongo. KSh 1,000 to diagnose. Call 0711 702 233.",
    name: "Refrigerator & Fridge Repair",
    shortName: "Fridge repair",
    nav: "Refrigerator & fridge repair",
    thermal: "cold",
    weight: "feature", // bento sizing
    icon: "fridge",
    keyword: "fridge repair Nairobi",
    summary:
      "Fridges that stop cooling, freeze everything solid, pool water at the bottom, or run loudly all night.",
    intro:
      "A fridge rarely fails all at once. It cools a little less each week until the milk turns early, and by then the fault has usually spread from one part to another. We diagnose the whole sealed system rather than swapping the first part that looks suspect.",
    symptoms: [
      "Not cooling, or cooling only in the freezer compartment",
      "Freezing food that shouldn't be frozen",
      "Water collecting under the crisper drawers",
      "Ice building up on the back wall",
      "Compressor running constantly, or not starting at all",
      "Loud humming, rattling or clicking",
      "Door seal no longer gripping",
    ],
    repairs: [
      "Thermostats and temperature controls",
      "Compressors and start relays",
      "Condenser and evaporator fans",
      "Blocked or leaking defrost drains",
      "Door gaskets and hinges",
      "Control boards and wiring faults",
    ],
    waMessage: "Hi PulseTech, I need help with my fridge.",
  },
  {
    slug: "freezer-repair",
    metaDescription: "Chest and upright freezer repair in Nairobi and Mlolongo. Poor cooling, heavy icing, tripping power. KSh 1,000 checking fee. Call 0711 702 233.",
    name: "Freezer Repair",
    shortName: "Freezer repair",
    nav: "Freezer repair",
    thermal: "cold",
    weight: "standard",
    icon: "freezer",
    keyword: "freezer repair Nairobi",
    summary:
      "Chest and upright freezers that won't hold temperature, ice over, or trip the power.",
    intro:
      "A freezer holding food for a household or a small business is expensive to get wrong. We work on both chest and upright units, domestic and light commercial, and will tell you honestly when a repair costs more than the freezer is worth.",
    symptoms: [
      "Contents softening or thawing",
      "Thick ice on the walls or around the lid",
      "Running without ever cycling off",
      "Tripping the breaker when switched on",
      "Lid or door no longer sealing",
      "Water leaking onto the floor",
    ],
    repairs: [
      "Thermostats and cold controls",
      "Compressors and start components",
      "Defrost heaters and timers",
      "Lid seals and hinges",
      "Drain and gas-line faults",
    ],
    waMessage: "Hi PulseTech, I need freezer repair.",
  },
  {
    slug: "cooker-repair",
    metaDescription: "Built-in and freestanding cooker and oven repair across Nairobi and Mlolongo. Ignition, elements and controls. KSh 1,000 to diagnose.",
    name: "Cooker & Oven Repair",
    shortName: "Cooker & oven repair",
    nav: "Cooker & oven repair",
    thermal: "heat",
    weight: "feature",
    icon: "cooker",
    keyword: "cooker repair Nairobi",
    summary:
      "Built-in and freestanding cookers and ovens — ignition that won't catch, ovens that won't heat, controls that have stopped responding.",
    intro:
      "We work on both built-in and freestanding cookers, gas and electric. Built-in units usually need to come out of the cabinetry to be worked on properly, and we'll refit them cleanly afterwards.",
    symptoms: [
      "Burners that click but won't light",
      "Oven staying cold, or never reaching temperature",
      "One side of the oven cooking faster than the other",
      "Grill element not glowing",
      "Knobs or the control panel not responding",
      "Oven door not closing flush",
      "A smell of gas around the appliance",
    ],
    repairs: [
      "Ignition systems and spark modules",
      "Gas valves and burner assemblies",
      "Oven elements, upper and lower",
      "Thermostats and thermal cut-outs",
      "Control panels and timers",
      "Door hinges, seals and glass",
    ],
    waMessage: "Hi PulseTech, I need cooker or oven repair.",
    safety:
      "If you can smell gas, close the cylinder or supply valve, open windows, don't switch anything electrical on or off, and call us from outside the room.",
  },
  {
    slug: "washing-machine-repair",
    metaDescription: "Washing machine not spinning, draining or leaking? Repairs across Nairobi and Mlolongo, home or workshop. KSh 1,000 checking fee.",
    name: "Washing Machine Repair",
    shortName: "Washing machine repair",
    nav: "Washing machine repair",
    thermal: "water",
    weight: "feature",
    icon: "washer",
    keyword: "washing machine repair Nairobi",
    summary:
      "Machines that won't spin, won't drain, leak across the floor, or walk out of position mid-cycle.",
    intro:
      "Most washing machine call-outs come down to drainage, bearings, or the door lock. A machine that leaves clothes soaking wet is usually telling you something different from one that leaves a puddle, and the two need different work.",
    symptoms: [
      "Clothes still soaking at the end of a cycle",
      "Drum not spinning, or spinning only slowly",
      "Water not draining out",
      "Leaking from underneath or around the door",
      "Loud banging or grinding on spin",
      "Machine moving across the floor",
      "Door locked shut with the load inside",
      "Cycle stopping partway and holding",
    ],
    repairs: [
      "Drain pumps and blocked filters",
      "Drive belts and motors",
      "Drum bearings and shock absorbers",
      "Door locks and interlocks",
      "Inlet valves and hoses",
      "Control boards and programme selectors",
    ],
    waMessage: "Hi PulseTech, I need washing machine repair.",
  },
  {
    slug: "microwave-repair",
    metaDescription: "Microwave not heating, not starting or sparking? PulseTech repairs microwaves in Nairobi and Mlolongo. KSh 1,000 to diagnose.",
    name: "Microwave Repair",
    shortName: "Microwave repair",
    nav: "Microwave repair",
    thermal: "heat",
    weight: "standard",
    icon: "microwave",
    keyword: "microwave repair Nairobi",
    summary:
      "Microwaves that run but don't heat, won't start, spark inside, or trip the power.",
    intro:
      "A microwave that turns but doesn't heat has a different fault from one that won't start at all. Microwaves store a serious electrical charge even when unplugged, so this is not an appliance to open at home.",
    symptoms: [
      "Turntable spinning but food staying cold",
      "Nothing happening when you press start",
      "Sparking or arcing inside the cavity",
      "Loud buzzing during a cycle",
      "Tripping the power when switched on",
      "Door not latching properly",
    ],
    repairs: [
      "Magnetrons and high-voltage components",
      "Door switches and interlocks",
      "Turntable motors and couplings",
      "Control panels and membrane keypads",
      "Internal fuses and diodes",
    ],
    waMessage: "Hi PulseTech, I need microwave repair.",
    safety:
      "Microwave capacitors hold a dangerous charge long after the plug is pulled. Please don't open the casing — bring it in or book a technician.",
  },
  {
    slug: "tv-repair",
    metaDescription: "TV repair in Nairobi and Mlolongo. No picture, no sound, screen lines or no power. Bench work at our service centre. KSh 1,000 to diagnose.",
    name: "TV Repair",
    shortName: "TV repair",
    nav: "TV repair",
    thermal: "electronic",
    weight: "standard",
    icon: "tv",
    keyword: "TV repair Nairobi",
    summary:
      "TVs with no picture, no sound, lines across the screen, or no sign of power at all.",
    intro:
      "Television faults split fairly cleanly between power supply, backlight, and panel. The first two are usually worth repairing. We'll tell you before you spend anything if yours is the third.",
    symptoms: [
      "No power, or a standby light that won't come on",
      "Sound but no picture",
      "Picture but no sound",
      "Lines, bands or blotches across the display",
      "Screen dark but faintly visible in bright light",
      "Switching itself off after a few minutes",
      "HDMI ports not registering a signal",
    ],
    repairs: [
      "Power supply boards",
      "Backlight strips and drivers",
      "Mainboards and input stages",
      "Speakers and audio output",
      "Wall-mount fitting and setup",
    ],
    waMessage: "Hi PulseTech, I need TV repair.",
  },
  {
    slug: "air-conditioner-repair",
    metaDescription: "Air conditioner repair and servicing across Nairobi and Mlolongo. Not cooling, leaking or noisy. KSh 1,000 checking fee.",
    name: "Air Conditioner Repair",
    shortName: "Air conditioner repair",
    nav: "Air conditioner repair",
    thermal: "cold",
    weight: "standard",
    icon: "ac",
    keyword: "air conditioner repair Nairobi",
    summary:
      "Air conditioners blowing warm, dripping indoors, running noisily, or short-cycling.",
    intro:
      "An air conditioner that has quietly lost gas will keep running and keep costing you electricity while cooling almost nothing. Servicing catches that before the compressor takes the strain.",
    symptoms: [
      "Blowing air that isn't cold",
      "Water dripping from the indoor unit",
      "Ice forming on the pipework",
      "Rattling or grinding from the outdoor unit",
      "Switching on and off every few minutes",
      "A musty smell when it starts up",
      "Remote or controls not responding",
    ],
    repairs: [
      "Servicing, cleaning and filter work",
      "Refrigerant leaks and recharging",
      "Compressors and capacitors",
      "Fan motors, indoor and outdoor",
      "Blocked condensate drains",
      "Control boards and sensors",
      "Installation and relocation",
    ],
    waMessage: "Hi PulseTech, I need air conditioner repair.",
  },
];

/* ------------------------------------------------------------
   PROCESS — a genuine sequence, so numbering is warranted.
   ------------------------------------------------------------ */
const PROCESS = [
  {
    title: "You get in touch",
    body: "Call or WhatsApp with the appliance, the brand if you know it, and what it's doing. A short description saves a wasted visit.",
  },
  {
    title: "We look at it",
    body: "A technician comes to you, or you bring the appliance to the Mlolongo service centre. Diagnosis costs KSh 1,000.",
  },
  {
    title: "You get a price",
    body: "We tell you what's wrong, what it costs to fix, and whether it's worth fixing. Nothing goes ahead until you say so.",
  },
  {
    title: "We do the work",
    body: "On site where the job allows, back at the workshop where it needs a bench and parts.",
  },
  {
    title: "We test it with you",
    body: "The appliance runs before we leave, so you see it working rather than taking our word for it.",
  },
];

/* ------------------------------------------------------------
   GEOGRAPHY
   Mlolongo is the base (Machakos County). Nairobi is the main
   market. Neighbouring counties are stated as regions, without
   claiming specific estates we can't confirm. No per-location
   doorway pages are generated — one strong coverage page only.
   ------------------------------------------------------------ */
const NAIROBI_SUBCOUNTIES = [
  "Westlands", "Dagoretti North", "Dagoretti South", "Lang'ata", "Kibra",
  "Roysambu", "Kasarani", "Ruaraka", "Embakasi North", "Embakasi South",
  "Embakasi Central", "Embakasi East", "Embakasi West", "Makadara",
  "Kamukunji", "Starehe", "Mathare",
];

const COVERAGE = [
  {
    name: "Mlolongo",
    role: "Base",
    county: "Machakos County",
    body: "Where our service centre is. Drop an appliance off, or book a technician for the same area.",
    confirmed: true,
  },
  {
    name: "Nairobi County",
    role: "Main service area",
    county: "All 17 sub-counties",
    body: "Home-visit repairs across the city. Mombasa Road gives us a direct run into the eastern and southern sub-counties.",
    confirmed: true,
    subAreas: NAIROBI_SUBCOUNTIES,
  },
  {
    name: "Machakos County",
    role: "Neighbouring county",
    county: "Home county",
    body: "Beyond Mlolongo, we cover parts of Machakos County. Send us your location and we'll confirm before you book.",
    confirmed: true,
  },
  {
    name: "Kajiado County",
    role: "Neighbouring county",
    county: "South and west of Nairobi",
    body: "Reachable for home visits. Coverage depends on distance — message us with the area and we'll tell you straight away.",
    confirmed: true,
  },
  {
    name: "Kiambu County",
    role: "Neighbouring county",
    county: "North of Nairobi",
    body: "Reachable for home visits. Coverage depends on distance — message us with the area and we'll tell you straight away.",
    confirmed: true,
  },
];

/* ------------------------------------------------------------
   FAQ — only `confirmed: true` items render or enter schema.
   The previous build published three literal placeholders.
   ------------------------------------------------------------ */
const FAQS = [
  {
    q: "What does the checking fee cover?",
    a: "KSh 1,000 covers a technician diagnosing the fault, whether at your home or at our service centre. You then get a repair price and decide whether to go ahead.",
    confirmed: true,
  },
  {
    q: "Do you come to me, or do I bring the appliance in?",
    a: "Either. We do home visits across Nairobi and the surrounding counties, and we have a service centre in Mlolongo you can drop an appliance at. Bench work like TV boards is usually faster at the workshop.",
    confirmed: true,
  },
  {
    q: "What appliances do you repair?",
    a: "Fridges, freezers, cookers and ovens (built-in and freestanding), microwaves, washing machines, TVs and air conditioners.",
    confirmed: true,
  },
  {
    q: "Do you repair built-in cookers and ovens?",
    a: "Yes. Built-in units normally need to come out of the cabinetry to be worked on properly, and we refit them afterwards.",
    confirmed: true,
  },
  {
    q: "Which areas do you cover?",
    a: "We're based in Mlolongo and work across Nairobi, with home visits into Machakos, Kajiado and Kiambu counties. If you're not sure about your area, message us and we'll confirm before you book.",
    confirmed: true,
  },
  {
    q: "What are your hours?",
    a: "8:00 AM to 5:00 PM.",
    confirmed: true,
  },
  {
    q: "How do I book a technician?",
    a: "WhatsApp or call 0711 702 233, or send the enquiry form on the contact page. Tell us the appliance, the fault and your area.",
    confirmed: true,
  },
  // ---- PENDING: withheld from the page and from FAQPage schema ----
  { q: "How quickly can a technician come out?", a: "", confirmed: false, needs: "responseTime" },
  { q: "Do you guarantee your repairs?", a: "", confirmed: false, needs: "warranty" },
  { q: "Which brands do you repair?", a: "", confirmed: false, needs: "brands" },
];

/* ------------------------------------------------------------
   CLIENT WORK — real Instagram links supplied by the client.
   De-duplicated from 11 lines down to 8 unique posts.
   No captions are invented: we do not know which appliance each
   post shows, so each is labelled neutrally until the client
   confirms, or until the media itself is supplied.
   ------------------------------------------------------------ */
const WORK_LINKS = [
  { url: "https://www.instagram.com/p/C4OB4Q1MOpb/", type: "post" },
  { url: "https://www.instagram.com/reel/C-_NOlpSRME/", type: "reel" },
  { url: "https://www.instagram.com/p/C_GPcG9MLX8/", type: "post" },
  { url: "https://www.instagram.com/p/C_GJYBZsSwg/", type: "post" },
  { url: "https://www.instagram.com/p/C-_MNfHMfT1/", type: "post" },
  { url: "https://www.instagram.com/p/C_k71LXMyki/", type: "post" },
  { url: "https://www.instagram.com/p/C_KRPzhKZ36/", type: "post" },
  { url: "https://www.instagram.com/p/C-_KF_Psl98/", type: "post" },
];

/* ------------------------------------------------------------
   MEDIA REGISTRY — REAL CLIENT ASSETS
   Supplied by the client, optimised by build/optimize_media.py.
   `stem` + width produces the filename; the build emits a
   <picture> with a WebP srcset and a JPEG fallback.
   ------------------------------------------------------------ */
const MEDIA = {
  heroPhoto: {
    stem: "/images/hero/pulsetech-technician-cooker-repair-nairobi",
    widths: [420, 640, 860, 1080], fallback: 1080, w: 1080, h: 1210,
    alt: "A PulseTech technician rewiring the burner assembly of a freestanding gas cooker during a home repair",
    page: "home", section: "hero", fold: "above",
  },
  cookerPhoto: {
    stem: "/images/services/pulsetech-cooker-burner-wiring-repair",
    widths: [420, 640, 860, 1080], fallback: 1080, w: 1080, h: 1210,
    alt: "Close view of a cooker's burner assembly with the wiring loom exposed, being tested with pliers",
    page: "/services/cooker-repair/", section: "hero", fold: "above",
  },
  ogDefault: {
    file: "/images/og/pulsetech-share-card.jpg", w: 1200, h: 630,
    alt: "PulseTech technician repairing a cooker, with the business name and service area",
    page: "all", section: "social meta", fold: "n/a",
  },
  washerPhoto: {
    stem: "/images/services/pulsetech-washing-machine-drum-door-repair",
    widths: [420, 560, 720], fallback: 720, w: 720, h: 720,
    alt: "A front-loading washing machine stripped down, with the door seal and drum assembly removed",
    page: "/services/washing-machine-repair/", section: "hero", fold: "above",
  },
};

/* GALLERY — the work section and lightbox.
   Every item is a real job photographed by the business, paired
   with the Instagram post it was published in.                  */
const GALLERY = [
  {
    stem: "/images/hero/pulsetech-technician-cooker-repair-nairobi",
    widths: [420, 640, 860], fallback: 1080, w: 1080, h: 1210,
    alt: "A PulseTech technician rewiring the burner assembly of a freestanding gas cooker",
    caption: "Rewiring a freestanding cooker's burner assembly in a customer's kitchen.",
    appliance: "Cooker", thermal: "heat",
    post: "https://www.instagram.com/p/C_k71LXMyki/",
  },
  {
    stem: "/images/services/pulsetech-cooker-burner-wiring-repair",
    widths: [420, 640, 860], fallback: 1080, w: 1080, h: 1210,
    alt: "Close view of a cooker's burner assembly with the wiring loom exposed",
    caption: "The same cooker, closer in. Every burner connection checked before the top goes back on.",
    appliance: "Cooker", thermal: "heat",
    post: "https://www.instagram.com/p/C_k71LXMyki/",
  },
  {
    stem: "/images/services/pulsetech-washing-machine-drum-door-repair",
    widths: [420, 560, 720], fallback: 720, w: 720, h: 720,
    alt: "A front-loading washing machine stripped down with the door seal and drum assembly removed",
    caption: "Front-loader opened up on site, door seal and drum assembly out.",
    appliance: "Washing machine", thermal: "water",
    post: "https://www.instagram.com/p/C4OB4Q1MOpb/",
  },
  {
    stem: "/images/work/pulsetech-washing-machine-control-board",
    widths: [420, 560, 720], fallback: 720, w: 720, h: 720,
    alt: "A washing machine control board removed from the machine, circuitry and display visible",
    caption: "Control board out for testing. Boards like this are usually repairable, not scrap.",
    appliance: "Washing machine", thermal: "electronic",
    post: "https://www.instagram.com/p/C_GJYBZsSwg/",
  },
  {
    stem: "/images/work/pulsetech-washing-machine-internals",
    widths: [420, 560, 720], fallback: 720, w: 720, h: 720,
    alt: "A washing machine with the top panel removed, showing the internal wiring, detergent drawer and drum",
    caption: "Top off, wiring loom and detergent housing exposed for a leak trace.",
    appliance: "Washing machine", thermal: "water",
    post: "https://www.instagram.com/p/C-_MNfHMfT1/",
  },
  {
    stem: "/images/work/pulsetech-washing-machine-drum-removed",
    widths: [420, 560, 720], fallback: 720, w: 720, h: 720,
    alt: "A stainless steel washing machine drum removed from its cabinet and standing on the workshop floor",
    caption: "Stainless drum out of the cabinet — the point at which a bearing job gets real.",
    appliance: "Washing machine", thermal: "water",
    post: "https://www.instagram.com/p/C-_KF_Psl98/",
  },
];

/* VIDEO — a repaired gas hob under test. Short, silent, looping. */
const VIDEO = {
  mp4: "/videos/work/pulsetech-gas-hob-tested-after-repair.mp4",
  poster: "/videos/work/pulsetech-gas-hob-tested-after-repair-poster.webp",
  w: 360, h: 360, duration: 1.5,
  caption: "A repaired gas hob under test — all three burners lighting clean and blue.",
  alt: "Three gas burners lit with steady blue flames on a repaired cooker hob",
  post: "https://www.instagram.com/p/C_KRPzhKZ36/",
};

/* Posts with no photograph supplied yet — still linked, not faked. */
const WORK_LINKS_ONLY = [
  "https://www.instagram.com/reel/C-_NOlpSRME/",
  "https://www.instagram.com/p/C_GPcG9MLX8/",
];

const BLOG = [
  {
    slug: "fridge-not-cooling",
    title: "Your fridge isn't cooling: what to check before you call",
    description:
      "Four things worth checking yourself when a fridge stops cooling, and the point at which it needs a technician.",
    date: "2026-02-14",
    service: "fridge-repair",
    lede: "A fridge that has stopped cooling isn't always a broken fridge. A few of the causes are things you can check in ten minutes, and it's worth ruling those out before anyone charges you a checking fee.",
    sections: [
      {
        h: "Start with airflow",
        p: "A fridge cools by moving cold air around, and a packed fridge blocks that. If the vents at the back of the compartment are covered by containers, the air can't circulate and the front of the fridge stays warm while the back freezes. Pull things away from the vents and give it a few hours.",
      },
      {
        h: "Check the condenser coils",
        p: "The coils at the back or underneath shed heat. When they're furred with dust, the fridge can't dump that heat and cooling drops off. Unplug it, brush the coils clean, and leave a hand's width of clearance behind the unit.",
      },
      {
        h: "Look at the door seal",
        p: "Close the door on a sheet of paper. If it slides out with no resistance, the gasket has lost its grip and warm air is leaking in continuously. Seals perish with age and are a straightforward replacement.",
      },
      {
        h: "Listen to the compressor",
        p: "You should hear a low hum that cycles on and off. Silence, or a click every few minutes followed by nothing, points at the compressor, its start relay, or the thermostat. That's where home checks stop.",
      },
      {
        h: "When to call",
        p: "If airflow, coils and seal are all fine and the fridge still won't hold temperature, the fault is in the sealed system or the electrics. Ice on the back wall, water under the drawers, or a compressor that never starts all need a technician.",
      },
    ],
  },
  {
    slug: "washing-machine-not-spinning",
    title: "Washing machine not spinning: reading the symptom",
    description:
      "Clothes soaking wet at the end of a cycle usually means one of four things. Here's how to tell which.",
    date: "2026-03-02",
    service: "washing-machine-repair",
    lede: "A machine that won't spin is one of the most common call-outs we get, and the detail that matters most is what the machine does instead of spinning.",
    sections: [
      {
        h: "If the water is still in the drum",
        p: "The problem is drainage, not spinning. Most machines refuse to spin until they've drained. Check the filter behind the small door at the front — coins, clips and lint collect there — and make sure the drain hose isn't kinked or pushed too far into the standpipe.",
      },
      {
        h: "If it drains but the drum won't turn",
        p: "Suspect the drive belt or the motor. A slipped or snapped belt lets the drum spin freely by hand with no resistance at all. Motor brushes wear down over years of use and are a routine replacement on older machines.",
      },
      {
        h: "If the load is unbalanced",
        p: "A single heavy item, a duvet or a rug, throws the drum off balance and the machine will abandon the spin to protect its bearings. Redistribute the load and try again. If it happens with every load, the shock absorbers may be worn.",
      },
      {
        h: "If the door won't unlock",
        p: "A failed door interlock stops the cycle entirely, because the machine can't confirm the door is shut. It's a common failure and an inexpensive part.",
      },
      {
        h: "What the noise tells you",
        p: "Grinding or a rumble that rises with spin speed usually means drum bearings. That's a bigger job, and on an older machine it's worth asking whether the repair is worth the cost before committing. We'll tell you honestly either way.",
      },
    ],
  },
];

module.exports = {
  SITE, BUSINESS, SERVICES, PROCESS, COVERAGE, NAIROBI_SUBCOUNTIES,
  FAQS, WORK_LINKS, WORK_LINKS_ONLY, MEDIA, GALLERY, VIDEO, BLOG,
};
