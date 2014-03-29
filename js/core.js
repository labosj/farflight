function Camera(canvas) {
  this.position = [0.0, 100.0];
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
  this.offsetX = context.canvas.width  / 2.0;
  this.offsetY = context.canvas.height / 2.0;
  this.backgroundColor = "#000";
}

Drawer.prototype.setTitle = function() {
  this.backgroundColor = "#000";
}

Drawer.prototype.setGame = function() {
  this.backgroundColor = "#000";
}

Drawer.prototype.clearScreen = function() {
  this.context.fillStyle = this.backgroundColor;
  this.context.globalAlpha = 1.0;
  this.context.fillRect(0, 0, canvas.width, canvas.height);
}

Drawer.prototype.drawShape = function(shape) {
  this.camera.projectShape(shape);

  var alpha = (3000 - shape.positionZ) / 3000;
  if ( shape.positionZ > 3000.0 ) alpha = 0.0;

  this.context.strokeStyle = shape.color;
  this.context.globalAlpha = alpha;

  for ( var i = 0 ; i < this.edges.length ; ++i )
    this.drawEdge(this.camera.projectedVertexs[this.edges[i][0]], this.camera.projectedVertexs[this.edges[i][1]]);  
}

Drawer.prototype.drawEdge = function(vertex1, vertex2) {
  this.context.beginPath();
  this.context.moveTo(vertex1[0] + this.offsetX, vertex1[1] + this.offsetY);
  this.context.lineTo(vertex2[0] + this.offsetX, vertex2[1] + this.offsetY);
  this.context.stroke();
}

Drawer.prototype.drawTitleInfo = function(distance) {
  this.context.globalAlpha = 1.0;
  this.context.fillStyle = "yellow";
  this.context.textAlign = 'center';
  this.context.font = '15px monospace';
  this.context.fillText("Longest distance", 400, 25);
  this.context.font = '25px monospace';
  this.context.fillText((distance / 30) + ' m', 400, 50);

  this.context.font = '60px monospace';
  this.context.fillText('FAR FLIGHT', 400, 200);
  this.context.font = '20px monospace';
  this.context.fillText('by Edwin Rodriguez', 400, 230);
  this.context.font = '25px monospace';
  this.context.fillText('Click to start', 400, 350);
}

Drawer.prototype.drawInfo = function(distance, time, velocity) {
  this.context.globalAlpha = 1.0;
  this.context.fillStyle = "yellow";
  this.context.font = '15px monospace';
  this.context.textAlign = 'left';
  this.context.fillText("Velocity: " + velocity / 0.3 + ' m/s',25,520);
  this.context.fillText("Time:     " + (time / 100 >> 0) + ' s', 25,540);

  this.context.textAlign = 'center';
  this.context.fillText("Distance", 400, 25);
  this.context.font = '25px monospace';
  this.context.fillText((distance / 30 >> 0) + ' m', 400, 50);

  if ( game.gameState == 0 ) {
    this.context.textAlign = 'center';
    this.context.font = '60px monospace';
    this.context.fillText('FAR FLIGHT', 400, 200);
    this.context.font = '20px monospace';
    this.context.fillText('by Edwin Rodriguez', 400, 230);
    this.context.font = '25px monospace';
    this.context.fillText('Click to start', 400, 350);
  } else if ( game.gameState == 2 ) {
    this.context.textAlign = 'center';
    this.context.font = '40px monospace';
    this.context.fillText('GAME OVER', 400, 250);
    this.context.font = '25px monospace';
    this.context.fillText('You have crashed', 400, 280);
    this.context.fillText('Click to continue', 400, 350);
    this.context.font = '15px monospace';
    this.context.fillText(distance / 30 + ' meters in ' + time / 100 + ' seconds', 400, 300); 
  }
}

function Shape() {
  this.vertexs = [[1.0, 1.0, 1.0], [1.0, 0.0, 1.0], [-1.0, 1.0, 1.0], [-1.0, 0.0, 1.0], [1.0, 1.0, -1.0], [1.0, 0.0, -1.0], [-1.0, 1.0, -1.0], [-1.0, 0.0, -1.0]];
  this.positionX = 0.0;
  this.positionZ = 1000.0;
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
  vertex[0] = this.vertexs[index][0] * this.width + this.positionX;
  vertex[1] = this.vertexs[index][1] * this.height;
  vertex[2] = this.vertexs[index][2] * this.width + this.positionZ;
  return vertex;
}

Shape.prototype.reset = function() {
  this.positionX = Math.floor((Math.random() * 1000) - 500);
  this.positionZ += 3000.0;
  this.setShape(Math.floor((Math.random() * 20.0) + 50.0), 600.0);
  this.color = getColor();
}

Shape.prototype.nearest = function() { return this.getVertex(4)[2]; }

Shape.prototype.collideWithPoint = function(x, y) {
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

function copyVertex(source, target) {
  target[0] = source[0];
  target[1] = source[1];
  target[2] = source[2];
}

function getColor() {
  var color;
  if ( game.gameState == 1 ) color = (game.currentDistance / 1000) % 360;
  else color =  Math.floor((Math.random() * 360));
  return "hsl("+ color +", 100%, 50%)";
}

function Game() {
  this.currentDistance = 0;
  this.currentTime = 0;
  this.currentVelocity = 3.0;
  this.bestDistance = 0.0;
  this.shapes = [];
  this.gameState = 0; //0: TITLE, 1:GAME, 2:GAMEOVER

  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext("2d");

  this.camera = new Camera(this.canvas);
  this.drawer = new Drawer(this.context, this.camera);
}

Game.prototype.initShapes = function() {
  var step = 3000.0 / 20;
  for ( var i = 0 ; i < 20 ; i++ ) {
    var shape = new Shape();
    shape.reset();
    shape.positionZ = Math.floor(3000.0 - (step * i));
    shape.color = getColor();
    this.shapes[i] = shape;
  } 
}

Game.prototype.setGameOver = function() {
  this.gameState = 2;
  this.drawer.backgroundColor = "#700";

  if ( this.currentDistance > this.bestDistance ) {
    this.bestDistance = this.currentDistance;

    var highScore = document.getElementById('high-score');
    highScore.innerHTML = this.currentDistance / 30 + ' m';
  }

}

var game = new Game();
game.initShapes();

game.canvas.addEventListener("mousemove", function(event) {
  var rect = game.canvas.getBoundingClientRect();
  game.camera.setPosition(event.pageX - rect.left, event.pageY - rect.top)
}, false);

game.canvas.addEventListener("mousedown", function(event) {
  if ( game.gameState == 1 ) {
    game.currentVelocity += 3.0;
  } else if ( game.gameState == 2) {
    game.drawer.setTitle();
    game.gameState = 0;
    game.currentVelocity = 3.0;
  } else {
    game.gameState = 1;
    game.currentDistance = 0;
    game.currentTime = 0;
    game.currentVelocity = 3.0;
  }
}, false);

setInterval( function() {
  game.drawer.clearScreen();
  for ( var i = 0 ; i < game.shapes.length ; i++ ) {
    var shape = game.shapes[i];
    shape.positionZ -= game.currentVelocity;
    if ( shape.nearest() < 0.0 ) {
      if ( game.gameState == 1 && shape.collideWithPoint(game.camera.position[0], game.camera.position[1]) )
        game.setGameOver();
      shape.reset();
    }
    game.drawer.drawShape(shape);
  }
  
  if ( game.gameState == 1 ) {
    game.drawer.drawInfo(game.currentDistance, game.currentTime, game.currentVelocity);
    game.currentDistance += game.currentVelocity;
    game.currentTime++;
  } else if ( game.gameState == 2 ) {
    game.drawer.drawInfo(game.currentDistance, game.currentTime, game.currentVelocity);
  } else {
    game.drawer.drawTitleInfo(game.bestDistance);
  }
}, 10);