function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
}

function draw() {
  background(200);
  sphere(40);
  orbitControl();
}
