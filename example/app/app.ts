import Window from 'happy-dom/lib/window/Window';
import { Application, type StackLayout, type AbsoluteLayout } from '@nativescript/core';
import { registerCustomElements, NativeScriptDOMElement } from 'nativescript-dom';

const win = new Window();
(global as any).window = win;
(global as any).document = win.document;
(global as any).customElements = win.customElements;
(global as any).HTMLElement = win.HTMLElement;

registerCustomElements();

Application.run({ create: () => {
    const stackLayoutWrapper = document.createElement('absolute-layout') as NativeScriptDOMElement<StackLayout>;
    const stackLayout = stackLayoutWrapper.nativeView;
    stackLayout.backgroundColor = 'yellow';
    stackLayout.style.height = { unit: '%', value: 100 };
    stackLayout.style.width = { unit: '%', value: 100 };

    const absoluteLayoutWrapper = document.createElement('absolute-layout') as NativeScriptDOMElement<AbsoluteLayout>;
    const absoluteLayout = absoluteLayoutWrapper.nativeView;
    absoluteLayout.backgroundColor = 'orange';
    absoluteLayout.style.height = { unit: 'dip', value: 200 };
    absoluteLayout.style.width = { unit: 'dip', value: 200 };

    stackLayoutWrapper.appendChild(absoluteLayoutWrapper);
    
    console.log(stackLayoutWrapper);
    console.log(stackLayout);
    console.log(absoluteLayout);

    return stackLayout;
}});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
