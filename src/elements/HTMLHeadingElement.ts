import { NHTMLDivElement } from './HTMLDivElement';

export class NHTMLHeadingElement
  extends NHTMLDivElement
  implements HTMLHeadingElement
{
  postConstruction(): void {
    super.postConstruction();

    this.view.style.fontWeight = 'bold';

    // We could use a11yscale here
    const em = 16;
    let fontSize = em;
    let verticalMargin = em;

    switch (this.tagName) {
      case 'H1':
        fontSize = 2 * em;
        verticalMargin = (2 / 3) * em;
        break;
      case 'H2': {
        fontSize = 1.5 * em;
        verticalMargin = (5 / 6) * em;
        break;
      }
      case 'H3':
        fontSize = (7 / 6) * em;
        verticalMargin = em;
        break;
      case 'H4':
        fontSize = em;
        verticalMargin = (4 / 3) * em;
        break;
      case 'H5':
        fontSize = (5 / 6) * em;
        verticalMargin = (5 / 3) * em;
        break;
      case 'H6':
        fontSize = (2 / 3) * em;
        verticalMargin = (7 / 3) * em;
        break;
    }

    // font-size annoyingly doesn't cascade, so we'll lean on fontScale, which
    // does.
    const fontScale = fontSize / em;

    // this.view.style.fontSize = fontSize;
    this.view.style._fontScale = fontScale;

    this.view.style.marginTop = verticalMargin;
    this.view.style.marginBottom = verticalMargin;
  }
}
