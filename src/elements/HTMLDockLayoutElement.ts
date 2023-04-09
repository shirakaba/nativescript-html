import { type DockLayout } from '@nativescript/core';

import { HTMLLayoutBaseElement } from './HTMLLayoutBaseElement';

export class HTMLDockLayoutElement extends HTMLLayoutBaseElement<DockLayout> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  readonly view = new (require('@nativescript/core')
    .DockLayout as typeof DockLayout)();
}
