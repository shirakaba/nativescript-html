import { HTMLAbsoluteLayoutElement } from './HTMLAbsoluteLayoutElement';
import { NHTMLAnchorElement } from './HTMLAnchorElement';
import { NHTMLButtonElement } from './HTMLButtonElement';
import { NHTMLDivElement } from './HTMLDivElement';
import { HTMLDockLayoutElement } from './HTMLDockLayoutElement';
import { HTMLFlexboxLayoutElement } from './HTMLFlexboxLayoutElement';
import { HTMLFormattedStringElement } from './HTMLFormattedStringElement';
import { HTMLGridLayoutElement } from './HTMLGridLayoutElement';
import { NHTMLHeadingElement } from './HTMLHeadingElement';
import { NHTMLImageElement } from './HTMLImageElement';
import { NHTMLParagraphElement } from './HTMLParagraphElement';
import { HTMLRunElement } from './HTMLRunElement';
import { NHTMLSpanElement } from './HTMLSpanElement';
import { HTMLStackLayoutElement } from './HTMLStackLayoutElement';
import { HTMLTextElement } from './HTMLTextElement';
import { HTMLWrapLayoutElement } from './HTMLWrapLayoutElement';

// Core's type declarations for global haven't worked since a change to
// @types/node, so we'll just shove this in here
declare const global: any;

export function registerAllElements(): void {
  // (This is purely for debug)
  // const on = Observable.prototype.on;
  // Observable.prototype.on = function (
  //   eventNames: string,
  //   callback: (data: EventData) => void,
  //   thisArg?: any
  // ): void {
  //   // console.log(`${this.constructor.name}.on('${eventNames}')`);
  //   on.call(this, eventNames, callback, thisArg);
  // };
  // const addEventListener = Observable.prototype.addEventListener;
  // Observable.prototype.addEventListener = function (
  //   eventNames: string,
  //   callback: (data: EventData) => void,
  //   thisArg?: any
  // ): void {
  //   // console.log(`${this.constructor.name}.addEventListener('${eventNames}')`);
  //   addEventListener.call(this, eventNames, callback, thisArg);
  // };

  HTMLAbsoluteLayoutElement.register('absolute-layout');
  HTMLDockLayoutElement.register('dock-layout');
  HTMLFlexboxLayoutElement.register('flexbox-layout');
  HTMLFlexboxLayoutElement.register('flex-');
  HTMLGridLayoutElement.register('grid-layout');
  HTMLStackLayoutElement.register('stack-layout');
  HTMLWrapLayoutElement.register('wrap-layout');

  HTMLWrapLayoutElement.register('t-');
  HTMLWrapLayoutElement.register('run-');
  HTMLWrapLayoutElement.register('format-');

  // Register our fun HTML fill-ins.
  // Remember to update the set of intrinsic elements in
  // src/elements/NHTMLElement.ts each time we add support for a new one here.
  NHTMLDivElement.register('div-');
  NHTMLParagraphElement.register('p-');
  NHTMLSpanElement.register('span-');
  NHTMLHeadingElement.register('h1-');
  NHTMLHeadingElement.register('h2-');
  NHTMLHeadingElement.register('h3-');
  NHTMLHeadingElement.register('h4-');
  NHTMLHeadingElement.register('h5-');
  NHTMLHeadingElement.register('h6-');
  NHTMLImageElement.register('img-');
  NHTMLButtonElement.register('button-');
  NHTMLAnchorElement.register('a-');
  Object.defineProperties(global, {
    HTMLDivElement: { value: NHTMLDivElement },
    HTMLParagraphElement: { value: NHTMLParagraphElement },
    HTMLSpanElement: { value: NHTMLSpanElement },
    HTMLHeadingElement: { value: NHTMLHeadingElement },
    HTMLImageElement: { value: NHTMLImageElement },
    HTMLButtonElement: { value: NHTMLButtonElement },
    NHTMLAnchorElement: { value: NHTMLAnchorElement },
  });
}

export {
  HTMLAbsoluteLayoutElement,
  HTMLDockLayoutElement,
  HTMLFlexboxLayoutElement,
  HTMLGridLayoutElement,
  HTMLStackLayoutElement,
  HTMLWrapLayoutElement,
  HTMLFormattedStringElement,
  HTMLTextElement,
  HTMLRunElement,
};
