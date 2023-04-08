import { type WrapLayout } from '@nativescript/core';

import { HTMLLayoutBaseElement } from './HTMLLayoutBaseElement';

export class HTMLWrapLayoutElement extends HTMLLayoutBaseElement<WrapLayout> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  readonly view = new (require('@nativescript/core')
    .WrapLayout as typeof WrapLayout)();
}
