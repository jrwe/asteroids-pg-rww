/**
 * Asteroids Game 28/04/09
 *
 * (C) 2010 Kevin Roast kevtoast@yahoo.com @kevinroast
 * 
 * Please see: license.txt
 * You are welcome to use this code, but I would appreciate an email or tweet
 * if you do anything interesting with it!
 * 
 * 30/04/09 Initial version.
 * 12/05/10 Refactored to remove globals into GameHandler instance and added FPS controller game loop.
 * 14/05/10 Refactored asteroids.js into multiple files concatenated before minimize
 * 21/05/10 Powerups added!
 * 25/08/10 Oldskool vector graphics mode to replace simple circle asteroids
 * 
 * TODO LIST:
 * . Note Wave12 as "last" wave - show final score after!!
 * . Boss ship - large saucer takes lots of hits etc.
 * . Frame rate toggle keys in debug mode?
 * . Add circle>rectangle (or circle->line) intersection tests for player bullets (<- not worth the effort)
 * . Sounds - using HTML 5 <audio> tag
 *  - SoundManager - automatically plays sound from a given audio "channel" to allow multiple same sounds
 * . Cluster ship enemy - adjust initial asteroid count and enemy ship initial spawn wave
 * . Cloaked enemy saucer (doesn't stay cloaked)
 * . 3D graphics rendering mode (K3D) - replace BITMAPS flag with switch rendering mode
 * . High scores table, credits and keys.
 */


// Globals
var BITMAPS = true;
var DEBUG = false;
var GLOWEFFECT = true;
var SCOREDBKEY = "asteroids-score-1.0";

var g_asteroidImg1 = new Image();
var g_asteroidImg2 = new Image();
var g_asteroidImg3 = new Image();
var g_asteroidImg4 = new Image();
var g_shieldImg = new Image();
var g_backgroundImg = new Image();
var g_playerImg = new Image();
var g_enemyshipImg = new Image();

//PORT: device image
//joystick
var g_joystickImg = new Image();
var joystickX = 0;
var joystickY = 200;
var joystickRadius = 48;
var joystickPos = {minX:30, minY: 200, maxX:90, maxY:260};
var joystickUpPos = {minX:30, minY: 200, maxX:90, maxY:260};
var joystickLeftPos = {minX:0, minY: 230, maxX:60, maxY:290};
var joystickRightPos = {minX:60, minY: 230, maxX:120, maxY:290};
var joystickDownPos = {minX:30, minY: 260, maxX:90, maxY:320};


//fire button
var g_fireButtonImg = new Image();
var fireButtonX = 130;
var fireButtonY = 280;
var fireButtonPos = {minX:130, minY: 280, maxX:170, maxY:320};

//bomb button
var g_bombButtonImg = new Image();
var bombButtonX = 175;
var bombButtonY = 280;
var bombButtonPos = {minX:175, minY: 280, maxX:215, maxY:320};

//shield button
var g_shieldButtonImg = new Image();
var shieldButtonX = 120;
var shieldButtonY = 280;
var shieldButtonPos = {minX:220, minY: 280, maxX:260, maxY:320};

//pause button
var g_pauseButtonImg = new Image();
var pauseButtonX = 170;
var pauseButtonY = 280;
var pauseButtonPos = {minX:220, minY: 280, maxX:260, maxY:320};

//cheat button
var g_opencheatButtonImg = new Image();
var g_closecheatButtonImg = new Image();
var opencheatButtonX = 220;
var opencheatButtonY = 280;
var opencheatButtonPos = {minX:220, minY: 280, maxX:260, maxY:320};
var cheatMenuOpened = false;

var g_cheatMenuImg = new Image();
var cheatMenuX = 70;
var cheatMenuY = 280;
var cheatLPos = {minX:220, minY: 280, maxX:260, maxY:320};
var cheatRPos = {minX:220, minY: 280, maxX:260, maxY:320};
var cheatAPos = {minX:220, minY: 280, maxX:260, maxY:320};
var cheatEPos = {minX:220, minY: 280, maxX:260, maxY:320};

//logo
var g_logoImg = new Image();


//PORT : recalc buttons pos based on canvas size
function reCalculateSize(){
	var w =  canvas.width, h = canvas.height;
	joystickY = h - 100;
	
	joystickUpPos = {minX:24, minY: joystickY, maxX:72, maxY:joystickY + 48};
	joystickLeftPos = {minX:0, minY: joystickY+24, maxX:48, maxY:joystickY+72};
	joystickRightPos = {minX:48, minY: joystickY, maxX:96, maxY:joystickY + 72};
	joystickDownPos = {minX:24, minY: joystickY + 48, maxX:72, maxY:joystickY + 96};
	
	joystickCenter = {x: joystickX+48, y: joystickY+48};
	
	joystickPos = {minX:joystickX, minY: joystickY, maxX:joystickX+96, maxY:joystickY+96};
	
	fireButtonX = w - 45;
	fireButtonY = h - 40;
	fireButtonPos = {minX:fireButtonX, minY: fireButtonY, maxX:fireButtonX+40, maxY:fireButtonY + 40};
	
	bombButtonX = w - 95
	bombButtonY = h - 40;
	bombButtonPos = {minX:bombButtonX, minY: bombButtonY, maxX:bombButtonX+40, maxY:bombButtonY + 40};
	
	shieldButtonY = h - 40;
	shieldButtonPos = {minX:120, minY: shieldButtonY, maxX:160, maxY:shieldButtonY + 40};
		
	pauseButtonY = h - 40;
	pauseButtonPos = {minX:pauseButtonX, minY: pauseButtonY, maxX:pauseButtonX + 40, maxY: pauseButtonY + 40};
	
	opencheatButtonX = w - 45;
	opencheatButtonY = 20;
	opencheatButtonPos = {minX:opencheatButtonX, minY: opencheatButtonY, maxX:opencheatButtonX+40, maxY:opencheatButtonY+40};
	
	cheatMenuX = w - 45;
	cheatMenuY = 70;
	
	cheatLPos = {minX:cheatMenuX, minY: cheatMenuY, maxX:cheatMenuX+36, maxY:cheatMenuY+40};
	cheatRPos = {minX:cheatMenuX, minY: cheatMenuY+41, maxX:cheatMenuX+36, maxY:cheatMenuY+82};
	cheatAPos = {minX:cheatMenuX, minY: cheatMenuY+83, maxX:cheatMenuX+36, maxY:cheatMenuY+123};
	cheatEPos = {minX:cheatMenuX, minY: cheatMenuY+124, maxX:cheatMenuX+36, maxY:cheatMenuY+165};
}


/**
 * Global window onload handler
 */
function onloadHandler()
{
	reCalculateSize();
	
   // load our global bits
   /*if (soundManager)
   {
      soundManager.createSound({
       id: 'laser',
       url: 'sounds/plasma.ogg',
       autoLoad: true
      });
   }*/
   // attach to the image onload handler
   // once the background is loaded, we can boot up the game
   g_backgroundImg.src = 'images/bg3.jpg';
   g_backgroundImg.onload = function()
   {
      // init our game with Game.Main derived instance
      GameHandler.init();
      GameHandler.start(new Asteroids.Main());
   };
}


/**
 * Asteroids root namespace.
 * 
 * @namespace Asteroids
 */
if (typeof Asteroids == "undefined" || !Asteroids)
{
   var Asteroids = {};
}


/**
 * Asteroids main game class.
 * 
 * @namespace Asteroids
 * @class Asteroids.Main
 */
(function()
{
   Asteroids.Main = function()
   {
      Asteroids.Main.superclass.constructor.call(this);
      
      var attractorScene = new Asteroids.AttractorScene(this);
      
      // get the images graphics loading
      var loader = new Game.Preloader();
      loader.addImage(g_playerImg, 'images/player.png');
      loader.addImage(g_asteroidImg1, 'images/asteroid1.png');
      loader.addImage(g_asteroidImg2, 'images/asteroid2.png');
      loader.addImage(g_asteroidImg3, 'images/asteroid3.png');
      loader.addImage(g_asteroidImg4, 'images/asteroid4.png');
      loader.addImage(g_shieldImg, 'images/shield.png');
      loader.addImage(g_enemyshipImg, 'images/enemyship1.png');      
      //PORT:image
      loader.addImage(g_joystickImg, 'images/vjoystick.png');
      loader.addImage(g_fireButtonImg, 'images/fire.png');
      loader.addImage(g_bombButtonImg, 'images/bomb.png');
      loader.addImage(g_shieldButtonImg, 'images/shield_button.png');
      loader.addImage(g_pauseButtonImg, 'images/pause.png');
      loader.addImage(g_opencheatButtonImg, 'images/cheat.png');
      loader.addImage(g_closecheatButtonImg, 'images/close-cheat.png');
      loader.addImage(g_cheatMenuImg, 'images/cheats.png');
      loader.addImage(g_logoImg, 'images/rewire-logo.png');
      
      
      // the attactor scene is displayed first and responsible for allowing the
      // player to start the game once all images have been loaded
      loader.onLoadCallback(function() {
         attractorScene.ready();
      });
      
      // generate the single player actor - available across all scenes
      this.player = new Asteroids.Player(new Vector(GameHandler.width / 2, GameHandler.height / 2), new Vector(0.0, 0.0), 0.0);
      
      // add the attractor scene
      this.scenes.push(attractorScene);
      
      // add the level scenes
      for (var level, i=0; i<12; i++)
      {
         level = new Asteroids.GameScene(this, i+1);
         this.scenes.push(level);
      }
      
      // add the congratulations scene after all levels completed
      this.scenes.push(new Asteroids.GameCompleted(this));
      
      // set special end scene member value to a Game Over scene
      this.endScene = new Asteroids.GameOverScene(this);
      
      // generate background starfield
      for (var star, i=0; i<this.STARFIELD_SIZE; i++)
      {
         star = new Asteroids.Star();
         star.init();
         this.starfield.push(star);
      }
      
      // load high score from HTML5 local storage
      if (localStorage)
      {
         var highscore = localStorage.getItem(SCOREDBKEY);
         if (highscore)
         {
            this.highscore = highscore;
         }
      }
   };
   
   extend(Asteroids.Main, Game.Main,
   {
      STARFIELD_SIZE: 32,
      
      /**
       * Reference to the single game player actor
       */
      player: null,
      
      /**
       * Lives count before reset to Wave 1
       */
      lives: 3,
      
      /**
       * Current game score
       */
      score: 0,
      
      /**
       * High score
       */
      highscore: 0,
      
      /**
       * Last score
       */
      lastscore: 0,
      
      /**
       * Background scrolling bitmap x position
       */
      backgroundX: 0,
      
      /**
       * Background starfield star list
       */
      starfield: [],
      
      /**
       * Main game loop event handler method.
       */
      onRenderGame: function onRenderGame(ctx)
      {
         // setup canvas for a render pass and apply background
         if (BITMAPS)
         {
        	 //console.log('onRenderGame');
            // draw a scrolling background image
            ctx.drawImage(g_backgroundImg, this.backgroundX++, 0, GameHandler.width, GameHandler.height, 0, 0, GameHandler.width, GameHandler.height);
        	 //ctx.drawImage(g_backgroundImg, this.backgroundX++, 0, 640, 480, 0, 0, 640, 480);
            //console.log(this.backgroundX++, 0, GameHandler.width, GameHandler.height, 0, 0, GameHandler.width, GameHandler.height);
            if (this.backgroundX == (g_backgroundImg.width / 2))
            {
               this.backgroundX = 0;
            }
            ctx.shadowBlur = 0;
         }
         else
         {
            // clear the background to black
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, GameHandler.width, GameHandler.height);
            
            // glowing vector effect shadow
            ctx.shadowBlur = GLOWEFFECT ? 8 : 0;
            
            // update and render background starfield effect
            this.updateStarfield(ctx);
         }
      },
      
      isGameOver: function isGameOver()
      {
         var over = (this.lives === 0 && (this.currentScene.effects && this.currentScene.effects.length === 0));
         if (over)
         {
            // reset player ready for game restart
            this.lastscore = this.score;
            this.score = 0;
            this.lives = 3;
         }
         return over;
      },
      
      /**
       * Update each individual star in the starfield background
       */
      updateStarfield: function updateStarfield(ctx)
      {
         for (var s, i=0, j=this.starfield.length; i<j; i++)
         {
            s = this.starfield[i];
            
            s.render(ctx);
            
            s.z -= s.VELOCITY * 0.1;
            
            if (s.z < 0.1 || s.prevx > GameHandler.height || s.prevy > GameHandler.width)
            {
               // reset and reuse the star if its moved off the display area
               s.init();
            }
         }
      }
   });
})();


/**
 * Asteroids Attractor scene class.
 * 
 * @namespace Asteroids
 * @class Asteroids.AttractorScene
 */
(function()
{
   Asteroids.AttractorScene = function(game)
   {
      this.game = game;
      
      Asteroids.AttractorScene.superclass.constructor.call(this, false, null);
   };
   
   extend(Asteroids.AttractorScene, Game.Scene,
   {
      game: null,
      start: false,
      imagesLoaded: false,
      fadeRGB: 0,
      fadeIncrement: 0,
      sine: 0,
      mult: 0,
      multIncrement: 0,
      
      /**
       * Scene completion polling method
       */
      isComplete: function isComplete()
      {
         return this.start;
      },
      
      onInitScene: function onInitScene()
      {
         this.start = false;
         this.fadeRGB = 0;
         this.fadeIncrement = 0.01;
         this.mult = 512;
         this.multIncrement = 1;
      },
      
      onRenderScene: function onRenderScene(ctx)
      {
         this.fadeRGB += this.fadeIncrement;
         if (this.fadeRGB > 1.0)
         {
            this.fadeRGB = 1.0;
            this.fadeIncrement = -this.fadeIncrement;
         }
         else if (this.fadeRGB < 0)
         {
            this.fadeRGB = 0;
            this.fadeIncrement = -this.fadeIncrement;
         }
         this.sineText(ctx, "ASTEROIDS");
         
         var f = (BITMAPS ? Game.fillText : Game.drawText);
         if (this.imagesLoaded)
         {
            var colour = "rgba(255,255,255," + this.fadeRGB + ")";
            f(ctx, "TAP to continue", "10pt Courier New", GameHandler.width/2 - 70, GameHandler.height/2, colour);
            
            f(ctx, "Original game by Kevin Roast", "15pt Courier New", GameHandler.width/2 - 170, GameHandler.height-50, "white");
            f(ctx, "Powered for Touch by", "15pt Courier New", GameHandler.width/2 - 190, GameHandler.height-20, "white");
            
            ctx.drawImage(g_logoImg , GameHandler.width/2 + 35, GameHandler.height-69);
            
         }
         else
         {
            f(ctx, "Please wait... Loading Images...", "10pt Courier New", GameHandler.width/2 - 110, GameHandler.height/2, "white");
         }
      },
      
      /**
       * Callback from image preloader when all images are ready
       */
      ready: function ready()
      {
         this.imagesLoaded = true;
      },
      
      /**
       * Render the a text string in a pulsing x-sine y-cos wave pattern
       * The multiplier for the sinewave is modulated over time
       */
      sineText: function sineText(ctx, txt)
      {
         this.mult += this.multIncrement;
         if (this.mult > 1024)
         {
            this.multIncrement = -this.multIncrement;
         }
         else if (this.mult < 128)
         {
            this.multIncrement = -this.multIncrement;
         }
         var offset = this.sine;
         var xpos = (GameHandler.width/2 - 125);
         var ypos = (GameHandler.height/2 - 48);
         for (var i=0, j=txt.length; i<j; i++)
         {
            var y = ypos + (Math.sin(offset) * RAD) * this.mult;
            var x = xpos + (Math.cos(offset++) * RAD) * (this.mult/2);
            var f = (BITMAPS ? Game.fillText : Game.drawText);
            f(ctx, txt[i], "20pt Courier New", x + i*30, y, "white");
         }
         this.sine += 0.10;
      },
      
      //PORT : TAP to play game
      onTouchStart: function(e){
    	  
    	  if (this.imagesLoaded)
          {
             this.start = true;
          }
          return true;
      },
      
      //TODO : remove keuboard code
      onKeyDownHandler: function onKeyDownHandler(keyCode)
      {
         switch (keyCode)
         {
            case KEY.SPACE:
            {
               if (this.imagesLoaded)
               {
                  this.start = true;
               }
               return true;
               break;
            }
            
            case KEY.R:
            {
               // switch rendering modes
               BITMAPS = !BITMAPS;
               return true;
               break;
            }
         }
      }
   });
})();


/**
 * Asteroids GameOver scene class.
 * 
 * @namespace Asteroids
 * @class Asteroids.GameOverScene
 */
(function()
{
   Asteroids.GameOverScene = function(game)
   {
      this.game = game;
      this.player = game.player;
      
      // construct the interval to represent the Game Over text effect
      var interval = new Game.Interval("GAME OVER", this.intervalRenderer);
      Asteroids.GameOverScene.superclass.constructor.call(this, false, interval);
   };
   
   extend(Asteroids.GameOverScene, Game.Scene,
   {
      game: null,
      
      /**
       * Scene completion polling method
       */
      isComplete: function isComplete()
      {
         return true;
      },
      
      intervalRenderer: function intervalRenderer(interval, ctx)
      {
         if (interval.framecounter++ === 0)
         {
            if (this.game.lastscore === this.game.highscore)
            {
               // save new high score to HTML5 local storage
               if (localStorage)
               {
                  localStorage.setItem(SCOREDBKEY, this.game.lastscore);
               }
            }
         }
         if (interval.framecounter < 150)
         {
            Game.fillText(ctx, interval.label, "18pt Courier New", GameHandler.width/2 - 64, GameHandler.height/2 - 32, "white");
            Game.fillText(ctx, "Score: " + this.game.lastscore, "14pt Courier New", GameHandler.width/2 - 64, GameHandler.height/2, "white");
            if (this.game.lastscore === this.game.highscore)
            {
               Game.fillText(ctx, "New High Score!", "14pt Courier New", GameHandler.width/2 - 64, GameHandler.height/2 + 24, "white");
            }
         }
         else
         {
            interval.complete = true;
         }
      }
   });
})();


/**
 * Asteroids GameCompleted scene class.
 * 
 * @namespace Asteroids
 * @class Asteroids.GameCompleted
 */
(function()
{
   Asteroids.GameCompleted = function(game)
   {
      this.game = game;
      this.player = game.player;
      
      // construct the interval to represent the Game Completed text effect
      var interval = new Game.Interval("CONGRATULATIONS!", this.intervalRenderer);
      Asteroids.GameCompleted.superclass.constructor.call(this, false, interval);
   };
   
   extend(Asteroids.GameCompleted, Game.Scene,
   {
      game: null,
      
      /**
       * Scene completion polling method
       */
      isComplete: function isComplete()
      {
         return true;
      },
      
      intervalRenderer: function intervalRenderer(interval, ctx)
      {
         if (interval.framecounter++ === 0)
         {
            if (this.game.lastscore === this.game.highscore)
            {
               // save new high score to HTML5 local storage
               if (localStorage)
               {
                  localStorage.setItem(SCOREDBKEY, this.game.lastscore);
               }
            }
         }
         if (interval.framecounter < 500)
         {
            Game.fillText(ctx, interval.label, "18pt Courier New", GameHandler.width/2 - 96, GameHandler.height/2 - 32, "white");
            Game.fillText(ctx, "Score: " + this.game.lastscore, "14pt Courier New", GameHandler.width/2 - 64, GameHandler.height/2, "white");
            if (this.game.lastscore === this.game.highscore)
            {
               Game.fillText(ctx, "New High Score!", "14pt Courier New", GameHandler.width/2 - 64, GameHandler.height/2 + 24, "white");
            }
         }
         else
         {
            interval.complete = true;
         }
      },
      //PORT
      onTouchStart: function onTouchStart(e){
    	  
      }
   });
})();


/**
 * Asteroids Game scene class.
 * 
 * @namespace Asteroids
 * @class Asteroids.GameScene
 */
(function()
{
   Asteroids.GameScene = function(game, wave)
   {
      this.game = game;
      this.wave = wave;
      this.player = game.player;
      
      // construct the interval to represent the "Wave XX" text effect
      var interval = new Game.Interval("Wave " + wave, this.intervalRenderer);
      Asteroids.GameScene.superclass.constructor.call(this, true, interval);
   };
   
   extend(Asteroids.GameScene, Game.Scene,
   {
      game: null,
      
      wave: 0,
      
      /**
       * Key input values
       */
      input:
      {
         left: false,
         right: false,
         thrust: false,
         shield: false,
         fireA: false,
         fireB: false
      },
      
      /**
       * Local reference to the game player actor
       */
      player: null,
      
      /**
       * Top-level list of game actors sub-lists
       */
      actors: null,
      
      /**
       * List of player fired bullet actors
       */
      playerBullets: null,
      
      /**
       * List of enemy actors (asteroids, ships etc.)
       */
      enemies: null,
      
      /**
       * List of enemy fired bullet actors
       */
      enemyBullets: null,
      
      /**
       * List of effect actors
       */
      effects: null,
      
      /**
       * List of collectables actors
       */
      collectables: null,
      
      /**
       * Enemy ships on screen (limited)
       */
      enemyShipCount: 0,
      
      /**
       * Displayed score (animates towards actual score)
       */
      scoredisplay: 0,
      
      /**
       * Level skip flag
       */
      skipLevel: false,
      
      /**
       * Scene init event handler
       */
      onInitScene: function onInitScene()
      {
         // generate the actors and add the actor sub-lists to the main actor list
         this.actors = [];
         this.enemies = [];
         this.actors.push(this.enemies);
         this.actors.push(this.playerBullets = []);
         this.actors.push(this.enemyBullets = []);
         this.actors.push(this.effects = []);
         this.actors.push(this.collectables = []);
         
         this.resetPlayerActor(this.wave !== 1);
         
         // randomly generate some asteroids
         var factor = 1.0 + ((this.wave - 1) * 0.15);
         for (var i=1, j=(4+this.wave); i<j; i++)
         {
            this.enemies.push(this.generateAsteroid(factor));
         }
         
         // reset interval flag
         this.interval.reset();
         this.skipLevel = false;
      },
      
      /**
       * Restore the player to the game - reseting position etc.
       */
      resetPlayerActor: function resetPlayerActor(persistPowerUps)
      {
         this.actors.push([this.player]);
         
         // reset the player position
         with (this.player)
         {
            position.x = GameHandler.width / 2;
            position.y = GameHandler.height / 2;
            vector.x = 0.0;
            vector.y = 0.0;
            heading = 0.0;
            reset(persistPowerUps);
         }
         
         // reset keyboard input values
         with (this.input)
         {
            left = false;
            right = false;
            thrust = false;
            shield = false;
            fireA = false;
            fireB = false;
         }
      },
      
      /**
       * Scene before rendering event handler
       */
      onBeforeRenderScene: function onBeforeRenderScene()
      {    	  
         // handle key input
         if (this.input.left)
         {
            // rotate anti-clockwise
            this.player.heading -= 8.0;
         }
         if (this.input.right)
         {
            // rotate clockwise
            this.player.heading += 8.0;
         }
         if (this.input.thrust)
         {
            this.player.thrust();
         }
         if (this.input.shield)
         {
            if (!this.player.expired())
            {
               // activate player shield
               this.player.activateShield();
            }
         }
         if (this.input.fireA)
         {
            this.player.firePrimary(this.playerBullets);
         }
         if (this.input.fireB)
         {
            this.player.fireSecondary(this.playerBullets);
         }
         
         // add an enemy ever N frames (depending on wave factor)
         // later waves can have 2 ships on screen - earlier waves have one
         if (this.enemyShipCount <= (this.wave < 5 ? 0 : 1) && (GameHandler.frameCount % (500 - (this.wave << 5)) === 0))
         {
            this.enemies.push(new Asteroids.EnemyShip(this, (this.wave < 3 ? 0 : randomInt(0, 1))));
            this.enemyShipCount++;
         }
         
         // update all actors using their current vector
         this.updateActors();
      },
      
      /**
       * Scene rendering event handler
       */
      onRenderScene: function onRenderScene(ctx)
      {    	 
         // render the game actors
         this.renderActors(ctx);
         
         if (DEBUG && DEBUG.COLLISIONRADIUS)
         {
            this.renderCollisionRadius(ctx);
         }
         
         // render info overlay graphics
         this.renderOverlay(ctx);
         
         // detect bullet collisions
         this.collisionDetectBullets();
         
         // detect player collision with asteroids etc.
         if (!this.player.expired())
         {
            this.collisionDetectPlayer();
         }
         else
         {
            // if the player died, then respawn after a short delay and
            // ensure that they do not instantly collide with an enemy
            if (this.player.killedOnFrame + 80 < GameHandler.frameCount)
            {
               // perform a test to check no ememy is close to the player
               var tooClose = false;
               var playerPos = new Vector(GameHandler.width / 2, GameHandler.height / 2);
               for (var i=0, j=this.enemies.length; i<j; i++)
               {
                  var enemy = this.enemies[i];
                  if (playerPos.distance(enemy.position) < 80)
                  {
                     tooClose = true;
                     break;
                  }
               }
               if (tooClose === false)
               {
                  this.resetPlayerActor();
               }
            }
         }
      },
      
      /**
       * Scene completion polling method
       */
      isComplete: function isComplete()
      {
         return (this.skipLevel || (this.enemies.length === 0 && this.effects.length === 0));
      },
      
      intervalRenderer: function intervalRenderer(interval, ctx)
      {
         if (interval.framecounter++ < 50)
         {
            var f = (BITMAPS ? Game.fillText : Game.drawText);
            f(ctx, interval.label, "18pt Courier New", GameHandler.width/2 - 48, GameHandler.height/2 - 8, "white");
         }
         else
         {
            interval.complete = true;
         }
      },
      
      /**
       * Scene onTouchStart method
       */
      onTouchStart: function onTouchStart(touches, isStart){
    	 // console.log(e);
    	  
    	  if(isStart){
	    	  this.input.left = false;
	    	  this.input.right = false;
	    	  this.input.thrust = false;
	    	  this.input.shield = false;
	    	  this.input.fireA = false;
	    	  this.input.fireB = false;
    	  }
    	  
    	  if(touches.length === 0)
    		  return true;
    	  
    	  for(var i=0, l=touches.length; i<l; i++){
    		  
    		  var e = touches[i];
    	  
	    	  var x = e.clientX, y=e.clientY;
	    	  
	    	  if(x>= joystickPos.minX && x<=joystickPos.maxX && y>=joystickPos.minY && y<=joystickPos.maxY){
	    		  var angle = Math.atan2(joystickCenter.y - y, joystickCenter.x - x)/RAD;
	        	  this.player.heading = Math.floor((angle-90)/8) * 8;
	        	  this.player.vector.x = (x - joystickCenter.x)*this.player.MAX_PLAYER_VELOCITY/(joystickRadius*1.41);
	        	  this.player.vector.y = (y - joystickCenter.y)*this.player.MAX_PLAYER_VELOCITY/(joystickRadius*1.41);
	        	  this.player.engineThrust = true;
	    	  }    	  
	    	  
	    	  /*if(x>=joystickUpPos.minX && x<=joystickUpPos.maxX && y>=joystickUpPos.minY && y<=joystickUpPos.maxY){
	    		  //console.log('UP');
	    		  this.input.thrust = true;
	              return true;
	    	  }
	    	  else if(x>=joystickLeftPos.minX && x<=joystickLeftPos.maxX && y>=joystickLeftPos.minY && y<=joystickLeftPos.maxY){
	    		  //console.log('Left');
	    		  this.input.left = true;
	              return true;
	    	  }
	    	  else if(x>=joystickRightPos.minX && x<=joystickRightPos.maxX && y>=joystickRightPos.minY && y<=joystickRightPos.maxY){
	    		  //console.log('Right');
	    		  this.input.right = true;
	              return true;
	    	  }*/
	    	  else if(x>=joystickDownPos.minX && x<=joystickDownPos.maxX && y>=joystickDownPos.minY && y<=joystickDownPos.maxY){
	    		  //console.log('Down');
	    		  //not use for now
	    		  //this.input.shield = true;
	              //return true;
	    		  
	    	  }
	    	  else if(x>=fireButtonPos.minX  && x<=fireButtonPos.maxX && y>=fireButtonPos.minY && y<=fireButtonPos.maxY){
	    		  //console.log('Right');
	    		  this.input.fireA = true;
	              //return true;
	    	  }
	    	  else if(x>=bombButtonPos.minX  && x<=bombButtonPos.maxX && y>=bombButtonPos.minY && y<=bombButtonPos.maxY){    		  
	    		  this.input.fireB = true;
	              //return true;
	    	  }
	    	  else if(x>=shieldButtonPos.minX  && x<=shieldButtonPos.maxX && y>=shieldButtonPos.minY && y<=shieldButtonPos.maxY){    		  
	    		  this.input.shield = true;
	             // return true;
	    	  }
	    	  else if(x>=pauseButtonPos.minX  && x<=pauseButtonPos.maxX && y>=pauseButtonPos.minY && y<=pauseButtonPos.maxY){    		  
	    		  GameHandler.pause();
	              //return true;
	    	  }
	    	  else if(x>=opencheatButtonPos.minX  && x<=opencheatButtonPos.maxX && y>=opencheatButtonPos.minY && y<=opencheatButtonPos.maxY){    		  
	    		  //open cheat menu
	    		  cheatMenuOpened = !cheatMenuOpened;
	              //return true;
	    	  }
	    	  
	    	  else if(cheatMenuOpened && x>= cheatLPos.minX  && x<=cheatLPos.maxX && y>=cheatLPos.minY && y<=cheatLPos.maxY){
	              this.skipLevel = true;
	              //return true;
	    	  }
	    	  else if(cheatMenuOpened && x>= cheatRPos.minX  && x<=cheatRPos.maxX && y>=cheatRPos.minY && y<=cheatRPos.maxY){
	    		  BITMAPS = !BITMAPS;
	              //return true;
	    	  }
	    	  else if(cheatMenuOpened && x>= cheatAPos.minX  && x<=cheatAPos.maxX && y>=cheatAPos.minY && y<=cheatAPos.maxY){
	    		  this.enemies.push(this.generateAsteroid(1.0));
	              return true;
	    	  }
	    	  else if(cheatMenuOpened && x>= cheatEPos.minX  && x<=cheatEPos.maxX && y>=cheatEPos.minY && y<=cheatEPos.maxY){
	    		  this.enemies.push(new Asteroids.EnemyShip(this, randomInt(0, 1)));
	              //return true;
	    	  }
    	  }
    	  return true;
    	  
      },
      /**
       * Scene onTouchEnd method
       */
      onTouchEnd: function onTouchEnd(e){
    	  //console.log(e.touches);
    	  this.input.left = false;
    	  this.input.right = false;
    	  this.input.thrust = false;
    	  this.input.shield = false;
    	  this.input.fireA = false;
    	  this.input.fireB = false;
    	  
    	  return true;
    	  
      },
      
      /**
       * Scene onKeyDownHandler method
       */
      onKeyDownHandler: function onKeyDownHandler(keyCode)
      {    	  
         switch (keyCode)
         {
            case KEY.LEFT:
            {
               this.input.left = true;
               return true;
               break;
            }
            
            case KEY.RIGHT:
            {
               this.input.right = true;
               return true;
               break;
            }
            
            case KEY.UP:
            {
               this.input.thrust = true;
               return true;
               break;
            }
            
            case KEY.DOWN:
            case KEY.SHIFT:
            {
               this.input.shield = true;
               return true;
               break;
            }
            
            case KEY.SPACE:
            {               
               this.input.fireA = true;
               return true;
               break;
            }
            
            case KEY.Z:
            {
               this.input.fireB = true;
               return true;
               break;
            }
            
            // special keys - key press state not maintained between frames
            
            case KEY.A:
            {
               // generate an asteroid
               this.enemies.push(this.generateAsteroid(1.0));
               return true;
               break;
            }
            
            case KEY.R:
            {
               // switch rendering modes
               BITMAPS = !BITMAPS;
               return true;
               break;
            }
            
            case KEY.G:
            {
               // glow effect
               GLOWEFFECT = !GLOWEFFECT;
               return true;
               break;
            }
            
            case KEY.L:
            {
               this.skipLevel = true;
               return true;
               break;
            }
            
            case KEY.E:
            {
               // generate an enemy
               this.enemies.push(new Asteroids.EnemyShip(this, randomInt(0, 1)));
               return true;
               break;
            }
            
            case KEY.ESC:
            {
               GameHandler.pause();
               return true;
               break;
            }
         }
      },
      
      /**
       * Scene onKeyUpHandler method
       */
      onKeyUpHandler: function onKeyUpHandler(keyCode)
      {
         switch (keyCode)
         {
            case KEY.LEFT:
            {
               this.input.left = false;
               return true;
               break;
            }
            
            case KEY.RIGHT:
            {
               this.input.right = false;
               return true;
               break;
            }
            
            case KEY.UP:
            {
               this.input.thrust = false;
               return true;
               break;
            }
            
            case KEY.DOWN:
            case KEY.SHIFT:
            {
               this.input.shield = false;
               return true;
               break;
            }
            
            case KEY.SPACE:
            {
               this.input.fireA = false;
               return true;
               break;
            }
            
            case KEY.Z:
            {
               this.input.fireB = false;
               return true;
               break;
            }
         }
      },
      
      /**
       * Randomly generate a new large asteroid. Ensures the asteroid is not generated
       * too close to the player position!
       * 
       * @param speedFactor {number} Speed multiplier factor to apply to asteroid vector
       */
      generateAsteroid: function generateAsteroid(speedFactor)
      {
         while (true)
         {
            // perform a test to check it is not too close to the player
            var apos = new Vector(Math.random()*GameHandler.width, Math.random()*GameHandler.height);
            if (this.player.position.distance(apos) > 125)
            {
               var vec = new Vector( ((Math.random()*2)-1)*speedFactor, ((Math.random()*2)-1)*speedFactor );
               var asteroid = new Asteroids.Asteroid(
                  apos, vec, (randomInt(0, 2) === 0 ? 3 : 4));
               return asteroid;
            }
         }
      },
      
      /**
       * Update the actors position based on current vectors and expiration.
       */
      updateActors: function updateActors()
      {
         for (var i = 0, j = this.actors.length; i < j; i++)
         {
            var actorList = this.actors[i];
            
            for (var n = 0; n < actorList.length; n++)
            {
               var actor = actorList[n];
               
               // call onUpdate() event for each actor
               actor.onUpdate(this);
               
               // expiration test first
               if (actor.expired())
               {
                  actorList.splice(n, 1);
               }
               else
               {
                  // update actor using its current vector
                  actor.position.add(actor.vector);
                  
                  // handle traversing out of the coordinate space and back again
                  if (actor.position.x >= GameHandler.width)
                  {
                     actor.position.x = 0;
                  }
                  else if (actor.position.x < 0)
                  {
                     actor.position.x = GameHandler.width - 1;
                  }
                  if (actor.position.y >= GameHandler.height)
                  {
                     actor.position.y = 0;
                  }
                  else if (actor.position.y < 0)
                  {
                     actor.position.y = GameHandler.height - 1;
                  }
               }
            }
         }
      },
      
      /**
       * Detect player collisions with various actor classes
       * including Asteroids, Enemies, bullets and collectables
       */
      collisionDetectPlayer: function collisionDetectPlayer()
      {
         var playerRadius = this.player.radius();
         var playerPos = this.player.position;
         
         // test circle intersection with each asteroid/enemy ship
         for (var n = 0, m = this.enemies.length; n < m; n++)
         {
            var enemy = this.enemies[n];
            
            // calculate distance between the two circles
            if (playerPos.distance(enemy.position) <= playerRadius + enemy.radius())
            {
               // collision detected
               if (this.player.isShieldActive())
               {
                  // remove thrust from the player vector due to collision
                  this.player.vector.scale(0.75);
                  
                  // destroy the enemy - the player is invincible with shield up!
                  enemy.hit(-1);
                  this.destroyEnemy(enemy, this.player.vector, true);
               }
               else if (!(DEBUG && DEBUG.INVINCIBLE))
               {
                  // player destroyed by enemy collision - remove from play
                  this.player.kill();
                  
                  // deduct a life
                  this.game.lives--;
                  
                  // replace player with explosion
                  var boom = new Asteroids.PlayerExplosion(this.player.position.clone(), this.player.vector.clone());
                  this.effects.push(boom);
               }
            }
         }
         
         // test intersection with each enemy bullet
         for (var i = 0; i < this.enemyBullets.length; i++)
         {
            var bullet = this.enemyBullets[i];
            
            // calculate distance between the two circles
            if (playerPos.distance(bullet.position) <= playerRadius + bullet.radius())
            {
               // collision detected
               if (this.player.isShieldActive())
               {
                  // remove this bullet from the actor list as it has been destroyed
                  this.enemyBullets.splice(i, 1);
               }
               else if (!(DEBUG && DEBUG.INVINCIBLE))
               {
                  // player destroyed by enemy bullet - remove from play
                  this.player.kill();
                  
                  // deduct a life
                  this.game.lives--;
                  
                  // replace player with explosion
                  var boom = new Asteroids.PlayerExplosion(this.player.position.clone(), this.player.vector.clone());
                  this.effects.push(boom);
               }
            }
         }
         
         // test intersection with each collectable
         for (var i = 0; i < this.collectables.length; i++)
         {
            var item = this.collectables[i];
            
            // calculate distance between the two circles
            if (playerPos.distance(item.position) <= playerRadius + item.radius())
            {
               // collision detected - remove item from play and activate it
               this.collectables.splice(i, 1);
               item.collected(this.game, this.player, this);
            }
         }
      },
      
      /**
       * Detect bullet collisions with asteroids and enemy actors.
       */
      collisionDetectBullets: function collisionDetectBullets()
      {
         // collision detect player bullets with asteroids and enemies
         for (var i = 0, n, m; i < this.playerBullets.length; i++)
         {
            var bullet = this.playerBullets[i];
            var bulletRadius = bullet.radius();
            var bulletPos = bullet.position;
            
            // test circle intersection with each enemy actor
            for (n = 0, m = this.enemies.length, enemy, z; n < m; n++)
            {
               enemy = this.enemies[n];
               
               // test the distance against the two radius combined
               if (bulletPos.distance(enemy.position) <= bulletRadius + enemy.radius())
               {
                  // intersection detected! 
                  
                  // test for area effect bomb weapon
                  var effectRad = bullet.effectRadius();
                  if (effectRad === 0)
                  {
                     // impact the enemy with the bullet - may destroy it or just damage it
                     if (enemy.hit(bullet.power()))
                     {
                        // destroy the enemy under the bullet
                        this.destroyEnemy(enemy, bullet.vector, true);
                        // randomly release a power up
                        this.generatePowerUp(enemy);
                     }
                     else
                     {
                        // add some bullet impact effects to show the bullet hit
                        for (z=0; z<3; z++)
                        {
                           var effect = new Asteroids.Impact(
                              bullet.position.clone(),
                              bullet.vector.clone().scale(0.5 + Math.random()/2).rotate(Math.random()/2));
                           this.effects.push(effect);
                        }
                     }
                  }
                  else
                  {
                     // start sound effect
                     //if (g_bombAudio) g_bombAudio.play();
                     
                     // inform enemy it has been hit by a instant kill weapon
                     enemy.hit(-1);
                     this.generatePowerUp(enemy);
                     
                     // add a big explosion actor at the area weapon position and vector
                     var comboCount = 1;
                     var boom = new Asteroids.Explosion(
                           bullet.position.clone(), bullet.vector.clone().scale(0.5), 5);
                     this.effects.push(boom);
                     
                     // destroy the enemy
                     this.destroyEnemy(enemy, bullet.vector, true);
                     
                     // wipe out nearby enemies under the weapon effect radius
                     // take the length of the enemy actor list here - so we don't
                     // kill off -all- baby asteroids - so some elements of the original survive
                     for (var x = 0, z = this.enemies.length, e; x < z; x++)
                     {
                        e = this.enemies[x];
                        
                        // test the distance against the two radius combined
                        if (bulletPos.distance(e.position) <= effectRad + e.radius())
                        {
                           e.hit(-1);
                           this.generatePowerUp(e);
                           this.destroyEnemy(e, bullet.vector, true);
                           comboCount++;
                        }
                     }
                     
                     // special score and indicator for "combo" detonation
                     if (comboCount > 4)
                     {
                        // score bonus based on combo size
                        var inc = comboCount * 1000 * this.wave;
                        this.game.score += inc;
                        
                        // generate a special effect indicator at the destroyed enemy position
                        var vec = new Vector(0, -3.0);
                        var effect = new Asteroids.ScoreIndicator(
                              new Vector(enemy.position.x, enemy.position.y - (enemy.size * 8)),
                              vec.add(enemy.vector.clone().scale(0.5)),
                              inc, 16, 'COMBO X' + comboCount, 'rgb(255,255,55)', 24);
                        this.effects.push(effect);
                        
                        // generate a powerup to reward the player for the combo
                        this.generatePowerUp(enemy, true);
                     }
                  }
                  
                  // remove this bullet from the actor list as it has been destroyed
                  this.playerBullets.splice(i, 1);
                  break;
               }
            }
         }
         
         // collision detect enemy bullets with asteroids
         for (var i = 0, n, m; i < this.enemyBullets.length; i++)
         {
            var bullet = this.enemyBullets[i];
            var bulletRadius = bullet.radius();
            var bulletPos = bullet.position;
            
            // test circle intersection with each enemy actor
            for (n = 0, m = this.enemies.length, z; n < m; n++)
            {
               var enemy = this.enemies[n];
               
               if (enemy instanceof Asteroids.Asteroid)
               {
                  if (bulletPos.distance(enemy.position) <= bulletRadius + enemy.radius())
                  {
                     // impact the enemy with the bullet - may destroy it or just damage it
                     if (enemy.hit(1))
                     {
                        // destory the enemy under the bullet
                        this.destroyEnemy(enemy, bullet.vector, false);
                     }
                     else
                     {
                        // add some bullet impact effects to show the bullet hit
                        for (z=0; z<3; z++)
                        {
                           var effect = new Asteroids.Impact(
                              bullet.position.clone(),
                              bullet.vector.clone().scale(0.5 + Math.random()/2).rotate(Math.random()/2));
                           this.effects.push(effect);
                        }
                     }
                     
                     // remove this bullet from the actor list as it has been destroyed
                     this.enemyBullets.splice(i, 1);
                     break;
                  }
               }
            }
         }
      },
      
      /**
       * Randomly generate a power up to reward the player
       * 
       * @param enemy {Game.EnemyActor} The enemy to base power up position and momentum on
       */
      generatePowerUp: function generatePowerUp(enemy, force)
      {
         if (this.collectables.length < 5 &&
             (force || randomInt(0, ((enemy instanceof Asteroids.Asteroid) ? 25 : 1)) === 0))
         {
            // apply a small random vector in the direction of travel
            // rotate by slightly randomized enemy heading
            var vec = enemy.vector.clone();
            var t = new Vector(0.0, -(Math.random() * 3));
            t.rotate(enemy.vector.theta() * (Math.random()*Math.PI));
            vec.add(t);
            
            // add a power up to the collectables list
            this.collectables.push(new Asteroids.PowerUp(
               new Vector(enemy.position.x, enemy.position.y - (enemy.size * 8)),
               vec));
         }
      },
      
      /**
       * Blow up an enemy.
       * 
       * An asteroid may generate new baby asteroids and leave an explosion
       * in the wake.
       * 
       * Also applies the score for the destroyed item.
       * 
       * @param enemy {Game.EnemyActor} The enemy to destory and add score for
       * @param parentVector {Vector} The vector of the item that hit the enemy
       * @param player {boolean} If true, the player was the destroyer
       */
      destroyEnemy: function destroyEnemy(enemy, parentVector, player)
      {
         if (enemy instanceof Asteroids.Asteroid)
         {
            // generate baby asteroids
            this.generateBabyAsteroids(enemy, parentVector);
            
            // add an explosion actor at the asteriod position and vector
            var boom = new Asteroids.Explosion(enemy.position.clone(), enemy.vector.clone(), enemy.size);
            this.effects.push(boom);
            
            if (player)
            {
               // increment score based on asteroid size
               var inc = ((5 - enemy.size) * 4) * 100 * this.wave;
               this.game.score += inc;
               
               // generate a score effect indicator at the destroyed enemy position
               var vec = new Vector(0, -3.0).add(enemy.vector.clone().scale(0.5));
               var effect = new Asteroids.ScoreIndicator(
                     new Vector(enemy.position.x, enemy.position.y - (enemy.size * 8)), vec, inc);
               this.effects.push(effect);
            }
         }
         else if (enemy instanceof Asteroids.EnemyShip)
         {
            // add an explosion actor at the asteriod position and vector
            var boom = new Asteroids.Explosion(enemy.position.clone(), enemy.vector.clone(), 3);
            this.effects.push(boom);
            
            if (player)
            {
               // increment score based on asteroid size
               var inc = 2000 * this.wave * (enemy.size + 1);
               this.game.score += inc;
               
               // generate a score effect indicator at the destroyed enemy position
               var vec = new Vector(0, -3.0).add(enemy.vector.clone().scale(0.5));
               var effect = new Asteroids.ScoreIndicator(
                     new Vector(enemy.position.x, enemy.position.y - 16), vec, inc);
               this.effects.push(effect);
            }
            
            // decrement scene ship count
            this.enemyShipCount--;
         }
      },
      
      /**
       * Generate a number of baby asteroids from a detonated parent asteroid. The number
       * and size of the generated asteroids are based on the parent size. Some of the
       * momentum of the parent vector (e.g. impacting bullet) is applied to the new asteroids.
       *
       * @param asteroid {Asteroids.Asteroid} The parent asteroid that has been destroyed
       * @param parentVector {Vector} Vector of the impacting object e.g. a bullet
       */
      generateBabyAsteroids: function generateBabyAsteroids(asteroid, parentVector)
      {
         // generate some baby asteroid(s) if bigger than the minimum size
         if (asteroid.size > 1)
         {
            for (var x=0, xc=randomInt(asteroid.size / 2, asteroid.size - 1); x<xc; x++)
            {
               var babySize = randomInt(1, asteroid.size - 1);
               
               var vec = asteroid.vector.clone();
               
               // apply a small random vector in the direction of travel
               var t = new Vector(0.0, -(Math.random() * 3));
               
               // rotate vector by asteroid current heading - slightly randomized
               t.rotate(asteroid.vector.theta() * (Math.random()*Math.PI));
               vec.add(t);
               
               // add the scaled parent vector - to give some momentum from the impact
               vec.add(parentVector.clone().scale(0.2));
               
               // create the asteroid - slightly offset from the centre of the old one
               var baby = new Asteroids.Asteroid(
                     new Vector(asteroid.position.x + (Math.random()*5)-2.5, asteroid.position.y + (Math.random()*5)-2.5),
                     vec, babySize, asteroid.type);
               this.enemies.push(baby);
            }
         }
      },
      
      /**
       * Render each actor to the canvas.
       * 
       * @param ctx {object} Canvas rendering context
       */
      renderActors: function renderActors(ctx)
      {
         for (var i = 0, j = this.actors.length; i < j; i++)
         {
            // walk each sub-list and call render on each object
            var actorList = this.actors[i];
            
            for (var n = actorList.length - 1; n >= 0; n--)
            {
               actorList[n].onRender(ctx);
            }
         }
      },
      
      /**
       * DEBUG - Render the radius of the collision detection circle around each actor.
       * 
       * @param ctx {object} Canvas rendering context
       */
      renderCollisionRadius: function renderCollisionRadius(ctx)
      {
         ctx.save();
         ctx.strokeStyle = "rgb(255,0,0)";
         ctx.lineWidth = 0.5;
         ctx.shadowBlur = 0;
         
         for (var i = 0, j = this.actors.length; i < j; i++)
         {
            var actorList = this.actors[i];
            
            for (var n = actorList.length - 1, actor; n >= 0; n--)
            {
               actor = actorList[n];
               if (actor.radius)
               {
                  ctx.beginPath();
                  ctx.arc(actor.position.x, actor.position.y, actor.radius(), 0, TWOPI, true);
                  ctx.closePath();
                  ctx.stroke();
               }
            }
         }
         
         ctx.restore();
      },
      
      
      /**
       * Render player information HUD overlay graphics.
       * 
       * @param ctx {object} Canvas rendering context
       */
      renderOverlay: function renderOverlay(ctx)
      {
         ctx.save();
         
         // energy bar (100 pixels across, scaled down from player energy max)
         ctx.strokeStyle = "rgb(50,50,255)";
         ctx.strokeRect(4, 4, 101, 6);
         ctx.fillStyle = "rgb(100,100,255)";
         var energy = this.player.energy;
         if (energy > this.player.ENERGY_INIT)
         {
            // the shield is on for "free" briefly when he player respawns
            energy = this.player.ENERGY_INIT;
         }
         ctx.fillRect(5, 5, (energy / (this.player.ENERGY_INIT / 100)), 5);
         
         // lives indicator graphics
         for (var i=0; i<this.game.lives; i++)
         {
            if (BITMAPS)
            {
               ctx.drawImage(g_playerImg, 0, 0, 64, 64, 350+(i*20), 0, 16, 16);
               
               //PORT: draw images
               ctx.drawImage(g_joystickImg, joystickX, joystickY);
               ctx.drawImage(g_fireButtonImg, fireButtonX, fireButtonY);
               ctx.drawImage(g_bombButtonImg, bombButtonX, bombButtonY);
               ctx.drawImage(g_shieldButtonImg, shieldButtonX, shieldButtonY);
               ctx.drawImage(g_pauseButtonImg, pauseButtonX, pauseButtonY);
               
               if(cheatMenuOpened){
            	   ctx.drawImage(g_opencheatButtonImg, opencheatButtonX, opencheatButtonY);
            	   ctx.drawImage(g_cheatMenuImg, cheatMenuX, cheatMenuY);
               }
               else{
            	   ctx.drawImage(g_closecheatButtonImg, opencheatButtonX, opencheatButtonY);
               }
               
            }
            else
            {
               ctx.save();
               ctx.shadowColor = ctx.strokeStyle = "rgb(255,255,255)";
               ctx.translate(360+(i*16), 8);
               ctx.beginPath();
               ctx.moveTo(-4, 6);
               ctx.lineTo(4, 6);
               ctx.lineTo(0, -6);
               ctx.closePath();
               ctx.stroke();
               ctx.restore();
               
               //PORT: draw images
               ctx.drawImage(g_joystickImg, joystickX, joystickY);
               ctx.drawImage(g_fireButtonImg, fireButtonX, fireButtonY);
               ctx.drawImage(g_bombButtonImg, bombButtonX, bombButtonY);
               ctx.drawImage(g_shieldButtonImg, shieldButtonX, shieldButtonY);
               ctx.drawImage(g_pauseButtonImg, pauseButtonX, pauseButtonY);
               
               if(cheatMenuOpened){
            	   ctx.drawImage(g_closecheatButtonImg, opencheatButtonX, opencheatButtonY);
            	   ctx.drawImage(g_cheatMenuImg, cheatMenuX, cheatMenuY);
               }
               else
            	   ctx.drawImage(g_opencheatButtonImg, opencheatButtonX, opencheatButtonY);
               
            }
         }
         
         // score display - update towards the score in increments to animate it
         var score = this.game.score;
         var inc = (score - this.scoredisplay) / 10;
         this.scoredisplay += inc;
         if (this.scoredisplay > score)
         {
            this.scoredisplay = score;
         }
         var sscore = Math.ceil(this.scoredisplay).toString();
         // pad with zeros
         for (var i=0, j=8-sscore.length; i<j; i++)
         {
            sscore = "0" + sscore;
         }
         Game.fillText(ctx, sscore, "12pt Courier New", 120, 12, "white");
         
         // high score
         // TODO: add method for incrementing score so this is not done here
         if (score > this.game.highscore)
         {
            this.game.highscore = score;
         }
         sscore = this.game.highscore.toString();
         // pad with zeros
         for (var i=0, j=8-sscore.length; i<j; i++)
         {
            sscore = "0" + sscore;
         }
         Game.fillText(ctx, "HI: " + sscore, "12pt Courier New", 220, 12, "white");
         
         // debug output
         if (DEBUG && DEBUG.FPS)
         {
            Game.fillText(ctx, "FPS: " + GameHandler.maxfps, "12pt Courier New", 0, GameHandler.height - 2, "lightblue");
         }
         
         //PORT: draw joystick
         
         ctx.restore();
      }
   });
})();


/**
 * Starfield star class.
 * 
 * @namespace Asteroids
 * @class Asteroids.Star
 */
(function()
{
   Asteroids.Star = function()
   {
      return this;
   };
   
   Asteroids.Star.prototype =
   {
      MAXZ: 12.0,
      VELOCITY: 1.5,
      MAXSIZE: 5,
      
      x: 0,
      y: 0,
      z: 0,
      prevx: 0,
      prevy: 0,
      
      init: function init()
      {
         // select a random point for the initial location
         this.x = (Math.random() * GameHandler.width - (GameHandler.width * 0.5)) * this.MAXZ;
         this.y = (Math.random() * GameHandler.height - (GameHandler.height * 0.5)) * this.MAXZ;
         this.z = this.MAXZ;
      },
      
      render: function render(ctx)
      {
         var xx = this.x / this.z;
         var yy = this.y / this.z;
         
         var size = 1.0 / this.z * this.MAXSIZE + 1;
         
         ctx.save();
         ctx.fillStyle = "rgb(200,200,200)";
         ctx.beginPath();
         ctx.arc(xx + (GameHandler.width / 2), yy +(GameHandler.height / 2), size/2, 0, TWOPI, true);
         ctx.closePath();
         ctx.fill();
         ctx.restore();
         
         this.prevx = xx;
         this.prevy = yy;
      }
   };
})();
