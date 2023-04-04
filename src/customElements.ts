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
} from '@nativescript/core';
import {
  GestureEventData,
  GestureTypes,
  GesturesObserver,
  fromString as gestureFromString,
} from '@nativescript/core/ui/gestures';
import { Optional } from '@nativescript/core/utils/typescript-utils';

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// TODO: it'll probably make sense to make a NativeScript equivalent for each
// one in the hierarchy of:
//   HTMLElement > Element > Node > EventTarget

// Hard to choose between extending from ViewBase or from View.
// View is the most primitive element that implements _addChildFromBuilder, and
// moreover is the one that defines and exports the AddChildFromBuilder in the
// first place.
export abstract class TNSDOMElement<N extends View> extends HTMLElement {
  abstract readonly view: N;

  private readonly gesturesMap = new Map<EventListener, GesturesObserver>();

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean
  ): void {
    if (!callback) {
      return;
    }

    if (typeof callback !== 'function') {
      throw new TypeError('Callback must be function.');
    }

    // @ts-ignore private API
    const list: ListenerEntry[] = this.view._getEventList(type, true);
    const capture = usesCapture(options);

    if (
      // @ts-ignore private API
      Observable._indexOfListener(list, callback, capture) >= 0
    ) {
      // Don't allow addition of duplicate event listeners (unlike Core).
      return;
    }

    list.push({
      callback,
      thisArg: capture,
      // TODO: can optimise by setting properties directly rather than
      // creating this temporary object just to immediately spread it.
      ...normalizeEventOptions(options),
    });

    // Gestures are special-cased and so have their own separate event list.
    const gesture = gestureFromString(type);
    if (gesture) {
      const gestureCallback = (args: GestureEventData) => {
        const { eventName, ...rest } = args;
        const event = new CustomEvent(eventName, { detail: { ...rest } });
        this.dispatchEvent(event);
      };

      // Raise the corresponding DOM Event rather than the user's callback.
      // Don't bail out yet, because we do still want to register a listener for
      // that DOM Event. Clever, eh?
      this.view._observe(gesture, gestureCallback, capture);

      const observers: GesturesObserver[] = this.view._gestureObservers[type];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const ourObserver = observers[observers.length - 1]!;

      // Keep a record of the gesture observer so that we can remove it later in
      // removeEventListener().
      this.gesturesMap.set(callback, ourObserver);
    }
  }

  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void {
    if (!callback) {
      return;
    }

    if (typeof callback !== 'function') {
      throw new TypeError('Callback must be function.');
    }

    const capture = usesCapture(options);

    // @ts-ignore private API
    const list: ListenerEntry[] = this.view._getEventList(type, true);

    const index: number =
      // @ts-ignore private API
      Observable._indexOfListener(list, callback, capture);

    if (index === -1) {
      return;
    }

    list.splice(index, 1);
    if (list.length === 0) {
      // @ts-ignore private API
      delete this.view._observers[type];
    }

    // Gestures are special-cased and so have their own separate event list.
    const gesture = gestureFromString(type);
    if (gesture) {
      const observer = this.gesturesMap.get(callback);
      if (!observer) {
        return;
      }

      // The easy approach would be to just call the private API
      // `this.view._disconnectGestureObservers()`, but we'll avoid using
      // it as it removes *all* observers under the name rather than just a
      // single, specific one!
      //
      // If Core ever fixes that bug, we can remove all this code below that
      // simply copies (and fixes, where appropriate) its implementation.
      _disconnectGestureObserversPatched(this.view, gesture, observer);

      this.gesturesMap.delete(callback);
    }
  }

  dispatchEvent(event: Event): boolean {
    this.view.notify({ eventName: event.type, object: this.view });

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
  return typeof options === 'object' ? !!options.capture : !!options;
}

/**
 * Normalizes options into a AddEventListenerOptions where all fields are
 * non-optional (`signal` is an explicit undefined).
 */
export function normalizeEventOptions(
  options?: AddEventListenerOptions | boolean
): AddEventListenerOptions {
  if (typeof options === 'object') {
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

/**
 * Our extension of the internal interface used by Observable.
 */
interface ListenerEntry extends AddEventListenerOptions {
  /**
   * This property would normally take `(data: EventData) => void;`, but we'll
   * treat it as an event listener.
   */
  callback: EventListener;
  /**
   * This property would normally take a `this` context to be bound, but we're
   * repurposing it for `capture` as it's the only other property examined by
   * Observable._indexOfListener(). We won't perform any binding of context to
   * event listeners, just like in DOM.
   */
  thisArg: any;
}

/**
 * A patch of Observable.prototype._disconnectGestureObservers which allows
 * removing just a single observer, rather than all of the given type.
 */
function _disconnectGestureObserversPatched<N extends View>(
  view: N,
  type: GestureTypes,
  observer: GesturesObserver
): void {
  const gestureObservers = view.getGestureObservers(type);
  const index = gestureObservers?.findIndex((o) => o === observer);
  if (index > -1) {
    gestureObservers.splice(index, 1);
  }
  if (!gestureObservers?.length) {
    delete view._gestureObservers[type];
  }

  // Do the same cleanup up as in GesturesObserver.disconnect().

  // @ts-ignore private
  observer._detach();

  // @ts-ignore private
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  view.off('loaded', observer._onTargetLoaded);

  // @ts-ignore private
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  view.off('unloaded', observer._onTargetUnloaded);

  // @ts-ignore private
  observer._onTargetLoaded = null;
  // @ts-ignore private
  observer._onTargetUnloaded = null;

  // @ts-ignore private
  observer._target = null;
  // @ts-ignore private
  observer._callback = null;
  // @ts-ignore private
  observer._context = null;
}

// TODO: check whether this class could actually apply more widely to instances
// of ContainerView, not just LayoutBase.
export abstract class DOMLayoutBase<
  N extends LayoutBase
> extends TNSDOMElement<N> {
  appendChild<T extends Node>(node: T): T {
    const returnValue = super.appendChild(node);
    this.view.addChild((node as unknown as TNSDOMElement<View>).view);
    return returnValue;
  }
  removeChild<T extends Node>(child: T): T {
    const returnValue = super.removeChild(child);
    this.view.removeChild((child as unknown as TNSDOMElement<View>).view);
    return returnValue;
  }
  insertBefore<T extends Node>(newNode: T, referenceNode: Node | null): T {
    const returnValue = super.insertBefore(newNode, referenceNode);
    const childIndex = this.view.getChildIndex(
      (referenceNode as unknown as TNSDOMElement<View>).view
    );
    this.view.insertChild(
      (newNode as unknown as TNSDOMElement<View>).view,
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
  Pick<EventTarget, 'dispatchEvent'>;

export function registerCustomElements(): void {
  // We patch notify() to re-fire all non-user NativeScript events as DOM Events.
  //
  // No need to patch on(), off(), once(), addEventListener, or
  // removeEventListener(), as all they do is insert callbacks into
  // Observable._observers, which we'll continue to use.
  Observable.prototype.notify = function <
    T extends Optional<EventData, 'object'>
  >(data: T): void {
    // For backwards compatibility reasons
    data.object = data.object || this;

    const { eventName, ...rest } = data;
    const event = new CustomEvent(eventName, { detail: { ...rest } });

    // Instead of calling handleEvent on all observers (the old methodology), we
    // dispatch a DOM Event by reaching out to the implicit DOM container. This
    // effectively moves the responsibility of coordinating the event flow and
    // event listener handling to the event itself.
    (this as Dispatcher).dispatchEvent(event);
  };

  // Give the view a way to directly call the dispatchEvent() method of
  // its DOM container.
  const setDispatchEvent = <T extends View>(domElement: TNSDOMElement<T>) => {
    (domElement.view as Dispatcher<T>).dispatchEvent = (event: Event) =>
      domElement.dispatchEvent(event);
  };

  class DOMAbsoluteLayout extends DOMLayoutBase<AbsoluteLayout> {
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
