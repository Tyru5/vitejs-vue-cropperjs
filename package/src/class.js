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
    uploadUrl: 'https://my-website.com/image/upload',
    replaceExistingElement: true,
    allowedImageTypes: [ // long term goal
      'jpg',
      'png',
      'svg'
    ],
    elementId: null,
    cropView: 'landscape',
    allowedCropViews: [
      'landscape',
      'portrait',
      'avatar',
    ],
    onSuccess: () => {},
    cropperjs: {
      viewMode: 3,
      dragMode: 'crop',
      initialAspectRatio: 16/9,
      responsive: true,
      autoCropArea: 0.5,
      background: false,
      modal: false,
      ready: () => {
        this.log('CropperJS is ready!')
      },
    },
    sweetAlert: {
      imageWidth: 500,
      imageHeight: 500,
      title: '',
      text: '',
      width: '70%',
      height: '70%',
      customClass: {
        container: '',
        title: '',
        icon: '',
        cancelButton: '',
        actions: 'ctrl-alt-elite-actions-container',
      },
      imageUrl: '',
      imageAlt: 'Custom image to crop and edit',
      confirmButtonText: 'Crop',
      allowOutsideClick: false,
      showCancelButton: true,
      showCloseButton: true, // x in the top right
      didOpen: () => {
        this.log('initializing cropperjs...');
        this.initializeCropperJS();
      }
    }
  };

  /**
   * the finalized package options object.
   */
   #finalPluginOptions;

   /**
    * CropperJS instance.
    */
   #cropperJS = null;

  constructor(elementSelector, options = {}) {
    // TODO TAM: Check if the passed in elementSelector is a valid image type.
    this.uuid = options.uuid || uuidv4();
    this.debug = options.debug;
    this.debugPrefix = options.debugPrefix || this.uuid;
    this.updateElement(elementSelector);
    this.updateOptions(options);
    if (this.#finalPluginOptions.replaceExistingElement) {
      this.injectStylesForNewElements();
      this.initializeElements();
    } else {
      this.injectStylesForExistingElements();
      this.initializeExistingElement();
    }
    this.finalizeInitialization();
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

  /**
   * 
   * @param {*} elementSelector 
   */
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

  /**
   * 
   * @param {*} options 
   */
  updateOptions(options) {
    this.#finalPluginOptions = _.merge(this.#defaultInitializationOptions, options || {});
  }

  /**
   * 
   * @param {*} imageUrl 
   */
  handleImageLoad(imageUrl) {
    this.openCropModal({
      imageUrl,
    });
  }

  handleCropModalClose({
    isConfirmed,
    isDenied,
    isDismissed,
  } = {}) {
    this.imageInputElement.value = '';
    if (isConfirmed) {
      const croppedImgSrc = this.#cropperJS.getCroppedCanvas().toDataURL();
      if (this.imageElement) {
        this.imageElement.src = croppedImgSrc;
      }
      if (_.isFunction(this.#finalPluginOptions.onSuccess)) {
        this.#finalPluginOptions.onSuccess(croppedImgSrc);
      }
    }
  }

  /**
   * 
   * @param {*} param0 
   */
   async openCropModal({
    imageUrl,
  } = {}) {
    // need to add styling to make it look better and more official.
    const options = this.finalizeCropModalOptions({
      imageUrl,
    });
    const cropModalResult = await Swal.fire(options);
    this.handleCropModalClose(cropModalResult);
  }

  finalizeCropModalOptions({
    imageUrl,
  } = {}) {
    const { allowedCropViews } = this.#finalPluginOptions;
    const sweetAlertoptions = {
      ...this.#finalPluginOptions.sweetAlert,
      ...{
        imageUrl,
      }
    };
    const { cropView } = this.#finalPluginOptions;
    if (!allowedCropViews.includes(cropView)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You passed an invalid crop view!',
      });
      throw Error('Invalid crop view! It can be either: \'landscape\' or \'avatar\'');
    }
    return sweetAlertoptions;
  }

  /**
   * 
   * @param {*} src 
   * @returns 
   */
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', resolve);
      image.addEventListener('error', reject);
      image.src = src;
    });
  }

  /**
   * 
   * @param {*} event 
   */
  async handleNewImageInputElementChange(event) {
    this.log('handleNewImageInputElementChange()', { event });
    this.toggleUploadLabel('loading');
    this.imageUrl = URL.createObjectURL(event.target.files[0]);
    this.log('this.imageUrl', this.imageUrl);
    await this.loadImage(this.imageUrl);
    this.imageElement.src = this.imageUrl;
    this.handleImageLoad(this.imageUrl);
    this.imageUploadLabelElement.classList.remove('no-image');
    this.imageUploadLabelElement.classList.add('has-image');
  }

  /**
   * 
   * @param {*} event 
   */
   async handleExistingImageInputElementChange(event) {
    this.log('handleExistingImageInputElementChange()', { event });
    this.imageUrl = URL.createObjectURL(event.target.files[0]);
    this.log('this.imageUrl', this.imageUrl);
    this.handleImageLoad(this.imageUrl);
  }

  toggleUploadLabel(type) {
    if (type === 'loading') {
      this.uploadLabelElement.style.display = 'none';
      this.uploadLabelLoadingIconElement.style.display = 'block';
    } else {
      this.uploadLabelElement.style.display = 'flex';
      this.uploadLabelLoadingIconElement.style.display = 'none';
    }
  }

  /**
   * 
   */
  handleImageOnload() {
    this.imageWidth = this.width;
    this.imageHeight = this.height;
  }

  /**
   * 
   * @returns 
   */
  hasImageBeenAdded() {
    return !!this.imageUrl;
  }

  initializeExistingElement() {
    this.ctrlAltEliteElement = document.createElement('div');
    this.imageUploadLabelElement = document.createElement('label');
    this.imageInputElement = document.createElement('input');
    const clone = this.originalElement.cloneNode(true);
    const rect = this.originalElement.getBoundingClientRect();
    clone.style.width = '100%';
    clone.addEventListener('click', (e) => {
      e.preventDefault();
      this.imageInputElement.click();
    });
    
    this.ctrlAltEliteElement.classList.add('ctrl-alt-elite', 'ctrl-alt-elite-existing');
    this.ctrlAltEliteElement.style.height = `${rect.height}px`;
    this.ctrlAltEliteElement.style.width = `${rect.width}px`;

    this.imageUploadLabelElement.classList.add('image-upload-label', 'no-image');
    this.imageUploadLabelElement.htmlFor = this.#finalPluginOptions.elementId;

    this.imageInputElement.id = this.#finalPluginOptions.elementId;
    this.imageInputElement.name = this.#finalPluginOptions.elementId;
    this.imageInputElement.type = 'file';
    this.imageInputElement.accept = 'image/*';
    this.imageInputElement.ariaLabel = 'Press enter to open the file browser where you can select an image to upload.';
    this.imageInputElement.classList.add('hidden-file-upload-input');
    this.imageInputElement.addEventListener('change', this.handleExistingImageInputElementChange.bind(this));

    this.imageUploadLabelElement.appendChild(clone);
    this.imageUploadLabelElement.appendChild(this.imageInputElement);

    this.ctrlAltEliteElement.appendChild(this.imageUploadLabelElement);

    this.originalElement.parentNode.replaceChild(this.ctrlAltEliteElement, this.originalElement);
    this.originalElement = clone;
  }

  /**
   * 
   */
  initializeElements() {
    this.ctrlAltEliteElement = document.createElement('div');
    this.imageUploadLabelElement = document.createElement('label');
    this.hoverOverlayElement = document.createElement('div');
    this.uploadLabelWrapperElement = document.createElement('div');
    this.uploadLabelElement = document.createElement('div');
    this.uploadLabelIconElement = document.createElement('span');
    this.uploadLabelTextElement = document.createElement('span');
    this.uploadLabelLoadingIconElement = document.createElement('span');
    this.imageInputElement = document.createElement('input');
    this.imageElement = document.createElement('img');

    this.ctrlAltEliteElement.classList.add('ctrl-alt-elite', 'ctrl-alt-elite-new');
    if (this.#finalPluginOptions.cropView === 'avatar') this.ctrlAltEliteElement.classList.add('ctrl-alt-elite-avatar');
    else if (this.#finalPluginOptions.cropView === 'portrait') this.ctrlAltEliteElement.classList.add('ctrl-alt-elite-portrait');

    this.imageUploadLabelElement.classList.add('image-upload-label', 'no-image');
    this.imageUploadLabelElement.htmlFor = this.#finalPluginOptions.elementId;

    this.hoverOverlayElement.classList.add('hover-overlay', 'absolute-full-cover', 'flex-all-center');

    this.uploadLabelWrapperElement.classList.add('upload-label-wrapper', 'absolute-full-cover', 'flex-all-center');

    this.uploadLabelElement.classList.add('upload-label');

    this.uploadLabelIconElement.classList.add('upload-label-icon', 'material-icons');
    this.uploadLabelIconElement.textContent = 'image';

    this.uploadLabelLoadingIconElement.classList.add('upload-label-loading-icon', 'material-icons', 'spin');
    this.uploadLabelLoadingIconElement.textContent = 'incomplete_circle';
    this.uploadLabelLoadingIconElement.style.color = '#757575';

    this.uploadLabelTextElement.classList.add('upload-label-text');
    this.uploadLabelTextElement.textContent = 'Upload an image.';

    this.imageInputElement.id = this.#finalPluginOptions.elementId;
    this.imageInputElement.name = this.#finalPluginOptions.elementId;
    this.imageInputElement.type = 'file';
    this.imageInputElement.accept = 'image/*';
    this.imageInputElement.ariaLabel = 'Press enter to open the file browser where you can select an image to upload.';
    this.imageInputElement.classList.add('hidden-file-upload-input');
    this.imageInputElement.addEventListener('change', this.handleNewImageInputElementChange.bind(this));

    this.imageElement.onload = this.handleImageOnload;
    this.imageElement.src = '';

    this.uploadLabelElement.appendChild(this.uploadLabelIconElement);
    this.uploadLabelElement.appendChild(this.uploadLabelTextElement);

    this.uploadLabelWrapperElement.appendChild(this.uploadLabelElement);
    this.uploadLabelWrapperElement.appendChild(this.uploadLabelLoadingIconElement);

    this.imageUploadLabelElement.appendChild(this.hoverOverlayElement);
    this.imageUploadLabelElement.appendChild(this.uploadLabelWrapperElement);
    this.imageUploadLabelElement.appendChild(this.imageInputElement);
    this.imageUploadLabelElement.appendChild(this.imageElement);

    this.ctrlAltEliteElement.appendChild(this.imageUploadLabelElement);

    this.originalElement.parentNode.replaceChild(this.ctrlAltEliteElement, this.originalElement);
    this.rootElement = this.ctrlAltEliteElement;
  }

  async finalizeInitialization() {
    await document.fonts.ready;
    this.ctrlAltEliteElement.classList.add('ctrl-alt-elite-initialized');
  }

  /**
   * Initialize the CropperJS instance.
   */
  initializeCropperJS() {
    this.log('`initializeCropperJS()`');
    const swalImage = document.getElementsByClassName('swal2-image');
    this.#cropperJS = new Cropper(swalImage[0], this.#finalPluginOptions.cropperjs);
    this.log('cropperjs instance created: ', this.#cropperJS);
  }

  /**
   * Inject package styles.
   */
  injectStylesForNewElements() {
    let css = `
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

      .ctrl-alt-elite-new {
        font-family: sans-serif;
        justify-self: center;
      }

      .ctrl-alt-elite-new .material-icons {
        opacity: 0;
      }

      .ctrl-alt-elite-new.ctrl-alt-elite-initialized .material-icons {
        opacity: 1;
      }

      .ctrl-alt-elite-new .image-upload-label {
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

      .ctrl-alt-elite-new.ctrl-alt-elite-avatar .image-upload-label {
        aspect-ratio: unset;
        border-radius: 50%;
        height: 125px;
        width: 125px;
      }

      .ctrl-alt-elite-new.ctrl-alt-elite-portrait .image-upload-label {
        aspect-ratio: 9/16;
        height: 200px;
        width: 113px;
      }

      .ctrl-alt-elite-new .absolute-full-cover {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }

      .ctrl-alt-elite-new .flex-all-center {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ctrl-alt-elite-new .spin {
        animation: spin 2s linear;
      }

      .ctrl-alt-elite-new .hover-overlay {
        background: rgba(0,0,0,0.6);
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
      }

      .ctrl-alt-elite-new .ctrl-alt-elite-avatar .hover-overlay {
        border-radius: 50%;
      }

      .ctrl-alt-elite-new .hover-overlay * {
        pointer-events: none;
      }

      .ctrl-alt-elite-new .image-upload-label.no-image {
        cursor: pointer;
      }

      .ctrl-alt-elite-new .image-upload-label.no-image:hover .hover-overlay {
        opacity: 1;
      }

      .ctrl-alt-elite-new .image-upload-label.no-image:hover .upload-label {
        color: #FFF;
      }

      .ctrl-alt-elite-new .upload-label-loading-icon {
        display: none;
      }

      .ctrl-alt-elite-new .hidden-file-upload-input {
        height: 0;
        width: 0;
        opacity: 0;
        position: absolute;
      }

      .ctrl-alt-elite-new .image-upload-label.has-image .upload-label {
        display: none;
      }

      .ctrl-alt-elite-new .upload-label {
        color: #757575;
        font-weight: bolder;
        transition: color 0.2s ease-in-out;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .ctrl-alt-elite-new.ctrl-alt-elite-avatar .upload-label-text,
      .ctrl-alt-elite-new.ctrl-alt-elite-portrait .upload-label-text {
        font-size: 12px;
      }

      .ctrl-alt-elite-new.ctrl-alt-elite img {
        height: 100%;
        width: 100%;
        z-index: 2;
      }

      .ctrl-alt-elite-new.ctrl-alt-elite img[src=""] {
        display: none;
      }

      .ctrl-alt-elite-new.ctrl-alt-elite-avatar img {
        border-radius: 50%;
      }

      .swal2-popup {
        border-radis: 17px;
      }
    `;

    const avatarStyling = this.handleAddingAvatarCropViewStyling();
    if (avatarStyling) css += avatarStyling;

    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = 'ctrl-alt-delete-styles';

    if (style.styleSheet) style.styleSheet.cssText = css;
    else style.appendChild(document.createTextNode(css));
    head.appendChild(style);
  }

  injectStylesForExistingElements() {
    let css = `
      .ctrl-alt-elite-existing input[type="file"] {
        height: 0;
        width: 0;
        opacity: 0;
        position: absolute;
      }

      .ctrl-alt-elite-existing,
      .ctrl-alt-elite-existing .image-upload-label,
      .ctrl-alt-elite-existing .image-upload-label * {
        cursor: pointer !important;
      }

      .ctrl-alt-elite-existing .image-upload-label {
        height: 100%;
      }
    `;

    const avatarStyling = this.handleAddingAvatarCropViewStyling();
    if (avatarStyling) css += avatarStyling;

    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = 'ctrl-alt-delete-styles';

    if (style.styleSheet) style.styleSheet.cssText = css;
    else style.appendChild(document.createTextNode(css));
    head.appendChild(style);
  }

  handleAddingAvatarCropViewStyling() {
    if (this.#finalPluginOptions.cropView === 'avatar') {
      return `
        .cropper-view-box,
        .cropper-face {
          border-radius: 50%;
        }

        /* The css styles for outline do not followborder-radius on iOS/Safari (#979). */
        .cropper-view-box {
            outline: 0;
            box-shadow: 0 0 0 1px #39f;
        }
      `;
    }
    return false;
  }

}
// ------------------------------------------
// End of CtrlAltElite Class definition
// ------------------------------------------


function scriptLoaded() {
  Cropperjs.isScriptReady = true;
}

if (typeof document !== 'undefined') {
  if (!document.fonts.check('1rem Material Icons')) {
    injectCss('https://fonts.googleapis.com/icon?family=Material+Icons');
  }
  injectCss('https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css');
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js', scriptLoaded);
}

CtrlAltElite.VERSION = '1.0.0';

export default CtrlAltElite;