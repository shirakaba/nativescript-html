import { EventTargetTNS } from "./EventTarget";
import { implementation as NodeList } from "jsdom/lib/jsdom/living/nodes/NodeList-impl";

export abstract class NodeTNS extends EventTargetTNS implements Node {
    baseURI = "";
    // I can't get the generics to be happy, but the implementation is fine.
    childNodes: NodeListOf<ChildNode> = new NodeList() as NodeListOf<ChildNode>;
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
