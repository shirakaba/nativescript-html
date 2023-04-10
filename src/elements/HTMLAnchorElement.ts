import DOMTokenList from 'happy-dom/lib/dom-token-list/DOMTokenList';

import { NHTMLSpanElement } from './HTMLSpanElement';

export class NHTMLAnchorElement
  extends NHTMLSpanElement
  implements HTMLAnchorElement
{
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
