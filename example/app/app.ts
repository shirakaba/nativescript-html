import { Application } from '@nativescript/core';
import 'nativescript-dom';

Application.run({
  create: () => {
    const sl = document.createElement('stack-layout');
    sl.addEventListener('tap', (evt: Event) => {
      console.log('Tapped the yellow (outer) StackLayout.');
    });
    sl.style.backgroundColor = 'yellow';
    sl.style.height = '100%';
    sl.style.width = '100%';

    const al = document.createElement('absolute-layout');
    al.addEventListener('tap', (evt: Event) => {
      console.log('Tapped the orange (inner) AbsoluteLayout.');
    });
    al.style.backgroundColor = 'orange';
    al.style.height = '200px';
    al.style.width = '200px';
    // const alv = al.view;
    // alv.backgroundColor = 'orange';
    // alv.style.height = { unit: 'dip', value: 200 };
    // alv.style.width = { unit: 'dip', value: 200 };

    sl.appendChild(al);

    return sl.view;
  },
});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
