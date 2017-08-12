const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const JSON_example = `cars": {"car1":"Ford","car2":"BMW","car3":"Fiat"}`


const server = http.createServer((request, response) => {
    console.log(request.method);
    if (request.method == "POST") {
        var body = "";
        request.on('data', function(chunk) {
            body += chunk;
        }).on('end', function() {
            console.log("HERE", body);
        });
        console.log(request.body)
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON_example);
    }

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});