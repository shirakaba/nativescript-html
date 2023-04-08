import {
  Application,
  type StackLayout,
  type AbsoluteLayout,
} from '@nativescript/core';
import type { NHTMLElement } from 'nativescript-dom';

Application.run({
  create: () => {
    // This is largely working, but:
    // 1 - gestures in NativeScript iOS seem to fire first on the parent, and
    //     then on the child (confirmed in Playground).
    // 2 - Apple docs suggest that gestures should in fact fire first on the
    //     child, as they do in the browser.
    // 3 - I am seeing three lines printed for one click on the inner view. This
    //     is because the native gesture handlers fire:
    //     1. outer view (triggering just the outer tap handler);
    //     2. inner view (triggering inner, then bubbling to outer).
    // 4 - buttons will swallow the gesture (but this is fine as we will re-emit
    //     it via DOM)
    const sl = document.createElement(
      'stack-layout'
    ) as NHTMLElement<StackLayout>;
    sl.addEventListener('tap', (evt: Event) => {
      console.log('Tapped the yellow (outer) StackLayout.');
    });
    const slv = sl.view;
    slv.backgroundColor = 'yellow';
    slv.style.height = { unit: '%', value: 100 };
    slv.style.width = { unit: '%', value: 100 };

    const al = document.createElement(
      'absolute-layout'
    ) as NHTMLElement<AbsoluteLayout>;
    al.addEventListener('tap', (evt: Event) => {
      console.log('Tapped the orange (inner) AbsoluteLayout.');
    });
    const alv = al.view;
    alv.backgroundColor = 'orange';
    alv.style.height = { unit: 'dip', value: 200 };
    alv.style.width = { unit: 'dip', value: 200 };

    sl.appendChild(al);

    return sl.view;
  },
});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
