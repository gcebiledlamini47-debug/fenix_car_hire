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
├── app/
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── [other pages]/      # Additional pages
├── components/             # Reusable components
├── public/                 # Static assets (images, favicon, etc.)
├── package.json            # Project dependencies
├── next.config.mjs         # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── README.md              # This file
```

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
