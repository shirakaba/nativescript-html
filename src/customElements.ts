import {
  View,
  LayoutBase,
  AbsoluteLayout,
  DockLayout,
  FlexboxLayout,
  GridLayout,
  StackLayout,
  WrapLayout,
  EventData,
  Observable,
} from '@nativescript/core';

import { Dispatcher, patch as patchEventTarget } from './EventTarget';

/**
 * Our base HTMLElement implementation for any NativeScript UI elements.
 * Implicitly extends from our NEventTarget implementation (which we use instead
 * of happy-dom's EventTarget).
 */
export abstract class NHTMLElement<N extends View = View> extends HTMLElement {
  // To be initialised externally.
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

// TODO: check whether this class could actually apply more widely to instances
// of ContainerView, not just LayoutBase.
export abstract class DOMLayoutBase<
  N extends LayoutBase
> extends NHTMLElement<N> {
  appendChild<T extends Node>(node: T): T {
    const returnValue = super.appendChild(node);

    if (node instanceof NHTMLElement) {
      this.view.addChild(node.view);
    }

    return returnValue;
  }

  removeChild<T extends Node>(child: T): T {
    const returnValue = super.removeChild(child);

    if (child instanceof NHTMLElement) {
      this.view.removeChild(child.view);
    }

    return returnValue;
  }

  insertBefore<T extends Node>(newNode: T, referenceNode: Node | null): T {
    const returnValue = super.insertBefore(newNode, referenceNode);

    if (
      newNode instanceof NHTMLElement &&
      (referenceNode === null || referenceNode instanceof NHTMLElement)
    ) {
      if (referenceNode) {
        const childIndex = this.view.getChildIndex(referenceNode.view);
        this.view.insertChild(newNode.view, childIndex);
      } else {
        this.view.addChild(newNode.view);
      }
    }

    return returnValue;
  }

  // Node.replaceChild() is fine as-is, as it calls Node.insertBefore()
  // followed by Node.removeChild() (both of which we've reimplemented)

  // ParentNode.append(), ParentNode.prepend(), and
  // ParentNode.replaceChildren() also just call Node.append()
  // Node.insertBefore(), and Node.removeChild() under-the-hood.

  // ChildNode.remove(), ChildNode.replaceWith(), ChildNode.after(), and
  // ChildNode.before() also use existing methods under-the-hood.
}

export function registerCustomElements(): void {
  patchEventTarget();

  // TODO: maybe move these into patchEventTarget() or similar?

  // (This is purely for debug)
  const on = Observable.prototype.on;
  Observable.prototype.on = function (
    eventNames: string,
    callback: (data: EventData) => void,
    thisArg?: any
  ): void {
    console.log(`${this.constructor.name}.on('${eventNames}')`);
    on.call(this, eventNames, callback, thisArg);
  };
  const addEventListener = Observable.prototype.addEventListener;
  Observable.prototype.addEventListener = function (
    eventNames: string,
    callback: (data: EventData) => void,
    thisArg?: any
  ): void {
    console.log(`${this.constructor.name}.addEventListener('${eventNames}')`);
    addEventListener.call(this, eventNames, callback, thisArg);
  };

  /* eslint-disable @typescript-eslint/no-var-requires */
  class DOMAbsoluteLayout extends DOMLayoutBase<AbsoluteLayout> {
    // FIXME: this fires the 'created' event before we've set dispatchEvent upon
    // it, so we need to somehow resolve that. We could make this.view not be
    // readonly, listen for the "created" event on the window and then
    // redispatch it, but I think it's a needless amount of work to rescue an
    // event that's useless in the first place.
    readonly view = new (require('@nativescript/core')
      .AbsoluteLayout as typeof AbsoluteLayout)();

    constructor() {
      super();
      setDispatchEvent(this);
    }
  }
  customElements.define('absolute-layout', DOMAbsoluteLayout);
  class DOMDockLayout extends DOMLayoutBase<DockLayout> {
    readonly view = new (require('@nativescript/core')
      .DockLayout as typeof DockLayout)();

    constructor() {
      super();
      setDispatchEvent(this);
    }
  }
  customElements.define('dock-layout', DOMDockLayout);
  class DOMFlexboxLayout extends DOMLayoutBase<FlexboxLayout> {
    readonly view = new (require('@nativescript/core')
      .FlexboxLayout as typeof FlexboxLayout)();

    constructor() {
      super();
      setDispatchEvent(this);
    }
  }
  customElements.define('flexbox-layout', DOMFlexboxLayout);
  class DOMGridLayout extends DOMLayoutBase<GridLayout> {
    readonly view = new (require('@nativescript/core')
      .GridLayout as typeof GridLayout)();

    constructor() {
      super();
      setDispatchEvent(this);
    }
  }
  customElements.define('grid-layout', DOMGridLayout);
  class DOMStackLayout extends DOMLayoutBase<StackLayout> {
    readonly view = new (require('@nativescript/core')
      .StackLayout as typeof StackLayout)();

    constructor() {
      super();
      setDispatchEvent(this);
    }
  }
  customElements.define('stack-layout', DOMStackLayout);
  class DOMWrapLayout extends DOMLayoutBase<WrapLayout> {
    readonly view = new (require('@nativescript/core')
      .WrapLayout as typeof WrapLayout)();

    constructor() {
      super();
      setDispatchEvent(this);
    }
  }
  customElements.define('wrap-layout', DOMWrapLayout);
}

// Give the view a way to directly call the dispatchEvent() method of its DOM
// container.
export function setDispatchEvent<T extends View>(
  domElement: NHTMLElement<T>
): void {
  (domElement.view as Dispatcher<T>).dispatchEvent = (event: Event) =>
    domElement.dispatchEvent(event);
}
