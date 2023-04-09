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
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    div.style.width = '100%';

    const img = document.createElement('img');
    img.src = 'https://www.w3.org/html/logo/downloads/HTML5_Logo_512.png';
    img.height = 430;
    img.width = 430;
    div.appendChild(img);

    const p = document.createElement('p');
    const span = document.createElement('span');
    span.appendChild(
      document.createTextNode('Introducing HTML, with native views!')
    );
    p.appendChild(span);
    p.style.paddingTop = '20px';
    div.appendChild(p);

    return div.view;
  },
});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
