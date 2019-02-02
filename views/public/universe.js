disableFriendlyErrors = true;
var satelliteRecords;
var satellites = [];
var img;
var started = false;

function setup() {
    $.get("getSatellites", function(data, status){
        satelliteRecords = data;
        console.log(data);
        createCanvas(window.innerWidth, window.innerHeight, WEBGL);
        img = loadImage('earth_day.jpg');


        for(satelliteDatum of satelliteRecords){
            var positionAndVelocity = satellite.
                propagate(satelliteDatum.SAT_REC, new Date());
            if(positionAndVelocity.position){

                positionAndVelocity.position.x /= 63;
                positionAndVelocity.position.y /= 63;
                positionAndVelocity.position.z /= 63;
                satellites.push({
                    OBJECT_NAME : satelliteDatum.OBJECT_NAME, 
                    OBJECT_TYPE : satelliteDatum.OBJECT_TYPE,
                    position : positionAndVelocity.position
                });
            }
            
        }
       // for(satelliteDatum of satellites){
       //     console.log(satelliteDatum.position);
       // }
        noLoop();
        start();
    });
}

function draw() {
    if(started){
        //mResetMatrix();
        background(0);
        texture(img)
        sphere(100, 10, 10);
        
        drawSatellites();

        orbitControl();
    }
}

function drawSatellites(){
    for(satelliteDatum of satellites){
        push();
        //switch(satelliteDatum.OBJECT_TYPE){
        //    case "ROCKET BODY" :
        //        stroke(255, 107, 33);
        //        break;
        //    case "PAYLOAD":
        //        stroke(130, 177, 255);
        //} 

        switch(satelliteDatum.OBJECT_TYPE){
            case "ROCKET BODY" :
                fill(255, 107, 33);
                break;
            case "PAYLOAD":
                fill(130, 177, 255);
        } 
        //point(satelliteDatum.position.x, satelliteDatum.position.z, satelliteDatum.position.y); 
        translate(satelliteDatum.position.x, satelliteDatum.position.z, satelliteDatum.position.y); 
        sphere(1);
        pop();
        //push();
        //sphere(10);
        //pop();
    }
}

function start(){
   started = true;
   loop();
}
