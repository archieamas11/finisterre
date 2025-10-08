---
description: "Guidelines for fullstack development"
applyTo: "**"
---

# Fullstack Developer Guidelines

## Tech Stack
- **Frontend**: React, TypeScript, Vite
- **UI**: Shadcn UI, Radix, Tailwind v4, Lucide React
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Data**: Tanstack Query, Axios
- **Routing**: React Router V7
- **Backend**: Vanilla PHP, JWT Auth

## Core Principles

### Code Quality
- Write production-ready, scalable, maintainable code
- Follow industry best practices and standards
- No shortcuts, band-aid solutions, or temporary fixes
- Keep code modular and well-organized
- Use clear, descriptive naming conventions

### Component Architecture
- Use functional components only
- Named exports for all components
- File order: Main component → Subcomponents → Helpers → Types
- Extract complex logic into separate components, not nested conditionals
- Minimize client components—prefer React Server Components

### State Management
- Avoid unnecessary `useState`—prefer derived state
- Use Tanstack Query for server state
- Co-locate related state
- State machines for complex flows

## Code Style

### Naming Conventions
- **Directories**: `lowercase-with-dashes`
- **Variables**: `camelCase` with auxiliary verbs (`isLoading`, `hasError`)
- **Event handlers**: `onSubmit`, `onClick` (not `handleSubmit`)

### Styling
- Use `cn()` utility for conditional classes—never ternaries in `className`
- Responsive and accessible by default
- Follow Shadcn UI patterns
- Use provided icon components, never raw SVGs

```tsx
// ✅ Correct
<div className={cn("rounded px-3 py-1", {
  "bg-blue-500": isActive,
  "bg-gray-500": !isActive
})} />

// ❌ Wrong
<div className={isActive ? "bg-blue-500" : "bg-gray-500"} />
```

## TypeScript
- Prefer `interface` over `type` (except for unions)
- Use object maps instead of `enum`
- No `any`, `unknown`, or `!` non-null assertions
- Use `import type` and `T[]` syntax
- Use `as const` for literal types

## Async & API
- Always use `async/await`, never `.then()`
- Handle errors with try/catch
- Use `toast.promise()` for async operations with feedback
- Never use `async` as Promise executor
- Avoid `await` inside loops

```ts
// ✅ Correct
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  toast.error("Failed to fetch data");
}
```

## Performance
- Wrap client components in `<Suspense>` with fallback
- Lazy-load non-critical components
- Use `React.memo`, `useMemo`, `useCallback` appropriately
- Optimize images: WebP, `loading="lazy"`, dimensions specified
- Animate with `transform` and `opacity`, not layout properties
- Use `key={item.id}`, never `key={index}`

### Prevent Layout Thrashing
- Read DOM properties once, batch writes
- Never mix reads and writes in loops
- Prefer CSS over JS for layout
- Update state once, not in loops
- Use `startTransition` for non-urgent updates

## Accessibility (Critical)
- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- All interactive elements must be focusable and labeled
- Include `alt` text (descriptive, not "image")
- Add `lang` on `<html>`
- Include `title` for `<svg>` and `<iframe>`
- Use keyboard events with mouse events
- Never use positive `tabIndex`

## Security
- Never hardcode credentials
- Never use `dangerouslySetInnerHTML`
- Use `rel="noopener"` with `target="_blank"`
- No import cycles

## React Best Practices

### Avoid
- Components defined inside components
- Mutating props
- Event handlers on non-interactive elements without `role`
- Passing `children` as a prop
- `useEffect` for event-driven or derived logic

### Dependencies
- Specify correct dependencies in hooks
- Call hooks at top level only

## Documentation
- Comment **why**, not **what**
- Use JSDoc for public APIs
- Label with: `TODO`, `FIXME`, `HACK`, `WARNING`, `PERF`, `SECURITY`
- Avoid obvious, redundant, or dead code comments

## Project Standards
- Check `components.json` before creating UI components
- Use Shadcn CLI for new components
- Match existing code style when modifying files
- Use absolute imports (`@/components/ui/button`)
- Verify `package.json` before suggesting commands