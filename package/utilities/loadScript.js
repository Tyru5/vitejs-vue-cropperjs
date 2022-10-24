/**
 * Load a script file programmatically and inject it into the DOM.
 * 
 * @param {String} src The URL of the script to inject.
 * @param {Function} callback Optional callback funciton to invoke once the script is loaded.
 */
 export function loadScript(src, callback) {
  let loaded = false;
  const tag = document.createElement('script');
  const firstScriptTag = document.getElementsByTagName('script')[0];
  if (!firstScriptTag) return;
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  tag.onload = function onLoad() {
    if (!loaded) {
      loaded = true;
      if (callback) callback();
    }
  };
  tag.onreadystatechange = function onReadyStateChange() {
    if (!loaded && (this.readyState === 'complete' || this.readyState === 'loaded')) {
      loaded = true;
      if (callback) callback();
    }
  };
  tag.src = src;
}