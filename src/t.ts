type ExtractTokens<T extends string> = string extends T
  ? never
  : T extends `${infer _Start}{${infer Name}}${infer Rest}`
  ? Name | ExtractTokens<Rest>
  : never;

type MaybeValues<List> = List extends string
  ? [values: { [K in List]: unknown }]
  : [];

// This matches words inside curly braces.
const TOKEN = /\{(\w+)\}/g;

/**
 * This function doesn't actually do anything besides a bit of string formatting
 * (see `interpolate` below). Importantly though, it serves as a way to "mark"
 * string literals in the codebase, so they can be statically extracted and
 * translated offline.
 */
export function t<S extends string>(
  text: S,
  ...[values]: MaybeValues<ExtractTokens<S>>
) {
  return values ? interpolate(text, values) : text;
}

/**
 * This function replaces placeholder tokens in a string with the corresponding
 * value from `values` object.
 * For example:
 * interpolate('Hello {name}', { name: 'Alice' }) // "Hello Alice"
 */
function interpolate(input: string, values: Record<string, unknown>) {
  return input.replace(TOKEN, (match: string, word: string) => {
    return values[word] != null ? String(values[word]) : match;
  });
}
