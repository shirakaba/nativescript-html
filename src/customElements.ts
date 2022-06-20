/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
    View,
    LayoutBase,
    AbsoluteLayout,
    DockLayout,
    FlexboxLayout,
    GridLayout,
    StackLayout,
    WrapLayout,
    EventData,
} from "@nativescript/core";
import { debug } from "./debugLog";

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// TODO: it'll probably make sense to make a NativeScript equivalent for each
// one in the hierarchy of:
//   HTMLElement > Element > Node > EventTarget

type TNSEventListener = (args: EventData) => void;

// Hard to choose between extending from ViewBase or from View.
// View is the most primitive element that implements _addChildFromBuilder, and
// moreover is the one that defines and exports the AddChildFromBuilder in the
// first place.
export abstract class TNSDOMElement<N extends View> extends HTMLElement {
    abstract readonly nativeView: N;

    // START EventTarget
	public readonly _nativeEventListeners: {
		[k: string]: TNSEventListener[];
	} = {};
 
    addEventListener(
        event: string,
        handler: EventListenerOrEventListenerObject | TNSEventListener,
        options: AddEventListenerOptions = {}
    ): void
    {
        // TODO: call super

        const { capture, once } = options;
        if (capture) {
            debug('Bubble propagation is not supported');
            return;
        }
        if (once) {
            const oldHandler = handler as TNSEventListener;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handler = (...args: any[]) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore 
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                const res = oldHandler.call(null, ...args);
                if (res !== null) {
                    this.removeEventListener(event, handler)
                }
            }
        }

        this.nativeView.addEventListener(event, handler as TNSEventListener);
		this._nativeEventListeners[event] = this._nativeEventListeners[event] || [];
		this._nativeEventListeners[event].push(handler as TNSEventListener);
    }
 
    removeEventListener(
        event: string,
        handler?: EventListenerOrEventListenerObject | TNSEventListener,
    ): void {
        // TODO: call super

		if (this._nativeEventListeners[event]) {
			const index = this._nativeEventListeners[event].indexOf(handler as TNSEventListener);
			if (index !== -1) {
				this._nativeEventListeners[event].splice(index, 1);
			}
		}
        
        this.nativeView.removeEventListener(event, handler);
    }
 
    dispatchEvent(event: Event | EventData): boolean {
        // TODO: call super

		if (!(event as EventData).object) {
			(event as EventData).object = this.nativeView;
		}

        // @ts-ignore
		event.currentTarget = this;
        
        // DOM Level 0 Events will be hard to support
        const eventName = (event as EventData).eventName;
		const onEventName = `on${eventName.toLowerCase()}`;

        // @ts-ignore
		if (typeof this[onEventName] === 'function') {
            // @ts-ignore
			this[onEventName].call(this, event);
		}

		if (this._nativeEventListeners[eventName]) {
			for (const listener of this._nativeEventListeners[eventName]) {
                listener.call(this, event as EventData);
				if ((event as any)._immediatePropagationStopped) {
					return !((event as Event).cancelable && (event as Event).defaultPrevented);
				}
			}
		}

        // FIXME: sort out responsibilities of nativeView.notify() vs. listener.call()
        // @see https://github.com/NativeScript/NativeScript/blob/75b59ecdbf9ecd7c63684ca72b97b963356952d4/packages/core/data/observable/index.ts#L274
        // this.nativeView.notify({ eventName, object: this.nativeView });

        // return true;
		return !((event as Event).cancelable && (event as Event).defaultPrevented);
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

// TODO: check whether this class could actually apply more widely to instances
// of ContainerView, not just LayoutBase.
export abstract class DOMLayoutBase<N extends LayoutBase> extends TNSDOMElement<N> {
    appendChild<T extends Node>(node: T): T {
        const returnValue = super.appendChild(node);
        this.nativeView.addChild((node as unknown as TNSDOMElement<View>).nativeView);
        return returnValue;
    }
    removeChild<T extends Node>(child: T): T {
        const returnValue = super.removeChild(child);
        this.nativeView.removeChild((child as unknown as TNSDOMElement<View>).nativeView);
        return returnValue;
    }
    insertBefore<T extends Node>(newNode: T, referenceNode: Node | null): T {
        const returnValue = super.insertBefore(newNode, referenceNode);
        const childIndex = this.nativeView.getChildIndex((referenceNode as unknown as TNSDOMElement<View>).nativeView);
        this.nativeView.insertChild((newNode as unknown as TNSDOMElement<View>).nativeView, childIndex);
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
    class DOMAbsoluteLayout extends DOMLayoutBase<AbsoluteLayout> {
        readonly nativeView = new (require('@nativescript/core')).AbsoluteLayout();
    }
    customElements.define('absolute-layout', DOMAbsoluteLayout);
    class DOMDockLayout extends DOMLayoutBase<DockLayout> {
        readonly nativeView = new (require('@nativescript/core')).DockLayout();
    }
    customElements.define('dock-layout', DOMDockLayout);
    class DOMFlexboxLayout extends DOMLayoutBase<FlexboxLayout> {
        readonly nativeView = new (require('@nativescript/core')).FlexboxLayout();
    }
    customElements.define('flexbox-layout', DOMFlexboxLayout);
    class DOMGridLayout extends DOMLayoutBase<GridLayout> {
        readonly nativeView = new (require('@nativescript/core')).GridLayout();
    }
    customElements.define('grid-layout', DOMGridLayout);
    class DOMStackLayout extends DOMLayoutBase<StackLayout> {
        readonly nativeView = new (require('@nativescript/core')).StackLayout();
    }
    customElements.define('stack-layout', DOMStackLayout);
    class DOMWrapLayout extends DOMLayoutBase<WrapLayout> {
        readonly nativeView = new (require('@nativescript/core')).WrapLayout();
    }
    customElements.define('wrap-layout', DOMWrapLayout);
}
