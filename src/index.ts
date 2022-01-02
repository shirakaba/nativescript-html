import { logger } from "./Logger";
import type { EventData, ViewBase } from "@nativescript/core";
import { implementation as EventTargetImpl } from "jsdom/lib/jsdom/living/events/EventTarget-impl";
import { mixin } from "jsdom/lib/jsdom/utils.js";
// import { implementation as NodeImpl } from "jsdom/lib/jsdom/living/nodes/Node-impl.js";

// From https://github.com/shirakaba/react-nativescript/blob/43403fc3d51efe557570bb5a06daced2b09fb408/react-nativescript/src/nativescript-vue-next/runtime/nodes.ts#L187-L227
export class EventTarget_ implements EventTarget {
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
// mixin(EventTargetImpl.prototype, )

class NodeList_ implements NodeList {
    [index: number]: Node;
    private array: Node[] = [];
    get length(): number {
        return this.array.length;
    }
    item(index: number): Node | null {
        return this.array[index] || null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forEach(callbackfn: (value: Node, key: number, parent: NodeList) => void, thisArg?: any): void {
        this.array.forEach((node: Node, index: number) => {
            callbackfn(node, index, this);
        });
    }
    entries(): IterableIterator<[number, Node]> {
        return this.array.entries();
    }
    keys(): IterableIterator<number> {
        return this.array.keys();
    }
    values(): IterableIterator<Node> {
        return this.array.values();
    }
    [Symbol.iterator](): IterableIterator<Node> {
        return this.array[Symbol.iterator]();
    }
}

export abstract class Node_ extends EventTarget_ implements Node {
    baseURI = "";
    // I can't get the generics to be happy, but the implementation is fine.
    childNodes: NodeListOf<ChildNode> = new NodeList_() as unknown as NodeListOf<ChildNode>;
    firstChild: ChildNode | null = null;
    isConnected = false;
    lastChild: ChildNode | null = null;
    nextSibling: ChildNode | null = null;
    abstract nodeName: string;
    abstract nodeType: number;
    nodeValue: string | null = null;
    ownerDocument: Document | null = null;
    parentElement: HTMLElement | null = null;
    parentNode: ParentNode | null = null;
    previousSibling: ChildNode | null = null;
    textContent: string | null = null;
    appendChild<T extends Node>(node: T): T {
        throw new Error("Method not implemented.");
    }
    cloneNode(deep?: boolean): Node {
        throw new Error("Method not implemented.");
    }
    compareDocumentPosition(other: Node): number {
        throw new Error("Method not implemented.");
    }
    contains(other: Node | null): boolean {
        throw new Error("Method not implemented.");
    }
    getRootNode(options?: GetRootNodeOptions): Node {
        throw new Error("Method not implemented.");
    }
    hasChildNodes(): boolean {
        throw new Error("Method not implemented.");
    }
    insertBefore<T extends Node>(node: T, child: Node | null): T {
        throw new Error("Method not implemented.");
    }
    isDefaultNamespace(namespace: string | null): boolean {
        throw new Error("Method not implemented.");
    }
    isEqualNode(otherNode: Node | null): boolean {
        throw new Error("Method not implemented.");
    }
    isSameNode(otherNode: Node | null): boolean {
        throw new Error("Method not implemented.");
    }
    lookupNamespaceURI(prefix: string | null): string | null {
        throw new Error("Method not implemented.");
    }
    lookupPrefix(namespace: string | null): string | null {
        throw new Error("Method not implemented.");
    }
    normalize(): void {
        throw new Error("Method not implemented.");
    }
    removeChild<T extends Node>(child: T): T {
        throw new Error("Method not implemented.");
    }
    replaceChild<T extends Node>(node: Node, child: T): T {
        throw new Error("Method not implemented.");
    }
    ATTRIBUTE_NODE = 2;
    CDATA_SECTION_NODE = 4;
    COMMENT_NODE = 8;
    DOCUMENT_FRAGMENT_NODE = 11;
    DOCUMENT_NODE = 9;
    DOCUMENT_POSITION_CONTAINED_BY = 16;
    DOCUMENT_POSITION_CONTAINS = 8;
    DOCUMENT_POSITION_DISCONNECTED = 1;
    DOCUMENT_POSITION_FOLLOWING = 4;
    DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
    DOCUMENT_POSITION_PRECEDING = 2;
    DOCUMENT_TYPE_NODE = 10;
    ELEMENT_NODE = 1;
    ENTITY_NODE = 6;
    ENTITY_REFERENCE_NODE = 5;
    NOTATION_NODE = 12;
    PROCESSING_INSTRUCTION_NODE = 7;
    TEXT_NODE = 3;
}
