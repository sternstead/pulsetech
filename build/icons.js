/* ============================================================
   ICONS & ILLUSTRATIONS
   All inline SVG — no icon-font, no sprite request, no library.
   Appliance drawings are line diagrams drawn for this site.
   They are deliberately diagrammatic so nobody mistakes them
   for photographs of the client's actual work.
   ============================================================ */

const s = (inner, box = 48, extra = "") =>
  `<svg viewBox="0 0 ${box} ${box}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${inner}</svg>`;

/* ---------- Appliance line diagrams (48 x 48) ---------- */
const appliance = {
  fridge: s(`
    <rect x="13" y="5" width="22" height="38" rx="2.5"/>
    <path d="M13 19h22"/>
    <path d="M30 11v5"/><path d="M30 23v6"/>
    <path d="M17 43v2"/><path d="M31 43v2"/>`),

  freezer: s(`
    <rect x="6" y="14" width="36" height="24" rx="2.5"/>
    <path d="M6 20h36"/>
    <path d="M20 17h8"/>
    <path d="M13 26v7M20 24v9M27 26v7M34 28v5"/>
    <path d="M10 38v3M38 38v3"/>`),

  cooker: s(`
    <rect x="7" y="9" width="34" height="32" rx="2.5"/>
    <path d="M7 19h34"/>
    <circle cx="14" cy="14" r="2"/><circle cx="21" cy="14" r="2"/>
    <path d="M28 14h7"/>
    <rect x="13" y="25" width="22" height="11" rx="1.5"/>
    <path d="M17 41v4M31 41v4"/>`),

  washer: s(`
    <rect x="9" y="5" width="30" height="38" rx="2.5"/>
    <circle cx="24" cy="27" r="9"/>
    <circle cx="24" cy="27" r="4"/>
    <path d="M9 14h30"/>
    <circle cx="33" cy="9.5" r="1.6"/>
    <path d="M14 9.5h9"/>`),

  microwave: s(`
    <rect x="4" y="13" width="40" height="22" rx="2.5"/>
    <rect x="8" y="17" width="23" height="14" rx="1.5"/>
    <path d="M36 18v4M36 26v4"/>
    <path d="M12 24h15"/>`),

  tv: s(`
    <rect x="4" y="9" width="40" height="25" rx="2.5"/>
    <path d="M24 34v5"/>
    <path d="M16 39h16"/>
    <path d="M11 16h9"/>`),

  ac: s(`
    <rect x="5" y="11" width="38" height="14" rx="3"/>
    <path d="M10 21h28"/>
    <path d="M15 30c0 3 3 3 3 6M24 30c0 3 3 3 3 6M33 30c0 3 3 3 3 6"/>`),
};

/* ---------- Brand mark ----------
   A dial and a pulse trace: the control you turn, and the
   signal that tells you it's alive again.                */
const brandMark = `<svg viewBox="0 0 40 40" fill="none" aria-hidden="true" class="mark__glyph">
  <rect x="1.5" y="1.5" width="37" height="37" rx="9" fill="#16262F" stroke="#E2451D" stroke-width="1.6"/>
  <circle cx="20" cy="20" r="10.5" stroke="#A9B7BD" stroke-width="1.5"/>
  <path d="M9 20h4.6l2.6-5.4L20 25.6l3-8 2.2 2.4H31" stroke="#E2451D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

/* ---------- UI icons (24 box) ---------- */
const ui = {
  phone: s(`<path d="M6.5 4h4l2 5-2.5 1.5a11 11 0 0 0 5.5 5.5L17 13.5l5 2v4a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4Z"/>`, 24),
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.9.53 3.68 1.45 5.2L2 22.4l5.5-1.6a9.8 9.8 0 0 0 4.54 1.12h.01c5.43 0 9.84-4.4 9.84-9.84C21.89 6.4 17.48 2 12.04 2Zm5.76 13.9c-.24.68-1.4 1.3-1.94 1.35-.5.05-.95.23-3.2-.67-2.7-1.06-4.4-3.8-4.53-3.98-.13-.18-1.08-1.44-1.08-2.75 0-1.3.68-1.95.93-2.21.24-.27.53-.33.7-.33h.5c.16 0 .38-.06.6.46.22.53.76 1.84.83 1.97.07.13.11.29.02.47-.09.18-.13.29-.26.44l-.4.46c-.13.13-.26.28-.11.54.15.27.67 1.1 1.43 1.78.98.87 1.8 1.14 2.07 1.27.26.14.41.11.56-.07.15-.18.64-.75.81-1.01.18-.27.35-.22.59-.13.24.09 1.53.72 1.79.85.26.13.43.2.5.31.06.11.06.63-.18 1.25Z"/></svg>`,
  mail: s(`<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/>`, 24),
  pin: s(`<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>`, 24),
  clock: s(`<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>`, 24),
  check: s(`<path d="m4.5 12.5 4.6 4.6L19.5 6.7"/>`, 24),
  chevron: s(`<path d="m5 9 7 7 7-7"/>`, 24),
  close: s(`<path d="M6 6 18 18M18 6 6 18"/>`, 24),
  menu: s(`<path d="M3 6h18M3 12h18M3 18h18"/>`, 24),
  calendar: s(`<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>`, 24),
  play: s(`<circle cx="12" cy="12" r="9"/><path d="m10 8.5 6 3.5-6 3.5Z"/>`, 24),
  image: s(`<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m4.5 17 4.8-4.4 4 3.3 2.7-2.3 3.5 3"/>`, 24),
  tools: s(`<path d="M14.5 6.2a4 4 0 0 1 5.3 5.3l-9 9a2.4 2.4 0 0 1-3.4-3.4Z"/><path d="m4.2 8.6 3-3M6.6 4.2l3 3"/>`, 24),
};

/* ---------- Hero illustration ----------
   A sealed-system schematic: the loop that every fridge,
   freezer and air conditioner runs on. Warm side on the
   element hue, cold side on the refrigerant hue.          */
const heroDiagram = `<svg viewBox="0 0 560 420" fill="none" role="img" aria-labelledby="heroDiagramTitle heroDiagramDesc">
  <title id="heroDiagramTitle">Schematic of a sealed refrigeration circuit</title>
  <desc id="heroDiagramDesc">A line diagram showing the four stages of the cooling loop found in fridges, freezers and air conditioners: compressor, condenser, expansion valve and evaporator.</desc>

  <rect x="0" y="0" width="560" height="420" fill="#16262F"/>
  <g stroke="#26404C" stroke-width="1">
    ${Array.from({ length: 13 }, (_, i) => `<path d="M${i * 45 + 10} 0V420"/>`).join("")}
    ${Array.from({ length: 10 }, (_, i) => `<path d="M0 ${i * 45 + 10}H560"/>`).join("")}
  </g>

  <!-- warm side -->
  <g stroke="#E2451D" stroke-width="2.4" fill="none" stroke-linecap="round">
    <path d="M150 120h190"/>
    <path d="M340 120c34 0 34 24 0 24h-190c-34 0-34 24 0 24h190c34 0 34 24 0 24h-190"/>
  </g>
  <!-- cold side -->
  <g stroke="#3FB5C4" stroke-width="2.4" fill="none" stroke-linecap="round">
    <path d="M150 300h190"/>
    <path d="M340 300c34 0 34-24 0-24h-190c-34 0-34-24 0-24h190"/>
  </g>
  <!-- connecting legs -->
  <g stroke="#A9B7BD" stroke-width="2" stroke-linecap="round">
    <path d="M150 192v60"/>
    <path d="M410 168v84"/>
    <path d="M340 120h70v48"/>
    <path d="M340 300h70v-48"/>
  </g>

  <!-- compressor -->
  <circle cx="110" cy="210" r="34" fill="#0D1A21" stroke="#E2451D" stroke-width="2.4"/>
  <path d="M96 210h9l5-11 8 22 5-11h9" stroke="#E2451D" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M150 192H110M110 252h40" stroke="#A9B7BD" stroke-width="2" stroke-linecap="round"/>

  <!-- expansion valve -->
  <path d="M398 198l24 24M422 198l-24 24" stroke="#3FB5C4" stroke-width="2.4" stroke-linecap="round"/>

  <!-- labels -->
  <g fill="#A9B7BD" font-family="Instrument Sans, system-ui, sans-serif" font-size="14">
    <text x="150" y="96">Condenser · sheds heat</text>
    <text x="150" y="342">Evaporator · absorbs heat</text>
    <text x="62" y="272">Compressor</text>
    <text x="368" y="252">Expansion</text>
  </g>
  <g fill="#E2451D" font-family="Instrument Sans, system-ui, sans-serif" font-size="13">
    <text x="452" y="126">warm</text>
  </g>
  <g fill="#3FB5C4" font-family="Instrument Sans, system-ui, sans-serif" font-size="13">
    <text x="452" y="306">cold</text>
  </g>
</svg>`;

/* ---------- Coverage map illustration ----------
   A light schematic of the service region. Not a live map:
   no tiles to download, no script, no layout shift.        */
const coverageMap = `<svg viewBox="0 0 640 460" fill="none" role="img" aria-labelledby="mapTitle mapDesc">
  <title id="mapTitle">Service region diagram</title>
  <desc id="mapDesc">A simplified diagram showing Nairobi County at the centre, with Kiambu County to the north, Kajiado County to the south west, and Machakos County to the south east containing PulseTech's base at Mlolongo.</desc>
  <rect width="640" height="460" fill="#16262F"/>

  <path d="M96 62h300l72 58v92l-58 66H150l-54-62Z" fill="#1E323C" stroke="#3B5663" stroke-width="1.6"/>
  <text x="120" y="102" fill="#A9B7BD" font-family="Instrument Sans, system-ui, sans-serif" font-size="16">Kiambu County</text>

  <path d="M170 168h250l58 62-34 96H196l-52-84Z" fill="#24404D" stroke="#E2451D" stroke-width="2"/>
  <text x="212" y="238" fill="#FFFFFF" font-family="Bricolage Grotesque, system-ui, sans-serif" font-weight="700" font-size="26">Nairobi County</text>
  <text x="212" y="264" fill="#A9B7BD" font-family="Instrument Sans, system-ui, sans-serif" font-size="14">17 sub-counties · home visits</text>

  <path d="M62 236h100l44 90-40 84H92l-46-86Z" fill="#1E323C" stroke="#3B5663" stroke-width="1.6"/>
  <text x="72" y="330" fill="#A9B7BD" font-family="Instrument Sans, system-ui, sans-serif" font-size="16">Kajiado</text>
  <text x="72" y="352" fill="#A9B7BD" font-family="Instrument Sans, system-ui, sans-serif" font-size="16">County</text>

  <path d="M430 300h164v128H392l-30-64Z" fill="#1E323C" stroke="#3B5663" stroke-width="1.6"/>
  <text x="452" y="344" fill="#A9B7BD" font-family="Instrument Sans, system-ui, sans-serif" font-size="16">Machakos County</text>

  <circle cx="452" cy="382" r="9" fill="#E2451D"/>
  <circle cx="452" cy="382" r="17" stroke="#E2451D" stroke-width="1.6" opacity=".55"/>
  <text x="476" y="388" fill="#FFFFFF" font-family="Instrument Sans, system-ui, sans-serif" font-weight="600" font-size="16">Mlolongo — our base</text>

  <path d="M452 382 350 250" stroke="#E2451D" stroke-width="1.6" stroke-dasharray="5 5"/>
</svg>`;

module.exports = { appliance, brandMark, ui, heroDiagram, coverageMap };
