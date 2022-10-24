import _ from 'lodash';
class CtrlAltElite {
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
}