var cjs = require("crypto-js")
var rng = require("random-number-csprng")

module.exports = {
	sha512: (data) => {
		return cjs.SHA512(data).toString();
	},
	aes: {
		encrypt: (data, secret) => {
			return cjs.AES.encrypt(data, secret).toString();
		},
		decrypt: (data, secret) => {
			return cjs.AES.decrypt(data, secret).toString(cjs.enc.Utf8);
		}
	},
	authenticator: (auth, password) => {
		var secret = cjs.SHA512(password).toString()
		return [cjs.AES.encrypt(cjs.AES.decrypt(auth, secret).toString(cjs.enc.Utf8).split("").reverse().join(""), secret).toString(), cjs.AES.encrypt(password, secret).toString()];
	},
	bytes: async function(bits = 256) {
		var out = "";
		bits = Math.floor(bits);
		if (bits % 16 === 0) {
			for (var i = 0, imax = bits / 16; i < imax; i++) {
				out += (await rng(0, 65535)).toString(16).padStart(4, "0")
			}
		} else if (bits % 8 === 0) {
			for (var i = 0, imax = bits / 8; i < imax; i++) {
				out += (await rng(0, 255)).toString(16).padStart(2, "0")
			}
		} else if (bytes % 4 === 0) {

		} else if (bytes % 2 === 0) {

		} else
		return out
	}
}
