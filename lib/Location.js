'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

var url_1 = _interopDefault(require('url'));
/**
 *
 */
class Location extends url_1.Url {
  /**
   * Constructor.
   */
  constructor() {
    super('about:blank');
  }
  /**
   * Replaces the current resource with the one at the provided URL. The difference from the assign() method is that after using replace() the current page will not be saved in session History, meaning the user won't be able to use the back button to navigate to it.
   *
   * @param url URL.
   */
  replace(url) {
    this.href = url;
  }
  /**
   * Loads the resource at the URL provided in parameter.
   *
   * Note: Will do the same thing as "replace()" as server-dom does not support loading the URL.
   *
   * @param url
   * @see this.replace()
   */
  assign(url) {
    this.replace(url);
  }
  /**
   * Reloads the resource from the current URL.
   *
   * Note: Will do nothing as reloading is not supported in server-dom.
   */
  reload() {
    // Do nothing
  }
}
module.exports = exports = Location;
exports.default = exports;
//# sourceMappingURL=Location.js.map
