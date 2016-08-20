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
    fakeServer: false
};

function clientMain() {

    var gameSocket = new WebSocket("ws://127.0.0.1:8080", "navco-protocol");

    gameSocket.onopen = function (event) {
        console.log("connection oppened with the server")

        var nick = prompt("your nickname ?");
        gameSocket.send(JSON.stringify({messageType:"clientConnection", nickname:nick}));
    };

    gameSocket.onmessage = function (event) {
        console.log("rcvd" + event.data);
    }

    gameSocket.onerror = function (event) {
        console.log("failed to connect to the server, defaulting to the fake server for debgging");
        game.fakeServer = true;
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