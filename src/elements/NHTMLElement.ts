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

  // happy-dom does implement CSS but it's easiest just to use what NativeScript
  // gives us.
  get style(): CSSStyleDeclaration {
    return new Proxy(this.view.style, {
      set: (target, p, newValue, receiver) => {
        return Reflect.set(
          target,
          p,
          // Crudely coerce px to dip to match the web.
          typeof newValue === 'string'
            ? newValue.replace('px', 'dip')
            : newValue,
          receiver
        );
      },
    }) as unknown as CSSStyleDeclaration;
  }

  set style(inlineStyle: CSSStyleDeclaration /* | string */) {
    // The view setter will throw an error for us anyway if it's not a string.
    const maybeString = inlineStyle as unknown as string;

    this.view.setInlineStyle(
      // Crudely coerce px to dip to match the web.
      typeof maybeString === 'string'
        ? maybeString.replace('px', 'dip')
        : (maybeString as unknown as string)
    );
  }

  // TODO: Element interface
  // TODO: ElementCSSInlineStyle interface (for HTMLElement and SVGElement)
  // TODO: We probably get Node.textContent and HTMLElement.innerText for
  // free, but will have to think about how to mirror updates to
  // Text.wholeText and Node.data for text elements.
  // @see Text > CharacterData > Node

  // Generally, it's the Node methods that will need reimplementing.
  // The Element methods for attribute-setting will be relatively constant.
}

// User agent HTMLElements we'll shim in ourselves.
const intrinsicElements = new Set(['DIV', 'P', 'SPAN', 'IMG', 'BUTTON']);

let patched = false;

// We can only set dispatchEvent post-construction, so we'll do it by patching
// createElement.
export function patchCreateElement(document: typeof Document): void {
  if (patched) {
    return;
  }
  patched = true;

  const createElementNS = document.prototype.createElementNS;

  // @ts-ignore many overloads
  document.prototype.createElementNS = function (
    namespace,
    qualifiedName,
    options
  ): Element {
    const sanitisedName = qualifiedName.toUpperCase().trim();

    // We'll register HTMLDivElement as a CustomElement, because happy-dom
    // doesn't provide it itself. CustomElements require a hyphen.
    if (intrinsicElements.has(sanitisedName)) {
      qualifiedName = `${sanitisedName}-`;
    }

    const element = createElementNS.call(
      this,
      namespace,
      qualifiedName,
      options
    );

    // Remove the hyphen from any agent elements that we've bodged in as
    // CustomElements.
    if (intrinsicElements.has(sanitisedName)) {
      // @ts-ignore not actually readonly.
      element.tagName = sanitisedName;
    }

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
