import { EventTargetImpl } from "./EventTarget";
const { NodeList: NodeList_ } = require("./jsdom/living/nodes/NodeList-impl");

// @ts-ignore avoid installing node typings just to reference global object
const globalObject = global;

// TODO: swap this out for as much of Node-Impl.js as possible.
// Node.js mainly seems to do sanity checks on input args.
// Will need to install the npm package "symbol-tree", pulled in by "living/helpers/internal-constants.js".
export abstract class NodeImpl extends EventTargetImpl implements Node {
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
