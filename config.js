const cryptoHash = require('./util/crypto-hash');

const timestamp = "09/17/2018";
const lastHash = '5fabde58c955bae2e388c6e921c9b0dae0d064bf1a1e623b2987fdf74fa4bdb3'; // this is "jeracoin" hashed
const data = {
    COIN_NAME: 'JeraCoin',
    COIN_CREATOR: 'Sean Hildreth',
    MAX_COIN_SUPPLY: 21000000
}

const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 15;

const GENESIS_DATA = {
    timestamp,
    lastHash,
    data,
    hash: cryptoHash(timestamp, lastHash, data),
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0
};

const STARTING_BALANCE = 1000;

const REWARD_INPUT = { address: '*AUTHORIZED-MINING-REWARD*' };

const MINING_REWARD = 50;

module.exports = {
    GENESIS_DATA,
    MINE_RATE,
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD
};