import { NodeImpl } from "./Node";
const { NamedNodeMap: NamedNodeMap_ } = require("./jsdom/living/attributes/NamedNodeMap-impl");
const { DOMTokenList: DOMTokenList_ } = require("./jsdom/living/nodes/DOMTokenList-impl");
const { HTMLCollection: HTMLCollection_ } = require("./jsdom/living/nodes/HTMLCollection-impl");

// @ts-ignore avoid installing node typings just to reference global object
const globalObject = global;

export abstract class ElementImpl extends NodeImpl implements Element {
  attributes: NamedNodeMap = new NamedNodeMap_(globalObject, [], { element: this });
  classList: DOMTokenList = new DOMTokenList_(globalObject, [], { element: this, attributeLocalName: "classList" });
  className = "";
  clientHeight = 0;
  clientLeft = 0;
  clientTop = 0;
  clientWidth = 0;
  id = "";
  // Assuming HTML rather than XML, I think localName is effectively the 'p' in <p>.
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/localName
  localName!: string;
  // ... tagName is thus that, to upper case.
  tagName!: string;
  namespaceURI: string | null = null;
  onfullscreenchange: ((this: Element, ev: Event) => any) | null = null;
  onfullscreenerror: ((this: Element, ev: Event) => any) | null = null;
  ownerDocument!: Document;
  get outerHTML(): string {
    throw new Error("Method not implemented.");
  }
  part: DOMTokenList = new DOMTokenList_(globalObject, [], { element: this, attributeLocalName: "part" });
  prefix: string | null = null;
  scrollHeight = 0;
  scrollLeft = 0;
  scrollTop = 0;
  scrollWidth = 0;
  shadowRoot: ShadowRoot | null = null;
  slot = "";
  attachShadow(init: ShadowRootInit): ShadowRoot {
    throw new Error("Method not implemented.");
  }
  closest<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] | null;
  closest<K extends keyof SVGElementTagNameMap>(selector: K): SVGElementTagNameMap[K] | null;
  closest<E extends Element = Element>(selectors: string): E | null;
  closest<K extends keyof (SVGElementTagNameMap|HTMLElementTagNameMap), E extends Element = Element>(selectors: any): E | HTMLElementTagNameMap[K] | SVGElementTagNameMap[K] | null {
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
  getElementsByTagName<K extends keyof (SVGElementTagNameMap|HTMLElementTagNameMap)>(qualifiedName: any): HTMLCollectionOf<Element> | HTMLCollectionOf<HTMLElementTagNameMap[K]> | HTMLCollectionOf<SVGElementTagNameMap[K]> {
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
  get innerHTML(): string {
    throw new Error("Method not implemented.");
  }
  nextElementSibling: Element | null = null;
  previousElementSibling: Element | null = null;
  childElementCount = 0;
  children: HTMLCollection = new HTMLCollection_(
    globalObject,
    [],
    {
      element: this,
      // For a more thorough example of a query (and thus a live node map), see document.getElementsByName:
      // https://github.com/jsdom/jsdom/blob/04f6c13f4a4d387c7fc979b8f62c6f68d8a0c639/lib/jsdom/living/nodes/Document-impl.js#L502-L504
      query: () => this._childNodes.filter(n => n.nodeType === NodeImpl.ELEMENT_NODE),
    },
  );
  firstElementChild: Element | null = null;
  lastElementChild: Element | null = null;
  append(...nodes: (string | Node)[]): void {
    throw new Error("Method not implemented.");
  }
  prepend(...nodes: (string | Node)[]): void {
    throw new Error("Method not implemented.");
  }
  querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
  querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
  querySelector<E extends Element = Element>(selectors: string): E | null;
  querySelector<K extends keyof (SVGElementTagNameMap|HTMLElementTagNameMap), E extends Element = Element>(selectors: any): E | HTMLElementTagNameMap[K] | SVGElementTagNameMap[K] | null {
    throw new Error("Method not implemented.");
  }
  querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
  querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
  querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
  querySelectorAll<K extends keyof (SVGElementTagNameMap|HTMLElementTagNameMap), E extends Element = Element>(selectors: any): NodeListOf<HTMLElementTagNameMap[K]> | NodeListOf<SVGElementTagNameMap[K]> | NodeListOf<E> {
    throw new Error("Method not implemented.");
  }
  replaceChildren(...nodes: (string | Node)[]): void {
    throw new Error("Method not implemented.");
  }
  assignedSlot: HTMLSlotElement | null = null;
}
