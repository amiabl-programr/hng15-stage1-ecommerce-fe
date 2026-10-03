# Roofing Construction Shop — Frontend

A production-ready, mobile-first e-commerce and custom fabrication platform for industrial roofing sheets, structural steel profiles, and mill accessories. Built with React Router v7, React 19, Tailwind CSS v4, TypeScript, and Zustand.

---

## 🛠️ Tech Stack

- **Framework:** [React Router v7](https://reactrouter.com/) (Full-stack SSR / SPA routing)
- **UI & Runtime:** React 19, [Vite 8](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with native `@theme` tokens and responsive utilities
- **State Management:** [Zustand](https://zustand.docs.pmnd.rs/) with localStorage persistence (`cart-storage`)
- **Schema Validation:** [Zod](https://zod.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Testing:** [Vitest](https://vitest.dev/), React Testing Library, `@testing-library/jest-dom`, JSDOM
- **Package Manager:** `pnpm`

---

## ✨ Features

- **Industrial Product Catalog:**
  - Category-based product discovery (Industrial & Longspan, Residential Step-Tile, Stone-Coated Shingles, Flashings & Gutters, Fasteners & Accessories).
  - Search, sorting, and tag-based filtering.
  - Comprehensive mill specifications, dimensions, gauges, coatings, and unit pricing.

- **Clear & Descriptive Cart UX:**
  - High-affordance Add to Cart buttons with immediate visual feedback (`"Added! ✓"`).
  - Contextual quantity and live subtotal calculations.
  - Non-intrusive toast notifications for instant cart actions.
  - Persistent cart state across sessions via Zustand.

- **Custom Fabrication Request Service:**
  - Dedicated custom fabrication and cut-to-length specification quoting flow.
  - Interactive profile dimensions, material options, and immediate inquiry confirmations.

- **Protected Checkout Flow:**
  - Backend authentication check (`/api/auth/me`) before accessing or completing checkout.
  - Unauthenticated visitors are redirected to `/login?redirect=/checkout` (persisting the destination through Google OAuth via `?next=/checkout`).
  - Mobile-optimized collapsible order accordion keeping the order summary accessible without pushing input fields below the fold.
  - Auto-scrolling to the first invalid field on form submission errors.
  - Multiple payment flows supported: Direct Mill Wire Transfer and Paystack Online Checkout.
  - Verified order confirmation receipt with print-ready and email modal view.

- **Mobile Responsiveness & Navigation:**
  - Off-canvas animated hamburger menu drawer with search input, category links, direct phone dialing, and cart badge counter.
  - Touch-optimized touch targets (`min-h-[44px]`), backdrop blur, and accessible modal overlays.
  - Centralized hero section on tablet and desktop viewports with rich architectural imagery and trust badges.

- **Offline Resilience & Graceful Fallbacks:**
  - Seed catalog fallbacks when running disconnected from the backend API.
  - Robust client error handling for network timeouts.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** `>= 20.0.0`
- **Package Manager:** `pnpm` (recommended) or `npm`

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/amiabl-programr/hng15-stage1-ecommerce-fe.git
cd hng15-stage1-ecommerce-fe
pnpm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Ensure your `.env` contains the correct backend URL:

```env
# Base URL for the backend API service
VITE_API_URL=http://localhost:4000

# Base URL for the frontend application
VITE_APP_URL=http://localhost:5173
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Verification

Run the full verification suite (TypeScript compiler + Vitest unit/component tests):

```bash
# Run type checks and test suites
pnpm verify

# Run test suite once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run TypeScript typegen & validation
pnpm typecheck
```

---

## 📦 Building for Production

Build the client assets and server bundle:

```bash
pnpm build
```

Run the production server:

```bash
pnpm start
```

---

## 🐳 Docker Deployment

To build and run using Docker:

```bash
# Build Docker image
docker build -t roofing-ecommerce-fe .

# Run container on port 3000
docker run -p 3000:3000 roofing-ecommerce-fe
```

The containerized service can be deployed on AWS ECS, Google Cloud Run, Fly.io, Railway, or any container runtime.

---

## 📁 Project Structure

```text
├── app/
│   ├── components/
│   │   ├── layout/       # Navbar, Footer, Mobile Drawer
│   │   ├── products/     # ProductCard, ProductGrid, Filters
│   │   └── ui/           # Button, Modal, Toast, Drawer, Badge
│   ├── hooks/            # useCart, useAuth, useCategories
│   ├── lib/              # API client, seed data, site constants
│   ├── routes/           # React Router route modules
│   │   ├── store._index.tsx             # Homepage & Hero showcase
│   │   ├── store.products._index.tsx    # Catalog & search
│   │   ├── store.products.$slug.tsx     # Product details
│   │   ├── store.cart.tsx               # Cart drawer/page
│   │   ├── store.checkout.tsx           # Protected checkout flow
│   │   ├── store.checkout.success.tsx   # Order confirmation
│   │   ├── store.fabrication.tsx        # Custom fabrication
│   │   └── login.tsx                    # Authentication entry
│   ├── app.css           # Tailwind CSS imports & base styles
│   └── root.tsx          # Root document & providers
├── public/               # Static assets & brand media
├── test/                 # Test setup and shared mocks
├── package.json
├── react-router.config.ts
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 📄 License

Private & Proprietary — Developed for Roofing Construction Shop.
