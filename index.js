var net = require("net");
var SortedArray = require("sorted-array");

process.stdout.write("starting\n");

var ports = new SortedArray([]);
var servers = {};

var server = net.createServer(function (socket) {
  process.stdout.write("[Server] Established matchmaking connection\n");
	socket.write("CanvOS 2.1 booting up...\r\n");
	var port, i = 0;
	for (; i < 50000; i++) {
		if (i === 5000) socket.write("Searching for an available port...\r\n");
		port = Math.floor(Math.random()*40069) + 2000;
	  process.stdout.write("[Matchmaking] Trying port ");
		process.stdout.write(port.toString());
	  process.stdout.write(" (");
		process.stdout.write(i.toString());
	  process.stdout.write(")\n");
		if (ports.search(port) === -1) break;
	}
	if (i >= 49999) {
			process.stdout.write("[Matchmaking] Failed to locate port\n");
			socket.write("Server is full, Try again later\r\n");
			socket.destroy();
			process.stdout.write("[Matchmaking] Connection ended\n");
	} else {
		process.stdout.write("[Matchmaking] Using port ");
		process.stdout.write(port.toString());
		process.stdout.write("\n");
		socket.write("Connect to port ");
	  socket.write(port.toString());
		socket.write("\r\n");
		createServer(port);
		process.stdout.write("[Server] Starting OS server on port ");
		process.stdout.write(port.toString());
		process.stdout.write("\n");
		socket.destroy();
		process.stdout.write("[Matchmaking] Connection ended\n");
	}
});

server.listen(42069);


function createServer(port) {
	ports.insert(port);
	var serv = net.createServer(function (socket) {
	  process.stdout.write("[Server] Established OS connection on port ");
		process.stdout.write(port.toString());
		process.stdout.write("\n");
		socket.write("CanvOS 2.1 OS\r\n");
		socket.write("Type \"nc\" for verification: ");
		socket.on("data", (data) => {
			serv._readfunc(data.toString());
			serv._readfunc = (data) => {};
		});
		serv._readfunc = (data) => {
			socket.write("Recieved data\n");

		};
	});
	serv._readfunc = (data) => {};
	serv.listen(port);
  servers[port.toString()] = {server: serv, timeout: setTimeout(() => {
		serv.close(() => {
			ports.remove(port);
			servers[port.toString()] = undefined;
		});
		process.stdout.write("[Server] OS server on port ");
		process.stdout.write(port.toString());
		process.stdout.write(" expired\n");
	}, 10000)};
}
