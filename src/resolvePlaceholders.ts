const PLACEHOLDER = /\{(\w+)\}/g;

/**
 * This function replaces placeholder tokens in a string with the corresponding
 * value from `values` object.
 * For example:
 * resolvePlaceholders('Hello {name}', { name: 'Alice' }) // "Hello Alice"
 */
export function resolvePlaceholders(
  input: string,
  values: Record<string, unknown>,
) {
  return input.replace(PLACEHOLDER, (match: string, word: string) => {
    return values[word] != null ? String(values[word]) : match;
  });
}
