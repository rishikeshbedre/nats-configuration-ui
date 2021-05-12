const express = require('express');
const app = express();
var cors = require('cors');
app.use(cors());
app.use(express.static('/home/app/nats-configurator'));


var server = app.listen(6061, function () {
    console.log("server listening at localhost:6061");
});

app.get('*', function (req, res) {
    res.sendFile('/home/app/nats-configurator/index.html');
});