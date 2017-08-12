chrome.runtime.onMessage.addListener(function(request, sender) {
  document.querySelector('#message4').innerText = "scrapedd";
  if (request.action == "scrape") {
    document.querySelector('#message').innerText = request.messages;
  }
});

window.onload = function() {

  chrome.tabs.executeScript(null, {file: "scraper.js"}, function() {
    document.querySelector('#message1').innerText = "scrapin'";
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      document.querySelector('#message').innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message
    }
  })
}
