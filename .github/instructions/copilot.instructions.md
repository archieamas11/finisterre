---
description: "Guidelines for fullstack development"
applyTo: "**"
---

## Fullstack Developer Guidelines

- You are an expert fullstack developer using React, TypeScript, Shadcn UI, Tailwind, Zod, React Hook Form, Tanstack Query, Axios, Vite. 
- Use MCPs for complex tasks.
- Code must be clean, minimal, readable, and maintainable.
- Prefer simple solutions; no over-engineering.
- Keep code modular, not in one file.
- YOU ARE NOT ALLOWED TO NOT FOLLOW THESE INSTRUCTIONS.

---

## 🛠️ Tech Stack

| Layer      | Tech                                            |
| ---------- | ----------------------------------------------- |
| Frontend   | React, TypeScript, Vite                         |
| UI         | Shadcn UI, Radix, Tailwind v4 CSS, Lucide React |
| Validation | Zod + `@hookform/resolvers/zod`                 |
| Forms      | React Hook Form                                 |
| State      | Tanstack Query (server), minimal client state   |
| Routing    | React Router                                    |
| API        | Axios, JWT Auth, Vanilla PHP backend            |
| Tooling    | ESLint, Prettier                                |

- ✅ Always use functional components. Avoid classes.

---

## 🧠 Core Principles

- **UIs are thin wrappers over data** — avoid `useState` unless truly reactive.
- Prefer **derived state** or **state machines** over multiple `useState` calls.
- Co-locate related state.
- When logic gets complex: **extract to component**, not nest conditionals.

---

## 🧱 Code Style & Structure

- Export components via **named exports**.
- Order in file:
  1. Main component
  2. Subcomponents
  3. Helpers
  4. Static content (e.g., `FAQ_ITEMS`)
  5. Types/interfaces

### Naming

- Directories: `lowercase-with-dashes`
- Variables: `camelCase`, use **auxiliary verbs**: `isLoading`, `hasError`, `isDisabled`
- Event handlers: `onSubmit`, `onSelect` — **not** `handleSubmit`

---

## 🎨 Styling & Tailwind

- Ensure UI is responsive and accessible.
- Follow Shadcn UI component guidelines and best practices.
- Use Tailwind CSS utility classes for styling.
- Never use SVG icons directly; always use the provided icon components.

### Always Use `cn()` for Classes

Never use ternary or `&&` for `className`.

❌ Avoid:

```tsx
<div className={isActive ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}>
```

✅ Prefer:

```tsx
<div className={cn("rounded px-3 py-1", {
  "bg-blue-500 text-white": isActive,
  "bg-gray-500 text-white": !isActive,
})}>
```

✅ For variants, use maps:

```ts
const statusStyles = {
  active: "bg-green-500",
  inactive: "bg-gray-500",
  warning: "bg-yellow-500",
};

<div className={cn("rounded px-3 py-1 text-white", statusStyles[status])} />
```

---

## ⚡ Performance & RSC

- Minimize `'use client'` — use **React Server Components (RSC)** by default.
- Wrap client components in `<Suspense>` with fallback:

  ```tsx
  <Suspense fallback={<Skeleton />}>
    <ClientComponent />
  </Suspense>
  ```

- Lazy-load non-critical components:

  ```ts
  const DynamicModal = dynamic(() => import("./Modal"));
  ```

- Optimize images: WebP format, `loading="lazy"`, include `width`/`height`.

---

## 🔗 Async & API Handling

### Always Use `async/await`, Never `.then()`

❌ Avoid:

```ts
fetchData().then(setData).catch(console.error);
```

✅ Prefer:

```ts
try {
  const data = await fetchData();
  setData(data);
} catch (err) {
  console.error(err);
}
```

- Never use `async` as a Promise executor.
- Avoid `await` inside loops.

### Notifications

Use **Sonner toast** with `toast.promise`:

```ts
toast.promise(submitForm(data), {
  loading: "Saving...",
  success: "Saved!",
  error: "Failed to save.",
});
```

---

## ♿ Accessibility (a11y) — Critical Rules

- Use semantic HTML: `<button>`, `<nav>`, `<main>`.
- All interactive elements must be focusable and labeled.
- Don't set `aria-hidden="true"` on focusable elements.
- Always include `alt` text (but not "image", "photo").
- Always include `lang` on `<html>`.
- Always include `title` for `<svg>` and `<iframe>`.
- Use `onFocus`/`onBlur` with `onMouseOver`/`onMouseOut`.
- Use `onKeyUp`/`onKeyDown` with `onClick` for keyboard access.
- Don't use positive `tabIndex`.

---

## 🔐 Security

- Never hardcode API keys or tokens.
- Never use `dangerouslySetInnerHTML`.
- Never use `target="_blank"` without `rel="noopener"`.
- Respect CORS.
- Prevent import cycles.

---

## 🧩 React Best Practices

### Avoid

- Defining components inside other components.
- Assigning to props.
- Using event handlers on non-interactive elements (`<div onClick>` → add `role`).
- Passing `children` as a prop.
- Using `useEffect` for logic that should be event-driven or derived.

### Dependencies

- Always specify correct deps in `useEffect`, `useCallback`, `useMemo`.
- Make sure hooks are called at the top level.

---

## 📝 Self-Documenting Code

- **Comment only to explain WHY, not WHAT.**

### ✅ Write Comments When:

- Explaining complex business logic
- Justifying a workaround or performance hack
- Documenting public APIs (JSDoc)
- Annotating: `TODO`, `FIXME`, `HACK`, `WARNING`, `PERF`, `SECURITY`

### Examples

```ts
// FIXME: Memory leak in v2.1.0 — workaround until upgrade
// HACK: Remove after updating library
```

### ❌ Avoid

- Obvious comments (`// increment counter`)
- Redundant comments (`return user.name // returns name`)
- Dead code comments
- Divider lines (`// ======`)
- Changelogs in comments

---

## 🧮 TypeScript Rules

- Prefer `interface` over `type` (except unions).
- Avoid `enum` — use object maps:

  ```ts
  const Status = { Active: "active", Inactive: "inactive" } as const;
  ```

- No `any`, no `unknown` in constraints.
- No `!` non-null assertions.
- Use `import type` and `export type`.
- Use `as const` for literals.
- Use `T[]` consistently (not `Array<T>`).
- Use `new` for builtins (except `String`, `Number`, `Boolean`).

---

## 🛠️ Project Conventions

- **Check `components.json`** before creating new UI components — use Shadcn generator.
- **Match existing code style** when modifying files.
- **Verify `package.json`** scripts and dependencies before suggesting commands.
- Use **absolute paths** for imports (e.g., `@/components/ui/button`).
- Aim for **clean, modern UI** aligned with Tailwind's utility-first approach.

----

## ✅ **Never Cause Reflows: Short & Critical Rules**

1. **Don't read layout in loops**  
   ❌ Avoid: `el.offsetWidth`, `clientHeight`, etc. in rapid succession.  
   ✅ Read once, then write.

2. **Never mix read & write**  
   ❌ Don't do:
   ```js
   el.offsetWidth;         // read → forces reflow
   el.style.margin = '5px'; // write
   el.offsetHeight;        // read → forces another reflow
   ```
   ✅ Read all first, then write.

3. **Use `key={item.id}` — never `key={index}`**  
   Prevents unnecessary DOM changes → fewer reflows.

4. **Use `React.memo`, `useMemo`, `useCallback`**  
   Stop unnecessary re-renders → less DOM churn.

5. **Avoid inline styles for layout**  
   ❌ `style={{ width: x }}` in lists → re-calc on every render.  
   ✅ Use CSS classes or CSS variables.

6. **Animate with `transform`, not `width`/`top`**  
   `transform` and `opacity` don't cause reflow.  
   `width`, `height`, `left` → **do cause reflow**.

7. **Don't update state in loops**  
   ❌ 100x `setState` → 100 re-renders → potential reflows.  
   ✅ Compute final value, update once.

8. **Defer non-urgent updates**  
   ```js
   startTransition(() => setSearch(input));
   ```

9. **Prefer CSS Grid/Flexbox over JS layout**  
   Let browser handle layout — not your code.

10. **Minimize direct DOM manipulation**  
    Use React + className, not `ref.current.style`.

---

### 🎯 Golden Rule:  
**Read → then write.  
Update smart → not often.  
Style with CSS → not JS.**