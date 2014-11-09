// Initialize Phaser, and creates a 400x490px game

var game = new Phaser.Game(640, 360, Phaser.AUTO, 'gameDiv');

var ramps;
var hazard;
var cursors;
var background;
var background_speed = 1;
var bike_y_speed = 100;
var bike_x_speed = 100;
var bike_x_max = 120;
var TopTrack = 210;
var BottomTrack = 330;
var onRoad = true;
var upramp;
var ramp_speed = -200;
var downramp;
var fx;
var music, bikejump;
//var hazards;


// Creates a new 'main' state that will contain the game
var mainState = {

    // Function called first to load all the assets
    preload: function() { 
       
        // Load the bike sprite
        game.load.image('bike', 'assets/images/ghost_bike.png');  

        // Load the hazard sprites
        game.load.image('hazard', 'assets/images/pickle_juice.png');

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
    },

    // Fuction called after 'preload' to setup the game 
    create: function() { 
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        cursors = game.input.keyboard.createCursorKeys();
        
        //add a tile sprite to control the background
        background = game.add.tileSprite(0, 0, 640, 360, 'background');
              

        //upramp creation

        upramp = game.add.sprite(game.world.width, 135, 'upRamp');
        game.physics.enable(upramp, Phaser.Physics.ARCADE);

        //downramp creation
        downramp = game.add.sprite(game.world.width, 135, 'downRamp');
        game.physics.enable(downramp, Phaser.Physics.ARCADE);


        //downramp creation 
         // Display the bike on the screen
        this.bike = this.game.add.sprite(0, TopTrack, 'bike');
        

        //add backgground noise
        bikewind = game.add.audio('bikewind');
        bikewind.play();

        //add bikejump noise
        bikejump = game.add.audio('bikejump');



        // Add world bounds collider
        game.physics.arcade.enable(this.bike);
        this.bike.body.collideWorldBounds = true;


        /*
        //Create a group of 20 hazards
        this.hazards = game.add.group();
        this.hazards.enableBody = true;
        this.hazards.createMultiple(20, 'hazard');  
*/

        hazard = game.add.sprite(this.game.world.width, 280, 'hazard');
        game.physics.enable(hazard, Phaser.Physics.ARCADE);
        this.releaseHazard();
        this.addRamps();
        // Timer that calls 'addRowOfPipes' ever 1.5 seconds
        this.timer = this.game.time.events.loop(15000, this.addRamps, this);           
        this.timer = this.game.time.events.loop(1000, this.increaseSpeed, this);
        this.timer = this.game.time.events.loop(1000, this.releaseHazard, this);

        // Add a score label on the top left of the screen
        //this.score = 0;
        //this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  
    },

    

    // This function is called 60 times per second
    update: function() {

        //console.log("Player x y" + this.bike.body.position.x + " " + this.bike.body.position.y);

        
        //Move the bike with the cursors
        this.moveBike();

        
        
        
        //  Scroll the background
        background.tilePosition.x -= background_speed;
        
        
    
        // If the bike overlap any hazards, call collisionHandler
        //game.physics.arcade.overlap(this.bike, this.hazards, hazardCollisionHandler, null, this);      
        
        // If the bike overlap any hazards, call collisionHandler
        if(onRoad){
            game.physics.arcade.overlap(this.bike, upramp, this.rampCollisionHandler, null, this);
            game.physics.arcade.overlap(this.bike, downramp, this.hazardCollisionHandler, null, this);
        }   
        else{
            game.physics.arcade.overlap(this.bike, downramp, this.rampCollisionHandler, null, this);
        
        }

         game.physics.arcade.overlap(this.bike, hazard, this.hazardCollisionHandler, null, this);
        
    },

    //Set the boundaries for whatever track the player is on
    updateTracks: function(){
        if(onRoad){
            TopTrack = 210;
            BottomTrack = 330;
        }
        else{
            TopTrack = 60;
            BottomTrack = 105;
        }
    },

    //adds up and down ramps as time passes
    addRamps: function(){
        upramp.position.x = game.world.width;
        upramp.body.velocity.x = ramp_speed;

        downramp.position.x=game.world.width+360;
        downramp.body.velocity.x= ramp_speed;
    },

    increaseSpeed: function(){
        background_speed++;
        //fast_music.play();
    },

    decreaseSpeed: function(){
        if(background_speed>1){
        background_speed--;
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

    hazardCollisionHandler: function() {
        background_speed = 1;
        this.bike.body.velocity.x = ramp_speed;
        this.releaseHazard();
    },

    rampCollisionHandler: function(){
        onRoad = !onRoad;
        this.updateTracks();
        var exitY;
        if(onRoad){
            exitY = TopTrack;
        }
        else{
            exitY = BottomTrack;
            this.decreaseSpeed();
        }

        this.bike.body.position.y = exitY;
        this.bike.body.position.x += 180;
        bikejump.play();
        

    },
    
    /*
    // Add a hazard on the screen
    addOneHazard: function(x, y) {
        // Get the first dead hazard of our group
        hazard = game.add.sprite('hazard');
        game.physics.enable(hazard, Phaser.Physics.ARCADE);
        // Set the new position of the hazard
        hazard.reset(x, y);

        // Add velocity to the hazard to make it move left
        hazard.body.velocity.x = -200; 
               
        // Kill the hazard when it's no longer visible 
        hazard.checkWorldBounds = true;
        hazard.outOfBoundsKill = true;
    },
    */

    releaseHazard: function(){
        var hazardY = 280;
         // Set the new position of the hazard

         console.log("Got to release hazard")
        hazard.body.position.x = this.game.world.width;
        hazard.body.position.y = hazardY;
        // Add velocity to the hazard to make it move left
        hazard.body.velocity.x = -200; 

        
    },


};


// Add and start the 'main' state to start the game
game.state.add('main', mainState);  
game.state.start('main'); 