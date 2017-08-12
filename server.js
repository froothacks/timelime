process.env.TZ = 'Eastern Daylight Time'

const express = require('express');
// console.log(WtoN.parse("five"));
// console.log(WtoN.parse("today at five"));
// console.log(WtoN.parse("three to five"));
// console.log(WtoN.parse("today from three to five"));
const bodyParser = require('body-parser');
const chrono = require('chrono-node');
const sentiment = require('sentiment')

const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())

const NAME_TO_NUMBER = {
    "zero": "0",
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5",
    "six": "6",
    "seven": "7",
    "eight": "8",
    "nine": "9",
    "ten": "10",
    "eleven": "11",
    "twelve": "12",
    "thirteen": "13",
    "fourteen": "14",
    "fifteen": "15",
    "sixteen": "16",
    "seventeen": "17",
    "eighteen": "18",
    "nineteen": "19",
    "twenty": "20",
    "twenty one": "21",
    "twenty two": "22",
    "twenty three": "23",
    "twenty four": "24",
    "twenty five": "25",
    "twenty six": "26",
    "twenty seven": "27",
    "twenty eight": "28",
    "twenty nine": "29",
    "thirty": "30",
    "thirty one": "31",
    "twenty-one": "21",
    "twenty-two": "22",
    "twenty-three": "23",
    "twenty-four": "24",
    "twenty-five": "25",
    "twenty-six": "26",
    "twenty-seven": "27",
    "twenty-eight": "28",
    "twenty-nine": "29",
    "thirty-one": "31"


}

const PORT = 9000;
const OVERRIDES = {
    "can't": -4,
    "can": 2,
    "unavailable": -4,
    "available": 2,
    "free": 2,
    "not": -4,
    "out of office": -4
}

app.post('/post/data', function(req, res) {
    console.log('receiving data...');
    var data = JSON.parse(req.body["messages"]);
    console.log(data);
    var response = {
        "availability": []
    };
    var userDict = {};
    var userRanges = {};
    for (var i = 0; i < data.length; i++) {
        var message = data[i]["message"].toLowerCase();

        var words_list = data[i]["message"].split(" ");
        console.log(message.toLowerCase());
        for (var j = 0; j < words_list.length; j++) {
            if (Object.keys(NAME_TO_NUMBER).indexOf(words_list[j])!==-1) {
                message = message.replace(words_list[j], NAME_TO_NUMBER[words_list[j]])
            }
        }
        var parse_results = chrono.parse(message);
        var user_name = data[i]["username"];
        for (var j = 0; j < parse_results.length; j++) {
            var date_dictionary = parse_results[j].start.knownValues;
            var date_dictionary_i = parse_results[j].start.impliedValues;
            var keys = Object.keys(parse_results[j].start.impliedValues);
            for (var ite = 0; ite < keys.length; ite++) {
                date_dictionary[keys[ite]] = date_dictionary_i[keys[ite]];
            }
            var startTime = new Date(date_dictionary.year, date_dictionary.month - 1, date_dictionary.day, date_dictionary.hour, date_dictionary.minute, date_dictionary.second);
            var endTime;
            if (parse_results[j].end != undefined) {
                var d = parse_results[j].end.knownValues;
                var y = parse_results[j].end.impliedValues;
                var _keys = Object.keys(parse_results[j].end.impliedValues);
                for (var iter = 0; iter < _keys.length; iter++) {
                    d[_keys[iter]] = y[_keys[iter]];
                }
                endTime = new Date(d.year, d.month - 1, d.day, d.hour, d.minute, d.second);
            } else {
                endTime = new Date(date_dictionary.year, date_dictionary.month - 1, date_dictionary.day, date_dictionary.hour + 1, date_dictionary.minute, date_dictionary.second);
            }

            var boolAvailable;
            var message_body = data[i]["message"];
            if (sentiment(message_body, OVERRIDES)["score"] < 0) {
                boolAvailable = "false";
            } else {
                boolAvailable = "true";
            }
            var startStamp = startTime.valueOf();
            var endStamp = endTime.valueOf();

            var details = {
	                    	"available": boolAvailable,
	                    	"start": startTime,
	                    	"end": endTime
                		};
            var userKeys = Object.keys(userDict);
            for (var usernamei = 0; usernamei < userKeys.length; usernamei++) {
            	for (var rangei = userDict[userKeys[usernamei]].length-1; rangei >= 0; rangei--){
		    		// console.log(rangei);
		    		// console.log(userKeys[usernamei]);
		    		var curSet = userDict[userKeys[usernamei]][rangei];
		    		var startCur = curSet["start"].valueOf();
		    		var endCur = curSet["end"].valueOf();
		    		console.log("Adding");
		    		console.log(startTime, endTime);
		    		console.log("Override");
		    		console.log(curSet["start"], curSet["end"]);
		    		if (startStamp <= startCur && endStamp >= endCur){
		    			console.log("large period");
		    			console.log(userDict[userKeys[usernamei]]);
		    			userDict[userKeys[usernamei]].splice(rangei,1);

		    			console.log(userDict[userKeys[usernamei]]);
		    			// userDict[userKeys[usernamei]][rangei].deleteObject();
		    		}
		    		else if (startStamp > startCur && endStamp < endCur) {
		    			if (curSet["available"] !== boolAvailable){
		    				userDict[userKeys[usernamei]].push({
		    					"available": curSet["available"],
	                    		"start": new Date(endStamp),
	                    		"end": curSet["end"]
		    				});		    				
		    				userDict[userKeys[usernamei]][rangei]["end"] = new Date(startStamp);
		    			}
		    		}
		    		else {
		    			//if end of current is after the start of previous
			    		if (endStamp > startCur && startStamp < startCur) {
			    			userDict[userKeys[usernamei]][rangei]["start"] = new Date(endStamp);
			    			console.log("end>start");
			    			console.log(endTime);
			    		}
			    		//if start of current is less than end of previous
			    		if (startStamp < endCur && endStamp > endCur) {
			    			userDict[userKeys[usernamei]][rangei]["end"] = new Date(startStamp);
			    			console.log("start<end");
			    			console.log(startTime);
			    		}
		    		}
		    		

		    	}
            }
            if (userDict[user_name] === undefined) {
                userDict[user_name] = [details];
                // userRange[user_name] = [[details["start"], ]
            } else {
                userDict[user_name].push(details);
            }
        }

        console.log("dict:");
        console.log(userDict);
        console.log(response);
    }

    var userKeys = Object.keys(userDict);
    var newrep = {"data": [], "groups": []};
    var counter = 0;
    console.log(userDict);
    for (var usernamei = 0; usernamei < userKeys.length; usernamei++) {
    	newrep["groups"].push({"id":usernamei, "content":userKeys[usernamei]})
    	for (var rangei = 0; rangei < userDict[userKeys[usernamei]].length; rangei++){
    		console.log(rangei);
    		console.log(userKeys[usernamei]);
    		var curSet = userDict[userKeys[usernamei]][rangei];
    		newrep["data"].push({"id":counter, content:"", "start":String(curSet["start"]), "end":String(curSet["end"]), "group":usernamei, "className":((curSet["available"] == "true") ? "available":"busy")});
    		counter++;
    	}
    }
    console.log(newrep);
    res.send(newrep);
});

// start the server
app.listen(PORT);
console.log('Server started! At http://127.0.0.1:' + PORT);