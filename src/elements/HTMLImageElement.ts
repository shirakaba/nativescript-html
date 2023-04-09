import { Image } from '@nativescript/core';

import { HTMLWebElement } from './HTMLWebElement';

export class NHTMLImageElement
  extends HTMLWebElement
  implements HTMLImageElement
{
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  readonly image = new (require('@nativescript/core').Image as typeof Image)();

  constructor() {
    super();

    this.style.display = 'block';
    this.view.addChild(this.image);
    console.log('View with Img:', this.view);
  }
  longDesc = '';

  align = '';
  alt = '';
  border = '';
  public get complete(): boolean {
    return !this.image.isLoading;
  }
  crossOrigin = null;
  public get currentSrc(): string {
    return this.image.src;
  }
  decoding = 'auto' as const;
  public get height(): number {
    // TODO: get a more appropriate height
    return this.image.getMeasuredHeight();
  }
  public set height(value: number) {
    this.image.height = { unit: 'dip', value };
  }
  hspace = 0;
  isMap = false;
  public get loading() {
    return this.image.loadMode === 'sync' ? 'eager' : 'lazy';
  }
  public set loading(value) {
    this.image.loadMode = value === 'eager' ? 'sync' : 'async';
  }
  longDes = '';
  lowsrc = '';
  name = '';

  public get naturalHeight(): number {
    return this.image.getMeasuredHeight();
  }
  public set naturalHeight(value: number) {
    this.image.height = { unit: 'dip', value };
  }
  public get naturalWidth(): number {
    return this.image.getMeasuredWidth();
  }
  public set naturalWidth(value: number) {
    this.image.width = { unit: 'dip', value };
  }
  referrerPolicy = '';
  sizes = '';
  public get src(): string {
    return this.image.src;
  }
  public set src(value: string) {
    this.image.src = value;
  }
  public get srcset(): string {
    return this.image.src;
  }
  public set srcset(value: string) {
    this.image.src = value;
  }
  public get useMap(): string {
    return this.image.src;
  }
  public set useMap(value: string) {
    this.image.src = value;
  }
  vspace = 0;
  public get width(): number {
    return this.image.getMeasuredWidth();
  }
  public set width(value: number) {
    this.image.width = { unit: 'dip', value };
  }
  x = 0;
  y = 0;
  decode(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // TODO: gracefully handle adding child elements (which one shouldn't).
}
