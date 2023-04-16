import {
  FormattedString,
  Label,
  LayoutBase,
  TextBase,
} from '@nativescript/core';

import { NHTMLElement } from './NHTMLElement';

// TODO: check whether this class could actually apply more widely to instances
// of ContainerView, not just LayoutBase.
export abstract class HTMLLayoutBaseElement<
  N extends LayoutBase
> extends NHTMLElement<N> {
  appendChild<T extends Node>(node: T): T {
    const returnValue = super.appendChild(node);

    if (node instanceof NHTMLElement) {
      this.view.addChild(node.view);
    } else if (node instanceof Text) {
      this.appendText(node);
    }

    return returnValue;
  }

  private appendText(node: Text): void {
    const span = node.span;

    const lastChild = this.view.getChildAt(this.view.getChildrenCount() - 1);

    const textBase = lastChild instanceof Label ? lastChild : new Label();
    // Can't set max-lines through CSS, so will do this for now.
    textBase.style.maxLines = 0;

    if (!textBase.formattedText) {
      textBase.formattedText = new FormattedString();
    }

    const length = textBase.formattedText.spans.push(span);
    if (length === 1) {
      this.view.addChild(textBase);
    }
  }

  removeChild<T extends Node>(child: T): T {
    const errorMessage = 'Failed to remove node. Node is not child of parent.';

    const returnValue = super.removeChild(child);

    if (child instanceof NHTMLElement) {
      this.view.removeChild(child.view);
    } else if (child instanceof Text) {
      const span = child.span;
      const formattedString = span.parent;
      if (!(formattedString instanceof FormattedString)) {
        throw new DOMException(errorMessage);
      }
      const textBase = formattedString.parent;
      if (!(textBase instanceof TextBase)) {
        throw new DOMException(errorMessage);
      }

      textBase.formattedText.spans.splice(
        textBase.formattedText.spans.indexOf(span),
        1
      );

      if (!textBase.formattedText.spans.length) {
        this.view.removeChild(textBase);
      }
    }

    return returnValue;
  }

  insertBefore<T extends Node>(newNode: T, referenceNode: Node | null): T {
    const returnValue = super.insertBefore(newNode, referenceNode);

    if (
      (newNode instanceof NHTMLElement || newNode instanceof Text) &&
      (referenceNode === null ||
        referenceNode instanceof NHTMLElement ||
        referenceNode instanceof Text)
    ) {
      if (referenceNode) {
        if (referenceNode instanceof NHTMLElement) {
          this.insertBeforeNHTMLElement(referenceNode, newNode);
        } else {
          this.insertBeforeText(referenceNode, newNode);
        }
      } else {
        if (newNode instanceof NHTMLElement) {
          this.view.addChild(newNode.view);
        } else {
          this.appendText(newNode);
        }
      }
    }

    return returnValue;
  }

  private insertBeforeNHTMLElement(
    referenceNode: NHTMLElement,
    newNode: NHTMLElement | Text
  ): void {
    const childIndex = this.view.getChildIndex(referenceNode.view);
    if (newNode instanceof NHTMLElement) {
      this.view.insertChild(newNode.view, childIndex);
    } else {
      const prevTextBase = this.view.getChildAt(childIndex - 1);

      if (prevTextBase instanceof TextBase) {
        prevTextBase.formattedText.spans.push(newNode.span);
      } else {
        const label = new Label();
        label.formattedText.spans.push(newNode.span);
        this.view.insertChild(label, childIndex);
      }
    }
  }

  private insertBeforeText(
    referenceNode: Text,
    newNode: NHTMLElement | Text
  ): void {
    const errorMessage =
      "Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.";

    const span = referenceNode.span;
    const formattedString = span.parent;
    if (!(formattedString instanceof FormattedString)) {
      throw new DOMException(errorMessage);
    }
    const textBase = formattedString.parent;
    if (!(textBase instanceof TextBase)) {
      throw new DOMException(errorMessage);
    }
    const textBaseIndex = this.view.getChildIndex(textBase);
    if (textBaseIndex === -1) {
      throw new DOMException(errorMessage);
    }

    // Now that we have resolved the owner of the referenceNode, insert the
    // newNode before it.

    const spanIndex = formattedString.spans.indexOf(span);
    if (spanIndex === -1) {
      throw new DOMException(errorMessage);
    }

    if (newNode instanceof Text) {
      formattedString.spans.splice(spanIndex, 0, newNode.span);
    } else {
      if (spanIndex === 0) {
        // We can insert before the TextBase.
        this.view.insertChild(newNode.view, textBaseIndex);
      } else {
        // We have to split the TextBase.
        const label = new Label();
        // Can't set max-lines through CSS, so will do this for now.
        label.style.maxLines = 0;

        const spansBeforeIndex = formattedString.spans.splice(spanIndex);
        label.formattedText.spans.push(...spansBeforeIndex);

        this.view.insertChild(newNode.view, textBaseIndex);
        this.view.insertChild(label, textBaseIndex);
      }
    }
  }

  // Node.replaceChild() is fine as-is, as it calls Node.insertBefore()
  // followed by Node.removeChild() (both of which we've reimplemented)

  // ParentNode.append(), ParentNode.prepend(), and
  // ParentNode.replaceChildren() also just call Node.append()
  // Node.insertBefore(), and Node.removeChild() under-the-hood.

  // ChildNode.remove(), ChildNode.replaceWith(), ChildNode.after(), and
  // ChildNode.before() also use existing methods under-the-hood.
}
