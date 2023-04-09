import { HTMLWebElement } from './HTMLWebElement';

export class HTMLDivElement extends HTMLWebElement {
  constructor() {
    super();

    this.style.display = 'block';
  }
}
