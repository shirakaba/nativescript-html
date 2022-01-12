/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { logger } from "./Logger";
import type { EventData, ViewBase } from "@nativescript/core";
const { NamedNodeMap: NamedNodeMap_ } = require("./jsdom/living/attributes/NamedNodeMap-impl");
const { NodeList: NodeList_ } = require("./jsdom/living/nodes/NodeList-impl");

// @ts-ignore avoid installing node typings just to reference global object
const globalObject = global;

// TODO: split out into another file. 
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
Object.defineProperty(EventTarget_, 'name', { value: 'EventTarget' });
Object.defineProperty(globalObject, 'EventTarget', { value: 'EventTarget_' });

// TODO: swap this out for as much of Node-Impl.js as possible.
// Node.js mainly seems to do sanity checks on input args.
// Will need to install the npm package "symbol-tree", pulled in by "living/helpers/internal-constants.js".
export abstract class Node_ extends EventTarget_ implements Node {
  /** Referred to by jsdom's NodeList implementation. Overridden only by HTMLCollection and SVGListBase, to -1. */
  _version = 0;
  baseURI = "";
  _childNodes: ChildNode[] = [];
  childNodes: NodeListOf<ChildNode> = new NodeList_(
    globalObject,
    [],
    {
      element: this,
      // For a more thorough example of a query (and thus a live node map), see document.getElementsByName:
      // https://github.com/jsdom/jsdom/blob/04f6c13f4a4d387c7fc979b8f62c6f68d8a0c639/lib/jsdom/living/nodes/Document-impl.js#L502-L504
      query: () => this._childNodes,
    }
  );
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
Object.defineProperty(Node_, 'name', { value: 'Node' });
Object.defineProperty(globalObject, 'Node', { value: 'Node_' });


export abstract class Element_ extends Node_ implements Element {
  attributes: NamedNodeMap = new NamedNodeMap_(globalObject, [], { element: this });
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
