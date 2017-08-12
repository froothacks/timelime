const BLOCK_SELECTOR = "div._41ud"
const USERNAME_SELECTOR = "h5._ih3"
const MESSAGE_SELECTOR = "span._3oh-._58nk"

console.log("2 scrapeding")

function scrape() {
  var messages = []

  console.log("3 scrapinged")

  $(BLOCK_SELECTOR).each(function() {
    var username = $(this).find(USERNAME_SELECTOR).first().text()
    var blockMessages = $(this).find(MESSAGE_SELECTOR).each(function() {
      var message = $(this).text()
      messages.push({
        "username": username,
        "message": message
      })
    })
  })

  console.log("3.5 scrapingeded")

  return messages
}

window.onload = function() {
  chrome.runtime.onMessage.addListener(function(req, _, sendResponse) {
    console.log('onMessage', req)
    if (req.action == "scrape") {
      sendResponse({
        action: "scrape",
        messages: scrape()
      })
    }
  })
}

