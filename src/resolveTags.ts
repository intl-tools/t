const TAG = /<(.*?)>(.*?)<\/(.*?)>/g;

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
    (
      match: string,
      startTag: string,
      content: string,
      endTag: string,
      i: number,
    ) => {
      if (i > index) {
        result.push(wrap(input.slice(index, i)));
        index = i;
      }
      index += match.length;
      if (startTag === endTag) {
        const resolver = resolvers[startTag];
        const node = typeof resolver === 'function' ? resolver(content) : match;
        result.push(wrap(node));
      } else {
        result.push(wrap(match));
      }
      return match;
    },
  );
  if (index < input.length) {
    result.push(wrap(input.slice(index)));
  }
  return result;
}
