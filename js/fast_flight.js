function Camera(canvas) {
  this.position = [0.0, 100.0]; // z is always 0.0
  //this.direction = [0.0, 0.0, 1.0];
  this.far = 500.0;
  this.projectedVertexs = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
  this.viewportHeight = canvas.height;
  this.viewportHalfWidth = canvas.width / 2;
}

Camera.prototype.setPosition = function(x, y) {
  this.position[0] = x - this.viewportHalfWidth;
  this.position[1] = this.viewportHeight - y;

  if      ( this.position[0] < -this.viewportHalfWidth ) this.position[0] = -this.viewportHalfWidth;
  else if ( this.position[0] >  this.viewportHalfWidth ) this.position[0] =  this.viewportHalfWidth;
  
  if      ( this.position[1] < 0 )                   this.position[1] = 0;
  else if ( this.position[1] > this.viewportHeight ) this.position[1] = this.viewportHeight; 
}

Camera.prototype.projectShape = function(shape) {
  for ( var i = 0, size = shape.vertexs.length ; i < size ; ++i ) {
    copyVertex(shape.getVertex(i), this.projectedVertexs[i]);
    this.projectVertex(this.projectedVertexs[i]);
  }
}

Camera.prototype.projectVertex = function(vertex) {  
  vertex[0] -= this.position[0];
  vertex[1] -= this.position[1];

  var scalar = this.far / vertex[2];

  vertex[0] *=  scalar;
  vertex[1] *= -scalar;
  vertex[2] *=  scalar;
}

function Drawer(context, camera) {
  this.context = context;
  this.camera = camera;
  this.edges = [[0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7], [4, 5], [4, 6], [5, 7], [7, 6]];
}

Drawer.prototype.clearScreen = function() {
  if ( gameState == 2 ) this.context.fillStyle = "#700";
  else this.context.fillStyle = "black";
  this.context.globalAlpha = 1.0;
  this.context.fillRect(0, 0, canvas.width, canvas.height);
}

Drawer.prototype.drawShape = function(shape) {
  this.camera.projectShape(shape);

  var alpha = (3000 - shape.position[2]) / 3000;
  if ( shape.position[2] > 3000.0 ) alpha = 0.0;

  context.strokeStyle = shape.color;
  context.globalAlpha = alpha;

  for ( var i = 0, size = this.edges.length ; i < size ; ++i )
    drawEdge(context, this.camera.projectedVertexs[this.edges[i][0]], this.camera.projectedVertexs[this.edges[i][1]]);  
}

Drawer.prototype.drawInfo = function() {
  context.globalAlpha = 1.0;
  context.fillStyle = "yellow";
  context.font = '15px monospace';
  context.textAlign = 'left';
  context.fillText("Velocity: " + velocity / 0.3 + ' m/s',25,520);
  context.fillText("Time:     " + (tickCounter / 100 >> 0) + ' s', 25,540);

  context.textAlign = 'center';
  context.fillText("Distance", 400, 25);
  context.font = '25px monospace';
  context.fillText((distanceCounter / 30 >> 0) + ' m', 400, 50);

  if ( gameState == 0 ) {
    context.textAlign = 'center';
    context.font = '60px monospace';
    context.fillText('FAST FLIGHT', 400, 200);
    context.font = '20px monospace';
    context.fillText('by Edwin Rodriguez', 400, 230);
    context.font = '25px monospace';
    context.fillText('Click to start', 400, 350);
  } else if ( gameState == 2 ) {
    context.textAlign = 'center';
    context.font = '40px monospace';
    context.fillText('GAME OVER', 400, 250);
    context.font = '25px monospace';
    context.fillText('You have crashed', 400, 280);
    context.fillText('Click to continue', 400, 350);
    context.font = '15px monospace';
    context.fillText(distanceCounter / 30 + ' meters in ' + tickCounter / 100 + ' seconds', 400, 300); 
  }
}

function Shape() {
  this.vertexs = [[1.0, 1.0, 1.0], [1.0, 0.0, 1.0], [-1.0, 1.0, 1.0], [-1.0, 0.0, 1.0], [1.0, 1.0, -1.0], [1.0, 0.0, -1.0], [-1.0, 1.0, -1.0], [-1.0, 0.0, -1.0]];
  this.position = [0.0, 0.0, 1000.0];
  this.width = 1.0;
  this.height = 1.0;
  this.color = "green";
}

Shape.prototype.setShape = function(width, height) {
  this.width = width;
  this.height = height;
}

Shape.prototype.getVertex = function(index) {
  var vertex = []
  vertex[0] = this.vertexs[index][0] * this.width;
  vertex[1] = this.vertexs[index][1] * this.height;
  vertex[2] = this.vertexs[index][2] * this.width;
  return addVertexs(vertex, this.position);
}

Shape.prototype.reset = function() {
  this.position[0] = Math.floor((Math.random() * 1000) - 500);
  this.position[2] += 3000.0;
  this.setShape(Math.floor((Math.random() * 20.0) + 50.0), 600.0);
  this.color = getColor();
}

Shape.prototype.nearest = function() { return this.getVertex(4)[2]; }

Shape.prototype.collideWithPoint = function(x, y)
{
  var maxX = this.getVertex(0)[0];
  var maxY = this.getVertex(0)[1];
  var minX = this.getVertex(3)[0];
  var minY = this.getVertex(3)[1];
  if ( x < minX ) return false;
  if ( x > maxX ) return false;
  if ( y < minY ) return false;
  if ( y > maxY ) return false;
  return true;
}

function addVertexs(vertex1, vertex2) { return [vertex1[0] + vertex2[0], vertex1[1] + vertex2[1], vertex1[2] + vertex2[2]]; }

function drawEdge(context, vertex1, vertex2) {
  var offsetX = context.canvas.width  / 2.0; 
  var offsetY = context.canvas.height / 2.0;

  context.beginPath();
  context.moveTo(vertex1[0] + offsetX, vertex1[1] + offsetY);
  context.lineTo(vertex2[0] + offsetX, vertex2[1] + offsetY);
  context.stroke();
}

function copyVertex(source, target) {
  target[0] = source[0];
  target[1] = source[1];
  target[2] = source[2];
}

function getColor() {
  var color;
  if ( gameState == 1 ) color = (distanceCounter / 1000) % 360;
  else color =  Math.floor((Math.random() * 360));
  return "hsl("+ color +", 100%, 50%)";
}

var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");

var camera = new Camera(canvas);
var drawer = new Drawer(context, camera);
var gameState = 0; //0: TITLE, 1:GAME, 2:GAMEOVER
var velocity = 3.0;

var shapes = [];
var step = 3000.0 / 20;

for ( var i = 0 ; i < 20 ; i++ ) {
  var shape = new Shape();
  shape.reset();
  shape.position[2] = Math.floor(3000.0 - (step * i));
  shape.color = getColor();
  shapes[i] = shape;
}

canvas.addEventListener("mousemove", function(event) {
  var rect = canvas.getBoundingClientRect();
  camera.setPosition(event.pageX - rect.left, event.pageY - rect.top)
}, false);

canvas.addEventListener("mousedown", function(event) {
  if ( gameState == 1 ) {
    velocity += 3.0;
  } else if ( gameState == 2) {
    gameState = 0;
    velocity = 3.0;
  } else {
    gameState = 1;
    distanceCounter = 0;
    tickCounter = 0;
    velocity = 3.0;
  }
}, false);

var distanceCounter = 0;
var tickCounter = 0;

setInterval( function()
{
  drawer.clearScreen();
  for ( var i = 0 ; i < shapes.length ; i++ ) {
    var shape = shapes[i];
    shape.position[2] -= velocity;
    if ( shape.nearest() < 0.0 ) {
      if ( gameState == 1 && shape.collideWithPoint(camera.position[0], camera.position[1]) ) gameState = 2;
      shape.reset();
    }
    drawer.drawShape(shape);
  }
  drawer.drawInfo();
  if ( gameState == 1 ) {
    distanceCounter += velocity;
    tickCounter++;
  }
}, 10);