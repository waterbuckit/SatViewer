var satellites;
var img;
var started = false;

function setup() {
    $.get("getSatellites", function(data, status){
        satellites = data;
        console.log(data);
        createCanvas(window.innerWidth, window.innerHeight, WEBGL);
        img = loadImage('earth_day.jpg');
        noLoop();
        start();
    });
}

function draw() {
    if(started){
        background(0);
        //directionalLight(250, 250, 250, -dirX, -dirY, 0.25);
        texture(img)
        sphere(100);
        
        drawSatellites();

        orbitControl();
    }
}

function drawSatellites(){
}

function start(){
   started = true;
   loop();
}
