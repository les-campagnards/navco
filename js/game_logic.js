var players = [];

var newPlayerConnected = function (connection, nickname){
  console.log("player added : " + nickname);
  // test if nickname is already in use. If so, affect another one
  while(players.filter(function(elem){ return elem.nickname === nickname; }).length != 0){
    nickname = nickname + "_";
  }

  var player = {
    connection : connection,
    nickname : nickname,
    state : "Waiting"};
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
        return;
      }
  }
};

var playerInput = function(aplayer, messageData){
  var player = players.find(function(elem){return elem.nickname === aplayer.nickname});
  player.keys = messageData.keys;
  player.cursor = messageData.cursor;
}


//tick, send state to each clients

var notifyState = function(){
  players.forEach(function(player){
      player.connection.send(JSON.stringify({messageType:"gameState", playersNicknames : players.map(function(elem){return elem.nickname} )}));
  });
}

setInterval(notifyState, 1000); // TODO : set to a much smaller delay

module.exports.newPlayerConnected = newPlayerConnected;
module.exports.playerDisconnected = playerDisconnected;
