function successHandler(res) {
  console.log(res)
  // $("#message").text(JSON.stringify(res))

  // res.data = [
  //   {id:0, content:"", start:new Date(2017,7,13,17), end:new Date(2017,7,13,20), group:0, className:"available"},
  //   {id:1, content:"", start:new Date(2017,7,13,20), end:new Date(2017,7,13,23), group:0, className:"busy"},
  //   {id:2, content:"", start:new Date(2017,7,13),    end:new Date(2017,7,14),    group:1, className:"available"}
  // ]

  // res.groups = [
  //   {id:0, content:"Advait"},
  //   {id:1, content:"Leon"}
  // ]

  res = {
    data:
    [ { id: 0,
        content: "",
        start: "2017-08-15T12:00:00.000Z",
        end: "2017-08-15T13:00:00.000Z",
        group: 0,
        className: "available" },
      { id: 1,
        content: "",
        start: "2017-08-12T06:30:00.000Z",
        end: "2017-08-12T07:30:00.000Z",
        group: 1,
        className: "available" },
      { id: 2,
        content: "",
        start: "2017-08-12T06:00:00.000Z",
        end: "2017-08-12T07:00:00.000Z",
        group: 1,
        className: "available" },
      { id: 3,
        content: "",
        start: "2017-08-12T03:00:00.000Z",
        end: "2017-08-12T05:00:00.000Z",
        group: 2,
        className: "available" },
      { id: 4,
        content: "",
        start: "2017-08-12T04:00:00.000Z",
        end: "2017-08-12T06:00:00.000Z",
        group: 2,
        className: "busy" },
      { id: 5,
        content: "",
        start: "2017-08-12T03:00:00.000Z",
        end: "2017-08-12T07:00:00.000Z",
        group: 2,
        className: "available" },
      { id: 6,
        content: "",
        start: "2017-08-21T12:00:00.000Z",
        end: "2017-08-21T13:00:00.000Z",
        group: 2,
        className: "available" },
      { id: 7,
        content: "",
        start: "2017-08-23T12:00:00.000Z",
        end: "2017-08-23T13:00:00.000Z",
        group: 2,
        className: "available" },
      { id: 8,
        content: "",
        start: "2017-08-21T12:00:00.000Z",
        end: "2017-08-21T13:00:00.000Z",
        group: 2,
        className: "available" },
      { id: 9,
        content: "",
        start: "2017-07-01T12:00:00.000Z",
        end: "2017-07-01T13:00:00.000Z",
        group: 2,
        className: "available" },
      { id: 10,
        content: "",
        start: "2017-08-22T12:00:00.000Z",
        end: "2017-08-22T13:00:00.000Z",
        group: 2,
        className: "available" },
      { id: 11,
        content: "",
        start: "2017-08-13T12:00:00.000Z",
        end: "2017-08-13T13:00:00.000Z",
        group: 2,
        className: "available" } ],
    groups:
    [ { id: 0, content: "Advait" },
      { id: 1, content: "Ethan" },
      { id: 2, content: "Leon" } ] }

  var container = $("#timeline")[0]
  var data = new vis.DataSet(res.data)
  var groups = new vis.DataSet(res.groups)
  var options = {
    stack: false,
    // start: new Date(),
    // end: new Date(7*24*60*60*1000 + (new Date()).valueOf()),
    editable: true,
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
