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

  handleImageLoad() {
    const rect = this.imageUploadLabelElement.getBoundingClientRect();
    console.log('rect', rect);
    const modalDiv = document.createElement('div');
    modalDiv.classList.add('ctrl-alt-elite-modal-div');
    modalDiv.style.position = 'absolute';
    modalDiv.style.top = `${rect.top}px`;
    modalDiv.style.bottom = `${rect.bottom}px`;
    modalDiv.style.left = `${rect.left}px`;
    modalDiv.style.right = `${rect.right}px`;
    modalDiv.style.height = `${rect.height}px`;
    modalDiv.style.width = `${rect.width}px`;
    modalDiv.style.backgroundImage = `url('${this.imageUrl}')`;
    document.body.appendChild(modalDiv);
    setTimeout(() => {
      modalDiv.classList.add('fullscreen');
    }, 3000);
  }

  handleImageInputElementChange(event) {
    console.log('handleImageInputElementChange()', this);
    this.imageUrl = URL.createObjectURL(event.target.files[0]);
    console.log('this.imageUrl', this.imageUrl);
    this.imageElement.addEventListener('load', this.handleImageLoad.bind(this));
    this.imageElement.src = this.imageUrl;
    this.imageUploadLabelElement.classList.remove('no-image');
    this.imageUploadLabelElement.classList.add('has-image');
  }

  hasImageBeenAdded() {
    return !!this.imageUrl;
  }

  initializeElements() {
    const ctrlAltEliteElement = document.createElement('div');
    this.imageUploadLabelElement = document.createElement('label');
    const hoverOverlayElement = document.createElement('div');
    const uploadLabelWrapperElement = document.createElement('div');
    const uploadLabelElement = document.createElement('div');
    const uploadLabelIconElement = document.createElement('span');
    const uploadLabelTextElement = document.createElement('span');
    const imageInputElement = document.createElement('input');
    this.imageElement = document.createElement('img');

    ctrlAltEliteElement.classList.add('ctrl-alt-delete');

    this.imageUploadLabelElement.classList.add('image-upload-label', 'no-image');
    this.imageUploadLabelElement.htmlFor = this.#finalPluginOptions.elementId;

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
    imageInputElement.addEventListener('change', this.handleImageInputElementChange.bind(this));

    this.imageElement.classList.add('ctrl-alt-elite-img');

    uploadLabelElement.appendChild(uploadLabelIconElement);
    uploadLabelElement.appendChild(uploadLabelTextElement);

    uploadLabelWrapperElement.appendChild(uploadLabelElement);

    this.imageUploadLabelElement.appendChild(hoverOverlayElement);
    this.imageUploadLabelElement.appendChild(uploadLabelWrapperElement);
    this.imageUploadLabelElement.appendChild(imageInputElement);
    this.imageUploadLabelElement.appendChild(this.imageElement);

    ctrlAltEliteElement.appendChild(this.imageUploadLabelElement);

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
        height: 113px;
        width: 200px;
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

      .image-upload-label.has-image .upload-label {
        display: none;
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

      .ctrl-alt-elite-img {
        aspect-ratio: 16/9;
        max-height: 100%;
        max-width: 100%;
      }

      .ctrl-alt-elite-modal-div {
        transition: all 0.3s ease-in-out;
        background-blend-mode: multiply;
        background-size: cover;
      }

      .ctrl-alt-elite-modal-div.fullscreen {
        top: 0px !important;
        right: 0px !important;
        bottom: 0px !important;
        left: 0px !important;
        height: 100vh !important;
        width: 100vw !important;
        background-color: #000 !important;
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