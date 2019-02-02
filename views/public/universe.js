var satellites;
var started = false;

function setup() {
    $.get("getSatellites", function(data, status){
        satellites = data;
        console.log(data);
        createCanvas(window.innerWidth, window.innerHeight, WEBGL);
        noLoop();
        start();
    });
}

function draw() {
    if(started){
        background(200);
        sphere(40);
        orbitControl();
    }
}

function start(){
   started = true;
   loop();
}
