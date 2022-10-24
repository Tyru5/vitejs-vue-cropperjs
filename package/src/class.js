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
    elementId: null,
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
    this.injectRecommendedStyles();
    this.initializeElements();
    this.initializeCropper();
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
      this.originalElement = elementSelector;
    } else {
      this.originalElement = document.querySelector(elementSelector);
    }
  }

  updateOptions(options) {
    this.#finalPluginOptions = _.merge(this.#defaultInitializationOptions, options || {});
  }

  initializeElements() {
    const ctrlAltEliteElement = document.createElement('div');
    const imageUploadLabelElement = document.createElement('label');
    const hoverOverlayElement = document.createElement('div');
    const uploadLabelWrapperElement = document.createElement('div');
    const uploadLabelElement = document.createElement('div');
    const uploadLabelIconElement = document.createElement('span');
    const uploadLabelTextElement = document.createElement('span');
    const imageInputElement = document.createElement('input');

    imageUploadLabelElement.classList.add('image-upload-label', 'no-image');
    imageUploadLabelElement.htmlFor = this.#finalPluginOptions.elementId;

    hoverOverlayElement.classList.add('hover-overlay', 'absolute-full-cover', 'flex-all-center');

    uploadLabelWrapperElement.classList.add('upload-label-wrapper', 'absolute-full-cover', 'flex-all-center');

    uploadLabelElement.classList.add('upload-label');

    uploadLabelIconElement.classList.add('upload-label-icon', 'material-icons');
    uploadLabelIconElement.textContent = 'image';

    uploadLabelTextElement.classList.add('upload-label-text');
    uploadLabelTextElement.textContent = 'Upload an image.';

    imageInputElement.id = this.#finalPluginOptions.elementId;
    imageInputElement.name = this.#finalPluginOptions.elementId;
    imageInputElement.type = 'file';
    imageInputElement.accept = 'image/*';
    imageInputElement.ariaLabel = 'Press enter to open the file browser where you can select an image to upload.';
    imageInputElement.classList.add('hidden-file-upload-input');

    uploadLabelElement.appendChild(uploadLabelIconElement);
    uploadLabelElement.appendChild(uploadLabelTextElement);

    uploadLabelWrapperElement.appendChild(uploadLabelElement);

    imageUploadLabelElement.appendChild(hoverOverlayElement);
    imageUploadLabelElement.appendChild(uploadLabelWrapperElement);
    imageUploadLabelElement.appendChild(imageInputElement);

    ctrlAltEliteElement.appendChild(imageUploadLabelElement);

    this.originalElement.parentNode.replaceChild(ctrlAltEliteElement, this.originalElement);
    this.rootElement = ctrlAltEliteElement;
  }

  initializeCropper() {
    return new Cropper(this.rootElement, this.#finalPluginOptions);
  }

  injectRecommendedStyles() {
    const css = `
    .ctrl-alt-elite {
        font-family: sans-serif;
      }
      .image-upload-label {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 100%;
        margin-bottom: 0;
        border: 2px dashed;
        border-color: #BDBDBD;
        aspect-ratio: 16/9;
        max-height: 200px;
        max-width: 200px;
      }

      .absolute-full-cover {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }

      .flex-all-center {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .hover-overlay {
        background: rgba(0,0,0,0.6);
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
      }

      .hover-overlay * {
        pointer-events: none;
      }

      .image-upload-label.no-image {
        cursor: pointer;
      }

      .image-upload-label.no-image:hover .hover-overlay {
        opacity: 1;
      }

      .image-upload-label.no-image:hover .upload-label {
        color: #FFF;
      }

      .hidden-file-upload-input {
        height: 0;
        width: 0;
        opacity: 0;
        position: absolute;
      }

      .upload-label {
        color: #757575;
        font-weight: bolder;
        transition: color 0.2s ease-in-out;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    `;

    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = 'ctrl-alt-delete-styles';

    if (style.styleSheet) style.styleSheet.cssText = css;
    else style.appendChild(document.createTextNode(css));
    head.appendChild(style);
  }

}
// ------------------------------------------
// End of CtrlAltElite Class definition
// ------------------------------------------


function scriptLoaded() {
  Cropperjs.isScriptReady = true;
}

if (typeof document !== 'undefined') {
  injectCss('https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css');
  injectCss('https://fonts.googleapis.com/icon?family=Material+Icons');
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js', scriptLoaded);
}

CtrlAltElite.VERSION = '1.0.0';

export default CtrlAltElite;