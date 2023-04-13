import { Application } from '@nativescript/core';
import 'nativescript-html';
import { createRoot } from 'react-dom/client';

import { App } from './App';

Application.run({
  create: () => {
    const div = document.createElement('div');

    // Render your React component instead
    const root = createRoot(div);
    root.render(App());

    return div.view;
  },
});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
