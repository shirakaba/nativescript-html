import type { EventData, ViewBase } from "@nativescript/core";
import { logger } from "./Logger";

// From https://github.com/shirakaba/react-nativescript/blob/43403fc3d51efe557570bb5a06daced2b09fb408/react-nativescript/src/nativescript-vue-next/runtime/nodes.ts#L187-L227
export class EventTargetImpl implements EventTarget {
  private nativeView: ViewBase|null = null;
  private _eventListeners?: Map<string, (args: EventData) => void>;

  get eventListeners(): Map<string, (args: EventData) => void> {
    if(!this._eventListeners){
      this._eventListeners = new Map();
    }
    return this._eventListeners;
  }
 
  addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void {
    if(typeof options === "boolean"){
       throw new Error("The addEventListener 'options' param must be an object and not a boolean.");
    }
    if(callback === null){
       throw new Error("addEventListener expected non-null callback.");
    }
    const { capture, once } = options || {};
    if (capture) {
      logger.debug("Bubble propagation is not supported");
      return;
    }
    if (once) {
      const oldCallback = callback;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback = (...args: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const res: unknown = (oldCallback as (...args: unknown[]) => unknown).call(null, ...args);
        if (res !== null) {
          self.removeEventListener(type, callback);
        }
      }
    }
    this.nativeView?.addEventListener(type, callback as unknown as (data: EventData) => void);
    this.eventListeners.set(type, callback as unknown as (data: EventData) => void);
  }
 
  removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void {
    this.eventListeners.delete(type);
    this.nativeView?.removeEventListener(type, callback);
  }
 
  dispatchEvent(event: Event): boolean {
    this.nativeView?.notify({ eventName: event.type, object: this.nativeView })
    return !event.cancelable || event.defaultPrevented;
  }
}
