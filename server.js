var bodyParser = require('body-parser');
var express = require('express');
var parse = require('csv-parse/lib/sync');
var fs = require('fs');

// Get input file
var input;
try{
    input = fs.readFileSync('satdata.csv', 'utf8');
}catch(e){
    console.log("Could not find satdata.csv");
    process.exit(1);
}

// JSON objects of satellite data 
var records = parse(input, {
    columns: true,
    skip_empty_lines: true
});

var app = express();
var server = app.listen(25565);
app.use(express.static('views/public'));

app.get("/allstars", function(req, res){
    db.query("select * from stars", function(err, rows, fields){
        res.send(rows);
    });
});
