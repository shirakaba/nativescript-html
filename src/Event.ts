export enum EventPropagationState {
  resume,
  stop,
  stopImmediate,
}

/**
 * Add our internal state helpers to happy-dom's Event
 */
export function patch(): void {}

const timeOrigin = Date.now();

export default class NEvent implements Event {
  // Assigning properties directly to the prototype where possible avoids
  // wasted work in the constructor on each instance construction.
  static readonly NONE = 0;
  static readonly CAPTURING_PHASE = 1;
  static readonly AT_TARGET = 2;
  static readonly BUBBLING_PHASE = 3;

  // Assigning initial property values directly on the prototype where
  // possible avoids wasted work in the constructor on each instance
  // construction. It's ugly, but saves about 100 nanoseconds per
  // construction.
  static {
    Object.defineProperty(NEvent.prototype, 'NONE', { value: NEvent.NONE });
    Object.defineProperty(NEvent.prototype, 'CAPTURING_PHASE', {
      value: NEvent.CAPTURING_PHASE,
    });
    Object.defineProperty(NEvent.prototype, 'AT_TARGET', {
      value: NEvent.AT_TARGET,
    });
    Object.defineProperty(NEvent.prototype, 'BUBBLING_PHASE', {
      value: NEvent.BUBBLING_PHASE,
    });
    Object.defineProperty(NEvent.prototype, 'cancelBubble', {
      value: false,
      writable: true,
    });
    Object.defineProperty(NEvent.prototype, 'defaultPrevented', {
      value: false,
      writable: true,
    });
    Object.defineProperty(NEvent.prototype, 'isTrusted', {
      value: false,
      writable: true,
      enumerable: true,
    });
    Object.defineProperty(NEvent.prototype, 'eventPhase', {
      value: NEvent.NONE,
      writable: true,
    });
    Object.defineProperty(NEvent.prototype, 'currentTarget', {
      value: null,
      writable: true,
    });
    Object.defineProperty(NEvent.prototype, 'target', {
      value: null,
      writable: true,
    });
    Object.defineProperty(NEvent.prototype, 'propagationState', {
      value: EventPropagationState.resume,
      writable: true,
    });
  }

  declare NONE: 0;
  declare CAPTURING_PHASE: 1;
  declare AT_TARGET: 2;
  declare BUBBLING_PHASE: 3;

  /**
   * Returns true or false depending on how event was initialized. Its return
   * value does not always carry meaning, but true can indicate that part of the
   * operation during which event was dispatched, can be canceled by invoking
   * the preventDefault() method.
   */
  declare readonly cancelable: boolean;

  /**
   * Returns true or false depending on how event was initialized. True if event
   * goes through its target's ancestors in reverse tree order, and false
   * otherwise.
   */
  declare readonly bubbles: boolean;

  /** @deprecated Setting this value does nothing. */
  declare cancelBubble: boolean;

  /**
   * Returns true or false depending on how event was initialized. True if event
   * invokes listeners past a ShadowRoot node that is the root of its target,
   * and false otherwise.
   */
  declare readonly composed: boolean;

  /**
   * Returns true if event was dispatched by the user agent, and false
   * otherwise.
   * For now, all NativeScript events will have isTrusted: false.
   */
  declare readonly isTrusted: boolean;

  /** @deprecated Use defaultPrevented instead. */
  get returnValue() {
    return !this.defaultPrevented;
  }

  /** @deprecated */
  get srcElement(): EventTarget | null {
    return this.target;
  }

  /**
   * Returns true if preventDefault() was invoked successfully to indicate
   * cancelation, and false otherwise.
   */
  declare defaultPrevented: boolean;

  // Strictly speaking, we should use { public get, private set } for all of
  // `eventPhase`, `currentTarget`, and `target`, but using simple properties
  // is one of our biggest optimisations).

  /**
   * Returns the event's phase, which is one of NONE, CAPTURING_PHASE,
   * AT_TARGET, and BUBBLING_PHASE.
   */
  declare eventPhase: 0 | 1 | 2 | 3;

  /**
   * Returns the object whose event listener's callback is currently being
   * invoked.
   */
  declare currentTarget: EventTarget | null;

  /** Returns the object to which event is dispatched (its target). */
  declare target: EventTarget | null;

  declare propagationState: EventPropagationState;

  /**
   * Returns the event's timestamp as the number of milliseconds measured
   * relative to the time origin.
   */
  readonly timeStamp: DOMHighResTimeStamp = timeOrigin - Date.now();

  constructor(
    /**
     * Returns the type of event, e.g. "click", "hashchange", or "submit".
     */
    public type: string,
    eventInitDict?: EventInit
  ) {
    // Avoid destructuring the options object (might save some nanoseconds).
    this.bubbles = eventInitDict?.bubbles ?? false;
    this.cancelable = eventInitDict?.cancelable ?? false;
    this.composed = eventInitDict?.composed ?? false;
  }

  /**
   * Returns the invocation target objects of event's path (objects on which
   * listeners will be invoked), except for any nodes in shadow trees of which
   * the shadow root's mode is "closed" that are not reachable from event's
   * currentTarget.
   */
  composedPath(): EventTarget[] {
    if (!this.target) {
      return [];
    }

    // Walk up the target's parents if it has parents (is a ViewBase or
    // subclass of ViewBase) or not (is an EventTarget).
    return [...this.getEventPath('bubble')];
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
  getEventPath(path: 'capture' | 'bubble'): EventTarget[] {
    const eventPath: EventTarget[] = [];
    const insert =
      path === 'capture'
        ? eventPath.unshift.bind(eventPath)
        : eventPath.push.bind(eventPath);

    let eventTarget: EventTarget | null | undefined = this.target;
    while (eventTarget) {
      insert(eventTarget);
      if (this.composed && (this.target as ShadowRoot)?.host) {
        eventTarget = (this.target as ShadowRoot).host;
      } else if ((this.target as Node)?.ownerDocument === eventTarget) {
        eventTarget = (this.target as Node)?.ownerDocument?.defaultView;
      } else {
        eventTarget = (eventTarget as Node)?.parentNode;
      }
    }
    return eventPath;
  }

  /** @deprecated */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void {
    // This would be trivial to implement, but we'd have to remove the
    // readonly modifier from `bubbles` and `cancelable`, which would be a
    // shame just for the sake of supporting a deprecated method.
    throw new Error('Deprecated; use Event() instead.');
  }

  /**
   * If invoked when the cancelable attribute value is true, and while
   * executing a listener for the event with passive set to false, signals to
   * the operation that caused event to be dispatched that it needs to be
   * canceled.
   */
  preventDefault(): void {
    if (!this.cancelable) {
      return;
    }
    this.defaultPrevented = true;
  }
  /**
   * Invoking this method prevents event from reaching any registered event
   * listeners after the current one finishes running and, when dispatched in
   * a tree, also prevents event from reaching any other objects.
   */
  stopImmediatePropagation(): void {
    this.propagationState = EventPropagationState.stopImmediate;
  }
  /**
   * When dispatched in a tree, invoking this method prevents event from
   * reaching any objects other than the current object.
   */
  stopPropagation(): void {
    this.propagationState = EventPropagationState.stop;
  }

  /**
   * Resets any internal state to allow the event to be redispatched. Call
   * this before returning from EventTarget.handleEvent().
   */
  resetForRedispatch(): void {
    this.currentTarget = null;
    this.target = null;
    this.eventPhase = NEvent.NONE;
    this.propagationState = EventPropagationState.resume;
  }
}
