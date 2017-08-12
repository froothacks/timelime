"use strict";

function successHandler(res) {

  alert("in");
  console.log("in");
  $("#message", res.toString());
  console.log(res);
  console.log(res);
  $("#main").text(JSON.stringify(res));
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var tab = tabs[0];
  console.log(tab.url, tab.title);
  console.log("eyo");
  // alert("out");
  chrome.tabs.getSelected(null, function (tab) {
    // alert("tab");
    chrome.tabs.sendMessage(tab.id, { action: "scrape" }, function (req) {
      // alert(req.action);
      if (req.action == "scrape") {
        $("#message").text(req.messages.length);
        alert("byyy");
        // alert(JSON.stringify(messages));
        // alert("s");
        $.ajax({
          type: "POST",
          url: "http://127.0.0.1:9000/post/data",
          data: { "messages": req.messages },
          success: successHandler,
          error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
          },
          dataType: "json"
        });

        // $.post("127.0.0.1", { "messages": messages }, successHandler);
        $("#main").text(req.messages.length);
        $.post("127.0.0.1:9000/post/data", { "messages": req.messages }, successHandler);
      }
    });
  });
});