var fs = require("fs")
var path = require("path")
var permsjs = require("./perms.js")

var root = path.join(process.cwd(), "./filesystem/")
var groups = null

function getFile(loc, user) {
	if (!user) throw new Error("user not logged in")
	if (loc[0] === '/') loc = loc.slice(1);
	var abspath = path.resolve(root, loc)
	if (abspath.startsWith(root))	return gFInt(loc, root, user)
	else throw new Error("attempted read outside fs")
}

function gFInt(loc, space, user) {
	if (loc === path.basename(loc)) {
		// trying to read from current dir
		return new Promise(yey => {
			fs.readFile(path.join(space, "./meta.json"), (err, data) => {
				if (err) yey(false, err);
				var obj = JSON.parse(data).files;
				console.log(obj, loc);
				var perms = obj.find(file => file.name === loc).perms;
				var pobj = new permsjs.CPerms(perms);
				if (pobj.check(user, 'r', groups)) {
					fs.readFile(path.join(space, loc), (err, data) => {
						if (err) yey(false, err);
						yey(true, data);
					});
				} else {
					yey(true, "");
				}
			})
		})
	} else {
		return new Promise(yey => {
			fs.readFile(path.join(space, "./meta.json"), (err, data) => {
				if (err) yey(false, err)
				var obj = JSON.parse(data).files;
				var locarr = loc.split(path.sep);
				console.log(obj, locarr[0]);
				var perms = obj.find(file => file.name === locarr[0]).perms;
				var pobj = new permsjs.CPerms(perms);
				if (pobj.check(user, 'r', groups)) {
		 			// well shit i need to do this
					var spacearr = space.split(path.sep);
					var locarr = loc.split(path.sep);
					var spa = false;
					if (spacearr[spacearr.length - 1] === "") {
						spa = true;
						spacearr.pop();
					}
					spacearr.push(locarr.shift());
					if (spa) spacearr.push("/");
					loc = locarr.join(path.sep);
					space = spacearr.join(path.sep);
					gFInt(loc, space, user).then((succ, data) => {
						yey(succ, data)
					});
				} else {
					yey(true, "");
				}
			})
		})
	}
}

function getUserData(name) {
	return groups.users.find(user => user.name === name);
}
function getUserPasswd(name) {
	return new Promise((yey, nay) => {
		fs.readFile(path.join(root, "perms2.json"), (err, data) => {
			if (err) nay(err);
			var user = JSON.parse(data).users.find(user => user.name === name)
			if (user) yey(user.password);
			else {
				user = null
				yey(undefined);
			}
		})
	})
}

function reloadGroups() {
	fs.readFile(path.join(root, "perms.json"), (err, data) => {
		if (err) throw new Error("unable to load permission file");
		groups = JSON.parse(data)
	})
}
reloadGroups()

module.exports = {
	getFile: getFile,
	getUserData: getUserData,
	getUserPasswd: getUserPasswd
}
