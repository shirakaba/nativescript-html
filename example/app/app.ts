import { Application, TapGestureEventData } from '@nativescript/core';
import 'nativescript-html';

Application.run({
  create: () => {
    const div = document.createElement('div');
    div.addEventListener('tap', (evt: CustomEvent<TapGestureEventData>) => {
      const {
        detail: { getX, getY },
        currentTarget,
      } = evt;

      console.log(`Tapped ${currentTarget} at (${getX()}, ${getY()}).`);
      evt.stopPropagation();
    });
    div.style.backgroundColor = 'yellow';

    const p = document.createElement('p');
    const span = document.createElement('span');
    p.style.backgroundColor = 'orange';
    span.appendChild(document.createTextNode('Sonic'));
    p.appendChild(span);

    div.appendChild(p);

    return div.view;
  },
});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
