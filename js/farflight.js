function Camera(canvas) {
  this.far = 500.0;
  this.position = [0.0, 100.0];
  this.projectedCoords = [[0, 0, 0, 0], [0, 0, 0, 0]];
  this.viewportHalfWidth = 400.0;
  this.viewportHeight = 600.0;
  this.ratio;
  this.setRatio(canvas.width)
}

Camera.prototype.setRatio = function(width) {
  this.ratio = width / 800.0;
  this.far = 500.0 * this.ratio;
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

Camera.prototype.setPosition = function(x, y) {
  this.position[0] = x / this.ratio - this.viewportHalfWidth;
  this.position[1] = this.viewportHeight - y / this.ratio;

  if      ( this.position[0] < -this.viewportHalfWidth ) this.position[0] = -this.viewportHalfWidth;
  else if ( this.position[0] >  this.viewportHalfWidth ) this.position[0] =  this.viewportHalfWidth;
  
  if      ( this.position[1] < 0 )                   this.position[1] = 0;
  else if ( this.position[1] > this.viewportHeight ) this.position[1] = this.viewportHeight; 
}

function Drawer(context, camera) {
  this.backgroundColor = "#000";
  this.camera = camera;
  this.context = context;
  this.offsetX = context.canvas.width  / 2.0;
  this.offsetY = context.canvas.height / 2.0;
  this.ingameMessage = "";
  this.ingameMessageTime = 0;
}

Drawer.prototype.clearScreen = function() {
  this.context.fillStyle = this.backgroundColor;
  this.context.globalAlpha = 1.0;
  this.context.fillRect(0, 0, canvas.width, canvas.height);
}

Drawer.prototype.transform = function(coord) {
  return this.camera.ratio * coord; 
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

Drawer.prototype.setContextFont = function(size) {
  this.context.font = this.transform(size) + 'px monospace'; 
}

Drawer.prototype.drawText = function(text, posX, posY) {
  this.context.fillText(text, this.transform(posX), this.transform(posY));
}

Drawer.prototype.setIngameMessage = function(message) {
  this.ingameMessage = message;
  this.ingameMessageTime = 1500.0;
}

Drawer.prototype.drawIngameMessage = function(time) {
  if ( this.ingameMessageTime <= 0 ) return; 
  this.context.globalAlpha = this.ingameMessageTime / 1500.0;
  this.context.fillStyle = "yellow";
  this.context.textAlign = 'center';
  this.setContextFont(40);
  this.drawText(this.ingameMessage, 400, 250);
  this.ingameMessageTime -= time;
}

Drawer.prototype.drawTitleInfo = function(distance) {
  this.context.globalAlpha = 1.0;
  this.context.fillStyle = "yellow";
  this.context.textAlign = 'center';
  this.setContextFont(15);
  this.drawText(words[0], 400, 25);
  this.setContextFont(25);
  this.drawText(this.replaceText1(words[1], distance / 30 >> 0), 400 , 50);

  this.setContextFont(60);
  this.drawText(words[2], 400, 200);
  this.setContextFont(20);
  this.drawText(words[3], 400, 230);
  this.setContextFont(25);
  this.drawText(words[4], 400, 350);
}

Drawer.prototype.drawGameOverMessage = function(distance, time) {
  this.context.textAlign = 'center';
  this.setContextFont(40);
  this.drawText(words[5], 400, 250);
  this.setContextFont(25);
  this.drawText(words[6], 400, 280);
  this.drawText(words[7], 400, 350);
  this.setContextFont(15);
  this.drawText(this.replaceText2(words[8], distance / 30 >> 0, time / 100 >> 0), 400, 300);   
}

Drawer.prototype.drawInfo = function(distance, time, speed) {
  this.context.globalAlpha = 1.0;
  this.context.fillStyle = "yellow";
  this.setContextFont(15);
  this.context.textAlign = 'left';
  this.drawText(this.replaceText1(words[9], speed), 25, 520);
  this.drawText(this.replaceText1(words[10], time / 100 >> 0), 25, 540);

  this.context.textAlign = 'center';
  this.drawText(words[11], 400, 25);
  this.setContextFont(25);
  this.drawText(this.replaceText1(words[1], distance / 30 >> 0), 400, 50);
}

Drawer.prototype.replaceText1 = function(text, var1) {
  return text.replace("$1", var1);
}

Drawer.prototype.replaceText2 = function(text, var1, var2) {
  return text.replace("$1", var1).replace("$2", var2);
}

function Shape() {
  this.color = "green";
  this.dimension = [[0.0, 0.0], [0.0, 0.0]];
}

Shape.prototype.advance = function(distance) {
  this.dimension[1][0] -= distance * 0.3;
  this.dimension[1][1] -= distance * 0.3;
}

Shape.prototype.isBehindCamera = function() {
  return this.dimension[1][0] < 0.0;
}

Shape.prototype.collideWithPoint = function(x) {
  if ( x < this.dimension[0][0] ) return false;
  if ( x > this.dimension[0][1] ) return false;
  return true;
}

Shape.prototype.init = function(posZ, color) {
  var posX = Math.floor((Math.random() * 1000) - 500);
  var width = Math.floor((Math.random() * 20.0) + 50.0);
  this.dimension[0][0] = posX - width;
  this.dimension[0][1] = posX + width;
  this.dimension[1][0] = posZ;
  this.dimension[1][1] = posZ + width * 2.0;
  this.color = color;
}

Shape.prototype.height = 600.0;

Shape.prototype.reset = function(color) {
  this.init(3000.0 + this.dimension[1][0], color);
}

function Timer(interval) {
  this.now = Date.now();
  this.then = this.now;
  this.delta = 0;
  this.interval = interval;
}

Timer.prototype.advance = function() {
  this.now = Date.now();
  this.delta = this.now - this.then;
  if ( this.delta > this.interval ) {
    this.then = this.now;
    return true;
  }
  return false;
}

function Game(canvasId) {
  this.currentDistance = 0;
  this.currentTime = 0;
  this.currentSpeed = 10.0;
  this.gameState = 0; //0: TITLE, 1:GAME, 2:GAMEOVER
  this.shapes = [];

  this.bestDistance = window.localStorage.getItem("bestScore") || 0;
  this.bestDistanceBeated = false;

  this.canvas = document.getElementById(canvasId);
  this.canvas.width = 320;//800;
  this.canvas.height = 240;//600;

  this.context = this.canvas.getContext("2d");

  this.camera = new Camera(this.canvas);
  this.drawer = new Drawer(this.context, this.camera);
  this.tutorialCounter = 0;

  this.actTimer = new Timer(0);
  this.drawTimer = new Timer(15);

  this.init();
}

Game.prototype.accel = function() {
  this.currentSpeed += 10.0;
  this.drawer.setIngameMessage(words[12]);
}

Game.prototype.advance = function() {
  this.actTimer.advance();
  var timeRatio = (this.actTimer.delta / 10.0);
  var currentSpeed = this.currentSpeed * timeRatio;
  var shape;
  for ( var i = 0 ; i < this.shapes.length ; i++ ) {
    shape = this.shapes[i];
    shape.advance(currentSpeed);
    if ( shape.isBehindCamera() ) {
      if ( this.gameState == 1 && shape.collideWithPoint(this.camera.position[0]) )
        this.setGameOver();
      shape.reset(this.getShapeColor());
    }
  }
  
  if ( this.gameState == 1 ) {
    if ( this.currentSpeed <= 10.0 ) {
		if ( this.tutorialCounter == 2 && this.currentTime > 700.0 ) {
		  this.drawer.setIngameMessage(words[13]);
		  this.tutorialCounter++;
		} else if ( this.tutorialCounter == 1 && this.currentTime > 400.0 ) {
		  this.drawer.setIngameMessage(words[14]);
		  this.tutorialCounter++;
		} else if ( this.tutorialCounter == 0 && this.currentTime > 100.0 ) {
		  this.drawer.setIngameMessage(words[15]);
		  this.tutorialCounter++;
		}
	}
    if ( this.currentSpeed < 70.0 && this.currentTime / 1000.0 > this.currentSpeed ) this.accel();
    if ( !this.bestDistanceBeated && this.currentDistance > this.bestDistance) {
      this.drawer.setIngameMessage(words[16]);
      this.bestDistanceBeated = true;
    }
    this.currentDistance += currentSpeed;
    this.currentTime += timeRatio;
  }
}

Game.prototype.draw = function() {
  if ( this.drawTimer.advance() ) {
    this.drawer.clearScreen();
    for ( var i = 0 ; i < this.shapes.length ; i++ )
      this.drawer.drawShape(this.shapes[i]);
    
    if ( this.gameState == 1 ) {
      this.drawer.drawInfo(this.currentDistance, this.currentTime, this.currentSpeed);
      this.drawer.drawIngameMessage(this.drawTimer.delta);
    } else if ( this.gameState == 2 ) {
      this.drawer.drawInfo(this.currentDistance, this.currentTime, this.currentSpeed);
      this.drawer.drawGameOverMessage(this.currentDistance, this.currentTime, this.currentSpeed);
    } else {
      this.drawer.drawTitleInfo(this.bestDistance);
    }        
  }
}

Game.prototype.init = function() {
  this.initShapes();

  var camera = this.camera;
  var game = this;

  this.canvas.addEventListener("mousemove", function(event) {
    camera.setPosition(event.pageX - canvas.offsetLeft,
                       event.pageY - canvas.offsetTop);
  }, false);


  this.canvas.addEventListener("mousedown", function(event) { game.pressButton(); }, false);

  setInterval( function() { game.advance(); }, 10);

  function draw() {
    requestAnimationFrame(draw);
    game.draw();
  }

  requestAnimationFrame(draw);
}

Game.prototype.initShapes = function() {
  var step = 3000.0 / 20;
  var shape;
  for ( var i = 0 ; i < 20 ; i++ ) {
    shape = new Shape();
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

Game.prototype.pressButton = function() {
  if      ( this.gameState == 1 ) this.accel();
  else if ( this.gameState == 2 ) this.setGameTitle();
  else                            this.setGameStart();
}

Game.prototype.setGameOver = function() {
  this.gameState = 2;
  this.drawer.backgroundColor = "#700";
  this.drawer.ingameMessageTime = 0;
  this.bestDistanceBeated = false;

  if ( this.currentDistance > this.bestDistance ) {
    this.bestDistance = this.currentDistance;
    window.localStorage.setItem("bestScore", this.bestDistance);
  }
}

Game.prototype.setGameTitle = function() {
  this.drawer.backgroundColor = "#000";
  this.gameState = 0;
  this.currentSpeed = 10.0;  
}

Game.prototype.setGameStart = function() {
  this.gameState = 1;
  this.currentDistance = 0;
  this.currentTime = 0;
  this.currentSpeed = 10.0;
}