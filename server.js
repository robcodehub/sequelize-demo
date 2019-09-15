const express = require('express');
const db = require('./db');

const app = express();

app.use('/api', require('./api'));




const port = 3000;

db.syncAndSeed()
.then(() => app.listen(port, () => console.log(`listening on port ${port}`)));
