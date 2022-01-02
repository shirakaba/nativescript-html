import { DOMWindow } from "jsdom";

export function defineElements(win: DOMWindow): void {
  win.customElements.define("flexboxLayout", class extends HTMLElement {
    appendChild<T extends Node>(node: T): T {
      console.log(`TODO: implement appending child`);
      return node;
    }
  });
}
