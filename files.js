var fs = require("fs");
var path = require("path");

function pause() {return new Promise(yey => setTimeout(yey, 0))}

class CStream {
	constructor(data = "") {
		this.buffer = data;
		this.readfunc = () => {};
	}
	puts(data = "") {
			this.buffer += data;
			this.readfunc();
			this.readfunc = () => {};
	}
	getc(wait = true) {
		return new Promise(yey => {
			if (wait && this.buffer.length === 0) {
				// wait for data
				this.readfunc = () => {
					var char = this.buffer[0];
					this.buffer = this.buffer.slice(1, this.buffer.length);
					yey(char);
				}
			} else {
				// return char
				var char = this.buffer[0];
				this.buffer = this.buffer.slice(1, this.buffer.length);
				yey(char);
			}
		});
	}
	async gets(wait = true, terminator = "\n") {
		var buf = "";
		while (1) {
			var char = await this.getc(wait);
			buf += char;
			if (!wait && char === "") return buf;
			if (char === terminator) return buf;
			await pause();
		}
	}
	CType() {
		return "CStream";
	}
}

class CDirectory {
	constructor(loc: "/", root = null) {
		this.loc = loc;
		this.root = null;
	}
	load() {
		if (root !== null) throw new Error("unable to load / store from non-root!");
	}
	store() {
		if (root !== null) throw new Error("unable to load / store from non-root!");
	}
	seek(loc: ".") {
		if (!path.isAbsolute(loc)) loc = path.join(this.loc, loc).normalize();
		var src = root;
		if (src === null) src = this;
	}
	CType() {
		return "CDirectory";
	}
}

module.exports = {
	CStream: CStream,
	CDirectory: CDirectory,
}

async function deepLoad() {

}
