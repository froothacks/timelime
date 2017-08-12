chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var tab = tabs[0]
  console.log(tab.url, tab.title)
  chrome.tabs.getSelected(null, function(tab) {
    console.log("1 scrapin'")
    chrome.tabs.sendMessage(tab.id, {action: "scrape"}, function(req) {
      console.log(req)
      if (req.action=="scrape") {
        console.log('4 scrapeeddd')
        console.log(req.messages)
        document.querySelector("#message").innerText = req.messages
      }
    })
  })
})
