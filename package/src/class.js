import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

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
      this.log('CropperJS is ready!')
    },
  };

  /**
   * the finalized package options object.
   */
   #finalPluginOptions;

   #cropperJS = null;

  constructor(elementSelector, options = {}) {
    // TODO TAM: Check if the passed in elementSelector is a valid image type.
    this.uuid = options.uuid || uuidv4();
    this.debug = options.debug;
    this.debugPrefix = options.debugPrefix || this.uuid;
    this.updateElement(elementSelector);
    this.updateOptions(options);
    this.injectRecommendedStyles();
    this.initializeElements();
    setTimeout( () => {
      this.testSwal();
    }, 5000);
  }

  testSwal() {
    Swal.fire({
      title: 'Error!',
      text: 'Do you want to continue',
      icon: 'error',
      confirmButtonText: 'Cool'
    });
  }

  /**
    * A function that logs a color-coded message to the console if `debug` is `true`.
    *
    * @param {Object} args - A destructred array of all arguments passed into the `log` function which are then logged out in that same order.
    *
    */
   log(...args) {
    /* eslint no-console: "off" */
    if (this.debug) console.log(`%c[${this.debugPrefix}]`, 'color: white; background: #2196F3', ...args);
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
      this.originalElement = elementSelector;
    } else {
      this.originalElement = document.querySelector(elementSelector);
    }
  }

  updateOptions(options) {
    this.#finalPluginOptions = _.merge(this.#defaultInitializationOptions, options || {});
  }

  handleImageLoad(imageUrl) {
    const rect = this.imageUploadLabelElement.getBoundingClientRect();
    this.log('rect', rect);
    this.modalDiv = document.createElement('div');
    this.modalImage = document.createElement('img');
    this.modalImage.src = this.imageUrl;
    this.modalImage.classList.add('ctrl-alt-elite-hidden-modal-image');
    this.modalDiv.classList.add('ctrl-alt-elite-modal-div');
    this.modalImage.classList.add('ctrl-alt-elite-modal-image');
    this.modalDiv.style.position = 'absolute';
    this.modalDiv.style.top = `${rect.top}px`;
    this.modalDiv.style.bottom = `${rect.bottom}px`;
    this.modalDiv.style.left = `${rect.left}px`;
    this.modalDiv.style.right = `${rect.right}px`;
    this.modalDiv.style.height = `${rect.height}px`;
    this.modalDiv.style.width = `${rect.width}px`;
    this.modalDiv.style.backgroundImage = `url('${imageUrl}')`;
    document.body.appendChild(this.modalDiv);
    this.modalDiv.appendChild(this.modalImage);
    setTimeout(() => {
      this.modalDiv.classList.add('expand-to-fullscreen');
      this.modalImage.classList.add('expand-to-fullscreen');
      this.initializeCropperJS();
    }, 500);
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', resolve);
      image.addEventListener('error', reject);
      image.src = src;
    });
  }

  async handleImageInputElementChange(event) {
    console.log('handleImageInputElementChange()', this);
    this.uploadLabelElement.style.display = 'none';
    this.uploadLabelLoadingIconElement.style.display = 'block';
    this.imageUrl = URL.createObjectURL(event.target.files[0]);
    console.log('this.imageUrl', this.imageUrl);
    await this.loadImage(this.imageUrl);
    this.imageElement.src = this.imageUrl;
    this.handleImageLoad(this.imageUrl);
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
    this.uploadLabelElement = document.createElement('div');
    const uploadLabelIconElement = document.createElement('span');
    this.uploadLabelTextElement = document.createElement('span');
    this.uploadLabelLoadingIconElement = document.createElement('span');
    const imageInputElement = document.createElement('input');
    this.imageElement = document.createElement('img');

    ctrlAltEliteElement.classList.add('ctrl-alt-delete');

    this.imageUploadLabelElement.classList.add('image-upload-label', 'no-image');
    this.imageUploadLabelElement.htmlFor = this.#finalPluginOptions.elementId;

    hoverOverlayElement.classList.add('hover-overlay', 'absolute-full-cover', 'flex-all-center');

    uploadLabelWrapperElement.classList.add('upload-label-wrapper', 'absolute-full-cover', 'flex-all-center');

    this.uploadLabelElement.classList.add('upload-label');

    uploadLabelIconElement.classList.add('upload-label-icon', 'material-icons');
    uploadLabelIconElement.textContent = 'image';

    this.uploadLabelLoadingIconElement.classList.add('upload-label-loading-icon', 'material-icons', 'spin');
    this.uploadLabelLoadingIconElement.textContent = 'incomplete_circle';

    this.uploadLabelTextElement.classList.add('upload-label-text');
    this.uploadLabelTextElement.textContent = 'Upload an image.';

    imageInputElement.id = this.#finalPluginOptions.elementId;
    imageInputElement.name = this.#finalPluginOptions.elementId;
    imageInputElement.type = 'file';
    imageInputElement.accept = 'image/*';
    imageInputElement.ariaLabel = 'Press enter to open the file browser where you can select an image to upload.';
    imageInputElement.classList.add('hidden-file-upload-input');
    imageInputElement.addEventListener('change', this.handleImageInputElementChange.bind(this));

    this.imageElement.classList.add('ctrl-alt-elite-img');

    this.uploadLabelElement.appendChild(uploadLabelIconElement);
    this.uploadLabelElement.appendChild(this.uploadLabelTextElement);

    uploadLabelWrapperElement.appendChild(this.uploadLabelElement);
    uploadLabelWrapperElement.appendChild(this.uploadLabelLoadingIconElement);

    this.imageUploadLabelElement.appendChild(hoverOverlayElement);
    this.imageUploadLabelElement.appendChild(uploadLabelWrapperElement);
    this.imageUploadLabelElement.appendChild(imageInputElement);
    this.imageUploadLabelElement.appendChild(this.imageElement);

    ctrlAltEliteElement.appendChild(this.imageUploadLabelElement);

    this.originalElement.parentNode.replaceChild(ctrlAltEliteElement, this.originalElement);
    this.rootElement = ctrlAltEliteElement;
  }

  #initializeCropperJsActions() {
    const cropperActionsContainer = document.createElement('div');
    cropperActionsContainer.classList.add('ctrl-alt-elite-cropper-actions-container');
    const [
      resetAction,
      destroyAction,
    ] = [
      document.createElement('button'),
      document.createElement('button'),
    ];
    resetAction.textContent = 'Reset';
    destroyAction.textContent = 'Destroy';

    // Setup button actions:
    resetAction.addEventListener('click', this.handleCropperJsReset.bind(this));
    destroyAction.addEventListener('click', this.handleCropperJsDestroy.bind(this));

    resetAction.classList.add('ctrl-alt-elite-reset-action');
    destroyAction.classList.add('ctrl-alt-elite-destroy-action');
    // Add butons as child elements to the actions container div element:
    // Would normally create a DocumentFragment for multiple node additions, however we don't have many to worry about here.
    // Well... maybe haha.
    cropperActionsContainer.appendChild(resetAction);
    cropperActionsContainer.appendChild(destroyAction);

    this.modalDiv.appendChild(cropperActionsContainer);
  }

  initializeCropperJS() {
    setTimeout( () => {
      this.log('`initializeCropperJS()`');
      this.#cropperJS = new Cropper(this.modalImage, this.#finalPluginOptions);
      this.modalImage.classList.remove('ctrl-alt-elite-hidden-modal-image');
      this.log('cropperjs instance created: ', this.#cropperJS);
      this.#initializeCropperJsActions();
    }, 500);
  }

  handleCropperJsReset() {
    this.#cropperJS.reset();
  }

  // TODO clean: doesn't really work...
  handleCropperJsDestroy() {
    console.log('in here...');
    this.#cropperJS.destroy();
    this.modalDiv.remove();
    this.modalImage.remove();
    this.imageElement.remove();
    this.uploadLabelLoadingIconElement.remove();
    this.imageUploadLabelElement.classList.remove('has-image');
    this.imageUploadLabelElement.classList.add('no-image');
    this.uploadLabelElement.style.display  = '';

    this.initializeElements();
  }

  injectRecommendedStyles() {
    const css = `
      @keyframes spin { 
        100% { 
          transform:rotate(360deg); 
        } 
      }

      @keyframes expand-to-fullscreen {
        0% { 
          background-color: #FFF; 
        }
        50% { 
          background-color: #FFF; 
        } 
        100% { 
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;
          height: 100vh;
          width: 100vw;
          background-color: #000;
        } 
      }

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

      .spin {
        animation: spin 2s linear;
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

      .upload-label-loading-icon {
        display: none;
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

      .ctrl-alt-elite-modal-div, .ctrl-alt-elite-modal-image {
        transition: all 0.3s ease-in-out;
        background-blend-mode: multiply;
        background-size: cover;
      }

      .expand-to-fullscreen {
        animation: 0.75s linear 1 expand-to-fullscreen;
        animation-fill-mode: forwards;
      }

      .ctrl-alt-elite-modal-image.expand-to-fullscreen {
        display: block;
        border-radius: 17px;
        /* This rule is very important, please don't ignore this */
        max-width: 100%;
      }

      .ctrl-alt-elite-hidden-modal-image {
        display: none;
      }

      #ctrl-alt-elite-avatar-crop {
        .cropper-view-box,
        .cropper-face {
          border-radius: 50%;
        }

        /* The css styles for outline do not follow border-radius on iOS/Safari (#979). */
        .cropper-view-box {
            outline: 0;
            box-shadow: 0 0 0 1px #39f;
        }
      }

      .ctrl-alt-elite-cropper-actions-container {
        display: flex;
        justify-content: space-evenly;
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
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js', scriptLoaded);
  injectCss('https://fonts.googleapis.com/icon?family=Material+Icons');
}

CtrlAltElite.VERSION = '1.0.0';

export default CtrlAltElite;