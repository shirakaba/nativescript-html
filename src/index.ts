import { GlobalRegistrator } from '@happy-dom/global-registrator';

import { registerCustomElements } from './customElements';

// Register happy-dom classes like Event, EventTarget on the global namespace.
GlobalRegistrator.register();

// Register all the HTML Custom Elements (wrappers around NativeScript views).
registerCustomElements(global);

export { NHTMLElement, DOMLayoutBase } from './customElements';
