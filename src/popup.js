function successHandler(res) {
  console.log(res)
  // $("#message").text(JSON.stringify(res))

  var container = $("#timeline")[0]
  var data = new vis.DataSet(res.data)
  var groups = new vis.DataSet(res.groups)
  var options = {
    stack: false,
    // start: new Date(),
    // end: new Date(7*24*60*60*1000 + (new Date()).valueOf()),
    selectable: false,
    margin: {
      item: 10, // minimal margin between items
      axis: 5   // minimal margin between items and the axis
    },
    orientation: "top"
  }
  var timeline = new vis.Timeline(container, data, groups, options)
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var tab = tabs[0]
  console.log(tab.url, tab.title)
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, {action: "scrape"}, function(req) {
      if (req.action == "scrape") {
        // $("#message").text(req.messages.length)
        var data = {"messages": JSON.stringify(req.messages)}
        console.log(data)
        $.post("http://127.0.0.1:9000/post/data", data, successHandler)
      }
    })
  })
})
