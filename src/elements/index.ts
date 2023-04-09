import { EventData, Observable } from '@nativescript/core';

import { HTMLAbsoluteLayoutElement } from './HTMLAbsoluteLayoutElement';
import { HTMLDivElement } from './HTMLDivElement';
import { HTMLDockLayoutElement } from './HTMLDockLayoutElement';
import { HTMLFlexboxLayoutElement } from './HTMLFlexboxLayoutElement';
import { HTMLGridLayoutElement } from './HTMLGridLayoutElement';
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
  HTMLDivElement.register('div-');
  Object.defineProperty(global, 'HTMLDivElement', {
    value: HTMLDivElement,
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
