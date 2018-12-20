const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {

    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('jeracoin'))
        .toEqual('5fabde58c955bae2e388c6e921c9b0dae0d064bf1a1e623b2987fdf74fa4bdb3');
    });

    it('produces the same hash with the same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three'))
        .toEqual(cryptoHash('three', 'one', 'two'));
    });

    it('produces a unique hash when the properties have changed on an input', () => {
        const test = {};
        const originalHash = cryptoHash(test);
        test['a'] = 'a';

        expect(cryptoHash(test)).not.toEqual(originalHash);
    });
});