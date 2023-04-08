import { type AbsoluteLayout } from '@nativescript/core';

import { HTMLLayoutBaseElement } from './HTMLLayoutBaseElement';

export class HTMLAbsoluteLayoutElement extends HTMLLayoutBaseElement<AbsoluteLayout> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  readonly view = new (require('@nativescript/core')
    .AbsoluteLayout as typeof AbsoluteLayout)();
}
