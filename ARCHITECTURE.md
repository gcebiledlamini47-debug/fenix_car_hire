# Architecture Overview - Fenix Car Hire Next.js Prototype

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Fenix Car Hire Website                   │
│                   (Next.js 16 + React 19)                   │
└─────────────────────────────────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼────┐    ┌────▼─────┐  ┌────▼──────┐
         │  Pages  │    │Components │  │    Data   │
         │  Layer  │    │   Layer   │  │   Layer   │
         └────┬────┘    └────┬─────┘  └────┬──────┘
              │              │              │
              │              │              │
         ┌────▼──────────────▼──────────────▼────┐
         │          Styling Layer (Tailwind)     │
         └──────────────────────────────────────┘
              │
         ┌────▼────────────────────────────────┐
         │     Output (HTML/CSS/JavaScript)    │
         └─────────────────────────────────────┘
```

---

## Layer Architecture

### 1. Pages Layer
The top layer - User-facing pages that combine components and data.

```
app/
├── page.tsx              ← Home page
├── about/page.tsx        ← About page
├── services/page.tsx     ← Services page
├── fleet/page.tsx        ← Fleet page
├── booking/page.tsx      ← Booking page
├── contact/page.tsx      ← Contact page
└── terms/page.tsx        ← Terms page

Each page:
  1. Imports components
  2. Imports data
  3. Combines them in JSX
  4. Exports as default component
```

### 2. Components Layer
Reusable, composable UI elements.

```
components/
├── layout/               ← Page wrappers
│   ├── Navbar.tsx       (sticky header)
│   └── Footer.tsx       (page footer)
├── ui/                  ← Base UI blocks
│   ├── Section.tsx      (wrapper)
│   ├── Card.tsx         (container)
│   └── Button.tsx       (clickable)
├── features/            ← Composite features
│   ├── HeroSlider.tsx   (carousel)
│   ├── VehicleGrid.tsx  (grid display)
│   ├── ServiceCard.tsx  (service grid)
│   └── RegionCard.tsx   (office cards)
└── forms/               ← Form components
    ├── BookingForm.tsx  (booking)
    └── ContactForm.tsx  (contact)
```

### 3. Data Layer
Centralized, typed data structures.

```
data/
├── vehicles.ts          ← 6 vehicle types
├── services.ts          ← 6 services
├── regions.ts           ← 4 regions
└── navigation.ts        ← 6 nav links

types/
└── index.ts             ← All TypeScript interfaces
```

### 4. Styling Layer
Tailwind CSS with custom configuration.

```
app/globals.css          ← Global styles + design tokens
tailwind.config.ts       ← Tailwind configuration
postcss.config.mjs       ← CSS processing
```

---

## Data Flow

### Simple Page Example
```
Home Page (app/page.tsx)
    ↓
Imports Components:
    ├── HeroSlider
    ├── VehicleGrid
    ├── ServiceCard
    └── Button
    ↓
Imports Data:
    ├── vehicles from data/vehicles.ts
    ├── services from data/services.ts
    └── navigation from data/navigation.ts
    ↓
Imports Types from types/index.ts
    ↓
Renders UI with Tailwind classes
    ↓
Browser Output
```

### Component Hierarchy
```
RootLayout (app/layout.tsx)
    │
    ├── Navbar (components/layout/Navbar.tsx)
    │   └── navigationLinks from data/navigation.ts
    │
    ├── Main Content (children)
    │   │
    │   ├── Section (components/ui/Section.tsx)
    │   │   ├── HeroSlider (auto-rotating)
    │   │   ├── VehicleGrid (displays vehicles)
    │   │   │   └── uses vehicles from data/vehicles.ts
    │   │   ├── ServiceCard (displays services)
    │   │   │   └── uses services from data/services.ts
    │   │   └── Button (CTA)
    │   │
    │   └── More Sections...
    │
    └── Footer (components/layout/Footer.tsx)
        └── navigationLinks + regionInfo
```

---

## Component Composition Patterns

### Pattern 1: Wrapper Component
```
Section.tsx (wrapper)
├── Accepts: children, className, id
├── Provides: max-width, padding, background
└── Used by: Every page section

Page.tsx
├── <Section>
│   └── Content here
├── <Section>
│   └── More content
└── <Section>
    └── Final content
```

### Pattern 2: Grid Display
```
VehicleGrid.tsx
├── Accepts: limit prop (optional)
├── Data from: data/vehicles.ts
├── Maps over: vehicles array
├── Renders: Card for each vehicle
└── Layout: md:grid-cols-2 lg:grid-cols-3

Same pattern used by:
├── ServiceCard.tsx (services)
├── RegionCard.tsx (regions)
└── Custom grids
```

### Pattern 3: Form Component
```
BookingForm.tsx
├── State: formData with all fields
├── Handlers: handleChange, handleSubmit
├── Validation: Required field checks
├── Feedback: Success message on submit
└── Data from: regions and vehicles dropdowns

Same pattern in:
└── ContactForm.tsx
```

---

## State Management

### Local Component State
```
Form Components:
  BookingForm.tsx
    └── useState for form fields
  
  ContactForm.tsx
    └── useState for form fields

Feature Components:
  HeroSlider.tsx
    ├── useState for currentSlide
    └── useEffect for auto-rotation
```

### Shared Data (No State Needed)
```
Data files used directly:
  ├── data/vehicles.ts     (imported where needed)
  ├── data/services.ts     (imported where needed)
  ├── data/regions.ts      (imported where needed)
  └── data/navigation.ts   (imported where needed)

No prop drilling needed - components import directly
```

---

## Type System

### Type Definition Flow
```
types/index.ts
├── Vehicle interface
│   ├── id: string
│   ├── name: string
│   ├── dailyRate: number
│   └── ... more fields
│
├── Service interface
├── Region interface
├── NavLink interface
├── BookingData interface
└── ContactData interface
    │
    ├─→ Used by components
    ├─→ Used by data modules
    └─→ Used by pages
```

### Type Safety Example
```
vehicles.ts
├── Imports: Vehicle from types
├── Array: Vehicle[]
└── Intellisense support

VehicleGrid.tsx
├── Imports: vehicles and Vehicle type
├── Maps: vehicles.map((v: Vehicle) => ...)
└── Type checking: All props validated
```

---

## Module Dependency Graph

```
app/layout.tsx
├── imports: Navbar, Footer
├── imports: globals.css
└── wraps all pages

app/page.tsx (Home)
├── imports: HeroSlider
├── imports: VehicleGrid
├── imports: ServiceCard
├── imports: Button
├── imports: Section
├── imports: vehicles, services, navigation (data)
└── uses: types from types/index.ts

app/fleet/page.tsx
├── imports: VehicleGrid
├── imports: Section
├── imports: vehicles (data)
└── uses: Vehicle type

Components (no interdependency)
├── Navbar imports: navigation (data)
├── Footer imports: navigation (data)
├── HeroSlider: self-contained
├── VehicleGrid imports: vehicles (data)
├── ServiceCard imports: services (data)
├── RegionCard imports: regions (data)
├── BookingForm imports: vehicles, regions (data)
└── ContactForm: self-contained

Data modules (no dependencies)
├── vehicles.ts imports: Vehicle type
├── services.ts imports: Service type
├── regions.ts imports: Region type
└── navigation.ts imports: NavLink type
```

---

## Styling Architecture

### Design Token System
```
app/globals.css
├── :root CSS variables
│   ├── --background: #F4F6F9
│   ├── --foreground: #333
│   ├── --primary: #1F3C88
│   ├── --secondary: #00A8E8
│   └── --accent: #F4F6F9
│
├── Tailwind @directives
│   ├── @tailwind base
│   ├── @tailwind components
│   └── @tailwind utilities
│
└── Custom base styles
    ├── * { margin: 0; padding: 0; }
    ├── html { scroll-behavior: smooth; }
    └── body { font-family: system-ui; }

tailwind.config.ts
├── theme.colors
│   ├── Custom brand colors
│   └── Extended palette
└── plugins
    └── Any custom plugins
```

### Responsive Design System
```
Mobile First (default)
│
├── sm: 640px
│   └── small screens
│
├── md: 768px
│   └── tablets and up
│   └── used most: md:grid-cols-2
│
├── lg: 1024px
│   └── desktops and up
│   └── used for details: lg:grid-cols-3
│
└── xl: 1280px
    └── large desktops
    └── rarely used

Example:
<div className="grid md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column mobile, 2 tablets, 3 desktop */}
</div>
```

---

## File Organization Principles

### Separation of Concerns
```
✓ Pages handle routing and layout
✓ Components handle UI rendering
✓ Data files handle data storage
✓ Types handle type definitions
✓ Styles handle presentation
```

### Reusability Levels
```
Level 1: Atomic Components
  └── Button, Card, Section

Level 2: Composite Components
  └── VehicleGrid (Button + Card)
  └── ServiceCard (Card + Button)

Level 3: Feature Components
  └── HeroSlider (multiple Cards, Buttons)

Level 4: Pages
  └── Combine multiple feature components
```

### Data Organization
```
✓ One vehicle type = one interface
✓ One vehicle = one object
✓ All vehicles = one array
✓ One array per data file
✓ Easy to find and modify
```

---

## Scalability Pathways

### Adding a New Page
```
1. Create: app/newpage/page.tsx
2. Import: existing components
3. Create: data/newpage.ts (if needed)
4. Add: navigation link in data/navigation.ts
5. Update: Navbar if new link needed
6. Done: Page is live
```

### Adding a New Component
```
1. Identify: component type (ui, features, forms)
2. Create: components/type/NewComponent.tsx
3. Define: props interface
4. Build: using Tailwind classes
5. Import: in pages where needed
6. Done: Reusable across project
```

### Adding a New Data Source
```
1. Create: data/newdata.ts
2. Define: type interface in types/index.ts
3. Export: array of typed objects
4. Import: in components that need it
5. Use: in map() functions
6. Done: Data available everywhere
```

---

## Performance Considerations

### Code Splitting
- Next.js automatically splits code per page
- Each page loads only what it needs
- Unused components aren't loaded

### Image Optimization
- Images ready to use next/image
- Automatic lazy loading
- Multiple sizes for responsive design

### CSS
- Tailwind purges unused styles
- Only CSS used is included
- Minimal bundle size

### JavaScript
- React components compiled to minimal code
- Tree-shaking removes dead code
- Production minification enabled

---

## Development Workflow

```
┌─────────────────────────────────┐
│   Start: npm run dev            │
└────────────┬────────────────────┘
             │
      ┌──────▼──────┐
      │  File Edit  │
      └──────┬──────┘
             │
      ┌──────▼────────────┐
      │  HMR (Hot Reload) │
      └──────┬────────────┘
             │
      ┌──────▼─────────────┐
      │  Browser Updates   │
      └──────┬─────────────┘
             │
      ┌──────▼──────────────┐
      │  View Changes       │
      └──────┬──────────────┘
             │
         Repeat...
```

---

## Production Build Process

```
npm run build
    ↓
┌─────────────────────────────────┐
│ Next.js Compilation             │
├─────────────────────────────────┤
│ • Page optimization             │
│ • Component minification         │
│ • CSS purging                   │
│ • Code splitting                │
│ • Image optimization            │
│ • Static generation             │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Production Build Output         │
├─────────────────────────────────┤
│ .next/                          │
│ ├── static/                     │
│ ├── server/                     │
│ └── [optimized assets]          │
└─────────────────────────────────┘
    ↓
npm run start (or deploy to Vercel)
```

---

## Summary

The architecture is designed for:
- ✅ **Clarity** - Easy to understand structure
- ✅ **Reusability** - Components used across multiple pages
- ✅ **Maintainability** - Changes in one place affect everywhere
- ✅ **Scalability** - Easy to add new pages and features
- ✅ **Performance** - Optimized bundle and load times
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Developer Experience** - Clear patterns and conventions

The foundation is solid for building, maintaining, and scaling the Fenix Car Hire platform.
