
class Preload extends Phaser.Scene{

    constructor(){
        super("PreloadScene");
    }
    
    preload(){
        //Tilemap
        this.load.tilemapTiledJSON("testLevelJson", "levels/testLevel.json");

        //Tileset
        this.load.image("tileset", "assets/placeholder.png");

        //Player
        
        this.load.spritesheet("tempSprite", "assets/tempSprite.png",
        {frameWidth: 512, frameHeight: 1024});
        

    }

    create(){
        this.scene.start("TestLevel",{
            skyglow : ["ground","speed","air"],
        });

    }

}

export default Preload;