import { Button } from '@nativescript/core';
import NodeList from 'happy-dom/lib/nodes/node/NodeList';
import HappyValidityState from 'happy-dom/lib/nodes/validity-state/ValidityState';

import { HTMLWebElement } from './HTMLWebElement';
import { NText } from './Text';

export class NHTMLButtonElement
  extends HTMLWebElement
  implements HTMLButtonElement
{
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  readonly button = new (require('@nativescript/core')
    .Button as typeof Button)();

  constructor() {
    super();

    this.style.display = 'inline-block';
    this.view.addChild(this.button);
  }

  // Horrible makeshift way to mirror the textContent of Texts into the Button.
  appendChild<T extends Node>(node: T): T {
    const returnValue = super.appendChild(node);

    // Undo the side-effects of the superclass implementation.
    this.view.removeChildren();
    this.view.addChild(this.button);

    if (node instanceof NText) {
      this.button.text = node.textContent;
    }

    return returnValue;
  }
  removeChild<T extends Node>(child: T): T {
    const returnValue = super.removeChild(child);

    if (child instanceof NText) {
      this.button.text = '';
    }

    return returnValue;
  }
  insertBefore<T extends Node>(newNode: T, referenceNode: Node | null): T {
    const returnValue = super.insertBefore(newNode, referenceNode);

    // Undo the side-effects of the superclass implementation.
    this.view.removeChildren();
    this.view.addChild(this.button);

    if (
      newNode instanceof NText &&
      (referenceNode === null || referenceNode instanceof NText)
    ) {
      this.button.text = newNode.textContent;
    }

    return returnValue;
  }
  public get textContent(): string | null {
    return super.textContent;
  }
  public set textContent(value: string | null) {
    this.button.text = value || '';
    super.textContent = value;
  }

  public get disabled(): boolean {
    return !this.view.isEnabled;
  }
  public set disabled(value: boolean) {
    this.view.isEnabled = !value;
  }
  // TODO: implement HTMLFormElement support
  form = null;
  formAction = '';
  formEnctype = '';
  formMethod = '';
  formNoValidate = false;
  formTarget = '';
  labels = new NodeList() as unknown as NodeListOf<HTMLLabelElement>;
  name = '';
  type = 'button';
  validationMessage = '';
  // @ts-ignore
  validity = new HappyValidityState(null) as unknown as ValidityState;
  value = '';
  willValidate = false;
  checkValidity(): boolean {
    // TODO: implement
    return true;
  }
  reportValidity(): boolean {
    // TODO: implement
    return true;
  }
  setCustomValidity(): void {
    // TODO: implement
  }
}
