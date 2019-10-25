var net = require("net");
var SortedArray = require("sorted-array");

process.stdout.write("starting\n");

var ports = new SortedArray([]);

var server = net.createServer(function(socket) {
  process.stdout.write("[Server] Established matchmaking connection\n");
	socket.write("CanvOS 2.1 setup\r\n");
	socket.write("Use port ");
	var port;
	while(1) {
		port = Math.floor(Math.random()*40069) + 2000;
	  process.stdout.write("[Matchmaking] Trying port ");
		process.stdout.write(port.toString());
	  process.stdout.write("\n");
		if (ports.search(port) === -1) break;
	}
  socket.write(port.toString());
	process.stdout.write("[Matchmaking] Using port ");
	process.stdout.write(port.toString());
	process.stdout.write("\n");
	socket.write("\r\n");
	socket.destroy();
	process.stdout.write("[Matchmaking] Connection ended\n");
});

server.listen(42069);
