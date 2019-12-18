function checker(user, p) {
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
	return tokens;
}
