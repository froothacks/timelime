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
        	console.log("Start", parse_results[j].start)
        	console.log("End", parse_results[j].end)

        }

    }

});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);