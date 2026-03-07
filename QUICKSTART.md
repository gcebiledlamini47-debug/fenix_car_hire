# Quick Start Guide - Fenix Car Hire Prototype

## 🚀 Get Running in 2 Minutes

### 1. Install Dependencies
The project automatically installs dependencies when you interact with the preview. No manual installation needed!

### 2. Start Development Server
The preview is already running at `http://localhost:3000`

### 3. Explore the Site
- **Home** - Auto-rotating hero, featured vehicles, services
- **About** - Company story, mission, vision, and team
- **Services** - Detailed service offerings and benefits
- **Fleet** - Complete vehicle catalog with pricing
- **Booking** - Interactive booking form
- **Contact** - Contact form, regional offices, FAQ
- **Terms** - Terms and conditions

## 📁 Key Files to Know

### Pages
- `app/page.tsx` - Home page
- `app/about/page.tsx` - About page
- `app/services/page.tsx` - Services page
- `app/fleet/page.tsx` - Vehicle fleet
- `app/booking/page.tsx` - Booking page
- `app/contact/page.tsx` - Contact page

### Components
- `components/layout/Navbar.tsx` - Navigation
- `components/layout/Footer.tsx` - Footer
- `components/features/HeroSlider.tsx` - Hero carousel
- `components/features/VehicleGrid.tsx` - Vehicle display
- `components/forms/BookingForm.tsx` - Booking form
- `components/forms/ContactForm.tsx` - Contact form

### Data
- `data/vehicles.ts` - Vehicle fleet data
- `data/services.ts` - Service offerings
- `data/regions.ts` - Regional offices
- `data/navigation.ts` - Navigation links

### Types
- `types/index.ts` - TypeScript interfaces

## 🎨 Styling

**Colors:**
- Primary: `#1a4a8d` (dark blue)
- Secondary: `#00A8E8` (cyan)
- Use `text-[#1a4a8d]`, `bg-[#00A8E8]` in components

**Tailwind Classes:**
```tsx
<div className="p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-[#1a4a8d]">Title</h2>
  <p className="text-gray-700">Description</p>
</div>
```

## 🔄 Making Changes

### Edit a Page
```tsx
// app/about/page.tsx
export default function About() {
  return (
    <Section>
      <h1>Your content here</h1>
    </Section>
  )
}
```

### Create a New Component
```tsx
// components/features/MyComponent.tsx
export function MyComponent() {
  return <div>Component content</div>
}
```

### Add Data
```typescript
// data/mydata.ts
export const myData = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
]
```

### Use Data in Components
```tsx
import { myData } from '@/data/mydata'

export function MyComponent() {
  return (
    <div>
      {myData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

## 📝 Common Tasks

### Change Navigation Links
Edit `data/navigation.ts`:
```typescript
export const navigationLinks = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About', href: '/about' },
  // Add more links here
]
```

### Update Vehicle Data
Edit `data/vehicles.ts`:
```typescript
export const vehicles = [
  {
    id: 'car-1',
    name: 'Toyota Corolla',
    dailyRate: 45,
    // Update properties
  },
]
```

### Modify Service Offerings
Edit `data/services.ts` and update the data array.

### Change Colors
Edit `app/globals.css`:
```css
:root {
  --primary: #1a4a8d;
  --secondary: #00A8E8;
}
```

## 🛠️ Component Usage Examples

### Section Wrapper
```tsx
import { Section } from '@/components/ui/Section'

<Section className="bg-white">
  <h2>Content goes here</h2>
</Section>
```

### Card Component
```tsx
import { Card } from '@/components/ui/Card'

<Card hover>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

### Button Component
```tsx
import { Button } from '@/components/ui/Button'

<Button href="/booking" isLink variant="primary">
  Click Me
</Button>
```

### Vehicle Grid
```tsx
import { VehicleGrid } from '@/components/features/VehicleGrid'

<VehicleGrid limit={3} /> {/* Shows 3 vehicles */}
<VehicleGrid /> {/* Shows all vehicles */}
```

## 📱 Responsive Design

The project uses Tailwind's responsive prefixes:
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

Breakpoints:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

## 🔍 File Navigation

Quick reference to find what you need:

| What | Where |
|------|-------|
| Home page content | `app/page.tsx` |
| Add a new page | Create `app/newpage/page.tsx` |
| Edit navigation | `data/navigation.ts` |
| Vehicle data | `data/vehicles.ts` |
| Contact form | `components/forms/ContactForm.tsx` |
| Page layout | `app/layout.tsx` |
| Global styles | `app/globals.css` |
| Type definitions | `types/index.ts` |

## ✅ Best Practices

1. **Use components** - Don't duplicate code, create reusable components
2. **Keep data separate** - Put data in `data/` directory
3. **Type everything** - Use TypeScript interfaces from `types/index.ts`
4. **Use Tailwind** - Avoid custom CSS, use utility classes
5. **Make it responsive** - Use `md:` and `lg:` prefixes
6. **Keep sections consistent** - Use the `Section` component wrapper
7. **Organize imports** - Import from `@/components`, `@/data`, etc.

## 🚀 Next: Making Changes

Ready to customize? Start here:

1. Edit `data/navigation.ts` to change menu items
2. Update `data/vehicles.ts` with your vehicles
3. Modify page content in `app/*/page.tsx` files
4. Create new components in `components/`
5. Add images to `public/images/`

## 📚 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://typescriptlang.org)

## 💡 Tips

- Use `console.log()` to debug in development
- Check browser DevTools for errors
- Hot reload automatically applies your changes
- Use TypeScript for autocomplete and type checking
- Tailwind has excellent documentation - check it out!

Happy coding! 🎉
