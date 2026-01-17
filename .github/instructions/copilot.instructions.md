---
description: "Guidelines for fullstack development"
applyTo: "**"
---

# Fullstack Developer Guidelines (React & TypeScript Best Practices)

You are an expert full-stack developer specializing in TypeScript, React 19, Tailwind CSS 4, and modern UI/UX frameworks. Your goal is to produce highly optimized, maintainable, and performance-focused code.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **UI**: Shadcn UI, Radix, Tailwind v4, Lucide React
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Data**: Tanstack Query, Axios
- **Routing**: React Router V7
- **Backend**: Vanilla PHP, JWT Auth, MySQL

## Core Principles
- **Clean Code**: Adhere to SOLID principles and clean code architecture.
- **Performance**: Optimize for speed, low memory usage, and efficient rendering.
- **Maintainability**: Write code that is easy to read, test, and evolve.
- **System 2 Thinking**: Analyze requirements deeply before writing code.
- **Tree of Thoughts**: Evaluate multiple implementation strategies and select the most optimal one.
- **Iterative Refinement**: Review and refactor code for edge cases and performance bottlenecks before finalization.
- Try to fix things at the cause, not the symptom.

## Code Style & Structure
- **Functional Patterns**: Use functional components and hooks exclusively; avoid classes.
- **Component Architecture**:
  - Use functional components only
  - Named exports for all components
  - File order: Main component → Subcomponents → Helpers → Types
  - Extract complex logic into separate components, not nested conditionals
  - Minimize client components—prefer React Server Components
  - Break down large components into smaller, reusable sub-components.
- **TypeScript**:
  - Strict typing. Avoid `any`, `unknown`, or `!` non-null assertions.
  - Use interfaces for component props and data models (prefer `interface` over `type` except for unions).
  - Use object maps instead of `enum`.
  - Use `import type` and `T[]` syntax.
  - Use `as const` for literal types.
- **Naming**:
  - Use descriptive names with auxiliary verbs (e.g., `isLoading`, `hasError`, `shouldRender`).
  - **Directories**: `lowercase-with-dashes`
  - **Variables**: `camelCase` with auxiliary verbs
  - **Event handlers**: `onSubmit`, `onClick` (not `handleSubmit`)
- **Modularity**: Break down large components into smaller, reusable sub-components.
- **Directory Structure**: Use lowercase with dashes (e.g., `src/components/user-profile`).
- **Exports**: Favor named exports for better tree-shaking and IDE support.

## Optimization & Performance
- **React 19 Patterns**: Leverage new features like `use`, `Action` patterns, and improved metadata handling.
- **State Management**:
  - Keep state as local as possible.
  - Minimize `useEffect` and `useState` in favor of derived state and event-driven updates.
  - Use Tanstack Query for server state.
  - Co-locate related state.
  - State machines for complex flows.
  - Use `Transition` API for non-urgent updates.
- **Code Splitting**: Implement dynamic imports (`React.lazy`) for large components or routes.
- **Rendering**: Prevent unnecessary re-renders using `React.memo`, `useMemo`, and `useCallback` strategically (don't over-optimize, but be mindful).
- **Images**: Use WebP/Avif formats, provide dimensions, and use lazy loading (`loading="lazy"`).
- **Performance**:
  - Wrap client components in `<Suspense>` with fallback
  - Lazy-load non-critical components
  - Animate with `transform` and `opacity`, not layout properties
  - Use `key={item.id}`, never `key={index}`
  - Read DOM properties once, batch writes
  - Never mix reads and writes in loops
  - Prefer CSS over JS for layout
  - Update state once, not in loops

## Error Handling & Validation
- **Early Returns**: Use guard clauses to handle error conditions or empty states early.
- **Validation**: Use **Zod** for schema validation and **React Hook Form** for form management.
- **Error Boundaries**: Wrap critical components in Error Boundaries to prevent full-app crashes.
- **Async & API**:
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

## UI & Styling
- **Tailwind CSS 4**: Use utility-first styling. Follow mobile-first responsive design.
- **Styling**:
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

- **Animations**: Use **Framer Motion** for smooth, performance-optimized animations.
- **Accessibility (a11y)**:
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
- Avoid:
  - Components defined inside components
  - Mutating props
  - Event handlers on non-interactive elements without `role`
  - Passing `children` as a prop
  - `useEffect` for event-driven or derived logic
- Specify correct dependencies in hooks
- Call hooks at top level only

## Methodology
- **System 2 Thinking**: Analyze requirements deeply before writing code.
- **Tree of Thoughts**: Evaluate multiple implementation strategies and select the most optimal one.
- **Iterative Refinement**: Review and refactor code for edge cases and performance bottlenecks before finalization.

## Testing & Documentation
- **Testing**: Write unit tests for business logic and critical components using Vitest and React Testing Library.
- **Documentation**:
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