#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

var players = [];

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('navco-protocol', request.origin);

    players.push({
      connection : connection,
      nickname : null,
      state : "ValidationPending"});


    console.log((new Date()) + ' Connection accepted.');

    //ask for username
    //test if username is unique in the list
    //if ok change state to "waiting"

    //TODO : move this to a gameplay.js



    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
    });
    connection.on('close', function(reasonCode, description) {
        for (var index = 0; index < players.length; index++) {
            if (players[index] === connection) {
              // Remove array item at current index
              players.splice(index, 1);

              index--;
            }
        }
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');

    });
});
