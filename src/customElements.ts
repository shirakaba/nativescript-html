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

export abstract class NHTMLElement<N extends View = View> extends HTMLElement {
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

    const list = (this.view as unknown as ViewPrivate)._getEventList(
      type,
      true
    );
    const capture = usesCapture(options);

    if (
      (Observable as unknown as typeof ObservablePrivate)._indexOfListener(
        list,
        callback,
        capture
      ) >= 0
    ) {
      // Don't allow addition of duplicate event listeners (unlike Core).
      return;
    }

    list.push({
      callback,
      thisArg: capture,
      once: typeof options === 'object' ? !!options.once : false,
      capture: typeof options === 'object' ? !!options.capture : false,
      passive: typeof options === 'object' ? !!options.passive : false,
      signal: typeof options === 'object' ? options.signal : undefined,
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

      const observers = (this.view as unknown as ViewPrivate)._gestureObservers[
        gesture
      ];
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

    const list = (this.view as unknown as ViewPrivate)._getEventList(
      type,
      true
    );

    const index = (
      Observable as unknown as typeof ObservablePrivate
    )._indexOfListener(list, callback, capture);

    if (index === -1) {
      return;
    }

    list.splice(index, 1);
    if (list.length === 0) {
      delete (this.view as unknown as ViewPrivate)._observers[type];
    }

    // Gestures are special-cased and so have their own separate event list.
    const gesture = gestureFromString(type);
    if (gesture) {
      const observer = this.gesturesMap.get(callback);
      if (!observer) {
        return;
      }

      // Use our patch of `this.view._disconnectGestureObservers()`.
      _disconnectGestureObserversPatched(this.view, gesture, observer);

      this.gesturesMap.delete(callback);
    }
  }

  // FIXME: happy-dom's EventTarget.dispatchEvent checks
  // `this._listeners[event.type]`, intending to call handleEvent on any
  // corresponding listeners. We should reimplement dispatchEvent to do all of
  // that.
  //
  // dispatchEvent(event: Event): boolean {
  //   this.view.notify({ eventName: event.type, object: this.view });

  //   return true;
  // }

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

declare class ObservablePrivate {
  readonly _observers: Record<string, ListenerEntry[]>;

  static _indexOfListener(
    list: ListenerEntry[],
    callback: EventListener,
    capture?: boolean
  ): number;

  _getEventList<T extends boolean>(
    eventName: string,
    createIfNeeded?: T
  ): T extends true ? ListenerEntry[] : ListenerEntry[] | undefined;
}

declare class GesturesObserverPrivate {
  _callback: null | ((args: GestureEventData) => void);
  _context: any;
  _detach(): void;
  _onTargetLoaded: null | ((data: EventData) => void);
  _onTargetUnloaded: null | ((data: EventData) => void);
  _target: View | null;
}

declare class ViewPrivate extends ObservablePrivate {
  readonly _gestureObservers: Record<GestureTypes, GesturesObserver[]>;
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

  const observerPrivate = observer as unknown as GesturesObserverPrivate;

  // Do the same cleanup up as in GesturesObserver.disconnect().

  observerPrivate._detach();

  view.off('loaded', observerPrivate._onTargetLoaded!);
  view.off('unloaded', observerPrivate._onTargetUnloaded!);

  observerPrivate._onTargetLoaded = null;
  observerPrivate._onTargetUnloaded = null;

  observerPrivate._target = null;
  observerPrivate._callback = null;
  observerPrivate._context = null;
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

/**
 * We add the dispatchEvent() method to every Observable, and modify its
 * notify() method to forward to that instead of the usual flow
 */
type Dispatcher<T extends Observable = Observable> = T &
  Pick<EventTarget, 'dispatchEvent'>;

export function registerCustomElements(): void {
  const on = Observable.prototype.on;
  Observable.prototype.on = function (
    eventNames: string,
    callback: (data: EventData) => void,
    thisArg?: any
  ): void {
    console.log(`${this.constructor.name}.on('${eventNames}')`);
    on.call(this, eventNames, callback, thisArg);
  };

  // We patch notify() to re-fire all non-user NativeScript events as DOM
  // Events.
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

    if ((this as Dispatcher).dispatchEvent) {
      console.log(
        `calling ${this.constructor.name}.dispatchEvent('${eventName}')...`
      );
      // It's a View that we've wrapped
      (this as Dispatcher).dispatchEvent(event);
    } else {
      console.log(`calling window.dispatchEvent('${eventName}')...`);
      // It's some other Core Observable
      window.dispatchEvent(event);
    }
  };

  // Give the view a way to directly call the dispatchEvent() method of its DOM
  // container.
  const setDispatchEvent = <T extends View>(domElement: NHTMLElement<T>) => {
    (domElement.view as Dispatcher<T>).dispatchEvent = (event: Event) =>
      domElement.dispatchEvent(event);
  };

  /* eslint-disable @typescript-eslint/no-var-requires */
  class DOMAbsoluteLayout extends DOMLayoutBase<AbsoluteLayout> {
    // FIXME: this fires the 'created' event before we've set dispatchEvent upon
    // it, so we need to somehow resolve that.
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
