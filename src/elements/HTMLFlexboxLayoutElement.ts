import { type FlexboxLayout } from '@nativescript/core';

import { HTMLLayoutBaseElement } from './HTMLLayoutBaseElement';

export class HTMLFlexboxLayoutElement extends HTMLLayoutBaseElement<FlexboxLayout> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  readonly view = new (require('@nativescript/core')
    .FlexboxLayout as typeof FlexboxLayout)();
}
