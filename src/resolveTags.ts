const TAG = /<(\w+)>(.*?)<\/\1>/g;

export function resolveTags<T>(
  input: string,
  resolvers: Record<string, unknown>,
  /** This allows us to wrap a ReactNode in a Fragment with a key */
  wrap: (input: T | string) => T,
): Array<T> {
  const result: Array<T> = [];
  let index = 0;
  input.replace(
    TAG,
    (match: string, tagName: string, content: string, i: number) => {
      if (i > index) {
        result.push(wrap(input.slice(index, i)));
        index = i;
      }
      index += match.length;
      const resolver = resolvers[tagName];
      const node = typeof resolver === 'function' ? resolver(content) : match;
      result.push(wrap(node));
      return match;
    },
  );
  if (index < input.length) {
    result.push(wrap(input.slice(index)));
  }
  return result;
}
