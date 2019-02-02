var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var server = app.listen(25565);
app.use(express.static('views/public'));
