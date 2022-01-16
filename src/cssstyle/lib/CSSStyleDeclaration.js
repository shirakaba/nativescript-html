/*********************************************************************
 * This is a fork from the CSS Style Declaration part of
 * https://github.com/NV/CSSOM
 ********************************************************************/
'use strict';
var CSSOM = require('cssom');
var allProperties = require('./allProperties');
var allExtraProperties = require('./allExtraProperties');
var implementedProperties = require('./implementedProperties');
var { dashedToCamelCase } = require('./parsers');
var getBasicPropertyDescriptor = require('./utils/getBasicPropertyDescriptor');
var {
  visibilityProperty,
  horizontalAlignmentProperty,
  verticalAlignmentProperty,
  backgroundRepeatProperty,
} = require("@nativescript/core/ui/styling/style-properties");

/**
 * @see https://github.com/NativeScript/NativeScript/blob/e649a6cfd618c86a1dc7fa84e3197dfb78c3bc74/nativescript-core/ui/styling/style-properties.ts
 * @see https://github.com/shirakaba/react-nativescript/blob/6f1d8ec741d270128ec578cc7f66a06ef631d22f/react-nativescript/src/shared/CSSPropertyOperations.ts#L24
 */
var propertiesWhoseValidatorsDoNotAcceptUnsetValue = {
  [visibilityProperty.name]: visibilityProperty,
  [horizontalAlignmentProperty.name]: horizontalAlignmentProperty,
  [verticalAlignmentProperty.name]: verticalAlignmentProperty,
  [backgroundRepeatProperty.name]: backgroundRepeatProperty,
};

/**
 * @constructor
 * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration
 */
var CSSStyleDeclaration = function CSSStyleDeclaration(onChangeCallback) {
  /**
   * @platform NativeScript
   * Each style element will support a reference to a NativeScript host element.
   * @type {import("@nativescript/core").View|null}
   */
  this._hostElement = null;
  this._values = {};
  this._importants = {};
  this._length = 0;
  this._onChange =
    onChangeCallback ||
    function() {
      return;
    };
};
CSSStyleDeclaration.prototype = {
  constructor: CSSStyleDeclaration,

  /**
   *
   * @param {string} name
   * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-getPropertyValue
   * @return {string} the value of the property if it has been explicitly set for this declaration block.
   * Returns the empty string if the property has not been set.
   */
  getPropertyValue: function(name) {
    if (!this._values.hasOwnProperty(name)) {
      return '';
    }
    return this._values[name].toString();
  },

  /**
   *
   * @param {string} name
   * @param {string} value
   * @param {string} [priority=null] "important" or null
   * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-setProperty
   */
  setProperty: function(name, value, priority) {
    if (value === undefined) {
      return;
    }
    if (value === null || value === '') {
      this.removeProperty(name);
      return;
    }
    var isCustomProperty = name.indexOf('--') === 0;
    if (isCustomProperty) {
      this._setProperty(name, value, priority);
      return;
    }
    var lowercaseName = name.toLowerCase();
    if (!allProperties.has(lowercaseName) && !allExtraProperties.has(lowercaseName)) {
      return;
    }

    this[lowercaseName] = value;
    this._importants[lowercaseName] = priority;
    
    /**
     * @platform NativeScript
     * Set the equivalent style on the host element.
     * Gotcha: users must be careful to preserve the casing, and renderers and other tooling
     * must be careful not to force it all to lower case before it reaches us.
     */
    this._hostElement && this._hostElement.setAttribute(name, value);
  },
  _setProperty: function(name, value, priority) {
    if (value === undefined) {
      return;
    }
    if (value === null || value === '') {
      this.removeProperty(name);
      return;
    }
    if (this._values[name]) {
      // Property already exist. Overwrite it.
      var index = Array.prototype.indexOf.call(this, name);
      if (index < 0) {
        this[this._length] = name;
        this._length++;
      }
    } else {
      // New property.
      this[this._length] = name;
      this._length++;
    }
    this._values[name] = value;
    this._importants[name] = priority;
    this._onChange(this.cssText);

    /**
     * @platform NativeScript
     * I'm not sure whether there's any NativeScript equivalent to this;
     * I'm unfamiliar with how it handles CSS variables.
     */
  },

  /**
   *
   * @param {string} name
   * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-removeProperty
   * @return {string} the value of the property if it has been explicitly set for this declaration block.
   * Returns the empty string if the property has not been set or the property name does not correspond to a known CSS property.
   */
  removeProperty: function(name) {
    if (!this._values.hasOwnProperty(name)) {
      return '';
    }

    var prevValue = this._values[name];
    delete this._values[name];
    delete this._importants[name];

    if(this._hostElement){
      /**
       * @platform NativeScript
       * Remove the equivalent style from the host element.
       */
      var matchingProperty = propertiesWhoseValidatorsDoNotAcceptUnsetValue[name];
      matchingProperty ?
        this._hostElement.setAttribute(name, matchingProperty.defaultValue) :
        this._hostElement.removeAttribute(name);
    }

    var index = Array.prototype.indexOf.call(this, name);
    if (index < 0) {
      return prevValue;
    }

    // That's what WebKit and Opera do
    Array.prototype.splice.call(this, index, 1);

    // That's what Firefox does
    //this[index] = ""

    this._onChange(this.cssText);
    return prevValue;
  },

  /**
   *
   * @param {String} name
   */
  getPropertyPriority: function(name) {
    return this._importants[name] || '';
  },

  getPropertyCSSValue: function() {
    //FIXME
    return;
  },

  /**
   *   element.style.overflow = "auto"
   *   element.style.getPropertyShorthand("overflow-x")
   *   -> "overflow"
   */
  getPropertyShorthand: function() {
    //FIXME
    return;
  },

  isPropertyImplicit: function() {
    //FIXME
    return;
  },

  /**
   *   http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-item
   */
  item: function(index) {
    index = parseInt(index, 10);
    if (index < 0 || index >= this._length) {
      return '';
    }
    return this[index];
  },
};

Object.defineProperties(CSSStyleDeclaration.prototype, {
  cssText: {
    get: function() {
      var properties = [];
      var i;
      var name;
      var value;
      var priority;
      for (i = 0; i < this._length; i++) {
        name = this[i];
        value = this.getPropertyValue(name);
        priority = this.getPropertyPriority(name);
        if (priority !== '') {
          priority = ' !' + priority;
        }
        properties.push([name, ': ', value, priority, ';'].join(''));
      }
      return properties.join(' ');
    },
    set: function(value) {
      var i;
      this._values = {};
      Array.prototype.splice.call(this, 0, this._length);
      this._importants = {};
      var dummyRule;
      try {
        dummyRule = CSSOM.parse('#bogus{' + value + '}').cssRules[0].style;
      } catch (err) {
        // malformed css, just return
        return;
      }
      var rule_length = dummyRule.length;
      var name;
      for (i = 0; i < rule_length; ++i) {
        name = dummyRule[i];
        this.setProperty(
          dummyRule[i],
          dummyRule.getPropertyValue(name),
          dummyRule.getPropertyPriority(name)
        );
      }
      this._onChange(this.cssText);
    },
    enumerable: true,
    configurable: true,
  },
  parentRule: {
    get: function() {
      return null;
    },
    enumerable: true,
    configurable: true,
  },
  length: {
    get: function() {
      return this._length;
    },
    /**
     * This deletes indices if the new length is less then the current
     * length. If the new length is more, it does nothing, the new indices
     * will be undefined until set.
     **/
    set: function(value) {
      var i;
      for (i = value; i < this._length; i++) {
        delete this[i];
      }
      this._length = value;
    },
    enumerable: true,
    configurable: true,
  },
});

require('./properties')(CSSStyleDeclaration.prototype);

allProperties.forEach(function(property) {
  if (!implementedProperties.has(property)) {
    var declaration = getBasicPropertyDescriptor(property);
    Object.defineProperty(CSSStyleDeclaration.prototype, property, declaration);
    Object.defineProperty(CSSStyleDeclaration.prototype, dashedToCamelCase(property), declaration);
  }
});

allExtraProperties.forEach(function(property) {
  if (!implementedProperties.has(property)) {
    var declaration = getBasicPropertyDescriptor(property);
    Object.defineProperty(CSSStyleDeclaration.prototype, property, declaration);
    Object.defineProperty(CSSStyleDeclaration.prototype, dashedToCamelCase(property), declaration);
  }
});

exports.CSSStyleDeclaration = CSSStyleDeclaration;
