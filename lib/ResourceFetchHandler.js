'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const RelativeURL_1 = __importDefault(
  require('happy-dom/lib/location/RelativeURL')
);
const DOMException_1 = __importDefault(
  require('happy-dom/lib/exception/DOMException')
);
/**
 * Helper class for performing fetch of resources.
 */
class ResourceFetchHandler {
  /**
   * Returns resource data asynchonously.
   *
   * @param document Document.
   * @param url URL.
   * @returns Response.
   */
  static async fetch(document, url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new DOMException_1.default(
        `Failed to perform request to "${url}". Status code: ${response.status}`
      );
    }
    return await response.text();
  }
  /**
   * Returns resource data synchonously.
   *
   * @param document Document.
   * @param url URL.
   * @returns Response.
   */
  static fetchSync(document, url) {
    // Drop support for fetchSync to avoid pulling in a bunch of extra dependencies.
    throw new DOMException_1.default(
      `Failed to perform request to "${absoluteURL}". Status code: ${response.statusCode}`
    );

    // // We want to only load SyncRequest when it is needed to improve performance and not have direct dependencies to server side packages.
    // const absoluteURL = RelativeURL_1.default.getAbsoluteURL(document.defaultView.location, url);
    // const syncRequest = require('sync-request');
    // const response = syncRequest('GET', absoluteURL);
    // if (response.isError()) {
    //     throw new DOMException_1.default(`Failed to perform request to "${absoluteURL}". Status code: ${response.statusCode}`);
    // }
    // return response.getBody().toString();
  }
}
exports.default = ResourceFetchHandler;
//# sourceMappingURL=ResourceFetchHandler.js.map
