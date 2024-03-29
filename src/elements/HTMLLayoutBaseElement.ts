import { LayoutBase } from '@nativescript/core';

import { NHTMLElement } from './NHTMLElement';
import { NText } from './Text';

// TODO: check whether this class could actually apply more widely to instances
// of ContainerView, not just LayoutBase.
export abstract class HTMLLayoutBaseElement<
  N extends LayoutBase
> extends NHTMLElement<N> {
  appendChild<T extends Node>(node: T): T {
    const returnValue = super.appendChild(node);

    if (node instanceof NHTMLElement || node instanceof NText) {
      this.view.addChild(node.view);
    }

    return returnValue;
  }

  removeChild<T extends Node>(child: T): T {
    const returnValue = super.removeChild(child);

    if (child instanceof NHTMLElement || child instanceof NText) {
      this.view.removeChild(child.view);
    }

    return returnValue;
  }

  insertBefore<T extends Node>(newNode: T, referenceNode: Node | null): T {
    const returnValue = super.insertBefore(newNode, referenceNode);

    if (
      (newNode instanceof NHTMLElement || newNode instanceof NText) &&
      (referenceNode === null ||
        referenceNode instanceof NHTMLElement ||
        referenceNode instanceof NText)
    ) {
      if (referenceNode) {
        const childIndex = this.view.getChildIndex(referenceNode.view);
        this.view.insertChild(newNode.view, childIndex);
      } else {
        this.view.addChild(newNode.view);
      }
    }

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
