import { logger } from "./Logger";
import type { EventData, ViewBase } from "@nativescript/core";

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

/**
 * Warning: this implementation does not support indexing, e.g. nodeList[2].
 * I'm not sure how to implement that; might need Proxy?
 */
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

class DOMException_ implements DOMException {
    constructor(
        readonly message: string = "",
        readonly name: string = "Error",
    ){}
    get code(): number {
        switch(this.name){
            case "INDEX_SIZE_ERR": return this.INDEX_SIZE_ERR;
            case "DOMSTRING_SIZE_ERR": return this.DOMSTRING_SIZE_ERR;
            case "HIERARCHY_REQUEST_ERR": return this.HIERARCHY_REQUEST_ERR;
            case "WRONG_DOCUMENT_ERR": return this.WRONG_DOCUMENT_ERR;
            case "INVALID_CHARACTER_ERR": return this.INVALID_CHARACTER_ERR;
            case "NO_DATA_ALLOWED_ERR": return this.NO_DATA_ALLOWED_ERR;
            case "NO_MODIFICATION_ALLOWED_ERR": return this.NO_MODIFICATION_ALLOWED_ERR;
            case "NOT_FOUND_ERR": return this.NOT_FOUND_ERR;
            case "NOT_SUPPORTED_ERR": return this.NOT_SUPPORTED_ERR;
            case "INUSE_ATTRIBUTE_ERR": return this.INUSE_ATTRIBUTE_ERR;
            case "INVALID_STATE_ERR": return this.INVALID_STATE_ERR;
            case "SYNTAX_ERR": return this.SYNTAX_ERR;
            case "INVALID_MODIFICATION_ERR": return this.INVALID_MODIFICATION_ERR;
            case "NAMESPACE_ERR": return this.NAMESPACE_ERR;
            case "INVALID_ACCESS_ERR": return this.INVALID_ACCESS_ERR;
            case "VALIDATION_ERR": return this.VALIDATION_ERR;
            case "TYPE_MISMATCH_ERR": return this.TYPE_MISMATCH_ERR;
            case "SECURITY_ERR": return this.SECURITY_ERR;
            case "NETWORK_ERR": return this.NETWORK_ERR;
            case "ABORT_ERR": return this.ABORT_ERR;
            case "URL_MISMATCH_ERR": return this.URL_MISMATCH_ERR;
            case "QUOTA_EXCEEDED_ERR": return this.QUOTA_EXCEEDED_ERR;
            case "TIMEOUT_ERR": return this.TIMEOUT_ERR;
            case "INVALID_NODE_TYPE_ERR": return this.INVALID_NODE_TYPE_ERR;
            case "DATA_CLONE_ERR": return this.DATA_CLONE_ERR;
            default: return 0;
        }
    }
    INDEX_SIZE_ERR = 1;
    DOMSTRING_SIZE_ERR = 2;
    HIERARCHY_REQUEST_ERR = 3;
    WRONG_DOCUMENT_ERR = 4;
    INVALID_CHARACTER_ERR = 5;
    NO_DATA_ALLOWED_ERR = 6;
    NO_MODIFICATION_ALLOWED_ERR = 7;
    NOT_FOUND_ERR = 8;
    NOT_SUPPORTED_ERR = 9;
    INUSE_ATTRIBUTE_ERR = 10;
    INVALID_STATE_ERR = 11;
    SYNTAX_ERR = 12;
    INVALID_MODIFICATION_ERR = 13;
    NAMESPACE_ERR = 14;
    INVALID_ACCESS_ERR = 15;
    VALIDATION_ERR = 16;
    TYPE_MISMATCH_ERR = 17;
    SECURITY_ERR = 18;
    NETWORK_ERR = 19;
    ABORT_ERR = 20;
    URL_MISMATCH_ERR = 21;
    QUOTA_EXCEEDED_ERR = 22;
    TIMEOUT_ERR = 23;
    INVALID_NODE_TYPE_ERR = 24;
    DATA_CLONE_ERR = 25;
    stack?: string | undefined;
}

/**
 * I'm a bit unclear on how prefixes and namespaces work, so try to avoid namespaces altogether.
 */
class NamedNodeMap_ implements NamedNodeMap {
    [index: number]: Attr;
    map: Map<string, Attr> = new Map();
    get length(): number {
        return Object.keys(this.map).length;
    }
    getNamedItem(qualifiedName: string): Attr | null {
        return this.map.get(qualifiedName) || null;
    }
    getNamedItemNS(namespace: string | null, localName: string): Attr | null {
        const qualifiedName = `${namespace ? `${namespace}:` : ""}${localName}`;
        return this.getNamedItem(qualifiedName);
    }
    item(index: number): Attr | null {
        return this.map.get(Object.keys(this.map)[index]) || null;
    }
    removeNamedItem(qualifiedName: string): Attr {
        const attr = this.map.get(qualifiedName);
        if(!attr){
            throw new DOMException_("", "NOT_FOUND_ERR");
        }
        this.map.delete(qualifiedName);
        return attr;
    }
    removeNamedItemNS(namespace: string | null, localName: string): Attr {
        const qualifiedName = `${namespace ? `${namespace}:` : ""}${localName}`;
        const attr = this.map.get(qualifiedName);
        if(!attr){
            throw new DOMException_("", "NOT_FOUND_ERR");
        }
        this.map.delete(qualifiedName);
        return attr;
    }
    setNamedItem(attr: Attr): Attr | null {
        const {
            localName,
            namespaceURI: namespace = null,
            prefix = null,
        } = attr;
        const prefixedNamespace = (prefix && namespace) ? `${prefix}:` : "";
        const qualifiedName = `${prefixedNamespace}${localName}`;
        let existingAttr = this.getNamedItem(qualifiedName);
        if(existingAttr === null){
            existingAttr = attr;
        }
        this.map.set(qualifiedName, attr);
        return existingAttr;
    }
    setNamedItemNS(attr: Attr): Attr | null {
        return this.setNamedItem(attr);
    }
    [Symbol.iterator](): IterableIterator<Attr> {
        return this.map[Symbol.iterator]();
    }
}

/**
 * Warning: this implementation does not support indexing, e.g. nodeList[2].
 * I'm not sure how to implement that; might need Proxy?
 */
export abstract class Element_ extends Node_ implements Element {
    attributes: NamedNodeMap;
    classList: DOMTokenList;
    className: string;
    clientHeight: number;
    clientLeft: number;
    clientTop: number;
    clientWidth: number;
    id: string;
    localName: string;
    namespaceURI: string | null;
    onfullscreenchange: ((this: Element, ev: Event) => any) | null;
    onfullscreenerror: ((this: Element, ev: Event) => any) | null;
    outerHTML: string;
    part: DOMTokenList;
    prefix: string | null;
    scrollHeight: number;
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
    shadowRoot: ShadowRoot | null;
    slot: string;
    tagName: string;
    attachShadow(init: ShadowRootInit): ShadowRoot {
        throw new Error("Method not implemented.");
    }
    closest<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] | null;
    closest<K extends keyof SVGElementTagNameMap>(selector: K): SVGElementTagNameMap[K] | null;
    closest<E extends Element = Element>(selectors: string): E | null;
    closest(selectors: any): E | HTMLElementTagNameMap[K] | SVGElementTagNameMap[K] | null {
        throw new Error("Method not implemented.");
    }
    getAttribute(qualifiedName: string): string | null {
        throw new Error("Method not implemented.");
    }
    getAttributeNS(namespace: string | null, localName: string): string | null {
        throw new Error("Method not implemented.");
    }
    getAttributeNames(): string[] {
        throw new Error("Method not implemented.");
    }
    getAttributeNode(qualifiedName: string): Attr | null {
        throw new Error("Method not implemented.");
    }
    getAttributeNodeNS(namespace: string | null, localName: string): Attr | null {
        throw new Error("Method not implemented.");
    }
    getBoundingClientRect(): DOMRect {
        throw new Error("Method not implemented.");
    }
    getClientRects(): DOMRectList {
        throw new Error("Method not implemented.");
    }
    getElementsByClassName(classNames: string): HTMLCollectionOf<Element> {
        throw new Error("Method not implemented.");
    }
    getElementsByTagName<K extends keyof HTMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
    getElementsByTagName<K extends keyof SVGElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<SVGElementTagNameMap[K]>;
    getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
    getElementsByTagName(qualifiedName: any): HTMLCollectionOf<Element> | HTMLCollectionOf<HTMLElementTagNameMap[K]> | HTMLCollectionOf<SVGElementTagNameMap[K]> {
        throw new Error("Method not implemented.");
    }
    getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
    getElementsByTagNameNS(namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
    getElementsByTagNameNS(namespace: string | null, localName: string): HTMLCollectionOf<Element>;
    getElementsByTagNameNS(namespace: any, localName: any): HTMLCollectionOf<Element> | HTMLCollectionOf<HTMLElement> | HTMLCollectionOf<SVGElement> {
        throw new Error("Method not implemented.");
    }
    hasAttribute(qualifiedName: string): boolean {
        throw new Error("Method not implemented.");
    }
    hasAttributeNS(namespace: string | null, localName: string): boolean {
        throw new Error("Method not implemented.");
    }
    hasAttributes(): boolean {
        throw new Error("Method not implemented.");
    }
    hasPointerCapture(pointerId: number): boolean {
        throw new Error("Method not implemented.");
    }
    insertAdjacentElement(where: InsertPosition, element: Element): Element | null {
        throw new Error("Method not implemented.");
    }
    insertAdjacentHTML(position: InsertPosition, text: string): void {
        throw new Error("Method not implemented.");
    }
    insertAdjacentText(where: InsertPosition, data: string): void {
        throw new Error("Method not implemented.");
    }
    matches(selectors: string): boolean {
        throw new Error("Method not implemented.");
    }
    releasePointerCapture(pointerId: number): void {
        throw new Error("Method not implemented.");
    }
    removeAttribute(qualifiedName: string): void {
        throw new Error("Method not implemented.");
    }
    removeAttributeNS(namespace: string | null, localName: string): void {
        throw new Error("Method not implemented.");
    }
    removeAttributeNode(attr: Attr): Attr {
        throw new Error("Method not implemented.");
    }
    requestFullscreen(options?: FullscreenOptions): Promise<void> {
        throw new Error("Method not implemented.");
    }
    requestPointerLock(): void {
        throw new Error("Method not implemented.");
    }
    scroll(options?: ScrollToOptions): void;
    scroll(x: number, y: number): void;
    scroll(x?: any, y?: any): void {
        throw new Error("Method not implemented.");
    }
    scrollBy(options?: ScrollToOptions): void;
    scrollBy(x: number, y: number): void;
    scrollBy(x?: any, y?: any): void {
        throw new Error("Method not implemented.");
    }
    scrollIntoView(arg?: boolean | ScrollIntoViewOptions): void {
        throw new Error("Method not implemented.");
    }
    scrollTo(options?: ScrollToOptions): void;
    scrollTo(x: number, y: number): void;
    scrollTo(x?: any, y?: any): void {
        throw new Error("Method not implemented.");
    }
    setAttribute(qualifiedName: string, value: string): void {
        throw new Error("Method not implemented.");
    }
    setAttributeNS(namespace: string | null, qualifiedName: string, value: string): void {
        throw new Error("Method not implemented.");
    }
    setAttributeNode(attr: Attr): Attr | null {
        throw new Error("Method not implemented.");
    }
    setAttributeNodeNS(attr: Attr): Attr | null {
        throw new Error("Method not implemented.");
    }
    setPointerCapture(pointerId: number): void {
        throw new Error("Method not implemented.");
    }
    toggleAttribute(qualifiedName: string, force?: boolean): boolean {
        throw new Error("Method not implemented.");
    }
    webkitMatchesSelector(selectors: string): boolean {
        throw new Error("Method not implemented.");
    }
    // NativeScript Core does not implement ARIA, and the typings don't accept null, so we'll go with empty-string.
    ariaAtomic = "";
    ariaAutoComplete = "";
    ariaBusy = "";
    ariaChecked = "";
    ariaColCount = "";
    ariaColIndex = "";
    ariaColSpan = "";
    ariaCurrent = "";
    ariaDisabled = "";
    ariaExpanded = "";
    ariaHasPopup = "";
    ariaHidden = "";
    ariaKeyShortcuts = "";
    ariaLabel = "";
    ariaLevel = "";
    ariaLive = "";
    ariaModal = "";
    ariaMultiLine = "";
    ariaMultiSelectable = "";
    ariaOrientation = "";
    ariaPlaceholder = "";
    ariaPosInSet = "";
    ariaPressed = "";
    ariaReadOnly = "";
    ariaRequired = "";
    ariaRoleDescription = "";
    ariaRowCount = "";
    ariaRowIndex = "";
    ariaRowSpan = "";
    ariaSelected = "";
    ariaSetSize = "";
    ariaSort = "";
    ariaValueMax = "";
    ariaValueMin = "";
    ariaValueNow = "";
    ariaValueText = "";
    animate(keyframes: Keyframe[] | PropertyIndexedKeyframes | null, options?: number | KeyframeAnimationOptions): Animation {
        throw new Error("Method not implemented.");
    }
    getAnimations(options?: GetAnimationsOptions): Animation[] {
        throw new Error("Method not implemented.");
    }
    after(...nodes: (string | Node)[]): void {
        throw new Error("Method not implemented.");
    }
    before(...nodes: (string | Node)[]): void {
        throw new Error("Method not implemented.");
    }
    remove(): void {
        throw new Error("Method not implemented.");
    }
    replaceWith(...nodes: (string | Node)[]): void {
        throw new Error("Method not implemented.");
    }
    innerHTML: string;
    nextElementSibling: Element | null;
    previousElementSibling: Element | null;
    childElementCount: number;
    children: HTMLCollection;
    firstElementChild: Element | null;
    lastElementChild: Element | null;
    append(...nodes: (string | Node)[]): void {
        throw new Error("Method not implemented.");
    }
    prepend(...nodes: (string | Node)[]): void {
        throw new Error("Method not implemented.");
    }
    querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
    querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
    querySelector<E extends Element = Element>(selectors: string): E | null;
    querySelector(selectors: any): E | HTMLElementTagNameMap[K] | SVGElementTagNameMap[K] | null {
        throw new Error("Method not implemented.");
    }
    querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
    querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
    querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
    querySelectorAll(selectors: any): NodeListOf<HTMLElementTagNameMap[K]> | NodeListOf<SVGElementTagNameMap[K]> | NodeListOf<E> {
        throw new Error("Method not implemented.");
    }
    replaceChildren(...nodes: (string | Node)[]): void {
        throw new Error("Method not implemented.");
    }
    assignedSlot: HTMLSlotElement | null;

}
