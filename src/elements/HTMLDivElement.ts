import { HTMLWebElement } from './HTMLWebElement';

export class NHTMLDivElement extends HTMLWebElement implements HTMLDivElement {
  constructor() {
    super();

    this.style.display = 'block';
  }
  align = 'left';
}
