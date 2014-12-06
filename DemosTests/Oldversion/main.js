var GhostBike = GhostBike || {};

GhostBike.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

GhostBike.game.state.add('Boot', GhostBike.Boot);
//uncomment these as we create them through the tutorial
//SpaceHipster.game.state.add('Preload', GhostBike.scripts.Preload);
//SpaceHipster.game.state.add('MainMenu', GhostBike.scripts.MainMenu);
//SpaceHipster.game.state.add('Game', GhostBike.scripts.Game);

GhostBike.game.state.start('Boot');