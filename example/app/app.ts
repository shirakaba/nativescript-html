import {
  Application,
  type StackLayout,
  type AbsoluteLayout,
} from '@nativescript/core';
import type { NHTMLElement } from 'nativescript-dom';

Application.run({
  create: () => {
    const sl = document.createElement(
      'stack-layout'
    ) as NHTMLElement<StackLayout>;
    sl.addEventListener('tap', (evt) => {
      console.log(
        `Tapped the orange AbsoluteLayout. target: ${evt.target} currentTarget: ${evt.currentTarget}`
      );
    });
    const slv = sl.view;
    slv.backgroundColor = 'yellow';
    slv.style.height = { unit: '%', value: 100 };
    slv.style.width = { unit: '%', value: 100 };

    const al = document.createElement(
      'absolute-layout'
    ) as NHTMLElement<AbsoluteLayout>;
    al.addEventListener('tap', (evt) => {
      console.log(
        `Tapped the orange AbsoluteLayout. target: ${evt.target} currentTarget: ${evt.currentTarget}`
      );
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
