import { EventData, Observable } from '@nativescript/core';

import { HTMLAbsoluteLayoutElement } from './HTMLAbsoluteLayoutElement';
import { NHTMLDivElement } from './HTMLDivElement';
import { HTMLDockLayoutElement } from './HTMLDockLayoutElement';
import { HTMLFlexboxLayoutElement } from './HTMLFlexboxLayoutElement';
import { HTMLGridLayoutElement } from './HTMLGridLayoutElement';
import { NHTMLImageElement } from './HTMLImageElement';
import { NHTMLParagraphElement } from './HTMLParagraphElement';
import { NHTMLSpanElement } from './HTMLSpanElement';
import { HTMLStackLayoutElement } from './HTMLStackLayoutElement';
import { HTMLWrapLayoutElement } from './HTMLWrapLayoutElement';

export function registerAllElements(): void {
  // (This is purely for debug)
  const on = Observable.prototype.on;
  Observable.prototype.on = function (
    eventNames: string,
    callback: (data: EventData) => void,
    thisArg?: any
  ): void {
    console.log(`${this.constructor.name}.on('${eventNames}')`);
    on.call(this, eventNames, callback, thisArg);
  };
  const addEventListener = Observable.prototype.addEventListener;
  Observable.prototype.addEventListener = function (
    eventNames: string,
    callback: (data: EventData) => void,
    thisArg?: any
  ): void {
    console.log(`${this.constructor.name}.addEventListener('${eventNames}')`);
    addEventListener.call(this, eventNames, callback, thisArg);
  };

  HTMLAbsoluteLayoutElement.register('absolute-layout');
  HTMLDockLayoutElement.register('dock-layout');
  HTMLFlexboxLayoutElement.register('flexbox-layout');
  HTMLGridLayoutElement.register('grid-layout');
  HTMLStackLayoutElement.register('stack-layout');
  HTMLWrapLayoutElement.register('wrap-layout');

  // Register our fun HTML fill-ins.
  NHTMLDivElement.register('div-');
  Object.defineProperty(global, 'HTMLDivElement', {
    value: NHTMLDivElement,
  });
  NHTMLParagraphElement.register('p-');
  Object.defineProperty(global, 'HTMLParagraphElement', {
    value: NHTMLParagraphElement,
  });
  NHTMLSpanElement.register('span-');
  Object.defineProperty(global, 'HTMLSpanElement', {
    value: NHTMLSpanElement,
  });
  NHTMLImageElement.register('img-');
  Object.defineProperty(global, 'HTMLImageElement', {
    value: NHTMLImageElement,
  });
}

export {
  HTMLAbsoluteLayoutElement,
  HTMLDockLayoutElement,
  HTMLFlexboxLayoutElement,
  HTMLGridLayoutElement,
  HTMLStackLayoutElement,
  HTMLWrapLayoutElement,
};
