import { Application } from '@nativescript/core';
import 'nativescript-dom';

Application.run({
  create: () => {
    const sl = document.createElement('stack-layout');
    sl.addEventListener('tap', (evt: Event) => {
      console.log('Tapped the yellow (outer) StackLayout.');
    });
    const slv = sl.view;
    slv.backgroundColor = 'yellow';
    slv.style.height = { unit: '%', value: 100 };
    slv.style.width = { unit: '%', value: 100 };

    const al = document.createElement('absolute-layout');
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
