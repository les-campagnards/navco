var players = [];

var gamestatus = {
	gameStartTimestamp: null,
	status: 'pending',
	gameLoopTimerId: null
};

var rules = {
	gameMode: 'time', // stocks
	gameDuration: 10000,
	maxStocks: 5,
	minPlayersForGame: 2,
	tickDelai: 16
};

var playerConnected = function (connection, nickname) {
	console.log('player added: ' + nickname);
	// test if nickname is already in use. If so, affect another one
	while (players.filter(function (elem) {
		return elem.nickname === nickname;
	}).length !== 0) {
		nickname = nickname + '_';
	}

	var player = {
		connection: connection,
		nickname: nickname,
		status: 'waiting',
		keys: {
			left: 'up',
			top: 'up',
			right: 'up',
			down: 'up'
		},
		mousePosition : [0,0]
	};

	players.push(player);
	console.log('[ ' + players.length + ' ] players connected, last: ', nickname);

	return player;
};

var playerDisconnected = function (connection) {
	for (var index = 0; index < players.length; index++) {
		if (players[index].connection === connection) {
			console.log('player removed: ' + players[index].nickname);
			// Remove array item at current index
			players.splice(index, 1);
			console.log('[ ' + players.length + ' ] players connected');
		}
	}

	// test if there are enough players left in the game
	if (players.length < rules.minPlayersForGame && gamestatus.status === 'running') {
		stopGame();
	}
};

var playerInput = function (player, messageData) {
	if(messageData.upOrDown)
		player.keys[messageData.key] = messageData.upOrDown;
	if(messageData.mousePosition)
		player.mousePosition = messageData.mousePosition;
};

var notifystatus = function () {
	var remainingTime = rules.gameDuration - (Date.now() - gamestatus.gameStartTimestamp);
	if (remainingTime > 0) {
		players.filter(function (elem) {
			elem.status === 'playing';
		}).forEach(function (player) {
			player.connection.send(JSON.stringify({
				messageType: 'gamestatus',
				gameInfos: {
					status: 'running',
					remaningTime: remainingTime, // in ms
					remaningPoints: 3 // ?????
				},
				playersNicknames: players.map(function (elem) {
					return elem.nickname;
				})
			}));
		});
	} else {
		// TODO notify game has endded
		stopGame();
	}
};

var playerReady = function (player) {
	player.status = 'ready';
};

var meh = 0;
// var positions = [400, 300];

function fakeMessage (elapsedTime) {
	var t = meh * 0.01;
	var msg = {
		'messageType': 'gameState',
		'gameInfos':
		{
			'status': 'playing',
			'remaningTime': 600,
			'remaningPoints': 3
		},
		'objects': {
			'nical': {
				'type': 'player1',
				'position': players[0].position,
				'rotation': players[0].mousePosition.x / 360,
				'speed': [5, 7],
				'acceleration': [1, 0],
				'radius': 5,
				'handicap': 54
			},
			'Gruck': {
				'type': 'player2',
				'position': players[1].position,
				'rotation': players[1].mousePosition.x / 360,
				'speed': [2, 0],
				'acceleration': [0, 3],
				'radius': 2
			}
		},
		'events': [
		]
	};
	if (meh++ % 100 === 0) {
		msg.events.push({
			'id': 'NicalPrendCher',
			'type': 'death',
			'position': [120, 426],
			'duration': 2
		});
	}

	return msg;
}

var gameTick = function () {
	console.log('tick');
	notifystatus();

	// TODO consume input to reresh players positions

	players.filter(function (elem) {
		return elem.status === 'playing';
	}).forEach(function (player) {
		// TODO: use inputs to alter acceleration and speed instead of position
		player.position[0] += player.keys['top'] === 'down' ? 1 : 0;
		player.position[0] -= player.keys['down'] === 'down' ? 1 : 0;
		player.position[1] += player.keys['left'] === 'down' ? 1 : 0;
		player.position[1] -= player.keys['right'] === 'down' ? 1 : 0;

		player.connection.send(JSON.stringify(fakeMessage(Date.now() - gamestatus.gameStartTimestamp)));
		console.log('sent data to player: ' + player.nickname);
	});
};

var initGame = function () {
	gamestatus.gameStartTimestamp = Date.now();
	gamestatus.status = 'running';

	// change status of each waiting players
	// TODO: filter only on waiting players
	players.forEach(function (elem) {
		elem.status = 'playing';
		elem.position = [400, 300]; // TODO: have better spawn points
		elem.connection.send(JSON.stringify({messageType: 'gameStarted'}));
	});

	gamestatus.gameLoopTimerId = setInterval(gameTick, rules.tickDelai);
	console.log('game started at ', gamestatus.gameStartTimestamp);
};

var tryStartingGame = function () {
	// if condition to start a game are met :
	// test if there are enough players to start the game
	if (players.filter(function (elem) {
		return elem.status === 'ready';
	}).length >= rules.minPlayersForGame && gamestatus.status === 'pending') {
		initGame();
	} else {
		console.log('Not enough players ready yet.: ' + players.filter(function (elem) {
			return elem.status === 'ready';
		}).length);
		setTimeout(tryStartingGame, 10000); // try again in 30 seconds
	}
};

var stopGame = function () {
	// stop interval
	clearInterval(gamestatus.gameLoopTimerId);
	gamestatus = {
		gameStartTimestamp: null,
		status: 'pending',
		gameLoopTimerId: null
	};

	// place  each player as waiting
	players.forEach(function (elem) {
		elem.status = 'waiting';
		elem.connection.send(JSON.stringify({messageType: 'gameEnded'}));
	});

	setTimeout(tryStartingGame, 30000);

	console.log('game stopped at ', Date.now());
};

tryStartingGame();
module.exports.playerReady = playerReady;
module.exports.playerInput = playerInput;
module.exports.playerConnected = playerConnected;
module.exports.playerDisconnected = playerDisconnected;
