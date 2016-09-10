'use strict';

//here goes all the functions that are meant to interact with the user
// and display stuff

function promptForNickname(callback){
  var nick = prompt("your nickname ?");
  callback({nick});
}

function promptForReady(callback){
  var ready = prompt("ready ?");
  callback({ready});
}
