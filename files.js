var fs = require("fs");

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
}

class CDirectory {
	constructor(path = "/") {
		this.path = path;
	}
	reload() {

	}
	store() {

	}

}

module.exports = {
	CStream: CStream,
	CDirectory: CDirectory
}
