/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class NativeScriptDOMElement<N extends import('@nativescript/core').ViewBase> extends HTMLElement {
    abstract readonly nativeView: N;
    // TODO: EventTarget methods.
    // TODO: We probably get Node.textContent and HTMLElement.innerText for
    // free, but will have to think about how to mirror updates to
    // Text.wholeText and Node.data for text elements.
    // @see Text > CharacterData > Node
}

export abstract class DOMLayoutBase<N extends import('@nativescript/core').LayoutBase> extends NativeScriptDOMElement<N> {
    abstract readonly nativeView: N;
    appendChild<T extends Node>(node: T): T {
        const returnValue = super.appendChild(node);
        this.nativeView.addChild((node as unknown as NativeScriptDOMElement<import('@nativescript/core').View>).nativeView);
        return returnValue;
    }
    removeChild<T extends Node>(child: T): T {
        const returnValue = super.removeChild(child);
        this.nativeView.removeChild((child as unknown as NativeScriptDOMElement<import('@nativescript/core').View>).nativeView);
        return returnValue;
    }
    replaceChild<T extends Node>(newChild: Node, oldChild: T): T {
        const returnValue = super.replaceChild(newChild, oldChild);
        const childIndex = this.nativeView.getChildIndex((oldChild as unknown as NativeScriptDOMElement<import('@nativescript/core').View>).nativeView);
        this.nativeView.removeChild((oldChild as unknown as NativeScriptDOMElement<import('@nativescript/core').View>).nativeView);
        this.nativeView.insertChild((newChild as unknown as NativeScriptDOMElement<import('@nativescript/core').View>).nativeView, childIndex);
        return returnValue;
    }
}

export function registerCustomElements(): void {
    class DOMAbsoluteLayout extends DOMLayoutBase<import('@nativescript/core').AbsoluteLayout> {
        readonly nativeView = new (require('@nativescript/core')).AbsoluteLayout();
    }
    customElements.define('absolute-layout', DOMAbsoluteLayout);
    class DOMDockLayout extends DOMLayoutBase<import('@nativescript/core').DockLayout> {
        readonly nativeView = new (require('@nativescript/core')).DockLayout();
    }
    customElements.define('dock-layout', DOMDockLayout);
    class DOMFlexboxLayout extends DOMLayoutBase<import('@nativescript/core').FlexboxLayout> {
        readonly nativeView = new (require('@nativescript/core')).FlexboxLayout();
    }
    customElements.define('flexbox-layout', DOMFlexboxLayout);
    class DOMGridLayout extends DOMLayoutBase<import('@nativescript/core').GridLayout> {
        readonly nativeView = new (require('@nativescript/core')).GridLayout();
    }
    customElements.define('grid-layout', DOMGridLayout);
    class DOMStackLayout extends DOMLayoutBase<import('@nativescript/core').StackLayout> {
        readonly nativeView = new (require('@nativescript/core')).StackLayout();
    }
    customElements.define('stack-layout', DOMStackLayout);
    class DOMWrapLayout extends DOMLayoutBase<import('@nativescript/core').WrapLayout> {
        readonly nativeView = new (require('@nativescript/core')).WrapLayout();
    }
    customElements.define('wrap-layout', DOMWrapLayout);
}
