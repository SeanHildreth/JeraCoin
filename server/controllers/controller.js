const Blockchain = require('../../blockchain/blockchain');
const PubSub = require('../../app/pubsub');
const TransactionPool = require('../../wallet/transaction-pool');
const Wallet = require('../../wallet/wallet');
const request = require('request');
const TransactionMiner = require('../../app/transaction-miner');

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({
    blockchain,
    transactionPool,
    wallet,
    pubsub
});

const DEFAULT_PORT = 5418;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

module.exports = {

    getBlocks: (req, res) => {
        res.json(blockchain.chain);
    },

    mine: (req, res) => {
        const { data } =  req.body;

        blockchain.addBlock({ data });

        pubsub.broadcastChain();

        res.redirect('/api/blocks');
    },

    transact: (req, res) => {
        const { amount, recipient } = req.body;

        let transaction = transactionPool
            .existingTransaction({ inputAddress: wallet.publicKey });

        try {
            if (transaction) {
                transaction.update({ senderWallet: wallet, recipient, amount });
            } else {
                transaction = wallet.createTransaction({
                    recipient,
                    amount,
                    chain: blockchain.chain
                });
            }
        } catch(error) {
            return res.status(400).json({ type: 'error', message: error.message });
        }

        transactionPool.setTransaction(transaction);

        pubsub.broadcastTransaction(transaction);

        res.json({ type: 'success', transaction });
    },

    transaction_pool_map: (req, res) => {
        res.json(transactionPool.transactionMap);
    },

    mine_transactions: (req, res) => {
        transactionMiner.mineTransactions();

        res.redirect('/api/blocks');
    },

    wallet_info: (req, res) => {
        const address = wallet.publicKey;
        res.json({
            address,
            balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
        });
    },

    size: (req, res) => {
        res.json(blockchain.chain.length);
    },

    length: (req, res) => {
        const { id } = req.params;
        const { length } = blockchain.chain;

        const blocksReversed = blockchain.chain.slice().reverse();

        let startIdx = (id - 1) * 10;
        let endIdx = id * 10;

        startIdx = startIdx < length ? startIdx : length;
        endIdx = endIdx < length ? endIdx : length;

        res.json(blocksReversed.slice(startIdx, endIdx));
    },

    syncWithRootState: () => {
        request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, res, body) => {
            if (!error && res.statusCode === 200) {
                const rootChain = JSON.parse(body);
    
                // console.log('replace chain on a sync with', rootChain);
                blockchain.replaceChain(rootChain);
            }
        });
    
        request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, res, body) => {
            if (!error && res.statusCode === 200) {
                const rootTransactionMap = JSON.parse(body);
    
                // console.log('replace transaction pool map on a sync with', rootTransactionMap);
                transactionPool.setMap(rootTransactionMap);
            }
        })
    },
};