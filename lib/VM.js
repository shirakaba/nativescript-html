'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class VM {
  // I've implemented just enough to cover all the use-cases in node_modules/happy-dom/lib/window/Window.js
  static isContext(obj) {
    return false;
  }
  static createContext(obj) {}
  static runInContext(obj, options) {}
}

module.exports = exports = VM;
exports.default = exports;
