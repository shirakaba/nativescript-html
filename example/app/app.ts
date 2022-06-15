import { Application } from '@nativescript/core'
import Window from '../../node_modules/happy-dom/lib/window/Window';
import HTMLDocument from '../../node_modules/happy-dom/lib/nodes/html-document/HTMLDocument';

console.log('creating window...');
const win = new Window();
console.log('creating document...');
const document = new HTMLDocument();
console.log('creating div...');

const divA = document.createElement('div');
const divB = document.createElement('div');
divA.appendChild(divB);
divB.textContent = 'divB text';
console.log(divA);


Application.run({ moduleName: 'app-root' })

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
