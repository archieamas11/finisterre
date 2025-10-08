---
description: "Guidelines for frontend design and development"
applyTo: "frontend"
---
# Frontend Designer Agent Guidelines

## Mission
Create modern, beautiful, accessible interfaces that follow industry-leading design principles and best practices.

## Tech Stack
- **Styling**: Tailwind v4 CSS
- **Components**: Shadcn UI, Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Design Principles

### Visual Hierarchy
- Guide users through content with clear focal points
- Use size, weight, color, and spacing to establish importance
- One primary action per screen—avoid competing CTAs
- F-pattern and Z-pattern layouts for content flow

### Consistency
- Maintain consistent spacing scale (4, 8, 12, 16, 24, 32, 48, 64px)
- Use systematic color palette with defined purpose
- Apply uniform component patterns across interfaces
- Keep typography scale predictable (text-sm, text-base, text-lg, text-xl, text-2xl)

### Progressive Disclosure
- Show essential information first
- Hide complexity behind interactions
- Use modals, accordions, and tabs strategically
- Avoid overwhelming users with choices

### Feedback & Affordance
- Every action requires visual feedback
- Interactive elements must look interactive
- Use micro-interactions to confirm actions
- Loading states for async operations
- Clear error and success states

## Color & Contrast

### Palette Structure
- **Primary**: Brand identity, main CTAs
- **Secondary**: Supporting actions
- **Accent**: Highlights, important info

### Contrast Requirements
- **Normal text**: 4.5:1 minimum (WCAG AA)
- **Large text** (18px+): 3:1 minimum
- **Interactive elements**: 3:1 minimum
- **Icons**: 3:1 minimum
- Test with tools, don't guess

## Typography

### Scale & Hierarchy
```
Display: text-4xl to text-6xl (bold)
Heading: text-2xl to text-3xl (semibold)
Subheading: text-xl (medium)
Body: text-base (normal)
Small: text-sm (normal)
Caption: text-xs (normal)
```

### Best Practices
- **Line height**: 1.5 for body, 1.2 for headings
- **Line length**: 60-75 characters for readability
- **Font pairing**: Max 2 font families (one for headings, one for body)
- **Weight contrast**: Use weight variations for hierarchy
- Avoid justified text—use left alignment

## Spacing & Layout

### Spacing Scale
- Use Tailwind's default scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64
- **Micro spacing**: 1-4 (within components)
- **Component spacing**: 4-8 (between elements)
- **Section spacing**: 12-24 (between sections)
- **Layout spacing**: 32+ (major layout divisions)

### Container & Breakpoints
```
Container: max-w-7xl with px-4 sm:px-6 lg:px-8
Breakpoints: sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px
```

### Grid Systems
- Use CSS Grid for page layouts
- Flexbox for component-level layouts
- Mobile-first responsive approach
- Stack on mobile, multi-column on desktop

## Component Design

### Buttons
```tsx
// Primary action
<Button size="default" className="bg-primary hover:bg-primary/90">

// Secondary action
<Button variant="outline">

// Destructive action
<Button variant="destructive">

// Ghost/minimal action
<Button variant="ghost">
```

### Forms
- Labels above inputs (not placeholder as label)
- Clear error messages below fields
- Inline validation on blur
- Disabled submit until valid
- Proper input types (email, tel, number)
- Group related fields

### Cards
- Use shadows subtly (shadow-sm, shadow-md)
- Rounded corners consistently (rounded-lg, rounded-xl)
- Proper padding (p-4, p-6)
- Clear visual boundaries
- Hover states for interactive cards

### Modals & Dialogs
- Overlay with backdrop blur
- Center-aligned by default
- Close button (X) in top-right
- Escape key to close
- Focus trap inside modal
- Max-width for readability (max-w-md to max-w-2xl)

## Animation & Motion

### Framer Motion Principles
- **Duration**: 200-300ms for micro-interactions, 400-500ms for larger movements
- **Easing**: Use spring physics or cubic-bezier for natural feel
- **Purpose**: Every animation should have a purpose—no motion for motion's sake

### Common Patterns
```tsx
// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>

// Slide up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>

// Scale on mount
<motion.div
  initial={{ scale: 0.95 }}
  animate={{ scale: 1 }}
  transition={{ type: "spring", stiffness: 300 }}
>

// Stagger children
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
```

### When to Animate
- **Page transitions**: Route changes
- **State changes**: Loading → success, collapsed → expanded
- **Micro-interactions**: Button hover, focus states
- **Feedback**: Form submission, deletion confirmation
- **Attention**: Drawing focus to important elements

### When NOT to Animate
- Don't animate initial page load excessively
- Respect `prefers-reduced-motion`
- Avoid animations longer than 500ms
- Don't animate on every user input

## Accessibility First

### Semantic HTML
- Use `<button>` for actions, `<a>` for navigation
- Proper heading hierarchy (h1 → h2 → h3)
- `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`
- Form elements wrapped in `<fieldset>` when grouped

### ARIA & Labels
- Every interactive element needs accessible name
- Use `aria-label` when visual label isn't present
- `aria-describedby` for additional context
- `aria-live` for dynamic content changes
- Don't use ARIA if semantic HTML suffices

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order (never positive `tabIndex`)
- Visible focus indicators (focus-visible:ring-2)
- Skip links for main content
- Modal focus trapping

### Screen Readers
- Alt text for images (descriptive, not "image of")
- Empty alt (`alt=""`) for decorative images
- Label form inputs properly
- Announce loading states
- Describe icon-only buttons

## Modern Design Patterns

### Glassmorphism
```tsx
className="bg-white/10 backdrop-blur-lg border border-white/20"
```
### Gradient Borders
```tsx
<div className="p-[1px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
  <div className="bg-white rounded-lg p-6">
```

### Subtle Animations
- Hover lift: `hover:translate-y-[-2px] transition-transform`
- Glow effect: `hover:shadow-xl hover:shadow-purple-500/50`
- Scale: `hover:scale-105 transition-transform`

## Performance & Optimization

### Images
- WebP format with fallbacks
- Use picsum imagees for placeholders
- Lazy loading (`loading="lazy"`)
- Proper dimensions (width/height)
- Responsive images with `srcset`

### Animations
- Use `transform` and `opacity` (GPU-accelerated)
- Avoid animating `width`, `height`, `left`, `top`
- Use `will-change` sparingly
- Debounce scroll animations

### CSS
- Avoid deep nesting
- Use Tailwind's JIT mode
- Purge unused styles
- Minimize custom CSS

## Component Library Usage

### Shadcn UI
- Check `components.json` before creating components
- Use CLI to add components: `npx shadcn-ui@latest add [component]`
- Customize via Tailwind config, not inline styles
- Follow Radix UI patterns for accessibility

### Radix UI Primitives
- Use for complex interactive components
- Unstyled by default—style with Tailwind
- Built-in accessibility features
- Composable API

## Design Checklist

### Before Implementation
- [ ] Design works on mobile, tablet, desktop
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Interactive elements have hover/focus states
- [ ] Loading and error states designed
- [ ] Empty states designed
- [ ] Dark mode considered

### During Implementation
- [ ] Semantic HTML used
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Animations respect prefers-reduced-motion
- [ ] Focus indicators visible
- [ ] Images have alt text

### After Implementation
- [ ] Test with keyboard only
- [ ] Test with screen reader
- [ ] Verify color contrast
- [ ] Check responsive breakpoints
- [ ] Validate HTML
- [ ] Test performance (Lighthouse)

## Resources & Inspiration

### Learn
- Refactoring UI (book)
- Laws of UX
- Material Design Guidelines
- Apple Human Interface Guidelines

### Tools
- Coolors (color palettes)
- Contrast Checker (WebAIM)
- Figma (design collaboration)
- Lighthouse (performance & accessibility)

### Stay Current
- Dribbble, Behance (inspiration)
- Tailwind UI (premium components)
- Shadcn UI docs
- Radix UI docs