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

function FF_SplashMessageQueue() {
  this.messages = [];
}

FF_SplashMessageQueue.prototype.push = function(text, duration) {
  var message = new FF_SplashMessage();
  message.setMessage(text, duration);
  this.messages.push(message);
}

FF_SplashMessageQueue.prototype.advance = function(time) {
  this.messages[0].advance(time);
  if ( this.messages[0].time <= 0 )
    this.messages.shift();
}