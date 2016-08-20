#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');

var gameLogic = require('./game_logic.js');

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



wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('navco-protocol', request.origin);
    var player = null;


    console.log((new Date()) + ' Connection accepted.');




      connection.on('message', function(message) {
          if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
          var messageData = JSON.parse(message.utf8Data);
          if (messageData.messageType === "clientConnection"){
              player = gameLogic.playerConnected(connection, messageData.nickname);
              connection.send(JSON.stringify({messageType:"connectionAuthorized", nickname:player.nickname}));
          }
          else if (messageData.messageType === "playerInput"){
              gameLogic.playerInput(player, messageData);
          }
          else if (messageData.messageType === "clientReady"){
              gameLogic.playerReady(player);
          }
        }
    });
    connection.on('close', function(reasonCode, description) {
        gameLogic.playerDisconnected(connection);
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
