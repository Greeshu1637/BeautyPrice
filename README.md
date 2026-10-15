# BeautyPrice — Beauty & Skincare Shopping Intelligence (India)

**BeautyPrice** is a premium editorial beauty-tech web application built for Indian consumers. It provides independent price intelligence, standardized unit-cost calculations (₹/ml and ₹/g), recorded price history tracking, transparent non-medical formulation recommendations, and a multi-retailer shopping basket optimizer.

---

## 🌟 Key Features

1. **Editorial Beauty-Tech Design System**
   - Warm ivory, soft blush, plum, and espresso palette with champagne accents.
   - Refined typography pairing Google Fonts *Playfair Display* (editorial serif headings) with *Plus Jakarta Sans* (modern sans-serif body).
   - Generous spacing, polished luxury cards, and responsive layouts across mobile, tablet, and desktop.

2. **Curated 30+ Formulations Catalog**
   - Realistic sample beauty formulations across **Skincare, Haircare, Makeup, and Body Care**.
   - Popular brands in India: *Minimalist, Dot & Key, Plum, The Derma Co, Foxtale, Laneige, COSRX, Maybelline New York, L'Oreal Paris, Forest Essentials, Kama Ayurveda, Chemist at Play, Cetaphil, Aqualogica, WishCare, Pilgrim, Kay Beauty, Lakme, Bioderma, Sebamed, Simple, and mCaffeine*.
   - Includes full specs: net weight/volume, active ingredients, skin type suitability, target concerns, fragrance/cruelty status, and recorded offers.

3. **Multi-Retailer Price Comparison**
   - Compares recorded sample offers across 6 Indian platforms: **Nykaa, Tira, Amazon India, Purplle, Blinkit, and Myntra**.
   - Highlights the lowest recorded sample offer and delivery estimates.

4. **True Unit-Cost Metric (₹/ml and ₹/g)**
   - Unmasks deceptive packaging volume differences by calculating exact cost per millilitre or gram.
   - Formatted in Indian Rupee denomination: `Unit Price = Recorded Price ÷ Net Volume`.

5. **Recorded Price History & Interactive SVG Chart**
   - Interactive, lightweight SVG timeline visualization plotting price trends across historical dates and promotional drops (e.g. *Freedom Sale, Hot Pink Sale, Monsoon Drops*).
   - Summary statistics: All-time lowest sample price, highest sample price, recorded average, and last recorded date.

6. **Personalized Beauty Profile & Rule-Based Recommendation Engine**
   - Customizable preference selector: Skin Type (Oily, Dry, Combination, Sensitive, Normal), Skin Concerns, Budget Tier (Budget ≤ ₹550, Mid-Range ₹400–₹1,400, Luxury ₹1,200+, All), and Fragrance-Free preference.
   - Preferences automatically saved locally in browser `localStorage`.
   - Transparent rule-based match score (0–100%) explaining exactly *why* a product was recommended.
   - Strictly non-medical: matches cosmetic formulation attributes without clinical diagnostic claims.

7. **Formulation Alternatives & Side-by-Side Savings**
   - Automatically detects similar products sharing active ingredients or category focus.
   - Highlights unit-cost differentials (e.g., *"₹15.91/ml cheaper than target"*).

8. **Shopping Basket Planner & Smart Split Optimizer**
   - Add multiple products with quantity steppers.
   - Compares simulated total costs across individual retailers, showing stock availability and simulated delivery thresholds.
   - **Smart Split Strategy**: Calculates the optimal mix if buying each item from whichever retailer recorded the lowest price, highlighting total savings vs MRP and vs the highest retailer.

9. **Comprehensive Transparency & Methodology Page**
   - Dedicated page explaining sample-data limitations, unit-cost math, non-medical status, and independence from sponsored brand influence.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom editorial color extensions (`ivory`, `blush`, `plum`, `espresso`, `champagne`)
- **Icons**: Lucide React
- **Charting**: Responsive, zero-dependency custom SVG Line & Area chart
- **Storage**: Browser `localStorage` (Beauty profile & Shopping basket persistence)

---

## 🚀 How to Run the Application

### 1. Prerequisites
- **Node.js**: v18+ (verified on v24.15.0)
- **npm**: v9+ (verified on v11.12.1)

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
Generates optimized, typechecked production bundles in `dist/`.

---

## ⚠️ Demonstration Data Disclosure

> **Demonstration Notice:** All retailer prices, stock statuses, delivery speeds, and historical price points on **BeautyPrice** are **illustrative sample demonstration data** created to showcase the user experience. Prices are neither live nor scraped from real-time external APIs. BeautyPrice does not make medical diagnosis claims or prescribe treatments.
