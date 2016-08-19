function client_main() {
  var gameSocket = new WebSocket("ws://127.0.0.1:8080", "navco-protocol");

  gameSocket.onopen = function (event) {
    console.log("connection oppened with the server")



    setInterval(function(){
        gameSocket.send(JSON.stringify(document));
      },1000);
  };

  gameSocket.onmessage = function (event) {
    console.log("rcvd" + event.data);
  }

}
