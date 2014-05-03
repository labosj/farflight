function FF_Achievement(id, name, description, isAchievedFunction) {
  this.id = id;
  this.name = name;
  this.description = description;
  this.unlocked = (window.localStorage.getItem("ff-ach-" + this.id) == "true");
  this.isAchievedFunction = isAchievedFunction;
}

FF_Achievement.prototype.achieve = function() {
  this.unlocked = true;
  window.localStorage.setItem("ff-ach-" + this.id, "true");
}

FF_Achievement.prototype.isAchieved = function(values) {
  if ( !this.unlocked && this.isAchievedFunction(values) ) {
    return true;
  }
  return false;
}

FF_Achievement.prototype.reset = function() {
  this.unlocked = false;
  window.localStorage.setItem("ff-ach-" + this.id, "false");
}

FF_Achievement.getCalmAchievements = function() {
 return [
	new FF_Achievement(200, "Snail'd It", "Stay at 10m/s at the beginning", function(values) { return values.currentSpeed >= 10; }),
	new FF_Achievement(201, "Need for Speed, literally", "Stay at 20m/s at the beginning", function(values) { return values.currentSpeed >= 20; }),
	new FF_Achievement(202, "Click please", "Stay at 30m/s at the beginning", function(values) { return values.currentSpeed >= 30; }),
	new FF_Achievement(203, "Lazy Finger", "Stay at 40m/s at the beginning", function(values) { return values.currentSpeed >= 40; }),
	new FF_Achievement(204, "Ok.", "Stay at 50m/s at the beginning", function(values) { return values.currentSpeed >= 50; }),
	new FF_Achievement(205, "Sweet Cruiser", "Stay at 60m/s at the beginning", function(values) { return values.currentSpeed >= 60; })
  ];
}

FF_Achievement.getGameOverAchievements = function() {
  return [
  new FF_Achievement(400, "Where is the Flight 815?", "Crash 1 time", function(values) { return values.totalDeaths >= 1; }),
	new FF_Achievement(401, "Area 51", "Crash 10 times", function(values) { return values.totalDeaths >= 10; }),
	new FF_Achievement(402, "Aliens!", "Crash 50 times", function(values) { return values.totalDeaths >= 50; }),
	new FF_Achievement(403, "More than pokemon, oh wait...", "Crash 151 times", function(values) { return values.totalDeaths >= 151; }),
	new FF_Achievement(404, "Vermudas Triangle, Stop", "Crash 500 times", function(values) { return values.totalDeaths >= 500; }),
	new FF_Achievement(405, "Damn, Mothership came", "Crash 1000 times", function(values) { return values.totalDeaths >= 1000; }),
	new FF_Achievement(406, "It's Over 9000!", "Crash 9000 times", function(values) { return values.totalDeaths >= 9000; })
  ];
}

FF_Achievement.getCurrentTimeAchievements = function() {
 return [
	new FF_Achievement(100, "Current Time 1", "Play for 1 minute in a game", function(values) { return values.currentTime >=    6000; }),
	new FF_Achievement(101, "Current Time 2", "Play for 2 minutes in a game", function(values) { return values.currentTime >=  12000; }),
	new FF_Achievement(102, "Current Time 3", "Play for 3 minutes in a game", function(values) { return values.currentTime >=  18000; }),
	new FF_Achievement(103, "Current Time 4", "Play for 5 minutes in a game", function(values) { return values.currentTime >=  30000; }),
	new FF_Achievement(104, "Current Time 5", "Play for 7 minutes in a game", function(values) { return values.currentTime >=  42000; }),
	new FF_Achievement(105, "Current Time 6", "Play for 10 minutes in a game", function(values) { return values.currentTime >= 60000; }),
	new FF_Achievement(106, "Current Time 7", "Play for 15 minutes in a game", function(values) { return values.currentTime >= 90000; })
  ];
}

FF_Achievement.getCurrentDistanceAchievements = function() {
 return [
  new FF_Achievement(0, "First flight", "Fly 1000 meters in a game"  , function(values) { return values.currentDistance >=   100000; }),
	new FF_Achievement(1, "Current Distance 2", "Fly 2500 meters in a game"  , function(values) { return values.currentDistance >=   250000; }),
	new FF_Achievement(2, "Current Distance 3", "Fly 5000 meters in a game"  , function(values) { return values.currentDistance >=   500000; }),
	new FF_Achievement(3, "Current Distance 4", "Fly 10000 meters in a game" , function(values) { return values.currentDistance >=  1000000; }),
	new FF_Achievement(4, "Current Distance 5", "Fly 25000 meters in a game" , function(values) { return values.currentDistance >=  2500000; }),
	new FF_Achievement(5, "Current Distance 6", "Fly 50000 meters in a game" , function(values) { return values.currentDistance >=  5000000; }),
	new FF_Achievement(6, "Current Distance 7", "Fly 100000 meters in a game", function(values) { return values.currentDistance >= 10000000; })
  ];
}

FF_Achievement.getTotalTimeAchievements = function() {
 return [
	new FF_Achievement(300, "Give it a shot!", "Play for 1 minute", function(values) { return values.totalTime >= 6000; }),
	new FF_Achievement(301, "Give it 2 shot!", "Play for 5 minutes", function(values) { return values.totalTime >= 30000; }),
	new FF_Achievement(302, "Give it... Just kidding", "Play for 15 minutes", function(values) { return values.totalTime >= 90000; }),
	new FF_Achievement(303, "Half Flight", "Play for 30 minutes", function(values) { return values.totalTime >= 180000; }),
	new FF_Achievement(304, "O'Clock!", "Play for 1 hour", function(values) { return values.totalTime >= 360000; }),
	new FF_Achievement(305, "Movie on its finest", "Play for 2 hours", function(values) { return values.totalTime >= 720000; }),
	new FF_Achievement(306, "Queues please...", "Play for 4 hours", function(values) { return values.totalTime >= 1440000; }),
	new FF_Achievement(307, "ProGamer!", "Play for 12 hours", function(values) { return values.totalTime >= 4320000; }),
	new FF_Achievement(308, "All-Day Long", "Play for 24 hours", function(values) { return values.totalTime >= 8640000; })
  ];
}

FF_Achievement.getTotalDistanceAchievements = function() {
 return [
	new FF_Achievement(500, "Total Distance 1", "Fly 1000 meters", function(values) { return values.totalDistance >= 100000; }),
	new FF_Achievement(501, "Total Distance 2", "Fly 5000 meters", function(values) { return values.totalDistance >= 500000; }),
	new FF_Achievement(502, "Total Distance 3", "Fly 10000 meters", function(values) { return values.totalDistance >= 1000000; }),
	new FF_Achievement(503, "Total Distance 4", "Fly 50000 meters", function(values) { return values.totalDistance >= 5000000; }),
	new FF_Achievement(504, "Total Distance 5", "Fly 100000 meters", function(values) { return values.totalDistance >= 10000000; }),
	new FF_Achievement(505, "Total Distance 6", "Fly 500000 meters", function(values) { return values.totalDistance >= 50000000; }),
	new FF_Achievement(506, "Total Distance 7", "Fly 1000000 meters", function(values) { return values.totalDistance >= 100000000; }),
	new FF_Achievement(507, "Total Distance 8", "Fly 5000000 meters", function(values) { return values.totalDistance >= 500000000; }),
	new FF_Achievement(508, "Total Distance 9", "Fly 10000000 meters", function(values) { return values.totalDistance >= 1000000000; })
  ];
}

FF_Achievement.getSpeedStartAchievements = function() {
 return [
	new FF_Achievement(600, "Usain Bolt on the house!", "Fly 700 meters in 10 seconds", function(values) { return values.currentDistance >= 70000; }),
	new FF_Achievement(601, "Speedy Gonzalez", "Fly 800 meters in 10 seconds", function(values) { return values.currentDistance >= 80000; }),
	new FF_Achievement(602, "Death Rally", "Fly 900 meters in 10 seconds", function(values) { return values.currentDistance >= 90000; }),
	new FF_Achievement(603, "F-11", "Fly 1000 meters in 10 seconds", function(values) { return values.currentDistance >= 100000; }),
	new FF_Achievement(604, "Flash", "Fly 1100 meters in 10 seconds", function(values) { return values.currentDistance >= 110000; }),
	new FF_Achievement(605, "Supernova", "Fly 1200 meters in 10 seconds", function(values) { return values.currentDistance >= 120000; })
  ];
}

FF_Achievement.getSocialAchievements = function() {
 return [
	new FF_Achievement(700, "FlightBook", "Open Far Flight facebook page", function() { return true; })
//	new FF_Achievement(701, "The bird told me", "Twitter Share", function() { return true; }),
  ];
}

FF_Achievement.reset = function(achievements) {
  for ( var i = 0 ; i < achievements.length ; i++ ) {
    achievements[i].reset();
  }
}