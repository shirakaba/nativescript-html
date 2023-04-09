import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { FlexboxLayout, TextView } from '@nativescript/core';

import { patch as patchEvents } from './EventTarget';
import {
  registerAllElements,
  HTMLAbsoluteLayoutElement,
  HTMLDockLayoutElement,
  HTMLFlexboxLayoutElement,
  HTMLGridLayoutElement,
  HTMLStackLayoutElement,
  HTMLWrapLayoutElement,
} from './elements';
import { patchCreateElement } from './elements/NHTMLElement';
import { patch as patchText } from './elements/Text';

// Register happy-dom classes like Event, EventTarget on the global namespace.
GlobalRegistrator.register();

// Patch NativeScript events and gestures.
patchEvents();

// Patch document.createElement to help with Custom Element setup.
patchCreateElement(Document);

// Patch window and document.createTextNode() to use our doctored Text, and .
patchText(window, Document);

// Register all the HTML Custom Elements (wrappers around NativeScript views).
registerAllElements();

// Tools for anyone to make their own custom elements.
export { HTMLLayoutBaseElement } from './elements/HTMLLayoutBaseElement';
export { NHTMLElement } from './elements/NHTMLElement';

declare global {
  interface HTMLElementTagNameMap {
    'absolute-layout': HTMLAbsoluteLayoutElement;
    'dock-layout': HTMLDockLayoutElement;
    'flexbox-layout': HTMLFlexboxLayoutElement;
    'grid-layout': HTMLGridLayoutElement;
    'stack-layout': HTMLStackLayoutElement;
    'wrap-layout': HTMLWrapLayoutElement;
  }

  interface HTMLDivElement {
    view: FlexboxLayout;
  }
  interface HTMLParagraphElement {
    view: FlexboxLayout;
  }
  interface Text {
    view: TextView;
  }
}
