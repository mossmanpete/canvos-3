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
	bytes: async function(bits = 256) {
		var out = "", repile = false
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
			repile = true
			for (var i = 0, imax = bits / 2; i < imax; i++) {
				out += (await rng(0, 3)).toString(2).padStart(2, "0")
			}
		} else {
			repile = true
			for (var i = 0, imax = bits; i < imax; i++) {
				out += (await rng(0, 1)).toString(2)
			}
		}
		if (repile) {
			out = out.split("").reverse().join("")
			var chars = Math.ceil(out / 4)
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
			
		}
		return out.toLowerCase();
	}
}
