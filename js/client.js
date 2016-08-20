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
    game_state: {
        // some higher level state, like whether the game loops is active or paused, etc.
        running: true
    },
    socket : null;
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

    renderer_init(game);

    anim_cb(16);
}

function anim_cb() {
    var elapsed_time = 16; // TODO

    // TODO consume inputs.

    client_game_tick(elapsed_time);

    renderer_tick(game, elapsed_time);

    if (game.game_state.running) {
        requestAnimationFrame(anim_cb);
    }
}

function client_game_tick(elapsed_time) {
    // console.log("client_game_tick");
}

function pause_game() {
    game.game_state.running = false;
}

function resume_game() {
    game.game_state.running = true;
    anim_cb(16);
}
