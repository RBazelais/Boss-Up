// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(640, 360, Phaser.AUTO, 'gameDiv');
var platforms;
var cursors;
var road;
//var hazards;


// Creates a new 'main' state that will contain the game
var mainState = {

    // Function called first to load all the assets
    preload: function() { 
        // Change the background color of the game
        game.stage.backgroundColor = '#71c5cf';

        // Load the bike sprite
        game.load.image('bike', 'assets/bike.png');  

        // Load the hazard sprite
        game.load.image('hazard', 'assets/hazard.png');  

        //Load the road sprite
        game.load.image('road', 'assets/road.png');


        //Load the pothole sprite
        //game.load.image('pothole', 'assets/pothole.png')
    },

    // Fuction called after 'preload' to setup the game 
    create: function() { 
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        cursors = game.input.keyboard.createCursorKeys();
        road = game.add.tileSprite(0, game.world.height-96, 1128, 96, 'road');

        //create the platforms group
        platforms = game.add.group();
        platforms.enableBody = true;

        road = platforms.create(0, game.world.height-64);
        road.body.immovable = true;


        // Display the bike on the screen
        this.bike = this.game.add.sprite(100, 245, 'bike');
        
        // Add gravity to the bike to make it fall
        game.physics.arcade.enable(this.bike);
        this.bike.body.gravity.y = 250; 
        this.bike.body.collideWorldBounds = true;


        // Call the 'jump' function when the spacekey is hit
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this); 

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
        //  Scroll the background
        //road.autoScroll(2, 0);
        // If the bike is out of the world (too high or too low), call the 'restartGame' function
        if (this.bike.inWorld == false){
            this.restartGame(); 
        }
        
        else{
            this.bike.body.velocity.x = 0;
            if (cursors.left.isDown)
            {
            //  Move to the left
            this.bike.body.velocity.x = -150;
 
            //player.animations.play('left');
            }
            else if (cursors.right.isDown)
            {
            //  Move to the right
            this.bike.body.velocity.x = 150;
 
            //player.animations.play('right');
            }
            //  Allow the player to jump if they are touching the ground.
            if (cursors.up.isDown)
            {
                this.bike.body.velocity.y = -150;
        
            }

    
        // If the bike overlap any hazards, call 'restartGame'
        game.physics.arcade.overlap(this.bike, this.hazards, this.restartGame, null, this);      
    }
    },

    // Make the bike jump 
    jump: function() {
        // Add a vertical velocity to the bike
        this.bike.body.velocity.y = -300;
    },

    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
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