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
    "can't":-2 ,
    "can": 2,
    "unavailable": -2,
    "available": 2,
    "free":2,
    "not":-2,
    "out of office":-2
}

app.post('/post/data', function(req, res) {
    console.log('receiving data...');
    console.log('body is ', req.body);
    console.log("\n")
    var data = req.body["messages"];
    for (var i = 0; i < data.length; i++) {
        var parse_results = chrono.parse(data[i]["message"]);
        for (var j = 0; j < parse_results.length; j++) {        	
        	var d = res[j].start.knownValues;
        	var y = res[j].start.impliedValues;
        	var keys = Object.keys(res[j].start.impliedValues);
        	for (var ite = 0; ite < keys.length; ite++){
        		d[keys[ite]] = y[keys[ite]];
        	}
        	// d.push(res[j].start.impliedValues);
        	// var y = res[j].start.impliedValues;
        	var startTime = new Date(d.year,  d.month, d.day, d.hour, d.minute, d.second);
        	if (parse_results[j].end != undefined){
        		var d = res[j].end.knownValues;
        		var y = res[j].end.impliedValues;
	        	var keys = Object.keys(res[j].end.impliedValues);
	        	for (var ite = 0; ite < keys.length; ite++){
	        		d[keys[ite]] = y[keys[ite]];
	        	}
        		var endTime = new Date(d.year, d.month, d.day, d.hour, d.minute, d.second);
        	}
        	else {
        		var endTime = new Date(d.year, d.month, d.day, d.hour + 1, d.minute, d.second);
        	}


        	console.log("Start", startTime);
        	console.log("End", endTime);

        var message_body = data[i]["message"];
        if (sentiment(message_body,overrides)<0){
        	console.log("negative");
        }
        else{
        	console.log("positive");
        }
        var parse_results = chrono.parse(message_body);
        for (var j = 0; j < parse_results.length; j++) {
            console.log("Start", parse_results[j].start)
            console.log("End", parse_results[j].end)
            // console.log("Start", parse_results[j].start)
            // console.log("End", parse_results[j].end)
            console.log(parse_results[j].start["impliedValues"].push(parse_results[j].start["knownValues"]));
        }
    }
};

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);