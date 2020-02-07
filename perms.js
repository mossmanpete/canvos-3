class CPerms {
	constructor(perm = "+all+") {
		this.perm = perm
	}
	check(user, operation, perms) {
		var sec = this.perm.split("/")
		if (sec.length === 1) {
			return CPerms.checker(user, sec[0], perms)
		} else if (sec.length === 2) {
			if (operation === "w") {
				return CPerms.checker(user, sec[1], perms)
			} else {
				return CPerms.checker(user, sec[0], perms)
			}
		}
		return false
	}
	static checker(user, p, perms) {
		var groups = perms.groups;
		var classA = "abcdefghijklmnopqrstuvwxyzABCDEFGHJIKLMNOPQRSTUVWXYZ0123456789_"
		var classB = "|&!+-"
		var lastCl = 2
		var getCl = ch => {
			if (classA.indexOf(ch) !== -1) return 0
			if (classB.indexOf(ch) !== -1) return 1
			return 2
		}
		var tokens = []
		var currenttoken = ""
		for (var i = 0; i < p.length; i++) {
			var ch = p[i]
			var cl = getCl(ch)
			if (cl === 0) {
				if (lastCl === 0) {
					currenttoken += ch
				} else if (lastCl === 1) {
					tokens.push([1, currenttoken])
					currenttoken = ch
				} else {
					currenttoken = ch
				}
			} else if (cl === 1) {
				if (lastCl === 0) {
					tokens.push([0, currenttoken])
					currenttoken = ch
				} else if (lastCl === 1) {
					tokens.push([1, currenttoken])
					currenttoken = ch
				} else {
					currenttoken = ch
				}
			} else {
				if (lastCl === 0) {
					tokens.push([0, currenttoken])
				} else if (lastCl === 1) {
					tokens.push([1, currenttoken])
				} else {

				}
			}
			lastCl = cl
		}
		tokens.push([lastCl, currenttoken])
		var object = []
		for (var i = 0; i < tokens.length; i++) {
			var token = tokens[i]
			if (token[1] === "|") {
				var a = object.pop();
				var b = object.pop();
				object.push(a || b)
			} else if (token[1] === "&") {
				var a = object.pop();
				var b = object.pop();
				object.push(a && b)
			} else if (token[1] === "!") {
				object.push(!object.pop())
			} else if (token[1] === "+") {
				object.push(user.name === object.pop())
			} else if (token[1] === "-") {
				var groupp = object.pop()
				if (groupp === "all") {
					object.push(true)
				} else {
					var id = groups.find(group => group.name = groupp)
					if (id === undefined) {
						object.push(false)
					}
					else {
						object.push(user.groups.indexOf(id.name) !== -1)
					}
				}
			} else {
				object.push(token[1])
			}
		}
		if (object.length !== 1) throw new Error("parse mismatch error, " + JSON.stringify(object))
		return object[0]
	}
}


module.exports = {
	CPerms: CPerms
}
