import { Color } from '@nativescript/core';
import DOMTokenList from 'happy-dom/lib/dom-token-list/DOMTokenList';

import { NHTMLSpanElement } from './HTMLSpanElement';

export class NHTMLAnchorElement
  extends NHTMLSpanElement
  implements HTMLAnchorElement
{
  constructor() {
    super();

    // font-size annoyingly doesn't cascade, so we'll lean on fontScale, which
    // does.

    // this.view.style.fontSize = fontSize;
    // I'm not sure whether setting this to 1 explicitly is redundant; depends
    // how the cascading works.
    this.view.style._fontScale = 1;

    this.view.style.color = new Color('blue');
    this.view.style.textDecoration = 'underline';
  }

  // Horrible makeshift way to propagate underline styling (for
  // proof-of-concept only)
  appendChild<T extends Node>(node: T): T {
    const returnValue = super.appendChild(node);

    this.view.eachChildView((view) => {
      view.style.textDecoration = this.view.style.textDecoration;
      return true;
    });

    return returnValue;
  }

  charset = '';
  coords = '';
  download = '';
  hreflang = '';
  name = '';
  ping = '';
  referrerPolicy = '';
  rel = '';
  // @ts-ignore
  relList = new DOMTokenList(this, '') as unknown as DOMTokenList;
  rev = '';
  shape = '';
  target = '';
  text = '';
  type = '';
  hash = '';
  host = '';
  hostname = '';
  href = '';
  toString(): string {
    throw new Error('Method not implemented.');
  }
  origin = '';
  password = '';
  pathname = '';
  port = '';
  protocol = '';
  search = '';
  username = '';
}
