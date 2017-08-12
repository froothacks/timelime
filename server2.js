var express = require('express');
var bodyParser = require('body-parser');
var chrono = require('chrono-node');
var sentiment = require('sentiment')

var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())

var port = 9000;
var overrides = {
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
    console.log("\n");
    var data = req.body["messages"];
    var full_response = {"availability":[]}
    var response = {"availability":[]};
    var userDict = {};
    for (var i = 0; i < data.length; i++) {
        var parse_results = chrono.parse(data[i]["message"]);
        var user_name = data[i]["username"];
        // var temp_user_avalibility = [];
        for (var j = 0; j < parse_results.length; j++) {
            var d = parse_results[j].start.knownValues;
            var y = parse_results[j].start.impliedValues;
            var keys = Object.keys(parse_results[j].start.impliedValues);
            for (var ite = 0; ite < keys.length; ite++) {
                d[keys[ite]] = y[keys[ite]];
            }
            var startTime = new Date(d.year, d.month - 1, d.day, d.hour - 4, d.minute, d.second);
            if (parse_results[j].end != undefined) {
            	// console.log(parse_results[j].end);
                var d = parse_results[j].end.knownValues;
                var y = parse_results[j].end.impliedValues;
                var keys = Object.keys(parse_results[j].end.impliedValues);
                for (var ite = 0; ite < keys.length; ite++) {
                    d[keys[ite]] = y[keys[ite]];
                }
                var endTime = new Date(d.year, d.month - 1, d.day, d.hour - 4, d.minute, d.second);
            } 
            else 
            {
                var endTime = new Date(d.year, d.month - 1, d.day, d.hour - 4 + 1, d.minute, d.second);
            }
            // console.log("Start", startTime);
            // console.log("End", endTime);

            // temp_user_avalibility.push({"start":startTime, "end":endTime});
           
            
            var message_body = data[i]["message"];
            if (sentiment(message_body,overrides)["score"] < 0) {
            	var boolAvailable = "false";
                // console.log("negative");
            } else {
            	var boolAvailable = "true";
                // console.log("positive");
            }
            if (userDict[user_name] === undefined){
            	userDict[user_name] = [{"available":boolAvailable, "start":startTime, "end":endTime}];
            }
            else {
            	userDict[user_name].push({"available":boolAvailable, "start":startTime, "end":endTime});
            }
        }

        // response["username"] = user_name;
        // response["times"] = temp_user_avalibility;
        console.log("d");
        console.log(userDict);
        console.log(response);
        // full_response["availability"].push(response)
        // console.log(full_response);

    }
    var userKeys = Object.keys(userDict);
    for (var usernamei = 0; usernamei < userKeys.length; usernamei++){
    	response["availability"].push({"username":userKeys[usernamei], "times":userDict[userKeys[usernamei]]});
    }
    console.log(response);
    res.send(response);
});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);