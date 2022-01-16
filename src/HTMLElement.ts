import { ElementImpl } from "./Element";
const { DOMStringMap: DOMStringMap_ } = require("./jsdom/living/nodes/DOMStringMap-impl");

// @ts-ignore avoid installing node typings just to reference global object
const globalObject = global;

export class HTMLElementImpl extends ElementImpl implements HTMLElement {
  accessKey = "";
  accessKeyLabel = "";
  autocapitalize = "off";
  dir = "";
  get draggable(): boolean {
    throw new Error("Method not implemented.");
  }
  get hidden(): boolean {
    throw new Error("Method not implemented.");
  }
  get innerText(): string {
    throw new Error("Method not implemented.");
  }
  lang = "";
  offsetHeight = 0;
  offsetLeft = 0;
  get offsetParent(): Element | null {
    throw new Error("Method not implemented.");
  }
  offsetTop = 0;
  offsetWidth = 0;
  get outerText(): string {
    throw new Error("Method not implemented.");
  }
  spellcheck = false;
  title = "";
  translate = false;
  attachInternals(): ElementInternals {
    throw new Error("Method not implemented.");
  }
  click(): void {
    throw new Error("Method not implemented.");
  }
  oncopy: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null = null;
  oncut: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null = null;
  onpaste: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null = null;
  style: CSSStyleDeclaration;
  contentEditable = "inherit";
  enterKeyHint = "";
  inputMode = "";
  isContentEditable = false;
  onabort: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null = null;
  onanimationcancel: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null = null;
  onanimationend: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null = null;
  onanimationiteration: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null = null;
  onanimationstart: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null = null;
  onauxclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
  onblur: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null = null;
  oncanplay: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  oncanplaythrough: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onchange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
  onclose: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  oncontextmenu: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
  oncuechange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  ondblclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
  ondrag: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
  ondragend: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
  ondragenter: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
  ondragleave: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
  ondragover: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
  ondragstart: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
  ondrop: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
  ondurationchange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onemptied: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onended: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onerror: OnErrorEventHandler = null;
  onfocus: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null = null;
  onformdata: ((this: GlobalEventHandlers, ev: FormDataEvent) => any) | null = null;
  ongotpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
  oninput: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  oninvalid: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onkeydown: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null = null;
  onkeypress: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null = null;
  onkeyup: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null = null;
  onload: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onloadeddata: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onloadedmetadata: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onloadstart: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onlostpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
  onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
  onmouseenter: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
  onmouseleave: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
  onmousemove: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
  onmouseout: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
  onmouseover: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
  onmouseup: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
  onpause: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onplay: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onplaying: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onpointercancel: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
  onpointerdown: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
  onpointerenter: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
  onpointerleave: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
  onpointermove: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
  onpointerout: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
  onpointerover: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
  onpointerup: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
  onprogress: ((this: GlobalEventHandlers, ev: ProgressEvent<EventTarget>) => any) | null = null;
  onratechange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onreset: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onresize: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null = null;
  onscroll: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onseeked: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onseeking: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onselect: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onselectionchange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onselectstart: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onstalled: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onsubmit: ((this: GlobalEventHandlers, ev: SubmitEvent) => any) | null = null;
  onsuspend: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  ontimeupdate: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  ontoggle: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  ontouchcancel?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined = null;
  ontouchend?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined = null;
  ontouchmove?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined = null;
  ontouchstart?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined = null;
  ontransitioncancel: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null = null;
  ontransitionend: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null = null;
  ontransitionrun: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null = null;
  ontransitionstart: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null = null;
  onvolumechange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onwaiting: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onwebkitanimationend: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onwebkitanimationiteration: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onwebkitanimationstart: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onwebkittransitionend: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  onwheel: ((this: GlobalEventHandlers, ev: WheelEvent) => any) | null = null;
  get autofocus(): boolean {
    throw new Error("Method not implemented.");
  }
  dataset: DOMStringMap = new DOMStringMap_(globalObject, [], { element: this });
  nonce?: string | undefined;
  tabIndex = -1;
  blur(): void {
    throw new Error("Method not implemented.");
  }
  focus(options?: FocusOptions): void {
    throw new Error("Method not implemented.");
  }

}