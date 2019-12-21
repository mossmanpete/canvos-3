var fs = require("fs");
var path = require("path");
var perms = require("./perms.js");

var root = path.join(process.cwd(), "./filesystem");
var groups = null;

function getFile(loc, user) {
	return gFInt(loc, root);
}

function gFInt(loc, space) {
	if (loc = path.basename(loc)) {
		// trying to read from current dir
		return new Promise(yey => fs.readFile(path.join(space, loc), yey));
	} else {
		return new Promise(yey => {
			fs.readFile(path.join(space, "./meta.json"), (err, data) => {
				if (err) yey(err, data);
				var obj = JSON.parse(data);
			})
		})
	}
}

function reloadGroups() {
	fs.readFile(path.join(root, "perms.json"), (err, data) => {
		if (err) throw new Error("unable to load permission file");
		groups = JSON.parse(data);
	});
}
reloadGroups();

module.exports = {
	getFile: getFile
}
