var NodeHelper = require("node_helper");

const SERVER_PORT = 9000;

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: SERVER_PORT });


module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		console.log("*******Starting module: " + this.name);

    var self=this;

    console.log("Starting websocket server on port: " + SERVER_PORT);
    wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        //console.log('received: %s', message);
        console.log("Unparsed message: " + message);
        parsedMessage = JSON.parse(message);
        console.log("Parsed message: " + parsedMessage);
        self.sendSocketNotification(parsedMessage.messageType, parsedMessage.payload);

      });

      ws.send('something');
    });

    console.log("*******Started module: " + this.name);
	}
});
