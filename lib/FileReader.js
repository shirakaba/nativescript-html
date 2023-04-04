'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const EventTarget_1 = __importDefault(
  require('happy-dom/lib/event/EventTarget')
);

var NotYetImplemented =
  "NativeScript DOM's FileReader API is not yet fully implemented.";

/**
 * Reference:
 * https://developer.mozilla.org/sv-SE/docs/Web/API/FileReader.
 *
 * Based on:
 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/file-api/FileReader-impl.js (MIT licensed).
 */
class FileReader extends EventTarget_1.default {
  constructor() {
    super(...arguments);
    this.error = null;
    this.result = null;
    this.readyState = 0;
    this.onabort = null;
    this.onerror = null;
    this.onload = null;
    this.onloadstart = null;
    this.onloadend = null;
    this.onprogress = null;
    this._isTerminated = false;
    this._loadTimeout = null;
    this._parseTimeout = null;
  }
  /**
   * Reads as ArrayBuffer.
   *
   * @param blob Blob.
   */
  readAsArrayBuffer(blob) {
    throw new Error(NotYetImplemented);
  }
  /**
   * Reads as binary string.
   *
   * @param blob Blob.
   */
  readAsBinaryString(blob) {
    throw new Error(NotYetImplemented);
  }
  /**
   * Reads as data URL.
   *
   * @param blob Blob.
   */
  readAsDataURL(blob) {
    throw new Error(NotYetImplemented);
  }
  /**
   * Reads as text.
   *
   * @param blob Blob.
   * @param [encoding] Encoding.
   */
  readAsText(blob, encoding = null) {
    throw new Error(NotYetImplemented);
  }
  /**
   * Aborts the file reader.
   */
  abort() {
    throw new Error(NotYetImplemented);
  }
  /**
   * Reads a file.
   *
   * @param blob Blob.
   * @param format Format.
   * @param [encoding] Encoding.
   */
  _readFile(blob, format, encoding = null) {
    throw new Error(NotYetImplemented);
  }
}
exports.default = FileReader;
FileReader._ownerDocument = null;
//# sourceMappingURL=FileReader.js.map
