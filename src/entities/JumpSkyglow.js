import Skyglow from "./Skyglow.js";
import collidable from "../extra/makeCollidable.js";

// Class Skyglow
class JumpSkyglow extends Skyglow {

    constructor(scene, x, y) {
        super(scene, x, y, "jumpSkyglow").setScale(0.3);
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
        this.skyglowLight = this.scene.lights.addLight(this.x, this.y, 150, 0x1c39ff, 1);
        this.skyglowLight.setVisible(false);
        this.setPipeline('Light2D');

        this.speed = 350;

        this.inInventory = false;
        this.sizeInventory = 0.15;
        this.sizeReal = 0.3;

        this.acceleration = 10;
        this.deceleration = 40;

        this.type = "jump";

        //Physique avec le monde

        this.setDepth(2);
        this.setCollideWorldBounds(true);
        
        this.setSize(400, 400);
        this.setOffset(80, 100);

        this.scene.anims.create({
            key: "idleJumpSkyglow",
            frames: this.scene.anims.generateFrameNumbers("jumpSkyglow", {start: 0, end: 32}),
            frameRate: 35,
            repeat: -1
        });

        this.anims.play("idleJumpSkyglow", true);


    }

    initEvents() {
        //Ecoute la fonction update de la scène et appelle la fonction update de l'objet
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }


    update(time, delta) {
        this.skyglowLight.x = this.x;
        this.skyglowLight.y = this.y;
    }

}

export default JumpSkyglow;