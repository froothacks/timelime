"use strict";

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var tab = tabs[0];
  console.log(tab.url, tab.title);
  chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.sendMessage(tab.id, { action: "scrape" }, function (req) {
      if (req.action == "scrape") {
        document.querySelector("#message").innerText = req.messages;
      }
    });
  });
});