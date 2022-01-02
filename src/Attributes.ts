import { NodeImpl } from "./Node";
const { ATTRIBUTE_NODE } = require("../node-type.js");

// From https://github.com/jsdom/jsdom/blob/04f6c13f4a4d387c7fc979b8f62c6f68d8a0c639/lib/jsdom/living/attributes.js#L269
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setAnExistingAttributeValue(attribute: AttrImpl, value: any){
  const element = attribute._element;
  if (element === null) {
    attribute._value = value;
  } else {
    changeAttribute(element, attribute, value);
  }
}

export function changeAttribute(element, attribute, value){
  const { _localName, _namespace, _value } = attribute;

  // queueAttributeMutationRecord(element, _localName, _namespace, _value);

  if (element._ceState === "custom") {
    enqueueCECallbackReaction(element, "attributeChangedCallback", [
      _localName,
      _value,
      value,
      _namespace
    ]);
  }

  attribute._value = value;

  // Run jsdom hooks; roughly correspond to spec's "An attribute is set and an attribute is changed."
  element._attrModified(attribute._qualifiedName, value, _value);
}

export class AttrImpl extends NodeImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this._namespace = privateData.namespace !== undefined ? privateData.namespace : null;
    this._namespacePrefix = privateData.namespacePrefix !== undefined ? privateData.namespacePrefix : null;
    this._localName = privateData.localName;
    this._value = privateData.value !== undefined ? privateData.value : "";
    this._element = privateData.element !== undefined ? privateData.element : null;

    this.nodeType = ATTRIBUTE_NODE;
    this.specified = true;
  }

  get namespaceURI() {
    return this._namespace;
  }

  get prefix() {
    return this._namespacePrefix;
  }

  get localName() {
    return this._localName;
  }

  get name() {
    return this._qualifiedName;
  }

  get nodeName() {
    return this._qualifiedName;
  }

  get value() {
    return this._value;
  }
  set value(value) {
    setAnExistingAttributeValue(this, value);
  }

  get ownerElement() {
    return this._element;
  }

  get _qualifiedName() {
    // https://dom.spec.whatwg.org/#concept-attribute-qualified-name
    if (this._namespacePrefix === null) {
      return this._localName;
    }

    return this._namespacePrefix + ":" + this._localName;
  }
};