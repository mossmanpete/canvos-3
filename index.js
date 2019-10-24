var net = require("net");

var server = net.createServer(function(socket) {
	socket.write("CanvOS 2.1 setup\r\n");
	socket.write("Use port ");

});

server.listen(3000, "10.166.165.192");
