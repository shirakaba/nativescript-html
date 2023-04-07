import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { install as installGestureHandler } from '@nativescript-community/gesturehandler';

import { registerCustomElements } from './customElements';

// Patch ViewBase and GesturesObserver with GestureHandler.
installGestureHandler(true);

// Register happy-dom classes like Event, EventTarget on the global namespace.
GlobalRegistrator.register();

// Register all the HTML Custom Elements (wrappers around NativeScript views).
registerCustomElements();

export {
  NHTMLElement,
  DOMLayoutBase,
  setDispatchEvent,
} from './customElements';
