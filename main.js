// Initialize Phaser, and creates a 640x360px game

var game = new Phaser.Game(640, 360, Phaser.AUTO, 'gameDiv');

var ramps;
//var hazard;
var cursors;
var background1;
var background2;
var world_speed = -100;
var street_speed = -250;
var park_speed = -100;
var bike_y_speed = 150;
var bike_x_speed = 100;
var bike_x_max = 120;
var TopTrack = 30;
var BottomTrack = 105;
var onRoad = false;
var upramp;
//var ramp_speed = -200;
var downramp;
var fx;
var music, bikejump;

var hazards;
var hazardNames;

var gameStarted = false;
var buffer = 30;
var maxWorldSpeed = -250;
var minWorldSpeed = -50;
// add ramp variable as group and launch from side of screen
var ramps;
var ramp_height = 135;
var gameTimer=0;
var nextRamp = 0;

//Audio Files
var crash, park, street, bossUp;

// HP
var hitPoints = 3;
var hitPointsString = "HP: " + hitPoints;
var hitPointsText;

// score
var score;
var scoreString = 'Score: ';
var scoreText;

var introText;
var introTextString = "";
var gameStarted = false;



// Creates a new 'main' state that will contain the game
var mainState = {

    // Function called first to load all the assets
    preload: function() { 
       
        // Load the bike sprite
        game.load.image('bike', 'assets/images/ghost_bike.png');  

        // Load the hazard sprites
        game.load.image('pickle_juice', 'assets/images/pickle_juice.png');

        //Load the road sprite
        game.load.image('background', 'assets/images/background.png');

        //load the up ramp
        game.load.image('upRamp', 'assets/images/up_ramp.png');

        //load the down ramp
        game.load.image('downRamp', 'assets/images/down_ramp.png');
       

        //load background fx track
        game.load.audio('bikewind', 'assets/audio/BIKE_RideWind_Loop.ogg');

        //load bike Jump
        game.load.audio('bikejump', 'assets/audio/BIKE_Jump.ogg');

        //var crash, park, street, bossUp;

        

        game.load.audio('crash', 'assets/audio/BIKE_Crash.ogg');
        
        game.load.audio('park', 'assets/audio/ENV_Park.ogg');
        game.load.audio('street', 'assets/audio/ENV_Street.ogg');
        
        game.load.audio('bossUp', 'assets/audio/BOSSED_UP_01.ogg');



        //load metal crash

        //load organic crash
    },

    // Fuction called after 'preload' to setup the game 
    create: function() { 

        //Create array of hazard sprite names
        //var hazardNames = ["firehydrant", "raccoon", "pothole", "jogger", "grandma", "rock", "pedestrians", "bush", "head out of manhole", "mailbox"];

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        cursors = game.input.keyboard.createCursorKeys();
        
        //add a tile sprite to control the background
        //background = game.add.tileSprite(0, 0, 640, 360, 'background');
        background1 = game.add.sprite(0, 0, 'background');
        game.physics.enable(background1, Phaser.Physics.ARCADE)


        background2 = game.add.sprite(background1.body.width-buffer, 0, 'background');
        game.physics.enable(background2, Phaser.Physics.ARCADE)

        //ramps
        ramps = game.add.group();
        
        //hazards
        hazards = game.add.group();    
        
         // Display the bike on the screen
        this.bike = this.game.add.sprite(0, TopTrack, 'bike');
        

        //add backgground noise
        bikewind = game.add.audio('bikewind');
        bikewind.play();

        

        crash = game.add.audio('crash');
        crash.volume -= .5;
        park = game.add.audio('park');
        street = game.add.audio('street');
        
        bossUp = game.add.audio('bossUp');
        bossUp.volume -= .5;

        park.play();
        
        //add bikejump noise
        bikejump = game.add.audio('bikejump');
        bikejump.volume -= .5;

        // Add world bounds collider
        game.physics.arcade.enable(this.bike);
        this.bike.body.collideWorldBounds = true;

            
        
        
        //this.addRamps();
       // this.releaseHazard();
        //Spawn an Up Ramp

        game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);

       // game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter(), this);
        game.time.events.loop(Math.random()*10000, this.spawnRamps, this); 
        game.time.events.loop(Math.random()*10000, this.spawnHazards, this);
        



        
        // Add a score label on the top left of the screen
        score = 0;
        scoreText = this.game.add.text(20, 20, scoreString, { font: "30px Arial", fill: "#ff0000" });
        //this.labelScore = this.game.add.text(20, 20, score, { font: "30px Arial", fill: "#ffffff" });  

        hitPointsText = this.game.add.text(500, 20, hitPointsString, {font: "30px Arial", fill: "#ff0000"});

        introText = this.game.add.text(300, 180, introTextString, {font: "30px Arial", fill: "#ff0000"});
        
    },


    updateCounter: function(){
        gameTimer++;
    },

    // This function is called 60 times per second
    update: function() {

        //console.log("Player x y" + this.bike.body.position.x + " " + this.bike.body.position.y);

        if(hitPoints<1){
            this.loseState();
        }
        score = gameTimer;
        scoreString = "Score: " + score;

        hitPointsString = "HP: " + hitPoints;

        scoreText.setText(scoreString);
        hitPointsText.setText(hitPointsString);

        //Move the bike with the cursors
        this.moveBike();
        
        //  Scroll the background
        //background.tilePosition.x -= background_speed;
        
        this.loopBackgrounds();
        this.updateRamps();
        this.updateHazards();
        
    
        // If the bike overlap any hazards, call collisionHandler
        //game.physics.arcade.overlap(this.bike, this.hazards, hazardCollisionHandler, null, this);      
        
        // If the bike overlap any hazards, call collisionHandler
        //if(onRoad){

        game.physics.arcade.collide(this.bike, ramps, this.rampCollisionHandler);
        //game.physics.arcade.overlap(this.bike, ramps, this.ramp.CollisionHandler, null, this);
        //game.physics.arcade.overlap(this.bike, ramps, this.rampCollisionHandler, null, this);


         //}
         //game.physics.arcade.overlap(this.bike, downramp, this.hazardCollisionHandler, null, this);
        //}   
        

         game.physics.arcade.collide(this.bike, hazards, this.hazardCollisionHandler);
        
    },

/*
    //Set the boundaries for whatever track the player is on
    updateTracks: function(){
        console.log("Got to updateTracks");
        if(onRoad){
            TopTrack = 210;
            BottomTrack = 330;
            world_speed = -200;
        }
        else{
            TopTrack = 60;
            BottomTrack = 105;
            world_speed = -50;
        }
    },
*/


    spawnHazards: function(){
        game.physics.enable(hazards, Phaser.Physics.ARCADE);
        
        for(var i = 0; i < 2; i++){

        var hazard = hazards.create(game.world.width, Math.random()*game.world.height, 'pickle_juice');
        game.physics.enable(hazards, Phaser.Physics.ARCADE);
        hazard.body.velocity.x = world_speed;
        }

    },

    updateHazards: function(){

         hazards.forEach(function(hazard){
            hazard.body.velocity.x = world_speed;
            if(hazard.body.position.x+hazard.body.width <= 0){
                //ramps.destroy();
            }
         });

    },

    loseState: function() {
        // Stop timer
        

        // Game over text
        introText.setText('Game Over!');
        introText.visible = true;

        background1.body.velocity.x =0;
        background2.body.velocity.x =0;
        
        this.bike.destroy();
        hazards.destroy();
        ramps.destroy();
        
        // Hide score and HP
        scoreText.visible = false;
        hitPointsText.visible = false;


        
      },
    //Spawn Ramps

    spawnRamps: function(){
        //Random nu ramps.forEach(function(ramp){
    

        if(nextRamp<gameTimer){
            var isUpRamp = Math.random()<.5; // set isUpRamp to true or fals
            /*var enemy = enemies.create(Math.random()*game.world.width, Math.random()*game.world.width, 'pigcat');
            enemy.body.collideWorldBounds = true;
            enemy.body.velocity.x= (Math.random()*100);
            enemy.body.velocity.y= (Math.random()*100);
            enemies.size++;
            // If enemy spawns out of x bounds, move it in

            enemy.body.bounce.set(1);
            enemy.animations.add('safe', [0]);
            enemy.animations.add('unsafe', [1,2], 6, true);
            enemy.animations.add('wall', [2]);
            enemy.isWall = false;
            */
        
            var rampImage;
            if(isUpRamp){
                rampImage = 'upRamp';
                //game.physics.enable(ramps, Phaser.Physics.ARCADE);
            }
            else{
                rampImage = 'downRamp';
                //game.physics.enable(ramps, Phaser.Physics.ARCADE);
            }

            var ramp = ramps.create(game.world.width, ramp_height, rampImage);
            game.physics.enable(ramps, Phaser.Physics.ARCADE);
            ramp.body.velocity.x = world_speed;
            ramp.isUpRamp = isUpRamp;
            nextRamp = gameTimer+6;
        }


        
    },

    

    updateRamps: function(){
        /*
        enemies.forEach(function(enemy){
                if(!enemy.isWall){
                    enemy.animations.play('unsafe');
                }   
                else{
                    enemy.animations.play('wall');
                }
            });
        */
        //var ramp;

        ramps.forEach(function(ramp){
            ramp.body.velocity.x = world_speed;
            if(ramp.body.position.x+ramp.body.width <= 0){
                //ramps.destroy();
            }
         });

        


    },

    setSpeed: function(){
        this.body.velocity.x = world_speed;
    },


    //creates a loop of backgrounds set to the world speed
    loopBackgrounds: function(){
        background1.body.velocity.x = world_speed;
        background2.body.velocity.x = world_speed;

        
        if(background1.body.width + background1.body.position.x <= 0){
            background1.body.position.x = background2.body.width+background2.body.position.x;   
        }
    
        
        if(background2.body.width + background2.body.position.x <= 0){
            background2.body.position.x = background1.body.width+background1.body.position.x;   
        }
    
        
    },

    //adds up and down ramps as time passes
    addUpRamp: function(){
        upramp.position.x = game.world.width;
        upramp.body.velocity.x = world_speed;
    },

    addDownRamp: function(){
        downramp.position.x=game.world.width+360;
        downramp.body.velocity.x= world_speed;
    },

    increaseSpeed: function(){
        if(world_speed > minWorldSpeed){
            world_speed -=25;
        }
        //fast_music.play();
    },

    decreaseSpeed: function(){
        if(world_speed< maxWorldSpeed){
        world_speed +=25;
        }       
        //calm_music.play();
    },



    //Moves the bike in response to the arrow keys
    moveBike: function(){
        
            this.bike.body.velocity.x = 0;
            this.bike.body.velocity.y = 0;
            
            if (cursors.left.isDown)
            {
            //  Move to the left
            this.bike.body.velocity.x = -bike_x_speed;
 
            //player.animations.play('left');
            }
            if (cursors.right.isDown && this.bike.body.position.x < bike_x_max)
            {
            //  Move to the right
            this.bike.body.velocity.x = bike_x_speed;

 
            //player.animations.play('right');
            }
            if(cursors.down.isDown && this.bike.body.position.y<BottomTrack)
            {
                this.bike.body.velocity.y = bike_y_speed;
            }
            //  Allow the player to move up on the screen
            if (cursors.up.isDown && this.bike.body.position.y>TopTrack)
            {
                this.bike.body.velocity.y = -bike_y_speed;
        
            }


    },



    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },


    //CollisionHandler

    hazardCollisionHandler: function(bike, hazard) {
        //background_speed = 1;
        //this.bike.body.velocity.x = world_speed;
        //this.releaseHazard();
        hazard.destroy();
        hitPoints--;
        crash.play();
        world_speed = 0;
        if(onRoad){
        var temp = setTimeout(function(){world_speed = street_speed},1000);
    }
        else{
            var temp = setTimeout(function(){world_speed = park_speed},1000);
        }
    },

    rampCollisionHandler: function(bike, ramp){
        var exitY = 0;
        if(onRoad && !ramp.isUpRamp){
            hitPoints--;
            
            world_speed = 0;
            crash.play();

            var temp = setTimeout(function(){world_speed = street_speed},1000);
            
        }
        else if(!onRoad && ramp.isUpRamp){
            hitPoints--;
            crash.play();
            world_speed = 0;
            crash.play();
            var temp = setTimeout(function(){world_speed = park_speed},1000);
            
            
        }
        else{

            onRoad = !onRoad;
       
            if(onRoad){
                TopTrack = 210;
                BottomTrack = 330;
                world_speed = street_speed;
                exitY = TopTrack;
                street.play();
                park.stop();
                bossUp.play();
            }
            else{
                TopTrack = 30;
                BottomTrack = 105;
                world_speed = park_speed;
                exitY= BottomTrack;
                park.play();
                street.stop();
            }

        bike.body.position.y = exitY;
        //this.bike.body.position.x = 0;
        bikejump.play();    
        }
        
        
        //console.log(" On road is " + onRoad +" Exit y:" + exitY);

        ramp.destroy();
        

    },
    
    

    releaseHazard: function(){
        var hazardY = 300;
         // Set the new position of the hazard

        
        hazard.body.position.x = this.game.world.width;
        hazard.body.position.y = hazardY;
        // Add velocity to the hazard to make it move left
        hazard.body.velocity.x = world_speed; 

        
    },


};


// Add and start the 'main' state to start the game
game.state.add('main', mainState);  
game.state.start('main'); 