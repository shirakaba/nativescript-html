import { Span } from '@nativescript/core';

import { NHTMLElement } from './NHTMLElement';

// Can't use the name 'span' as it conflicts with HTML
export abstract class HTMLNSpanElement<
  N extends Span = Span
> extends NHTMLElement<N> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  readonly view = new (require('@nativescript/core')
    .Span as typeof Span)() as N;

  textForSpan: Text | null = null;

  appendChild<T extends Node>(node: T): T {
    const returnValue = super.appendChild(node);

    // We only support one text node child at a time for the Span.
    if (node instanceof Text && !this.textForSpan) {
      this.view.text = node.data;
      this.textForSpan = node;
    }

    return returnValue;
  }

  removeChild<T extends Node>(child: T): T {
    const returnValue = super.removeChild(child);

    // We only support one text node child at a time for the Span.
    if (child instanceof Text && child === this.textForSpan) {
      this.view.text = '';
      this.textForSpan = null;
    }

    return returnValue;
  }

  insertBefore<T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (!referenceNode) {
      return this.appendChild(newNode);
    }

    const returnValue = super.insertBefore(newNode, referenceNode);

    // We don't support insertBefore because this is a single-child element.

    return returnValue;
  }
}
