import { type GridLayout } from '@nativescript/core';

import { HTMLLayoutBaseElement } from './HTMLLayoutBaseElement';

export class HTMLGridLayoutElement extends HTMLLayoutBaseElement<GridLayout> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  readonly view = new (require('@nativescript/core')
    .GridLayout as typeof GridLayout)();
}
