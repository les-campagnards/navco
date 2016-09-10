'use strict';

var game = {
    playerNickname : null,
    state : "notConnected",
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
    socket : null
};

function setUpServerConnection(){

  game.socket = new WebSocket("ws://127.0.0.1:8080", "navco-protocol");

  game.socket.onopen = function (event) {
    console.log("connection oppened with the server")

    // has to be at connection time for server might assign an alternative nickname
    promptForNickname(function(res){game.socket.send(JSON.stringify({messageType:"clientConnection", nickname:res.nick}))});


  };

  game.socket.onerror = function (event){
    game.fakeServer = true;
  }

  game.socket.onmessage = function (event) {


    console.log("rcvd" + event.data);
    var msg = JSON.parse(event.data);
    if(msg.messageType === "connectionAuthorized"){
      console.log("connected with nickname :" + msg.nickname);
      game.playerNickname = msg.nickname;
      game.state = "connected";
    }
    if(msg.messageType === "gameState"){
      handleServerMessage(msg);
    }
  }

}

function setUpInputCatching(){
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
}


function tryToStartGame(){
  console.log("trying to start game");
  if(game.state !== "connected"){
    setTimeout(tryToStartGame, 1000);
  }else{
    promptForReady(function(){game.socket.send(JSON.stringify({messageType:"clientReady"}));});
  }
}

function clientMain() {

  setUpServerConnection();

  //TODO : loop here for each game
  // Have to check ready after each game
  //let's poll on game.state to know if wee should ask the player if he is ready

  tryToStartGame();

  setUpInputCatching();

  rendererInit(game);

  animCb();
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
