import { Label } from '@nativescript/core';

import { HTMLTextBaseElement } from './HTMLTextBaseElement';

// Can't use the name 'label' as that clashes with HTML
export abstract class HTMLNLabelElement<
  N extends Label = Label
> extends HTMLTextBaseElement<N> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  readonly view = new (require('@nativescript/core')
    .Label as typeof Label)() as N;

  constructor() {
    super();

    // CSS doesn't seem to work for this
    this.view.maxLines = 0;
  }
}
