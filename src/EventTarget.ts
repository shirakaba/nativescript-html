import { type View, Observable, EventData } from '@nativescript/core';
import {
  GestureEventData,
  GestureTypes,
  GesturesObserver,
  fromString as gestureFromString,
} from '@nativescript/core/ui/gestures';
import { Optional } from '@nativescript/core/utils/typescript-utils';

import type { default as NEvent } from './Event';
import { Writable } from './typeHelpers';

/**
 * An EventTarget implementation that handles both viewless EventTargets like
 * HTMLHeadElement and viewful ones (NativeScript UI element wrappers) like
 * HTMLStackLayoutElement where the listeners live on the view instead.
 *
 * This is intended to replace happy-dom's EventTarget implementation.
 */
export default class NEventTarget<N extends View = View>
  implements EventTarget
{
  /**
   * A view (initialised externally) or null (for viewless NEventTargets).
   */
  declare view: N | null;
  static {
    Object.defineProperty(NEventTarget.prototype, 'view', {
      value: null,
      writable: true,
    });
  }

  /**
   * A lazily-initialised record of gesture observers, only used for
   * EventTargets that have an associated view.
   */
  private _gesturesMap: Map<EventListener, GesturesObserver> | undefined;
  private _getGesturesMap(): Map<EventListener, GesturesObserver> {
    if (!this._gesturesMap) {
      Object.defineProperty(this, '_gesturesMap', {
        value: new Map<EventListener, GesturesObserver>(),
      });
    }
    return this._gesturesMap!;
  }

  /**
   * A lazily-initialised record of listeners, only used for viewless
   * EventTargets like HTMLHeadElement.
   */
  private _observers: Record<string, ListenerEntry[]> | undefined;
  private _getEventList<T extends boolean>(
    type: string,
    createIfNeeded?: T
  ): T extends true ? ListenerEntry[] : ListenerEntry[] | undefined {
    if (this.view) {
      return (this.view as unknown as ViewPrivate)._getEventList(type, true);
    }
    if (!this._observers) {
      Object.defineProperty(this, '_observers', { value: {} });
    }

    if (createIfNeeded) {
      this._observers![type] = [];
    }

    return this._observers![type];
  }

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean
  ): void {
    console.log(`${this.constructor.name}.addEventListener('${type}') !`);
    if (!callback) {
      return;
    }

    // TODO: support handleEvent()
    if (typeof callback !== 'function') {
      throw new TypeError('Callback must be function.');
    }

    const list = this._getEventList(type, true);
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
      removed: false,
    });

    // Gestures are special-cased and so have their own separate event list.
    const gesture = gestureFromString(type);
    if (gesture && this.view) {
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
      this._getGesturesMap().set(callback, ourObserver);
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

    // TODO: support handleEvent()
    if (typeof callback !== 'function') {
      throw new TypeError('Callback must be function.');
    }

    const capture = usesCapture(options);

    const list = this._getEventList(type, true);

    const index = (
      Observable as unknown as typeof ObservablePrivate
    )._indexOfListener(list, callback, capture);

    if (index === -1) {
      return;
    }

    const [listenerEntry] = list.splice(index, 1);
    listenerEntry.removed = true;

    if (list.length === 0) {
      if (this.view) {
        delete (this.view as unknown as ViewPrivate)._observers[type];
      } else if (this._observers) {
        delete this._observers[type];
      }
    }

    // Gestures are special-cased and so have their own separate event list.
    const gesture = gestureFromString(type);
    if (gesture && this.view) {
      const gesturesMap = this._getGesturesMap();
      const observer = gesturesMap.get(callback);
      if (!observer) {
        return;
      }

      // Use our patch of `this.view._disconnectGestureObservers()`.
      _disconnectGestureObserversPatched(this.view, gesture, observer);

      gesturesMap.delete(callback);
    }
  }

  dispatchEvent(event: Event): boolean {
    if (event.eventPhase !== Event.NONE) {
      throw new Error('Tried to dispatch a dispatching event');
    }

    // We're the user agent, so we need write privileges, unlike userland code.
    const nevent = event as Writable<NEvent>;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const target = this;

    nevent.eventPhase = Event.CAPTURING_PHASE;
    nevent.target = target;
    nevent.defaultPrevented = false;

    // happy-dom's composedPath() infinite loops if the event is non-bubbling!
    const eventPath = this.getEventPath(nevent, 'capture');

    // Event names in NativeScript are case-sensitive, so don't lowercase them
    const level0Event = this[`on${event.type}` as keyof this];
    if (typeof level0Event === 'function') {
      level0Event.call(this, event);
    }

    // Capturing phase, e.g. [Page, StackLayout, Button]
    for (let i = 0; i < eventPath.length; i++) {
      const currentTarget = eventPath[i];
      nevent.currentTarget = currentTarget;
      nevent.eventPhase =
        nevent.target === nevent.currentTarget
          ? Event.AT_TARGET
          : Event.CAPTURING_PHASE;

      this.handleEvent(nevent, Event.CAPTURING_PHASE);

      if (nevent.propagationState !== EventPropagationState.resume) {
        nevent.resetForRedispatch();
        return !nevent.defaultPrevented;
      }
    }

    // Bubbling phase, e.g. [Button, StackLayout, Page]
    // It's correct to dispatch the event to the target during both phases.
    for (let i = eventPath.length - 1; i >= 0; i--) {
      const currentTarget = eventPath[i];
      nevent.currentTarget = currentTarget;
      nevent.eventPhase =
        nevent.target === nevent.currentTarget
          ? Event.AT_TARGET
          : Event.BUBBLING_PHASE;

      this.handleEvent(nevent, Event.BUBBLING_PHASE);

      if (nevent.propagationState !== EventPropagationState.resume) {
        nevent.resetForRedispatch();
        return !nevent.defaultPrevented;
      }

      // If the event doesn't bubble, then, having dispatched it at the
      // target (the first iteration of this loop) we don't let it
      // propagate any further.
      if (!nevent.bubbles) {
        nevent.resetForRedispatch();
        break;
      }

      // Restore event phase in case it changed to AT_TARGET during
      // nevent.handleEvent().
      nevent.eventPhase = Event.BUBBLING_PHASE;
    }

    nevent.resetForRedispatch();
    return !nevent.defaultPrevented;
  }

  private handleEvent(event: Writable<NEvent>, phase: 0 | 1 | 2 | 3): void {
    const currentTarget = event.currentTarget;
    if (!currentTarget) {
      return;
    }

    // Take a snapshot of the current listeners.
    const listeners = (event.currentTarget as this)
      ._getEventList(event.type, false)
      ?.slice();

    if (!listeners?.length) {
      return;
    }

    for (let i = listeners.length - 1; i >= 0; i--) {
      const listener = listeners[i];

      // The event listener may have been removed since we took a copy of
      // the array, so bail out if so.
      if (listener.removed) {
        continue;
      }

      const capture = listener.capture;

      // Handle only the events appropriate to the phase.
      if (
        (phase === Event.CAPTURING_PHASE && !capture) ||
        (phase === Event.BUBBLING_PHASE && capture)
      ) {
        continue;
      }

      const callback = listener.callback;

      if (listener.once) {
        currentTarget.removeEventListener(event.type, callback, capture);
      }

      callback.call(event.currentTarget, event);

      if (listener.passive && event.defaultPrevented) {
        console.warn(
          'Unexpected call to event.preventDefault() in passive event listener.'
        );
      }

      if (event.propagationState === EventPropagationState.stopImmediate) {
        break;
      }
    }
  }

  /**
   * Returns the event path.
   *
   * - 'capture' paths are ordered from root to target.
   * - 'bubble' paths are ordered from target to root.
   * @example
   * [Page, StackLayout, Button] // 'capture'
   * @example
   * [Button, StackLayout, Page] // 'bubble'
   */
  private getEventPath(
    event: Event,
    path: 'capture' | 'bubble'
  ): EventTarget[] {
    const eventPath: EventTarget[] = [];
    const insert =
      path === 'capture'
        ? eventPath.unshift.bind(eventPath)
        : eventPath.push.bind(eventPath);

    let eventTarget: EventTarget | null | undefined = event.target;
    while (eventTarget) {
      insert(eventTarget);
      if (event.composed && (event.target as ShadowRoot)?.host) {
        eventTarget = (event.target as ShadowRoot).host;
      } else if ((event.target as Node)?.ownerDocument === eventTarget) {
        eventTarget = (event.target as Node)?.ownerDocument?.defaultView;
      } else {
        eventTarget = (eventTarget as Node)?.parentNode;
      }
    }
    return eventPath;
  }
}

enum EventPropagationState {
  resume,
  stop,
  stopImmediate,
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
  /**
   * A performance optimisation - allows us to continue using an out-of-date
   * array of listeners without recreating the array.
   */
  removed?: boolean;
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

export function patch(): void {
  // happy-dom overrides dispatchEvent() on Node rather than just implementing
  // it on EventTarget (and to be fair, that's a cleaner approach). But as we've
  // been quite lazy and defined a Node-aware EventTarget, we'll want to delete
  // this override to make sure it uses our EventTarget implementation.
  //
  // @ts-ignore Removal of this non-optional method is safe because the
  // superclass provides it.
  delete Node.prototype.dispatchEvent;

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
      // Either we haven't wrapped the view yet (e.g. the "created" event was
      // fired during the View's constructor) or it's some view that wasn't made
      // in userland (e.g. the accessibility singleton).
      window.dispatchEvent(event);
    }
  };
}

/**
 * We add the dispatchEvent() method to every Observable, and modify its
 * notify() method to forward to that instead of the usual flow
 */
export type Dispatcher<T extends Observable = Observable> = T &
  Pick<EventTarget, 'dispatchEvent'>;
