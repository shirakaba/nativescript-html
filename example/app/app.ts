import { Application } from '@nativescript/core';
import 'nativescript-html';

Application.run({
  create: () => {
    const div = document.createElement('div');
    div.style.display = 'block';
    div.style.margin = '8px';

    const h1 = document.createElement('h1');
    h1.appendChild(document.createTextNode('HTML rendered natively'));
    div.appendChild(h1);

    const p1 = document.createElement('p');
    p1.appendChild(
      document.createTextNode(
        'This web page is rendered using iOS native views! 🚀'
      )
    );
    div.appendChild(p1);

    const img = document.createElement('img');
    img.src = 'https://www.w3.org/html/logo/downloads/HTML5_Logo_512.png';
    img.height = 200;
    img.width = 200;
    img.style.margin = '100px';
    div.appendChild(img);

    const p2 = document.createElement('p');
    ['... And it works for ', 'Android', ', too! 🤖'].map((text, i) => {
      const span = document.createElement('span');
      span.appendChild(document.createTextNode(text));
      if (i === 1) {
        span.style.fontWeight = 'bold';
      }
      p2.appendChild(span);
    });
    div.appendChild(p2);

    const p3 = document.createElement('p');
    const a = document.createElement('a');
    a.appendChild(document.createTextNode('Follow for more info!'));
    p3.appendChild(a);

    div.appendChild(p3);

    return div.view;
  },
});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
