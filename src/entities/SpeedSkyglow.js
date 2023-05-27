import Skyglow from "./Skyglow.js";
import collidable from "../extra/makeCollidable.js";

// Class Skyglow
class SpeedSkyglow extends Skyglow {

    constructor(scene, x, y, sprite) {
        super(scene, x, y, "speedSkyglow").setScale(0.3);
        scene.add.existing(this); //Ajoute l'objet à la scène 
        scene.physics.add.existing(this); //Donne un physic body à l'objet

        //Mixins collisions
        Object.assign(this, collidable);

        this.initX = x;
        this.initY = y; 

        //Propriétés à passer de scène en scène

        this.init();
        this.initEvents();

    }

    init() {

        //Variables personnage

        this.speed = 400;

        this.inInventory = false;
        this.sizeInventory = 0.15;
        this.sizeReal = 0.3;

        this.acceleration = 10;
        this.deceleration = 40;

        this.type = "speed";

        //Physique avec le monde
       
        this.setDepth(2);
        this.setCollideWorldBounds(true);
        
        this.setSize(400, 400);
        this.setOffset(80, 100);

        this.scene.anims.create({
            key: "idleSpeedSkyglow",
            frames: this.scene.anims.generateFrameNumbers("speedSkyglow", {start: 0, end: 32}),
            frameRate: 33,
            repeat: -1
        });

        this.anims.play("idleSpeedSkyglow", true);

    }

    initEvents() {
        //Ecoute la fonction update de la scène et appelle la fonction update de l'objet
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }


    update(time, delta) {

    }

}

export default SpeedSkyglow;