let patched = false;

declare const window: { Text: typeof Text };

// TODO: no longer has a view, so can deprecate this. But the implementation of
// wholeText is still valuable..
export class NText extends window.Text {
  get wholeText(): string {
    let wholeText = '';

    let prev = this.previousSibling;
    while (prev && prev.nodeType === Node.TEXT_NODE) {
      wholeText = wholeText + (prev as unknown as Text).data;
      prev = prev.previousSibling;
    }

    wholeText += this.data;

    let next = this.nextSibling;
    while (next && next.nodeType === Node.TEXT_NODE) {
      wholeText += (next as unknown as Text).data;
      next = next.nextSibling;
    }

    return wholeText;
  }

  set wholeText(value: string) {
    const toRemove: Text[] = [];

    let prev = this.previousSibling;
    while (prev && prev.nodeType === Node.TEXT_NODE) {
      toRemove.unshift(prev as Text);
      prev = prev.previousSibling;
    }

    let next = this.nextSibling;
    while (next && next.nodeType === Node.TEXT_NODE) {
      toRemove.push(next as Text);
      next = next.nextSibling;
    }

    toRemove.forEach((text) => text.remove());
    this.data = value;
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
