"use strict";

var BLOCK_SELECTOR = "div._41ud";
var USERNAME_SELECTOR = "h5._ih3";
var MESSAGE_SELECTOR = "span._3oh-._58nk";

function scrape() {
  var messages = [];

  $(BLOCK_SELECTOR).each(function () {
    var username = $(this).find(USERNAME_SELECTOR).first().text();
    var blockMessages = $(this).find(MESSAGE_SELECTOR).each(function () {
      var message = $(this).text();
      messages.push({
        "username": username,
        "message": message
      });
    });
  });

  return messages;
}

window.onload = function () {
  chrome.runtime.onMessage.addListener(function (req, _, sendResponse) {
    if (req.action == "scrape") {
      var messages = scrape();
      console.log(messages);
      sendResponse({
        action: "scrape",
        messages: messages
      });
    }
  });
};