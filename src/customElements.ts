/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
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
} from "@nativescript/core";
import { Optional } from "@nativescript/core/utils/typescript-utils";

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// TODO: it'll probably make sense to make a NativeScript equivalent for each
// one in the hierarchy of:
//   HTMLElement > Element > Node > EventTarget

Observable.prototype.notify = function <
  T extends Optional<EventData, "object">
>(data: T): void {
  // For backwards compatibility reasons
  data.object = data.object || this;

  const { eventName, ...rest } = data;
  const event = new CustomEvent(eventName, { detail: { ...rest } });

  // Dispatch a DOM Event by reaching out to the implicit DOM container.
  (this as Dispatcher).dispatchEvent(event);
};

// Hard to choose between extending from ViewBase or from View.
// View is the most primitive element that implements _addChildFromBuilder, and
// moreover is the one that defines and exports the AddChildFromBuilder in the
// first place.
export abstract class TNSDOMElement<N extends View> extends HTMLElement {
  abstract readonly nativeView: N;

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean
  ): void {
    if (!callback) {
      return;
    }

    if (typeof callback !== "function") {
      throw new TypeError("Callback must be function.");
    }

    // @ts-ignore private API
    const list = this.nativeView._getEventList(type, true);
    const capture = usesCapture(options);

    if (
      // @ts-ignore private API
      Observable._indexOfListener(list, callback, usesCapture(options)) >= 0
    ) {
      // Don't allow addition of duplicate event listeners.
      return;
    }

    list.push({
      callback,
      thisArg: capture,
      // TODO: can optimise by setting properties directly rather than
      // creating this temporary object just to immediately spread it.
      ...normalizeEventOptions(options),
    });
  }

  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void {
    if (!callback) {
      return;
    }

    if (typeof callback !== "function") {
      throw new TypeError("Callback must be function.");
    }

    // @ts-ignore private API
    const list = this.nativeView._getEventList(type, true);
    const capture = usesCapture(options);

    const index =
      // @ts-ignore private API
      Observable._indexOfListener(list, callback, capture);

    if (index >= 0) {
      list.splice(index, 1);
    }
    if (list.length === 0) {
      // @ts-ignore private API
      delete this.nativeView._observers[type];
    }
  }

  dispatchEvent(event: Event): boolean {
    // const eventName = (event as EventData).eventName;
    this.nativeView.notify({ eventName: event.type, object: this.nativeView });

    return true;
  }

  // END EventTarget

  // TODO: Element interface
  // TODO: ElementCSSInlineStyle interface (for HTMLElement and SVGElement)
  // TODO: We probably get Node.textContent and HTMLElement.innerText for
  // free, but will have to think about how to mirror updates to
  // Text.wholeText and Node.data for text elements.
  // @see Text > CharacterData > Node

  // Generally, it's the Node methods that will need reimplementing.
  // The Element methods for attribute-setting will be relatively constant.
}

function usesCapture(options?: AddEventListenerOptions | boolean): boolean {
  return typeof options === "object" ? !!options.capture : !!options;
}

/**
 * Normalizes options into a AddEventListenerOptions where all fields are
 * non-optional (`signal` is an explicit undefined).
 */
export function normalizeEventOptions(
  options?: AddEventListenerOptions | boolean
): AddEventListenerOptions {
  if (typeof options === "object") {
    return {
      once: !!options.once,
      capture: !!options.capture,
      passive: !!options.passive,
      signal: options.signal,
    };
  }

  return {
    once: false,
    passive: false,
    signal: undefined,
    capture: !!options,
  };
}

// TODO: check whether this class could actually apply more widely to instances
// of ContainerView, not just LayoutBase.
export abstract class DOMLayoutBase<
  N extends LayoutBase
> extends TNSDOMElement<N> {
  appendChild<T extends Node>(node: T): T {
    const returnValue = super.appendChild(node);
    this.nativeView.addChild(
      (node as unknown as TNSDOMElement<View>).nativeView
    );
    return returnValue;
  }
  removeChild<T extends Node>(child: T): T {
    const returnValue = super.removeChild(child);
    this.nativeView.removeChild(
      (child as unknown as TNSDOMElement<View>).nativeView
    );
    return returnValue;
  }
  insertBefore<T extends Node>(newNode: T, referenceNode: Node | null): T {
    const returnValue = super.insertBefore(newNode, referenceNode);
    const childIndex = this.nativeView.getChildIndex(
      (referenceNode as unknown as TNSDOMElement<View>).nativeView
    );
    this.nativeView.insertChild(
      (newNode as unknown as TNSDOMElement<View>).nativeView,
      childIndex
    );
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

/**
 * We add the dispatchEvent() method to every Observable, and modify its
 * notify() method to forward to that instead of the usual flow
 */
type Dispatcher<T extends Observable = Observable> = T &
  Pick<EventTarget, "dispatchEvent">;

export function registerCustomElements(): void {
  // Give the nativeView a way to directly call the dispatchEvent() method of
  // its DOM container.
  const setDispatchEvent = <T extends View>(domElement: TNSDOMElement<T>) => {
    (domElement.nativeView as Dispatcher<T>).dispatchEvent = (event: Event) =>
      domElement.dispatchEvent(event);
  };

  class DOMAbsoluteLayout extends DOMLayoutBase<AbsoluteLayout> {
    readonly nativeView = new (require("@nativescript/core")
      .AbsoluteLayout as typeof AbsoluteLayout)();
    constructor() {
      super();
      setDispatchEvent(this);
    }
  }
  customElements.define("absolute-layout", DOMAbsoluteLayout);
  class DOMDockLayout extends DOMLayoutBase<DockLayout> {
    readonly nativeView = new (require("@nativescript/core")
      .DockLayout as typeof DockLayout)();

    constructor() {
      super();
      setDispatchEvent(this);
    }
  }
  customElements.define("dock-layout", DOMDockLayout);
  class DOMFlexboxLayout extends DOMLayoutBase<FlexboxLayout> {
    readonly nativeView = new (require("@nativescript/core")
      .FlexboxLayout as typeof FlexboxLayout)();

    constructor() {
      super();
      setDispatchEvent(this);
    }
  }
  customElements.define("flexbox-layout", DOMFlexboxLayout);
  class DOMGridLayout extends DOMLayoutBase<GridLayout> {
    readonly nativeView = new (require("@nativescript/core")
      .GridLayout as typeof GridLayout)();

    constructor() {
      super();
      setDispatchEvent(this);
    }
  }
  customElements.define("grid-layout", DOMGridLayout);
  class DOMStackLayout extends DOMLayoutBase<StackLayout> {
    readonly nativeView = new (require("@nativescript/core")
      .StackLayout as typeof StackLayout)();

    constructor() {
      super();
      setDispatchEvent(this);
    }
  }
  customElements.define("stack-layout", DOMStackLayout);
  class DOMWrapLayout extends DOMLayoutBase<WrapLayout> {
    readonly nativeView = new (require("@nativescript/core")
      .WrapLayout as typeof WrapLayout)();

    constructor() {
      super();
      setDispatchEvent(this);
    }
  }
  customElements.define("wrap-layout", DOMWrapLayout);
}
