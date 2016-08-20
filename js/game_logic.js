var players = [];

var newPlayerConnected = function (connection, nickname){
  console.log("player added : " + nickname);
  //TODO : test if nickname is already in use. If so, affect another one
  while(players.filter(function(elem){

        return elem.nickname === nickname;

      }).length != 0){
    nickname = nickname + "_";
  }

  players.push({
    connection : connection,
    nickname : nickname,
    state : "Waiting"});
  console.log("[ " + players.length + " ] players connected, last : ", nickname);

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

module.exports.newPlayerConnected = newPlayerConnected;
module.exports.playerDisconnected = playerDisconnected;
