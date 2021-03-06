(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var intervalId = Asteroids.intervalId

  Asteroid = Asteroids.Asteroid;
  Target = Asteroids.Target;
  Ship = Asteroids.Ship;

  var Game = Asteroids.Game = function(xDim, yDim, canvasEl) {
    this.canvas = canvasEl.getContext("2d");
    this.level = 0;

    this.DIM_X = xDim;
    this.DIM_Y = yDim;
    this.ship = this.makeShip(xDim, yDim);
    this.numAsteroids = this.level; 


    this.asteroids = this.addAsteroids(this.numAsteroids);
    this.target = Target.makeTarget(xDim, yDim, this.ship.pos, this.level);
    this.bullets = [];
  }

  Game.prototype.addAsteroids = function(numAst) {
    var allStroids = [];
    var that = this;
    for(var i = 0; i < numAst; i++) {
      allStroids.push(Asteroid.randomAsteroid(that.DIM_X, that.DIM_Y, that.ship.pos))
    };
    return allStroids;
  }

  Game.prototype.makeShip = function(xDim, yDim) {
    var pos = [xDim / 2, yDim / 2];
    return new Ship(pos, [0,0], 16, Ship.COLOR);
  }

  Game.prototype.draw = function(ctx) {

    ctx.fillStyle = "purple";
    ctx.fillRect(0, 0, this.DIM_X, this.DIM_Y);

    this.drawLevel(ctx);
    
    this.asteroids.forEach( function(asteroid) {
      asteroid.draw(ctx);
    })

    this.target.draw(ctx);

    this.ship.draw(ctx);
  };
  
  Game.prototype.drawLevel = function(ctx) {
    ctx.fillStyle = "222";
    ctx.font = "200pt Arial";
    ctx.fillText(this.level, this.DIM_X / 2 - 50, this.DIM_Y / 2 - 50);
  };

  Game.prototype.checkCollisions = function() {
    var ship = this.ship
    var target = this.target
    var that = this;
    this.asteroids.forEach( function(asteroid) {
      if( ship.isCollidedWith(asteroid) ){
        that.stop();
        that.level = 0;
        that.restart();
      }
    });

    if(ship.isCollidedWith(target)) {
      that.stop();
      that.level += 1
      that.restart();

    };
  };

  Game.prototype.step = function(ctx) {

    this.move();
    this.draw(ctx);
    this.checkCollisions();
    this.bindKeyHandlers(); // called here instead of #start for key ispressed function
  };

  Game.prototype.move = function() {
    var that = this

    this.asteroids.forEach( function(asteroid) {
      asteroid.move(that.DIM_X, that.DIM_Y);
    });

    this.target.move(that.DIM_X, that.DIM_Y);

    this.ship.move(that.DIM_X, that.DIM_Y);
  };

  Game.prototype.start = function() {
    var ctx = this.canvas;
    var game = this;
    intervalId = window.setInterval(function () {
      game.step(ctx);
    }, 30);
  };

  Game.prototype.restart = function() {

    var xDim = this.DIM_X
    var yDim = this.DIM_Y

    var numAsteroids = this.level

    this.ship = this.makeShip(xDim, yDim);
    this.asteroids = this.addAsteroids(numAsteroids);
    this.target = Target.makeTarget(xDim, yDim, this.ship.pos, this.level);
    this.bullets = [];
    this.start();
  };


  Game.prototype.stop = function() {
    window.clearInterval(intervalId)
  }

  Game.prototype.bindKeyHandlers = function() {
    var that = this;
    if(key.isPressed('up')) { 
      this.ship.power([0,-1]) 
    };
    if(key.isPressed('down')) { 
      this.ship.power([0,1]) 
    };
    if(key.isPressed('left')) { 
      this.ship.power([-1,0]) 
    };
    if(key.isPressed('right')) { 
      this.ship.power([1,0]) 
    };
    key('x', function() { that.stop() });
  }

  return root;
})(this);