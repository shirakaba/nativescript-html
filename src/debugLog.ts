import { Trace } from '@nativescript/core';

type DebugCategory = string | typeof Trace.categories;
export function debug(
  s: unknown,
  category: DebugCategory = Trace.categories.Debug
) {
  Trace.write(s, category as string, Trace.messageType.log);
}
