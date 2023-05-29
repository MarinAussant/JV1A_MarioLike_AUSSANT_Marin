
class Preload extends Phaser.Scene {

    constructor() {
        super("PreloadScene");
    }

    preload() {
        //Tilemap
        this.load.tilemapTiledJSON("testLevelJson", "levels/testLevel.json");
        this.load.tilemapTiledJSON("level00", "levels/Level_00.json");

        //Tileset
        this.load.image("tileset", "assets/placeholder.png");

        //Backs
        this.load.image("back", "assets/back.JPG");
        this.load.image("front", "assets/testLevelPlace.png");

        //Player
        this.load.spritesheet("idleSprite", "assets/anims/idleSprite2.png",
        {frameWidth: 1000, frameHeight: 1200});
        this.load.spritesheet("runSprite", "assets/anims/runSprite2.png",
        {frameWidth: 1000, frameHeight: 1200});
        this.load.spritesheet("jumpSprite", "assets/anims/jumpSprite2.png",
        {frameWidth: 1000, frameHeight: 1200});
        this.load.spritesheet("wallSlideSprite", "assets/anims/wallSlideSprite2.png",
        {frameWidth: 1000, frameHeight: 1200});

        // Skills
        this.load.image("jumpParticles", "assets/particles/jumpParticles.png")
        this.load.image("speedParticles", "assets/particles/speedParticles.png")

        //Skyglow
        this.load.spritesheet("jumpSkyglow", "assets/anims/jumpSkyglow.png",
            { frameWidth: 550, frameHeight: 550 });
        this.load.spritesheet("speedSkyglow", "assets/anims/speedSkyglow.png",
            { frameWidth: 550, frameHeight: 550 });
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