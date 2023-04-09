import { HTMLWebElement } from './HTMLWebElement';

export class NHTMLSpanElement
  extends HTMLWebElement
  implements HTMLSpanElement
{
  constructor() {
    super();

    this.style.display = 'inline';
  }
}
