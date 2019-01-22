# timelime

![Screenshot of timelime in action](/docs/timelime.jpg)

## Inspiration
Scheduling meetings through instant messaging applications was almost impossible. Relevant messages for meeting planning got buried under irrelevant messages. For example, when attempting to get a group of friends together for a meet-up the conversation would be similar to the following:

- A: Hey, you guys want to meet up sometime? 
- B: Sure, I am available from 5 pm to 8 pm! 
- B: Hey, have you heard about the new Drake album that just came out?
- A: Yo, it's lit!
- B: Yeah, I just replayed it 50 times in a row!
- A: We gotta get together sometime and sing those songs!
- B: For sure!
- A: What about you, C?
- C: I'll be busy from 5 pm to 6 pm!
- A: I think 7 pm sounds good!

With 3 people, it is possible to plan such a meeting but in large groups of 20+ people, the messages would become buried under irrelevant messages potentially containing gifs, pictures and videos.

## What it does
In order to easily plan meetings, we created a Chrome extension that analyzes Facebook Messenger messages and creates a visual timeline of each user in the group in order to offer the host/planner of the meeting an easy method to visualize the data. From this timeline, the planner of the meeting can easily pick out a time that works for everybody. 

## How we built it
Initially, we looked into Facebook apps which we thought could get permission to read user messages. However, such apps are only allowed to read messages if they start an individual conversation to a user e.g. chatbots. Next, we tried intercepting Facebook's messages when they are sent/received from Facebook's server. Of course, we were unable to hack into these communications (thank goodness :) ). Then, we decided to create a Chrome extension since it has access to the page's DOM, containing the text messages. The DOM was very obfuscated and minified so we had to find CSS/HTML tags that hinted at where the message text was stored. 

## Challenges we ran into
* Natural Language Processing (NLP) messages to extract date ranges was extremely hard. In the end, we used an npm module (Node.js) in order to process the messages on the Node.js server backend. We had to tweak its algorithm slightly in order to make it work effectively for our dataset. 
* We needed to find a way to differentiate between messages that indicate "busy" times and "available" times. In the end, we used sentimentality analysis to get positive/negative values for each message. Generally, sentimentality analysis is used for identifying emotions but we found that it worked quite well in our use case since words like "busy", or "unavailable" are generally "negative" and words like "free" or "available" are generally "positive"
* Parsing through the Facebook Messenger DOM was extremely difficult. In the end, we managed to use CSS selectors to extract the message content from the page and bring it into the extension. 
* Getting the communication between the server and the client was quite difficult since it was our first time using Node.js

## Accomplishments that we're proud of
* Getting a Node.js Express server running (first time using Node.js - HYPE!)
* Figuring out how to create a Chrome extension
* Successfully parsing human messages for date ranges
* Using sentimentality analysis to differentiate between "available" and "busy" or other similar terms

## What we learned
* How Node.js works
* File structure of chrome extensions

## What's next for Timelime
* Publishing it on the Chrome Web Store
    EDIT 14 Aug. 2017: Currently testing the extension for bugs. Hoping to publish in less than a week. 
* Removing server-side processing (too many privacy/security issues since it is essentially sending out personal messages from all groups a user runs the extension in)
    EDIT 13 Aug. 2017: Server-side processing has been removed using Browserify to package the npm modules!
* Cleaning up the user interface
