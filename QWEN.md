# Qwen Code - Developer Notes

This file contains notes and guidelines to help Qwen Code better understand the project context and generate more accurate and idiomatic code.

## Project Information

- **Project Root**: `C:\laragon\www\finisterre`
- **Date Created**: Wednesday, August 20, 2025
- **Operating System**: win32

## Project Context & Conventions

- **Framework/Libraries**: Based on `package.json`, this project uses React, TypeScript, and Tailwind CSS. It also uses Vite as the build tool.
- **Component Library**: The project has Shadcn UI configured (indicated by `components.json`). Prefer using Shadcn UI components when creating UI elements.
- **Styling**: Use Tailwind CSS classes for styling. Avoid writing custom CSS unless absolutely necessary.
- **File Structure**: New components should generally go in `src/components/`. New pages or routes in `src/pages/` or `src/routes/` if applicable.
- **State Management**: If state management is needed, consider using React's built-in hooks (useState, useReducer, useContext).
- **Data Fetching**: Use `fetch` or libraries like `axios` for API calls and tanstack react query for data fetching.
- **Testing**: If tests are added, they should follow the project's existing testing setup (likely Vitest and React Testing Library based on Vite).

## Code Generation Preferences

- **Idiomatic Code**: Always strive to write code that is idiomatic to the project's existing tech stack.
- **Readability**: Prioritize code readability and maintainability. Add comments for complex logic.
- **Conciseness**: While being readable, aim for concise solutions.
- **Type Safety**: Fully leverage TypeScript's type system. Define interfaces and types for props, state, and API responses. Always use `zod` for form validation with `react-hook-form`'s `zodResolver`.
- **Asynchronous Operations**: Prefer `async/await` syntax over `.then()` for handling promises. Use `@tanstack/react-query` for server state management and data fetching.
- **Notifications**: Use `sonner` for toast notifications. Prefer the `toast.promise` API for asynchronous operations.
- **Error Handling**: Always consider and implement appropriate error handling, especially for asynchronous operations like API calls.
- **Performance**: Be mindful of performance. Use `React.memo`, `useCallback`, and `useMemo` where appropriate to optimize renders.

## Specific Instructions for Qwen Code

- When creating new components, check `components.json` and use Shadcn UI generator if applicable.
- When modifying existing files, carefully analyze the surrounding code to match its style and conventions.
- Before suggesting or running build/lint/test commands, always check `package.json` scripts to use the correct project-specific commands.
- If unsure about a library or approach, check `package.json` dependencies first.
- Always verify file paths are correct and use absolute paths when interacting with the file system.
- When generating UI, aim for a clean, modern look that aligns with Tailwind's utility-first approach and any Material Design principles implied by Shadcn UI.

## Notes & Reminders

- Add specific project-specific notes, reminders, or context here as the project evolves.
- Document any non-standard configurations or setup steps.