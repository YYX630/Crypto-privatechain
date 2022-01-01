const hexToBinary = require("hex-to-binary");

const {GENESIS_DATA, MINE_RATE} = require("../config");
const {cryptoHash} = require("../util");


class Block {
    constructor ({timestamp, lastHash, hash, data, nonce, difficulty}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis (){
        return new this(GENESIS_DATA);//this means the classname "Block"
    }

    static mineBlock({lastBlock, data}){
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let {difficulty} = lastBlock; //継承
        let nonce = 0; //adjustable;


        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({originalBlock: lastBlock, timestamp});
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        

        return new this({timestamp,lastHash,data,difficulty,nonce,hash});
    };

    static adjustDifficulty ({originalBlock, timestamp}){
        const {difficulty} = originalBlock;

        if (difficulty < 1) return 1;

        const difference = timestamp - originalBlock.timestamp;
        if (difference > MINE_RATE * 1.05) return difficulty - 1;
        if (difference < MINE_RATE * 0.95) return difficulty + 1;
        return difficulty;
    }
};

module.exports = Block;