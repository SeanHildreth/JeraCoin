const express = require('express');
const bp = require('body-parser');
const path = require('path');
const { syncWithRootState } = require('./server/controllers/controller');

const app = express();

app.use(bp.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

require('./server/config/routing')(app);

app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("client/dist/index.html"));
});

const DEFAULT_PORT = 5418;
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}!`);
    if (PORT !== DEFAULT_PORT) {
        syncWithRootState();
    }
})