var express = require('express');
var bodyParser = require('body-parser');
var chrono = require('chrono-node');

var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())

var port = 9000;


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

        }

    }

});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);