# ZELVYN — KEEPIN' IT REAL

Luxury monochrome streetwear footwear flagship engineered with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, configured for zero-backend static export (`output: "export"` -> `out/`).

## Key Features
- **24-Product Monochrome Catalog (PKR):** Covers **Boys**, **Girls**, and **Unisex** across **Casual** (`Sneakers`, `Joggers`), **Formal** (`Loafers`, `Formal Shoes`), **Sports** (`Grippers`, `Sports Shoes`), and **Slippers** (`Slippers`, `Crocs`).
- **Client-Side Persistence (`localStorage`):** Slide-over Cart Drawer with free delivery progress bar (`PKR 8,000`), working promo codes (`REAL10` for 10% off, `ZELVYN50` for 50% off), wishlist archive, and Guest Session persistence (`+92` / `03XX` validation + email).
- **4-Method Checkout & Live Tracking:** Cash on Delivery (COD), Credit/Debit Card with live monochrome virtual card preview, Easypaisa / JazzCash wallet verification prompt, and Bank Transfer with one-click Copy IBAN + printable/downloadable digital receipts (`ZLV-26-XXXX`) and 4-stage live order tracking on `/orders`.

## Local Development & Static Build

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # outputs static site to ./out
```

## Cloudflare Pages / Vercel Deployment
- **Cloudflare Pages:** Framework `Next.js (Static HTML Export)` · Build command `npm run build` · Output directory `out`
- **Vercel:** Import GitHub repo directly (Next.js App Router auto-detected; `output: "export"` builds cleanly to `out`).
