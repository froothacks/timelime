function successHandler(res) {
  $("#message", res.toString())
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var tab = tabs[0]
  console.log(tab.url, tab.title)
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, {action: "scrape"}, function(req) {
      if (req.action == "scrape") {
        $("#message").text(req.messages.length)
        $.post("127.0.0.1", {"messages": messages}, successHandler)
      }
    })
  })
})
