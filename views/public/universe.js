p5.disableFriendlyErrors = true;
var satelliteRecords;
var satellites = [];
var satMap = new Map();
var img;
var pg;
var started = false;

function setup() {
    $.get("getSatellites", function(data, status){
        satelliteRecords = data;
        createCanvas(windowWidth, windowHeight, WEBGL);
        
        pixelDensity(1);

        pg = createGraphics(windowWidth, windowHeight, WEBGL);
        
        pg.pixelDensity(1);

        img = loadImage('earth_day.jpg');
        var j = 0;
        for(satelliteDatum of satelliteRecords){
            var positionAndVelocity = satellite.
                propagate(satelliteDatum.SAT_REC, new Date());
            if(positionAndVelocity.position){
                if(j == 50){
                    break;
                }
                positionAndVelocity.position.x /= 63;
                positionAndVelocity.position.y /= 63;
                positionAndVelocity.position.z /= 63;
                satellites.push({
                    INTLDES : satelliteDatum.INTLDES, OBJECT_NAME : satelliteDatum.OBJECT_NAME, 
                    OBJECT_TYPE : satelliteDatum.OBJECT_TYPE,
                    SAT_REC : satelliteDatum.SAT_REC,
                    position : positionAndVelocity.position
                });
                j++;
            }
        }
        var i = 0;
        for(var g = 0; g < 255 && i < 50; g++){
            for(var r = 0; r < 255 && i < 50; r++){
                satMap.set(satellites[i].INTLDES, {red : r, green : g, blue : 255}); 
                i++;
            }
        }

        noLoop();
        start();
    });
}

function draw() {
    if(started){
        drawBackgroundBuffer(); 
        pg.orbitControl();

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

function drawBackgroundBuffer() {
    pg.background(0, 0, 255);
    for(satelliteDatum of satellites){
        pg.noStroke();
        pg.push();
        var colour = satMap.get(satelliteDatum.INTLDES);
        pg.fill(colour.red, colour.green, 0);
        pg.translate(satelliteDatum.position.x, satelliteDatum.position.z, satelliteDatum.position.y); 
        pg.sphere(1, 11, 11);
        pg.pop();
    }

}
function drawSatellites(){

	var mouseObj = getObject(mouseX, mouseY);    
    //console.log(mouseObj);
    for(satelliteDatum of satellites){
        noStroke();
        push();
        switch(satelliteDatum.OBJECT_TYPE){
            case "ROCKET BODY" :
                fill(255, 107, 33);
                break;
            case "PAYLOAD":
                fill(130, 177, 245);
        }
        var curColour = satMap.get(satelliteDatum.INTLDES);
        if(mouseObj.blue != 255 && mouseObj.red == curColour.red && mouseObj.green == curColour.green){
           // console.log(curColour);
           // console.log(mouseObj);
        }
        
        translate(satelliteDatum.position.x, satelliteDatum.position.z, satelliteDatum.position.y); 
        sphere(1, 11, 11);
        pop();
    }
}


/* This function gets the red channel of the pixel under the mouse as 
		the index for the corresponding object. A more advanced version 
		 could use the 4 bytes (see commented section) */
function getObject(mx, my) {
	if (mx > width || my > height) {
		return 0;
	}

	//var gl = pg.elt.getContext('webgl');
	//var pix = getPixels();

	//var index = 4 * ((gl.drawingBufferHeight-my) * gl.drawingBufferWidth + mx);
   
    pg.loadPixels();
	var index = 4 * ((height-my) * width + mx);

	// var cor = color(
	// 	pix[index + 0],
	// 	pix[index + 1],
	// 	pix[index + 2],
	// 	pix[index + 3]);
	// return cor;
	//return pix[index]; // Only returning the red channel as the object index.
    console.log(pg.pixels[0] + " " + pg.pixels[1] + " " + pg.pixels[2]);
    //var pixel = pg.get(

	return {
        red : pg.pixels[0],
	 	green :pg.pixels[1],
        blue : pg.pixels[2]
    }
	// 	pix[index + 2],
	// 	pix[index + 3]);
	// return cor;

	//return pix[index]; // Only returning the red channel as the object index.
}

/* This function loads the pixels of the color buffer canvas into an array 
		called pixels and returns them. */
function getPixels() {
	var gl = pg.elt.getContext('webgl');
	var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
	gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	return (pixels);
}

function start(){
   started = true;
   loop();
}
