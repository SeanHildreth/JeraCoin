const Blockchain = require('../blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({ data: 'initial' });

console.log('first block', blockchain.chain[blockchain.chain.length - 1]);

let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;

const times = [];

for (let idx = 0; idx < 10000; idx++) {
    prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;

    blockchain.addBlock({ data: `block ${idx}` });
    nextBlock = blockchain.chain[blockchain.chain.length - 1];

    nextTimestamp = nextBlock.timestamp;
    timeDiff = nextTimestamp - prevTimestamp;
    times.push(timeDiff);

    average = times.reduce((total, num) => (total + num)) / times.length;

    console.log(`Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms.`);
}