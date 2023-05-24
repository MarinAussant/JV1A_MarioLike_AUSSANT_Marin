import Skyglow from "./Skyglow.js";
import collidable from "../extra/makeCollidable.js";

// Class Skyglow
class JumpSkyglow extends Skyglow {

    constructor(scene, x, y) {
        super(scene, x, y, "jumpSkyglow").setScale(0.75);
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
        this.sizeInventory = 0.3;
        this.sizeReal = 0.75;

        this.acceleration = 10;
        this.deceleration = 40;

        this.type = "jump";

        //Physique avec le monde

        this.setDepth(2);
        this.setCollideWorldBounds(true);
        
        this.setSize(128, 128);
        this.setOffset(0, 0);


    }

    initEvents() {
        //Ecoute la fonction update de la scène et appelle la fonction update de l'objet
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }


    update(time, delta) {

    }

}

export default JumpSkyglow;