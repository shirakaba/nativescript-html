import { Style } from '@nativescript/core';

import { HTMLFlexboxLayoutElement } from './HTMLFlexboxLayoutElement';

const initialLayoutStyles = {
  alignContent: 'stretch',
  alignItems: 'stretch',
  alignSelf: 'auto',
  flexDirection: 'row',
  flexGrow: '0',
  flexShrink: '1',
  flexWrap: 'nowrap',
  flexWrapBefore: 'false',
  height: 'auto',
  justifyContent: 'stretch',
  minHeight: 'auto',
  minWidth: 'auto',
  visibility: 'visible',
  width: 'auto',
};

type LayoutStyles = Pick<
  Style,
  | 'alignContent'
  | 'alignItems'
  | 'alignSelf'
  | 'flexDirection'
  | 'flexGrow'
  | 'flexShrink'
  | 'flexWrap'
  | 'flexWrapBefore'
  | 'height'
  | 'justifyContent'
  | 'minHeight'
  | 'minWidth'
  | 'visibility'
  | 'width'
>;

export abstract class HTMLWebElement extends HTMLFlexboxLayoutElement {
  private display = '';
  private readonly userLayoutStyles: Record<
    keyof typeof initialLayoutStyles,
    unknown
  > = {
    alignItems: this.view.style.alignItems,
    alignSelf: this.view.style.alignSelf,
    flexDirection: this.view.style.flexDirection,
    height: this.view.style.height,
    minHeight: this.view.style.minHeight,
    minWidth: this.view.style.minWidth,
    width: this.view.style.width,
    visibility: this.view.style.visibility,
    justifyContent: this.view.justifyContent,
    alignContent: this.view.alignContent,
    flexWrap: this.view.flexWrap,
    flexGrow: this.view.flexGrow,
    flexShrink: this.view.flexShrink,
    flexWrapBefore: this.view.flexWrapBefore,
  };

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
        if (p in this.userLayoutStyles) {
          // Really I should return the parsed value (e.g. by running the parser
          // that the respective property uses), but this'll do for a proof of
          // concept.
          return this.userLayoutStyles[p as keyof typeof this.userLayoutStyles];
        }

        if (p === 'display') {
          return this.display;
        }

        return Reflect.get(target, p, receiver);
      },
      set: (target, p, newValue, receiver) => {
        if (p in this.userLayoutStyles) {
          // Really I should set the parsed value (e.g. by running the parser
          // that the respective property uses), but this'll do for a proof of
          // concept.
          this.userLayoutStyles[p as keyof typeof this.userLayoutStyles] =
            newValue;

          // If it's a layout style, set it on the underlying view only
          // compatible with the display method.
          if (this.display === 'block' || this.display === 'inline-block') {
            if (p !== 'height' && p !== 'width') {
              return true;
            }
          } else if (this.display === 'inline') {
            return true;
          }
        }

        // Simulate display (until mason arrives and we can truly support it).
        if (p === 'display') {
          this.display = newValue;

          if (
            newValue === 'block' ||
            newValue === 'inline-block' ||
            newValue === ''
          ) {
            updateLayoutStyles(
              this.userLayoutStyles,
              {
                alignContent: 'flex-start',
                alignItems: 'flex-start',
                alignSelf: 'stretch',
                flexDirection: 'column',
                flexGrow: '0',
                flexShrink: '0',
                flexWrap: 'nowrap',
                flexWrapBefore: initialLayoutStyles.flexWrapBefore,
                justifyContent: 'flex-start',
                // Honour height and width.
              },
              target,
              receiver
            );
          } else if (newValue === 'inline' || newValue === 'inline-block') {
            // For inline items, explicit width/height is ignored and only
            // intrinsic dimensions are referred to.
            //
            // Unfortunately we can't support multiple inlines side-by-side, nor
            // wrapping (would need an extra container for both aspects).
            updateLayoutStyles(
              this.userLayoutStyles,
              {
                alignContent: 'flex-start',
                alignItems: initialLayoutStyles.alignItems,
                alignSelf: 'flex-start',
                flexDirection: 'row',
                flexGrow: '0',
                flexShrink: '0',
                flexWrap: 'wrap',
                flexWrapBefore: initialLayoutStyles.flexWrapBefore,
                height: initialLayoutStyles.height,
                justifyContent: 'flex-start',
                minHeight: initialLayoutStyles.minHeight,
                minWidth: initialLayoutStyles.minWidth,
                width: initialLayoutStyles.width,
              },
              target,
              receiver
            );
          } else if (newValue === 'flex') {
            // Honour all styles.
            updateLayoutStyles(this.userLayoutStyles, {}, target, receiver);
          } else if (newValue === 'none') {
            updateLayoutStyles(
              this.userLayoutStyles,
              { visibility: 'collapse' },
              target,
              receiver
            );
          }

          // For unsupported display types, the best we can do is no-op.

          return true;
        }

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

function updateLayoutStyles(
  userStyles: Record<keyof LayoutStyles, unknown>,
  styles: Partial<Record<keyof LayoutStyles, unknown>>,
  target: Style,
  receiver: any
): void {
  const resolved = { ...userStyles, ...styles };
  for (const key of Object.keys(resolved)) {
    Reflect.set(target, key, resolved[key as keyof typeof resolved], receiver);
  }
}
