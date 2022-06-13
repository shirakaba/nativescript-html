import { Application } from '@nativescript/core'
import HTMLDocument from '../../node_modules/happy-dom/lib/nodes/html-document/HTMLDocument';

console.log('creating document 2...');
const document = new HTMLDocument();
console.log('creating div...');
const div = document.createElement('div');
console.log(div);

Application.run({ moduleName: 'app-root' })

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
