# Jolty — Roadside Assistance Marketplace (India)

> **"Har Safar Mein Saath"** • Day or night, emergency roadside assistance across Indian national highways, expressways, and urban transit corridors.

[![Live Prototype](https://img.shields.io/badge/Prototype-Live-success?style=flat-square&logo=google-chrome&logoColor=white)](http://127.0.0.1:8000)
[![Design System](https://img.shields.io/badge/Design%20System-Google%20Stitch-amber?style=flat-square)](https://github.com/Arbind-codes/Jolty)
[![Architecture](https://img.shields.io/badge/Architecture-3--Layer%20Deterministic-blue?style=flat-square)](./directives)

Jolty is a mobile-first roadside assistance marketplace built specifically for the unpredictable realities of Indian highway transit. It connects stranded motorists directly to verified, grassroots local mechanics within minutes—especially during high-stress 2:00 AM emergency breakdowns when commercial garages are shuttered.

---

## ⚡ Core Problem & Value Proposition

A highway breakdown leaves drivers stranded in vulnerable, pitch-black environments with uncertainty about who to call, whether anyone is open, and fear of predatory midnight extortion.

Jolty solves this with:
1. **24/7 Verified Dispatch**: Pre-screened local garages and mobile patrol units ready for rapid highway callouts.
2. **Transparent Platform Fee**: A fixed, upfront **Jolty Platform Fee (₹149)** covering dispatch, live GPS tracking, and phone assistance.
3. **Unmistakable Pricing Clarity**: **Repair prices are not included in the Jolty fee.** Diagnosis and repair charges are itemized and agreed upon directly with the mechanic on-site.
4. **Resilient Location Detection**: Single-click browser GPS reverse-geocoding, highway landmark presets (toll plazas, milestone stones), and manual correction.

---

## 🎨 Design System & Visual Identity

The interface was rebuilt from scratch following **Google Stitch Project `9279876243502578812`** and [design.md](./docs/brief/design.md), adhering to anti-slop frontend design principles:

### Color Palette (Warm Utility Minimalism)
* **Canvas (`#FAF7F0` / `jolty-cream`)**: Natural warm canvas surface reducing glare in direct sun or dark roadside conditions.
* **Operational Core (`#FFB800` / `jolty-amber`)**: High-visibility saffron-amber beacon for primary interactive triggers and live map pins.
* **Structure & Text (`#111315` / `jolty-ink`)**: High-contrast near-black typography and secondary buttons.
* **Night Shift (`#101820` / `jolty-night` & `#080A0C` / `jolty-black`)**: Deep midnight scrims for nocturnal rescue cards.
* **Reassurance (`#16834A` / `jolty-green`)**: Verification badges, live patrol radars, and ETA confirmations.
* **Borders (`#E8E3DA` / `jolty-line`)**: Hairline structure replacing heavy drop-shadows.

### Typography & Iconography
* **Font Family**: `DM Sans` (Google Fonts) with tight display tracking (`-0.02em` to `-0.03em`) on headlines for operational urgency.
* **Iconography**: Google `Material Symbols Outlined` configured for crisp geometric harmony.
* **Vernacular Details**: Authentic Indian Tata truck line sketches (*"Desh Ki Sadak, Desh Ka Saath"*), milestone tags (*NH-48 • KM 42*), and emergency SOS hotlines (`1800-JOLTY-24`).

---

## 📱 Rebuilt Pages & Interactive Flows

```
[ Landing / Discovery ] ──> [ Nearby Mechanics ] ──> [ Booking Drawer ] ──> [ Live Tracker ]
        │                            ▲                      │
        └─── Set Location Modal ─────┴──────────────────────┘
        │
        └─── [ Login / Phone OTP ]
```

### 1. Landing & Service Discovery (`#home`)
* **Hero Section**: Golden-hour roadside assistance visual with live 24/7 availability ping badge.
* **Synchronized Location Input**: Displays current confirmed breakdown spot with one-tap browser GPS auto-detect.
* **Emergency Service Shortcuts**: Direct dispatch categories (General Repair, Flat Tyre, Battery Jumpstart, Towing Service).
* **Live Tracking Preview**: Real-time card showing active patrol unit *Suresh Kumar* en route.
* **Value Pillars & 3-Step Flow**: "Set location → Choose mechanic → Get back on the road".
* **Day vs Night Split Panels**: Daytime transit vs emergency 2:00 AM shift.

### 2. Nearby Mechanics Directory (`#mechanics`)
* **Live Radar Hero**: Displays active emergency patrol status.
* **Current Breakdown Spot Bar**: Synchronized location display with a "Change" action triggering the address modal.
* **List vs Map View**: Segmented tab control allowing toggling between cards list and an interactive highway map canvas.
* **Dynamic Category Filtering**: Interactive pills filtering mechanics by capability (*Flat Tyre*, *Battery*, *Towing*, *Mechanical*).
* **Mechanic Cards**: Verified profiles showing real-time ETA, vehicle equipment (hydraulic jack, battery kit), distance, ratings, and upfront Jolty platform fee.

### 3. Synchronized Location & Manual Address Modal
* **Explicit Geolocation API**: Triggered strictly on user click of **GPS** or **Find location**; never auto-prompted on load.
* **Provider Abstraction**: Pluggable reverse-geocoder ([js/location-service.js](./js/location-service.js)) with `MockGeocodingProvider` (curated Indian corridors), isolated dev `NominatimDevProvider` (rate-limited), and production backend hook.
* **Highway Presets**: Quick-select buttons for high-traffic corridors (*NH-48 Manesar Toll*, *Outer Ring Road Bengaluru*, *Mumbai-Pune Expressway*).
* **Safe Persistence**: Stores confirmed address in `localStorage` (`jolty_confirmed_address`) with rollback safety.

### 4. Booking & Order Checkout Drawer
* Summarizes breakdown location, chosen mechanic, vehicle type, and ETA.
* **Unmistakable Pricing Mandate**:
  * **Jolty Platform Fee: ₹149** (dispatched platform charge).
  * **Bold Disclaimer**: *"Repair prices are not included. The repair cost is separate and depends on the work required after on-site inspection."*

### 5. Live Mechanic Tracking & Status (`#tracking`)
* **Highway Route SVG Map**: Animated gradient route path with live pulsing waypoints.
* **Moving Mechanic Van**: *Suresh Kumar* animated marker traversing waypoints along NH-48.
* **Live Stepper**: 4-stage visual tracker (*1. Confirmed → 2. On The Way → 3. Arrived → 4. Service Done*).
* **Mechanic Contact**: One-tap phone call (`tel:+919876543210`) and WhatsApp direct message.
* **Family Sharing**: Native Web Share API integration with clipboard fallback.
* **Emergency Helpline**: Direct bridge to 24/7 central rapid highway response control room.

### 6. Authentication (`#login`)
* Minimalist mobile phone authentication card.
* 10-digit number validation with real-time numeric format filtering and visual checkmark.
* Progressive OTP button states (*"Send OTP" → "Sending OTP..." → "OTP Sent!" → "Verify & Proceed"*).
* Social identity buttons for Google and Apple sign-in.

### 7. Customer Profile & Dynamic Header Menu (`#profile`)
* **Stitch Screen Match (`142468625d1c494a94011369f98aea1d`)**:
  * **Decorative Truck Art & Jaali Lattice SVG Watermark**: Subtle highway vernacular ornamental backdrops.
  * **Jolty Gold Sentinel & Bio**: Aarav Sharma (`+91 98765 43210`), verified status, Gurugram HR, and NH-48 Express Club active milestone bar.
  * **Assistance History**: 3 quick metrics (8 Total Rescues, 11 min Avg Response, ₹3.4k App Savings) plus completed service history log.
  * **Registered Garage**: Primary Hyundai Creta SX (O) Turbo Petrol (`DL 01 AB 7890`) with live 24/7 RSA cover & FASTag integration, alongside Royal Enfield Classic 350 (`HR 26 DQ 4311`).
  * **Jolty Highway Sentinel ICE**: Emergency contact card with one-touch dialing for Pooja Sharma (`+91 98112 34567`).
  * **Preferences & Trips**: Saved stretches, UPI methods (`aarav@okhdfcbank`), language selection, and interactive NH Traffic & Fog Alerts toggle.
* **Dynamic Header Profile Dropdown**:
  * **When on Home Screen (`#home`)**: Options display **View Profile** (`#profile`) and **Log Out**.
  * **When on Profile Screen (`#profile`)**: Options display **Go to Home** (`#home`) and **Log Out**.
  * **Prominent In-Page Log Out Button**: Clears authentication state, updates the header, shows a toast notification, and routes the user safely to the home view.

---

## ⚖️ Pricing Policy & Rules

| Component | Amount | Description |
| :--- | :--- | :--- |
| **Jolty Fee** | **₹149** | Platform charge for rapid dispatch, verified partner assignment, live tracking, and 24/7 phone assistance. |
| **Repair Cost** | **Separate (Not Included)** | Quoted by the mechanic on-site after physical diagnosis based on parts and labor required. |

> [!IMPORTANT]
> **Repair prices are not included in the Jolty fee.** Jolty guarantees transparent platform dispatch and security, while physical repairs are billed independently by the responding mechanic.

---

## 🛠️ Repository Architecture & Tech Stack

```
Jolty Startup/
├── index.html                  # Main SPA entrypoint containing all screens & modals
├── css/
│   └── style.css               # Design tokens, custom animations, dialogs & typography
├── js/
│   ├── location-service.js     # Geolocation & geocoding provider adapter module
│   └── app.js                  # App state, hash routing, tracking simulation & UI logic
├── execution/
│   ├── serve_app.py            # Lightweight deterministic HTTP server (CORS & no-cache)
│   └── README.md
├── directives/
│   ├── serve_prototype.md      # SOP for starting & verifying prototype
│   └── README.md
├── docs/
│   └── brief/                  # PRD, design brief, rules, and architecture specs
├── .agents/skills/             # Frontend design & taste anti-slop skills
└── .env.example                # Sample environment configuration
```

* **Core Stack**: HTML5, Vanilla JavaScript (ES6+), CSS3.
* **Styling**: Tailwind CSS CDN with custom tokens matching Stitch + dedicated custom stylesheets.
* **No Node/Build dependencies required**: Runs instantly on standard web servers or Python's built-in socket server.

---

## 🚀 Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Arbind-codes/Jolty.git
   cd Jolty
   ```

2. **Start the local server**:
   ```bash
   python3 execution/serve_app.py --port 8000
   ```

3. **Open in browser**:
   Navigate to [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 📄 License & Credits

* **Brand & Visuals**: Google Stitch Project `9279876243502578812`.
* **Icons & Type**: Google Fonts (`DM Sans`, `Material Symbols Outlined`).
* © 2025–2026 Jolty Roadside Marketplace India. All rights reserved.
