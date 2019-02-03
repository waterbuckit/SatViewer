var satellite = require("satellite.js");
var bodyParser = require('body-parser');
var express = require('express');
var parse = require('csv-parse/lib/sync');
var fs = require('fs');

// Get input file
var input;
try{
    input = fs.readFileSync('TLE.json', 'utf8');
}catch(e){
    console.log("Could not find TLE.json");
    process.exit(1);
}

// JSON objects of satellite data 

var satData = JSON.parse(input);

var satRecs = [];

for(satDatum of satData){
    if(satDatum.OBJECT_TYPE != "DEBRIS" && satDatum.INTLDES){
        satRecs.push({
            OBJECT_NAME : satDatum.OBJECT_NAME, 
            INTLDES : satDatum.INTLDES, 
            OBJECT_TYPE : satDatum.OBJECT_TYPE, 
            SAT_REC : satellite.twoline2satrec(satDatum.TLE_LINE1, satDatum.TLE_LINE2)
        });
    }
}
console.log("Finished startup");

var app = express();
var server = app.listen(25565);
app.use(express.static('views/public'));

app.get("/getSatellites", function(req, res){
    res.send(satRecs);
});
