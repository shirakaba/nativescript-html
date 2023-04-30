import { Application } from '@nativescript/core';
import 'nativescript-html';
import type {
  HTMLFlexboxLayoutElement,
  HTMLFormattedStringElement,
  HTMLNLabelElement,
  HTMLNSpanElement,
} from 'nativescript-html/dist/elements';
import { createRoot } from 'react-dom/client';

import { App } from './App';

Application.run({
  create: () => {
    const div = document.createElement('div');
    div.id = 'root';

    // Render your React component instead
    const root = createRoot(div);
    root.render(App(stories));

    return div.view;
  },
});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/

const stories = [
  {
    title: 'Largest island in a lake on an island in a lake on an island',
    domain: 'elbruz.org',
  },
  {
    title: 'Live ESA launch to Jupiter [video]',
    domain: 'esa.int',
  },
  {
    title: 'Zig Build System',
    domain: 'liujiacai.net',
  },
  {
    title: 'Replying to comments about our web page design',
    domain: 'exoticsilicon.com',
  },
  {
    title:
      "Ask HN: Side project of more that $2k monthly revenue what's your project?",
  },
  {
    title: 'Temporal quality degradation in AI models',
    domain: 'nannyml.com',
  },
  {
    title: 'GNU toolchain for RISC-V including GCC',
    domain: 'github.com/riscv-collab',
  },
  {
    title: 'Building LLM Applications for Production',
    domain: 'huyenchip.com',
  },
];

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'n-flex': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLFlexboxLayoutElement>,
        HTMLElement
      >;
      'n-format': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLFormattedStringElement>,
        HTMLElement
      >;
      'n-span': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLNSpanElement>,
        HTMLElement
      >;
      'n-label': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLNLabelElement>,
        HTMLElement
      >;
    }
  }
}
