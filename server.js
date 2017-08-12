const express = require('express');
const bodyParser = require('body-parser');
const chrono = require('chrono-node');
const sentiment = require('sentiment');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())

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
    console.log(JSON.stringify(req.body));
    var bod = req.body;
    var data = {"messages":[]};
    var dataKeys = Object.keys(bod);

    var results = (dataKeys.length-2)/2;
    console.log(results);
    for (var i = 0; i <= results; i += 1) {
    	console.log(i);
    	console.log(data);
    	var temp = {"username":bod["messages[" + i + "][username]"], "message": bod["messages[" + i + "][message]"]};
    	data["messages"].push(temp);
    	console.log(data);
    }
    console.log(data);
    // "messages[0]['username']"
    console.log(req.body["messages"]);
    var response = {"availability":[]};
    var userDict = {};
    var data = data["messages"];
    for (var i = 0; i < data.length; i++) {
        var parse_results = chrono.parse(data[i]["message"]);
        var user_name = data[i]["username"];
        for (var j = 0; j < parse_results.length; j++) {
            var date_dictionary = parse_results[j].start.knownValues;
            var date_dictionary_i = parse_results[j].start.impliedValues;
            var keys = Object.keys(parse_results[j].start.impliedValues);
            for (var ite = 0; ite < keys.length; ite++) {
                date_dictionary[keys[ite]] = date_dictionary_i[keys[ite]];
            }
            var startTime = new Date(date_dictionary.year, date_dictionary.month - 1, date_dictionary.day, date_dictionary.hour - 4, date_dictionary.minute, date_dictionary.second);
            var endTime;
            if (parse_results[j].end != undefined) {
                var d = parse_results[j].end.knownValues;
                var y = parse_results[j].end.impliedValues;
                var _keys = Object.keys(parse_results[j].end.impliedValues);
                for (var iter = 0; iter < _keys.length; iter++) {
                    d[_keys[iter]] = y[_keys[iter]];
                }
                endTime = new Date(d.year, d.month - 1, d.day, d.hour - 4, d.minute, d.second);
            } 
            else {
                endTime = new Date(date_dictionary.year, date_dictionary.month - 1, date_dictionary.day, date_dictionary.hour - 4 + 1, date_dictionary.minute, date_dictionary.second);
            }

            var boolAvailable;
            var message_body = data[i]["message"];
            if (sentiment(message_body, OVERRIDES)["score"] < 0) {
            	boolAvailable = "false";
            }
            else {
            	 boolAvailable = "true";
            }
            if (userDict[user_name] === undefined) {
            	userDict[user_name] = [{"available":boolAvailable, "start":startTime, "end":endTime}];
            }
            else {
            	userDict[user_name].push({"available":boolAvailable, "start":startTime, "end":endTime});
            }
        }

        console.log("d");
        console.log(userDict);
        console.log(response);

    }
    var userKeys = Object.keys(userDict);
    for (var usernamei = 0; usernamei < userKeys.length; usernamei++) {
    	response["availability"].push({"username":userKeys[usernamei], "times":userDict[userKeys[usernamei]]});
    }
    console.log(response);
    for (var i = 0; i < response.length; i++){
    	console.log(response[i]["times"]);
    }
    res.send(response);
});

// start the server
app.listen(PORT);
console.log('Server started! At http://127.0.0.1:' + PORT);