// Provisional typings for JSDOM (as @types/jsdom is unsuitable for our uses)

declare module 'jsdom/lib/jsdom/utils.js' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function define(object: any, properties: any): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function mixin(target: any, source: object): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type AConstructorTypeOf<T> = new (...args: any[]) => T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function addConstants(Constructor: AConstructorTypeOf<any>, propertyMap: any): void;
}
declare module 'jsdom/lib/jsdom/living/cssom/StyleSheetList-impl' {
    export class implementation extends StyleSheetList {}
}
declare module 'jsdom/lib/jsdom/living/domparsing/DOMParser-impl' {
    export class implementation extends DOMParser {}
}
declare module 'jsdom/lib/jsdom/living/domparsing/InnerHTML-impl' {
    export class implementation extends InnerHTML {}
}
declare module 'jsdom/lib/jsdom/living/domparsing/XMLSerializer-impl' {
    export class implementation extends XMLSerializer {}
}
declare module 'jsdom/lib/jsdom/living/events/CustomEvent-impl' {
    export class implementation extends CustomEvent {}
}
declare module 'jsdom/lib/jsdom/living/attributes/Attr-impl' {
    export class implementation extends Attr {}
}
declare module 'jsdom/lib/jsdom/living/attributes/NamedNodeMap-impl' {
    export class implementation extends NamedNodeMap {}
}
declare module 'jsdom/lib/jsdom/living/events/Event-impl' {
    export class implementation extends Event {}
}
declare module 'jsdom/lib/jsdom/living/events/EventTarget-impl' {
    export class implementation extends EventTarget {}
}
declare module 'jsdom/lib/jsdom/living/nodes/Document-impl' {
    export class implementation extends Document {}
}
declare module 'jsdom/lib/jsdom/living/nodes/Node-impl' {
    export class implementation extends Node {}
}
declare module 'jsdom/lib/jsdom/living/nodes/NodeList-impl' {
    export class implementation extends NodeList {}
}
declare module 'jsdom/lib/jsdom/living/nodes/Element-impl' {
    export class implementation extends Element {}
}
declare module 'jsdom/lib/jsdom/living/nodes/HTMLElement-impl' {
    export class implementation extends HTMLElement {}
}
declare module 'jsdom/lib/jsdom/living/custom-elements/CustomElementRegistry-impl' {
    export class implementation extends CustomElementRegistry {}
}
