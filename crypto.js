var cnode = require("crypto")
var cjs = require("crypto-js")


module.exports = {
  sha512: (data) => {
    var hash = cnode.createHash("sha-512");
    hash.update(data);
    return hash.digest("hex");
  },
  aes: {
    encrypt: (data, secret) => {
      return cjs.AES.encrypt(data, secret).toString();
    },
    decrypt: (data, secret) => {
      return cjs.AES.decrypt(data, secret).toString(cjs.enc.Utf8);
    }
  }
}
