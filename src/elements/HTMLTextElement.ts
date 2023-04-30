import { Label } from '@nativescript/core';

import { HTMLTextBaseElement } from './HTMLTextBaseElement';

// Can't use the name 'label' as that clashes with HTML
export abstract class HTMLTextElement<
  N extends Label = Label
> extends HTMLTextBaseElement<N> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  readonly view = new (require('@nativescript/core')
    .Label as typeof Label)() as N;
}
