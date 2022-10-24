/**
 * Load a css file programmatically and inject it into the DOM.
 * 
 * @param {String} src The URL of the css file to inject.
 */
 export function injectCss(src) {
  const head = document.head || document.getElementsByTagName('head')[0];
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = src;
  link.media = 'all';
  head.appendChild(link);
}