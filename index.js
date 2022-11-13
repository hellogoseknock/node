const express = require('express');
const app = express();

app.listen(7070, function (req, res) {
    console.log('server 7070 port listening...');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});
