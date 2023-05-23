
class Preload extends Phaser.Scene {

    constructor() {
        super("PreloadScene");
    }

    preload() {
        //Tilemap
        this.load.tilemapTiledJSON("testLevelJson", "levels/testLevel.json");

        //Tileset
        this.load.image("tileset", "assets/placeholder.png");

        //Backs
        this.load.image("back", "assets/back.JPG");
        this.load.image("front", "assets/testLevelPlace.png");

        //Player

        this.load.spritesheet("tempSprite", "assets/tempSprite.png",
            { frameWidth: 512, frameHeight: 1024 });

        //Skyglow
        this.load.spritesheet("jumpSkyglow", "assets/skyglowJump.png",
            { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet("speedSkyglow", "assets/skyglowSpeed.png",
            { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet("glideSkyglow", "assets/skyglowGlide.png",
            { frameWidth: 128, frameHeight: 128 });


        //Falling Platform
        this.load.spritesheet("falling", "assets/fallingPlatform.png",
            { frameWidth: 768, frameHeight: 1024 });

    }

    create() {
        this.scene.start("TestLevel", {
            skyglow: ["ground", "speed", "air"],
        });

    }

}

export default Preload;