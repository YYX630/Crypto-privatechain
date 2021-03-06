const Transaction = require("../wallet/transaction");

class TransactionMiner {
    constructor ({blockchain, transactionPool, wallet, pubsub}) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }

    mineTransactions(){
        // get the transaction pool's valid transactions
        const validTransactions = this.transactionPool.validTransactions();

        if (validTransactions.length > 0){
            //generate the miner's reward
            validTransactions.push(
                Transaction.rewardTransaction({minerWallet: this.wallet})
            );

            // add a block consisting of theses transactions to the blockchain
            //this is minining........
            this.blockchain.addBlock({data: validTransactions})

            //if successful     //not implemented yet.....
            //broadcast the updated blockchain
            this.pubsub.broadcastChain();

            //clear the pool
            this.transactionPool.clear();
        } else {
            throw new Error("no valid transactions");
        }
    }
}


module.exports = TransactionMiner;