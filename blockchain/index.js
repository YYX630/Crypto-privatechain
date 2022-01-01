const Block = require("./block");
const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet");
const { cryptoHash } = require("../util");
const { REWARD_INPUT, MINING_REWARD } = require("../config");
const { validTransaction } = require("../wallet/transaction");

class Blockchain {
    constructor () {
        this.chain = [Block.genesis()];
    }

    addBlock ({data}){
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        })

        this.chain.push(newBlock);
    }

    replaceChain(chain, validTransactions, onSuccess){
        if (chain.length <= this.chain.length){
            console.error("The incoming chain must be longer");
            return;
        }

        if (!Blockchain.isValidChain(chain)){
            console.error("The incoming chain must be valid");
            return;
        }

        if (validTransactions && !this.validTransactionData({chain}) ) {
            console.error("The incoming chain has invalid data");
            return;
        }

        if (onSuccess) onSuccess();
        console.log("replacing chain with", chain);
        this.chain = chain;
    }

    validTransactionData({ chain }){
        for (let i = 1; i< chain.length; i++){
            const block = chain[i];
            const transactionSet = new Set();
            let rewardTransactionCount = 0;
            

            for (let transaction of block.data){
                if (transaction.input.address === REWARD_INPUT.address){
                    rewardTransactionCount += 1;
                    
                    //複数のrewardが存在
                    if (rewardTransactionCount > 1){
                        console.error("Miner rewards exceed limit");
                        return false;
                    }

                    //rewardの額がごまかし
                    if (Object.values(transaction.outputMap)[0] !== MINING_REWARD){
                        console.error("Miner reward amount is invalid");
                        return false;
                    }
                } else {
                    //transactionのフォーマットが正しくない
                    if (!Transaction.validTransaction(transaction)){
                        console.error("Invalid transaction");
                        return false;   
                    }

                    //input amountのごまかし
                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain, //this!chain!!! not newChain
                        address: transaction.input.address
                    })
                    if (transaction.input.amount !== trueBalance){
                        console.error("Invalud input amount");
                        return false;
                    }

                    //同じものが存在している
                    if (transactionSet.has(transaction)){
                        console.error("An identical transaction appears more than once in the block");
                        return false;
                    } else {
                        transactionSet.add(transaction);
                    }
                }
            }
        }
        return true;
    }

    //staticキーワードつきの関数は、インスタンスからは呼び出せなく、クラスからのみ呼び出される
    static isValidChain(chain){
        // obejctの一致判定、気をつける。
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for (let i = 1; i < chain.length; i++){
            const block = chain[i];
            const {timestamp, lastHash, hash, data, nonce, difficulty} = block;
            const actualLastHash = chain[i-1].hash;
            const lastDifficulty = chain[i-1].difficulty;

            if (lastHash !== actualLastHash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
            if( hash !== validatedHash) return false;

            if (Math.abs(lastDifficulty-difficulty) > 1) return false;

            // こうしようかと思ったけど、chainができてから、adjustDiffucultyの仕様変更があった場合に対応できないわ。
            // if (difficulty !== Block.adjustDifficulty({originalBlock: chain[i-1], timestamp: timestamp})) return false;
        }
        return true;
    }
}

module.exports = Blockchain;