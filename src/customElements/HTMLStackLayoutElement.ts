import { type StackLayout } from '@nativescript/core';

import { HTMLLayoutBaseElement } from './HTMLLayoutBaseElement';

export class HTMLStackLayoutElement extends HTMLLayoutBaseElement<StackLayout> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  readonly view = new (require('@nativescript/core')
    .StackLayout as typeof StackLayout)();
}
