import { Writable } from './typeHelpers';

export declare class NEvent extends Event {
  propagationState: EventPropagationState;
  resetForRedispatch(): void;
}

export enum EventPropagationState {
  resume,
  stop,
  stopImmediate,
}

/**
 * Add our internal state helpers to happy-dom's Event
 */
export function patchEvent(): void {
  Object.defineProperty(Event.prototype, 'propagationState', {
    value: EventPropagationState.resume,
    writable: true,
    enumerable: false,
  });
  Object.defineProperty(Event.prototype, 'resetForRedispatch', {
    value: function (this: Writable<NEvent>): void {
      console.log('Sanity check: `this` should be the Event.', this);
      this.currentTarget = null;
      this.target = null;
      this.eventPhase = Event.NONE;
      this.propagationState = EventPropagationState.resume;
    },
    writable: false,
    enumerable: false,
  });
}
