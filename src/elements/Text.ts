import { TextView } from '@nativescript/core';
import { Text } from 'happy-dom';

let patched = false;

export class NText extends Text {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  readonly view = new (require('@nativescript/core')
    .TextView as typeof TextView)();

  constructor(data: string) {
    super(data);

    this.view.text = data;
    this.view.minHeight = 'auto';
    this.view.padding = 0;
    this.view.margin = 0;

    this.view.fontSize = em;

    // TODO: implement contenteditable
    this.view.editable = false;
  }

  set data(data: string) {
    super.data = data;
    this.view.text = data;
  }
}

/**
 * Patch document.createTextNode() to return our doctored Text.
 */
export function patch(window: Window, document: typeof Document): void {
  if (patched) {
    return;
  }
  patched = true;

  Object.defineProperty(window, 'Text', { value: NText });
  Object.defineProperty(document.prototype, 'createTextNode', {
    value: function (data: string) {
      // @ts-ignore happy-dom does it for some reason.
      NText.ownerDocument = this;

      return new NText(data);
    },
  });
}

// This is the calculated value for font-size in px in iOS Safari on an iPhone
// 14 Pro Max.
export const em = 16;
