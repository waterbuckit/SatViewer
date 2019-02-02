p5.disableFriendlyErrors = true;
var satelliteRecords;
var satellites = [];
var img;
var pg;
var started = false;

function setup() {
    $.get("getSatellites", function(data, status){
        satelliteRecords = data;
        createCanvas(windowWidth, windowHeight, WEBGL);

        img = loadImage('earth_day.jpg');
        for(satelliteDatum of satelliteRecords){
            var positionAndVelocity = satellite.
                propagate(satelliteDatum.SAT_REC, new Date());
            if(positionAndVelocity.position){

                positionAndVelocity.position.x /= 63;
                positionAndVelocity.position.y /= 63;
                positionAndVelocity.position.z /= 63;
                satellites.push({
                    INTLDES : satelliteDatum.INTLDES, OBJECT_NAME : satelliteDatum.OBJECT_NAME, 
                    OBJECT_TYPE : satelliteDatum.OBJECT_TYPE,
                    position : positionAndVelocity.position
                });
            }
        }

        noLoop();
        start();
    });
}

function draw() {
    if(started){

        angleMode(degrees);
        background(0);
        
        texture(img)
        push();
        rotateZ(-50.5);
        sphere(100, 9, 9);
        pop();
        
        pointLight(255,255,255, width/2, 100, 200);
        pointLight(255,255,255, width/2, 200, 200);
        pointLight(255,255,255, width/2, 200, 200);
        pointLight(255,255,255, width/2, 200, 200);
        pointLight(255,255,255, width/2, 200, 200);
        pointLight(255,255,255, width/2, 200, 200);
        pointLight(255,255,255, width/2, 200, 200);
        pointLight(255,255,255, width/2, 200, 200);
        
        drawSatellites();

        orbitControl();
        
    }
}

function mousePressed(){

}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}


function drawSatellites(){

    

    for(satelliteDatum of satellites){
        push();
        switch(satelliteDatum.OBJECT_TYPE){
            case "ROCKET BODY" :
                fill(255, 107, 33);
                break;
            case "PAYLOAD":
                fill(130, 177, 255);
        } 
        translate(satelliteDatum.position.x, satelliteDatum.position.z, satelliteDatum.position.y); 
        sphere(1, 11, 11);
        pop();
    }
}

function start(){
   started = true;
   loop();
}
