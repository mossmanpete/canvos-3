var fs = require("fs");
var path = require("path");
var typeparse = require("./typeparse.js")

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
	constructor(perm = "+all+") {
		this.perm = perm;
	}
	check(user, operation) {
		var sec = perm.split("/");
		if (sec.length === 1) {
			return CPerms.checker(user, sec[0]);
		} else if (sec.length === 2) {
			if (operation === "w") {
				// W
				return CPerms.checker(user, sec[1]);
			} else {
				// R
				return CPerms.checker(user, sec[0]);
			}
		}
		return false;
	}
	CType() {
		return "CPerms";
	}
	static checker(user, p) {
		/*
		format:

		name: /[a-zA-z_\-][a-zA-z_\-0-9]{3,31/
		user: [+] name [+]
		group: [-] name [-]
		entity: user
		        group
						or
		or: and [|] and
		    and
		and: not [&] not
		     not
		not: [!] paren
		     paren
		paren: [(] entity [)]
					 entity

		!(-leader-&-workspace-)|+bill+


		*/
		// step 1: t o k e n i z e
		var classA = "abcdefghijklmnopqrstuvwxyzABCDEFGHJIKLMNOPQRSTUVWXYZ0123456789-_";
		var classB = "|&!()+-";
		var lastCl = 2;
		var getCl = ch => {
			if (classA.indexOf(ch) !== -1) return 0;
			if (classB.indexOf(ch) !== -1) return 1;
			return 2;
		}
		var tokens = [];
		var currenttoken = "";
		for(var i = 0; i < p.length; i++) {
			var ch = p[i];
			var cl = getCl(ch);
			if (cl === 0) {
				if (lastCl === 0) {
					currenttoken += ch;
				} else if (lastCl === 1) {
					tokens.push([1, currenttoken]);
					currenttoken = ch;
				} else {
					currenttoken = ch;
				}
			} else if(cl === 1) {
				if (lastCl === 0) {
					tokens.push([0, currenttoken]);
					currenttoken = ch;
				} else if (lastCl === 1) {
					tokens.push([1, currenttoken]);
					currenttoken = ch;
				} else {
					currenttoken = ch;
				}
			} else {
				if (lastCl === 0) {
					tokens.push([0, currenttoken]);
				} else if (lastCl === 1) {
					tokens.push([1, currenttoken]);
				} else {

				}
			}
			lastCl = cl;
		}
		tokens.push([lastCl, currenttoken]);
	}
}

class CObj {
	constructor(object, name, perms) {
		this.object = object;
		this.name = name;
		this.type = object.FileType();
		this.perms = perms;
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
