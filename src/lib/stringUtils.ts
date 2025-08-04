// ✨ Provides string utilities for global use
/**
 * Capitalizes the first letter of each word in a string.
 * @param str The input string
 * @returns The string with each word capitalized
 */
export function capitalizeWords(str: string): string {
  if (typeof str !== "string") return "";
  return str.replace(
    /\b\w+/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}
