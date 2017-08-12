const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((request, response) => {
	console.log(request.method);
    if (request.method == "GET") {
    	console.log("In Get");
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end('Hello World\n');
    } else {
        var chrono = require('chrono-node');
        var res = chrono.parse('I am free today after 10:00');
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(res);
    }

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});