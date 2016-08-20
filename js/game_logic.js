var players = [];

var gamestatus = {
  gameStartTimestamp : null,
  status : "pending",
  gameLoopTimerId : null,
}

var rules = {
  gameMode : "time", //stocks
  gameDuration : 10000,
  maxStocks : 5,
  minPlayersForGame : 2
}

var playerConnected = function (connection, nickname){
  console.log("player added : " + nickname);
  // test if nickname is already in use. If so, affect another one
  while(players.filter(function(elem){ return elem.nickname === nickname; }).length != 0){
    nickname = nickname + "_";
  }

  var player = {
    connection : connection,
    nickname : nickname,
    status : "waiting"};
  players.push(player);
  console.log("[ " + players.length + " ] players connected, last : ", nickname);

  return player;

};

var playerDisconnected = function(connection){
  for (var index = 0; index < players.length; index++) {
      if (players[index].connection === connection) {

        console.log("player removed : " + players[index].nickname);
        // Remove array item at current index
        players.splice(index, 1);
        console.log("[ " + players.length + " ] players connected");

      }
  }

  //test if there are enough players left in the game
  if(players.length < rules.minPlayersForGame && gamestatus.status === "running"){
    stopGame();
  }

};

var playerInput = function(aplayer, messageData){
  var player = players.find(function(elem){return elem.nickname === aplayer.nickname});
  player.keys = messageData.keys;
  player.cursor = messageData.cursor;
}



var notifystatus = function(){
  var remainingTime = rules.gameDuration - ( Date.now() - gamestatus.gameStartTimestamp );
  if(remainingTime > 0){
    players.filter(function(elem){elem.status === "playing"}).forEach(function(player){
      player.connection.send(JSON.stringify({
        messageType:"gamestatus",
        gameInfos: {
            status: "running",
            remaningTime: remainingTime, //in ms
            remaningPoints: 3 //?????
        },
        playersNicknames : players.map(function(elem){
            return elem.nickname} )
      }));
    });
  }else{
    //TODO notify game has endded
    stopGame();
  }
}

var playerReady = function(player){
  players.find(function(elem){
    return elem.nickname === player.nickname
  } ).status = "ready";
  console.log(players);
}


var initGame = function(){
  gamestatus.gameStartTimestamp = Date.now();
  gamestatus.status = "running";
  gamestatus.gameLoopTimerId =  setInterval(notifystatus, 1000); // TODO : set to a much smaller delay

  //change status of each waiting players
  players.forEach(function(elem){elem.status = "playing"});

  console.log("game started at ", gamestatus.gameStartTimestamp);

}

var tryStartingGame = function(){
  //if condition to start a game are met :
  //test if there are enough players to start the game
  if(players.filter(function(elem){return elem.status==="ready"}).length >= rules.minPlayersForGame && gamestatus.status === "pending"){
    initGame();
  }else{
    console.log("Not enough players ready yet. : " + players.filter(function(elem){return elem.status==="ready"}).length);
    setTimeout(tryStartingGame,10000); //try again in 30 seconds

  }
}

var stopGame = function(){
  //stop interval
  clearInterval(gamestatus.gameLoopTimerId);
  gamestatus = {
    gameStartTimestamp : null,
    status : "pending",
    gameLoopTimerId : null
  };
  //place  each player as waiting
  players.forEach(function(elem){elem.status = "waiting"});

  setTimeout(tryStartingGame,30000);

  console.log("game stopped at ", Date.now());
}

tryStartingGame();
module.exports.playerReady = playerReady;
module.exports.playerInput = playerInput;
module.exports.playerConnected = playerConnected;
module.exports.playerDisconnected = playerDisconnected;
