var cjs = require("crypto-js")
var rng = require("random-number-csprng")

module.exports = {
	sha512: (data) => {
		return cjs.SHA512(data).toString()
	},
	aes: {
		encrypt: (data, secret) => {
			return cjs.AES.encrypt(data, secret).toString()
		},
		decrypt: (data, secret) => {
			return cjs.AES.decrypt(data, secret).toString(cjs.enc.Utf8)
		}
	},
	authenticator: (auth, password) => {
		var secret = cjs.SHA512(password).toString()
		return [cjs.AES.encrypt(cjs.AES.decrypt(auth, secret).toString(cjs.enc.Utf8).split("").reverse().join(""), secret).toString(), cjs.AES.encrypt(password, secret).toString()];
	},
	bytes: async function (bits = 256) {
		var out = "", repile = 0
		bits = Math.floor(bits)
		if (bits % 16 === 0) {
			for (var i = 0, imax = bits / 16; i < imax; i++) {
				out += (await rng(0, 65535)).toString(16).padStart(4, "0")
			}
		} else if (bits % 8 === 0) {
			for (var i = 0, imax = bits / 8; i < imax; i++) {
				out += (await rng(0, 255)).toString(16).padStart(2, "0")
			}
		} else if (bits % 4 === 0) {
			for (var i = 0, imax = bits / 4; i < imax; i++) {
				out += (await rng(0, 15)).toString(16)
			}
		} else if (bits % 2 === 0) {
			repile = 2
			for (var i = 0, imax = bits / 2; i < imax; i++) {
				out += (await rng(0, 3)).toString(2).padStart(2, "0")
			}
		} else {
			repile = 1
			for (var i = 0, imax = bits; i < imax; i++) {
				out += (await rng(0, 1)).toString(2)
			}
		}
		if (repile === 1) {
			out = out.split("").reverse().join("")
			var chars = Math.ceil(out / 4)
			var nout = ""
			var table = {
				"0000": "0",
				"0001": "8",
				"0010": "4",
				"0011": "c",
				"0100": "2",
				"0101": "a",
				"0110": "6",
				"0111": "e",
				"1000": "1",
				"1001": "9",
				"1010": "5",
				"1011": "d",
				"1100": "3",
				"1101": "b",
				"1110": "7",
				"1111": "f",
			}
			for (var i = 0; i < chars; i++) {
				var c1 = out[i * 4]
				var c2 = out[i * 4 + 1]
				var c3 = out[i * 4 + 2]
				var c4 = out[i * 4 + 3]
				if (c1 === undefined) c1 = '0'
				if (c2 === undefined) c2 = '0'
				if (c3 === undefined) c3 = '0'
				if (c4 === undefined) c4 = '0'
				var cchar = c1 + c2 + c3 + c4
				nout += table[cchar]
			}
			out = nout.split("").reverse().join("")
		} else if (repile === 2) {
			out = out.split("").reverse().join("")
			var chars = Math.ceil(out / 2)
			var nout = ""
			var table = {
				"00": "0",
				"01": "4",
				"02": "8",
				"03": "c",
				"10": "1",
				"11": "5",
				"12": "9",
				"13": "d",
				"20": "2",
				"21": "6",
				"22": "a",
				"23": "e",
				"30": "3",
				"31": "7",
				"32": "b",
				"33": "f",
			}
			for (var i = 0; i < chars; i++) {
				var c1 = out[i * 2]
				var c2 = out[i * 2 + 1]
				if (c1 === undefined) c1 = '0'
				if (c2 === undefined) c2 = '0'
				var cchar = c1 + c2
				nout += table[cchar]
			}
			out = nout.split("").reverse().join("")
		}
		return out.toLowerCase()
	}
}
