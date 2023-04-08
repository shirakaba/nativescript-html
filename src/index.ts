import { GlobalRegistrator } from '@happy-dom/global-registrator';

import { patch as patchEvents } from './EventTarget';
import {
  registerAllCustomElements,
  HTMLAbsoluteLayoutElement,
  HTMLDockLayoutElement,
  HTMLFlexboxLayoutElement,
  HTMLGridLayoutElement,
  HTMLStackLayoutElement,
  HTMLWrapLayoutElement,
} from './customElements';
import { patchCreateElement } from './customElements/NHTMLElement';

// Register happy-dom classes like Event, EventTarget on the global namespace.
GlobalRegistrator.register();

// Patch NativeScript events and gestures.
patchEvents();

// Patch document.createElement to help with Custom Element setup.
patchCreateElement(Document);

// Register all the HTML Custom Elements (wrappers around NativeScript views).
registerAllCustomElements();

// Tools for anyone to make their own custom elements.
export { HTMLLayoutBaseElement } from './customElements/HTMLLayoutBaseElement';
export { NHTMLElement } from './customElements/NHTMLElement';

declare global {
  interface HTMLElementTagNameMap {
    'absolute-layout': HTMLAbsoluteLayoutElement;
    'dock-layout': HTMLDockLayoutElement;
    'flexbox-layout': HTMLFlexboxLayoutElement;
    'grid-layout': HTMLGridLayoutElement;
    'stack-layout': HTMLStackLayoutElement;
    'wrap-layout': HTMLWrapLayoutElement;
  }
}
