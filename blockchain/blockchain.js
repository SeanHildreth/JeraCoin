const Block = require('./block');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet/wallet');
const { cryptoHash } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        });

        this.chain.push(newBlock);
    }

    replaceChain(chain, validateTransactions, onSuccess) {
        if (chain.length <= this.chain.length) {
            console.error('The incoming chain must be longer!');
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain must be a valid chain!');
            return;
        }

        if (validateTransactions && !this.validTransactionData({ chain })) {
            console.error('The incoming chain has invalid transaction data!')
            return;
        }

        if (onSuccess) onSuccess();
        // console.log('Replacing chain with: ', chain);
        this.chain = chain;
    }

    validTransactionData({ chain }) {
        for (let idx = 1; idx < chain.length; idx++) {
            const block = chain[idx];
            const transactionSet = new Set();
            let rewardTransactionCount = 0;

            for (let transaction of block.data) {
                if (transaction.input.address === REWARD_INPUT.address) {
                    rewardTransactionCount += 1;

                    if (rewardTransactionCount > 1) {
                        console.error('Miner rewards exceeds limit!');
                        return false;
                    }

                    if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                        console.error('Miner reward amount is invalid!');
                        return false;
                    }
                } else {
                    if (!Transaction.validTransaction(transaction)) {
                        console.error('Invalid transaction!');
                        return false;
                    }

                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain,
                        address: transaction.input.address
                    });



                    // I really need to work out the problem with this section!!!!


                    // console.log('blockCount', idx); 
                    // console.log('input.amount', transaction.input.amount);
                    // console.log('trueBalance', trueBalance);
                    // if (transaction.input.amount !== trueBalance) {
                    //     console.error('Invalid input amount!');
                    //     return false;
                    // }





                    if (transactionSet.has(transaction)) {
                        console.error("An identical transaction appears more than once in the block!");
                        return false;
                    } else {
                        transactionSet.add(transaction);
                    }
                }
            }
        }
        
        return true;
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for(let idx = 1; idx < chain.length; idx++) {
            const { timestamp, lastHash, hash, data, nonce, difficulty } = chain[idx];
            const actualLastHash = chain[idx - 1].hash;
            const lastDifficulty = chain[idx - 1].difficulty;

            if (lastHash !== actualLastHash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            if (hash !== validatedHash) return false;

            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
        }
        return true;
    }
}

module.exports = Blockchain;