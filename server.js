#!/usr/bin/env node

var fs = require('fs');
var net = require('net');
var http = require('http');
var https = require('https');
var path = require('path');

var key_name = 'key.pem';
var cert_name = 'cert.pem';

var host = process.env.GPROXY_HOST || 'localhost';
var port = process.env.GPROXY_PORT || 8080;
var https_port;

function connect_handler(request, socket, head) {
    var client = net.connect(https_port, function () {
        socket.write('HTTP/1.1 200 Connection established\r\n\r\n', function () {
            client.pipe(socket);
            socket.pipe(client);
        });
    });
    client.on('error', function () {});
}

function request_handler(request, response) {
    var url;
    if (request.url[0] === '/') {
        url = 'https://' + request.headers.host + request.url;
    } else {
        url = request.url;
    }

    console.log(request.method, url);

    var options = {
        'host': 'images-onepick-opensocial.googleusercontent.com',
        'method': request.method,
        'path': '/gadgets/proxy?container=onepick&url=' + encodeURIComponent(url)
    };

    var proxy_request = https.request(options, function (proxy_response) {
        delete proxy_response.headers['content-disposition'];
        response.writeHead(proxy_response.statusCode, proxy_response.headers);
        proxy_response.pipe(response);
    });

    request.pipe(proxy_request);
}

try {
    var key = fs.readFileSync(key_name);
    var cert = fs.readFileSync(cert_name);
} catch (err) {
    console.log('# falling back to the bundled certificate');
    process.chdir(__dirname);
    key = fs.readFileSync(key_name);
    cert = fs.readFileSync(cert_name);
}

var http_server = http.createServer();
var https_server = https.createServer({'key': key, 'cert': cert});

http_server.on('connect', connect_handler);
http_server.on('request', request_handler);
https_server.on('request', request_handler);

http_server.listen(port, host, function () {
    https_server.listen(0, 'localhost', function () {
        https_port = https_server.address().port;
        console.log('# listening on ' + host + ':' + port);
    });
});
