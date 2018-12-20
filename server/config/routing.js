const controller = require('../controllers/controller');

module.exports = (app) => {
    app.get('/api/blocks', controller.getBlocks);
    app.post('/api/mine', controller.mine);
    app.post('/api/transact', controller.transact);
    app.get('/api/transaction-pool-map', controller.transaction_pool_map);
    app.get('/api/mine-transactions', controller.mine_transactions);
    app.get('/api/wallet-info', controller.wallet_info);
    app.get('/api/blocks/length', controller.size);
    app.get('/api/blocks/:id', controller.length);
}