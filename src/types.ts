export type ExtractPlaceholders<T extends string> = string extends T
  ? never
  : T extends `${infer _Start}{${infer Name}}${infer Rest}`
  ? Name | ExtractPlaceholders<Rest>
  : never;

export type MaybeValues<List extends string> = [List] extends [never]
  ? []
  : [values: { [K in List]: unknown }];
