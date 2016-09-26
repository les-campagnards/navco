#!/usr/bin/env node

'use strict';

var express = require('express');
var WebSocketServer = require('ws').Server;

var gameLogic = require('./game_logic.js');

var server = express()	
	.use(express.static('./public'))
	.listen( process.env.PORT || 8080, function () {
		console.log('Gamer server up fort http!');
	});

var wsServer = new WebSocketServer({ server });


wsServer.on('connection', function (connection) {

	var player = null;

	console.log((new Date()) + ' Connection accepted.');

	connection.on('message', function (message) {

		var messageData = JSON.parse(message);
		if (messageData.messageType === 'clientConnection') {
			player = gameLogic.playerConnected(connection, messageData.nickname);
			connection.send(JSON.stringify({messageType: 'connectionAuthorized', nickname: player.nickname}));
		} else if (messageData.messageType === 'clientReady' && player) {
			gameLogic.playerReady(player);
		} else if (messageData.messageType === 'playerInput' && player) {
			gameLogic.playerInput(player, messageData);
		}
	});


	connection.on('close', function (reasonCode, description) {
		gameLogic.playerDisconnected(connection);
		console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
	});

	
});

