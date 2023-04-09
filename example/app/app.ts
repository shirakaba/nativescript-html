import { Application, TapGestureEventData } from '@nativescript/core';
import 'nativescript-html';

Application.run({
  create: () => {
    const sl = document.createElement('stack-layout');
    sl.addEventListener('tap', (evt: CustomEvent<TapGestureEventData>) => {
      const {
        detail: { getX, getY },
        currentTarget,
      } = evt;

      console.log(`Tapped ${currentTarget} at (${getX()}, ${getY()}).`);
      evt.stopPropagation();
    });
    sl.style.backgroundColor = 'yellow';
    sl.style.height = '100%';
    sl.style.width = '100%';

    const al = document.createElement('absolute-layout');
    al.addEventListener('tap', (evt: CustomEvent<TapGestureEventData>) => {
      const {
        detail: { getX, getY },
        currentTarget,
      } = evt;
      console.log(`Tapped ${currentTarget} at (${getX()}, ${getY()}).`);
      evt.stopPropagation();
    });
    al.style.backgroundColor = 'orange';
    al.style.height = '200px';
    al.style.width = '200px';

    sl.appendChild(al);

    return sl.view;
  },
});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
