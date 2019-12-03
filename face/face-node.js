const express = require('express');
const fs = require('fs').promises;
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// const hostname = '127.0.0.1';
const port = 3002;

app.listen(port, () => {
    console.log(`Server running at port: ${port}/`);
});

app.get('/', function(req, res){
    res.sendFile('index.html');
});

/**
 *
 */
app.post('/api/face/save', async function(req, res) {
    const expressions = req.body.expressions;

    await saveState('face', {'expressions' : expressions});

    res.sendStatus(200);
});

app.post('/api/face/load', async function(req, res) {
    // const expressions = req.body.expressions;

    const data = await loadState('face');
    await res.json(data);
});

/**
 * Cache data for later use.
 *
 * @type {Array}
 */
const cache = [];

async function saveState(name, object) {
    cache[name] = object;
    // await fs.writeFile(__dirname + `/tmp/state-${name}.json`, JSON.stringify(object));
}

async function loadState(name) {
    // const data = await fs.readFile(__dirname + `/tmp/state-${name}.json`);
    // return JSON.parse(data);
    return cache[name];
}