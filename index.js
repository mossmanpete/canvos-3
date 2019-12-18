var net = require("net");
var Stream = require("./stream.js");
var Perms = require("./perms.js");

process.stdout.write("starting\n");

var ports = new Set([]);
var servers = {};

var server = net.createServer(async function (socket) {
  process.stdout.write("[Server] Established matchmaking connection\n");
	socket.write("CanvOS3 booting up...");
	var port, i = 0;
	for (; i < 100000; i++) {
		if (i === 10000) socket.write("\nSearching for an available port");
		else if (i > 10000 & i % 10000 === 0) socket.write(".");
		if (i % 1000 === 0) await pause(0);
		port = Math.floor(Math.random()*40000) + 2069;
	  process.stdout.write("[Matchmaking] Trying port ");
		process.stdout.write(port.toString());
	  process.stdout.write(" (");
		process.stdout.write((100000-i).toString());
	  process.stdout.write(")\n");
		if (!ports.has(port)) break;
	}
	if (i >= 99999) {
		process.stdout.write("[Matchmaking] Failed to locate port\n");
		socket.write("\nServer is full, Try again later\n");
		socket.destroy();
		process.stdout.write("[Matchmaking] Connection ended\n");
	} else {
		process.stdout.write("[Matchmaking] Using port ");
		process.stdout.write(port.toString());
		process.stdout.write("\n");
		socket.write("\nConnect to port ");
		socket.write(port.toString());
		socket.write("\n");
		createServer(port);
		process.stdout.write("[Server] Starting OS server on port ");
		process.stdout.write(port.toString());
		process.stdout.write("\n");
		socket.destroy();
		process.stdout.write("[Matchmaking] Connection ended\n");
	}
});

server.listen(42069);
process.stdout.write("[Server] CanvOS3 is now ready for requests\n");


function pause(m){return new Promise(h=>setTimeout(h,m))}

function createServer(port) {
	ports.add(port);
	var serv = net.createServer(async function (socket) {;
		socket.on("data", (data) => {
			serv.stdin.puts(data);
		});
		process.stdout.write("[Server] Established OS connection on port ");
		process.stdout.write(port.toString());
		process.stdout.write("\n");
		socket.write("CanvOS3\n");
		socket.write("Type \"nc\" for verification: ");
		var data = await serv.stdin.gets();
		socket.write("Recieved data\n");

	});
	serv.stdin = new Stream.CStream();
	serv.listen(port);
	servers[port.toString()] = {server: serv, timeout: setTimeout(() => {
		serv.close(() => {
			ports.delete(port);
			servers[port.toString()] = undefined;
		});
		process.stdout.write("[Server] OS server on port ");
		process.stdout.write(port.toString());
		process.stdout.write(" expired\n");
	}, 10000)};
}
