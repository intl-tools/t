import React, { Fragment, type ReactNode } from 'react';

import { resolvePlaceholders } from './resolvePlaceholders';
import { resolveTags } from './resolveTags';
import { Expand, ExtractPlaceholders, ExtractTags, MaybeParam } from './types';

type Parse<S extends string> = Expand<
  Record<ExtractPlaceholders<S>, unknown> &
    Record<ExtractTags<S>, (content: string) => ReactNode>
>;

export type Translate = <S extends string>(
  text: S,
  ...[values]: MaybeParam<Parse<S>>
) => ReactNode;

/**
 * React version of the t() function; takes a string and some parameters and
 * returns a fully-resolved ReactNode.
 */
export const t: Translate = (text, ...[values]) => {
  return values ? resolveAll(text, values) : text;
};

function resolveAll(input: string, values: Record<string, unknown>) {
  const resolvedText = resolvePlaceholders(input, values);
  return resolveTagsReact(resolvedText, values);
}

/**
 * This function accepts ranges of text delineated by a start and end tag
 * (syntax similar to html). The text between start and end tags will be passed
 * into a render function named after the tag name.
 * For example:
 * resolveTags('Hello <b>world</b>', { b: (content) => <Bold>{content}</Bold> })
 */
function resolveTagsReact(input: string, resolvers: Record<string, unknown>) {
  let i = 0;
  const result = resolveTags<ReactNode>(input, resolvers, (node) => (
    <Fragment key={i++}>{node}</Fragment>
  ));
  return <>{result}</>;
}
