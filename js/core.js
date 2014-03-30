function Camera(canvas) {
  this.position = [0.0, 100.0];
  this.far = 500.0;
  this.projectedCoords = [[0, 0, 0, 0], [0, 0, 0, 0]];
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
  this.projectedCoords[0][0] = this.projectedCoords[0][1] = shape.dimension[0][0] - this.position[0];
  this.projectedCoords[0][2] = this.projectedCoords[0][3] = shape.dimension[0][1] - this.position[0];

  this.projectedCoords[1][0] = this.projectedCoords[1][1] = -this.position[1];
  this.projectedCoords[1][2] = this.projectedCoords[1][3] = shape.height - this.position[1];

  var scalar = this.far / shape.dimension[1][0];

  this.projectedCoords[0][0] *=  scalar;
  this.projectedCoords[0][2] *=  scalar;
  this.projectedCoords[1][0] *= -scalar;
  this.projectedCoords[1][2] *= -scalar;

  scalar = this.far / shape.dimension[1][1];

  this.projectedCoords[0][1] *=  scalar;
  this.projectedCoords[0][3] *=  scalar;
  this.projectedCoords[1][1] *= -scalar;
  this.projectedCoords[1][3] *= -scalar;
}

function Drawer(context, camera) {
  this.context = context;
  this.camera = camera;
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

  var alpha = (3000 - shape.dimension[1][0]) / 3000;
  if ( shape.dimension[1][0] > 3000.0 ) alpha = 0.0;

  this.context.strokeStyle = shape.color;
  this.context.globalAlpha = alpha;

  this.drawLine(0, 2, 1, 3);
  this.drawLine(0, 2, 0, 0); 
  this.drawLine(0, 2, 2, 2); 
  
  this.drawLine(2, 0, 3, 1);
  this.drawLine(2, 0, 0, 0); 
  this.drawLine(2, 0, 2, 2);

  this.drawLine(3, 3, 1, 3); 
  this.drawLine(3, 3, 3, 1);  
  this.drawLine(3, 3, 2, 2);

  this.drawLine(1, 1, 1, 3); 
  this.drawLine(1, 1, 3, 1); 
  this.drawLine(1, 1, 0, 0); 
}

Drawer.prototype.drawLine = function(x1, y1, x2, y2) {
  this.context.beginPath();
  this.context.moveTo(this.camera.projectedCoords[0][x1] + this.offsetX, this.camera.projectedCoords[1][y1] + this.offsetY);
  this.context.lineTo(this.camera.projectedCoords[0][x2] + this.offsetX, this.camera.projectedCoords[1][y2] + this.offsetY);
  this.context.stroke();  
}

Drawer.prototype.drawTitleInfo = function(distance) {
  this.context.globalAlpha = 1.0;
  this.context.fillStyle = "yellow";
  this.context.textAlign = 'center';
  this.context.font = '15px monospace';
  this.context.fillText("Distance to beat", 400, 25);
  this.context.font = '25px monospace';
  this.context.fillText((distance / 30 >> 0) + ' m', 400, 50);

  this.context.font = '60px monospace';
  this.context.fillText('FAR FLIGHT', 400, 200);
  this.context.font = '20px monospace';
  this.context.fillText('by Edwin Rodriguez', 400, 230);
  this.context.font = '25px monospace';
  this.context.fillText('Click to start', 400, 350);
}

Drawer.prototype.drawGameOverMessage = function(distance, time) {
  this.context.textAlign = 'center';
  this.context.font = '40px monospace';
  this.context.fillText('GAME OVER', 400, 250);
  this.context.font = '25px monospace';
  this.context.fillText('You have crashed', 400, 280);
  this.context.fillText('Click to continue', 400, 350);
  this.context.font = '15px monospace';
  this.context.fillText((distance / 30 >> 0) + ' meters in ' + (time / 100 >> 0) + ' seconds', 400, 300);   
}

Drawer.prototype.drawInfo = function(distance, time, speed) {
  this.context.globalAlpha = 1.0;
  this.context.fillStyle = "yellow";
  this.context.font = '15px monospace';
  this.context.textAlign = 'left';
  this.context.fillText("Speed: " + speed / 0.3 + ' m/s',25,520);
  this.context.fillText("Time:  " + (time / 100 >> 0) + ' s', 25,540);

  this.context.textAlign = 'center';
  this.context.fillText("Distance", 400, 25);
  this.context.font = '25px monospace';
  this.context.fillText((distance / 30 >> 0) + ' m', 400, 50);
}

function Shape() {
  this.dimension = [[0.0, 0.0], [0.0, 0.0]];
  this.color = "green";
}

Shape.prototype.height = 600.0;

Shape.prototype.init = function(posZ, color) {
  var posX = Math.floor((Math.random() * 1000) - 500);
  var width = Math.floor((Math.random() * 20.0) + 50.0);
  this.dimension[0][0] = posX - width;
  this.dimension[0][1] = posX + width;
  this.dimension[1][0] = posZ;
  this.dimension[1][1] = posZ + width * 2.0;
  this.color = color;
}

Shape.prototype.collideWithPoint = function(x) {
  if ( x < this.dimension[0][0] ) return false;
  if ( x > this.dimension[0][1] ) return false;
  return true;
}

function Game() {
  this.currentDistance = 0;
  this.currentTime = 0;
  this.currentSpeed = 3.0;
  this.bestDistance = window.localStorage.getItem("bestScore") || 0;
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
    shape.init(Math.floor(3000.0 - (step * i)), this.getShapeColor());
    this.shapes[i] = shape;
  } 
}

Game.prototype.getShapeColor = function() {
  var color;
  if ( this.gameState == 1 ) color = (this.currentDistance / 1000) % 360;
  else color =  Math.floor((Math.random() * 360));
  return "hsl("+ color +", 100%, 50%)";
}

Game.prototype.setGameOver = function() {
  this.gameState = 2;
  this.drawer.backgroundColor = "#700";

  if ( this.currentDistance > this.bestDistance ) {
    this.bestDistance = this.currentDistance;
    window.localStorage.setItem("bestScore", this.bestDistance);
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
    game.currentSpeed += 3.0;
  } else if ( game.gameState == 2) {
    game.drawer.setTitle();
    game.gameState = 0;
    game.currentSpeed = 3.0;
  } else {
    game.gameState = 1;
    game.currentDistance = 0;
    game.currentTime = 0;
    game.currentSpeed = 3.0;
  }
}, false);

var actNow = Date.now();
var actThen = actNow;
var actDelta = 0;

setInterval( function() {
  actNow = Date.now();
  actDelta = actNow - actThen;
  actThen = actNow;
  var timeRatio = (actDelta / 10.0);
  var currentSpeed = game.currentSpeed * timeRatio;
  var shape;
  for ( var i = 0 ; i < game.shapes.length ; i++ ) {
    shape = game.shapes[i];
    shape.dimension[1][0] -= currentSpeed;
    shape.dimension[1][1] -= currentSpeed;
    if ( shape.dimension[1][0] < 0.0 ) { //shape meets the camera
      if ( game.gameState == 1 && shape.collideWithPoint(game.camera.position[0]) )
        game.setGameOver();
        shape.init(3000.0, game.getShapeColor());
    }
  }
  
  if ( game.gameState == 1 ) {
    game.currentDistance += currentSpeed;
    game.currentTime += timeRatio;
  }
}, 10);

var drawNow = Date.now();
var drawThen = drawNow;
var drawDelta;

function draw() {
  requestAnimationFrame(draw);
  drawNow = Date.now();
  drawDelta = drawNow - drawThen;
  if ( drawDelta > 15 ) {
    drawThen = drawNow;
    game.drawer.clearScreen();
    for ( var i = 0 ; i < game.shapes.length ; i++ )
      game.drawer.drawShape(game.shapes[i]);
    
    if ( game.gameState == 1 ) {
      game.drawer.drawInfo(game.currentDistance, game.currentTime, game.currentSpeed);
    } else if ( game.gameState == 2 ) {
      game.drawer.drawInfo(game.currentDistance, game.currentTime, game.currentSpeed);
      game.drawer.drawGameOverMessage(game.currentDistance, game.currentTime, game.currentSpeed);
    } else {
      game.drawer.drawTitleInfo(game.bestDistance);
    }        
  }
}
 
draw();