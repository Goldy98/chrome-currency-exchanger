(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/content.ts-8f05d046.js")
    );
  })().catch(console.error);

})();
