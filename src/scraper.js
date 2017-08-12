const BLOCK_SELECTOR = "div._41ud"
const USERNAME_SELECTOR = "h5._ih3"
const MESSAGE_SELECTOR = "span._3oh-._58nk"

document.querySelector('#message2').innerText = "scrapeding";

function scrape() {
	var messages = []

	$(BLOCK_SELECTOR).each(function() {
		username = $(this).find(USERNAME_SELECTOR).first().html()
		blockMessages = $(this).find(MESSAGE_SELECTOR).each(function() {
			message = $(this).html()
			messages.push({
				"username": username,
				"message": message
			})
		})
	})

	document.querySelector('#message3').innerText = "scrapinged";

    return messages
}


chrome.runtime.sendMessage({
	action: "scrape",
	messages: scrape()
})