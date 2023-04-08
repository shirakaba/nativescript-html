import { View } from '@nativescript/core';

import { Dispatcher } from '../EventTarget';

/**
 * Our base HTMLElement implementation for any NativeScript UI elements.
 * Implicitly extends from our NEventTarget implementation (which we use instead
 * of happy-dom's EventTarget).
 */
export abstract class NHTMLElement<N extends View = View> extends HTMLElement {
  static register(name: string, options?: ElementDefinitionOptions): void {
    customElements.define(
      name,
      this as unknown as CustomElementConstructor,
      options
    );
  }

  // FIXME: constructing the view fires the 'created' event before we've set
  // dispatchEvent upon it, so we need to somehow resolve that. We could make
  // this.view not be readonly, listen for the "created" event on the window and
  // then redispatch it, but I think it's a needless amount of work to rescue an
  // event that's useless in the first place.
  abstract readonly view: N;

  // TODO: Element interface
  // TODO: ElementCSSInlineStyle interface (for HTMLElement and SVGElement)
  // TODO: We probably get Node.textContent and HTMLElement.innerText for
  // free, but will have to think about how to mirror updates to
  // Text.wholeText and Node.data for text elements.
  // @see Text > CharacterData > Node

  // Generally, it's the Node methods that will need reimplementing.
  // The Element methods for attribute-setting will be relatively constant.
}

// We can only set dispatchEvent post-construction, so we'll do it by patching
// createElement.
export function patchCreateElement(document: typeof Document): void {
  const createElementNS = document.prototype.createElementNS;

  // @ts-ignore many overloads
  document.prototype.createElementNS = function (
    namespace,
    qualifiedName,
    options
  ): Element {
    const element = createElementNS.call(
      this,
      namespace,
      qualifiedName,
      options
    );

    if (element instanceof NHTMLElement) {
      setDispatchEvent(element);
    }

    return element;
  };
}

// Give the view a way to directly call the dispatchEvent() method of its DOM
// container.
function setDispatchEvent<T extends View>(domElement: NHTMLElement<T>): void {
  (domElement.view as Dispatcher<T>).dispatchEvent = (event: Event) =>
    domElement.dispatchEvent(event);
}
