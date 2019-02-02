var d;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  img = loadImage('earth_day.jpg');
}

function draw() {
  background(0);
  texture(img);
  sphere(100);
  orbitControl();
}

