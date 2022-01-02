import { logger } from "./Logger";
import type { EventData, ViewBase } from "@nativescript/core";
import { implementation as EventTargetJSDOM } from "jsdom/lib/jsdom/living/events/EventTarget-impl";
import { mixin } from "jsdom/lib/jsdom/utils.js";
import { implementation as NodeImpl } from "jsdom/lib/jsdom/living/nodes/Node-impl";
import { implementation as ElementImpl } from "jsdom/lib/jsdom/living/nodes/Element-impl";

/**
 * NativeScript has its own event handling system, which is less fully featured than that of a browser,
 * so we basically have to override EventTarget in its entirety.
 * From https://github.com/shirakaba/react-nativescript/blob/43403fc3d51efe557570bb5a06daced2b09fb408/react-nativescript/src/nativescript-vue-next/runtime/nodes.ts#L187-L227
 */
export class EventTargetTNS implements EventTarget {
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
mixin(EventTargetJSDOM.prototype, EventTargetTNS.prototype);
