var game = {
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
    game_state: {
        // some higher level state, like whether the game loops is active or paused, etc.
        running: true
    },
    socket : null
};

function client_main() {

  game.socket = new WebSocket("ws://127.0.0.1:8080", "navco-protocol");

  game.socket.onopen = function (event) {
    console.log("connection oppened with the server")

    var nick = prompt("your nickname ?");
    game.socket.send(JSON.stringify({messageType:"clientConnection", nickname:nick}));

    var ready = prompt("ready ?");
    game.socket.send(JSON.stringify({messageType:"clientReady"}));

  };

  game.socket.onmessage = function (event) {
    console.log("rcvd" + event.data);
  }


  document.onkeydown = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    console.log("down"+ charStr);
  };
  document.onkeyup = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    console.log("up"+ charStr);
  };

    console.log("j'ai soif");

    rendererInit(game);

    animCb(16);
}

function animCb() {
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

function clientGameTick(elapsedTime) {
    // console.log("clientGameTick");

    // Flush all events;
    var events = game.events;
    game.events = [];

    // process them
    for (var i in events) {
        // TODO
        console.log(events[i]);
    }
}

function pauseGame() {
    game.running = false;
}

function resumeGame() {
    game.running = true;
    animCb(16);
}

function handleServerMessage(msg) {
    var objects = msg.objects;

    // We replace the current game state with the last one received from the server, but
    // we accumulate events.
    // All of that is handled later in clientGameTick
    game.info = msg.gameInfos;
    game.objects = msg.objects;
    game.events = game.events.concat(msg.events);
}
