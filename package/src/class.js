import _ from 'lodash';
import semver from 'semver'; // ?? maybe?

import {
  loadScript,
  injectCss
} from '../utilities/index.js';

/**
 * CtrlAltElite npm package.
 * 
 * Example usage:
 * const ctrlAltElite = new CtrlAltElite('#my-element', {
 *    uploadUrl: 'https://my-website.com/image/upload',
 *    .
 *    .
 *    .
 * })
 */
class CtrlAltElite {

  // image types:
  #defaultInitializationOptions = {
    uploadUrl: 'https://my-website.com/image/upload', // TODO TAM: clean
    viewMode: 1,
    dragMode: 'crop',
    initialAspectRatio: 1,
    responsive: true,
  };

  /**
   * the finalized package options object.
   */
   #finalPluginOptions;

  constructor(elementSelector, options = {}) {
    this.updateElement(elementSelector);
    this.updateOptions(options);
  }

  updateElement(elementSelector) {
    if (
      !_.isElement(elementSelector)
      && (
        !_.isString(elementSelector)
        || !document.querySelector(elementSelector)
      )
    ) {
      throw Error('The first argument for the CtrlAltElite class must be an HTML element or a valid HTML element selector string.');
    }
    if (_.isElement(elementSelector)) {
      this.element = elementSelector;
    } else {
      this.element = document.querySelector(elementSelector);
    }
  }

  updateOptions(options) {
    this.#finalPluginOptions = _.merge(this.#defaultInitializationOptions, options || {});
  }


}
// ------------------------------------------
// End of CtrlAltElite Class definition
// ------------------------------------------


function scriptLoaded() {
  Cropperjs.isScriptReady = true;
}

if (typeof document !== 'undefined') {
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js', scriptLoaded);
  injectCss('https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css');
}

CtrlAltElite.VERSION = '1.0.0';

export default CtrlAltElite;