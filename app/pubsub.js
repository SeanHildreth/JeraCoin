const PubNub = require('pubnub');

const CREDENTIALS = {
    publishKey: 'pub-c-9e47b870-21b5-4030-95a3-b9756172f7b0',
    subscribeKey: 'sub-c-eda5e730-01cc-11e9-849f-127435af060e',
    secretKey: 'sec-c-MDdkYzhlYTItNmVlZC00NGYwLWEwMGUtN2FmYmYwODQxZWFl'
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class PubSub {
    constructor({ blockchain, transactionPool }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

        this.pubnub = new PubNub(CREDENTIALS);

        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

        this.pubnub.addListener(this.listener());
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        })
    }
    
    publish({ channel, message }) { // I may need to make some changes to this based on the way it may or may not function...
        this.pubnub.unsubscribe({ channels: Object.values(CHANNELS) });
        const promise = new Promise((res, rej) => {
            res(this.pubnub.publish({ channel, message }));
        })
        promise.then(() => {
            this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
        });
        promise.catch(() => {
            console.log('There was an error retrieving the data!');
        })
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;
                console.log(`Message received. Channel: ${channel}. Message: ${message}.`)

                const parsedMessage = JSON.parse(message);

                switch(channel) {
                    case CHANNELS.BLOCKCHAIN:
                        this.blockchain.replaceChain(parsedMessage, true, () => {
                            this.transactionPool.clearBlockchainTransactions({
                                chain: parsedMessage
                            });
                        });
                        break;
                    case CHANNELS.TRANSACTION:
                        this.transactionPool.setTransaction(parsedMessage);
                        break;
                    default:
                        return;
                }
            }
        };
    }
}

module.exports = PubSub;