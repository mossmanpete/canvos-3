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
	putc(char) {
		puts(String.fromCharCode(char));
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
	FileType() {
		return "stream";
	}
}

class CDirectory {
	constructor(loc = "/", root = null, contents = []) {
		this.loc = loc;
		this.root = root;
		this.contents = contents;
	}
	async load() {
		if (root !== null) throw new Error("unable to load / store from non-root!");
		this.contents = await deepLoad();
	}
	async store() {
		if (root !== null) throw new Error("unable to load / store from non-root!");
		await deepStore(this.contents)
	}
	CType() {
		return "CDirectory";
	}
	FileType() {
		return "dir";
	}
}

class CLink {
	constructor() {

	}
	CType() {
		return "CLink";
	}
	FileType() {
		return "link";
	}
}

class CFile {
	constructor() {

	}
	CType() {
		return "CFile";
	}
	FileType() {
		return "file";
	}
}

class CPerms {
	constructor() {

	}
	CType() {
		return "CPerms";
	}
}

class CObj {
	constructor(object, name, path, perms = "+all+") {
		this.object = object;
		this.name = name;
		this.type = object.FileType();
	}
	CType() {
		return "CObj";
	}
}

class FD {

}

class FStream extends FD {

}

class FData extends FD {

}

class FDirectory extends FD {

}

class FLink extends FD {

}

module.exports = {
	CStream: CStream,
	CDirectory: CDirectory,
	CFile: CFile,
	CLink: CLink,
	CPerms: CPerms,
	FD: FD
}

async function deepLoad(location = "/") {
	fs.readdir(location, (err, files) => {

	});
}
async function deepStore(content, location = "/") {

}
