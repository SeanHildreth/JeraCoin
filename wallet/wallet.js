const Transaction = require('./transaction');
const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../util');


class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;

        this.keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        return this.keyPair.sign(cryptoHash(data));
    }

    createTransaction({ recipient, amount, chain }) {
        if (chain) {
            this.balance = Wallet.calculateBalance({
                chain,
                address: this.publicKey
            });
        }
        if (amount > this.balance) {
            throw new Error('Amount exceeds balance!')
        }

        if (amount <= 0) { // Added this outside course curriculum...
            throw new Error('Amount must be positive!')
        }

        return new Transaction({ senderWallet: this, recipient, amount });
    }

    static calculateBalance({ chain, address }) {
        let hasConductedTransaction = false;
        let outputsTotal = 0;

        for (let idx = chain.length - 1; idx > 0; idx--) {
            const block = chain[idx];

            for (let transaction of block.data) {
                if (transaction.input.address === address) {
                    hasConductedTransaction = true;
                }

                const addressOutput = transaction.outputMap[address];

                if (addressOutput) {
                    outputsTotal += addressOutput;
                }
            }

            if (hasConductedTransaction) {
                break;
            }
        }

        return hasConductedTransaction ? outputsTotal : STARTING_BALANCE + outputsTotal;
    }
};

module.exports = Wallet;