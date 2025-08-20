---
applyTo: "**"
---

- Don't use `accessKey` attribute on any HTML element.
- Don't set `aria-hidden="true"` on focusable elements.
- Don't add ARIA roles, states, and properties to elements that don't support them.
- Don't use distracting elements like `<marquee>` or `<blink>`.
- Only use the `scope` prop on `<th>` elements.
- Don't assign non-interactive ARIA roles to interactive HTML elements.
- Make sure label elements have text content and are associated with an input.
- Don't assign interactive ARIA roles to non-interactive HTML elements.
- Don't assign `tabIndex` to non-interactive HTML elements.
- Don't use positive integers for `tabIndex` property.
- Don't include "image", "picture", or "photo" in img `alt` prop.
- Don't use explicit role property that's the same as the implicit/default role.
- Make static elements with click handlers use a valid role attribute.
- Always include a `title` element for SVG elements.
- Give all elements requiring alt text meaningful information for screen readers.
- Make sure anchors have content that's accessible to screen readers.
- Assign `tabIndex` to non-interactive HTML elements with `aria-activedescendant`.
- Include all required ARIA attributes for elements with ARIA roles.
- Make sure ARIA properties are valid for the element's supported roles.
- Always include a `type` attribute for button elements.
- Make elements with interactive roles and handlers focusable.
- Give heading elements content that's accessible to screen readers (not hidden with `aria-hidden`).
- Always include a `lang` attribute on the html element.
- Always include a `title` attribute for iframe elements.
- Accompany `onClick` with at least one of: `onKeyUp`, `onKeyDown`, or `onKeyPress`.
- Accompany `onMouseOver`/`onMouseOut` with `onFocus`/`onBlur`.
- Include caption tracks for audio and video elements.
- Use semantic elements instead of role attributes in JSX.
- Make sure all anchors are valid and navigable.
- Ensure all ARIA properties (`aria-*`) are valid.
- Use valid, non-abstract ARIA roles for elements with ARIA roles.
- Use valid ARIA state and property values.
- Use valid values for the `autocomplete` attribute on input elements.
- Use correct ISO language/country codes for the `lang` attribute.
- Don't use consecutive spaces in regular expression literals.
- Don't use the `arguments` object.
- Don't use primitive type aliases or misleading types.
- Don't use the comma operator.
- Don't use empty type parameters in type aliases and interfaces.
- Don't write functions that exceed a given Cognitive Complexity score.
- Don't nest describe() blocks too deeply in test files.
- Don't use unnecessary boolean casts.
- Don't use unnecessary callbacks with flatMap.
- Use for...of statements instead of Array.forEach.
- Don't create classes that only have static members (like a static namespace).
- Don't use this and super in static contexts.
- Don't use unnecessary catch clauses.
- Don't use unnecessary constructors.
- Don't use unnecessary continue statements.
- Don't export empty modules that don't change anything.
- Don't use unnecessary escape sequences in regular expression literals.
- Don't use unnecessary fragments.
- Don't use unnecessary labels.
- Don't use unnecessary nested block statements.
- Don't rename imports, exports, and destructured assignments to the same name.
- Don't use unnecessary string or template literal concatenation.
- Don't use String.raw in template literals when there are no escape sequences.
- Don't use useless case statements in switch statements.
- Don't use ternary operators when simpler alternatives exist.
- Don't use useless `this` aliasing.
- Don't use any or unknown as type constraints.
- Don't initialize variables to undefined.
- Don't use void operators (they're not familiar).
- Use arrow functions instead of function expressions.
- Use Date.now() to get milliseconds since the Unix Epoch.
- Use .flatMap() instead of map().flat() when possible.
- Use literal property access instead of computed property access.
- Don't use parseInt() or Number.parseInt() when binary, octal, or hexadecimal literals work.
- Use concise optional chaining instead of chained logical expressions.
- Use regular expression literals instead of the RegExp constructor when possible.
- Don't use number literal object member names that aren't base 10 or use underscore separators.
- Remove redundant terms from logical expressions.
- Use while loops instead of for loops when you don't need initializer and update expressions.
- Don't pass children as props.
- Don't reassign const variables.
- Don't use constant expressions in conditions.
- Don't use `Math.min` and `Math.max` to clamp values when the result is constant.
- Don't return a value from a constructor.
- Don't use empty character classes in regular expression literals.
- Don't use empty destructuring patterns.
- Don't call global object properties as functions.
- Don't declare functions and vars that are accessible outside their block.
- Make sure builtins are correctly instantiated.
- Don't use super() incorrectly inside classes. Also check that super() is called in classes that extend other constructors.
- Don't use variables and function parameters before they're declared.
- Don't use \8 and \9 escape sequences in string literals.
- Don't use literal numbers that lose precision.
- Don't use the return value of React.render.
- Don't assign a value to itself.
- Don't return a value from a setter.
- Don't compare expressions that modify string case with non-compliant values.
- Don't use lexical declarations in switch clauses.
- Don't use variables that haven't been declared in the document.
- Don't write unreachable code.
- Make sure super() is called exactly once on every code path in a class constructor before this is accessed if the class has a superclass.
- Don't use control flow statements in finally blocks.
- Don't use optional chaining where undefined values aren't allowed.
- Don't have unused function parameters.
- Don't have unused imports.
- Don't have unused labels.
- Don't have unused private class members.
- Don't have unused variables.
- Make sure void (self-closing) elements don't have children.
- Don't return a value from a function that has a 'void' return type.
- Make sure all dependencies are correctly specified in React hooks.
- Make sure all React hooks are called from the top level of component functions.
- Use isNaN() when checking for NaN.
- Don't forget key props in iterators and collection literals.
- Make sure "for" loop update clauses move the counter in the right direction.
- Make sure typeof expressions are compared to valid values.
- Make sure generator functions contain yield.
- Don't use await inside loops.
- Don't use bitwise operators.
- Don't use expressions where the operation doesn't change the value.
- Don't destructure props inside JSX components in Solid projects.
- Make sure Promise-like statements are handled appropriately.
- Don't use __dirname and __filename in the global scope.
- Prevent import cycles.
- Don't define React components inside other components.
- Don't use event handlers on non-interactive elements.
- Don't assign to React component props.
- Don't use configured elements.
- Don't hardcode sensitive data like API keys and tokens.
- Don't let variable declarations shadow variables from outer scopes.
- Don't use the TypeScript directive @ts-ignore.
- Prevent duplicate polyfills from Polyfill.io.
- Don't use useless backreferences in regular expressions that always match empty strings.
- Don't use unnecessary escapes in string literals.
- Don't use useless undefined.
- Make sure getters and setters for the same property are next to each other in class and object definitions.
- Make sure object literals are declared consistently (defaults to explicit definitions).
- Use static Response methods instead of new Response() constructor when possible.
- Make sure switch-case statements are exhaustive.
- Make sure the `preconnect` attribute is used when using Google Fonts.
- Use `Array#{indexOf,lastIndexOf}()` instead of `Array#{findIndex,findLastIndex}()` when looking for the index of an item.
- Make sure iterable callbacks return consistent values.
- Use `with { type: "json" }` for JSON module imports.
- Use numeric separators in numeric literals.
- Use object spread instead of `Object.assign()` when constructing new objects.
- Always use the radix argument when using `parseInt()`.
- Make sure JSDoc comment lines start with a single asterisk, except for the first one.
- Include a description parameter for `Symbol()`.
- Don't use spread (`...`) syntax on accumulators.
- Don't use the `delete` operator.
- Don't access namespace imports dynamically.
- Don't use `<img>` elements in Next.js projects.
- Don't use namespace imports.
- Declare regex literals at the top level.
- Don't use `target="_blank"` without `rel="noopener"`.
- Don't use dangerous JSX props.
- Don't use both `children` and `dangerouslySetInnerHTML` props on the same element.
- Don't use global `eval()`.
- Don't use callbacks in asynchronous tests and hooks.
- Don't use TypeScript enums.
- Don't export imported variables.
- Don't use `<head>` elements in Next.js projects.
- Don't add type annotations to variables, parameters, and class properties that are initialized with literal expressions.
- Don't use TypeScript namespaces.
- Don't use negation in `if` statements that have `else` clauses.
- Don't use nested ternary expressions.
- Don't use non-null assertions with the `!` postfix operator.
- Don't reassign function parameters.
- Don't use parameter properties in class constructors.
- This rule lets you specify global variable names you don't want to use in your application.
- Don't use specified modules when loaded by import or require.
- Don't use user-defined types.
- Don't use constants whose value is the upper-case version of their name.
- Use `String.slice()` instead of `String.substr()` and `String.substring()`.
- Don't use template literals if you don't need interpolation or special-character handling.
- Don't use `else` blocks when the `if` block breaks early.
- Don't use yoda expressions.
- Don't use Array constructors.
- Use `as const` instead of literal types and type annotations.
- Use `at()` instead of integer index access.
- Follow curly brace conventions.
- Use `else if` instead of nested `if` statements in `else` clauses.
- Use single `if` statements instead of nested `if` clauses.
- Use either `T[]` or `Array<T>` consistently.
- Use `new` for all builtins except `String`, `Number`, and `Boolean`.
- Use consistent accessibility modifiers on class properties and methods.
- Use `const` declarations for variables that are only assigned once.
- Put default function parameters and optional function parameters last.
- Include a `default` clause in switch statements.
- Initialize each enum member value explicitly.
- Use the `**` operator instead of `Math.pow`.
- Use `export type` for types.
- Use `for-of` loops when you need the index to extract an item from the iterated array.
- Use `<>...</>` instead of `<Fragment>...</Fragment>`.
- Use `import type` for types.
- Make sure all enum members are literal values.
- Use `node:assert/strict` over `node:assert`.
- Use the `node:` protocol for Node.js builtin modules.
- Use Number properties instead of global ones.
- Don't add extra closing tags for components without children.
- Use assignment operator shorthand where possible.
- Use function types instead of object types with call signatures.
- Use template literals over string concatenation.
- Use `new` when throwing an error.
- Don't throw non-Error values.
- Use `String.trimStart()` and `String.trimEnd()` over `String.trimLeft()` and `String.trimRight()`.
- Use standard constants instead of approximated literals.
- Don't use Array index in keys.
- Don't assign values in expressions.
- Don't use async functions as Promise executors.
- Don't reassign exceptions in catch clauses.
- Don't reassign class members.
- Don't insert comments as text nodes.
- Don't compare against -0.
- Don't use labeled statements that aren't loops.
- Don't use void type outside of generic or return types.
- Don't use console.
- Don't use TypeScript const enum.
- Don't use control characters and escape sequences that match control characters in regular expression literals.
- Don't use debugger.
- Don't assign directly to document.cookie.
- Don't import next/document outside of pages/_document.jsx in Next.js projects.
- Use `===` and `!==`.
- Don't use duplicate case labels.
- Don't use duplicate class members.
- Don't use duplicate conditions in if-else-if chains.
- Don't assign JSX properties multiple times.
- Don't use two keys with the same name inside objects.
- Don't use duplicate function parameter names.
- Don't have duplicate hooks in describe blocks.
- Don't use empty block statements and static blocks.
- Don't declare empty interfaces.
- Don't let variables evolve into any type through reassignments.
- Don't use the any type.
- Don't use export or module.exports in test files.
- Don't misuse the non-null assertion operator (!) in TypeScript files.
- Don't let switch clauses fall through.
- Don't use focused tests.
- Don't reassign function declarations.
- Don't allow assignments to native objects and read-only global variables.
- Use Number.isFinite instead of global isFinite.
- Use Number.isNaN instead of global isNaN.
- Don't use the next/head module in pages/_document.js on Next.js projects.
- Don't use implicit any type on variable declarations.
- Don't assign to imported bindings.
- Don't use irregular whitespace characters.
- Don't use labels that share a name with a variable.
- Don't use characters made with multiple code points in character class syntax.
- Make sure to use new and constructor properly.
- Make sure the assertion function, like expect, is placed inside an it() function call.
- Don't use shorthand assign when the variable appears on both sides.
- Don't use octal escape sequences in string literals.
- Don't use Object.prototype builtins directly.
- Don't redeclare variables, functions, classes, and types in the same scope.
- Don't have redundant "use strict".
- Don't compare things where both sides are exactly the same.
- Don't let identifiers shadow restricted names.
- Don't use disabled tests.
- Don't use sparse arrays (arrays with holes).
- Watch out for possible "wrong" semicolons inside JSX elements.
- Don't use template literal placeholder syntax in regular strings.
- Don't use the then property.
- Don't merge interfaces and classes unsafely.
- Don't use unsafe negation.
- Don't use var.
- Don't use with statements in non-strict contexts.
- Don't use overload signatures that aren't next to each other.
- Make sure async functions actually use await.
- Make sure default clauses in switch statements come last.
- Make sure to pass a message value when creating a built-in error.
- Make sure get methods always return a value.
- Use a recommended display strategy with Google Fonts.
- Make sure for-in loops include an if statement.
- Use Array.isArray() instead of instanceof Array.
- Use the namespace keyword instead of the module keyword to declare TypeScript namespaces.
- Make sure to use the digits argument with Number#toFixed().
- Make sure to use the "use strict" directive in script files.

---
---
applyTo: "**"
---

# Expert Guidelines

You are an expert fullstack web developer who specialized in TypeScript, React Query, React Router, React, React Hook Form, Zod @hookform/resolvers/zod, Axios, Shadcn UI, Radix UI and Tailwind with 40 years experience.

## Tech Stack

- TypeScript
- Vite (build tool)
- React
- Shadcn/ui, Radix UI and Tailwind CSS
- Zod (validation)
- Lucide React (icons)
- Axios
- React Router
- React Tanstack Query
- React Hook Form
- Vanilla PHP
- JWT for Auth
- Eslint for linting and prettier for formatting

## Task instructions

- When asked to build frontend, use React + TypeScript with Shadcn/ui.
- Respect CORS and security in API calls.

## Code Style and Structure

- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Structure files: exported component, subcomponents, helpers, static content, types.
- Use console.log({value}) instead of console.log(value)
- Use onCallback instead of handleCallback

## Naming Conventions

- Use lowercase with dashes for directories (e.g., components/auth-wizard).
- Favor named exports for components.

## TypeScript Usage

- Use TypeScript for all code; prefer interfaces over types.
- Avoid enums; use maps instead.
- Use functional components with TypeScript interfaces.

## Syntax and Formatting

- Use the "function" keyword for pure functions.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Use declarative JSX.

## UI and Styling

- Use Shadcn UI, Radix, and Tailwind for components and styling.
- Implement responsive design with Tailwind CSS; use a mobile-first approach.

## Performance Optimization

- Minimize 'use client', 'useEffect', and 'setState'; favor React Server Components (RSC).
- Wrap client components in Suspense with fallback.
- Use dynamic loading for non-critical components.
- Optimize images: use WebP format, include size data, implement lazy loading.

---
---
applyTo: "**"
---

# React Patterns and Best Practices

## Core Philosophy

- **UIs are thin wrappers over data** - avoid using local state (like useState) unless absolutely necessary and it's independent of business logic
- Even when local state seems needed, consider if you can flatten the UI state into a basic calculation
- useState is only necessary if it's truly reactive and cannot be derived

## State Management

- **Choose state machines over multiple useStates** - multiple useState calls make code harder to reason about
- Prefer a single state object with reducers for complex state logic
- Co-locate related state rather than spreading it across multiple useState calls

## Component Architecture

- **Create new component abstractions when nesting conditional logic**
- Move complex logic to new components rather than deeply nested conditionals
- Use ternaries only for small, easily readable logic
- Avoid top-level if/else statements in JSX - extract to components instead

## Class Name Handling (Tailwind + React)

- **Always use `cn` for className merging** — never use ternary (`? :`) or nullish coalescing (`??`) directly for class name selection.
- Place base styles as the first `cn` argument, followed by conditional styles.
- For multiple variants (status, category, size, etc.), prefer using mapping objects to avoid repeated `&&` checks.

## Side Effects and Dependencies

- **Avoid putting dependent logic in useEffects** - it causes misdirection about what the logic is doing
- Choose to explicitly define logic rather than depend on implicit reactive behavior
- When useEffect is necessary, be explicit about dependencies and cleanup
- Prefer derived state and event handlers over effect-driven logic

## Timing and Async Patterns

- **setTimeouts are flaky and usually a hack** - always provide a comment explaining why setTimeout is needed
- Consider alternatives like:
  - Proper loading states
  - Suspense boundaries
  - Event-driven patterns
  - State machines with delayed transitions
  - requestAnimateFrame and queuMicrotask

## Code Quality Impact

These patterns prevent subtle bugs that pile up into major issues. While code may "work" without following these guidelines, violations often lead to:

- Hard-to-debug timing issues
- Unexpected re-renders
- State synchronization problems
- Complex refactoring requirements

## Examples

### ❌ Avoid: Ternary for Tailwind classes

```tsx
<span className={status === "active" ? "flex rounded bg-green-500 px-2 py-1 text-white" : "flex rounded bg-gray-500 px-2 py-1 text-white"}>Active</span>
```

### ✅ Prefer: cn utility

```tsx
<span
  className={cn("flex rounded px-2 py-1", {
    "bg-green-500 text-white": status === "active",
    "bg-gray-500 text-white": status !== "active",
  })}
>
  Active
</span>
```

### ✅ Prefer: `cn` for className merging

```tsx
const statusClasses = {
  active: "bg-green-500",
  inactive: "bg-gray-500",
  warning: "bg-yellow-500",
};

<span className={cn("flex rounded px-2 py-1 text-white", statusClasses[status] ?? statusClasses.inactive)}>Active</span>;
```

### ❌ Avoid: Multiple useState

```tsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);
```

### ✅ Prefer: State machine

```tsx
function useLazyRef<T>(fn: () => T) {
  const ref = React.useRef<T | null>(null);

  if (ref.current === null) {
    ref.current = fn();
  }

  return ref as React.RefObject<T>;
}

interface Store<T> {
  subscribe: (callback: () => void) => () => void;
  getState: () => T;
  setState: <K extends keyof T>(key: K, value: T[K]) => void;
  notify: () => void;
}

function createStore<T>(
  listenersRef: React.RefObject<Set<() => void>>,
  stateRef: React.RefObject<T>,
  onValueChange?: Partial<{
    [K in keyof T]: (value: T[K], store: Store<T>) => void;
  }>,
): Store<T> {
  const store: Store<T> = {
    subscribe: (cb) => {
      listenersRef.current.add(cb);
      return () => listenersRef.current.delete(cb);
    },
    getState: () => stateRef.current,
    setState: (key, value) => {
      if (Object.is(stateRef.current[key], value)) return;
      stateRef.current[key] = value;
      onValueChange?.[key]?.(value, store);
      store.notify();
    },
    notify: () => {
      for (const cb of listenersRef.current) {
        cb();
      }
    },
  };

  return store;
}

function useStoreSelector<T, U>(store: Store<T>, selector: (state: T) => U): U {
  const getSnapshot = React.useCallback(() => selector(store.snapshot()), [store, selector]);

  return React.useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
```

### ❌ Avoid: Complex conditionals in JSX

```tsx
return <div>{user ? user.isAdmin ? <AdminPanel /> : user.isPremium ? <PremiumDashboard /> : <BasicDashboard /> : <LoginForm />}</div>;
```

### ✅ Prefer: Component abstraction

```tsx
function UserDashboard({ user }) {
  if (!user) return <LoginForm />;
  if (user.isAdmin) return <AdminPanel />;
  if (user.isPremium) return <PremiumDashboard />;
  return <BasicDashboard />;
}
```

### ❌ Avoid: Effect-driven logic

```tsx
useEffect(() => {
  if (user && user.preferences) {
    setTheme(user.preferences.theme);
  }
}, [user]);
```

### ✅ Prefer: Derived values

```tsx
const theme = user?.preferences?.theme ?? "default";
```

## Promise Handling Rule

- Always use `async/await` instead of `.then()` when working with Promises in React or JavaScript.
- Never chain `.then()` for handling results or errors.
- Use `try/catch` for error handling.
- If converting old code, rewrite `.then()` chains into clean `async/await` blocks.

### ❌ Avoid: .then chaining for async logic

```javascript
fetchData()
  .then((res) => {
    setData(res);
  })
  .catch((err) => {
    console.error(err);
  });
```

### ✅ Prefer: Async/await with error handling

```javascript
try {
  const res = await fetchData();
  setData(res);
} catch (err) {
  console.error(err);
}
```

---
---
description: "Guidelines for GitHub Copilot to write comments to achieve self-explanatory code with less comments. Examples are in JavaScript but it should work on any language that has comments."
applyTo: "**"
---

# Self-explanatory Code Commenting Instructions

## Core Principle

**Write code that speaks for itself. Comment only when necessary to explain WHY, not WHAT.**
We do not need comments most of the time.

**Instruction:**  
When writing any code comments, explanations, or feedback, always begin the comment with an emoji that fits the context. The emoji should be placed immediately after the `//` or `/*` in code comments, or at the very start of the message when outside code.

---

**Examples:**

**JavaScript Example:**

````javascript
// ⚡️ I need to optimize this function for better performance
function calculateSum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

## Commenting Guidelines

### ❌ AVOID These Comment Types

**Obvious Comments**
```javascript
// Bad: States the obvious
let counter = 0;  // Initialize counter to zero
counter++;  // Increment counter by one
````

**Redundant Comments**

```javascript
// Bad: Comment repeats the code
function getUserName() {
  return user.name; // Return the user's name
}
```

**Outdated Comments**

```javascript
// Bad: Comment doesn't match the code
// Calculate tax at 5% rate
const tax = price * 0.08; // Actually 8%
```

### ✅ WRITE These Comment Types

**Complex Business Logic**

```javascript
// Good: Explains WHY this specific calculation
// Apply progressive tax brackets: 10% up to 10k, 20% above
const tax = calculateProgressiveTax(income, [0.1, 0.2], [10000]);
```

**Non-obvious Algorithms**

```javascript
// Good: Explains the algorithm choice
// Using Floyd-Warshall for all-pairs shortest paths
// because we need distances between all nodes
for (let k = 0; k < vertices; k++) {
  for (let i = 0; i < vertices; i++) {
    for (let j = 0; j < vertices; j++) {
      // ... implementation
    }
  }
}
```

**Regex Patterns**

```javascript
// Good: Explains what the regex matches
// Match email format: username@domain.extension
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```

**API Constraints or Gotchas**

```javascript
// Good: Explains external constraint
// GitHub API rate limit: 5000 requests/hour for authenticated users
await rateLimiter.wait();
const response = await fetch(githubApiUrl);
```

## Decision Framework

Before writing a comment, ask:

1. **Is the code self-explanatory?** → No comment needed
2. **Would a better variable/function name eliminate the need?** → Refactor instead
3. **Does this explain WHY, not WHAT?** → Good comment
4. **Will this help future maintainers?** → Good comment

## Special Cases for Comments

### Public APIs

```javascript
/**
 * Calculate compound interest using the standard formula.
 *
 * @param {number} principal - Initial amount invested
 * @param {number} rate - Annual interest rate (as decimal, e.g., 0.05 for 5%)
 * @param {number} time - Time period in years
 * @param {number} compoundFrequency - How many times per year interest compounds (default: 1)
 * @returns {number} Final amount after compound interest
 */
function calculateCompoundInterest(
  principal,
  rate,
  time,
  compoundFrequency = 1
) {
  // ... implementation
}
```

### Configuration and Constants

```javascript
// Good: Explains the source or reasoning
const MAX_RETRIES = 3; // Based on network reliability studies
const API_TIMEOUT = 5000; // AWS Lambda timeout is 15s, leaving buffer
```

### Annotations

```javascript
// TODO: Replace with proper user authentication after security review
// FIXME: Memory leak in production - investigate connection pooling
// HACK: Workaround for bug in library v2.1.0 - remove after upgrade
// NOTE: This implementation assumes UTC timezone for all calculations
// WARNING: This function modifies the original array instead of creating a copy
// PERF: Consider caching this result if called frequently in hot path
// SECURITY: Validate input to prevent SQL injection before using in query
// BUG: Edge case failure when array is empty - needs investigation
// REFACTOR: Extract this logic into separate utility function for reusability
// DEPRECATED: Use newApiFunction() instead - this will be removed in v3.0
```

## Anti-Patterns to Avoid

### Dead Code Comments

```javascript
// Bad: Don't comment out code
// const oldFunction = () => { ... };
const newFunction = () => { ... };
```

### Changelog Comments

```javascript
// Bad: Don't maintain history in comments
// Modified by John on 2023-01-15
// Fixed bug reported by Sarah on 2023-02-03
function processData() {
  // ... implementation
}
```

### Divider Comments

```javascript
// Bad: Don't use decorative comments
//=====================================
// UTILITY FUNCTIONS
//=====================================
```

## Quality Checklist

Before committing, ensure your comments:

- [ ] Explain WHY, not WHAT
- [ ] Are grammatically correct and clear
- [ ] Will remain accurate as code evolves
- [ ] Add genuine value to code understanding
- [ ] Are placed appropriately (above the code they describe)
- [ ] Use proper spelling and professional language

## Summary

Remember: **The best comment is the one you don't need to write because the code is self-documenting.**

```