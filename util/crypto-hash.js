const crypto = require("crypto");

const cryptoHash = (...inputs)=>{
//every arguments will be single inputs array 
    const hash = crypto.createHash("sha256");

    hash.update(inputs.map(input=>JSON.stringify(input))
        .sort().join(" "));

    return hash.digest("hex");
};


module.exports = cryptoHash;