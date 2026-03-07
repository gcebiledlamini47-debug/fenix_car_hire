# Fenix Car Hire

Reliable • Professional • Convenient

A modern car rental service website built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm, npm, yarn, or bun package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gcebiledlamini47-debug/fenix_car_hire.git
   cd fenix_car_hire
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   # or
   bun install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
fenix_car_hire/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # Root layout with Navbar & Footer
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles & design tokens
│   ├── about/page.tsx            # About page
│   ├── services/page.tsx         # Services listing page
│   ├── fleet/page.tsx            # Vehicle fleet page
│   ├── contact/page.tsx          # Contact form & locations
│   ├── booking/page.tsx          # Booking form page
│   └── terms/page.tsx            # Terms & conditions
│
├── components/                    # Reusable React components
│   ├── layout/
│   │   ├── Navbar.tsx           # Navigation component
│   │   └── Footer.tsx           # Footer with links
│   │
│   ├── ui/
│   │   ├── Section.tsx          # Page section wrapper
│   │   ├── Card.tsx             # Reusable card component
│   │   └── Button.tsx           # Styled button component
│   │
│   ├── features/
│   │   ├── HeroSlider.tsx       # Auto-rotating hero slider
│   │   ├── VehicleGrid.tsx      # Vehicle display grid
│   │   ├── ServiceCard.tsx      # Service cards display
│   │   └── RegionCard.tsx       # Regional office cards
│   │
│   └── forms/
│       ├── BookingForm.tsx      # Vehicle booking form
│       └── ContactForm.tsx      # Contact form
│
├── data/                          # Static data & configuration
│   ├── navigation.ts            # Navigation links config
│   ├── vehicles.ts              # Fleet vehicles database
│   ├── services.ts              # Services listing
│   └── regions.ts               # Regional office information
│
├── types/                         # TypeScript type definitions
│   └── index.ts                 # All interfaces & types
│
├── public/                        # Static assets
│   ├── images/                  # Car images
│   └── favicon.ico
│
├── package.json                   # Dependencies
├── next.config.mjs              # Next.js configuration
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind CSS config
├── postcss.config.mjs           # PostCSS config
├── .eslintrc.json               # ESLint rules
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## Key Features

- **Home Page**: Auto-rotating hero slider, featured vehicles, services overview, and CTA sections
- **Vehicle Fleet**: Complete vehicle inventory with specifications, pricing, and booking integration
- **Service Pages**: Services, about, and detailed information about company offerings
- **Booking System**: Interactive booking form with vehicle, date, and location selection
- **Contact Section**: Contact form, regional offices, and FAQ
- **Responsive Design**: Mobile-first approach, fully responsive on all devices
- **Dark Color Scheme**: Professional blue (#1a4a8d) and cyan (#00A8E8) branding
- **Component Architecture**: Modular, reusable components for easy maintenance and scaling

## Data Management

- **Vehicles**: 6 vehicle categories with pricing and features
- **Services**: 6 core service offerings with detailed descriptions
- **Regions**: 4 regional offices with contact information
- **Navigation**: Centralized navigation links configuration

## Technologies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: React 19
- **Code Quality**: ESLint

## Features

- Modern, responsive design
- Type-safe with TypeScript
- Utility-first CSS with Tailwind
- Server-side rendering and static generation
- Optimized performance with Next.js

## Deployment

This project is ready to be deployed on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy on every push to the main branch.

### Deploy on Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js and configure it
5. Your site will be live!

For more deployment options, see [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)

## License

All Rights Reserved © 2026 Fenix Car Hire
