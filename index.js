var net = require("net")
var Stream = require("./stream.js")
var crypto = require("./crypto.js")
var files = require("./files.js")
var https = require("https")

process.stdout.write("starting\n")

var ports = new Set([])
var servers = {}

var server = net.createServer(async function (socket) {
	process.stdout.write("[Server] Established matchmaking connection\n")
	socket.write("CanvOS3 booting up...")
	var port, i = 0
	for (; i < 100000; i++) {
		if (i === 10000) socket.write("\nSearching for an available port")
		else if (i > 10000 & i % 10000 === 0) socket.write(".")
		if (i % 1000 === 0) await pause(0)
		port = Math.floor(Math.random()*5) + 2069
		process.stdout.write("[Matchmaking] Trying port ")
		process.stdout.write(port.toString())
		process.stdout.write(" (")
		process.stdout.write(i.toString())
		process.stdout.write(")\n")
		if (!ports.has(port)) break
	}
	if (i >= 99999) {
		process.stdout.write("[Matchmaking] Failed to locate port\n")
		socket.write("\nServer is full, Try again later\n")
		socket.destroy()
		process.stdout.write("[Matchmaking] Connection ended\n")
	} else {
		process.stdout.write("[Matchmaking] Using port ")
		process.stdout.write(port.toString())
		process.stdout.write("\n")
		socket.write("\nConnect to port ")
		socket.write(port.toString())
		socket.write("\n")
		createServer(port)
		process.stdout.write("[Server] Starting OS server on port ")
		process.stdout.write(port.toString())
		process.stdout.write("\n")
		socket.destroy()
		process.stdout.write("[Matchmaking] Connection ended\n")
	}
})

server.listen(42069)
process.stdout.write("[Server] CanvOS3 is now ready for requests\n")


var pause=m=>new Promise(h=>setTimeout(h,m))

function getBytes() {
	return new Promise(yey => {
		https.get("https://www.random.org/cgi-bin/randbyte?nbytes=8&format=h", (res) => {
			var buf = ""
			res.on('data', (d) => {
				buf += d
			})
			res.on('end', () => {
				return buf.split(" ").join("").split("\n").join("").split("\r").join("")
			})
		}).on('error', (e) => {
			throw e
		})
	})
}

function createServer(port) {
	ports.add(port)
	var serv = net.createServer(async function (socket) {
		socket.on("data", (data) => {
			serv.stdin.puts(data)
		}) 
		serv.socket = socket
		process.stdout.write("[Server] Established OS connection on port ")
		process.stdout.write(port.toString())
		process.stdout.write("\n")
		serv.write("CanvOS3\n")
		serv.write("Type \"nc\" for verification: ")
		var user_terminal = await serv.stdin.gets()
		serv.write("Recieved verification\n")
		var bytes = ""
		var data = ""
		while (data !== bytes) {
			serv.write("username: ")
			var username = await serv.read();
			var p = files.getUserPasswd(username)
			if (!p) throw new Error("Invalid Username")
			bytes = await getBytes()
			serv.write("verification: ")
			serv.write(crypto.aes.encrypt(bytes, p))
			p = null;
			data = crypto.aes.decrypt(await serv.read(), p).split("").reverse().join("")
		}
		serv.write("password: \\p1")
		var password = crypto.sha512(crypto.aes.decrypt(await serv.read(), p))
		serv.write("\\p0Please wait...\n")
		if (password === files.getUserPasswd(username)) {
			serv.write("Password correct!")
		} else {
			serv.write("Somehow your password doesnt match after password verification.\n")
			serv.write("This could mean a few things:\n")
			serv.write("1. an internal error has occurred, such as a hash collision or like gamma radiation or something i have no idea.\n")
			serv.write("2. you are using a hacked / 3rd party client and you only have the hash, not the password (if this is the case please don't)\n")
			serv.write("3. i have no idea this error isn't supposed to happen that's why it's called an error\n")
			serv.write("The connection will now stop, please contact your server's CanvOS manager if problems persist\n")
			return;
		}

	})
	serv.write = (data) => {
		if (serv.key === null) serv.socket.write(data);
		else serv.socket.write(crypto.aes.encrypt(data, serv.key))
	}
	serv.read = async function() {
		if (serv.key === null) return (await serv.stdin.gets()).slice(0, -1)
		else return crypto.aes.decrypt((await serv.stdin.gets()).slice(0, -1), serv.key)
	}
	serv.key = null;
	serv.stdin = new Stream.CStream()
	serv.listen(port)
	servers[port.toString()] = {server: serv, timeout: setTimeout(() => {
		serv.close(() => {
			ports.delete(port)
			servers[port.toString()] = undefined
		})
		process.stdout.write("[Server] OS server on port ")
		process.stdout.write(port.toString())
		process.stdout.write(" expired\n")
	}, 10000)}
}
