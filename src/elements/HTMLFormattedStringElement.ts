import { FormattedString, Span } from '@nativescript/core';

import { HTMLRunElement } from './HTMLRunElement';
import { NHTMLElement } from './NHTMLElement';

export abstract class HTMLFormattedStringElement<
  N extends FormattedString = FormattedString
> extends NHTMLElement<N> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  readonly view = new (require('@nativescript/core')
    .FormattedString as typeof FormattedString)() as N;

  readonly textsToSpans = new WeakMap<Text, Span>();

  appendChild<T extends Node>(node: T): T {
    const returnValue = super.appendChild(node);

    if (node instanceof HTMLRunElement) {
      this.view.spans.push(node.view);
    } else if (node instanceof Text) {
      const span = new Span();
      span.text = node.data;
      this.view.spans.push(span);
      this.textsToSpans.set(node, span);
    }

    return returnValue;
  }

  removeChild<T extends Node>(child: T): T {
    const returnValue = super.removeChild(child);

    if (child instanceof HTMLRunElement) {
      const index = this.view.spans.indexOf(child.view);
      if (index !== -1) {
        this.view.spans.splice(index, 1);
      }
    } else if (child instanceof Text) {
      const span = this.textsToSpans.get(child);
      const index = span ? this.view.spans.indexOf(span) : -1;
      if (index !== -1) {
        this.view.spans.splice(index, 1);
        this.textsToSpans.delete(child);
      }
    }

    return returnValue;
  }

  insertBefore<T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (!referenceNode) {
      return this.appendChild(newNode);
    }

    const returnValue = super.insertBefore(newNode, referenceNode);

    let referenceIndex = -1;
    if (referenceNode instanceof HTMLRunElement) {
      referenceIndex = this.view.spans.indexOf(referenceNode.view);
    } else if (referenceNode instanceof Text) {
      const span = this.textsToSpans.get(referenceNode);
      referenceIndex = span ? this.view.spans.indexOf(span) : -1;
    }
    if (referenceIndex === -1) {
      // TODO: throw
      return returnValue;
    }

    let span: Span;
    if (newNode instanceof HTMLRunElement) {
      span = newNode.view;
    } else if (newNode instanceof Text) {
      span = new Span();
      span.text = newNode.data;
      this.textsToSpans.set(newNode, span);
    } else {
      // TODO: throw
      return returnValue;
    }

    this.view.spans.splice(referenceIndex, 0, span);

    return returnValue;
  }
}
