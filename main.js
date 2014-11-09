// Initialize Phaser, and creates a 400x490px game

var game = new Phaser.Game(640, 360, Phaser.AUTO, 'gameDiv');

var ramps;

var cursors;
var road;
var background_speed = 2;
var bike_y_speed = 100;
var bike_x_speed = 100;
var TopTrack = 180;
var BottomTrack = 360;
var onRoad = true;

var highline;

//var hazards;


// Creates a new 'main' state that will contain the game
var mainState = {

    // Function called first to load all the assets
    preload: function() { 
        // Change the background color of the game
        //game.stage.backgroundColor = '#71c5cf';

        // Load the bike sprite
        game.load.image('bike', 'assets/bike.png');  

        // Load the hazard sprites
        //game.load.image('hazard', 'assets/hazard.png');  

        //Load the road sprite
        game.load.image('background', 'assets/ghost_bike_street_level.png');

        //load the up ramp
        //game.load.image('upRamp', 'assest/upRamp.png');

        //load the down ramp
        //game.load.image('downRamp', 'assets/downRamp.png');

        //load the highline track
        game.load.image('highline', 'assets/highline.png');        
        
    },

    // Fuction called after 'preload' to setup the game 
    create: function() { 
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        cursors = game.input.keyboard.createCursorKeys();
        
        //add a tile sprite to control the background
        road = game.add.tileSprite(0, 0, 640, 360, 'background');
        highline = game.add.tileSprite(0, 0, 640, 180, 'highline');
         
         // Display the bike on the screen
        this.bike = this.game.add.sprite(100, (TopTrack+TopTrack/2), 'bike');
        


        // Add gravity to the bike to make it fall
        game.physics.arcade.enable(this.bike);
        this.bike.body.collideWorldBounds = true;


        
        // Create a group of 20 hazards
        //this.hazards = game.add.group();
        //this.hazards.enableBody = true;
        //this.hazards.createMultiple(20, 'hazard');  

        // Timer that calls 'addRowOfPipes' ever 1.5 seconds
        //this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);           

        // Add a score label on the top left of the screen
        //this.score = 0;
        //this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  
    },

    

    // This function is called 60 times per second
    update: function() {

        //console.log("Player x y" + this.bike.body.position.x + " " + this.bike.body.position.y);

        //Check which track the player is on and update parameters accordingly
        this.updateTracks();
        //Move the bike with the cursors
        this.moveBike();
        
        
        //  Scroll the background
        road.tilePosition.x -= background_speed;
        highline.tilePosition.x -= background_speed;
    
        // If the bike overlap any hazards, call collisionHandler
        //game.physics.arcade.overlap(this.bike, this.hazards, hazardCollisionHandler, null, this);      
        
        // If the bike overlap any hazards, call collisionHandler
        //game.physics.arcade.overlap(this.bike, this.ramp, rampCollisionHandler, null, this);      
    
    },

    //Set the boundaries for whatever track the player is on
    updateTracks: function(){
        if(onRoad){
            TopTrack = 200;
            BottomTrack = 280;
        }
        else{
            TopTrack = 100;
            BottomTrack = 200;
        }
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
            if (cursors.right.isDown)
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

        //add code to BOSS UP! bike to bottom of highline

        //add code to BOSS Down bike to road

        //add code to change bool from onRoad to false when bike collides with highline sprite
    },

    rampCollisionHandler: function(){
        

    },
    
/*
    // Add a hazard on the screen
    addOneHazard: function(x, y) {
        // Get the first dead hazard of our group
        var hazard = this.hazards.getFirstDead();

        // Set the new position of the hazard
        hazard.reset(x, y);

        // Add velocity to the hazard to make it move left
        hazard.body.velocity.x = -200; 
               
        // Kill the hazard when it's no longer visible 
        hazard.checkWorldBounds = true;
        hazard.outOfBoundsKill = true;
    },



    // Add a row of 6 hazards with a hole somewhere in the middle
    addRowOfPipes: function() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1) 
                this.addOneHazard(400, i*60+10);   
    
        this.score += 1;
        this.labelScore.text = this.score;  
    },
*/
};


// Add and start the 'main' state to start the game
game.state.add('main', mainState);  
game.state.start('main'); 