const BLOCK_SELECTOR = "div._41ud"
const USERNAME_SELECTOR = "h5._ih3"
const MESSAGE_SELECTOR = "span._3oh-._58nk"

function scrape() {
  var messages = []

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

  return messages
}

chrome.runtime.onMessage.addListener(function(req, _, sendResponse) {
  if (req.action == "scrape") {
    var messages = scrape()
    console.log(messages)
    sendResponse({
      action: "scrape",
      messages: messages
    })
  }
})
