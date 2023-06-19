export type ExtractPlaceholders<T extends string> = string extends T
  ? never
  : T extends `${infer _Pre}{${infer Name}}${infer Rest}`
  ? Name | ExtractPlaceholders<Rest>
  : never;

type IfEql<T extends string, U extends string> = [T] extends [U] ? T : never;

export type ExtractTags<T extends string> = string extends T
  ? never
  : T extends `${infer _Pre}<${infer StartTag}>${infer _Content}</${infer EndTag}>${infer Rest}`
  ? IfEql<StartTag, EndTag> | ExtractTags<Rest>
  : never;

type RequiredKeys<T> = {
  [K in keyof T]-?: NonNullable<unknown> extends Pick<T, K> ? never : K;
} extends { [_ in keyof T]-?: infer U }
  ? U
  : never;

export type MaybeParam<O extends Record<string, unknown>> = [
  RequiredKeys<O>,
] extends [never]
  ? [values?: O]
  : [values: O];

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
