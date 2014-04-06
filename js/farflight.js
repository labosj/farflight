function FF_Camera(ratio) {
  this.far = 500.0;
  this.position = [0.0, 100.0];
  this.projectedCoords = [[0, 0, 0, 0], [0, 0, 0, 0]];
}

FF_Camera.prototype.projectShape = function(shape) {
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

FF_Camera.prototype.setRatio = function(ratio) {
  this.far = 500.0 * ratio;
}

function FF_SplashMessage() {
  this.duration = 0;
  this.text = 0;
  this.time = 0;
}

FF_SplashMessage.prototype.advance = function(time) {
  this.time -= time;
}

FF_SplashMessage.prototype.getAlpha = function() {
  return this.time / this.duration;
}

FF_SplashMessage.prototype.setMessage = function(text, duration) {
  this.text = text;
  this.duration = duration;
  this.time = duration;
}

function FF_Canvas(canvasId, width, height) {
  this.backgroundColor = "#000";
  this.camera = new FF_Camera();
  this.canvas = document.getElementById(canvasId);
  this.context = this.canvas.getContext("2d");
  this.offsetX;
  this.offsetY;
  this.splashMessage = new FF_SplashMessage();
  
  this.setSize(width, height);
}

FF_Canvas.prototype.clearScreen = function() {
  this.context.fillStyle = this.backgroundColor;
  this.context.globalAlpha = 1.0;
  this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

FF_Canvas.prototype.drawGameOverMessage = function(distance, time) {
  this.context.textAlign = 'center';
  this.setContextFont(40);
  this.drawText(words[5], 400, 250);
  this.setContextFont(25);
  this.drawText(words[6], 400, 280);
  this.drawText(words[7], 400, 350);
  this.setContextFont(15);
  this.drawText(this.replaceText2(words[8], distance / 30 >> 0, time / 100 >> 0), 400, 300);   
}

FF_Canvas.prototype.drawInfo = function(distance, time, speed) {
  this.context.globalAlpha = 1.0;
  this.context.fillStyle = "yellow";
  this.setContextFont(15);
  this.context.textAlign = 'left';
  this.drawText(this.replaceText1(words[9], speed), 25, 520);
  this.drawText(this.replaceText1(words[10], time / 100 >> 0), 25, 540);

  this.context.textAlign = 'center';
  this.drawText(words[11], 400, 25);
  this.setContextFont(25);
  this.drawText(this.replaceText1(words[1], distance / 100 >> 0), 400, 50);
}

FF_Canvas.prototype.drawLine = function(x1, y1, x2, y2) {
  this.context.beginPath();
  this.context.moveTo(this.camera.projectedCoords[0][x1] + this.offsetX, this.camera.projectedCoords[1][y1] + this.offsetY);
  this.context.lineTo(this.camera.projectedCoords[0][x2] + this.offsetX, this.camera.projectedCoords[1][y2] + this.offsetY);
  this.context.stroke();  
}

FF_Canvas.prototype.drawShape = function(shape) {
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

FF_Canvas.prototype.drawSplashMessage = function(time) {
  if ( this.splashMessage.time <= 0 ) return; 
  this.context.globalAlpha = this.splashMessage.getAlpha();
  this.context.fillStyle = "yellow";
  this.context.textAlign = 'center';
  this.setContextFont(40);
  this.drawText(this.splashMessage.text, 400, 250);
  this.splashMessage.advance(time);
}

FF_Canvas.prototype.drawText = function(text, posX, posY) {
  this.context.fillText(text, this.transform(posX), this.transform(posY));
}

FF_Canvas.prototype.drawTitleInfo = function(distance) {
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

FF_Canvas.prototype.replaceText1 = function(text, var1) {
  return text.replace("$1", var1);
}

FF_Canvas.prototype.replaceText2 = function(text, var1, var2) {
  return text.replace("$1", var1).replace("$2", var2);
}

FF_Canvas.prototype.setCameraPosition = function(eventX, eventY) {
  var pos = eventX - this.canvas.offsetLeft;
  if      ( pos < 0 )                 pos = 0 ;
  else if ( pos > this.canvas.width ) pos = this.canvas.width;
  this.camera.position[0] = (pos - this.offsetX) / this.ratio;
  
  pos = eventY - this.canvas.offsetTop;
  if      ( pos < 0 )                  pos = 0 ;
  else if ( pos > this.canvas.height ) pos = this.canvas.height;
  this.camera.position[1] = (this.canvas.height - pos) / this.ratio;
}

FF_Canvas.prototype.setContextFont = function(size) {
  this.context.font = this.transform(size) + 'px monospace'; 
}

FF_Canvas.prototype.setSize = function(width, height) {
  var heightWidth = height * 4.0 / 3.0;
  if ( width < heightWidth ) {
    this.canvas.width = width;
	this.canvas.height = width * 0.75;
  } else {
    this.canvas.width = heightWidth;
	this.canvas.height = height;
  }
    
  this.offsetX = this.canvas.width  / 2.0;
  this.offsetY = this.canvas.height / 2.0;
  this.ratio = this.canvas.width / 800.0;
  this.camera.setRatio(this.ratio);
}

FF_Canvas.prototype.showSplashMessage = function(message, duration) {
  this.splashMessage.setMessage(message, duration);
}

FF_Canvas.prototype.transform = function(coord) {
  return this.ratio * coord; 
}

function FF_Shape() {
  this.color = "green";
  this.dimension = [[0.0, 0.0], [0.0, 0.0]];
}

FF_Shape.prototype.advance = function(distance) {
  this.dimension[1][0] -= distance * 0.3;
  this.dimension[1][1] -= distance * 0.3;
}

FF_Shape.prototype.collideWithPoint = function(x) {
  if ( x < this.dimension[0][0] ) return false;
  if ( x > this.dimension[0][1] ) return false;
  return true;
}

FF_Shape.prototype.height = 600.0;

FF_Shape.prototype.init = function(posZ, color) {
  var posX = Math.floor((Math.random() * 1000) - 500);
  var width = Math.floor((Math.random() * 20.0) + 50.0);
  this.dimension[0][0] = posX - width;
  this.dimension[0][1] = posX + width;
  this.dimension[1][0] = posZ;
  this.dimension[1][1] = posZ + width * 2.0;
  this.color = color;
}

FF_Shape.prototype.isBehindCamera = function() {
  return this.dimension[1][0] < 0.0;
}

FF_Shape.prototype.reset = function(color) {
  this.init(3000.0 + this.dimension[1][0], color);
}

function FF_Timer(interval) {
  this.now = Date.now();
  this.then = this.now;
  this.delta = 0;
  this.interval = interval;
}

FF_Timer.prototype.advance = function() {
  this.now = Date.now();
  this.delta = this.now - this.then;
  if ( this.delta > this.interval ) {
    this.then = this.now;
    return true;
  }
  return false;
}

function FF_Game(canvasId, width, height) {
  this.bestDistance = window.localStorage.getItem("bestScore") || 0;
  this.bestDistanceBeated = false;

  this.currentDistance = 0;
  this.currentTime = 0;
  this.currentSpeed = 10.0;
  this.gameState = 0; //0: TITLE, 1:GAME, 2:GAMEOVER
  this.shapes = [];

  this.canvas = new FF_Canvas(canvasId, width, height);
  this.tutorialCounter = 0;

  this.actTimer = new FF_Timer(0);
  this.drawTimer = new FF_Timer(15);
  this.init();
}

FF_Game.prototype.accel = function() {
  this.currentSpeed += 10.0;
  this.canvas.showSplashMessage(words[12], 500);
}

FF_Game.prototype.advance = function() {
  this.actTimer.advance();
  var timeRatio = (this.actTimer.delta / 10.0);
  var currentSpeed = this.currentSpeed * timeRatio;
  var shape;
  for ( var i = 0 ; i < this.shapes.length ; i++ ) {
    shape = this.shapes[i];
    shape.advance(currentSpeed);
    if ( shape.isBehindCamera() ) {
      if ( this.gameState == 1 && shape.collideWithPoint(this.canvas.camera.position[0]) )
        this.setGameOver();
      shape.reset(this.getShapeColor());
    }
  }
  
  if ( this.gameState == 1 ) {
    if ( this.currentSpeed <= 10.0 ) {
		if ( this.tutorialCounter == 2 && this.currentTime > 700.0 ) {
		  this.canvas.showSplashMessage(words[13], 1500);
		  this.tutorialCounter++;
		} else if ( this.tutorialCounter == 1 && this.currentTime > 400.0 ) {
		  this.canvas.showSplashMessage(words[14], 1500);
		  this.tutorialCounter++;
		} else if ( this.tutorialCounter == 0 && this.currentTime > 100.0 ) {
		  this.canvas.showSplashMessage(words[15], 1500);
		  this.tutorialCounter++;
		}
	}
    if ( this.currentSpeed < 70.0 && this.currentTime / 1000.0 > this.currentSpeed ) this.accel();
    if ( !this.bestDistanceBeated && this.currentDistance > this.bestDistance) {
      this.canvas.showSplashMessage(words[16], 1500);
      this.bestDistanceBeated = true;
    }
    this.currentDistance += currentSpeed;
    this.currentTime += timeRatio;
  }
}

FF_Game.prototype.draw = function() {
  if ( this.drawTimer.advance() ) {
    this.canvas.clearScreen();
    for ( var i = 0 ; i < this.shapes.length ; i++ )
      this.canvas.drawShape(this.shapes[i]);
    
    if ( this.gameState == 1 ) {
      this.canvas.drawInfo(this.currentDistance, this.currentTime, this.currentSpeed);
      this.canvas.drawSplashMessage(this.drawTimer.delta);
    } else if ( this.gameState == 2 ) {
      this.canvas.drawInfo(this.currentDistance, this.currentTime, this.currentSpeed);
      this.canvas.drawGameOverMessage(this.currentDistance, this.currentTime, this.currentSpeed);
    } else {
      this.canvas.drawTitleInfo(this.bestDistance);
    }        
  }
}

FF_Game.prototype.getShapeColor = function() {
  var color;
  if ( this.gameState == 1 ) color = (this.currentDistance / 1000) % 360;
  else color =  Math.floor((Math.random() * 360));
  return "hsl("+ color +", 100%, 50%)";
}

FF_Game.prototype.init = function() {
  this.initShapes();

  var canvas = this.canvas;
  var game = this;

  canvas.canvas.addEventListener("mousemove", function(event) {
    canvas.setCameraPosition(event.pageX, event.pageY);
  }, false);


  canvas.canvas.addEventListener("mousedown", function(event) { game.pressButton(); }, false);

  setInterval( function() { game.advance(); }, 10);

  function draw() {
    requestAnimationFrame(draw);
    game.draw();
  }

  requestAnimationFrame(draw);
}

FF_Game.prototype.initShapes = function() {
  var step = 3000.0 / 20;
  var shape;
  for ( var i = 0 ; i < 20 ; i++ ) {
    shape = new FF_Shape();
    shape.init(Math.floor(3000.0 - (step * i)), this.getShapeColor());
    this.shapes[i] = shape;
  } 
}

FF_Game.prototype.pressButton = function() {
  if      ( this.gameState == 1 ) this.accel();
  else if ( this.gameState == 2 ) this.setGameTitle();
  else                            this.setGameStart();
}

FF_Game.prototype.setGameOver = function() {
  this.gameState = 2;
  this.canvas.backgroundColor = "#700";
  this.canvas.showSplashMessage("", 0);
  this.bestDistanceBeated = false;

  if ( this.currentDistance > this.bestDistance ) {
    this.bestDistance = this.currentDistance;
    window.localStorage.setItem("bestScore", this.bestDistance);
  }
}

FF_Game.prototype.setGameStart = function() {
  this.gameState = 1;
  this.currentDistance = 0;
  this.currentTime = 0;
  this.currentSpeed = 10.0;
}

FF_Game.prototype.setGameTitle = function() {
  this.canvas.backgroundColor = "#000";
  this.gameState = 0;
  this.currentSpeed = 10.0;  
}

FF_Game.prototype.setSize = function(width, height) {
  this.canvas.setSize(width, height);
}