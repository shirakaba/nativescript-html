import { HTMLFlexboxLayoutElement } from './HTMLFlexboxLayoutElement';

export abstract class HTMLWebElement extends HTMLFlexboxLayoutElement {
  // We can only support other displays with Mason.
  private readonly display = 'flex';

  // this.tagName is not filled in until after construction
  postConstruction(): void {
    super.postConstruction();

    // @ts-ignore not actually readonly.
    this.tagName = this.tagName.replace('-', '');
    this.view.cssType = this.tagName.toLowerCase();
  }

  get style(): CSSStyleDeclaration {
    return new Proxy(this.view.style, {
      get: (target, p, receiver) => {
        if (p === 'display') {
          return this.display;
        }

        return Reflect.get(target, p, receiver);
      },
      set: (target, p, newValue, receiver) => {
        if (p === 'display') {
          return true;
        }

        console.log(
          `!! REFLECT this.view.style['${p.toString()}'] =`,
          typeof newValue === 'string'
            ? newValue.replace('px', 'dip')
            : newValue
        );

        return Reflect.set(
          target,
          p,
          // Crudely coerce px to dip to match the web.
          typeof newValue === 'string'
            ? newValue.replace('px', 'dip')
            : newValue,
          receiver
        );
      },
    }) as unknown as CSSStyleDeclaration;
  }
}
