import { Application, type StackLayout, type AbsoluteLayout } from '@nativescript/core';
import type { NativeScriptDOMElement } from 'nativescript-dom';

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

    return stackLayout;
}});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
