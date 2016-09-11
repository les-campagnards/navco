/*global
	location
	WebSocket
*/

'use strict';

var game = {
	playerNickname: null,
	state: 'notConnected',
	renderer: {},
	inputs: {
			// TODO: figure out how inputs show work, I guess we should accumulate inputs from the
			// network into a list and for each frame the game logic will consume the list and react
			// to the inputs or something.
	},
	actors: {
			// dynamic game objects
	},
	level: {
			// static level data
	},
	events: [],
	// some higher level state, like whether the game loops is active or paused, etc.
	running: true,
	logging: true,
	fakeServer: false,
	socket: null
};

function setUpServerConnection () {
	console.log(location.href.split('/'));
	game.socket = new WebSocket('ws://' + location.href.split('/')[2].split(':')[0] + ':8080', 'navco-protocol');

	game.socket.onopen = function (event) {
		console.log('connection oppened with the server');

		// has to be at connection time for server might assign an alternative nickname
		promptForNickname(function (res) {
			game.socket.send(JSON.stringify({messageType: 'clientConnection', nickname: res.nick}));
		});
	};

	game.socket.onerror = function (event) {
		game.fakeServer = true;
	};

	game.socket.onmessage = function (event) {
		console.log('rcvd' + event.data);
		var msg = JSON.parse(event.data);
		if (msg.messageType === 'connectionAuthorized') {
			console.log('connected with nickname :' + msg.nickname);
			game.playerNickname = msg.nickname;
			game.state = 'connected';
		}
		if (msg.messageType === 'gameStarted') {
			game.state = 'playing';
		}
		if (msg.messageType === 'gameEnded') {
			game.state = 'connected';
			tryToStartGame();
		}
		if (msg.messageType === 'gameState') {
			handleServerMessage(msg);
		}
	};
}

var inputState = {
	left: 'up',
	top: 'up',
	right: 'up',
	down: 'up'
};

function prepareInputMessage (evt, upOrDown) {
	evt = evt || window.event;
	var charCode = evt.keyCode || evt.which;
	var key = null;
	// TODO : add querty and azerty usuel input key support
	switch (charCode) {
	case 37:
		if (inputState['left'] !== upOrDown) {
			key = 'left';
			inputState['left'] = upOrDown;
			break;
		} else {
			return null;
		}
	case 38 :
		if (inputState['top'] !== upOrDown) {
			key = 'top';
			inputState['top'] = upOrDown;
			break;
		} else {
			return null;
		}
	case 39 :
		if (inputState['right'] !== upOrDown) {
			key = 'right';
			inputState['right'] = upOrDown;
			break;
		} else {
			return null;
		}
	case 40 :
		if (inputState['down'] !== upOrDown) {
			key = 'down';
			inputState['down'] = upOrDown;
			break;
		} else {
			return null;
		}
	}
	if (key) {
		return {messageType: 'playerInput', upOrDown, key};
	}
}

function setUpInputCatching () {
	document.onkeydown = function (evt) {
		var msg = prepareInputMessage(evt, 'down');
		if (msg) {
			game.socket.send(JSON.stringify(msg));

			console.log('inputMessageSent' + JSON.stringify(msg));
		}
	};
	document.onkeyup = function (evt) {
		var msg = prepareInputMessage(evt, 'up');
		if (msg) {
			game.socket.send(JSON.stringify(msg));
			console.log('inputMessageSent' + JSON.stringify(msg));
		}
	};
}

function tryToStartGame () {
	console.log('trying to start game');
	if (game.state !== 'connected') {
		setTimeout(tryToStartGame, 1000);
	} else {
		promptForReady(function () {
			game.socket.send(JSON.stringify({messageType: 'clientReady'}));
		});
	}
}

function clientMain () {
	setUpServerConnection();

	// TODO : loop here for each game
	// Have to check ready after each game
	// let's poll on game.state to know if wee should ask the player if he is ready

	tryToStartGame();

	setUpInputCatching();

	rendererInit(game);

	animCb();
}

function animCb () {
	var elapsedTime = 16; // TODO

	// TODO consume inputs.
	if (game.fakeServer) {
		fakeServerTick(elapsedTime);
	}
	clientGameTick(elapsedTime);
	rendererTick(game, elapsedTime);
	if (game.running) {
		requestAnimationFrame(animCb);
	}
}

function clientGameTick (elapsedTime) {
	// console.log('clientGameTick');
	// Flush all events;
	var events = game.events;
	game.events = [];
	// process them
	for (var i in events) {
		// TODO
		console.log(events[i]);
	}
}

function pauseGame () {
	game.running = false;
}

function resumeGame () {
	game.running = true;
	animCb(16);
}

function handleServerMessage (msg) {
	// var objects = msg.objects;

	// We replace the current game state with the last one received from the server, but
	// we accumulate events.
	// All of that is handled later in clientGameTick
	game.info = msg.gameInfos;
	game.objects = msg.objects;
	game.events = game.events.concat(msg.events);
}
