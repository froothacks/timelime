function successHandler(res) {
  console.log(res)
  $("#main").text(JSON.stringify(res))
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var tab = tabs[0]
  console.log(tab.url, tab.title)
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, {action: "scrape"}, function(req) {
      if (req.action == "scrape") {
        $("#main").text(req.messages.length)
        var data = {"messages": JSON.stringify(req.messages)}
        console.log(data)
        $.post("http://127.0.0.1:9000/post/data", data, successHandler)
      }
    })
  })
})
