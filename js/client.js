/*global
	WebSocket
*/

'use strict';

var game = {
	playerNickname: null,
	state: 'notConnected',
	renderer: {},
	inputs: {
		sendToServer : false,
		keyboardInputState : {
			left: 'up',
			top: 'up',
			right: 'up',
			down: 'up'
		},
		mouseInputState : null //null until we acquier the first move event.
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
	game.socket = new WebSocket(location.origin.replace(/^http/, 'ws'));

	game.socket.onopen = function (event) {
		console.log('connection oppened with the server');

		// has to be at connection time for server might assign an alternative nickname
		promptForNickname(function (res) {
			game.socket.send(JSON.stringify({messageType: 'clientConnection', nickname: res.nick}));
			console.log(res.nick);
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
			game.inputs.sendToServer = true;
			rendererInit(game);
			animCb();
		}
		if (msg.messageType === 'gameEnded') {
			game.state = 'connected';
			game.inputs.sendToServer = false;
			//TODO : clean up display
			tryToStartGame();
		}
		if (msg.messageType === 'gameState') {
			handleServerMessage(msg);
		}
	};
}


function prepareInputMessage (evt, upOrDown) {
	evt = evt || window.event;
	var charCode = evt.keyCode || evt.which;
	var key = null;
	var inputState = game.inputs.keyboardInputState;
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



function handleMouseMove(event) {
    var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    game.inputs.mouseInputState = {
        x: event.pageX,
        y: event.pageY
    };
}
function getMousePosition() {
	if(game.inputs.sendToServer) {
    var pos = game.inputs.mouseInputState;
    if (!pos) {
        // We haven't seen any movement yet
    }
    else {
       
       		game.socket.send(JSON.stringify({messageType: 'playerInput', mousePosition:pos}));
       //send regular update about mouse position to server
       //TODO : transform mouse position in pixels to something in worldspace.
    }
  }

}

function setUpInputCatching() {

	document.onmousemove = handleMouseMove;
	setInterval(getMousePosition, 100); // setInterval repeats every X ms


	document.onkeydown = function (evt) {
		if(game.inputs.sendToServer) {
			var msg = prepareInputMessage(evt, 'down');
			if (msg) {
				
					game.socket.send(JSON.stringify(msg));
			}
		}
	};
	document.onkeyup = function (evt) {
		if(game.inputs.sendToServer){
			var msg = prepareInputMessage(evt, 'up');
			if (msg) {
				 
					game.socket.send(JSON.stringify(msg));
			}
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

function handleServerMessage (msg) {
	// var objects = msg.objects;

	// We replace the current game state with the last one received from the server, but
	// we accumulate events.
	// All of that is handled later in clientGameTick
	game.info = msg.gameInfos;
	game.objects = msg.objects;
	game.events = game.events.concat(msg.events);


}
