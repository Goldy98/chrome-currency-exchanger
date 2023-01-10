chrome.runtime.onInstalled.addListener(function () {
  console.log("Currency Converter BACKGROUND script installed.");
});

// chrome.runtime.onInstalled.addListener(function () {
//   chrome.contextMenus.create({
//     id: "sampleContextMenu",
//     title: "Sample Context Menu",
//     contexts: ["selection"],
//   });
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("²²²²²²²²²²²²²²²²²", request);
  var popup = chrome.extension.getViews({ type: "popup" })[0];
  popup.postMessage(request, "*");
  sendResponse({ message: "hello from background page" });
});

export {};
