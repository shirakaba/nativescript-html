import { FormattedString, Span, TextBase } from '@nativescript/core';

import { HTMLFormattedStringElement } from './HTMLFormattedStringElement';
import { NHTMLElement } from './NHTMLElement';

export abstract class HTMLTextBaseElement<
  N extends TextBase
> extends NHTMLElement<N> {
  readonly textsToSpans = new WeakMap<Text, Span>();

  appendChild<T extends Node>(node: T): T {
    const returnValue = super.appendChild(node);

    if (node instanceof HTMLFormattedStringElement) {
      this.view.formattedText = node.view;
    } else if (node instanceof Text) {
      if (!this.view.formattedText) {
        this.view.formattedText = new FormattedString();
      }

      const span = new Span();
      span.text = node.data;
      this.view.formattedText.spans.push(span);
      this.textsToSpans.set(node, span);
    }

    return returnValue;
  }

  removeChild<T extends Node>(child: T): T {
    const returnValue = super.removeChild(child);

    if (child instanceof HTMLFormattedStringElement) {
      if (this.view.formattedText === child.view) {
        this.view.formattedText = new FormattedString();
      }
    } else if (child instanceof Text) {
      const span = this.textsToSpans.get(child);
      const index = span
        ? this.view.formattedText?.spans.indexOf(span) ?? -1
        : -1;
      if (index !== -1) {
        this.view.formattedText.spans.splice(index, 1);
      }
    }

    return returnValue;
  }

  insertBefore<T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (!referenceNode) {
      return this.appendChild(newNode);
    }

    const returnValue = super.insertBefore(newNode, referenceNode);

    if (newNode instanceof HTMLFormattedStringElement) {
      this.view.formattedText = newNode.view;
      return returnValue;
    }

    let referenceIndex = -1;
    if (referenceNode instanceof Text) {
      const span = this.textsToSpans.get(referenceNode);
      referenceIndex = span
        ? this.view.formattedText?.spans.indexOf(span) ?? -1
        : -1;
    }
    if (referenceIndex === -1) {
      return returnValue;
    }

    if (newNode instanceof Text) {
      const span = new Span();
      span.text = newNode.data;
      this.view.formattedText.spans.splice(referenceIndex, 0, span);
      this.textsToSpans.set(newNode, span);
    }

    return returnValue;
  }
}
