import _ from 'lodash';
import semver from 'semver'; // ?? maybe?

import {
  loadScript,
  injectCss
} from '../utilities/index.js';

let Cropperjs = {
  isScriptReady: false,
};

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

  #defaultInitializationOptions = {
    uploadUrl: 'https://my-website.com/image/upload', // TODO TAM: clean
    allowedImageTypes: [
      'jpg',
      'png',
      'svg'
    ],
    viewMode: 1,
    dragMode: 'crop',
    initialAspectRatio: 1,
    responsive: true,
    autoCropArea: 0.5,
    ready: () => {
      console.log('CropperJS is ready!')
    },
  };

  /**
   * the finalized package options object.
   */
   #finalPluginOptions;

  constructor(elementSelector, options = {}) {
    // TODO TAM: Check if the passed in elementSelector is a valid image type.
    this.updateElement(elementSelector);
    this.updateOptions(options);
    return this.initialize();
  }

  // TODO implement: if the user passes in an element that cropperjs doesn't support, we have to 'convert' it to one
  // that it does -- either an HTMLImageElement or HTMLCanvasElement.
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

  initialize() {
    return new Cropper(this.element, this.#finalPluginOptions);
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