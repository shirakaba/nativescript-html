import { NHTMLDivElement } from './HTMLDivElement';
import { em } from './Text';

export class NHTMLParagraphElement
  extends NHTMLDivElement
  implements HTMLParagraphElement
{
  constructor() {
    super();

    // font-size annoyingly doesn't cascade, so we'll lean on fontScale, which
    // does.

    // this.view.style.fontSize = fontSize;
    // I'm not sure whether setting this to 1 explicitly is redundant; depends
    // how the cascading works.
    this.view.style._fontScale = 1;

    this.view.style.marginTop = em;
    this.view.style.marginBottom = em;
  }
}
