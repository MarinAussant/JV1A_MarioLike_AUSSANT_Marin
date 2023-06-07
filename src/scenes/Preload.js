
class Preload extends Phaser.Scene {

    constructor() {
        super("PreloadScene");
    }

    preload() {
        //Tilemap
        this.load.tilemapTiledJSON("testLevelJson", "levels/testLevel.json");
        this.load.tilemapTiledJSON("level00", "levels/Level_00.json");
        this.load.tilemapTiledJSON("level01", "levels/Level_01.json");
        this.load.tilemapTiledJSON("level02", "levels/Level_02.json");
        this.load.tilemapTiledJSON("level03", "levels/Level_03.json");
        this.load.tilemapTiledJSON("level04", "levels/Level_04.json");
        this.load.tilemapTiledJSON("level05", "levels/Level_05.json");
        this.load.tilemapTiledJSON("level06", "levels/Level_06.json");
        this.load.tilemapTiledJSON("level07", "levels/Level_07.json");

        //Tileset
        this.load.image("tileset", "assets/placeholder.png");

        //Menu
        this.load.image("logo", "assets/levels/extra/logo.png");
        this.load.image("play", "assets/levels/extra/play.png");
        this.load.image("playSelected", "assets/levels/extra/playSelected.png");
        this.load.image("quit", "assets/levels/extra/quit.png");
        this.load.image("quitSelected", "assets/levels/extra/quitSelected.png");

        this.load.image("backgroundBlur", "assets/levels/extra/backgroundBlur.png");
        this.load.image("backgroundBackgroundBlur", "assets/levels/extra/backgroundBackgroundBlur.png");

        //Help
        this.load.image("moveJumpHelp", "assets/levels/extra/firstHelp.png");
        this.load.image("firstSkyglowHelp", "assets/levels/extra/secondHelp.png");
        this.load.image("secondSkyglowHelp", "assets/levels/extra/troisHelp.png");

        //Backs
        this.load.image("sky", "assets/levels/extra/sky.png");
        this.load.image("background", "assets/levels/extra/background.png");
        this.load.image("backgroundBackground", "assets/levels/extra/backgroundBackground.png");
        this.load.image("filtre", "assets/levels/extra/filtre.png");
        this.load.image("sky", "assets/levels/extra/sky.png");

        this.load.image("nuage1", "assets/levels/extra/nuage1.png");
        this.load.image("nuage2", "assets/levels/extra/nuage2.png");
        this.load.image("nuage3", "assets/levels/extra/nuage3.png");

        
        this.load.image("backLevel01", "assets/levels/Level_01_back.png");
        this.load.image("backLevel02", "assets/levels/Level_02_back.png");
        this.load.image("backLevel03", "assets/levels/Level_03_back.png");
        this.load.image("backLevel04", "assets/levels/Level_04_back.png");
        this.load.image("backLevel05", "assets/levels/Level_05_back.png");
        this.load.image("backLevel06", "assets/levels/Level_06_back.png");
        this.load.image("backLevel07", "assets/levels/Level_07_back.png");

        //Fronts
        this.load.image("front", "assets/testLevelPlace.png");


        this.load.image("frontLevel01", "assets/levels/Level_01_front.png");
        this.load.image("frontLevel02", "assets/levels/Level_02_front.png");
        this.load.image("frontLevel03", "assets/levels/Level_03_front.png");
        this.load.image("frontLevel04", "assets/levels/Level_04_front.png");
        this.load.image("frontLevel05", "assets/levels/Level_05_front.png");
        this.load.image("frontLevel06", "assets/levels/Level_06_front.png");
        this.load.image("frontLevel07", "assets/levels/Level_07_front.png");

        //Player
        this.load.spritesheet("idleSprite", "assets/anims/idleSprite3.png",
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
        this.load.spritesheet("falling", "assets/anims/fallingPlatform.png",
            { frameWidth: 212, frameHeight: 276 });

        
        //Music and Sound
        this.load.audio('menuTheme', 'assets/sounds/menu.mp3');
        this.load.audio('mainTheme', 'assets/sounds/mainTheme.mp3');
        this.load.audio('oiseaux', 'assets/sounds/oiseaux.mp3');
        this.load.audio('foret', 'assets/sounds/foret.mp3');
        this.load.audio('footstep', 'assets/sounds/pas.mp3');
        this.load.audio('jump', 'assets/sounds/jump.mp3');
        this.load.audio('skyglow', 'assets/sounds/skyglow.mp3');
        this.load.audio('skyglowActive', 'assets/sounds/skyglowActive.mp3');

    }

    create() {
        this.scene.start("Menu");

    }

}

export default Preload;