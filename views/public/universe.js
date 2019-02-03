p5.disableFriendlyErrors = true;
var satelliteRecords;
var satellites = [];
var img;
var pg;
var started = false;
var pMatrix = mat4.create(), camMatrix = mat4.create();
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

    var cameraPos = createVector(this._renderer._curCamera.eyeX, this._renderer._curCamera.eyeY, this._renderer._curCamera.eyeZ);
    var ray = getRayFromCamera(mouseX, mouseY, cameraPos)

    for(satelliteDatum of satellites){
        push();
        switch(satelliteDatum.OBJECT_TYPE){
            case "ROCKET BODY" :
                fill(255, 107, 33);
                break;
            case "PAYLOAD":
                fill(130, 177, 255);
        } 
        //intersects(satelliteDatum, ray, cameraPos);
        if(intersects(satelliteDatum,ray, cameraPos) != null){
            console.log("intersects");
        }
        //    console.log("no intersection!");
        //}
        
        translate(satelliteDatum.position.x, satelliteDatum.position.z, satelliteDatum.position.y); 
        sphere(1, 11, 11);
        pop();
    }
}

function intersects(satelliteDatum, ray, camera){
     var L = createVector(satelliteDatum.position.x,
         satelliteDatum.position.z,
         satelliteDatum.position.y).sub(camera);
     var tc = L.dot(ray);
     if(tc < 0){
        return null;
     }
     var d2 = (tc*tc) -(L.dot(L));
     if(d2 > 1){
        return null;
     }
     var t1c = Math.sqrt(1 - (d2));
     //console.log("t1c: " +t1c);
     var t1 = tc - t1c;
    
     return camera.copy().add(ray).mult(t1);
}

function unProject(mx, my) {
  var glScreenX = (mx / width * 2) - 1.0;
  var glScreenY = 1.0 - (my / height * 2);
  var screenVec = [glScreenX, glScreenY, -0.01, 1.0]; //gl screen coords
 
  var comboPMat = mat4.create();
  mat4.mul(comboPMat, pMatrix, camMatrix);
  var invMat = mat4.create();
  mat4.invert(invMat, comboPMat);
  var worldVec = vec4.create();
  vec4.transformMat4(worldVec, screenVec, invMat);
    
  pMatrix = mat4.create(), camMatrix = mat4.create();

  return createVector(worldVec[0] / worldVec[3], worldVec[1] / worldVec[3], worldVec[2] / worldVec[3]);
  //return createVector(worldVec[0] / worldVec[3], worldVec[1] / worldVec[3], worldVec[2] / worldVec[3]);
}


function getRayFromCamera(mouseX, mouseY, camera){
    var ptThru = unProject(mouseX, mouseY);

    var rayDir = ptThru.sub(camera); //rayDir = ptThru - rayOrigin
    rayDir.normalize();

    //var toCenterVec = createVector();
    //toCenterVec = rayOrigin.copy().mult(-1); //toCenter is just -camera pos because center is at [0,0,0]
    //var dParallel = createVector();
    //dParallel = rayDir.dot(toCenterVec);
    //
    //var longDir = createVector();
    //longDir = rayDir.mult(dParallel); //longDir = rayDir * distParallel
    //ptThru = rayOrigin.copy().add(longDir); //ptThru is now on the plane going through the center of sphere
    //var dPerp = mag(ptThru);
    //
    //var dSubSurf = Math.sqrt(100*100 - dPerp*dPerp);
    //var dSurf = dParallel - dSubSurf;
    //
    //var ptSurf = createVector();
    //ptSurf = rayDir.copy().mult(dSurf);
    //ptSurf = ptSurf.copy().add(rayOrigin);
  
 // console.log('earthscreenpt: ' + (performance.now() - start) + ' ms');
  
  return rayDir;
}

function start(){
   started = true;
   loop();
}
