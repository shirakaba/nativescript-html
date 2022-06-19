import "./polyfills";
import { registerCustomElements } from "./customElements";

registerCustomElements();

export { NativeScriptDOMElement, DOMLayoutBase } from "./customElements";