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
    div.style.display = 'block';
    div.style.margin = '8px';

    // The spacing looks a bit odd because of the margin. In true block layout,
    // margins collapse, but we're limited to what flexbox can do (until Mason).
    const h1 = document.createElement('h1');
    h1.appendChild(document.createTextNode('Heading 1'));
    const h2 = document.createElement('h2');
    h2.appendChild(document.createTextNode('Heading 2'));
    const h3 = document.createElement('h3');
    h3.appendChild(document.createTextNode('Heading 3'));
    const h4 = document.createElement('h4');
    h4.appendChild(document.createTextNode('Heading 4'));
    const h5 = document.createElement('h5');
    h5.appendChild(document.createTextNode('Heading 5'));
    const h6 = document.createElement('h6');
    h6.appendChild(document.createTextNode('Heading 6'));

    div.appendChild(h1);
    div.appendChild(h2);
    div.appendChild(h3);
    div.appendChild(h4);
    div.appendChild(h5);
    div.appendChild(h6);

    const img = document.createElement('img');
    img.src = 'https://www.w3.org/html/logo/downloads/HTML5_Logo_512.png';
    img.height = 100;
    img.width = 100;
    div.appendChild(img);

    const p = document.createElement('p');
    const span = document.createElement('span');
    span.appendChild(
      document.createTextNode(
        'Introducing HTML, with native views! Introducing HTML, with native views! Introducing HTML, with native views! Introducing HTML, with native views!'
      )
    );
    p.appendChild(span);
    div.appendChild(p);

    return div.view;
  },
});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
