class CUser {
	constructor(name, groups) {
		this.name = name;
		this.groups = groups;
	}
	inGroup(g) {
		return this.groups.indexOf(g) !== -1;
	}
}

class CGroup {
	constructor(name) {
		this.name = name;
		this.groups = groups;
	}
}

class CUsers {
	constructor(users) {
		this.users = users;
	}
	hasUser(n) {
		return this.users.indexOf(n) !== -1;
	}
	getUser(n) {
		var id = this.users.indexOf(n);
		if (id === -1) return null;
		return this.users[id];
	}
}

class CGroups {
	constructor(groups) {
		this.groups = groups;
	}
	hasGroup(g) {
		return this.groups.indexOf(g) !== -1;
	}
	getGroup(g) {
		var id = this.groupss.indexOf(g);
		if (id === -1) return null;
		return this.groups[id];
	}
}

class CPerms {
	constructor(perm = "+all+") {
		this.perm = perm;
	}
	check(user, operation, users, groups) {
		var sec = perm.split("/");
		if (sec.length === 1) {
			return CPerms.checker(user, sec[0], users, groups);
		} else if (sec.length === 2) {
			if (operation === "w") {
				// W
				return CPerms.checker(user, sec[1], users, groups);
			} else {
				// R
				return CPerms.checker(user, sec[0], users, groups);
			}
		}
		return false;
	}
	static checker(user, p, users, groups) {
		/*
		format:

		name: /[a-zA-z_][a-zA-z_0-9]{3,31/
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
		var classA = "abcdefghijklmnopqrstuvwxyzABCDEFGHJIKLMNOPQRSTUVWXYZ0123456789_";
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
		var object = [];
		for(var i = 0; i < tokens.length; i++) {
			var token = tokens[i];
			if (token[1] === "|") {
				object.push(object.pop() || object.pop());
			} else if (token[1] === "&") {
				object.push(object.pop() && object.pop());
			} else if (token[1] === "!") {
				object.push(!object.pop());
			} else if (token[1] === "+") {
				object.push(user.name === object.pop());
			} else if (token[1] === "-") {
				object.push(user.inGroup(groups.getGroup(object.pop())));
			} else {
				object.push(token[1]);
			}
		}
		if (object.length !== 1) throw new Error("parse mismatch error");
		return object[1];
	}
}


module.exports = {
	CPerms: CPerms,
	CUser: CUser,
	CGroup: CGroup
}
